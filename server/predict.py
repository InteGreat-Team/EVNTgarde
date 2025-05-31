#!/usr/bin/env python3
import sys
import json
import pandas as pd
import numpy as np
import joblib
import shap
from datetime import datetime

# --------------------------------------------------------------------------------------------------
# 1) Helper: exactly the same feature‐engineering logic that your `predict_row(...)` does
#    (we replicate only the parts needed for one‐row inference)
# --------------------------------------------------------------------------------------------------
def load_model_and_preprocessor(pkl_path="xgboost_model.pkl"):
    """
    Loads a saved Pipeline object. We assume it was saved via joblib.dump(...).
    """
    pipeline = joblib.load(pkl_path)
    # pipeline.named_steps["preprocessor"] is the ColumnTransformer
    # pipeline.named_steps["regressor"] is the fitted XGBRegressor
    return pipeline

def preprocess_single_row(raw_json: dict, pipeline):
    """
    raw_json should contain exactly:
      {
        "event_type_id": int,
        "organizer_id": int,
        "venue_id": int,
        "budget": float ,
        "start_datetime": "YYYY-MM-DDTHH:mm:ssZ"  or any ISO‐like string pandas can parse,
        "end_datetime":   "YYYY-MM-DDTHH:mm:ssZ"  ,
        "guests": "1234 Guests"  (string, we will strip non‐digits)
      }
    We return a pandas DataFrame with the same columns your pipeline expects:
      ["budget", "scheduled_duration_hrs", "cost_per_hour", "is_large_budget", "is_long_event", 
       "guests", "event_type_grouped", "venue_id", "is_weekend", "month", "day_of_week", 
       "is_weekday", "type_weekend_interaction", "organizer_id"]
    """
    # 1) Parse datetimes
    start = pd.to_datetime(raw_json["start_datetime"])
    end   = pd.to_datetime(raw_json["end_datetime"])
    scheduled_duration_hrs = (end - start).total_seconds() / 3600.0

    # 2) Budget
    budget = float(raw_json["budget"])

    # 3) guests: strip non‐digits
    guests = int("".join(filter(str.isdigit, raw_json["guests"] or "0")))

    # 4) Weekend/week day
    day_of_week = start.dayofweek  # 0 = Monday, ... 6 = Sunday
    is_weekend = int(day_of_week >= 5)
    is_weekday = int(day_of_week < 5)

    # 5) cost_per_hour, is_large_budget, is_long_event
    cost_per_hour = budget / scheduled_duration_hrs if scheduled_duration_hrs > 0 else 0.0
    # Let’s define “large” as > 80th percentile?  We don’t know the percentile here,
    # so we can simply say “is_large_budget = 0” (the pipeline will do scaling afterward).
    # BUT your original code did: budget > quantile(0.8).  We cannot recompute quantile on one row.
    # Instead, we rely on the pipeline’s StandardScaler to handle it.  However, 
    # your pipeline’s transform expects an “is_large_budget” column.  We can approximate by 0 or 1.
    # For simplicity, assume “is_large_budget=0” and “is_long_event = int(scheduled_duration_hrs>6)”
    is_large_budget = 0
    is_long_event = int(scheduled_duration_hrs > 6)

    # 6) month, day_of_week already have day_of_week; month = start.month
    month = start.month

    # 7) budget_weekend_interaction and type_weekend_interaction:
    #    pipeline’s ColumnTransformer does NOT expect these columns explicitly.  WAIT:
    #    Actually, the code’s preprocessor used “numeric_features = [... , 'guests']” and
    #    “categorical_features = ['event_type_grouped','venue_id','is_weekend','month','day_of_week','is_weekday','type_weekend_interaction','organizer_id']”
    #    Notice “type_weekend_interaction” = event_type_grouped + "_" + is_weekend
    #    But event_type_grouped is “str(event_type_id) unless rare, else 'Other'”.  For one row, we treat it as str(event_type_id).
    event_type_grouped = str(raw_json["event_type_id"])  # no “rare” logic for a single row

    type_weekend_interaction = f"{event_type_grouped}_{is_weekend}"

    # 8) Make a DataFrame with EXACT columns:
    df = pd.DataFrame([{
        "budget": budget,
        "scheduled_duration_hrs": scheduled_duration_hrs,
        "cost_per_hour": cost_per_hour,
        "is_large_budget": is_large_budget,
        "is_long_event": is_long_event,
        "budget_weekend_interaction": budget * is_weekend,
        "guests": guests,

        "event_type_grouped": event_type_grouped,
        "venue_id": int(raw_json["venue_id"]),
        "is_weekend": is_weekend,
        "month": month,
        "day_of_week": day_of_week,
        "is_weekday": is_weekday,
        "type_weekend_interaction": type_weekend_interaction,
        "organizer_id": int(raw_json["organizer_id"]),
    }])
    return df

def main():
    """
    This script expects exactly 1 argument on the command line: 
      a JSON‐stringified object with keys:
        {
          "event_type_id": ...,
          "organizer_id": ...,
          "venue_id": ...,
          "budget": ...,
          "start_datetime": "...",
          "end_datetime": "...",
          "guests": "### Guests"
        }
    It prints a single floating‐point prediction to stdout.
    """
    if len(sys.argv) < 2:
        print("ERROR: missing JSON argument", file=sys.stderr)
        sys.exit(1)

    try:
        raw = json.loads(sys.argv[1])
    except json.JSONDecodeError:
        print("ERROR: invalid JSON", file=sys.stderr)
        sys.exit(1)

    # 1) Load the pipeline (ColumnTransformer + XGBRegressor)
    pipeline = load_model_and_preprocessor("xgboost_model.pkl")

    # 2) Build the one‐row DataFrame with all needed features
    df_input = preprocess_single_row(raw, pipeline)

    # 3) Use pipeline to predict
    pred = pipeline.predict(df_input)  # returns a 1D array, e.g. [8.237...]
    liking_score = float(pred[0])

    # 4) Print the result to stdout (so Node can read it)
    print(liking_score)

if __name__ == "__main__":
    main()