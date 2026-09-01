"""
JSON to CSV Dataset Converter

This script reads a JSON dataset structure (containing metadata and a 'data' record list)
and converts it into a clean, tabular CSV format for model training and benchmarking.
"""

import json
import os
import pandas as pd


def convert_json_to_csv(json_path: str = "data/toy_dataset.json", csv_path: str = "data/toy_dataset.csv") -> pd.DataFrame:
    """
    Convert structured JSON toy dataset into a CSV file.

    Args:
        json_path: Path to input JSON file.
        csv_path: Path to output CSV file.

    Returns:
        pd.DataFrame: Converted DataFrame.
    """
    if not os.path.exists(json_path):
        raise FileNotFoundError(f"Input JSON file not found at: {json_path}")

    with open(json_path, "r", encoding="utf-8") as f:
        content = json.load(f)

    if isinstance(content, dict) and "data" in content:
        records = content["data"]
        metadata = content.get("metadata", {})
    elif isinstance(content, list):
        records = content
        metadata = {}
    else:
        raise ValueError("Invalid JSON format. Expected list of records or dict with 'data' key.")

    df = pd.DataFrame(records)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(csv_path), exist_ok=True)
    df.to_csv(csv_path, index=False)
    
    print("=" * 60)
    print("JSON TO CSV CONVERSION SUMMARY")
    print("=" * 60)
    if metadata:
        print(f"Dataset Name : {metadata.get('name', 'N/A')}")
        print(f"Description  : {metadata.get('description', 'N/A')}")
    print(f"Source JSON  : {json_path}")
    print(f"Output CSV   : {csv_path}")
    print(f"Total Rows   : {len(df)}")
    print(f"Columns      : {list(df.columns)}")
    print("-" * 60)
    print("First 5 rows:")
    print(df.head())
    print("=" * 60)
    
    return df


if __name__ == "__main__":
    current_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(current_dir, ".."))
    
    default_json = os.path.join(project_root, "data", "toy_dataset.json")
    default_csv = os.path.join(project_root, "data", "toy_dataset.csv")
    
    convert_json_to_csv(default_json, default_csv)
