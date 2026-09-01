# Model Evaluation: Logistic Regression

- **Model**: `logistic_regression`
- **Execution Timestamp**: `2026-09-01 18:52:09`
- **Run Index**: `00`

## Performance & Metric Comparison

| Metric / Parameter | From Scratch (Custom) | Scikit-Learn | Difference (Scratch - Sklearn) |
| :--- | :--- | :--- | :--- |
| Accuracy | 0.5 | 0.9375 | -0.4375 |
| Precision (Macro) | 0.25 | 0.9444 | -0.6944 |
| Recall (Macro) | 0.5 | 0.9375 | -0.4375 |
| F1-Score (Macro) | 0.3333 | 0.9373 | -0.6040 |

## Additional Configuration & Parameters

- **Dataset**: `toy_dataset.csv (target_binary)`
- **Train Samples**: `64`
- **Test Samples**: `16`
- **Scratch Weights**:
  ```json
  [np.float64(0.0), np.float64(0.0), np.float64(0.0), np.float64(0.0)]
  ```
- **Scratch Bias**: `0.0`
- **Sklearn Weights**:
  ```json
  [np.float64(0.2993), np.float64(1.5651), np.float64(-0.7089), np.float64(0.112)]
  ```
- **Sklearn Bias**: `-20.0588`

---
*Generated automatically by ML from Scratch Benchmark Framework.*
