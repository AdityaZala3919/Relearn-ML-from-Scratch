"""
================================================================================
01. LINEAR REGRESSION FROM SCRATCH & BENCHMARK
================================================================================
Pipeline:
  1. Scratch Implementation (Blueprint & Placeholders for you to complete)
  2. Test on Toy Data
  3. Scikit-Learn Implementation
  4. Compare Results (Metrics Table, Weights Comparison & Markdown Export)
  5. Real Dataset Evaluation (Kaggle: Medical Cost Personal Datasets)
================================================================================
"""

import os
import sys
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression as SklearnLinearRegression

# Add project root to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from utils.data_loader import load_toy_dataset
from utils.metrics import (
    print_section,
    print_step,
    calculate_regression_metrics,
    display_comparison_table,
    save_results_to_markdown,
)


# ============================================================================
# 1. IMPLEMENT FROM SCRATCH (CLASS BLUEPRINT)
# ============================================================================
class LinearRegressionScratch:
    """
    Ordinary Least Squares / Gradient Descent Linear Regression from Scratch.

    Mathematical Model:
        y_pred = X @ w + b
        where:
          - X is of shape (n_samples, n_features)
          - w is of shape (n_features,)
          - b is a scalar bias term

    Optimization (Gradient Descent):
        dw = (1 / n_samples) * (X.T @ (y_pred - y))
        db = (1 / n_samples) * sum(y_pred - y)
        w := w - learning_rate * dw
        b := b - learning_rate * db

    Closed-form (Normal Equation alternative):
        w_all = inv(X_augmented.T @ X_augmented) @ X_augmented.T @ y
    """

    def __init__(self, learning_rate: float = 0.001, n_iterations: int = 1000):
        self.learning_rate = learning_rate
        self.n_iterations = n_iterations
        self.weights: np.ndarray = None  # Shape: (n_features,)
        self.bias: float = 0.0           # Scalar

    def fit(self, X: np.ndarray, y: np.ndarray) -> "LinearRegressionScratch":
        """
        Fit the linear regression model to training data.

        Args:
            X (np.ndarray): Training features of shape (n_samples, n_features).
            y (np.ndarray): Target values of shape (n_samples,).

        Returns:
            self
        """
        n_samples, n_features = X.shape

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # 1. Initialize weights (e.g. np.zeros(n_features)) and bias (0.0)
        # 2. Iterate for `self.n_iterations` steps
        # 3. In each iteration: compute predictions, compute gradients dw and db
        # 4. Update self.weights and self.bias using self.learning_rate
        # --------------------------------------------------------------------
        
        # Static placeholder values:
        self.weights = np.zeros(n_features)
        self.bias = 0.0

        return self

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict target values using the linear model.

        Args:
            X (np.ndarray): Test features of shape (n_samples, n_features).

        Returns:
            np.ndarray: Predicted values of shape (n_samples,).
        """
        n_samples = X.shape[0]

        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # Compute and return: np.dot(X, self.weights) + self.bias
        # --------------------------------------------------------------------

        # Static placeholder return value:
        return np.zeros(n_samples)


# ============================================================================
# MAIN EXECUTION PIPELINE
# ============================================================================
def run_linear_regression_pipeline():
    print_section("01. LINEAR REGRESSION PIPELINE")

    # ------------------------------------------------------------------------
    # STEP 2: TEST ON TOY DATA
    # ------------------------------------------------------------------------
    print_step(2, "Train & Test Custom Model on Toy Dataset")
    X_train, X_test, y_train, y_test = load_toy_dataset(
        target_column="target_regression", test_size=0.2, random_state=42
    )

    print(f"Dataset shape -> X_train: {X_train.shape}, X_test: {X_test.shape}")
    
    # Train Scratch Model
    scratch_model = LinearRegressionScratch(learning_rate=0.0001, n_iterations=1000)
    scratch_model.fit(X_train, y_train)
    y_pred_scratch = scratch_model.predict(X_test)
    
    scratch_metrics = calculate_regression_metrics(y_test, y_pred_scratch)

    # ------------------------------------------------------------------------
    # STEP 3: USE SKLEARN IMPLEMENTATION
    # ------------------------------------------------------------------------
    print_step(3, "Train & Test Scikit-Learn Model on Exact Same Split")
    sklearn_model = SklearnLinearRegression()
    sklearn_model.fit(X_train, y_train)
    y_pred_sklearn = sklearn_model.predict(X_test)

    sklearn_metrics = calculate_regression_metrics(y_test, y_pred_sklearn)

    # ------------------------------------------------------------------------
    # STEP 4: COMPARE RESULTS & SAVE MARKDOWN
    # ------------------------------------------------------------------------
    print_step(4, "Compare Results & Export Markdown Report")
    display_comparison_table(
        scratch_metrics,
        sklearn_metrics,
        title="Toy Dataset: Linear Regression Comparison"
    )

    print("\nModel Parameters Comparison:")
    print(f"Scratch Weights : {scratch_model.weights}")
    print(f"Scratch Bias    : {scratch_model.bias:.4f}")
    print(f"Sklearn Weights : {np.round(sklearn_model.coef_, 4)}")
    print(f"Sklearn Bias    : {sklearn_model.intercept_:.4f}")

    # Save to results/linear_regression_{date}_{index}.md
    save_results_to_markdown(
        model_name="linear_regression",
        scratch_metrics=scratch_metrics,
        sklearn_metrics=sklearn_metrics,
        additional_info={
            "Dataset": "toy_dataset.csv (target_regression)",
            "Train Samples": len(X_train),
            "Test Samples": len(X_test),
            "Scratch Weights": list(np.round(scratch_model.weights, 4)),
            "Scratch Bias": round(float(scratch_model.bias), 4),
            "Sklearn Weights": list(np.round(sklearn_model.coef_, 4)),
            "Sklearn Bias": round(float(sklearn_model.intercept_), 4)
        }
    )

    # ------------------------------------------------------------------------
    # STEP 5: REAL DATASET HOOK (KAGGLE: Insurance Dataset)
    # ------------------------------------------------------------------------
    print_step(5, "Real Dataset Pipeline (Kaggle: Medical Cost Personal Datasets)")
    print("Kaggle Handle : mirichoi0218/insurance")
    print("To download   : python data/download_kaggle_datasets.py --model linear_regression")
    
    kaggle_csv_path = os.path.join("data", "kaggle_datasets", "linear_regression", "insurance.csv")
    if os.path.exists(kaggle_csv_path):
        print(f"Found real dataset at: {kaggle_csv_path}")
        df_real = pd.read_csv(kaggle_csv_path)
        print("Real Dataset Sample:")
        print(df_real.head())
    else:
        print(f"Dataset not downloaded yet. Run the downloader script to test on real data.")


if __name__ == "__main__":
    run_linear_regression_pipeline()
