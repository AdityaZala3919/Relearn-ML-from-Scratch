# Walkthrough: Machine Learning Models from Scratch Framework

A modular, professional scaffolding framework for building, testing, and benchmarking 7 foundational Machine Learning models from scratch against Scikit-Learn.

---

## 1. Project Directory Structure

```
ML from Scratch/
│
├── data/
│   ├── toy_dataset.json            # Unified multi-task toy dataset (80 samples)
│   ├── toy_dataset.csv             # Converted tabular dataset (generated)
│   ├── generate_toy_json.py        # Generator for structured toy JSON dataset
│   ├── convert_json_to_csv.py      # Schema validator and JSON -> CSV converter
│   └── download_kaggle_datasets.py # Direct kagglehub dataset downloader
│
├── docs/
│   ├── plan.md                     # Technical implementation plan
│   └── walkthrough.md              # Project walkthrough and verification report
│
├── results/
│   └── {model}_{date}_{index}.md   # Auto-indexed benchmark reports
│
├── utils/
│   ├── __init__.py
│   ├── data_loader.py              # Standardized dataset loading and splitting
│   └── metrics.py                  # Evaluation metrics & side-by-side comparison tables
│
├── 01_linear_regression.py         # Linear Regression pipeline & placeholder class
├── 02_logistic_regression.py       # Logistic Regression pipeline & placeholder class
├── 03_knn.py                       # k-Nearest Neighbors pipeline & placeholder class
├── 04_naive_bayes.py               # Gaussian Naive Bayes pipeline & placeholder class
├── 05_decision_trees.py            # Decision Tree Classifier pipeline & placeholder class
├── 06_kmeans.py                    # k-Means Clustering pipeline & placeholder class
├── 07_pca.py                       # PCA pipeline & placeholder class
└── requirements.txt                # Dependencies (numpy, pandas, scikit-learn, tabulate, kagglehub)
```

---

## 2. Recommended Kaggle Real Datasets

A dedicated downloader script `data/download_kaggle_datasets.py` is included. It uses `kagglehub` to download datasets directly to `data/kaggle_datasets/<model_name>/`.

| Model | Kaggle Handle | Target Task | Direct Download Command |
| :--- | :--- | :--- | :--- |
| **01. Linear Regression** | `mirichoi0218/insurance` | Insurance Charges Prediction | `python data/download_kaggle_datasets.py --model linear_regression` |
| **02. Logistic Regression** | `rashikrahmanpritom/heart-attack-analysis-prediction-dataset` | Heart Attack Prediction | `python data/download_kaggle_datasets.py --model logistic_regression` |
| **03. k-NN** | `uciml/breast-cancer-wisconsin-data` | Diagnostic Classification | `python data/download_kaggle_datasets.py --model knn` |
| **04. Naive Bayes** | `yasserh/wine-quality-dataset` | Wine Quality Classification | `python data/download_kaggle_datasets.py --model naive_bayes` |
| **05. Decision Trees** | `altruistdelhire04/loan-prediction-problem-dataset` | Loan Approval Prediction | `python data/download_kaggle_datasets.py --model decision_trees` |
| **06. k-Means** | `vjchoudhary7/customer-segmentation-tutorial-in-python` | Customer Spending Clusters | `python data/download_kaggle_datasets.py --model kmeans` |
| **07. PCA** | `oddrationale/mnist-in-csv` | Digits Dimensionality Reduction | `python data/download_kaggle_datasets.py --model pca` |

> [!TIP]
> You can also download all datasets at once using:
> ```bash
> python data/download_kaggle_datasets.py --all
> ```

---

## 3. How to Implement Your Models

Each script (`01` through `07`) contains:
1. **Mathematical Docstring**: Formulations, gradient equations, and matrix shape dimensions.
2. **`TODO: USER IMPLEMENTATION HERE` Block**: Clean placeholders where you will write your logic.
3. **Automated 5-Step Pipeline**:
   - **Step 1**: Initialize Custom Model.
   - **Step 2**: Fit and evaluate on the toy dataset (`data/toy_dataset.csv`).
   - **Step 3**: Fit Scikit-Learn equivalent on the identical train/test split.
   - **Step 4**: Compute comparison table (showing metrics and the mathematical difference between your scratch model and Sklearn).
   - **Step 5**: Real Kaggle dataset evaluation hook.

---

## 4. Verification Results

All 7 model files and the converter script were executed and verified end-to-end:

```
[PASS] data/generate_toy_json.py       -> Generated data/toy_dataset.json (80 records)
[PASS] data/convert_json_to_csv.py     -> Converted to data/toy_dataset.csv
[PASS] 01_linear_regression.py         -> Execution exit code 0
[PASS] 02_logistic_regression.py       -> Execution exit code 0
[PASS] 03_knn.py                       -> Execution exit code 0
[PASS] 04_naive_bayes.py               -> Execution exit code 0
[PASS] 05_decision_trees.py            -> Execution exit code 0
[PASS] 06_kmeans.py                    -> Execution exit code 0
[PASS] 07_pca.py                       -> Execution exit code 0
```
