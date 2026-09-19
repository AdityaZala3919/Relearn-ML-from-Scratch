"""
Data Loading & Splitting Utilities

Standardized dataset loaders for the toy dataset and Kaggle datasets.
"""

import os
from typing import Tuple, List, Optional
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split


def get_project_root() -> str:
    """Return the absolute path to the project root directory."""
    current = os.path.dirname(os.path.abspath(__file__))
    return os.path.abspath(os.path.join(current, ".."))


def load_toy_dataset(
    target_column: Optional[str] = "target_regression",
    feature_columns: Optional[List[str]] = None,
    test_size: float = 0.2,
    random_state: int = 42
) -> Tuple[np.ndarray, np.ndarray, Optional[np.ndarray], Optional[np.ndarray]]:
    """
    Load the unified multi-task toy dataset (CSV).

    Args:
        target_column: Name of target column (e.g., 'target_regression', 'target_binary', 'target_multiclass')
                       If None, returns X_train, X_test (useful for unsupervised tasks).
        feature_columns: Specific feature column names to select. Defaults to ['feature_1', 'feature_2', 'feature_3', 'feature_4'].
        test_size: Proportion of dataset to include in the test split.
        random_state: Seed for reproducibility.

    Returns:
        If target_column is provided:
            (X_train, X_test, y_train, y_test)
        If target_column is None:
            (X_train, X_test, None, None)
    """
    project_root = get_project_root()
    csv_path = os.path.join(project_root, "data", "toy_dataset.csv")

    if not os.path.exists(csv_path):
        json_path = os.path.join(project_root, "data", "toy_dataset.json")
        if os.path.exists(json_path):
            from codes_scratch.data.convert_json_to_csv import convert_json_to_csv
            convert_json_to_csv(json_path, csv_path)
        else:
            raise FileNotFoundError(f"Neither toy_dataset.csv nor toy_dataset.json found in {os.path.dirname(csv_path)}")

    df = pd.read_csv(csv_path)

    if feature_columns is None:
        feature_columns = ["feature_1", "feature_2", "feature_3", "feature_4"]

    X = df[feature_columns].to_numpy(dtype=float)

    if target_column is not None:
        if target_column not in df.columns:
            raise ValueError(f"Target column '{target_column}' not found. Available: {list(df.columns)}")
        y = df[target_column].to_numpy()
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=test_size, random_state=random_state
        )
        return X_train, X_test, y_train, y_test
    else:
        X_train, X_test = train_test_split(
            X, test_size=test_size, random_state=random_state
        )
        return X_train, X_test, None, None
