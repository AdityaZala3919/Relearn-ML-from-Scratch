"""
================================================================================
03. k-NEAREST NEIGHBORS (k-NN) FROM SCRATCH & BENCHMARK
================================================================================
Pipeline:
  1. Scratch Implementation (Blueprint & Placeholders for you to complete)
  2. Test on Toy Data (Multiclass Classification)
  3. Scikit-Learn Implementation
  4. Compare Results (Accuracy, Precision, Recall, F1 & Markdown Export)
  5. Real Dataset Evaluation (Kaggle: Breast Cancer Wisconsin Diagnostic)
================================================================================
"""

import os
import sys
from typing import Literal
import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier as SklearnKNN

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils.data_loader import load_toy_dataset
from utils.metrics import (
    print_section,
    print_step,
    calculate_classification_metrics,
    display_comparison_table,
    save_results_to_markdown,
)


# ============================================================================
# 1. IMPLEMENT FROM SCRATCH (CLASS BLUEPRINT)
# ============================================================================
class KNNScratch:
    """
    k-Nearest Neighbors Classifier from Scratch.

    Mathematical Concept:
        1. Non-parametric, instance-based lazy learner.
        2. Distance Metrics:
           - Euclidean: d(p, q) = sqrt(sum((p_i - q_i)^2))
           - Manhattan: d(p, q) = sum(|p_i - q_i|)
        3. For a query point x:
           - Compute distance to all training samples.
           - Identify the k samples with shortest distances.
           - Class label = majority vote (mode) among the k neighbors.
    """

    def __init__(self, k: int = 3, distance_metric: Literal["euclidean", "manhattan"] = "euclidean"):
        self.k = k
        self.distance_metric = distance_metric
        self.X_train: np.ndarray = None  # Shape: (n_samples, n_features)
        self.y_train: np.ndarray = None  # Shape: (n_samples,)

    def fit(self, X: np.ndarray, y: np.ndarray) -> "KNNScratch":
        """
        Store training data (lazy learner).

        Args:
            X (np.ndarray): Training features of shape (n_samples, n_features).
            y (np.ndarray): Training labels of shape (n_samples,).

        Returns:
            self
        """
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # Store self.X_train and self.y_train
        # --------------------------------------------------------------------
        self.X_train = np.asarray(X, dtype=float)
        self.y_train = np.asarray(y)
        return self

    def _compute_distance(self, x1: np.ndarray, x2: np.ndarray) -> float:
        """
        Compute distance between two 1D feature vectors.
        """
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # Euclidean: np.sqrt(np.sum((x1 - x2) ** 2))
        # Manhattan: np.sum(np.abs(x1 - x2))
        # --------------------------------------------------------------------
        return 0.0

    def _predict_single(self, x: np.ndarray) -> int:
        """
        Predict class label for a single query sample.
        """
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # 1. Calculate distances from x to all points in self.X_train
        # 2. Get indices of the k smallest distances (e.g. np.argsort(distances)[:self.k])
        # 3. Retrieve labels of these k nearest neighbors
        # 4. Return majority vote (most common class label)
        # --------------------------------------------------------------------
        return 0

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict class labels for multiple query samples.

        Args:
            X (np.ndarray): Test features of shape (n_samples, n_features).

        Returns:
            np.ndarray: Predicted class labels of shape (n_samples,).
        """
        n_samples = X.shape[0]

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # Call self._predict_single for each sample in X
        # --------------------------------------------------------------------

        # Static placeholder return value:
        return np.zeros(n_samples, dtype=int)


# ============================================================================
# MAIN EXECUTION PIPELINE
# ============================================================================
def run_knn_pipeline():
    print_section("03. k-NEAREST NEIGHBORS (k-NN) PIPELINE")

    # ------------------------------------------------------------------------
    # STEP 2: TEST ON TOY DATA (MULTICLASS TARGET)
    # ------------------------------------------------------------------------
    print_step(2, "Train & Test Custom Model on Toy Dataset")
    X_train, X_test, y_train, y_test = load_toy_dataset(
        target_column="target_multiclass", test_size=0.25, random_state=42
    )

    k = 3
    print(f"Dataset shape -> X_train: {X_train.shape}, X_test: {X_test.shape}")
    print(f"Number of classes: {len(np.unique(y_train))}, k-Neighbors: {k}")

    # Train Scratch Model
    scratch_model = KNNScratch(k=k, distance_metric="euclidean")
    scratch_model.fit(X_train, y_train)
    y_pred_scratch = scratch_model.predict(X_test)

    scratch_metrics = calculate_classification_metrics(y_test, y_pred_scratch)

    # ------------------------------------------------------------------------
    # STEP 3: USE SKLEARN IMPLEMENTATION
    # ------------------------------------------------------------------------
    print_step(3, "Train & Test Scikit-Learn Model on Exact Same Split")
    sklearn_model = SklearnKNN(n_neighbors=k, metric="euclidean")
    sklearn_model.fit(X_train, y_train)
    y_pred_sklearn = sklearn_model.predict(X_test)

    sklearn_metrics = calculate_classification_metrics(y_test, y_pred_sklearn)

    # ------------------------------------------------------------------------
    # STEP 4: COMPARE RESULTS & SAVE MARKDOWN
    # ------------------------------------------------------------------------
    print_step(4, "Compare Results & Export Markdown Report")
    display_comparison_table(
        scratch_metrics,
        sklearn_metrics,
        title="Toy Dataset: k-NN Classification Metrics"
    )

    # Save to results/knn_{date}_{index}.md
    save_results_to_markdown(
        model_name="knn",
        scratch_metrics=scratch_metrics,
        sklearn_metrics=sklearn_metrics,
        additional_info={
            "Dataset": "toy_dataset.csv (target_multiclass)",
            "k Neighbors": k,
            "Distance Metric": "euclidean",
            "Train Samples": len(X_train),
            "Test Samples": len(X_test)
        }
    )

    # ------------------------------------------------------------------------
    # STEP 5: REAL DATASET HOOK (KAGGLE: Breast Cancer Wisconsin)
    # ------------------------------------------------------------------------
    print_step(5, "Real Dataset Pipeline (Kaggle: Breast Cancer Diagnostic)")
    print("Kaggle Handle : uciml/breast-cancer-wisconsin-data")
    print("To download   : python data/download_kaggle_datasets.py --model knn")

    kaggle_csv_path = os.path.join("data", "kaggle_datasets", "knn", "data.csv")
    if os.path.exists(kaggle_csv_path):
        print(f"Found real dataset at: {kaggle_csv_path}")
        df_real = pd.read_csv(kaggle_csv_path)
        print("Real Dataset Sample:")
        print(df_real.head())
    else:
        print(f"Dataset not downloaded yet. Run the downloader script to test on real data.")


if __name__ == "__main__":
    run_knn_pipeline()
