"""
Kaggle Dataset Downloader Helper

Downloads recommended datasets for each ML model using `kagglehub`
and stores them in a structured directory under `data/kaggle_datasets/`.

Usage:
    python data/download_kaggle_datasets.py --model linear_regression
    python data/download_kaggle_datasets.py --all
    python data/download_kaggle_datasets.py --custom "username/dataset-slug"
"""

import argparse
import os
import shutil
import sys

try:
    import kagglehub
except ImportError:
    print("Error: `kagglehub` is not installed. Run: pip install kagglehub")
    sys.exit(1)

# Recommended Kaggle Datasets Mapping
RECOMMENDED_DATASETS = {
    "linear_regression": {
        "handle": "mirichoi0218/insurance",
        "description": "Medical Cost Personal Datasets (Insurance charges regression)",
        "target_file": "insurance.csv"
    },
    "logistic_regression": {
        "handle": "rashikrahmanpritom/heart-attack-analysis-prediction-dataset",
        "description": "Heart Attack Analysis & Prediction (Binary classification)",
        "target_file": "heart.csv"
    },
    "knn": {
        "handle": "uciml/breast-cancer-wisconsin-data",
        "description": "Breast Cancer Wisconsin Diagnostic (Binary classification / distances)",
        "target_file": "data.csv"
    },
    "naive_bayes": {
        "handle": "yasserh/wine-quality-dataset",
        "description": "Wine Quality Dataset (Multiclass/Probability classification)",
        "target_file": "WineQT.csv"
    },
    "decision_trees": {
        "handle": "altruistdelhire04/loan-prediction-problem-dataset",
        "description": "Loan Prediction Dataset (Tabular decision classification)",
        "target_file": "train_u6lujuX_CVtuZ9i.csv"
    },
    "kmeans": {
        "handle": "vjchoudhary7/customer-segmentation-tutorial-in-python",
        "description": "Mall Customer Segmentation Data (2D/3D customer clustering)",
        "target_file": "Mall_Customers.csv"
    },
    "pca": {
        "handle": "oddrationale/mnist-in-csv",
        "description": "MNIST Digits in CSV (High-dimensional 784-feature reduction)",
        "target_file": "mnist_test.csv"
    }
}


def download_dataset(handle: str, destination_dir: str = None) -> str:
    """
    Download a Kaggle dataset using kagglehub and optionally copy/link to target directory.

    Args:
        handle: Kaggle dataset handle in format 'username/dataset-slug'.
        destination_dir: Directory where dataset files should be placed.

    Returns:
        str: Path to the downloaded dataset folder.
    """
    print(f"\n[KaggleHub] Downloading dataset: {handle} ...")
    try:
        downloaded_path = kagglehub.dataset_download(handle)
        print(f"[KaggleHub] Download completed! Cached at: {downloaded_path}")
        
        if destination_dir:
            os.makedirs(destination_dir, exist_ok=True)
            for item in os.listdir(downloaded_path):
                s = os.path.join(downloaded_path, item)
                d = os.path.join(destination_dir, item)
                if os.path.isdir(s):
                    if os.path.exists(d):
                        shutil.rmtree(d)
                    shutil.copytree(s, d)
                else:
                    shutil.copy2(s, d)
            print(f"[KaggleHub] Copied files to project destination: {destination_dir}")
            return destination_dir
            
        return downloaded_path
    except Exception as e:
        print(f"[KaggleHub] Failed to download {handle}: {e}")
        return ""


def download_for_model(model_key: str, base_data_dir: str = "data/kaggle_datasets") -> str:
    """Download recommended dataset for a specific model key."""
    if model_key not in RECOMMENDED_DATASETS:
        raise KeyError(f"Unknown model key '{model_key}'. Available keys: {list(RECOMMENDED_DATASETS.keys())}")
    
    info = RECOMMENDED_DATASETS[model_key]
    target_dir = os.path.join(base_data_dir, model_key)
    print(f"\n--- Model: {model_key.upper()} ---")
    print(f"Description: {info['description']}")
    return download_dataset(info["handle"], target_dir)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Download Kaggle datasets for ML from Scratch project.")
    parser.add_argument("--model", choices=list(RECOMMENDED_DATASETS.keys()), help="Model name to download dataset for")
    parser.add_argument("--all", action="store_true", help="Download all recommended datasets")
    parser.add_argument("--custom", type=str, help="Custom Kaggle dataset handle (e.g. 'mirichoi0218/insurance')")
    parser.add_argument("--dest", type=str, default="data/kaggle_datasets", help="Destination base directory")

    args = parser.parse_args()

    if args.all:
        for key in RECOMMENDED_DATASETS:
            download_for_model(key, args.dest)
    elif args.model:
        download_for_model(args.model, args.dest)
    elif args.custom:
        custom_slug = args.custom.replace("/", "_")
        dest = os.path.join(args.dest, custom_slug)
        download_dataset(args.custom, dest)
    else:
        print("Please specify --model <name>, --all, or --custom <handle>.")
        print("\nAvailable models:")
        for k, v in RECOMMENDED_DATASETS.items():
            print(f"  - {k:<20} -> {v['handle']} ({v['description']})")
