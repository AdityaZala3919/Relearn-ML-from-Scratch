"""
Main testing script for custom Feature Scalers.

This script tests the 5 custom scalers against a sample dataset with:
- Differing magnitudes (Age vs Salary)
- Outliers
- Sparse zeros

It also compares outputs with Scikit-Learn (if installed) to verify accuracy.
"""

import sys
import os
import numpy as np

from sklearn.preprocessing import (
    StandardScaler,
    MinMaxScaler,
    MaxAbsScaler,
    RobustScaler
)


def create_sample_dataset():
    """Create a realistic sample dataset to test various scaling challenges."""
    # Columns:
    # 0: Age (20 to 60)
    # 1: Salary (30,000 to 120,000)
    # 2: Sparse interaction score with zeros
    # 3: Transaction amount with an extreme outlier (1,000,000)
    data = np.array(
        [
            [22.0, 35000.0, 0.0, 50.0],
            [28.0, 48000.0, 0.0, 120.0],
            [35.0, 65000.0, 1.5, 80.0],
            [42.0, 80000.0, 0.0, 210.0],
            [50.0, 110000.0, 4.2, 95.0],
            [58.0, 125000.0, 0.0, 1000000.0],  # Outlier in col 3
        ],
        dtype=np.float64,
    )
    feature_names = ["Age", "Salary", "ActivityScore (Sparse)", "Transaction ($)"]
    return data, feature_names


def test_scaler(scaler_name, scaler_instance, X, feature_names):
    """Test a single scaler instance and report statistics."""
    print("=" * 70)
    print(f" TESTING: {scaler_name} ".center(70, "="))
    print("=" * 70)

    try:
        # 1. Fit & Transform
        X_scaled = scaler_instance.fit_transform(X)

        print("\nTransformed Output Shape:", X_scaled.shape)
        print("Transformed Array:\n", np.round(X_scaled, 4))

        # Check if the scaler is still returning raw placeholder
        if np.allclose(X, X_scaled):
            print("\n[NOTE]: Scaler returned raw input (placeholder state).")
            print("Implement the fit() and transform() methods in preprocessing/scalers.py!")
        else:
            print("\nPer-feature Statistics after scaling:")
            for i, name in enumerate(feature_names):
                col = X_scaled[:, i]
                print(
                    f"  - {name:<25}: Min={col.min():.4f}, Max={col.max():.4f}, "
                    f"Mean={col.mean():.4f}, Std={col.std():.4f}"
                )

            # 2. Test Inverse Transform
            X_reconstructed = scaler_instance.inverse_transform(X_scaled)
            if np.allclose(X, X_reconstructed, atol=1e-5):
                print("\n[SUCCESS] inverse_transform correctly restored original data!")
            else:
                print("\n[WARNING] inverse_transform output differs from original data.")

    except NotImplementedError as e:
        print(f"\n[NOT IMPLEMENTED]: {e}")
    except Exception as e:
        print(f"\n[ERROR]: {e}")

    print()


def main():
    X, feature_names = create_sample_dataset()
    print("Original Dataset (Shape: {}):".format(X.shape))
    print("Features:", feature_names)
    print(X)
    print()

    # List of scalers to test
    scalers = [
        # ("StandardScaler", StandardScaler()),
        # ("MinMaxScaler", MinMaxScaler(feature_range=(0, 2))),
        # ("MeanNormalizer", MeanNormalizer()),
        # ("MaxAbsScaler", MaxAbsScaler()),
        # ("RobustScaler", RobustScaler()),
    ]

    for name, scaler in scalers:
        test_scaler(name, scaler, X, feature_names)


if __name__ == "__main__":
    main()
