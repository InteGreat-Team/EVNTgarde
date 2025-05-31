# -*- coding: utf-8 -*-
"""
Created on Mon May  5 06:20:36 2025
// CURRENTLY DOES NOT USE VENDORID BECAUSE VENDOR ID IS MISSING SA EVENTS kase multiple, now, pwede to magawa pa rin with a new in between function, as well 
as pwde rin maglagay pa ng ibang relational features from other tables. IN THE FUTURE
@author: euan_
"""
def train_event_liking_model(csv_path):
    import pandas as pd
    import numpy as np
    from sklearn.model_selection import train_test_split, cross_val_score
    from sklearn.compose import ColumnTransformer
    from sklearn.pipeline import Pipeline
    from sklearn.preprocessing import OneHotEncoder, StandardScaler
    from xgboost import XGBRegressor
    from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
    from math import sqrt
    import shap
    import matplotlib.pyplot as plt
    import joblib
    from skopt import BayesSearchCV
    from skopt.space import Real, Integer

    def winsorize_series(s, lower=0.05, upper=0.95):
        q_low, q_high = s.quantile([lower, upper])
        return s.clip(lower=q_low, upper=q_high)

    df = pd.read_csv(csv_path)

    df = df.dropna(subset=[
        "liking_score", "event_type_id", "organizer_id", 
        #"vendor_id", 
        "venue_id",
        "budget", "start_datetime", "end_datetime", "guests"
    ])

    df["start_datetime"] = pd.to_datetime(df["start_datetime"])
    df["end_datetime"] = pd.to_datetime(df["end_datetime"])
    
    df["scheduled_duration_hrs"] = (df["end_datetime"] - df["start_datetime"]).dt.total_seconds() / 3600

    for col in ["budget", "scheduled_duration_hrs"]:
        df[col] = winsorize_series(df[col])

    df["cost_per_hour"] = df["budget"] / df["scheduled_duration_hrs"]
    df["is_large_budget"] = (df["budget"] > df["budget"].quantile(0.7)).astype(int)
    df["is_long_event"] = (df["scheduled_duration_hrs"] > 6).astype(int)

    df["month"] = df["start_datetime"].dt.month
    df["day_of_week"] = df["start_datetime"].dt.dayofweek
    df["is_weekday"] = (df["day_of_week"] < 5).astype(int)
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

    df["budget_weekend_interaction"] = df["budget"] * df["is_weekend"]
    df["type_weekend_interaction"] = df["event_type_id"].astype(str) + "_" + df["is_weekend"].astype(str)

    evt_counts = df["event_type_id"].value_counts()
    rare_types = evt_counts[evt_counts < 50].index
    df["event_type_grouped"] = df["event_type_id"].where(~df["event_type_id"].isin(rare_types), "Other")

    target_column = "liking_score"
    numeric_features = [
        "budget", "scheduled_duration_hrs",
        "cost_per_hour", "is_large_budget", "is_long_event",
        "budget_weekend_interaction", "guests"
    ]
    categorical_features = [
        "event_type_grouped", "venue_id", "is_weekend", "month", "day_of_week",
        "is_weekday", "type_weekend_interaction", "organizer_id", 
        # "vendor_id"
    ]

    X = df[numeric_features + categorical_features]
    y = df[target_column]

    num_tf = StandardScaler()
    cat_tf = OneHotEncoder(handle_unknown="ignore", sparse_output=False)

    preprocessor = ColumnTransformer([
        ("num", num_tf, numeric_features),
        ("cat", cat_tf, categorical_features)
    ])

    xgb = XGBRegressor(objective="reg:squarederror", random_state=0)
    pipe = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", xgb)
    ])

    param_space = {
        "regressor__n_estimators": Integer(50, 500),  
        "regressor__max_depth": Integer(3, 10),
        "regressor__learning_rate": Real(0.01, 0.3, prior="log-uniform"), 
        "regressor__subsample": Real(0.5, 1.0),  
        "regressor__colsample_bytree": Real(0.5, 1.0), 
        "regressor__gamma": Real(0, 0.5)  
    }

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    search = BayesSearchCV(
        pipe, param_space, n_iter=60, cv=10,
        scoring="r2", verbose=1, n_jobs=-1, random_state=42
    )
    search.fit(X_train, y_train)

    print("\nBest parameters:", search.best_params_)
    print("Best CV R²:", search.best_score_)
    ts = cross_val_score(search.best_estimator_, X_train, y_train, cv=10, scoring="r2")
    print("Train  R² (μ±σ):", ts.mean(), "±", ts.std())

    y_pred = search.predict(X_test)
    print("Test   R²:", r2_score(y_test, y_pred))
    print("Test  RMSE:", sqrt(mean_squared_error(y_test, y_pred)))
    print("Test  MAE:", mean_absolute_error(y_test, y_pred))

    with open("model_evaluation_results.txt", "w") as f:
        f.write(f"Best parameters: {search.best_params_}\n")
        f.write(f"Best CV R²: {search.best_score_}\n")
        f.write(f"Train R² (mean±std): {ts.mean()} ± {ts.std()}\n")
        f.write(f"Test R²: {r2_score(y_test, y_pred)}\n")
        f.write(f"Test RMSE: {sqrt(mean_squared_error(y_test, y_pred))}\n")
        f.write(f"Test MAE: {mean_absolute_error(y_test, y_pred)}\n")

    best_pipe = search.best_estimator_
    prep = best_pipe.named_steps["preprocessor"]
    model = best_pipe.named_steps["regressor"]
    X_test_trans = prep.transform(X_test)

    cat_names = prep.named_transformers_["cat"].get_feature_names_out(categorical_features)
    feature_names = numeric_features + list(cat_names)

    explainer = shap.Explainer(model, X_test_trans, feature_names=feature_names)
    sv = explainer(X_test_trans)
    shap.summary_plot(sv, features=X_test_trans, feature_names=feature_names)
    plt.savefig("shap_summary_plot.png")

    shap_values = np.abs(sv.values).mean(axis=0)
    feature_importance = pd.Series(shap_values, index=feature_names).sort_values(ascending=False)
    print("\nTop SHAP Features:")
    print(feature_importance.head(10))
    
    joblib.dump(search.best_estimator_, "xgboost_model.pkl")

def predict_row(new_data):
    import joblib
    import pandas as pd
    import numpy as np  # 
    import shap
    import matplotlib.pyplot as plt

    best_pipe = joblib.load("xgboost_model.pkl")
    
    prep = best_pipe.named_steps["preprocessor"]
    model = best_pipe.named_steps["regressor"]
    
    new_data["scheduled_duration_hrs"] = (new_data["end_datetime"] - new_data["start_datetime"]).dt.total_seconds() / 3600
    new_data["cost_per_hour"] = new_data["budget"] / new_data["scheduled_duration_hrs"]
    new_data["is_large_budget"] = (new_data["budget"] > new_data["budget"].quantile(0.8)).astype(int)
    new_data["is_long_event"] = (new_data["scheduled_duration_hrs"] > 6).astype(int)
    
    new_data["month"] = pd.to_datetime(new_data["start_datetime"]).dt.month
    new_data["day_of_week"] = pd.to_datetime(new_data["start_datetime"]).dt.dayofweek
    new_data["is_weekday"] = (new_data["day_of_week"] < 5).astype(int)
    
    new_data["budget_weekend_interaction"] = new_data["budget"] * new_data["is_weekend"]
    new_data["type_weekend_interaction"] = new_data["event_type_grouped"] + "_" + new_data["is_weekend"].astype(str)

    new_data["log_event_budget"] = np.log1p(new_data["budget"])
    new_data["log_duration"] = np.log1p(new_data["scheduled_duration_hrs"])
    
    numeric_features = [
         "budget", "scheduled_duration_hrs",
         "cost_per_hour", "is_large_budget", "is_long_event",
         "budget_weekend_interaction", "guests"
     ]
    categorical_features = [
         "event_type_grouped", "venue_id", "is_weekend", "month", "day_of_week",
         "is_weekday", "type_weekend_interaction", "organizer_id", #"vendor_id"
     ]
    
    transformed_input = new_data[numeric_features + categorical_features]
    new_data_transformed = prep.transform(transformed_input)
    
    cat_names = prep.named_transformers_["cat"].get_feature_names_out(categorical_features)
    feature_names = numeric_features + list(cat_names)
    
    prediction = model.predict(new_data_transformed)
    print("Predicted Liking Score:", prediction[0])
    
    explainer = shap.Explainer(model, new_data_transformed, feature_names=feature_names)
    shap_values = explainer(new_data_transformed)
    
    shap.summary_plot(shap_values, features=new_data_transformed, feature_names=feature_names)
    
    return prediction[0]

def insert_data(
    event_id,
    event_name,
    event_type_id,
    event_desc,
    venue_id,
    organizer_id,
    #vendor_id,
    customer_id,
    event_status,
    start_date,
    end_date,
    guests,
    attire,
    budget,
    start_datetime,
    end_datetime,
    liking_score=None,
    csv_path="realistic_event_scores.csv",
    counter_path="insert_count.txt",
):
    import pandas as pd
    import csv
    import os

    # Convert date/time strings to proper datetime/dates
    if isinstance(start_datetime, str):
        start_datetime = pd.to_datetime(start_datetime)
    if isinstance(end_datetime, str):
        end_datetime = pd.to_datetime(end_datetime)
    if isinstance(start_date, str):
        start_date = pd.to_datetime(start_date).date()
    if isinstance(end_date, str):
        end_date = pd.to_datetime(end_date).date()

    # Compute duration if not explicitly provided
    scheduled_duration_hrs = (end_datetime - start_datetime).total_seconds() / 3600

    # Prepare row for prediction
    new_data_for_pred = pd.DataFrame([{
        "budget": budget,
        "scheduled_duration_hrs": scheduled_duration_hrs,
        "event_type_grouped": str(event_type_id),
        "venue_id": venue_id,
        "organizer_id": organizer_id,
        #"vendor_id": vendor_id,
        "guests": guests,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime
    }])

    # Add derived features
    new_data_for_pred["is_weekend"] = (start_datetime.weekday() >= 5)
    new_data_for_pred["month"] = start_datetime.month
    new_data_for_pred["day_of_week"] = start_datetime.weekday()
    new_data_for_pred["is_weekday"] = (start_datetime.weekday() < 5)
    new_data_for_pred["type_weekend_interaction"] = (
        new_data_for_pred["event_type_grouped"].astype(str) + "_" + new_data_for_pred["is_weekend"].astype(str)
    )

    # Predict if liking_score is None
    if liking_score is None:
        liking_score = predict_row(new_data_for_pred)

    # Prepare final row to insert
    row_to_insert = {
        "event_id": event_id,
        "event_name": event_name,
        "event_type_id": event_type_id,
        "event_desc": event_desc,
        "venue_id": venue_id,
        "organizer_id": organizer_id,
        #"vendor_id": vendor_id,
        "customer_id": customer_id,
        "event_status": event_status,
        "start_date": start_date,
        "end_date": end_date,
        "guests": guests,
        "attire": attire,
        "budget": budget,
        "liking_score": liking_score,
        "start_datetime": start_datetime,
        "end_datetime": end_datetime
    }

    # Write to CSV
    file_exists = os.path.isfile(csv_path)
    with open(csv_path, mode="a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(row_to_insert.keys()))
        if not file_exists:
            writer.writeheader()
        writer.writerow(row_to_insert)

    # Update counter
    if os.path.exists(counter_path):
        with open(counter_path, "r") as f:
            count = int(f.read().strip())
    else:
        count = 0

    count += 1
    with open(counter_path, "w") as f:
        f.write(str(count))

    if count >= 10:
        print("Threshold reached (10 insertions). Retraining model...")
        train_event_liking_model(csv_path)
        with open(counter_path, "w") as f:
            f.write("0")  # Reset counter

#insert_data(
#    event_id=1,
#    event_name="Anna & Mark's Wedding",
#    event_type_id=3,
#    event_desc="Summer wedding ceremony",
#    venue_id=5,
#    organizer_id=1,
#    vendor_id=1,
#    customer_id=5001,
#    event_status="Confirmed",
#    start_date="2025-06-15",              # YYYY-MM-DD (date)
#    end_date="2025-06-15",                # YYYY-MM-DD (date)
#    guests=150,
#    attire="Black Tie",
#    budget=20000,
#    liking_score=None,                     # will be predicted inside insert_data
#    start_datetime="2025-06-15 14:00:00", # YYYY-MM-DD HH:MM:SS (datetime)
#    end_datetime="2025-06-15 20:00:00",   # YYYY-MM-DD HH:MM:SS (datetime)
#    csv_path="synthetic_events.csv",
#    counter_path="insert_count.txt",
#)
