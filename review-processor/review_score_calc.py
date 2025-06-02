# -*- coding: utf-8 -*-
"""
Created on Wed May 14 17:41:37 2025

NAKA PATHS YUGN IMAGES HINDI PA NAKA URLS NG S3 BAUCKET...


@author: euan_
"""
import os
import select
import psycopg2
import pandas as pd 
import torch
from transformers import pipeline
from huggingface_hub import hf_hub_download
from ultralytics import YOLO
from supervision import Detections
from PIL import Image
import numpy as np
import cv2
from psycopg2.extras import RealDictCursor
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connection string should come from env var DATABASE_URL
DB_DSN = "postgresql://eventgardedb_owner:npg_rG4Lwl7oZtTI@ep-fragrant-shape-a1boxp1j.ap-southeast-1.aws.neon.tech/eventgardedb?sslmode=require" # hindi ko na env sorry </3

# Load sentiment and emotion models
sentiment_pipe = pipeline(
    "text-classification",
    model="cardiffnlp/twitter-xlm-roberta-base-sentiment",
    top_k=None,
    return_all_scores=True
)
emotion_pipe = pipeline(
    "image-classification",
    model="dima806/facial_emotions_image_detection",
    top_k=7
)

# Load YOLO face detector
model_path = hf_hub_download(
    repo_id="arnabdhar/YOLOv8-Face-Detection",
    filename="model.pt"
)
face_model = YOLO(model_path)

# Emotion labels and base valence weights
all_labels = ['angry','disgust','fear','happy','neutral','sad','surprise']
base_valence_weights = torch.tensor([
    -1.0,    # angry
    -0.8,    # disgust
    -1.0,    # fear
     1.0,    # happy
     0.0,    # neutral
    -0.65,   # sad
     0.3     # surprise
], dtype=torch.float32)

# Event-based weight adjustments
event_adjust = {
    "Birthday":                {"happy":+0.25, "surprise":+0.20, "sad":+0.05,  "neutral":+0.05},
    "Wedding":                 {"happy":+0.30, "sad":+0.10,     "surprise":+0.10, "neutral":+0.05},
    "Anniversary":             {"happy":+0.28, "sad":+0.12,     "surprise":+0.08, "neutral":+0.05},
    "Baby Shower":             {"happy":+0.22, "surprise":+0.15, "sad":+0.05,     "neutral":+0.05},
    "Gender Reveal":           {"surprise":+0.30,"happy":+0.20,  "neutral":+0.05},
    "Engagement":              {"happy":+0.27, "surprise":+0.13, "neutral":+0.05},

    # === Professional Events ===
    "Seminar":                 {"neutral":+0.30,"fear":+0.05,    "happy":+0.10},
    "Workshop":                {"neutral":+0.28,"fear":+0.05,    "happy":+0.12},
    "Conference":              {"neutral":+0.32,"fear":+0.06,    "happy":+0.08},
    "Convention":              {"neutral":+0.30,"surprise":+0.05,"happy":+0.10},
    "Product Launch":          {"surprise":+0.25,"happy":+0.15,  "neutral":+0.05},
    "Networking":              {"happy":+0.15, "neutral":+0.20,   "surprise":+0.10},
    "Training Session":        {"neutral":+0.28,"fear":+0.05,    "happy":+0.12},
    "Certification Class":     {"neutral":+0.30,"fear":+0.05,    "happy":+0.10},

    # === Arts & Culture ===
    "Concert":                 {"surprise":+0.30,"happy":+0.20,  "fear":+0.05},
    "Live Performance":        {"surprise":+0.28,"happy":+0.22,  "neutral":+0.05},
    "Art Exhibit":             {"neutral":+0.25,"surprise":+0.10,"happy":+0.10},
    "Gallery Opening":         {"neutral":+0.25,"surprise":+0.12,"happy":+0.12},
    "Open Mic":                {"surprise":+0.20,"happy":+0.20,  "neutral":+0.05},
    "Theater/Stage Play":      {"surprise":+0.25,"neutral":+0.15, "fear":+0.05},
    "Festival/Parade":         {"surprise":+0.32,"happy":+0.18,  "neutral":+0.05},
    "Talent Show":             {"surprise":+0.28,"happy":+0.18,  "neutral":+0.05},

    # === Religious & Community ===
    "Church Service":          {"neutral":+0.20,"happy":+0.10,   "sad":+0.10},
    "Spiritual Retreat":       {"neutral":+0.25,"sad":+0.10,     "happy":+0.05},
    "Fundraiser":              {"neutral":+0.22,"happy":+0.10,   "sad":+0.08},
    "Charity Event":           {"neutral":+0.24,"happy":+0.12,   "sad":+0.08},
    "Outreach/Volunteering Drive": {"neutral":+0.22,"happy":+0.12,"sad":+0.08},
    "Religious Ceremony":      {"neutral":+0.25,"sad":+0.10,     "happy":+0.05}
}

# Adjust weights by event type
def adjust_weights_by_event(base_weights, event_type):
    adjusted = base_weights.clone()
    overrides = event_adjust.get(str(event_type), {})
    for i, lbl in enumerate(all_labels):
        if lbl in overrides:
            adjusted[i] += overrides[lbl]
    return adjusted

# Adjust weights by sentiment
def adjust_weights_by_sentiment(weights, sentiment_score):
    s = sentiment_score
    pos_idx = [all_labels.index(l) for l in ("happy","surprise")]
    neg_idx = [all_labels.index(l) for l in ("angry","disgust","fear","sad")]
    w = weights.clone()
    for i in pos_idx:
        w[i] *= (1.0 + 0.5 * max(0, s - 0.5) * 2)
    for i in neg_idx:
        w[i] *= (1.0 + 0.5 * max(0, (0.5 - s)) * 2)
    neu_i = all_labels.index("neutral")
    w[neu_i] *= (1.0 - 0.3 * abs(s - 0.5) * 2)
    return w

# Convert emotion output to tensor vector
def convert_to_vector(pipe_result, all_labels):
    vec = np.zeros(len(all_labels), dtype=float)
    for d in pipe_result:
        if d['label'] in all_labels:
            vec[all_labels.index(d['label'])] = d['score']
    return torch.tensor(vec, dtype=torch.float32)

# Final valence computation
def compute_valence_score(embedding, sentiment_score, event_type):
    weights = adjust_weights_by_event(base_valence_weights, event_type)
    weights = adjust_weights_by_sentiment(weights, sentiment_score)
    raw = torch.dot(embedding, weights)
    return ((raw + 1) / 2).clamp(0, 1).item()

# Geometric median for embeddings
def geometric_median_np(X, eps=1e-5, max_iter=500):
    X = np.asarray(X)
    y = X.mean(axis=0)
    for _ in range(max_iter):
        dist = np.linalg.norm(X - y, axis=1)
        dist = np.where(dist < eps, eps, dist)
        w = 1.0 / dist
        y_new = np.average(X, axis=0, weights=w)
        if np.linalg.norm(y - y_new) < eps:
            return y_new
        y = y_new
    return y

# Likert columns and original liking weights
likert_cols = ['communication','timeliness','professionalism','perceived_value']
orig_weights = torch.tensor([0.3, 0.1, 0.1, 0.1, 0.1, 0.3], dtype=torch.float32)

def compute_liking_score(features, has_sentiment, has_valence):
    mask = torch.tensor([
        has_sentiment,
        True, True, True, True,
        has_valence
    ], dtype=torch.bool)
    w = orig_weights.clone()
    w[~mask] = 0.0
    total = w.sum()
    if total > 0:
        w = w / total
    else:
        w = torch.ones_like(w) / len(w)
    return float((features * w).sum())

def main():
    conn = psycopg2.connect(DB_DSN)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("LISTEN new_review;")
    print("waiting for new_review notifications…")

    while True:
        if select.select([conn], [], [], 10) == ([], [], []):
            continue
        conn.poll()
        for notify in conn.notifies:
            review_id = int(notify.payload)
            print(f"📥 Got new review: {review_id}")

            # fetch the new row
            cur.execute("SELECT * FROM reviews WHERE review_id = %s", (review_id,))
            row = cur.fetchone()

            temp_df = pd.DataFrame([row])
            temp_df['images'] = temp_df['images'].replace('', np.nan)

            output_rows = []
            for idx, row in temp_df.iterrows():
                text = str(row.get('text_review','')).strip()
                if text:
                    raw = sentiment_pipe(text[:512])
                    raw = raw[0] if isinstance(raw, list) and raw else []
                    scores = {d['label'].lower(): d['score'] for d in raw}
                    pos, neg = scores.get('positive',0.0), scores.get('negative',0.0)
                    sentiment_score = (pos - neg + 1) / 2
                else:
                    sentiment_score = 0.0
            
                lik = row[likert_cols].astype(float).values
                norm_lik = (lik - 1) / 4
            
                emb = torch.zeros(len(all_labels))
                valence_score = 0.0
                event_type = row.get('event_type', 'Generic')
            
                imgs = row.get('images', '')
                face_embs = []
                if pd.notna(imgs):
                    for path in imgs.split(','):
                        path = path.strip()
                        if not os.path.exists(path): continue
                        img = cv2.imread(path)
                        if img is None: continue
                        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                        pil = Image.fromarray(img)
                        dets = face_model(pil, conf=0.3)[0]
                        parsed = Detections.from_ultralytics(dets)
                        crops = [Image.fromarray(img[int(y1):int(y2),int(x1):int(x2)])
                                 for x1,y1,x2,y2 in parsed.xyxy if img[int(y1):int(y2),int(x1):int(x2)].size]
                        if not crops: continue
                        e_results = emotion_pipe(crops)
                        vecs = [convert_to_vector(r, all_labels) for r in e_results]
                        stacked = torch.stack(vecs)
                        gm_face = geometric_median_np(stacked.cpu().numpy())
                        face_embs.append(torch.tensor(gm_face))
            
                    if face_embs:
                        all_faces = torch.stack(face_embs)
                        gm_all = geometric_median_np(all_faces.cpu().numpy())
                        emb = torch.tensor(gm_all)
                        valence_score = compute_valence_score(emb, sentiment_score, event_type)
            
                # build final features
                features = torch.tensor([
                    sentiment_score,
                    *norm_lik.tolist(),
                    valence_score
                ], dtype=torch.float32)
            
                liking_score = compute_liking_score(features, (False if sentiment_score==0 else True), (False if valence_score==0 else True))
            
                row_out = {
                    'review_id': row.get('review_id', idx),
                    'event_id': row['event_id'],
                    'liking_score': liking_score,
                    'sentiment_score': sentiment_score,
                    'valence_score': valence_score
                }
                for i, c in enumerate(likert_cols): row_out[c] = norm_lik[i]
                for i, lbl in enumerate(all_labels): row_out[f'emotion_{lbl}'] = emb[i].item()
            
                output_rows.append(row_out)

            # finally insert results into review_liking_scores
            for out in output_rows:
                cur.execute(
                    "INSERT INTO review_liking_scores"
                    " (review_id, event_id, liking_score, sentiment_score, valence_score, communication, timeliness, professionalism, perceived_value, emotion_angry, emotion_disgust, emotion_fear, emotion_happy, emotion_neutral, emotion_sad, emotion_surprise)"
                    " VALUES (%(review_id)s, %(event_id)s, %(liking_score)s, %(sentiment_score)s, %(valence_score)s,%(communication)s, %(timeliness)s, %(professionalism)s, %(perceived_value)s,%(emotion_angry)s, %(emotion_disgust)s, %(emotion_fear)s,%(emotion_happy)s, %(emotion_neutral)s, %(emotion_sad)s, %(emotion_surprise)s)"
                    " ON CONFLICT (review_id) DO NOTHING",
                    out
                )
            print(f"✅ Processed and stored review {review_id}")

if __name__ == "__main__":
    main()

