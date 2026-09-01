import json
import os
import numpy as np

def generate_toy_data():
    np.random.seed(42)
    n_samples = 80
    
    # 4 numeric features
    f1 = np.round(np.random.uniform(10.0, 90.0, n_samples), 2)
    f2 = np.round(np.random.uniform(1.0, 10.0, n_samples), 2)
    f3 = np.random.randint(1, 6, n_samples)
    f4 = np.round(np.random.normal(0.0, 1.5, n_samples), 2)
    
    # Linear target with some noise: y = 2.5*f1 + 4.0*f2 - 3.0*f3 + 1.5*f4 + noise
    noise = np.random.normal(0, 5, n_samples)
    target_reg = np.round(2.5 * f1 + 4.0 * f2 - 3.0 * f3 + 1.5 * f4 + 10.0 + noise, 2)
    
    # Binary classification target (0 or 1 based on linear boundary with probability)
    logits = (f1 - 50.0) * 0.05 + (f2 - 5.0) * 0.3 - (f3 - 3.0) * 0.2
    prob = 1 / (1 + np.exp(-logits))
    target_bin = (prob >= 0.5).astype(int)
    
    # Multiclass classification target (0, 1, 2)
    target_multi = np.zeros(n_samples, dtype=int)
    for i in range(n_samples):
        if f1[i] < 35:
            target_multi[i] = 0
        elif f1[i] < 65:
            target_multi[i] = 1
        else:
            target_multi[i] = 2

    records = []
    for i in range(n_samples):
        records.append({
            "id": i + 1,
            "feature_1": float(f1[i]),
            "feature_2": float(f2[i]),
            "feature_3": int(f3[i]),
            "feature_4": float(f4[i]),
            "target_regression": float(target_reg[i]),
            "target_binary": int(target_bin[i]),
            "target_multiclass": int(target_multi[i])
        })
        
    return {
        "metadata": {
            "name": "Unified Multi-Task Toy Dataset",
            "description": "Multi-purpose toy dataset for regression, binary classification, multiclass classification, clustering, and PCA.",
            "num_samples": n_samples,
            "features": ["feature_1", "feature_2", "feature_3", "feature_4"],
            "targets": {
                "target_regression": "Continuous numerical target for Linear Regression",
                "target_binary": "Binary (0/1) target for Logistic Regression",
                "target_multiclass": "Multiclass (0/1/2) target for k-NN, Naive Bayes, Decision Trees"
            }
        },
        "data": records
    }

if __name__ == "__main__":
    os.makedirs("data", exist_ok=True)
    dataset = generate_toy_data()
    json_path = os.path.join("data", "toy_dataset.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)
    print(f"Generated {json_path} successfully ({len(dataset['data'])} records).")
