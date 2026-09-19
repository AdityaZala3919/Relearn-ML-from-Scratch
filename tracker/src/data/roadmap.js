/**
 * ML / DL Learning Roadmap - Master Canonical Data
 * 
 * Defines all 15 sections, 150+ topics, default checklists (algorithmic vs conceptual),
 * and curated learning resources.
 */

export const ROADMAP_SECTIONS = [
  {
    id: "sec-ml-foundations",
    title: "1. ML Foundations",
    description: "Core paradigm, data structures, loss formulations, optimization, and generalization.",
    topics: [
      {
        id: "ml-foundations-what-is-ml",
        title: "What is Machine Learning?",
        type: "concept",
        resources: [
          { id: "res-1", title: "Introduction to Machine Learning with Python (Ch. 1)", url: "https://www.oreilly.com/library/view/introduction-to-machine/9781449369880/", type: "Book" }
        ]
      },
      {
        id: "ml-foundations-learning-paradigms",
        title: "Learning paradigms",
        type: "concept",
        resources: []
      },
      {
        id: "ml-foundations-data-features-targets",
        title: "Data, features and targets",
        type: "concept",
        resources: []
      },
      {
        id: "ml-foundations-train-val-test",
        title: "Training / validation / test sets",
        type: "concept",
        resources: []
      },
      {
        id: "ml-foundations-loss-functions",
        title: "Loss functions",
        type: "concept",
        resources: []
      },
      {
        id: "ml-foundations-optimization-basics",
        title: "Optimization basics",
        type: "concept",
        resources: []
      },
      {
        id: "ml-foundations-linear-algebra-anchors",
        title: "Linear Algebra Anchors (Eigendecomposition & SVD)",
        type: "concept",
        resources: [
          { id: "res-la-3b1b", title: "Essence of Linear Algebra (3Blue1Brown)", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", type: "Video" }
        ]
      },
      {
        id: "ml-foundations-vector-calculus-jacobian",
        title: "Vector & Matrix Calculus (Gradients & The Jacobian)",
        type: "concept",
        resources: [
          { id: "res-calc-matrix", title: "The Matrix Calculus You Need for Deep Learning (Parr & Howard)", url: "https://arxiv.org/abs/1802.01528", type: "Paper" }
        ]
      },
      {
        id: "ml-foundations-information-theory",
        title: "Information Theory (Entropy & KL Divergence)",
        type: "concept",
        resources: [
          { id: "res-info-theory", title: "Visual Information Theory (Chris Olah)", url: "https://colah.github.io/posts/2015-09-Visual-Information/", type: "Article" }
        ]
      },
      {
        id: "ml-foundations-generalization",
        title: "Generalization",
        type: "concept",
        resources: []
      },
      {
        id: "ml-foundations-ml-workflow",
        title: "Machine learning workflow",
        type: "concept",
        resources: []
      }
    ]
  },
  {
    id: "sec-supervised-learning",
    title: "2. Supervised Learning",
    description: "Classical regression, classification, margin classifiers, trees, and ensemble methods.",
    topics: [
      {
        id: "supervised-linear-regression",
        title: "Linear Regression",
        type: "algorithm",
        isCoreImplementation: true,
        resources: [
          { id: "res-lr-1", title: "Introduction to Machine Learning with Python (Ch. 2)", url: "https://github.com/amueller/introduction_to_ml_with_python", type: "Book" }
        ]
      },
      {
        id: "supervised-logistic-regression",
        title: "Logistic Regression",
        type: "algorithm",
        isCoreImplementation: true,
        resources: [
          { id: "res-log-1", title: "Introduction to Machine Learning with Python (Ch. 2)", url: "https://github.com/amueller/introduction_to_ml_with_python", type: "Book" }
        ]
      },
      {
        id: "supervised-knn",
        title: "k-Nearest Neighbors",
        type: "algorithm",
        isCoreImplementation: true,
        resources: [
          { id: "res-knn-1", title: "Introduction to Machine Learning with Python (Ch. 2)", url: "https://github.com/amueller/introduction_to_ml_with_python", type: "Book" }
        ]
      },
      {
        id: "supervised-naive-bayes",
        title: "Naive Bayes",
        type: "algorithm",
        isCoreImplementation: true,
        resources: [
          { id: "res-nb-1", title: "Introduction to Machine Learning with Python (Ch. 2)", url: "https://github.com/amueller/introduction_to_ml_with_python", type: "Book" }
        ]
      },
      {
        id: "supervised-decision-trees",
        title: "Decision Trees",
        type: "algorithm",
        isCoreImplementation: true,
        resources: [
          { id: "res-dt-1", title: "Introduction to Machine Learning with Python (Ch. 2)", url: "https://github.com/amueller/introduction_to_ml_with_python", type: "Book" }
        ]
      },
      {
        id: "supervised-random-forests",
        title: "Random Forests",
        type: "algorithm",
        resources: []
      },
      {
        id: "supervised-svm",
        title: "Support Vector Machines",
        type: "algorithm",
        resources: []
      },
      {
        id: "supervised-ensemble-methods",
        title: "Ensemble Methods",
        type: "concept",
        resources: []
      },
      {
        id: "supervised-bagging",
        title: "Bagging",
        type: "concept",
        resources: []
      },
      {
        id: "supervised-boosting",
        title: "Boosting",
        type: "concept",
        resources: []
      },
      {
        id: "supervised-gradient-boosting",
        title: "Gradient Boosting",
        type: "algorithm",
        resources: []
      },
      {
        id: "supervised-loss-surfaces-convexity",
        title: "Convex vs. Non-Convex Loss Surfaces",
        type: "concept",
        resources: []
      },
      {
        id: "supervised-geometry-of-regularization",
        title: "The Geometry of Regularization (L1 Diamond vs. L2 Sphere)",
        type: "concept",
        resources: []
      }
    ]
  },
  {
    id: "sec-unsupervised-learning",
    title: "3. Unsupervised Learning",
    description: "Clustering, dimensionality reduction, projection, and manifold discovery.",
    topics: [
      {
        id: "unsupervised-kmeans",
        title: "k-Means",
        type: "algorithm",
        isCoreImplementation: true,
        resources: [
          { id: "res-km-1", title: "Introduction to Machine Learning with Python (Ch. 3)", url: "https://github.com/amueller/introduction_to_ml_with_python", type: "Book" }
        ]
      },
      {
        id: "unsupervised-hierarchical-clustering",
        title: "Hierarchical Clustering",
        type: "algorithm",
        resources: []
      },
      {
        id: "unsupervised-dbscan",
        title: "DBSCAN",
        type: "algorithm",
        resources: []
      },
      {
        id: "unsupervised-pca",
        title: "PCA",
        type: "algorithm",
        isCoreImplementation: true,
        resources: [
          { id: "res-pca-1", title: "Introduction to Machine Learning with Python (Ch. 3)", url: "https://github.com/amueller/introduction_to_ml_with_python", type: "Book" }
        ]
      },
      {
        id: "unsupervised-dimensionality-reduction",
        title: "Dimensionality Reduction",
        type: "concept",
        resources: []
      },
      {
        id: "unsupervised-feature-extraction",
        title: "Feature Extraction",
        type: "concept",
        resources: []
      }
    ]
  },
  {
    id: "sec-model-evaluation",
    title: "4. Model Evaluation & Improvement",
    description: "Diagnostic theory, cross validation, metrics, error analysis, and tuning.",
    topics: [
      { id: "eval-overfitting", title: "Overfitting", type: "concept", resources: [] },
      { id: "eval-underfitting", title: "Underfitting", type: "concept", resources: [] },
      { id: "eval-bias", title: "Bias", type: "concept", resources: [] },
      { id: "eval-variance", title: "Variance", type: "concept", resources: [] },
      { id: "eval-bias-variance-tradeoff", title: "Bias-Variance Tradeoff", type: "concept", resources: [] },
      { id: "eval-cross-validation", title: "Cross Validation", type: "concept", resources: [] },
      { id: "eval-train-val-test-methodology", title: "Train / Validation / Test methodology", type: "concept", resources: [] },
      { id: "eval-classification-metrics", title: "Classification Metrics", type: "concept", resources: [] },
      { id: "eval-regression-metrics", title: "Regression Metrics", type: "concept", resources: [] },
      { id: "eval-confusion-matrix", title: "Confusion Matrix", type: "concept", resources: [] },
      { id: "eval-hyperparameter-tuning", title: "Hyperparameter Tuning", type: "concept", resources: [] },
      { id: "eval-regularization", title: "Regularization", type: "concept", resources: [] },
      { id: "eval-data-leakage", title: "Data Leakage", type: "concept", resources: [] },
      { id: "eval-model-selection", title: "Model Selection", type: "concept", resources: [] },
      { id: "eval-pr-auc-vs-roc-auc", title: "PR-AUC vs. ROC-AUC for Imbalanced Data", type: "concept", resources: [] },
      { id: "eval-model-calibration", title: "Model Calibration & Reliability Diagrams", type: "concept", resources: [] }
    ]
  },
  {
    id: "sec-probabilistic-advanced-ml",
    title: "5. Probabilistic & Advanced ML",
    description: "Bayesian principles, likelihood estimation, EM, Gaussian processes, and kernels.",
    topics: [
      { id: "prob-probability-for-ml", title: "Probability for Machine Learning", type: "concept", resources: [] },
      { id: "prob-mle", title: "Maximum Likelihood Estimation", type: "concept", resources: [] },
      { id: "prob-map", title: "Maximum A Posteriori Estimation", type: "concept", resources: [] },
      { id: "prob-bayesian-methods", title: "Bayesian Methods", type: "concept", resources: [] },
      { id: "prob-bayesian-networks", title: "Bayesian Networks", type: "concept", resources: [] },
      { id: "prob-expectation-maximization", title: "Expectation-Maximization", type: "algorithm", resources: [] },
      { id: "prob-gaussian-processes", title: "Gaussian Processes", type: "algorithm", resources: [] },
      { id: "prob-kernel-methods", title: "Kernel Methods", type: "concept", resources: [] },
      { id: "prob-kernel-pca", title: "Kernel PCA", type: "algorithm", resources: [] },
      { id: "prob-latent-variable-models", title: "Latent Variable Models", type: "concept", resources: [] }
    ]
  },
  {
    id: "sec-feature-engineering",
    title: "6. Feature Engineering",
    description: "Data cleaning, imputation, encodings, transformations, and end-to-end pipelines.",
    topics: [
      { id: "feat-data-cleaning", title: "Data Cleaning", type: "concept", resources: [] },
      { id: "feat-missing-values", title: "Missing Values", type: "concept", resources: [] },
      { id: "feat-categorical-variables", title: "Categorical Variables", type: "concept", resources: [] },
      { id: "feat-encoding", title: "Encoding", type: "concept", resources: [] },
      { id: "feat-feature-scaling", title: "Feature Scaling", type: "concept", resources: [] },
      { id: "feat-feature-transformation", title: "Feature Transformation", type: "concept", resources: [] },
      { id: "feat-feature-engineering", title: "Feature Engineering", type: "concept", resources: [] },
      { id: "feat-feature-selection", title: "Feature Selection", type: "concept", resources: [] },
      { id: "feat-feature-extraction", title: "Feature Extraction", type: "concept", resources: [] },
      { id: "feat-ml-pipelines", title: "ML Pipelines", type: "concept", resources: [] }
    ]
  },
  {
    id: "sec-neural-network-foundations",
    title: "7. Neural Network Foundations",
    description: "Neurons, activations, perceptrons, MLP, forward prop, backpropagation, and training.",
    topics: [
      { id: "nn-artificial-neuron", title: "Artificial Neuron", type: "concept", resources: [] },
      { id: "nn-perceptron", title: "Perceptron", type: "algorithm", resources: [] },
      { id: "nn-activation-functions", title: "Activation Functions", type: "concept", resources: [] },
      { id: "nn-feedforward-neural-networks", title: "Feedforward Neural Networks", type: "concept", resources: [] },
      { id: "nn-multilayer-perceptron", title: "Multilayer Perceptron", type: "algorithm", resources: [] },
      { id: "nn-forward-propagation", title: "Forward Propagation", type: "concept", resources: [] },
      { id: "nn-loss-functions-for-nn", title: "Loss Functions for Neural Networks", type: "concept", resources: [] },
      { id: "nn-backpropagation", title: "Backpropagation", type: "algorithm", resources: [] },
      { id: "nn-chain-rule", title: "Chain Rule in Backpropagation", type: "concept", resources: [] },
      { id: "nn-gradient-descent", title: "Gradient Descent", type: "algorithm", resources: [] },
      { id: "nn-neural-network-training", title: "Neural Network Training", type: "concept", resources: [] }
    ]
  },
  {
    id: "sec-deep-learning-fundamentals",
    title: "8. Deep Learning Fundamentals",
    description: "Optimizers, learning rate schedules, normalization, dropout, and vanishing gradients.",
    topics: [
      { id: "dl-mini-batch-gd", title: "Mini-batch Gradient Descent", type: "algorithm", resources: [] },
      { id: "dl-sgd", title: "Stochastic Gradient Descent", type: "algorithm", resources: [] },
      { id: "dl-momentum", title: "Momentum", type: "concept", resources: [] },
      { id: "dl-adam", title: "Adam", type: "algorithm", resources: [] },
      { id: "dl-learning-rate", title: "Learning Rate", type: "concept", resources: [] },
      { id: "dl-learning-rate-schedules", title: "Learning Rate Schedules", type: "concept", resources: [] },
      { id: "dl-weight-initialization", title: "Weight Initialization", type: "concept", resources: [] },
      { id: "dl-batch-normalization", title: "Batch Normalization", type: "concept", resources: [] },
      { id: "dl-layer-normalization", title: "Layer Normalization", type: "concept", resources: [] },
      { id: "dl-dropout", title: "Dropout", type: "concept", resources: [] },
      { id: "dl-weight-decay", title: "Weight Decay", type: "concept", resources: [] },
      { id: "dl-vanishing-gradients", title: "Vanishing Gradients", type: "concept", resources: [] },
      { id: "dl-exploding-gradients", title: "Exploding Gradients", type: "concept", resources: [] },
      { id: "dl-transfer-learning", title: "Transfer Learning", type: "concept", resources: [] }
    ]
  },
  {
    id: "sec-computer-vision",
    title: "9. Computer Vision",
    description: "Convolutions, CNN architectures, ResNet, detection, segmentation, and vision transformers.",
    topics: [
      { id: "cv-convolution", title: "Convolution", type: "concept", resources: [] },
      { id: "cv-cnn", title: "CNN", type: "algorithm", resources: [] },
      { id: "cv-pooling", title: "Pooling", type: "concept", resources: [] },
      { id: "cv-cnn-architectures", title: "CNN Architectures", type: "concept", resources: [] },
      { id: "cv-resnet", title: "ResNet", type: "algorithm", resources: [] },
      { id: "cv-image-classification", title: "Image Classification", type: "concept", resources: [] },
      { id: "cv-object-detection", title: "Object Detection", type: "concept", resources: [] },
      { id: "cv-semantic-segmentation", title: "Semantic Segmentation", type: "concept", resources: [] },
      { id: "cv-image-embeddings", title: "Image Embeddings", type: "concept", resources: [] },
      { id: "cv-vision-transformers", title: "Vision Transformers", type: "algorithm", resources: [] },
      { id: "cv-vision-language-models", title: "Vision-Language Models", type: "concept", resources: [] }
    ]
  },
  {
    id: "sec-sequence-models",
    title: "10. Sequence Models",
    description: "Recurrence, vanishing gradients in time, LSTM, GRU, and Seq2Seq architectures.",
    topics: [
      { id: "seq-rnn", title: "Recurrent Neural Networks", type: "algorithm", resources: [] },
      { id: "seq-vanishing-gradients-rnn", title: "Vanishing Gradients in RNNs", type: "concept", resources: [] },
      { id: "seq-lstm", title: "LSTM", type: "algorithm", resources: [] },
      { id: "seq-gru", title: "GRU", type: "algorithm", resources: [] },
      { id: "seq-sequence-to-sequence", title: "Sequence-to-Sequence", type: "concept", resources: [] },
      { id: "seq-encoder-decoder", title: "Encoder-Decoder Architecture", type: "concept", resources: [] }
    ]
  },
  {
    id: "sec-attention-transformers",
    title: "11. Attention & Transformers",
    description: "Self-attention, multi-head attention, positional encoding, and transformer blocks.",
    topics: [
      { id: "tf-attention", title: "Attention", type: "concept", resources: [] },
      { id: "tf-qkv", title: "Query / Key / Value", type: "concept", resources: [] },
      { id: "tf-attention-scores", title: "Attention Scores", type: "concept", resources: [] },
      { id: "tf-scaled-dot-product", title: "Scaled Dot-Product Attention", type: "concept", resources: [] },
      { id: "tf-self-attention", title: "Self-Attention", type: "concept", resources: [] },
      { id: "tf-cross-attention", title: "Cross-Attention", type: "concept", resources: [] },
      { id: "tf-multi-head-attention", title: "Multi-Head Attention", type: "algorithm", resources: [] },
      { id: "tf-positional-encoding", title: "Positional Encoding", type: "concept", resources: [] },
      {
        id: "tf-transformer-architecture",
        title: "Transformer Architecture",
        type: "algorithm",
        resources: [
          { id: "res-att-paper", title: "Attention Is All You Need (Vaswani et al.)", url: "https://arxiv.org/abs/1706.03762", type: "Paper" }
        ]
      },
      { id: "tf-transformer-encoder", title: "Transformer Encoder", type: "concept", resources: [] },
      { id: "tf-transformer-decoder", title: "Transformer Decoder", type: "concept", resources: [] },
      { id: "tf-residual-connections", title: "Residual Connections", type: "concept", resources: [] },
      { id: "tf-layer-normalization", title: "Layer Normalization", type: "concept", resources: [] },
      { id: "tf-feed-forward-network", title: "Feed-Forward Network", type: "concept", resources: [] },
      { id: "tf-causal-masking", title: "Causal Masking", type: "concept", resources: [] },
      { id: "tf-autoregressive-lm", title: "Autoregressive Language Modeling", type: "concept", resources: [] },
      {
        id: "tf-flash-attention",
        title: "FlashAttention & GPU SRAM Tiling",
        type: "algorithm",
        resources: [
          { id: "res-flash-att-paper", title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (Dao et al.)", url: "https://arxiv.org/abs/2205.14135", type: "Paper" }
        ]
      }
    ]
  },
  {
    id: "sec-representation-generative",
    title: "12. Representation & Generative Learning",
    description: "Autoencoders, VAEs, GANs, self-supervised representation, and diffusion models.",
    topics: [
      { id: "rep-representation-learning", title: "Representation Learning", type: "concept", resources: [] },
      { id: "rep-autoencoders", title: "Autoencoders", type: "algorithm", resources: [] },
      { id: "rep-vae", title: "Variational Autoencoders", type: "algorithm", resources: [] },
      { id: "rep-gans", title: "GANs", type: "algorithm", resources: [] },
      { id: "rep-self-supervised-learning", title: "Self-Supervised Learning", type: "concept", resources: [] },
      { id: "rep-contrastive-learning", title: "Contrastive Learning", type: "concept", resources: [] },
      { id: "rep-diffusion-models", title: "Diffusion Models", type: "algorithm", resources: [] }
    ]
  },
  {
    id: "sec-llm-foundations",
    title: "13. LLM Foundations",
    description: "Tokenization, pretraining, GPT/BERT paradigms, instruction tuning, RLHF, and inference.",
    topics: [
      { id: "llm-language-modeling", title: "Language Modeling", type: "concept", resources: [] },
      { id: "llm-tokenization", title: "Tokenization", type: "concept", resources: [] },
      { id: "llm-token-embeddings", title: "Token Embeddings", type: "concept", resources: [] },
      { id: "llm-positional-representations", title: "Positional Representations", type: "concept", resources: [] },
      { id: "llm-gpt-style-models", title: "GPT-style Models", type: "concept", resources: [] },
      { id: "llm-bert-style-models", title: "BERT-style Models", type: "concept", resources: [] },
      { id: "llm-pretraining", title: "Pretraining", type: "concept", resources: [] },
      { id: "llm-fine-tuning", title: "Fine-Tuning", type: "concept", resources: [] },
      { id: "llm-instruction-tuning", title: "Instruction Tuning", type: "concept", resources: [] },
      { id: "llm-preference-optimization", title: "Preference Optimization", type: "concept", resources: [] },
      { id: "llm-rlhf", title: "RLHF", type: "concept", resources: [] },
      { id: "llm-inference", title: "LLM Inference", type: "concept", resources: [] },
      {
        id: "llm-kv-cache",
        title: "The KV Cache Architecture",
        type: "algorithm",
        resources: [
          { id: "res-kv-expl", title: "Transformers KV Caching Explained", url: "https://kipp.ly/transformer-inference-scaling/", type: "Article" }
        ]
      },
      {
        id: "llm-roofline-memory-vs-compute",
        title: "Memory-Bound vs. Compute-Bound Inference (Roofline Model)",
        type: "concept",
        resources: []
      },
      {
        id: "llm-quantization-foundations",
        title: "Quantization Foundations (FP16, BF16, INT8, INT4)",
        type: "concept",
        resources: [
          { id: "res-quant-tim", title: "A Visual Guide to Quantization (Tim Dettmers)", url: "https://timdettmers.com/2022/08/17/llm-int8-and-emergent-features/", type: "Article" }
        ]
      }
    ]
  },
  {
    id: "sec-reinforcement-learning",
    title: "14. Reinforcement Learning",
    description: "MDPs, value & policy iterations, Bellman equations, Q-Learning, and Policy Gradients.",
    topics: [
      { id: "rl-mdp", title: "Markov Decision Processes", type: "concept", resources: [] },
      { id: "rl-states", title: "States", type: "concept", resources: [] },
      { id: "rl-actions", title: "Actions", type: "concept", resources: [] },
      { id: "rl-rewards", title: "Rewards", type: "concept", resources: [] },
      { id: "rl-policies", title: "Policies", type: "concept", resources: [] },
      { id: "rl-value-functions", title: "Value Functions", type: "concept", resources: [] },
      { id: "rl-q-functions", title: "Q Functions", type: "concept", resources: [] },
      { id: "rl-bellman-equation", title: "Bellman Equation", type: "concept", resources: [] },
      { id: "rl-q-learning", title: "Q-Learning", type: "algorithm", resources: [] },
      { id: "rl-sarsa", title: "SARSA", type: "algorithm", resources: [] },
      { id: "rl-policy-gradients", title: "Policy Gradients", type: "algorithm", resources: [] },
      { id: "rl-actor-critic", title: "Actor-Critic", type: "algorithm", resources: [] }
    ]
  },
  {
    id: "sec-practical-ml-dl",
    title: "15. Practical ML / DL",
    description: "EDA, experiment tracking, model versioning, serving, monitoring, and production drift.",
    topics: [
      { id: "prac-eda", title: "Exploratory Data Analysis", type: "concept", resources: [] },
      { id: "prac-experiment-tracking", title: "Experiment Tracking", type: "concept", resources: [] },
      { id: "prac-reproducibility", title: "Reproducibility", type: "concept", resources: [] },
      { id: "prac-model-versioning", title: "Model Versioning", type: "concept", resources: [] },
      { id: "prac-data-versioning", title: "Data Versioning", type: "concept", resources: [] },
      { id: "prac-model-serving", title: "Model Serving", type: "concept", resources: [] },
      { id: "prac-batch-inference", title: "Batch Inference", type: "concept", resources: [] },
      { id: "prac-online-inference", title: "Online Inference", type: "concept", resources: [] },
      { id: "prac-model-monitoring", title: "Model Monitoring", type: "concept", resources: [] },
      { id: "prac-data-drift", title: "Data Drift", type: "concept", resources: [] },
      { id: "prac-model-drift", title: "Model Drift", type: "concept", resources: [] },
      { id: "prac-end-to-end-projects", title: "End-to-End ML Projects", type: "concept", resources: [] }
    ]
  }
];

/**
 * Standard implementation milestones for from-scratch tracking
 */
export const CORE_IMPLEMENTATION_IDS = [
  "supervised-linear-regression",
  "supervised-logistic-regression",
  "supervised-knn",
  "supervised-naive-bayes",
  "supervised-decision-trees",
  "unsupervised-kmeans",
  "unsupervised-pca"
];

/**
 * Generates default checklist items appropriate for a topic
 */
export function getDefaultChecklistForTopic(topic) {
  if (topic.type === "algorithm") {
    return {
      knowledge: [
        { id: "k_intuition", label: "Understand intuition" },
        { id: "k_math", label: "Understand mathematical formulation" },
        { id: "k_training", label: "Understand loss function & training procedure" },
        { id: "k_tradeoffs", label: "Understand strengths and limitations" },
        { id: "k_explain", label: "Explain without notes" }
      ],
      practical: [
        { id: "p_concept", label: "Concept understood" },
        { id: "p_scratch", label: "From-scratch implementation" },
        { id: "p_toy", label: "Tested on toy data" },
        { id: "p_library", label: "Compared against sklearn / library" },
        { id: "p_real", label: "Tested on real dataset" }
      ]
    };
  }

  // Conceptual topics
  return {
    knowledge: [
      { id: "k_intuition", label: "Understand core intuition" },
      { id: "k_formulation", label: "Understand theoretical formulation" },
      { id: "k_example", label: "Explain with a concrete example" },
      { id: "k_explain", label: "Explain without notes" }
    ],
    practical: [
      { id: "p_experiment", label: "Experiment or visualize behavior in code" }
    ]
  };
}

/**
 * Helper to flat lookup topic by ID
 */
export const TOPIC_MAP = new Map();
export const SECTION_MAP = new Map();

ROADMAP_SECTIONS.forEach(sec => {
  SECTION_MAP.set(sec.id, sec);
  sec.topics.forEach(t => {
    TOPIC_MAP.set(t.id, { ...t, sectionId: sec.id, sectionTitle: sec.title });
  });
});
