import pandas as pd
from pathlib import Path
from joblib import dump
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

DATA_PATH = Path("data/benchmark-results-extended.csv")
MODEL_PATH = Path("model/index_strategy_model.pkl")

FEATURES = [
    "queryKey",
    "strategyKey",
    "stage",
    "hasSortStage",
    "isCoveredQuery",
    "avgDocsExamined",
    "avgKeysExamined",
    "avgReturned",
    "docsExaminedPerReturned",
    "keysExaminedPerReturned",
    "indexSizeMB",
]
TARGET = "avgExecutionTimeMillis"


def main():
    if not DATA_PATH.exists():
        raise SystemExit(f"Missing {DATA_PATH}. Export matrix benchmark CSV first.")
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=[TARGET])
    if len(df) < 5:
        raise SystemExit("Need more benchmark rows to train a useful model.")
    categorical = ["queryKey", "strategyKey", "stage", "hasSortStage", "isCoveredQuery"]
    numeric = [item for item in FEATURES if item not in categorical]
    preprocessor = ColumnTransformer([
        ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
        ("num", "passthrough", numeric),
    ])
    model = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", RandomForestRegressor(n_estimators=100, random_state=42)),
    ])
    model.fit(df[FEATURES], df[TARGET])
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    dump(model, MODEL_PATH)
    print(f"Saved model to {MODEL_PATH}")


if __name__ == "__main__":
    main()
