# Implementation Plan: ML / DL Learning Roadmap

A personal interactive ML/DL knowledge roadmap + practical implementation tracker for an AI engineer rebuilding foundations systematically from Classical ML → Advanced ML → Neural Networks → Deep Learning → Transformers → LLMs.

Based strictly on **`prompt.md`** and **`brainstorming.md`**.

---

## 1. Product Philosophy & Core Principles

- **Knowledge & Skills, Not Tasks**: A topic (e.g., "Logistic Regression") is something to progressively understand, implement from scratch, experiment with, and consider "Solid".
- **Independent Dimensions**:
  1. **Knowledge Status**: `NOT STARTED` (0%), `LEARNING` (33%), `FAMILIAR` (66%), `SOLID` (100%).
  2. **Practical Implementation**: Hands-on milestones (Concept understood, From-scratch implementation, Tested on toy data, Compared against sklearn, Tested on real dataset).
  3. **Review Status**: `Needs Review` (boolean flag independent of knowledge status).
  4. **Current Focus**: Exactly one topic highlighted as the active learning target.
  5. **Knowledge Gaps**: Questions captured during study, prioritized (`High` 🔴, `Medium` 🟡, `Low` 🟢), linked to topics.
- **Single Source of Truth**: The roadmap topics data model is the single source of truth. Checking an implementation milestone inside a topic detail view or in the Implementations view updates the same underlying record.
- **Initial User State**: Pristine clean slate—all topics `NOT STARTED`, 0 milestones complete, no knowledge gaps, empty review queue, no current focus set. Ready for immediate use.

---

## 2. Tech Stack & Architecture

- **Vite** (dev server and build tool)
- **Vanilla HTML5**, **Vanilla CSS3**, **Vanilla JavaScript (ES Modules)**, **npm**
- **Zero Frontend Frameworks**: No React, Vue, Angular, Svelte, Tailwind runtime, or external UI libraries.
- **Zero Backend**: Fully client-side application.
- **Data Storage (Local Repository `data/progress.json` + LocalStorage Cache)**:
  - **Local Repository JSON**: All progress is automatically written to `data/progress.json` in this repository, formatted cleanly so you can commit it to Git anytime.
  - **Browser `localStorage`**: Instant synchronous caching ensures zero UI lag.
  - **JSON Export / Import**: 1-click standalone backup and restore, plus safe reset with confirmation.

---

## 3. Visual Design & Theme System

Implemented in vanilla CSS custom properties matching the specified Tailwind palette:

```css
:root, [data-theme="dark"] {
  /* Canvas & Surfaces */
  --color-bg: #020617;             /* slate-950 */
  --color-surface: #0f172a;        /* slate-900 */
  --color-surface-subtle: #1e293b; /* slate-800 */
  --color-border: #1e293b;         /* slate-800 */
  --color-border-focus: #334155;   /* slate-700 */

  /* Brand / Accents */
  --color-brand-50: #eef2ff;
  --color-brand-300: #a5b4fc;
  --color-brand-500: #6366f1;      /* indigo-500 */
  --color-brand-600: #4f46e5;      /* indigo-600 */
  --color-brand-950: #1e1b4b;

  /* Status Badges */
  --color-status-not-started: #475569; /* slate-600 */
  --color-status-learning: #fbbf24;    /* amber-400 */
  --color-status-familiar: #6366f1;    /* indigo-500 */
  --color-status-solid: #10b981;       /* emerald-500 */
  --color-status-solid-glow: #34d399;  /* emerald-400 */

  /* Animations */
  --animation-pulse-glow: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
}
```

- High-contrast light mode toggle.
- Aesthetic: Technical, clean, minimal, focused, modern, developer knowledge dashboard (no childish gamification, no cartoon badges, no XP points).

---

## 4. Project Directory Structure

```
tracker/
├── PLAN.md                        # Master implementation plan
├── STEPS.md                       # GitHub Pages deployment & Gist setup guide
├── index.html                     # Application HTML shell
├── package.json                   # Vite devDependency and scripts
├── vite.config.js                 # Vite config with relative base ('./')
├── src/
│   ├── main.js                    # App initialization, view router, global shortcuts
│   ├── data/
│   │   └── roadmap.js             # Canonical 15 sections, 150+ topics, default checklists
│   ├── utils/
│   │   ├── storage.js             # Reactive state store with localStorage cache + pub-sub
│   │   ├── gistSync.js            # GitHub Gist API sync (Push, Pull, Auto-Sync)
│   │   ├── progress.js            # Weighted knowledge & practical progress calculations
│   │   ├── icons.js               # Clean inline SVG icon helpers
│   │   └── exportImport.js        # JSON export, import validation, and reset confirmation
│   ├── styles/
│   │   ├── reset.css              # Typography and base reset
│   │   ├── variables.css          # Slate, indigo, emerald color variables and animations
│   │   ├── layout.css             # Grid shell, desktop sidebar, responsive mobile header
│   │   ├── components.css         # Badges, progress bars, drawer, cards, search modal
│   │   └── views.css              # Dashboard, roadmap accordion, implementation table
│   └── components/
│       ├── header.js              # Top bar, global search trigger, Gist sync status pill
│       ├── sidebar.js             # Navigation (Dashboard, Roadmap, Implementations, Gaps, Review, Data, Theme)
│       ├── dashboardView.js       # Executive overview (overall progress, section progress, focus hero)
│       ├── roadmapView.js         # Hierarchical collapsible sections, filters, topic rows
│       ├── implementationsView.js # From-scratch tracker table with linked milestones
│       ├── knowledgeGapsView.js   # Knowledge gaps tracker (priority, resolved, add/edit/delete)
│       ├── reviewQueueView.js     # Needs Review queue with section filtering
│       ├── topicDrawer.js         # Slide-over topic detail panel (status, checklists, notes, gaps, resources)
│       ├── searchModal.js         # Global command palette (Cmd/Ctrl + K)
│       └── dataModal.js           # GitHub Gist credentials & JSON backup/restore modal
```

---

## 5. Complete Roadmap Content (All 15 Sections & 150+ Topics)

Every topic is defined in `src/data/roadmap.js` with appropriate checklists:

1. **ML Foundations** (11 topics):
   - What is Machine Learning?
   - Learning paradigms
   - Data, features and targets
   - Training / validation / test sets
   - Loss functions
   - Optimization basics
   - Linear Algebra Anchors (Eigendecomposition & SVD)
   - Vector & Matrix Calculus (Gradients & The Jacobian)
   - Information Theory (Entropy & KL Divergence)
   - Generalization
   - Machine learning workflow

2. **Supervised Learning** (13 topics):
   - Linear Regression
   - Logistic Regression
   - k-Nearest Neighbors
   - Naive Bayes
   - Decision Trees
   - Random Forests
   - Support Vector Machines
   - Ensemble Methods
   - Bagging
   - Boosting
   - Gradient Boosting
   - Convex vs. Non-Convex Loss Surfaces
   - The Geometry of Regularization (L1 Diamond vs. L2 Sphere)

3. **Unsupervised Learning** (6 topics):
   - k-Means
   - Hierarchical Clustering
   - DBSCAN
   - PCA
   - Dimensionality Reduction
   - Feature Extraction

4. **Model Evaluation & Improvement** (16 topics):
   - Overfitting
   - Underfitting
   - Bias
   - Variance
   - Bias-Variance Tradeoff
   - Cross Validation
   - Train / Validation / Test methodology
   - Classification Metrics
   - Regression Metrics
   - Confusion Matrix
   - Hyperparameter Tuning
   - Regularization
   - Data Leakage
   - Model Selection
   - PR-AUC vs. ROC-AUC for Imbalanced Data
   - Model Calibration & Reliability Diagrams

5. **Probabilistic & Advanced ML** (10 topics):
   - Probability for Machine Learning
   - Maximum Likelihood Estimation
   - Maximum A Posteriori Estimation
   - Bayesian Methods
   - Bayesian Networks
   - Expectation-Maximization
   - Gaussian Processes
   - Kernel Methods
   - Kernel PCA
   - Latent Variable Models

6. **Feature Engineering** (10 topics):
   - Data Cleaning
   - Missing Values
   - Categorical Variables
   - Encoding
   - Feature Scaling
   - Feature Transformation
   - Feature Engineering
   - Feature Selection
   - Feature Extraction
   - ML Pipelines

7. **Neural Network Foundations** (11 topics):
   - Artificial Neuron
   - Perceptron
   - Activation Functions
   - Feedforward Neural Networks
   - Multilayer Perceptron
   - Forward Propagation
   - Loss Functions for Neural Networks
   - Backpropagation
   - Chain Rule in Backpropagation
   - Gradient Descent
   - Neural Network Training

8. **Deep Learning Fundamentals** (14 topics):
   - Mini-batch Gradient Descent
   - Stochastic Gradient Descent
   - Momentum
   - Adam
   - Learning Rate
   - Learning Rate Schedules
   - Weight Initialization
   - Batch Normalization
   - Layer Normalization
   - Dropout
   - Weight Decay
   - Vanishing Gradients
   - Exploding Gradients
   - Transfer Learning

9. **Computer Vision** (11 topics):
   - Convolution
   - CNN
   - Pooling
   - CNN Architectures
   - ResNet
   - Image Classification
   - Object Detection
   - Semantic Segmentation
   - Image Embeddings
   - Vision Transformers
   - Vision-Language Models

10. **Sequence Models** (6 topics):
    - Recurrent Neural Networks
    - Vanishing Gradients in RNNs
    - LSTM
    - GRU
    - Sequence-to-Sequence
    - Encoder-Decoder Architecture

11. **Attention & Transformers** (17 topics):
    - Attention
    - Query / Key / Value
    - Attention Scores
    - Scaled Dot-Product Attention
    - Self-Attention
    - Cross-Attention
    - Multi-Head Attention
    - Positional Encoding
    - Transformer Architecture
    - Transformer Encoder
    - Transformer Decoder
    - Residual Connections
    - Layer Normalization
    - Feed-Forward Network
    - Causal Masking
    - Autoregressive Language Modeling
    - FlashAttention & GPU SRAM Tiling

12. **Representation & Generative Learning** (7 topics):
    - Representation Learning
    - Autoencoders
    - Variational Autoencoders
    - GANs
    - Self-Supervised Learning
    - Contrastive Learning
    - Diffusion Models

13. **LLM Foundations** (15 topics):
    - Language Modeling
    - Tokenization
    - Token Embeddings
    - Positional Representations
    - GPT-style Models
    - BERT-style Models
    - Pretraining
    - Fine-Tuning
    - Instruction Tuning
    - Preference Optimization
    - RLHF
    - LLM Inference
    - The KV Cache Architecture
    - Memory-Bound vs. Compute-Bound Inference (Roofline Model)
    - Quantization Foundations (FP16, BF16, INT8, INT4)

14. **Reinforcement Learning** (12 topics):
    - Markov Decision Processes
    - States
    - Actions
    - Rewards
    - Policies
    - Value Functions
    - Q Functions
    - Bellman Equation
    - Q-Learning
    - SARSA
    - Policy Gradients
    - Actor-Critic

15. **Practical ML / DL** (12 topics):
    - Exploratory Data Analysis
    - Experiment Tracking
    - Reproducibility
    - Model Versioning
    - Data Versioning
    - Model Serving
    - Batch Inference
    - Online Inference
    - Model Monitoring
    - Data Drift
    - Model Drift
    - End-to-End ML Projects

---

## 6. Views & Interactive Features

### A. Dashboard View
- Overall Knowledge Progress bar (weighted).
- Practical Implementation progress bar.
- Section-by-section progress breakdown.
- Status counts: Solid, Familiar, Learning, Not Started.
- Open Knowledge Gaps count and Review Queue count.
- **Current Focus Hero Card**: Shows currently selected topic with `pulse-glow` animation, current status, and quick-open button.

### B. Roadmap View
- Collapsible section accordions showing section progress percentage.
- Topic cards/rows with clickable status badge (cycles: Not Started → Learning → Familiar → Solid).
- Indicators for practical checklist completion and "Needs Review" flag.
- Expand All / Collapse All controls.
- Filters:
  - Knowledge status: All, Not Started, Learning, Familiar, Solid.
  - Review: All, Needs Review.
  - Practical: All, Not Started, In Progress, Complete.

### C. Implementations View
- Tracks from-scratch implementations:
  1. Linear Regression
  2. Logistic Regression
  3. k-Nearest Neighbors
  4. Naive Bayes
  5. Decision Trees
  6. k-Means
  7. Principal Component Analysis (PCA)
- 5 Milestones per algorithm:
  - Concept understood
  - From-scratch implementation
  - Tested on toy data
  - Compared against sklearn
  - Tested on real dataset
- Shows milestone tally (e.g. `X / 35 milestones complete`).
- 100% two-way synced with the topic detail drawer checklist.

### D. Knowledge Gaps View
- Capture conceptual questions (e.g., "Why does PCA maximize variance?", "Why does logistic regression use cross entropy?").
- Priority badges: High (🔴 Red), Medium (🟡 Amber), Low (🟢 Green).
- Associated with specific roadmap topic (click to open topic drawer).
- Tabs for All / Open / Resolved. Add, edit, delete, and toggle resolved.

### E. Review Queue View
- Shows all topics marked `needsReview: true`.
- Section dropdown filter.
- Quick buttons to remove from review or cycle knowledge status.

### F. Topic Detail Drawer (Slide-Over Panel)
- Header with section name, topic title, and click-to-cycle status badge.
- Quick action toggles: "Set as Current Focus" and "Mark for Review".
- **Knowledge Checklist**: Tailored conceptual checklist items.
- **Practical Checklist**: Hands-on milestones (synced with Implementations view).
- **Notes**: Textarea with debounced auto-save.
- **Knowledge Gaps**: Linked gaps for this topic with quick inline "+ Add Gap".
- **Resources**: Add/edit/remove resources with type badge (Book, Video, Article, Paper, Documentation, Course, Other) and external link buttons.

### G. Global Search Palette (`Cmd/Ctrl + K`)
- Instant search across topics, sections, knowledge gaps, and implementations.
- Keyboard navigation (Arrow keys + Enter).

### H. Data & Storage Modal
- Displays local repository file storage status (`data/progress.json`).
- Shows last saved time, active topic records count, and git commit tip.
- Standalone 1-click JSON snapshot export and import restore.
- Safe reset with confirmation dialog.

---

## 7. Progress Engine (`src/utils/progress.js`)

- **Weighted Knowledge Metric**:
  $$\text{Knowledge \%} = \frac{0 \times N_{\text{not\_started}} + 33.33 \times N_{\text{learning}} + 66.66 \times N_{\text{familiar}} + 100 \times N_{\text{solid}}}{N_{\text{total\_topics}}}$$
- **Section Progress**: Average of topic knowledge percentages in that section.
- **Practical Progress**:
  $$\text{Practical \%} = \frac{\text{Completed Practical Milestones}}{\text{Total Practical Milestones}} \times 100\%$$
- Knowledge and Practical progress are strictly displayed side by side as separate, honest numbers.

---

## 8. Verification & Validation Plan

1. **Build Verification**: Run `npm run build` to confirm clean compilation and zero bundle errors.
2. **Initial State Verification**: Confirm all 150+ topics start at `NOT STARTED`, 0 milestones complete, empty gaps, empty review queue.
3. **Knowledge Status & Calculations**: Cycle topic statuses, verify section and overall weighted percentages update accurately.
4. **Implementations & Drawer Sync**: Check milestone in Topic Drawer → verify it updates in Implementations view and vice versa.
5. **Notes Auto-Save & Offline Persistence**: Type notes, refresh page → verify notes persist in `localStorage`.
6. **GitHub Gist Sync**: Configure Gist ID and Token, verify successful push and pull via Gist API.
7. **Export / Import / Reset**: Export JSON, reset to blank state, import JSON → verify complete state restoration.
8. **Responsive UI & Dark/Light Theme**: Test at desktop (1440px) and mobile (375px) viewports; verify contrast across themes.
