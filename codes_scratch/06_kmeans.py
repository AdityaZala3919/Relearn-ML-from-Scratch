"""
================================================================================
06. k-MEANS CLUSTERING FROM SCRATCH & BENCHMARK
================================================================================
Pipeline:
  1. Scratch Implementation (Blueprint & Placeholders for you to complete)
  2. Test on Toy Data (Unsupervised Clustering)
  3. Scikit-Learn Implementation
  4. Compare Results (Inertia / WCSS, Centroids & Markdown Export)
  5. Real Dataset Evaluation (Kaggle: Mall Customer Segmentation Data)
================================================================================
"""

import os
import sys
from typing import Optional
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans as SklearnKMeans

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from codes_scratch.utils.data_loader import load_toy_dataset
from codes_scratch.utils.metrics import (
    print_section,
    print_step,
    calculate_clustering_metrics,
    display_comparison_table,
    save_results_to_markdown,
)


# ============================================================================
# 1. IMPLEMENT FROM SCRATCH (CLASS BLUEPRINT)
# ============================================================================
class KMeansScratch:
    """
    k-Means Clustering Algorithm from Scratch.

    Mathematical Concept (Lloyd's Algorithm):
        1. Initialize k cluster centroids randomly from the dataset.
        2. Assignment Step (Expectation):
           Assign each sample x_i to closest centroid:
           c_i = argmin_k || x_i - mu_k ||^2
        3. Update Step (Maximization):
           Recompute centroid locations as mean of assigned points:
           mu_k = (1 / |C_k|) * sum_{x in C_k} x
        4. Repeat until centroids converge (shift < tol) or max_iter is reached.

    Objective Function (Inertia / WCSS):
        Inertia = sum_{k=1}^K sum_{x in C_k} || x - mu_k ||^2
    """

    def __init__(
        self,
        n_clusters: int = 3,
        max_iter: int = 300,
        tol: float = 1e-4,
        random_state: Optional[int] = 42
    ):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.tol = tol
        self.random_state = random_state
        self.centroids: np.ndarray = None  # Shape: (n_clusters, n_features)
        self.labels_: np.ndarray = None    # Shape: (n_samples,)
        self.inertia_: float = 0.0

    def fit(self, X: np.ndarray) -> "KMeansScratch":
        """
        Compute k-means clustering.

        Args:
            X (np.ndarray): Training features of shape (n_samples, n_features).

        Returns:
            self
        """
        X = np.asarray(X, dtype=float)
        n_samples, n_features = X.shape

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # 1. Randomly choose k initial centroids from X
        # 2. Loop up to self.max_iter:
        #    a. Assign each point to the closest centroid
        #    b. Update centroids to the mean of assigned points
        #    c. Check if shift < self.tol (convergence)
        # 3. Store self.centroids, self.labels_, and calculate self.inertia_
        # --------------------------------------------------------------------

        # Static placeholder values:
        self.centroids = np.zeros((self.n_clusters, n_features))
        self.labels_ = np.zeros(n_samples, dtype=int)
        self.inertia_ = 0.0

        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict closest cluster for each sample in X.

        Args:
            X (np.ndarray): Test features of shape (n_samples, n_features).

        Returns:
            np.ndarray: Assigned cluster indices of shape (n_samples,).
        """
        n_samples = X.shape[0]

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # --------------------------------------------------------------------

        # Static placeholder return value:
        return np.zeros(n_samples, dtype=int)


# ============================================================================
# MAIN EXECUTION PIPELINE
# ============================================================================
def run_kmeans_pipeline():
    print_section("06. k-MEANS CLUSTERING PIPELINE")

    # ------------------------------------------------------------------------
    # STEP 2: TEST ON TOY DATA (UNSUPERVISED)
    # ------------------------------------------------------------------------
    print_step(2, "Train & Test Custom Model on Toy Dataset")
    X_train, X_test, _, _ = load_toy_dataset(
        target_column=None, test_size=0.2, random_state=42
    )

    k = 3
    print(f"Dataset shape -> X_train: {X_train.shape}, X_test: {X_test.shape}")
    print(f"Clusters (k): {k}")

    # Train Scratch Model
    scratch_model = KMeansScratch(n_clusters=k, random_state=42)
    scratch_model.fit(X_train)
    labels_scratch = scratch_model.predict(X_test)

    scratch_metrics = calculate_clustering_metrics(
        X_test, labels_scratch, scratch_model.centroids
    )

    # ------------------------------------------------------------------------
    # STEP 3: USE SKLEARN IMPLEMENTATION
    # ------------------------------------------------------------------------
    print_step(3, "Train & Test Scikit-Learn Model on Exact Same Split")
    sklearn_model = SklearnKMeans(n_clusters=k, n_init=10, random_state=42)
    sklearn_model.fit(X_train)
    labels_sklearn = sklearn_model.predict(X_test)

    sklearn_metrics = calculate_clustering_metrics(
        X_test, labels_sklearn, sklearn_model.cluster_centers_
    )

    # ------------------------------------------------------------------------
    # STEP 4: COMPARE RESULTS & SAVE MARKDOWN
    # ------------------------------------------------------------------------
    print_step(4, "Compare Results & Export Markdown Report")
    display_comparison_table(
        scratch_metrics,
        sklearn_metrics,
        title="Toy Dataset: k-Means Clustering Metrics"
    )

    # Save to results/kmeans_{date}_{index}.md
    save_results_to_markdown(
        model_name="kmeans",
        scratch_metrics=scratch_metrics,
        sklearn_metrics=sklearn_metrics,
        additional_info={
            "Dataset": "toy_dataset.csv (Unsupervised)",
            "Clusters (k)": k,
            "Train Samples": len(X_train),
            "Test Samples": len(X_test)
        }
    )

    # ------------------------------------------------------------------------
    # STEP 5: REAL DATASET HOOK (KAGGLE: Mall Customer Segmentation)
    # ------------------------------------------------------------------------
    print_step(5, "Real Dataset Pipeline (Kaggle: Mall Customer Segmentation)")
    print("Kaggle Handle : vjchoudhary7/customer-segmentation-tutorial-in-python")
    print("To download   : python data/download_kaggle_datasets.py --model kmeans")

    kaggle_csv_path = os.path.join("data", "kaggle_datasets", "kmeans", "Mall_Customers.csv")
    if os.path.exists(kaggle_csv_path):
        print(f"Found real dataset at: {kaggle_csv_path}")
        df_real = pd.read_csv(kaggle_csv_path)
        print("Real Dataset Sample:")
        print(df_real.head())
    else:
        print(f"Dataset not downloaded yet. Run the downloader script to test on real data.")


if __name__ == "__main__":
    run_kmeans_pipeline()
