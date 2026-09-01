"""
================================================================================
04. GAUSSIAN NAIVE BAYES FROM SCRATCH & BENCHMARK
================================================================================
Pipeline:
  1. Scratch Implementation (Blueprint & Placeholders for you to complete)
  2. Test on Toy Data (Multiclass Classification)
  3. Scikit-Learn Implementation
  4. Compare Results (Accuracy, Precision, Recall, F1 & Markdown Export)
  5. Real Dataset Evaluation (Kaggle: Wine Quality Dataset)
================================================================================
"""

import os
import sys
from typing import Dict
import numpy as np
import pandas as pd
from sklearn.naive_bayes import GaussianNB as SklearnGaussianNB

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
class GaussianNaiveBayesScratch:
    """
    Gaussian Naive Bayes Classifier from Scratch.

    Mathematical Model (Bayes' Theorem with Conditional Independence):
        P(y | x) = (P(y) * prod(P(x_i | y))) / P(x)
        y_pred = argmax_y [ log(P(y)) + sum(log(P(x_i | y))) ]

    Gaussian Likelihood Probability Density Function (PDF):
        P(x_i | y) = (1 / sqrt(2 * pi * var_y_i)) * exp( - (x_i - mean_y_i)^2 / (2 * var_y_i) )
    """

    def __init__(self, var_smoothing: float = 1e-9):
        self.var_smoothing = var_smoothing
        self.classes: np.ndarray = None       # Unique class labels
        self.mean: Dict[int, np.ndarray] = {}  # Mean of each feature per class
        self.var: Dict[int, np.ndarray] = {}   # Variance of each feature per class
        self.priors: Dict[int, float] = {}     # Prior probability P(y) per class

    def fit(self, X: np.ndarray, y: np.ndarray) -> "GaussianNaiveBayesScratch":
        """
        Compute mean, variance, and prior probabilities for each class.

        Args:
            X (np.ndarray): Training features of shape (n_samples, n_features).
            y (np.ndarray): Class labels of shape (n_samples,).

        Returns:
            self
        """
        n_samples, n_features = X.shape
        self.classes = np.unique(y)

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # For each class c in self.classes:
        # 1. Filter samples: X_c = X[y == c]
        # 2. Compute class prior: P(c) = len(X_c) / n_samples
        # 3. Compute feature means: mean_c = X_c.mean(axis=0)
        # 4. Compute feature variances: var_c = X_c.var(axis=0) + self.var_smoothing
        # 5. Store in self.priors, self.mean, and self.var
        # --------------------------------------------------------------------

        # Static placeholder dictionary entries:
        for c in self.classes:
            self.priors[c] = 1.0 / len(self.classes)
            self.mean[c] = np.zeros(n_features)
            self.var[c] = np.ones(n_features)

        return self

    def _calculate_log_likelihood(self, class_idx: int, x: np.ndarray) -> float:
        """
        Compute log-likelihood for a single sample x given a class.
        log(P(x | c)) = sum( -0.5 * log(2 * pi * var) - ((x - mean)^2 / (2 * var)) )
        """
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # --------------------------------------------------------------------
        return 0.0

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict class label with highest posterior probability.

        Args:
            X (np.ndarray): Test features of shape (n_samples, n_features).

        Returns:
            np.ndarray: Predicted class labels of shape (n_samples,).
        """
        n_samples = X.shape[0]

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # For each sample x in X:
        #   Calculate posterior for each class: log(prior) + log_likelihood
        #   Assign class with maximum posterior
        # --------------------------------------------------------------------

        # Static placeholder return value:
        return np.zeros(n_samples, dtype=int)


# ============================================================================
# MAIN EXECUTION PIPELINE
# ============================================================================
def run_naive_bayes_pipeline():
    print_section("04. GAUSSIAN NAIVE BAYES PIPELINE")

    # ------------------------------------------------------------------------
    # STEP 2: TEST ON TOY DATA (MULTICLASS TARGET)
    # ------------------------------------------------------------------------
    print_step(2, "Train & Test Custom Model on Toy Dataset")
    X_train, X_test, y_train, y_test = load_toy_dataset(
        target_column="target_multiclass", test_size=0.25, random_state=42
    )

    print(f"Dataset shape -> X_train: {X_train.shape}, X_test: {X_test.shape}")
    print(f"Target classes: {np.unique(y_train)}")

    # Train Scratch Model
    scratch_model = GaussianNaiveBayesScratch()
    scratch_model.fit(X_train, y_train)
    y_pred_scratch = scratch_model.predict(X_test)

    scratch_metrics = calculate_classification_metrics(y_test, y_pred_scratch)

    # ------------------------------------------------------------------------
    # STEP 3: USE SKLEARN IMPLEMENTATION
    # ------------------------------------------------------------------------
    print_step(3, "Train & Test Scikit-Learn Model on Exact Same Split")
    sklearn_model = SklearnGaussianNB()
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
        title="Toy Dataset: Gaussian Naive Bayes Classification Metrics"
    )

    # Save to results/naive_bayes_{date}_{index}.md
    save_results_to_markdown(
        model_name="naive_bayes",
        scratch_metrics=scratch_metrics,
        sklearn_metrics=sklearn_metrics,
        additional_info={
            "Dataset": "toy_dataset.csv (target_multiclass)",
            "Train Samples": len(X_train),
            "Test Samples": len(X_test),
            "Classes": list(scratch_model.classes)
        }
    )

    # ------------------------------------------------------------------------
    # STEP 5: REAL DATASET HOOK (KAGGLE: Wine Quality Dataset)
    # ------------------------------------------------------------------------
    print_step(5, "Real Dataset Pipeline (Kaggle: Wine Quality)")
    print("Kaggle Handle : yasserh/wine-quality-dataset")
    print("To download   : python data/download_kaggle_datasets.py --model naive_bayes")

    kaggle_csv_path = os.path.join("data", "kaggle_datasets", "naive_bayes", "WineQT.csv")
    if os.path.exists(kaggle_csv_path):
        print(f"Found real dataset at: {kaggle_csv_path}")
        df_real = pd.read_csv(kaggle_csv_path)
        print("Real Dataset Sample:")
        print(df_real.head())
    else:
        print(f"Dataset not downloaded yet. Run the downloader script to test on real data.")


if __name__ == "__main__":
    run_naive_bayes_pipeline()
