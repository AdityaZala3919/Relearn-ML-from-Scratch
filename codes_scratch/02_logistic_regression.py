"""
================================================================================
02. LOGISTIC REGRESSION FROM SCRATCH & BENCHMARK
================================================================================
Pipeline:
  1. Scratch Implementation (Blueprint & Placeholders for you to complete)
  2. Test on Toy Data (Binary Classification)
  3. Scikit-Learn Implementation
  4. Compare Results (Metrics Table, Decision Parameters & Markdown Export)
  5. Real Dataset Evaluation (Kaggle: Heart Attack Analysis & Prediction)
================================================================================
"""

import os
import sys
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression as SklearnLogisticRegression

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from codes_scratch.utils.data_loader import load_toy_dataset
from codes_scratch.utils.metrics import (
    print_section,
    print_step,
    calculate_classification_metrics,
    display_comparison_table,
    save_results_to_markdown,
)


# ============================================================================
# 1. IMPLEMENT FROM SCRATCH (CLASS BLUEPRINT)
# ============================================================================
class LogisticRegressionScratch:
    """
    Binary Logistic Regression from Scratch.

    Mathematical Model:
        z = X @ w + b
        p = sigmoid(z) = 1 / (1 + exp(-z))
        y_pred = (p >= threshold).astype(int)

    Loss Function (Binary Cross-Entropy):
        J(w, b) = - (1 / n_samples) * sum(y * log(p) + (1 - y) * log(1 - p))

    Optimization (Gradient Descent):
        dw = (1 / n_samples) * (X.T @ (p - y))
        db = (1 / n_samples) * sum(p - y)
        w := w - learning_rate * dw
        b := b - learning_rate * db
    """

    def __init__(self, learning_rate: float = 0.01, n_iterations: int = 1000, threshold: float = 0.5):
        self.learning_rate = learning_rate
        self.n_iterations = n_iterations
        self.threshold = threshold
        self.weights: np.ndarray = None  # Shape: (n_features,)
        self.bias: float = 0.0           # Scalar

    @staticmethod
    def _sigmoid(z: np.ndarray) -> np.ndarray:
        """
        Sigmoid activation function.
        Tip: Clip z (e.g. np.clip(z, -500, 500)) to prevent overflow.
        """
        # TODO: USER IMPLEMENTATION HERE
        return np.zeros_like(z, dtype=float)

    def fit(self, X: np.ndarray, y: np.ndarray) -> "LogisticRegressionScratch":
        """
        Fit the logistic regression model using gradient descent.

        Args:
            X (np.ndarray): Training features of shape (n_samples, n_features).
            y (np.ndarray): Binary labels (0 or 1) of shape (n_samples,).

        Returns:
            self
        """
        n_samples, n_features = X.shape

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # 1. Initialize weights (e.g. np.zeros(n_features)) and bias (0.0)
        # 2. Loop for self.n_iterations:
        #    a. Compute linear model z = X @ weights + bias
        #    b. Apply sigmoid to get probabilities p
        #    c. Compute gradients dw and db
        #    d. Update self.weights and self.bias
        # --------------------------------------------------------------------

        # Static placeholder values:
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        return self

    def predict_proba(self, X: np.ndarray) -> np.ndarray:
        """
        Predict probability estimates for positive class (1).

        Args:
            X (np.ndarray): Test features of shape (n_samples, n_features).

        Returns:
            np.ndarray: Probabilities of shape (n_samples,).
        """
        n_samples = X.shape[0]

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # Compute z = X @ weights + bias, return sigmoid(z)
        # --------------------------------------------------------------------

        # Static placeholder return value:
        return np.zeros(n_samples)

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict binary class labels (0 or 1).

        Args:
            X (np.ndarray): Test features of shape (n_samples, n_features).

        Returns:
            np.ndarray: Predicted binary classes of shape (n_samples,).
        """
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # Return (self.predict_proba(X) >= self.threshold).astype(int)
        # --------------------------------------------------------------------

        # Static placeholder return value:
        return np.zeros(X.shape[0], dtype=int)


# ============================================================================
# MAIN EXECUTION PIPELINE
# ============================================================================
def run_logistic_regression_pipeline():
    print_section("02. LOGISTIC REGRESSION PIPELINE")

    # ------------------------------------------------------------------------
    # STEP 2: TEST ON TOY DATA (BINARY TARGET)
    # ------------------------------------------------------------------------
    print_step(2, "Train & Test Custom Model on Toy Dataset")
    X_train, X_test, y_train, y_test = load_toy_dataset(
        target_column="target_binary", test_size=0.2, random_state=42
    )

    print(f"Dataset shape -> X_train: {X_train.shape}, X_test: {X_test.shape}")
    print(f"Class Distribution -> Train: {np.bincount(y_train)}, Test: {np.bincount(y_test)}")

    # Train Scratch Model
    scratch_model = LogisticRegressionScratch(learning_rate=0.01, n_iterations=1000)
    scratch_model.fit(X_train, y_train)
    y_pred_scratch = scratch_model.predict(X_test)

    scratch_metrics = calculate_classification_metrics(y_test, y_pred_scratch)

    # ------------------------------------------------------------------------
    # STEP 3: USE SKLEARN IMPLEMENTATION
    # ------------------------------------------------------------------------
    print_step(3, "Train & Test Scikit-Learn Model on Exact Same Split")
    sklearn_model = SklearnLogisticRegression(random_state=42)
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
        title="Toy Dataset: Logistic Regression Classification Metrics"
    )

    print("\nModel Parameters Comparison:")
    print(f"Scratch Weights : {scratch_model.weights}")
    print(f"Scratch Bias    : {scratch_model.bias:.4f}")
    print(f"Sklearn Weights : {np.round(sklearn_model.coef_[0], 4)}")
    print(f"Sklearn Bias    : {sklearn_model.intercept_[0]:.4f}")

    # Save to results/logistic_regression_{date}_{index}.md
    save_results_to_markdown(
        model_name="logistic_regression",
        scratch_metrics=scratch_metrics,
        sklearn_metrics=sklearn_metrics,
        additional_info={
            "Dataset": "toy_dataset.csv (target_binary)",
            "Train Samples": len(X_train),
            "Test Samples": len(X_test),
            "Scratch Weights": list(np.round(scratch_model.weights, 4)),
            "Scratch Bias": round(float(scratch_model.bias), 4),
            "Sklearn Weights": list(np.round(sklearn_model.coef_[0], 4)),
            "Sklearn Bias": round(float(sklearn_model.intercept_[0]), 4)
        }
    )

    # ------------------------------------------------------------------------
    # STEP 5: REAL DATASET HOOK (KAGGLE: Heart Attack Dataset)
    # ------------------------------------------------------------------------
    print_step(5, "Real Dataset Pipeline (Kaggle: Heart Attack Analysis)")
    print("Kaggle Handle : rashikrahmanpritom/heart-attack-analysis-prediction-dataset")
    print("To download   : python data/download_kaggle_datasets.py --model logistic_regression")

    kaggle_csv_path = os.path.join("data", "kaggle_datasets", "logistic_regression", "heart.csv")
    if os.path.exists(kaggle_csv_path):
        print(f"Found real dataset at: {kaggle_csv_path}")
        df_real = pd.read_csv(kaggle_csv_path)
        print("Real Dataset Sample:")
        print(df_real.head())
    else:
        print(f"Dataset not downloaded yet. Run the downloader script to test on real data.")


if __name__ == "__main__":
    run_logistic_regression_pipeline()
