import json
import sys
from pathlib import Path
from joblib import load
import pandas as pd

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


def main():
    if not MODEL_PATH.exists():
        raise SystemExit("Model not found. Run train_model.py first.")
    payload = json.loads(sys.stdin.read())
    model = load(MODEL_PATH)
    df = pd.DataFrame([payload], columns=FEATURES)
    prediction = float(model.predict(df)[0])
    print(json.dumps({"predictedExecutionTimeMillis": round(prediction, 3)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
