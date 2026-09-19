Build a polished, interactive personal learning application called:

"ML / DL Learning Roadmap"

The application is a personal knowledge roadmap + practical implementation tracker for relearning Machine Learning and Deep Learning.

IMPORTANT PRODUCT PHILOSOPHY
============================

This is NOT:
- a generic todo application
- a book tracker
- a habit tracker
- a course tracker
- a project management application

It IS:

"A personal interactive ML/DL knowledge roadmap + practical implementation tracker."

The user is an AI engineer who learned ML/DL during college but has forgotten a significant portion of the fundamentals. They are rebuilding their knowledge systematically.

The roadmap should represent KNOWLEDGE and SKILLS, not merely tasks.

A topic such as "Logistic Regression" should be something the user can progressively understand, implement, experiment with, and eventually consider "solid".

The application should be designed so that it can grow from Classical ML → Advanced ML → Neural Networks → Deep Learning → Transformers → LLMs → Multimodal AI.

TECH STACK
==========

Use:

- Vite
- Vanilla HTML
- Vanilla CSS
- Vanilla JavaScript
- npm

Do NOT use React, Vue, Angular, Svelte, or another frontend framework.

Do not introduce a backend.

Use localStorage for persistence.

The application should run with:

npm install
npm run dev

The project should be cleanly structured and easy to modify.

Suggested structure:

src/
  main.js
  data/
    roadmap.js
  styles/
    main.css
  components/
    ...
  utils/
    storage.js
    progress.js

You may adjust the structure if you have a better vanilla-JS architecture, but keep the project understandable and modular.

CORE CONCEPT
============

The application contains a hierarchical ML/DL knowledge roadmap.

Example:

ML / DL Roadmap
│
├── ML Foundations
├── Supervised Learning
├── Unsupervised Learning
├── Model Evaluation & Improvement
├── Probabilistic & Advanced ML
├── Feature Engineering
├── Neural Network Foundations
├── Deep Learning Fundamentals
├── Computer Vision
├── Sequence Models
├── Attention & Transformers
├── Representation & Generative Learning
├── LLM Foundations
├── Reinforcement Learning
└── Practical ML / DL

The initial roadmap data should be included in the application.

ROADMAP CONTENT
===============

Populate the initial roadmap with the following topics.

1. ML FOUNDATIONS
-----------------

- What is Machine Learning?
- Learning paradigms
- Data, features and targets
- Training / validation / test sets
- Loss functions
- Optimization basics
- Generalization
- Machine learning workflow

2. SUPERVISED LEARNING
----------------------

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

3. UNSUPERVISED LEARNING
------------------------

- k-Means
- Hierarchical Clustering
- DBSCAN
- PCA
- Dimensionality Reduction
- Feature Extraction

4. MODEL EVALUATION & IMPROVEMENT
---------------------------------

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

5. PROBABILISTIC & ADVANCED ML
------------------------------

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

6. FEATURE ENGINEERING
----------------------

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

7. NEURAL NETWORK FOUNDATIONS
-----------------------------

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

8. DEEP LEARNING FUNDAMENTALS
-----------------------------

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

9. COMPUTER VISION
------------------

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

10. SEQUENCE MODELS
-------------------

- Recurrent Neural Networks
- Vanishing Gradients in RNNs
- LSTM
- GRU
- Sequence-to-Sequence
- Encoder-Decoder Architecture

11. ATTENTION & TRANSFORMERS
----------------------------

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

12. REPRESENTATION & GENERATIVE LEARNING
-----------------------------------------

- Representation Learning
- Autoencoders
- Variational Autoencoders
- GANs
- Self-Supervised Learning
- Contrastive Learning
- Diffusion Models

13. LLM FOUNDATIONS
-------------------

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

14. REINFORCEMENT LEARNING
--------------------------

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

15. PRACTICAL ML / DL
---------------------

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


KNOWLEDGE STATUS
================

Every topic must have a knowledge status.

Use these four states:

1. NOT STARTED
2. LEARNING
3. FAMILIAR
4. SOLID

Do NOT treat these as simple todo checkboxes.

The user is tracking their confidence/knowledge state.

Use visually distinct badges for each status.

The status should be clickable.

For example:

Not Started → Learning → Familiar → Solid → Not Started

However, provide a clear way to change status manually as well.

Do not automatically mark a topic "Solid" simply because all practical tasks are completed.

A topic's knowledge status is independent from its practical implementation status.


TOPIC DETAIL
============

Clicking a topic should open a detailed panel, drawer, modal, or dedicated detail view.

Example:

Logistic Regression

Status:
[ SOLID ]

Knowledge

☑ Understand the intuition
☑ Understand the mathematical formulation
☑ Understand the loss function
☑ Understand how training works
☐ Explain it without notes

Practical

☑ Implement from scratch
☑ Test on toy data
☑ Implement with sklearn
☐ Use on a real dataset

Notes

[ user's notes ]

Knowledge Gaps

[ Why does logistic regression use log loss? ]

Resources

+ Add resource

The exact UI can differ, but the functionality should exist.


LEARNING CHECKLIST INSIDE TOPICS
================================

Important:

The roadmap itself is NOT a todo list.

However, each topic can have a small learning/practical checklist.

For important algorithms, default checklist items should include:

Knowledge:
- Understand intuition
- Understand mathematical formulation
- Understand training procedure
- Understand strengths and limitations
- Explain without notes

Practical:
- Implement from scratch
- Test on toy data
- Implement using a library
- Experiment on a real dataset

Do not blindly add every possible checklist item to every topic.

Conceptual topics can have fewer appropriate items.

For example:

"Bias-Variance Tradeoff"

could have:

Knowledge:
- Understand bias
- Understand variance
- Understand the tradeoff
- Explain with an example

Practical:
- Visualize bias/variance behavior

Whereas:

"Linear Regression"

could have:

Knowledge:
- Understand intuition
- Understand mathematical formulation
- Understand loss function
- Understand optimization
- Explain without notes

Practical:
- Implement from scratch
- Test on toy data
- Compare with sklearn
- Use on real dataset


FROM-SCRATCH IMPLEMENTATION TRACKER
===================================

Create a separate "Implementations" view.

This tracks algorithms the user intends to implement themselves.

Initial implementation list:

- Linear Regression
- Logistic Regression
- k-NN
- Naive Bayes
- Decision Tree
- k-Means
- PCA

Each implementation should have:

- Concept understood
- From-scratch implementation
- Tested on toy data
- Compared against sklearn
- Tested on real dataset

Show progress such as:

7 / 12 implementation milestones complete

This section should be connected to the corresponding roadmap topics.

If the user marks "Implement from scratch" for Logistic Regression inside its topic, the implementation tracker should reflect that.

There should be a single source of truth for this data.


KNOWLEDGE GAPS
=============

Create a dedicated "Knowledge Gaps" section.

The purpose is to capture things the user realizes they don't understand while studying.

Example:

Knowledge Gaps

🔴 Why does PCA maximize variance?
🔴 Why does logistic regression use cross entropy?
🟡 How exactly does Adam differ from SGD?
🟡 Why does feature scaling matter for SVM?

Allow the user to:

- Add a gap
- Associate it with a roadmap topic
- Set priority
- Mark it unresolved/resolved
- Edit it
- Delete it

Priority:

- Low
- Medium
- High

Resolved gaps should be visually separated or filterable.


REVIEW QUEUE
============

Create a "Review Queue".

A topic can be manually marked:

"Needs Review"

This should be independent of its knowledge status.

For example:

Logistic Regression
Status: Familiar
Needs Review: YES

The Review Queue should automatically show all topics marked for review.

Allow:

- Mark for review
- Remove from review
- Filter by roadmap section

Show a simple count:

Needs Review: 7


DASHBOARD
=========

The dashboard should be the home screen.

It should provide a high-level view of progress.

Include:

1. Overall roadmap progress

Example:

ML / DL Knowledge
██████████████░░░░░░ 68%

2. Progress by major section

Example:

ML Foundations             85%
Supervised Learning        72%
Unsupervised Learning      60%
Advanced ML                20%
Neural Networks            10%
Deep Learning               5%
Transformers                0%

3. Knowledge status counts

Example:

Solid       24
Familiar    18
Learning    12
Not Started 42

4. Practical implementation progress

Example:

Implementations
████████████░░░░ 75%

5. Knowledge gaps

Example:

Open Knowledge Gaps: 9

6. Review queue

Example:

Topics to Review: 6

7. Current focus

Allow the user to set one topic as:

"Current Focus"

Example:

CURRENTLY LEARNING

→ Backpropagation

[Open Topic]


PROGRESS CALCULATION
====================

Do NOT simply calculate overall progress based on number of topics marked Solid.

Use a sensible weighted system.

Suggested:

Not Started = 0%
Learning = 33%
Familiar = 66%
Solid = 100%

Section progress = average of topic knowledge percentages.

Overall knowledge progress = average across all roadmap topics.

Practical progress should be calculated separately.

Display both:

Knowledge Progress
Practical Progress

Do not merge them into one misleading number.


ROADMAP UI
==========

Create a dedicated roadmap page/view.

The roadmap should visually communicate hierarchy.

Example:

ML / DL ROADMAP

▼ ML Foundations                         72%
   ● What is Machine Learning?          SOLID
   ● Learning paradigms                 SOLID
   ● Loss Functions                     FAMILIAR
   ● Optimization Basics                LEARNING
   ● Generalization                     NOT STARTED

▼ Supervised Learning                   61%
   ● Linear Regression                  SOLID
   ● Logistic Regression               SOLID
   ● k-NN                              FAMILIAR
   ...

Categories should be collapsible.

Show section-level progress.

Allow:

- Expand/collapse sections
- Click topics
- Search topics
- Filter by status
- Filter by "Needs Review"
- Filter by practical implementation status


SEARCH
======

Add global search.

The user should be able to search:

- Topics
- Sections
- Knowledge gaps
- Implementations

Example:

Search: "gradient"

Results:

- Gradient Descent
- Gradient Boosting
- Vanishing Gradients
- Exploding Gradients
- Chain Rule in Backpropagation


FILTERS
=======

Provide filters for:

Knowledge status:
- All
- Not Started
- Learning
- Familiar
- Solid

Review:
- All
- Needs Review

Practical:
- All
- Not Started
- In Progress
- Complete

The UI should make filtering easy without feeling like an admin dashboard.


RESOURCES
=========

Each topic can have resources.

A resource should contain:

- Title
- URL
- Type

Resource types:

- Book
- Video
- Article
- Paper
- Documentation
- Course
- Other

Example:

Topic: Transformers

Resources:

📹 Let's build GPT from scratch
📄 Attention Is All You Need
📖 Deep Learning
🔗 PyTorch documentation

Resources should be editable and removable.

External links should open in a new tab.


NOTES
=====

Each topic should support lightweight notes.

Do NOT build a full rich-text editor.

A simple textarea is enough.

Allow:

- Save notes automatically
- Persist notes in localStorage

Example:

Topic:
PCA

Notes:

"Need to revisit relationship between covariance matrix,
eigenvectors and maximum variance projection."


DATA PERSISTENCE
================

Use localStorage.

The application must preserve:

- Topic statuses
- Topic checklist states
- Notes
- Resources
- Knowledge gaps
- Review flags
- Current focus
- Implementation progress
- UI preferences if useful

Refreshing the page must NOT lose data.


DATA MODEL
==========

Use a structured JavaScript data model.

Conceptually:

roadmap
  sections[]
    id
    title
    description
    topics[]
      id
      title
      status
      review
      notes
      checklist[]
      resources[]

knowledgeGaps[]
  id
  topicId
  title
  description
  priority
  resolved

currentFocus
  topicId

Do not duplicate the same topic in multiple places.

The roadmap data should be the source of truth.


IMPORT / EXPORT
==============

Include a simple data management feature.

Allow:

- Export progress as JSON
- Import progress from JSON
- Reset all progress

Before reset, require confirmation.

This is important because the app uses localStorage.


VISUAL DESIGN
=============

The UI should feel like a serious developer / engineer learning tool.

Avoid:

- childish gamification
- excessive gradients
- cartoon illustrations
- XP systems
- badges everywhere
- excessive animations
- generic SaaS landing-page aesthetics

Desired aesthetic:

- clean
- technical
- minimal
- focused
- modern
- dark-first
- excellent typography
- good spacing
- subtle borders
- restrained use of color

Think:

"Developer knowledge dashboard"

rather than:

"Productivity app."

Use a dark theme by default.

Include a light/dark theme toggle if practical.

Use CSS variables for colors, spacing and typography.

Do not use external UI component libraries.


LAYOUT
======

Desktop-first, but responsive.

Desktop:

┌─────────────────────────────────────────────────────┐
│ ML / DL Learning Roadmap             Search   ⚙     │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│ Dashboard    │                                      │
│ Roadmap      │              Main Content            │
│ Implement.   │                                      │
│ Gaps         │                                      │
│ Review       │                                      │
│              │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘

Sidebar navigation:

- Dashboard
- Roadmap
- Implementations
- Knowledge Gaps
- Review Queue

At the bottom:

- Data
- Theme
- About

On smaller screens, collapse the sidebar into a mobile navigation.


INTERACTIONS
===========

Make the application feel genuinely interactive.

Required:

- Click topic → detail view
- Change status
- Check/uncheck learning items
- Add/edit/delete knowledge gaps
- Mark topics for review
- Add/edit/delete resources
- Edit notes
- Set current focus
- Search
- Filter
- Expand/collapse sections
- Import/export JSON
- Reset progress
- Persist everything through localStorage

Use subtle transitions for:

- opening panels
- expanding sections
- status changes
- progress bars

Do not over-animate.


EMPTY STATES
============

Create good empty states.

Examples:

No knowledge gaps:

"You haven't recorded any knowledge gaps yet."

No review items:

"Your review queue is empty. Nice work."

No resources:

"No resources added yet."


INITIAL USER STATE
==================

The application should NOT start with fake completed progress.

All roadmap topics should initially be:

Not Started.

Implementation tasks should initially be incomplete.

Knowledge gaps should initially be empty.

Review queue should initially be empty.

Current focus should be unset.

This should make the application immediately usable for the user's actual learning journey.


SEPTEMBER CONTEXT
=================

The user's current immediate goal is to rebuild Classical ML fundamentals during September.

Their primary resource is:

"Introduction to Machine Learning with Python"
by Andreas C. Müller and Sarah Guido.

However:

IMPORTANT:

Do NOT make the application a book tracker.

The book is simply a learning resource.

The roadmap should remain independent of the book.

The user should be able to attach the book to relevant topics as a resource.

Later, the user will move from:

Classical ML
→ Advanced ML
→ Neural Networks
→ Deep Learning
→ Transformers
→ LLMs

The application should support this progression without requiring a redesign.


IMPORTANT DISTINCTION
=====================

There are three different things in this application:

1. KNOWLEDGE STATUS

"How well do I understand this?"

Not Started / Learning / Familiar / Solid

2. PRACTICAL IMPLEMENTATION

"Have I actually built/experimented with this?"

Separate checklist.

3. REVIEW STATUS

"Do I need to revisit this?"

Needs Review / No Review

Do not collapse these into one status.

A topic can therefore be:

Logistic Regression
Knowledge: Solid
Practical: Complete
Review: No

or:

PCA
Knowledge: Familiar
Practical: Complete
Review: Yes

or:

SVM
Knowledge: Learning
Practical: Not Started
Review: No


QUALITY REQUIREMENTS
====================

The application should feel production-quality despite being a local-only application.

Pay attention to:

- accessibility
- keyboard usability
- semantic HTML
- readable typography
- responsive layout
- empty states
- hover/focus states
- clear buttons
- confirmation dialogs for destructive actions
- no console errors
- no broken interactions
- no unnecessary dependencies

Use modular vanilla JavaScript rather than putting everything into one huge main.js file.

Keep roadmap data separate from application logic.

Keep localStorage logic separate from UI logic.

Keep progress calculation logic separate from rendering logic.

Add comments only where they improve maintainability.


FINAL DELIVERABLE
=================

Build the complete working Vite application.

After implementation:

1. Run the project.
2. Verify there are no build errors.
3. Verify all major interactions work.
4. Verify localStorage persistence by refreshing.
5. Verify import/export.
6. Verify responsive behavior.
7. Verify that progress calculations update correctly.
8. Verify that changing a topic's checklist updates its practical progress.
9. Verify that changing a topic's knowledge status updates section and overall knowledge progress.
10. Verify that review items and knowledge gaps appear in their respective views.

Do not merely create static mockups.

The final result must be a functioning interactive application that I can immediately use as my personal ML/DL learning tracker.