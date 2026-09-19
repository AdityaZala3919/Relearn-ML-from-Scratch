"""
Feature Scaling Transformers from Scratch.

This module provides standard scaler classes mirroring the scikit-learn API:
- StandardScaler: Scales features by removing the mean and scaling to unit variance.
- MinMaxScaler: Scales features to a bounded range (default [0, 1]).
- MeanNormalizer: Scales features to roughly [-1, 1] centered around zero.
- MaxAbsScaler: Scales each feature by its maximum absolute value (preserves sparsity).
- RobustScaler: Scales features using statistics that are robust to outliers (Median and IQR).
"""

import numpy as np


class StandardScaler:
    """Standardize features by removing the mean and scaling to unit variance (Z-score).

    Formula:
        z = (x - mean) / std

    Attributes:
        mean_ (np.ndarray): The mean value for each feature in the training set.
        scale_ (np.ndarray): The standard deviation for each feature.
        var_ (np.ndarray): The variance for each feature in the training set.
    """

    def __init__(self, with_mean=True, with_std=True):
        self.with_mean = with_mean
        self.with_std = with_std
        self.mean_ = None
        self.scale_ = None
        self.var_ = None

    def fit(self, X):
        """Compute the mean and standard deviation to be used for later scaling.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            self: Fitted scaler.
        """
        X = np.asarray(X, dtype=np.float64)
        
        if self.with_mean:
            self.mean_ = np.mean(X, axis=0)
        else:
            self.mean_ = None

        if self.with_std:
            self.var_ = np.var(X, axis=0)
            scale = np.sqrt(self.var_)
            # Handle constant features (std == 0) to avoid division by zero
            scale[scale == 0.0] = 1.0
            self.scale_ = scale
        else:
            self.scale_ = None
            self.var_ = None

        return self

    def transform(self, X):
        """Perform standardization by centering and scaling.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Standardized array of shape (n_samples, n_features).
        """
        if self.with_mean and self.mean_ is None:
            raise RuntimeError("This StandardScaler instance is not fitted yet. Call 'fit' before using this method.")
        if self.with_std and self.scale_ is None:
            raise RuntimeError("This StandardScaler instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)
        X_trans = X.copy()

        if self.with_mean and self.mean_ is not None:
            X_trans = X_trans - self.mean_

        if self.with_std and self.scale_ is not None:
            X_trans = X_trans / self.scale_

        return X_trans

    def fit_transform(self, X):
        """Fit to data, then transform it.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Standardized array.
        """
        return self.fit(X).transform(X)

    def inverse_transform(self, X):
        """Scale back the data to the original representation.

        Args:
            X (np.ndarray or list): Transformed array of shape (n_samples, n_features).

        Returns:
            np.ndarray: Original unscaled array.
        """
        if self.with_mean and self.mean_ is None:
            raise RuntimeError("This StandardScaler instance is not fitted yet. Call 'fit' before using this method.")
        if self.with_std and self.scale_ is None:
            raise RuntimeError("This StandardScaler instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)
        X_orig = X.copy()

        if self.with_std and self.scale_ is not None:
            X_orig = X_orig * self.scale_

        if self.with_mean and self.mean_ is not None:
            X_orig = X_orig + self.mean_

        return X_orig


class MinMaxScaler:
    """Transform features by scaling each feature to a given range (default [0, 1]).

    -------------------------------------------------------------------------
    CONCEPT & INTUITION:
    -------------------------------------------------------------------------
    Min-Max Scaling linearly compresses or stretches the feature values so
    that they fall within a strictly bounded interval [min_val, max_val].

    Intuition: "Where does x stand between the minimum and maximum of the
    dataset as a fraction, and how do we project that fraction into [a, b]?"

    -------------------------------------------------------------------------
    MATHEMATICAL FORMULAS:
    -------------------------------------------------------------------------
    1. Intermediate step (normalize to [0, 1]):
           X_std = (X - X_min) / (X_max - X_min)

    2. Final target range projection [a, b] where a = min_val, b = max_val:
           X_scaled = X_std * (b - a) + a

    3. Inverse transformation (recovering original X):
           X_std  = (X_scaled - a) / (b - a)
           X_orig = X_std * (X_max - X_min) + X_min

    -------------------------------------------------------------------------
    KEY PROPERTIES:
    -------------------------------------------------------------------------
    - Bounded Output: Strictly restricted within [feature_range[0], feature_range[1]].
    - Preserves Zeros: Preserves zero entries if min is 0 and feature_range[0] is 0.
    - Outlier Sensitivity: EXTREMELY HIGH. An extreme maximum outlier compresses
      all normal inliers into an indistinguishable, tiny interval near the bottom.
    - Preserves Shape: Relative distances between non-outlier points remain linear.

    -------------------------------------------------------------------------
    WHEN TO USE:
    -------------------------------------------------------------------------
    - Image Data: Rescaling pixel intensities from [0, 255] to [0.0, 1.0].
    - Bounded Algorithms: Neural networks using Sigmoid activations, Multinomial
      Naive Bayes (requires non-negative features), or algorithms sensitive to magnitude.
    - Non-Gaussian Data: When features do NOT follow a bell-shaped normal curve
      and have known, strict real-world boundaries.

    -------------------------------------------------------------------------
    WHEN TO AVOID:
    -------------------------------------------------------------------------
    - Outliers present: Use RobustScaler instead.
    - Zero-centered models: SVM, Logistic/Linear Regression with L1/L2 penalties,
      and PCA perform better with StandardScaler.
    - Sparse matrices: Shifting values by subtracting min destroys zero sparsity
      (use MaxAbsScaler instead).

    Parameters:
        feature_range (tuple of (float, float), default=(0, 1)):
            Desired range of transformed data (min_val, max_val).

    Attributes:
        data_min_ (np.ndarray): Per-feature minimum seen in the training data.
        data_max_ (np.ndarray): Per-feature maximum seen in the training data.
        data_range_ (np.ndarray): Per-feature range (data_max_ - data_min_).
    """

    def __init__(self, feature_range=(0, 1)):
        self.feature_range = feature_range
        self.data_min_ = None
        self.data_max_ = None
        self.data_range_ = None

    def fit(self, X):
        """Compute the minimum, maximum, and range of each feature across training samples.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            self: Fitted scaler instance.
        """
        X = np.asarray(X, dtype=np.float64)

        data_min = np.min(X, axis=0)
        data_max = np.max(X, axis=0)
        data_range = data_max - data_min
        # Handle constant features (range == 0) to avoid division by zero
        data_range[data_range == 0.0] = 1.0

        self.data_min_ = data_min
        self.data_max_ = data_max
        self.data_range_ = data_range
        return self

    def transform(self, X):
        """Scale features of X according to feature_range: [a, b].

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Scaled array of shape (n_samples, n_features).
        """
        if self.data_min_ is None or self.data_max_ is None or self.data_range_ is None:
            raise RuntimeError("This MinMaxScaler instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)

        min_val, max_val = self.feature_range
        X_std = (X - self.data_min_) / self.data_range_
        X_scaled = X_std * (max_val - min_val) + min_val
        return X_scaled

    def fit_transform(self, X):
        """Fit scaler to data, then transform it in one step.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Scaled array.
        """
        return self.fit(X).transform(X)

    def inverse_transform(self, X):
        """Undo the scaling of X, mapping it back from feature_range to original space.

        Args:
            X (np.ndarray or list): Transformed array of shape (n_samples, n_features).

        Returns:
            np.ndarray: Original unscaled array of shape (n_samples, n_features).
        """
        if self.data_min_ is None or self.data_max_ is None or self.data_range_ is None:
            raise RuntimeError("This MinMaxScaler instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)

        min_val, max_val = self.feature_range
        X_std = (X - min_val) / (max_val - min_val)
        X_orig = X_std * self.data_range_ + self.data_min_
        return X_orig


class MeanNormalizer:
    """Mean normalization scaler centering features at 0 and dividing by range.

    -------------------------------------------------------------------------
    CONCEPT & INTUITION:
    -------------------------------------------------------------------------
    Mean Normalization shifts the center of the distribution to zero by
    subtracting the mean (centering), and scales the spread by dividing by the
    full range (max - min).

    Intuition: "Center the data at 0 so positive values represent above-average
    and negative values represent below-average, with the total spread of the
    data bounded to a span of exactly 1.0."

    -------------------------------------------------------------------------
    HOW IT COMPARES TO OTHER SCALERS:
    -------------------------------------------------------------------------
    - vs. MinMaxScaler:
        MinMaxScaler maps everything strictly to [0, 1] (all non-negative).
        MeanNormalizer centers at 0, yielding both positive and negative values.
    - vs. StandardScaler:
        StandardScaler divides by standard deviation (sigma), producing an
        unbounded range (e.g. [-3, +3]).
        MeanNormalizer divides by total range (max - min), strictly bounding
        the total span (max' - min') to exactly 1.0 (typically within [-1, 1]).

    -------------------------------------------------------------------------
    MATHEMATICAL FORMULAS:
    -------------------------------------------------------------------------
    1. Forward transformation:
           x' = (x - mean) / (x_max - x_min)

    2. Inverse transformation (recovering original x):
           x = x' * (x_max - x_min) + mean

    -------------------------------------------------------------------------
    KEY PROPERTIES:
    -------------------------------------------------------------------------
    - Zero-Centered: Resulting mean is strictly 0.0 (mean_new = 0).
    - Fixed Total Span: (x'_max - x'_min) is always exactly 1.0.
    - Resulting Range: Values typically fall within [-1, 1], with exact bounds
      depending on how symmetric the original distribution was around the mean.
    - Outlier Sensitivity: EXTREMELY HIGH. Outliers severely distort both the
      mean (numerator) and the full range (denominator).

    -------------------------------------------------------------------------
    WHEN TO USE:
    -------------------------------------------------------------------------
    - Gradient-based optimization algorithms that converge faster with
      zero-centered data, but where bounded feature ranges are desired.
    - When you want zero to explicitly represent the dataset's average.

    -------------------------------------------------------------------------
    WHEN TO AVOID:
    -------------------------------------------------------------------------
    - Outliers present: Outliers stretch the denominator (range), compressing
      all inliers (use RobustScaler instead).
    - Sparse datasets: Subtracting the mean converts zeros to non-zeros,
      destroying sparsity and blowing up memory (use MaxAbsScaler instead).
    - Standard scikit-learn pipelines: Scikit-learn has no native MeanNormalizer
      class; StandardScaler or MinMaxScaler are more universally expected.

    Attributes:
        mean_ (np.ndarray): Per-feature mean computed across training samples.
        data_min_ (np.ndarray): Per-feature minimum seen in training samples.
        data_max_ (np.ndarray): Per-feature maximum seen in training samples.
        data_range_ (np.ndarray): Per-feature range (data_max_ - data_min_).
    """

    def __init__(self):
        self.mean_ = None
        self.data_min_ = None
        self.data_max_ = None
        self.data_range_ = None

    def fit(self, X):
        """Compute the mean, minimum, maximum, and range across training samples.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            self: Fitted scaler instance.
        """
        X = np.asarray(X, dtype=np.float64)

        self.mean_ = np.mean(X, axis=0)
        self.data_min_ = np.min(X, axis=0)
        self.data_max_ = np.max(X, axis=0)
        self.data_range_ = self.data_max_ - self.data_min_
        # Handle constant features (range == 0) to avoid division by zero
        self.data_range_[self.data_range_ == 0.0] = 1.0

        return self

    def transform(self, X):
        """Center features by subtracting the mean and scale by the range.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Mean-normalized array of shape (n_samples, n_features).
        """
        if self.mean_ is None or self.data_range_ is None:
            raise RuntimeError("This MeanNormalizer instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)
        X_trans = (X - self.mean_) / self.data_range_
        return X_trans

    def fit_transform(self, X):
        """Fit scaler to data, then transform it in one step.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Mean-normalized array.
        """
        return self.fit(X).transform(X)

    def inverse_transform(self, X):
        """Scale back the normalized data to the original scale.

        Args:
            X (np.ndarray or list): Transformed array of shape (n_samples, n_features).

        Returns:
            np.ndarray: Original unscaled array of shape (n_samples, n_features).
        """
        if self.mean_ is None or self.data_range_ is None:
            raise RuntimeError("This MeanNormalizer instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)
        X_orig = X * self.data_range_ + self.mean_
        return X_orig


class MaxAbsScaler:
    """Scale each feature by its maximum absolute value.

    -------------------------------------------------------------------------
    CONCEPT & INTUITION:
    -------------------------------------------------------------------------
    MaxAbsScaler scales each feature individually by dividing each value by the
    maximum absolute value observed for that feature.

    Intuition: "Find the value with the largest magnitude (whether positive or
    negative), map it to +1.0 or -1.0, and scale all other values proportionally
    without shifting the center of the data."

    -------------------------------------------------------------------------
    ZERO-PRESERVATION & THE SPARSITY SUPERPOWER:
    -------------------------------------------------------------------------
    Unlike StandardScaler, MinMaxScaler, or MeanNormalizer, this scaler does
    NOT subtract a mean or minimum (it does not shift data).
    
    Therefore:
        0.0 / scale_ = 0.0 (exact zero remains exact zero)

    Why this matters:
    In sparse datasets (such as NLP TF-IDF matrices or one-hot encoded tables
    where 99% of entries are 0.0), shifting the data turns all zeros into
    non-zero floating point numbers, converting a lightweight sparse matrix
    into a massive dense matrix that can immediately crash your RAM (OOM error).
    MaxAbsScaler preserves matrix sparsity and keeps memory usage minimal.

    -------------------------------------------------------------------------
    UNDERSTANDING max_abs_ VS scale_:
    -------------------------------------------------------------------------
    - max_abs_: The true maximum absolute value observed in the training data:
          max_abs_ = max(|X|)
    - scale_: The safe divisor used in transform(). It is a copy of max_abs_,
      except any 0.0 entries (constant all-zero columns) are replaced with 1.0
      to prevent division-by-zero (0.0 / 0.0 -> NaN) errors.

    -------------------------------------------------------------------------
    MATHEMATICAL FORMULAS:
    -------------------------------------------------------------------------
    1. Forward transformation:
           x' = x / scale_   (maps values into [-1.0, 1.0])

    2. Inverse transformation (recovering original x):
           x = x' * scale_

    -------------------------------------------------------------------------
    KEY PROPERTIES:
    -------------------------------------------------------------------------
    - Bounded Output: Strictly within [-1.0, 1.0].
    - Preserves Sparsity: Zeros remain strictly 0.0.
    - Zero-Centered: No (does not shift the data unless data was already centered).
    - Outlier Sensitivity: High (a massive outlier becomes the denominator,
      compressing all normal inliers toward zero).

    -------------------------------------------------------------------------
    WHEN TO USE:
    -------------------------------------------------------------------------
    - Sparse datasets: Text classification (TF-IDF, Bag-of-Words), user-item
      matrices in recommendation systems.
    - Already zero-centered data where you want to bound values to [-1, 1]
      without destroying the zero mean.

    -------------------------------------------------------------------------
    WHEN TO AVOID:
    -------------------------------------------------------------------------
    - Data with extreme outliers: Use RobustScaler instead.
    - Algorithms requiring unit variance (sigma = 1) or zero-centering:
      Use StandardScaler instead.
    - Algorithms requiring strictly non-negative bounds [0, 1]:
      Use MinMaxScaler instead.

    Attributes:
        max_abs_ (np.ndarray): Per-feature maximum absolute value.
        scale_ (np.ndarray): Per-feature safe scaling factor (zeros replaced with 1.0).
    """

    def __init__(self):
        self.max_abs_ = None
        self.scale_ = None

    def fit(self, X):
        """Compute the maximum absolute value and safe scaling factor for each feature.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            self: Fitted scaler instance.
        """
        X = np.asarray(X, dtype=np.float64)

        self.max_abs_ = np.max(np.abs(X), axis=0)
        # Use .copy() so mutating scale_ does NOT modify max_abs_ in-place
        self.scale_ = self.max_abs_.copy()
        # Handle constant zero features (max_abs_ == 0) to avoid division by zero
        self.scale_[self.scale_ == 0.0] = 1.0

        return self

    def transform(self, X):
        """Scale the data by dividing by the safe scale_ factor.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Scaled array bounded within [-1.0, 1.0].
        """
        if self.scale_ is None:
            raise RuntimeError("This MaxAbsScaler instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)
        X_scaled = X / self.scale_
        return X_scaled

    def fit_transform(self, X):
        """Fit scaler to data, then transform it in one step.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Scaled array.
        """
        return self.fit(X).transform(X)

    def inverse_transform(self, X):
        """Scale back the data to the original representation.

        Args:
            X (np.ndarray or list): Transformed array of shape (n_samples, n_features).

        Returns:
            np.ndarray: Original unscaled array of shape (n_samples, n_features).
        """
        if self.scale_ is None:
            raise RuntimeError("This MaxAbsScaler instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)
        X_orig = X * self.scale_
        return X_orig


class RobustScaler:
    """Scale features using statistics that are robust to outliers (Median and IQR).

    -------------------------------------------------------------------------
    CONCEPT & INTUITION:
    -------------------------------------------------------------------------
    When data contains extreme outliers, traditional scalers fail:
    - StandardScaler: Outliers drastically inflate the mean and variance.
    - MinMaxScaler: Outliers push max to extreme limits, squashing all normal
      inliers into an indistinguishable narrow band.

    RobustScaler solves this by using rank/order statistics that are immune
    to extreme tails:
    - Center = Median (50th percentile): The robust midpoint.
    - Scale  = Interquartile Range (IQR = Q3 - Q1): The spread of the middle 50%.

    Intuition: "Ignore the bottom 25% and top 25% when calculating the spread.
    Scale based purely on how the central 50% of the data behaves, so that
    extreme outliers do not distort the scale of regular inliers."

    -------------------------------------------------------------------------
    MATHEMATICAL FORMULAS:
    -------------------------------------------------------------------------
    1. Robust Statistics:
           center_ = Median(X) = Q2 (50th percentile)
           scale_  = IQR(X) = Q3 (75th percentile) - Q1 (25th percentile)

    2. Forward transformation:
           x' = (x - center_) / scale_
           x' = (x - Median) / (Q3 - Q1)

    3. Inverse transformation (recovering original x):
           x = x' * scale_ + center_

    -------------------------------------------------------------------------
    KEY PROPERTIES:
    -------------------------------------------------------------------------
    - Outlier Resilience: EXTREMELY HIGH. Outliers outside the [Q1, Q3] range
      have zero influence on center_ and scale_.
    - Range: Unbounded (-inf, +inf). The middle 50% of data is scaled into
      approximately [-0.5, 0.5] (or span of 1.0), while outliers retain large
      proportional values without compressing the inliers.
    - Centered at: Median = 0.0 (not mean).
    - Sparsity: Centering subtracts the median, which turns zeros into non-zeros
      and destroys sparse matrix representation. For sparse data, set
      with_centering=False.

    -------------------------------------------------------------------------
    WHEN TO USE:
    -------------------------------------------------------------------------
    - Datasets with severe outliers that cannot or should not be removed:
        - Financial fraud detection (typical spend $10-$100, fraud spikes to $50,000)
        - Income data (regular earners vs. billionaires)
        - Real estate prices (normal houses vs. multi-million mansions)
        - Server response latency (normal 20ms vs. 30,000ms timeout spikes)

    -------------------------------------------------------------------------
    WHEN TO AVOID:
    -------------------------------------------------------------------------
    - Normally distributed data without outliers: StandardScaler is mathematically
      more optimal and has higher statistical efficiency.
    - Algorithms requiring strict bounded positive values [0, 1]:
      MinMaxScaler is required instead.

    Parameters:
        with_centering (bool, default=True):
            If True, center the data by subtracting the median before scaling.
        with_scaling (bool, default=True):
            If True, scale the data to interquartile range.
        quantile_range (tuple of (float, float), default=(25.0, 75.0)):
            Quantile range used to calculate scale_. Default is the IQR (25.0, 75.0).

    Attributes:
        center_ (np.ndarray): The median value for each feature.
        scale_ (np.ndarray): The interquartile range (IQR) for each feature.
    """

    def __init__(self, with_centering=True, with_scaling=True, quantile_range=(25.0, 75.0)):
        self.with_centering = with_centering
        self.with_scaling = with_scaling
        self.quantile_range = quantile_range
        self.center_ = None
        self.scale_ = None

    def fit(self, X):
        """Compute the median and interquartile range for scaling.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            self: Fitted scaler instance.
        """
        X = np.asarray(X, dtype=np.float64)

        if self.with_centering:
            self.center_ = np.median(X, axis=0)
        else:
            self.center_ = None

        if self.with_scaling:
            q_min, q_max = self.quantile_range
            q = np.percentile(X, (q_min, q_max), axis=0)
            quantiles = q[1] - q[0]
            # Handle constant features (IQR == 0) to avoid division by zero
            quantiles[quantiles == 0.0] = 1.0
            self.scale_ = quantiles
        else:
            self.scale_ = None

        return self

    def transform(self, X):
        """Center and scale the data using robust statistics.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Robust-scaled array of shape (n_samples, n_features).
        """
        if self.with_centering and self.center_ is None:
            raise RuntimeError("This RobustScaler instance is not fitted yet. Call 'fit' before using this method.")
        if self.with_scaling and self.scale_ is None:
            raise RuntimeError("This RobustScaler instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)
        X_trans = X.copy()

        if self.with_centering and self.center_ is not None:
            X_trans = X_trans - self.center_

        if self.with_scaling and self.scale_ is not None:
            X_trans = X_trans / self.scale_

        return X_trans

    def fit_transform(self, X):
        """Fit scaler to data, then transform it in one step.

        Args:
            X (np.ndarray or list): Array-like of shape (n_samples, n_features).

        Returns:
            np.ndarray: Robust-scaled array.
        """
        return self.fit(X).transform(X)

    def inverse_transform(self, X):
        """Scale back the robust-scaled data to the original representation.

        Args:
            X (np.ndarray or list): Transformed array of shape (n_samples, n_features).

        Returns:
            np.ndarray: Original unscaled array of shape (n_samples, n_features).
        """
        if self.with_centering and self.center_ is None:
            raise RuntimeError("This RobustScaler instance is not fitted yet. Call 'fit' before using this method.")
        if self.with_scaling and self.scale_ is None:
            raise RuntimeError("This RobustScaler instance is not fitted yet. Call 'fit' before using this method.")

        X = np.asarray(X, dtype=np.float64)
        X_orig = X.copy()

        if self.with_scaling and self.scale_ is not None:
            X_orig = X_orig * self.scale_

        if self.with_centering and self.center_ is not None:
            X_orig = X_orig + self.center_

        return X_orig
