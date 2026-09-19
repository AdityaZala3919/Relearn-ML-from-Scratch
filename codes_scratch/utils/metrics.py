"""
Evaluation & Benchmarking Utilities

Provides metric calculators, side-by-side comparison tables,
and automated markdown report export ({model_name}_{date}_{index}.md).
"""

import os
import re
from datetime import datetime
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
try:
    from tabulate import tabulate
    HAS_TABULATE = True
except ImportError:
    HAS_TABULATE = False


def print_section(title: str, width: int = 70):
    """Print standard visual section banner."""
    print("\n" + "=" * width)
    print(f" {title.upper()}")
    print("=" * width)


def print_step(step_num: int, step_name: str, width: int = 70):
    """Print standard step header."""
    print("\n" + "-" * width)
    print(f"STEP {step_num}: {step_name}")
    print("-" * width)


# ---------------------------------------------------------------------------
# Metric Calculators
# ---------------------------------------------------------------------------

def calculate_regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Calculate standard regression metrics: MSE, RMSE, MAE, R2 Score."""
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float)
    
    mse = float(np.mean((y_true - y_pred) ** 2))
    rmse = float(np.sqrt(mse))
    mae = float(np.mean(np.abs(y_true - y_pred)))
    
    ss_tot = np.sum((y_true - np.mean(y_true)) ** 2)
    ss_res = np.sum((y_true - y_pred) ** 2)
    r2 = float(1.0 - (ss_res / (ss_tot + 1e-10)))
    
    return {
        "Mean Squared Error (MSE)": round(mse, 4),
        "Root Mean Squared Error (RMSE)": round(rmse, 4),
        "Mean Absolute Error (MAE)": round(mae, 4),
        "R2 Score": round(r2, 4)
    }


def calculate_classification_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """Calculate standard classification metrics: Accuracy, Precision, Recall, F1 (macro)."""
    y_true = np.asarray(y_true, dtype=int)
    y_pred = np.asarray(y_pred, dtype=int)
    
    accuracy = float(np.mean(y_true == y_pred))
    
    classes = np.unique(np.concatenate([y_true, y_pred]))
    precisions = []
    recalls = []
    f1s = []
    
    for c in classes:
        tp = np.sum((y_pred == c) & (y_true == c))
        fp = np.sum((y_pred == c) & (y_true != c))
        fn = np.sum((y_pred != c) & (y_true == c))
        
        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0
        
        precisions.append(prec)
        recalls.append(rec)
        f1s.append(f1)
        
    return {
        "Accuracy": round(accuracy, 4),
        "Precision (Macro)": round(float(np.mean(precisions)), 4),
        "Recall (Macro)": round(float(np.mean(recalls)), 4),
        "F1-Score (Macro)": round(float(np.mean(f1s)), 4)
    }


def calculate_clustering_metrics(X: np.ndarray, labels: np.ndarray, centroids: np.ndarray = None) -> Dict[str, float]:
    """Calculate clustering metrics including Inertia (SSD) and cluster count."""
    X = np.asarray(X, dtype=float)
    labels = np.asarray(labels, dtype=int)
    
    inertia = 0.0
    unique_labels = np.unique(labels)
    for k in unique_labels:
        cluster_points = X[labels == k]
        if len(cluster_points) > 0:
            if centroids is not None and len(centroids) > k:
                center = centroids[k]
            else:
                center = np.mean(cluster_points, axis=0)
            inertia += float(np.sum((cluster_points - center) ** 2))
            
    return {
        "Inertia (WCSS)": round(inertia, 4),
        "Num Clusters Found": int(len(unique_labels))
    }


# ---------------------------------------------------------------------------
# Formatted Table Comparison & Markdown Exporter
# ---------------------------------------------------------------------------

def _build_comparison_rows(scratch_metrics: Dict[str, Any], sklearn_metrics: Dict[str, Any]) -> List[List[Any]]:
    """Build structured rows comparing scratch metrics vs sklearn metrics."""
    all_keys = list(dict.fromkeys(list(scratch_metrics.keys()) + list(sklearn_metrics.keys())))
    rows = []
    
    for key in all_keys:
        val_scratch = scratch_metrics.get(key, "N/A")
        val_sklearn = sklearn_metrics.get(key, "N/A")
        
        diff = "N/A"
        if isinstance(val_scratch, (int, float)) and isinstance(val_sklearn, (int, float)):
            delta = val_scratch - val_sklearn
            diff = f"{delta:+.4f}"
            
        rows.append([key, val_scratch, val_sklearn, diff])
    return rows


def display_comparison_table(
    scratch_metrics: Dict[str, Any],
    sklearn_metrics: Dict[str, Any],
    title: str = "Scratch vs. Scikit-Learn Comparison"
):
    """Display a side-by-side comparison table between Scratch and Sklearn results."""
    print(f"\n>>> {title} <<<")
    rows = _build_comparison_rows(scratch_metrics, sklearn_metrics)
    headers = ["Metric / Parameter", "From Scratch (Custom)", "Scikit-Learn", "Difference (Scratch - Sklearn)"]
    
    if HAS_TABULATE:
        print(tabulate(rows, headers=headers, tablefmt="fancy_grid"))
    else:
        df = pd.DataFrame(rows, columns=headers)
        print(df.to_string(index=False))


def save_results_to_markdown(
    model_name: str,
    scratch_metrics: Dict[str, Any],
    sklearn_metrics: Dict[str, Any],
    additional_info: Optional[Dict[str, Any]] = None,
    results_dir: str = "results"
) -> str:
    """
    Save execution results into a markdown file: {model_name}_{date_of_creation}_{index}.md

    Args:
        model_name: Canonical model name (e.g. 'linear_regression', 'knn')
        scratch_metrics: Metrics dictionary for custom scratch model
        sklearn_metrics: Metrics dictionary for scikit-learn model
        additional_info: Optional dictionary containing parameters, hyperparameters, or notes
        results_dir: Directory where results will be stored (defaults to 'results/')

    Returns:
        str: Absolute or relative filepath of the created markdown file.
    """
    os.makedirs(results_dir, exist_ok=True)
    
    now = datetime.now()
    date_str = now.strftime("%Y%m%d")
    clean_model_name = model_name.strip().lower().replace(" ", "_")
    
    # Pattern to match: {model_name}_{date_str}_{index}.md
    pattern = re.compile(rf"^{re.escape(clean_model_name)}_{date_str}_(\d+)\.md$")
    
    highest_idx = -1
    for filename in os.listdir(results_dir):
        match = pattern.match(filename)
        if match:
            idx = int(match.group(1))
            if idx > highest_idx:
                highest_idx = idx
                
    next_idx = highest_idx + 1
    index_str = f"{next_idx:02d}"
    
    file_name = f"{clean_model_name}_{date_str}_{index_str}.md"
    file_path = os.path.join(results_dir, file_name)
    
    # Build Markdown Content
    title_name = clean_model_name.replace("_", " ").title()
    rows = _build_comparison_rows(scratch_metrics, sklearn_metrics)
    
    md_lines = [
        f"# Model Evaluation: {title_name}",
        "",
        f"- **Model**: `{clean_model_name}`",
        f"- **Execution Timestamp**: `{now.strftime('%Y-%m-%d %H:%M:%S')}`",
        f"- **Run Index**: `{index_str}`",
        "",
        "## Performance & Metric Comparison",
        "",
        "| Metric / Parameter | From Scratch (Custom) | Scikit-Learn | Difference (Scratch - Sklearn) |",
        "| :--- | :--- | :--- | :--- |"
    ]
    
    for row in rows:
        md_lines.append(f"| {row[0]} | {row[1]} | {row[2]} | {row[3]} |")
        
    if additional_info:
        md_lines.append("")
        md_lines.append("## Additional Configuration & Parameters")
        md_lines.append("")
        for k, v in additional_info.items():
            if isinstance(v, (dict, list)):
                md_lines.append(f"- **{k}**:")
                md_lines.append(f"  ```json\n  {v}\n  ```")
            else:
                md_lines.append(f"- **{k}**: `{v}`")
                
    md_lines.append("")
    md_lines.append("---")
    md_lines.append("*Generated automatically by ML from Scratch Benchmark Framework.*")
    md_lines.append("")
    
    content = "\n".join(md_lines)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"\n[Results Logger] Saved evaluation report to: {file_path}")
    return file_path
