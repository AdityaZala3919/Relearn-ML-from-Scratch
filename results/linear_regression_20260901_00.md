# Model Evaluation: Linear Regression

- **Model**: `linear_regression`
- **Execution Timestamp**: `2026-09-01 18:52:05`
- **Run Index**: `00`

## Performance & Metric Comparison

| Metric / Parameter | From Scratch (Custom) | Scikit-Learn | Difference (Scratch - Sklearn) |
| :--- | :--- | :--- | :--- |
| Mean Squared Error (MSE) | 25741.1365 | 25.5039 | +25715.6326 |
| Root Mean Squared Error (RMSE) | 160.4404 | 5.0501 | +155.3903 |
| Mean Absolute Error (MAE) | 144.0481 | 3.7859 | +140.2622 |
| R2 Score | -4.1572 | 0.9949 | -5.1521 |

## Additional Configuration & Parameters

- **Dataset**: `toy_dataset.csv (target_regression)`
- **Train Samples**: `64`
- **Test Samples**: `16`
- **Scratch Weights**:
  ```json
  [np.float64(0.0), np.float64(0.0), np.float64(0.0), np.float64(0.0)]
  ```
- **Scratch Bias**: `0.0`
- **Sklearn Weights**:
  ```json
  [np.float64(2.508), np.float64(3.8666), np.float64(-3.9606), np.float64(1.3397)]
  ```
- **Sklearn Bias**: `13.026`

---
*Generated automatically by ML from Scratch Benchmark Framework.*
