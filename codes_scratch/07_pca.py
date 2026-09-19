"""
================================================================================
07. PRINCIPAL COMPONENT ANALYSIS (PCA) FROM SCRATCH & BENCHMARK
================================================================================
Pipeline:
  1. Scratch Implementation (Blueprint & Placeholders for you to complete)
  2. Test on Toy Data (Dimensionality Reduction)
  3. Scikit-Learn Implementation
  4. Compare Results (Explained Variance Ratio, Shapes & Markdown Export)
  5. Real Dataset Evaluation (Kaggle: MNIST Digits Dataset)
================================================================================
"""

import os
import sys
from typing import Optional
import numpy as np
import pandas as pd
from sklearn.decomposition import PCA as SklearnPCA

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from codes_scratch.utils.data_loader import load_toy_dataset
from codes_scratch.utils.metrics import (
    print_section,
    print_step,
    display_comparison_table,
    save_results_to_markdown,
)


# ============================================================================
# 1. IMPLEMENT FROM SCRATCH (CLASS BLUEPRINT)
# ============================================================================
class PCAScratch:
    """
    Principal Component Analysis (PCA) from Scratch.

    Mathematical Concept:
        1. Center data: X_centered = X - mean(X, axis=0)
        2. Compute Covariance Matrix:
           Cov = (1 / (n_samples - 1)) * (X_centered.T @ X_centered)
        3. Eigendecomposition:
           eigenvalues, eigenvectors = np.linalg.eigh(Cov)
        4. Sort eigenvalues and corresponding eigenvectors in descending order.
        5. Select top `n_components` eigenvectors -> components matrix W (n_features, n_components).
        6. Projection / Transform:
           X_projected = X_centered @ W

    Explained Variance:
        explained_variance_ratio = top_eigenvalues / sum(all_eigenvalues)
    """

    def __init__(self, n_components: int = 2):
        self.n_components = n_components
        self.components: np.ndarray = None                  # Shape: (n_components, n_features)
        self.mean: np.ndarray = None                        # Shape: (n_features,)
        self.explained_variance_ratio_: np.ndarray = None   # Shape: (n_components,)

    def fit(self, X: np.ndarray) -> "PCAScratch":
        """
        Fit PCA by computing principal components and explained variance ratios.

        Args:
            X (np.ndarray): Training features of shape (n_samples, n_features).

        Returns:
            self
        """
        X = np.asarray(X, dtype=float)
        n_samples, n_features = X.shape

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # 1. Store feature means: self.mean = np.mean(X, axis=0)
        # 2. Center X: X_centered = X - self.mean
        # 3. Compute covariance matrix: Cov = np.cov(X_centered, rowvar=False)
        # 4. Compute eigenvalues and eigenvectors: np.linalg.eigh(Cov)
        # 5. Sort eigenvalues in descending order and select top self.n_components
        # 6. Store self.components and self.explained_variance_ratio_
        # --------------------------------------------------------------------

        # Static placeholder values:
        self.mean = np.zeros(n_features)
        self.components = np.zeros((self.n_components, n_features))
        self.explained_variance_ratio_ = np.zeros(self.n_components)

        return self

    def transform(self, X: np.ndarray) -> np.ndarray:
        """
        Project X onto principal component subspace.

        Args:
            X (np.ndarray): Features of shape (n_samples, n_features).

        Returns:
            np.ndarray: Projected features of shape (n_samples, n_components).
        """
        X = np.asarray(X, dtype=float)
        n_samples = X.shape[0]

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # X_centered = X - self.mean
        # return np.dot(X_centered, self.components.T)
        # --------------------------------------------------------------------

        # Static placeholder return value:
        return np.zeros((n_samples, self.n_components))

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        """Fit the model with X and apply dimensionality reduction on X."""
        return self.fit(X).transform(X)


# ============================================================================
# MAIN EXECUTION PIPELINE
# ============================================================================
def run_pca_pipeline():
    print_section("07. PRINCIPAL COMPONENT ANALYSIS (PCA) PIPELINE")

    # ------------------------------------------------------------------------
    # STEP 2: TEST ON TOY DATA (DIMENSIONALITY REDUCTION)
    # ------------------------------------------------------------------------
    print_step(2, "Train & Test Custom Model on Toy Dataset")
    X_train, X_test, _, _ = load_toy_dataset(
        target_column=None, test_size=0.2, random_state=42
    )

    n_components = 2
    print(f"Original shape -> X_train: {X_train.shape}, X_test: {X_test.shape}")
    print(f"Target dimension (n_components): {n_components}")

    # Train Scratch Model
    scratch_pca = PCAScratch(n_components=n_components)
    X_test_reduced_scratch = scratch_pca.fit_transform(X_test)

    # ------------------------------------------------------------------------
    # STEP 3: USE SKLEARN IMPLEMENTATION
    # ------------------------------------------------------------------------
    print_step(3, "Train & Test Scikit-Learn Model on Exact Same Split")
    sklearn_pca = SklearnPCA(n_components=n_components)
    X_test_reduced_sklearn = sklearn_pca.fit_transform(X_test)

    # ------------------------------------------------------------------------
    # STEP 4: COMPARE RESULTS & SAVE MARKDOWN
    # ------------------------------------------------------------------------
    print_step(4, "Compare Results & Export Markdown Report")
    scratch_var = np.sum(scratch_pca.explained_variance_ratio_)
    sklearn_var = np.sum(sklearn_pca.explained_variance_ratio_)

    scratch_metrics = {
        "PC1 Explained Variance Ratio": round(float(scratch_pca.explained_variance_ratio_[0]), 4),
        "PC2 Explained Variance Ratio": round(float(scratch_pca.explained_variance_ratio_[1]), 4),
        "Total Explained Variance": round(float(scratch_var), 4),
        "Reduced Output Shape": str(X_test_reduced_scratch.shape)
    }

    sklearn_metrics = {
        "PC1 Explained Variance Ratio": round(float(sklearn_pca.explained_variance_ratio_[0]), 4),
        "PC2 Explained Variance Ratio": round(float(sklearn_pca.explained_variance_ratio_[1]), 4),
        "Total Explained Variance": round(float(sklearn_var), 4),
        "Reduced Output Shape": str(X_test_reduced_sklearn.shape)
    }

    display_comparison_table(
        scratch_metrics,
        sklearn_metrics,
        title="Toy Dataset: PCA Variance & Dimensionality Metrics"
    )

    # Save to results/pca_{date}_{index}.md
    save_results_to_markdown(
        model_name="pca",
        scratch_metrics=scratch_metrics,
        sklearn_metrics=sklearn_metrics,
        additional_info={
            "Dataset": "toy_dataset.csv (Unsupervised)",
            "Target Components": n_components,
            "Train Samples": len(X_train),
            "Test Samples": len(X_test)
        }
    )

    # ------------------------------------------------------------------------
    # STEP 5: REAL DATASET HOOK (KAGGLE: MNIST in CSV)
    # ------------------------------------------------------------------------
    print_step(5, "Real Dataset Pipeline (Kaggle: MNIST Digits in CSV)")
    print("Kaggle Handle : oddrationale/mnist-in-csv")
    print("To download   : python data/download_kaggle_datasets.py --model pca")

    kaggle_csv_path = os.path.join("data", "kaggle_datasets", "pca", "mnist_test.csv")
    if os.path.exists(kaggle_csv_path):
        print(f"Found real dataset at: {kaggle_csv_path}")
        df_real = pd.read_csv(kaggle_csv_path)
        print("Real Dataset Sample:")
        print(df_real.head())
    else:
        print(f"Dataset not downloaded yet. Run the downloader script to test on real data.")


if __name__ == "__main__":
    run_pca_pipeline()
