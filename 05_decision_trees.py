"""
================================================================================
05. DECISION TREE CLASSIFIER FROM SCRATCH & BENCHMARK
================================================================================
Pipeline:
  1. Scratch Implementation (Blueprint & Placeholders for you to complete)
  2. Test on Toy Data (Multiclass Classification)
  3. Scikit-Learn Implementation
  4. Compare Results (Accuracy, Precision, Recall, F1 & Markdown Export)
  5. Real Dataset Evaluation (Kaggle: Loan Prediction Problem Dataset)
================================================================================
"""

import os
import sys
from typing import Optional, Tuple
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier as SklearnDecisionTree

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
class TreeNode:
    """
    Helper Node container for Decision Tree structure.
    """
    def __init__(
        self,
        feature: Optional[int] = None,
        threshold: Optional[float] = None,
        left: Optional["TreeNode"] = None,
        right: Optional["TreeNode"] = None,
        value: Optional[int] = None
    ):
        self.feature = feature          # Index of feature to split on
        self.threshold = threshold      # Threshold value for split
        self.left = left                # Left subtree (<= threshold)
        self.right = right              # Right subtree (> threshold)
        self.value = value              # Leaf node predicted class (None if internal node)

    @property
    def is_leaf(self) -> bool:
        return self.value is not None


class DecisionTreeClassifierScratch:
    """
    Decision Tree Classifier (CART) from Scratch using Gini Impurity or Entropy.

    Mathematical Splitting Criteria:
        1. Gini Impurity:
           Gini(S) = 1 - sum(p_i^2)
        2. Entropy:
           H(S) = - sum(p_i * log2(p_i))
        3. Information Gain:
           IG(S, A) = Impurity(S) - [ (|S_left|/|S|) * Impurity(S_left) + (|S_right|/|S|) * Impurity(S_right) ]
    """

    def __init__(
        self,
        max_depth: int = 5,
        min_samples_split: int = 2,
        criterion: str = "gini"
    ):
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.criterion = criterion
        self.root: Optional[TreeNode] = None

    def _calculate_impurity(self, y: np.ndarray) -> float:
        """Calculate Gini impurity or Entropy for a label array."""
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # --------------------------------------------------------------------
        return 0.0

    def _best_split(self, X: np.ndarray, y: np.ndarray) -> Tuple[Optional[int], Optional[float]]:
        """Find the feature and threshold that maximize Information Gain."""
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # --------------------------------------------------------------------
        return None, None

    def _build_tree(self, X: np.ndarray, y: np.ndarray, depth: int = 0) -> TreeNode:
        """Recursively construct decision tree nodes."""
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # 1. Base cases: depth >= max_depth, pure node (len(unique(y)) == 1), or samples < min_samples_split
        #    -> return TreeNode(value=most_common_class)
        # 2. Find best split (feature, threshold)
        # 3. Recursively build left and right subtrees
        # --------------------------------------------------------------------
        most_common_label = int(np.bincount(y).argmax()) if len(y) > 0 else 0
        return TreeNode(value=most_common_label)

    def fit(self, X: np.ndarray, y: np.ndarray) -> "DecisionTreeClassifierScratch":
        """
        Fit decision tree on training data.

        Args:
            X (np.ndarray): Training features of shape (n_samples, n_features).
            y (np.ndarray): Training labels of shape (n_samples,).

        Returns:
            self
        """
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # --------------------------------------------------------------------
        self.root = self._build_tree(X, y, depth=0)
        return self

    def _traverse_tree(self, x: np.ndarray, node: TreeNode) -> int:
        """Traverse tree for a single test instance."""
        # --------------------------------------------------------------------
        # TODO: USER IMPLEMENTATION HERE
        # --------------------------------------------------------------------
        if node.is_leaf:
            return node.value
        return 0

    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict classes for test feature matrix.

        Args:
            X (np.ndarray): Test features of shape (n_samples, n_features).

        Returns:
            np.ndarray: Predicted classes of shape (n_samples,).
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
def run_decision_tree_pipeline():
    print_section("05. DECISION TREE CLASSIFIER PIPELINE")

    # ------------------------------------------------------------------------
    # STEP 2: TEST ON TOY DATA (MULTICLASS TARGET)
    # ------------------------------------------------------------------------
    print_step(2, "Train & Test Custom Model on Toy Dataset")
    X_train, X_test, y_train, y_test = load_toy_dataset(
        target_column="target_multiclass", test_size=0.25, random_state=42
    )

    max_depth = 4
    print(f"Dataset shape -> X_train: {X_train.shape}, X_test: {X_test.shape}")
    print(f"Max Depth: {max_depth}, Target classes: {np.unique(y_train)}")

    # Train Scratch Model
    scratch_model = DecisionTreeClassifierScratch(max_depth=max_depth)
    scratch_model.fit(X_train, y_train)
    y_pred_scratch = scratch_model.predict(X_test)

    scratch_metrics = calculate_classification_metrics(y_test, y_pred_scratch)

    # ------------------------------------------------------------------------
    # STEP 3: USE SKLEARN IMPLEMENTATION
    # ------------------------------------------------------------------------
    print_step(3, "Train & Test Scikit-Learn Model on Exact Same Split")
    sklearn_model = SklearnDecisionTree(max_depth=max_depth, random_state=42)
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
        title="Toy Dataset: Decision Tree Classification Metrics"
    )

    # Save to results/decision_trees_{date}_{index}.md
    save_results_to_markdown(
        model_name="decision_trees",
        scratch_metrics=scratch_metrics,
        sklearn_metrics=sklearn_metrics,
        additional_info={
            "Dataset": "toy_dataset.csv (target_multiclass)",
            "Max Depth": max_depth,
            "Criterion": "gini",
            "Train Samples": len(X_train),
            "Test Samples": len(X_test)
        }
    )

    # ------------------------------------------------------------------------
    # STEP 5: REAL DATASET HOOK (KAGGLE: Loan Prediction Problem)
    # ------------------------------------------------------------------------
    print_step(5, "Real Dataset Pipeline (Kaggle: Loan Prediction)")
    print("Kaggle Handle : altruistdelhire04/loan-prediction-problem-dataset")
    print("To download   : python data/download_kaggle_datasets.py --model decision_trees")

    kaggle_csv_path = os.path.join("data", "kaggle_datasets", "decision_trees", "train_u6lujuX_CVtuZ9i.csv")
    if os.path.exists(kaggle_csv_path):
        print(f"Found real dataset at: {kaggle_csv_path}")
        df_real = pd.read_csv(kaggle_csv_path)
        print("Real Dataset Sample:")
        print(df_real.head())
    else:
        print(f"Dataset not downloaded yet. Run the downloader script to test on real data.")


if __name__ == "__main__":
    run_decision_tree_pipeline()
