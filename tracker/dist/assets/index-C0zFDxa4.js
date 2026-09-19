(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))t(c);new MutationObserver(c=>{for(const n of c)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&t(d)}).observe(document,{childList:!0,subtree:!0});function s(c){const n={};return c.integrity&&(n.integrity=c.integrity),c.referrerPolicy&&(n.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?n.credentials="include":c.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(c){if(c.ep)return;c.ep=!0;const n=s(c);fetch(c.href,n)}})();const O="ml_dl_learning_roadmap_state_v1",h={NOT_STARTED:"NOT_STARTED",LEARNING:"LEARNING",FAMILIAR:"FAMILIAR",SOLID:"SOLID"},D={version:1,userTopics:{},currentFocus:null,knowledgeGaps:[],theme:"dark",updatedAt:null};class j{constructor(){this.state=this.loadInitialState(),this.listeners=new Set,this.fileSyncStatus="synced",this.lastSavedAt=null,typeof window<"u"&&this.syncWithLocalFile()}loadInitialState(){try{if(typeof localStorage>"u")return{...D};const e=localStorage.getItem(O);if(!e)return{...D};const s=JSON.parse(e);return{...D,...s}}catch(e){return console.error("Failed to load state from localStorage:",e),{...D}}}async syncWithLocalFile(){try{const e=await fetch("/api/progress");if(e.ok){const s=await e.json();s&&typeof s=="object"&&Object.keys(s).length>0&&(s.userTopics||s.knowledgeGaps)&&(this.state={...this.state,...s},typeof localStorage<"u"&&localStorage.setItem(O,JSON.stringify(this.state)),this.lastSavedAt=s.updatedAt||new Date().toISOString(),this.emit("state_updated",this.state))}}catch{console.log("Local file API not reachable, using localStorage buffer.")}}save(e="state_updated"){try{this.state.updatedAt=new Date().toISOString(),typeof localStorage<"u"&&localStorage.setItem(O,JSON.stringify(this.state)),this.emit(e,this.state),this.scheduleFileSave()}catch(s){console.error("Failed to save state:",s)}}scheduleFileSave(){typeof fetch>"u"||(this.fileSyncStatus="saving",this.emit("file_sync_status",{status:"saving"}),this._saveTimer&&clearTimeout(this._saveTimer),this._saveTimer=setTimeout(async()=>{try{(await fetch("/api/progress",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(this.state)})).ok?(this.fileSyncStatus="synced",this.lastSavedAt=this.state.updatedAt,this.emit("file_sync_status",{status:"synced",lastSavedAt:this.lastSavedAt})):(this.fileSyncStatus="error",this.emit("file_sync_status",{status:"error"}))}catch{this.fileSyncStatus="offline",this.emit("file_sync_status",{status:"offline"})}},400))}subscribe(e){return this.listeners.add(e),()=>this.listeners.delete(e)}emit(e,s){this.listeners.forEach(t=>{try{t(e,s)}catch(c){console.error("Error in state listener:",c)}})}getState(){return this.state}getTopicData(e){return this.state.userTopics[e]?this.state.userTopics[e]:{status:h.NOT_STARTED,needsReview:!1,notes:"",checklist:{},resources:[]}}setTopicStatus(e,s){this.state.userTopics[e]||(this.state.userTopics[e]=this.getTopicData(e)),this.state.userTopics[e].status=s,this.save("topic_status_changed")}cycleTopicStatus(e){const s=this.getTopicData(e).status;let t=h.NOT_STARTED;return s===h.NOT_STARTED?t=h.LEARNING:s===h.LEARNING?t=h.FAMILIAR:s===h.FAMILIAR?t=h.SOLID:t=h.NOT_STARTED,this.setTopicStatus(e,t),t}toggleChecklist(e,s){this.state.userTopics[e]||(this.state.userTopics[e]=this.getTopicData(e));const t=!!this.state.userTopics[e].checklist[s];this.state.userTopics[e].checklist[s]=!t,this.save("checklist_toggled")}setTopicNotes(e,s){this.state.userTopics[e]||(this.state.userTopics[e]=this.getTopicData(e)),this.state.userTopics[e].notes=s,this.save("notes_updated")}toggleNeedsReview(e){this.state.userTopics[e]||(this.state.userTopics[e]=this.getTopicData(e)),this.state.userTopics[e].needsReview=!this.state.userTopics[e].needsReview,this.save("review_toggled")}setCurrentFocus(e){this.state.currentFocus===e?this.state.currentFocus=null:this.state.currentFocus=e,this.save("focus_changed")}addKnowledgeGap(e,s,t="Medium"){const c={id:"gap-"+Date.now()+"-"+Math.random().toString(36).substring(2,6),title:e.trim(),topicId:s||null,priority:t,resolved:!1,createdAt:new Date().toISOString()};return this.state.knowledgeGaps.unshift(c),this.save("gap_added"),c}updateKnowledgeGap(e,s){const t=this.state.knowledgeGaps.findIndex(c=>c.id===e);t!==-1&&(this.state.knowledgeGaps[t]={...this.state.knowledgeGaps[t],...s},this.save("gap_updated"))}toggleGapResolved(e){const s=this.state.knowledgeGaps.find(t=>t.id===e);s&&(s.resolved=!s.resolved,this.save("gap_resolved_toggled"))}deleteKnowledgeGap(e){this.state.knowledgeGaps=this.state.knowledgeGaps.filter(s=>s.id!==e),this.save("gap_deleted")}addTopicResource(e,s){this.state.userTopics[e]||(this.state.userTopics[e]=this.getTopicData(e));const t={id:"res-"+Date.now(),title:s.title.trim(),url:s.url.trim(),type:s.type||"Other"};this.state.userTopics[e].resources.push(t),this.save("resource_added")}deleteTopicResource(e,s){this.state.userTopics[e]&&(this.state.userTopics[e].resources=this.state.userTopics[e].resources.filter(t=>t.id!==s),this.save("resource_deleted"))}setTheme(e){this.state.theme=e,typeof document<"u"&&document.documentElement.setAttribute("data-theme",e),this.save("theme_changed")}resetState(){this.state={...D,theme:this.state.theme},this.save("state_reset")}importFullState(e){this.state={...D,...e,theme:e.theme||this.state.theme},this.save("state_imported")}}const H=new j,N=[{id:"sec-ml-foundations",title:"1. ML Foundations",description:"Core paradigm, data structures, loss formulations, optimization, and generalization.",topics:[{id:"ml-foundations-what-is-ml",title:"What is Machine Learning?",type:"concept",resources:[{id:"res-1",title:"Introduction to Machine Learning with Python (Ch. 1)",url:"https://www.oreilly.com/library/view/introduction-to-machine/9781449369880/",type:"Book"}]},{id:"ml-foundations-learning-paradigms",title:"Learning paradigms",type:"concept",resources:[]},{id:"ml-foundations-data-features-targets",title:"Data, features and targets",type:"concept",resources:[]},{id:"ml-foundations-train-val-test",title:"Training / validation / test sets",type:"concept",resources:[]},{id:"ml-foundations-loss-functions",title:"Loss functions",type:"concept",resources:[]},{id:"ml-foundations-optimization-basics",title:"Optimization basics",type:"concept",resources:[]},{id:"ml-foundations-linear-algebra-anchors",title:"Linear Algebra Anchors (Eigendecomposition & SVD)",type:"concept",resources:[{id:"res-la-3b1b",title:"Essence of Linear Algebra (3Blue1Brown)",url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",type:"Video"}]},{id:"ml-foundations-vector-calculus-jacobian",title:"Vector & Matrix Calculus (Gradients & The Jacobian)",type:"concept",resources:[{id:"res-calc-matrix",title:"The Matrix Calculus You Need for Deep Learning (Parr & Howard)",url:"https://arxiv.org/abs/1802.01528",type:"Paper"}]},{id:"ml-foundations-information-theory",title:"Information Theory (Entropy & KL Divergence)",type:"concept",resources:[{id:"res-info-theory",title:"Visual Information Theory (Chris Olah)",url:"https://colah.github.io/posts/2015-09-Visual-Information/",type:"Article"}]},{id:"ml-foundations-generalization",title:"Generalization",type:"concept",resources:[]},{id:"ml-foundations-ml-workflow",title:"Machine learning workflow",type:"concept",resources:[]}]},{id:"sec-supervised-learning",title:"2. Supervised Learning",description:"Classical regression, classification, margin classifiers, trees, and ensemble methods.",topics:[{id:"supervised-linear-regression",title:"Linear Regression",type:"algorithm",isCoreImplementation:!0,resources:[{id:"res-lr-1",title:"Introduction to Machine Learning with Python (Ch. 2)",url:"https://github.com/amueller/introduction_to_ml_with_python",type:"Book"}]},{id:"supervised-logistic-regression",title:"Logistic Regression",type:"algorithm",isCoreImplementation:!0,resources:[{id:"res-log-1",title:"Introduction to Machine Learning with Python (Ch. 2)",url:"https://github.com/amueller/introduction_to_ml_with_python",type:"Book"}]},{id:"supervised-knn",title:"k-Nearest Neighbors",type:"algorithm",isCoreImplementation:!0,resources:[{id:"res-knn-1",title:"Introduction to Machine Learning with Python (Ch. 2)",url:"https://github.com/amueller/introduction_to_ml_with_python",type:"Book"}]},{id:"supervised-naive-bayes",title:"Naive Bayes",type:"algorithm",isCoreImplementation:!0,resources:[{id:"res-nb-1",title:"Introduction to Machine Learning with Python (Ch. 2)",url:"https://github.com/amueller/introduction_to_ml_with_python",type:"Book"}]},{id:"supervised-decision-trees",title:"Decision Trees",type:"algorithm",isCoreImplementation:!0,resources:[{id:"res-dt-1",title:"Introduction to Machine Learning with Python (Ch. 2)",url:"https://github.com/amueller/introduction_to_ml_with_python",type:"Book"}]},{id:"supervised-random-forests",title:"Random Forests",type:"algorithm",resources:[]},{id:"supervised-svm",title:"Support Vector Machines",type:"algorithm",resources:[]},{id:"supervised-ensemble-methods",title:"Ensemble Methods",type:"concept",resources:[]},{id:"supervised-bagging",title:"Bagging",type:"concept",resources:[]},{id:"supervised-boosting",title:"Boosting",type:"concept",resources:[]},{id:"supervised-gradient-boosting",title:"Gradient Boosting",type:"algorithm",resources:[]},{id:"supervised-loss-surfaces-convexity",title:"Convex vs. Non-Convex Loss Surfaces",type:"concept",resources:[]},{id:"supervised-geometry-of-regularization",title:"The Geometry of Regularization (L1 Diamond vs. L2 Sphere)",type:"concept",resources:[]}]},{id:"sec-unsupervised-learning",title:"3. Unsupervised Learning",description:"Clustering, dimensionality reduction, projection, and manifold discovery.",topics:[{id:"unsupervised-kmeans",title:"k-Means",type:"algorithm",isCoreImplementation:!0,resources:[{id:"res-km-1",title:"Introduction to Machine Learning with Python (Ch. 3)",url:"https://github.com/amueller/introduction_to_ml_with_python",type:"Book"}]},{id:"unsupervised-hierarchical-clustering",title:"Hierarchical Clustering",type:"algorithm",resources:[]},{id:"unsupervised-dbscan",title:"DBSCAN",type:"algorithm",resources:[]},{id:"unsupervised-pca",title:"PCA",type:"algorithm",isCoreImplementation:!0,resources:[{id:"res-pca-1",title:"Introduction to Machine Learning with Python (Ch. 3)",url:"https://github.com/amueller/introduction_to_ml_with_python",type:"Book"}]},{id:"unsupervised-dimensionality-reduction",title:"Dimensionality Reduction",type:"concept",resources:[]},{id:"unsupervised-feature-extraction",title:"Feature Extraction",type:"concept",resources:[]}]},{id:"sec-model-evaluation",title:"4. Model Evaluation & Improvement",description:"Diagnostic theory, cross validation, metrics, error analysis, and tuning.",topics:[{id:"eval-overfitting",title:"Overfitting",type:"concept",resources:[]},{id:"eval-underfitting",title:"Underfitting",type:"concept",resources:[]},{id:"eval-bias",title:"Bias",type:"concept",resources:[]},{id:"eval-variance",title:"Variance",type:"concept",resources:[]},{id:"eval-bias-variance-tradeoff",title:"Bias-Variance Tradeoff",type:"concept",resources:[]},{id:"eval-cross-validation",title:"Cross Validation",type:"concept",resources:[]},{id:"eval-train-val-test-methodology",title:"Train / Validation / Test methodology",type:"concept",resources:[]},{id:"eval-classification-metrics",title:"Classification Metrics",type:"concept",resources:[]},{id:"eval-regression-metrics",title:"Regression Metrics",type:"concept",resources:[]},{id:"eval-confusion-matrix",title:"Confusion Matrix",type:"concept",resources:[]},{id:"eval-hyperparameter-tuning",title:"Hyperparameter Tuning",type:"concept",resources:[]},{id:"eval-regularization",title:"Regularization",type:"concept",resources:[]},{id:"eval-data-leakage",title:"Data Leakage",type:"concept",resources:[]},{id:"eval-model-selection",title:"Model Selection",type:"concept",resources:[]},{id:"eval-pr-auc-vs-roc-auc",title:"PR-AUC vs. ROC-AUC for Imbalanced Data",type:"concept",resources:[]},{id:"eval-model-calibration",title:"Model Calibration & Reliability Diagrams",type:"concept",resources:[]}]},{id:"sec-probabilistic-advanced-ml",title:"5. Probabilistic & Advanced ML",description:"Bayesian principles, likelihood estimation, EM, Gaussian processes, and kernels.",topics:[{id:"prob-probability-for-ml",title:"Probability for Machine Learning",type:"concept",resources:[]},{id:"prob-mle",title:"Maximum Likelihood Estimation",type:"concept",resources:[]},{id:"prob-map",title:"Maximum A Posteriori Estimation",type:"concept",resources:[]},{id:"prob-bayesian-methods",title:"Bayesian Methods",type:"concept",resources:[]},{id:"prob-bayesian-networks",title:"Bayesian Networks",type:"concept",resources:[]},{id:"prob-expectation-maximization",title:"Expectation-Maximization",type:"algorithm",resources:[]},{id:"prob-gaussian-processes",title:"Gaussian Processes",type:"algorithm",resources:[]},{id:"prob-kernel-methods",title:"Kernel Methods",type:"concept",resources:[]},{id:"prob-kernel-pca",title:"Kernel PCA",type:"algorithm",resources:[]},{id:"prob-latent-variable-models",title:"Latent Variable Models",type:"concept",resources:[]}]},{id:"sec-feature-engineering",title:"6. Feature Engineering",description:"Data cleaning, imputation, encodings, transformations, and end-to-end pipelines.",topics:[{id:"feat-data-cleaning",title:"Data Cleaning",type:"concept",resources:[]},{id:"feat-missing-values",title:"Missing Values",type:"concept",resources:[]},{id:"feat-categorical-variables",title:"Categorical Variables",type:"concept",resources:[]},{id:"feat-encoding",title:"Encoding",type:"concept",resources:[]},{id:"feat-feature-scaling",title:"Feature Scaling",type:"concept",resources:[]},{id:"feat-feature-transformation",title:"Feature Transformation",type:"concept",resources:[]},{id:"feat-feature-engineering",title:"Feature Engineering",type:"concept",resources:[]},{id:"feat-feature-selection",title:"Feature Selection",type:"concept",resources:[]},{id:"feat-feature-extraction",title:"Feature Extraction",type:"concept",resources:[]},{id:"feat-ml-pipelines",title:"ML Pipelines",type:"concept",resources:[]}]},{id:"sec-neural-network-foundations",title:"7. Neural Network Foundations",description:"Neurons, activations, perceptrons, MLP, forward prop, backpropagation, and training.",topics:[{id:"nn-artificial-neuron",title:"Artificial Neuron",type:"concept",resources:[]},{id:"nn-perceptron",title:"Perceptron",type:"algorithm",resources:[]},{id:"nn-activation-functions",title:"Activation Functions",type:"concept",resources:[]},{id:"nn-feedforward-neural-networks",title:"Feedforward Neural Networks",type:"concept",resources:[]},{id:"nn-multilayer-perceptron",title:"Multilayer Perceptron",type:"algorithm",resources:[]},{id:"nn-forward-propagation",title:"Forward Propagation",type:"concept",resources:[]},{id:"nn-loss-functions-for-nn",title:"Loss Functions for Neural Networks",type:"concept",resources:[]},{id:"nn-backpropagation",title:"Backpropagation",type:"algorithm",resources:[]},{id:"nn-chain-rule",title:"Chain Rule in Backpropagation",type:"concept",resources:[]},{id:"nn-gradient-descent",title:"Gradient Descent",type:"algorithm",resources:[]},{id:"nn-neural-network-training",title:"Neural Network Training",type:"concept",resources:[]}]},{id:"sec-deep-learning-fundamentals",title:"8. Deep Learning Fundamentals",description:"Optimizers, learning rate schedules, normalization, dropout, and vanishing gradients.",topics:[{id:"dl-mini-batch-gd",title:"Mini-batch Gradient Descent",type:"algorithm",resources:[]},{id:"dl-sgd",title:"Stochastic Gradient Descent",type:"algorithm",resources:[]},{id:"dl-momentum",title:"Momentum",type:"concept",resources:[]},{id:"dl-adam",title:"Adam",type:"algorithm",resources:[]},{id:"dl-learning-rate",title:"Learning Rate",type:"concept",resources:[]},{id:"dl-learning-rate-schedules",title:"Learning Rate Schedules",type:"concept",resources:[]},{id:"dl-weight-initialization",title:"Weight Initialization",type:"concept",resources:[]},{id:"dl-batch-normalization",title:"Batch Normalization",type:"concept",resources:[]},{id:"dl-layer-normalization",title:"Layer Normalization",type:"concept",resources:[]},{id:"dl-dropout",title:"Dropout",type:"concept",resources:[]},{id:"dl-weight-decay",title:"Weight Decay",type:"concept",resources:[]},{id:"dl-vanishing-gradients",title:"Vanishing Gradients",type:"concept",resources:[]},{id:"dl-exploding-gradients",title:"Exploding Gradients",type:"concept",resources:[]},{id:"dl-transfer-learning",title:"Transfer Learning",type:"concept",resources:[]}]},{id:"sec-computer-vision",title:"9. Computer Vision",description:"Convolutions, CNN architectures, ResNet, detection, segmentation, and vision transformers.",topics:[{id:"cv-convolution",title:"Convolution",type:"concept",resources:[]},{id:"cv-cnn",title:"CNN",type:"algorithm",resources:[]},{id:"cv-pooling",title:"Pooling",type:"concept",resources:[]},{id:"cv-cnn-architectures",title:"CNN Architectures",type:"concept",resources:[]},{id:"cv-resnet",title:"ResNet",type:"algorithm",resources:[]},{id:"cv-image-classification",title:"Image Classification",type:"concept",resources:[]},{id:"cv-object-detection",title:"Object Detection",type:"concept",resources:[]},{id:"cv-semantic-segmentation",title:"Semantic Segmentation",type:"concept",resources:[]},{id:"cv-image-embeddings",title:"Image Embeddings",type:"concept",resources:[]},{id:"cv-vision-transformers",title:"Vision Transformers",type:"algorithm",resources:[]},{id:"cv-vision-language-models",title:"Vision-Language Models",type:"concept",resources:[]}]},{id:"sec-sequence-models",title:"10. Sequence Models",description:"Recurrence, vanishing gradients in time, LSTM, GRU, and Seq2Seq architectures.",topics:[{id:"seq-rnn",title:"Recurrent Neural Networks",type:"algorithm",resources:[]},{id:"seq-vanishing-gradients-rnn",title:"Vanishing Gradients in RNNs",type:"concept",resources:[]},{id:"seq-lstm",title:"LSTM",type:"algorithm",resources:[]},{id:"seq-gru",title:"GRU",type:"algorithm",resources:[]},{id:"seq-sequence-to-sequence",title:"Sequence-to-Sequence",type:"concept",resources:[]},{id:"seq-encoder-decoder",title:"Encoder-Decoder Architecture",type:"concept",resources:[]}]},{id:"sec-attention-transformers",title:"11. Attention & Transformers",description:"Self-attention, multi-head attention, positional encoding, and transformer blocks.",topics:[{id:"tf-attention",title:"Attention",type:"concept",resources:[]},{id:"tf-qkv",title:"Query / Key / Value",type:"concept",resources:[]},{id:"tf-attention-scores",title:"Attention Scores",type:"concept",resources:[]},{id:"tf-scaled-dot-product",title:"Scaled Dot-Product Attention",type:"concept",resources:[]},{id:"tf-self-attention",title:"Self-Attention",type:"concept",resources:[]},{id:"tf-cross-attention",title:"Cross-Attention",type:"concept",resources:[]},{id:"tf-multi-head-attention",title:"Multi-Head Attention",type:"algorithm",resources:[]},{id:"tf-positional-encoding",title:"Positional Encoding",type:"concept",resources:[]},{id:"tf-transformer-architecture",title:"Transformer Architecture",type:"algorithm",resources:[{id:"res-att-paper",title:"Attention Is All You Need (Vaswani et al.)",url:"https://arxiv.org/abs/1706.03762",type:"Paper"}]},{id:"tf-transformer-encoder",title:"Transformer Encoder",type:"concept",resources:[]},{id:"tf-transformer-decoder",title:"Transformer Decoder",type:"concept",resources:[]},{id:"tf-residual-connections",title:"Residual Connections",type:"concept",resources:[]},{id:"tf-layer-normalization",title:"Layer Normalization",type:"concept",resources:[]},{id:"tf-feed-forward-network",title:"Feed-Forward Network",type:"concept",resources:[]},{id:"tf-causal-masking",title:"Causal Masking",type:"concept",resources:[]},{id:"tf-autoregressive-lm",title:"Autoregressive Language Modeling",type:"concept",resources:[]},{id:"tf-flash-attention",title:"FlashAttention & GPU SRAM Tiling",type:"algorithm",resources:[{id:"res-flash-att-paper",title:"FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (Dao et al.)",url:"https://arxiv.org/abs/2205.14135",type:"Paper"}]}]},{id:"sec-representation-generative",title:"12. Representation & Generative Learning",description:"Autoencoders, VAEs, GANs, self-supervised representation, and diffusion models.",topics:[{id:"rep-representation-learning",title:"Representation Learning",type:"concept",resources:[]},{id:"rep-autoencoders",title:"Autoencoders",type:"algorithm",resources:[]},{id:"rep-vae",title:"Variational Autoencoders",type:"algorithm",resources:[]},{id:"rep-gans",title:"GANs",type:"algorithm",resources:[]},{id:"rep-self-supervised-learning",title:"Self-Supervised Learning",type:"concept",resources:[]},{id:"rep-contrastive-learning",title:"Contrastive Learning",type:"concept",resources:[]},{id:"rep-diffusion-models",title:"Diffusion Models",type:"algorithm",resources:[]}]},{id:"sec-llm-foundations",title:"13. LLM Foundations",description:"Tokenization, pretraining, GPT/BERT paradigms, instruction tuning, RLHF, and inference.",topics:[{id:"llm-language-modeling",title:"Language Modeling",type:"concept",resources:[]},{id:"llm-tokenization",title:"Tokenization",type:"concept",resources:[]},{id:"llm-token-embeddings",title:"Token Embeddings",type:"concept",resources:[]},{id:"llm-positional-representations",title:"Positional Representations",type:"concept",resources:[]},{id:"llm-gpt-style-models",title:"GPT-style Models",type:"concept",resources:[]},{id:"llm-bert-style-models",title:"BERT-style Models",type:"concept",resources:[]},{id:"llm-pretraining",title:"Pretraining",type:"concept",resources:[]},{id:"llm-fine-tuning",title:"Fine-Tuning",type:"concept",resources:[]},{id:"llm-instruction-tuning",title:"Instruction Tuning",type:"concept",resources:[]},{id:"llm-preference-optimization",title:"Preference Optimization",type:"concept",resources:[]},{id:"llm-rlhf",title:"RLHF",type:"concept",resources:[]},{id:"llm-inference",title:"LLM Inference",type:"concept",resources:[]},{id:"llm-kv-cache",title:"The KV Cache Architecture",type:"algorithm",resources:[{id:"res-kv-expl",title:"Transformers KV Caching Explained",url:"https://kipp.ly/transformer-inference-scaling/",type:"Article"}]},{id:"llm-roofline-memory-vs-compute",title:"Memory-Bound vs. Compute-Bound Inference (Roofline Model)",type:"concept",resources:[]},{id:"llm-quantization-foundations",title:"Quantization Foundations (FP16, BF16, INT8, INT4)",type:"concept",resources:[{id:"res-quant-tim",title:"A Visual Guide to Quantization (Tim Dettmers)",url:"https://timdettmers.com/2022/08/17/llm-int8-and-emergent-features/",type:"Article"}]}]},{id:"sec-reinforcement-learning",title:"14. Reinforcement Learning",description:"MDPs, value & policy iterations, Bellman equations, Q-Learning, and Policy Gradients.",topics:[{id:"rl-mdp",title:"Markov Decision Processes",type:"concept",resources:[]},{id:"rl-states",title:"States",type:"concept",resources:[]},{id:"rl-actions",title:"Actions",type:"concept",resources:[]},{id:"rl-rewards",title:"Rewards",type:"concept",resources:[]},{id:"rl-policies",title:"Policies",type:"concept",resources:[]},{id:"rl-value-functions",title:"Value Functions",type:"concept",resources:[]},{id:"rl-q-functions",title:"Q Functions",type:"concept",resources:[]},{id:"rl-bellman-equation",title:"Bellman Equation",type:"concept",resources:[]},{id:"rl-q-learning",title:"Q-Learning",type:"algorithm",resources:[]},{id:"rl-sarsa",title:"SARSA",type:"algorithm",resources:[]},{id:"rl-policy-gradients",title:"Policy Gradients",type:"algorithm",resources:[]},{id:"rl-actor-critic",title:"Actor-Critic",type:"algorithm",resources:[]}]},{id:"sec-practical-ml-dl",title:"15. Practical ML / DL",description:"EDA, experiment tracking, model versioning, serving, monitoring, and production drift.",topics:[{id:"prac-eda",title:"Exploratory Data Analysis",type:"concept",resources:[]},{id:"prac-experiment-tracking",title:"Experiment Tracking",type:"concept",resources:[]},{id:"prac-reproducibility",title:"Reproducibility",type:"concept",resources:[]},{id:"prac-model-versioning",title:"Model Versioning",type:"concept",resources:[]},{id:"prac-data-versioning",title:"Data Versioning",type:"concept",resources:[]},{id:"prac-model-serving",title:"Model Serving",type:"concept",resources:[]},{id:"prac-batch-inference",title:"Batch Inference",type:"concept",resources:[]},{id:"prac-online-inference",title:"Online Inference",type:"concept",resources:[]},{id:"prac-model-monitoring",title:"Model Monitoring",type:"concept",resources:[]},{id:"prac-data-drift",title:"Data Drift",type:"concept",resources:[]},{id:"prac-model-drift",title:"Model Drift",type:"concept",resources:[]},{id:"prac-end-to-end-projects",title:"End-to-End ML Projects",type:"concept",resources:[]}]}],K=["supervised-linear-regression","supervised-logistic-regression","supervised-knn","supervised-naive-bayes","supervised-decision-trees","unsupervised-kmeans","unsupervised-pca"];function I(i){return i.type==="algorithm"?{knowledge:[{id:"k_intuition",label:"Understand intuition"},{id:"k_math",label:"Understand mathematical formulation"},{id:"k_training",label:"Understand loss function & training procedure"},{id:"k_tradeoffs",label:"Understand strengths and limitations"},{id:"k_explain",label:"Explain without notes"}],practical:[{id:"p_concept",label:"Concept understood"},{id:"p_scratch",label:"From-scratch implementation"},{id:"p_toy",label:"Tested on toy data"},{id:"p_library",label:"Compared against sklearn / library"},{id:"p_real",label:"Tested on real dataset"}]}:{knowledge:[{id:"k_intuition",label:"Understand core intuition"},{id:"k_formulation",label:"Understand theoretical formulation"},{id:"k_example",label:"Explain with a concrete example"},{id:"k_explain",label:"Explain without notes"}],practical:[{id:"p_experiment",label:"Experiment or visualize behavior in code"}]}}const M=new Map,U=new Map;N.forEach(i=>{U.set(i.id,i),i.topics.forEach(e=>{M.set(e.id,{...e,sectionId:i.id,sectionTitle:i.title})})});const W={[h.NOT_STARTED]:0,[h.LEARNING]:33.33,[h.FAMILIAR]:66.66,[h.SOLID]:100};function J(i){return W[i]??0}function Q(i){const e=i.userTopics||{};let s=0,t=0;const c={[h.SOLID]:0,[h.FAMILIAR]:0,[h.LEARNING]:0,[h.NOT_STARTED]:0};let n=0,d=0,m=0;const g=N.map(u=>{let r=u.topics.length,o=0,a=0,p=0;u.topics.forEach(L=>{s++;const S=e[L.id]||{},$=S.status||h.NOT_STARTED;c[$]=(c[$]||0)+1;const A=J($);o+=A,t+=A,S.needsReview&&n++;const E=I(L).practical;a+=E.length,d+=E.length,E.forEach(C=>{S.checklist&&S.checklist[C.id]&&(p++,m++)})});const k=r>0?Math.round(o/r):0,w=a>0?Math.round(p/a*100):0;return{id:u.id,title:u.title,totalTopics:r,knowledgePct:k,practicalPct:w,practicalTotal:a,practicalCompleted:p}}),b=s>0?Math.round(t/s):0,v=d>0?Math.round(m/d*100):0,l=(i.knowledgeGaps||[]).filter(u=>!u.resolved).length;return{totalTopics:s,overallKnowledgePct:b,overallPracticalPct:v,totalPracticalMilestones:d,completedPracticalMilestones:m,statusCounts:c,reviewCount:n,openGapsCount:l,sections:g}}function Y(i){const e=i.userTopics||{};let s=0,t=0;const c=K.map(d=>{const m=M.get(d);if(!m)return null;const g=e[d]||{},b=g.checklist||{},l=I(m).practical.map(o=>{s++;const a=!!b[o.id];return a&&t++,{id:o.id,label:o.label,completed:a}}),u=l.filter(o=>o.completed).length,r=l.length>0?Math.round(u/l.length*100):0;return{topicId:m.id,title:m.title,status:g.status||h.NOT_STARTED,milestones:l,completedCount:u,totalCount:l.length,pct:r}}).filter(Boolean),n=s>0?Math.round(t/s*100):0;return{algorithms:c,totalMilestones:s,completedMilestones:t,pct:n}}function f(i,e=18,s=""){const t=`width="${e}" height="${e}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${s}"`;switch(i){case"dashboard":return`<svg ${t}><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`;case"roadmap":return`<svg ${t}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>`;case"implementations":return`<svg ${t}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`;case"gaps":return`<svg ${t}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`;case"review":return`<svg ${t}><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`;case"search":return`<svg ${t}><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>`;case"cloud":return`<svg ${t}><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;case"sun":return`<svg ${t}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;case"moon":return`<svg ${t}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;case"chevron-down":return`<svg ${t}><path d="m6 9 6 6 6-6"/></svg>`;case"chevron-right":return`<svg ${t}><path d="m9 18 6-6-6-6"/></svg>`;case"check":return`<svg ${t}><polyline points="20 6 9 17 4 12"/></svg>`;case"x":return`<svg ${t}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;case"plus":return`<svg ${t}><path d="M5 12h14"/><path d="M12 5v14"/></svg>`;case"trash":return`<svg ${t}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;case"external-link":return`<svg ${t}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;case"target":return`<svg ${t}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;case"edit":return`<svg ${t}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;case"flag":return`<svg ${t}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>`;case"database":return`<svg ${t}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`;case"book":return`<svg ${t}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 2v20"/></svg>`;case"video":return`<svg ${t}><polygon points="23 7 16 12 23 17 23 7"/><rect width="15" height="14" x="1" y="5" rx="2" ry="2"/></svg>`;case"paper":return`<svg ${t}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`;default:return`<svg ${t}><circle cx="12" cy="12" r="10"/></svg>`}}function Z(i,{onOpenSearch:e,onOpenData:s,onToggleTheme:t,currentTheme:c,fileSyncStatus:n}){var v,l,u,r;const m=typeof navigator<"u"&&navigator.platform.toUpperCase().indexOf("MAC")>=0?"⌘K":"Ctrl+K";let g="synced",b="data/progress.json";n==="saving"?(g="syncing",b="Saving..."):n==="error"?(g="offline",b="Save error"):n==="offline"&&(g="offline",b="Local cache"),i.innerHTML=`
    <div class="header-brand">
      <div class="brand-icon">
        <span>ML</span>
      </div>
      <div class="brand-title">
        <span>ML / DL Roadmap</span>
        <span class="brand-badge">Tracker</span>
      </div>
    </div>

    <div class="header-actions">
      <!-- Search Command Trigger -->
      <button class="search-trigger-btn" id="header-search-btn" title="Search topics & knowledge gaps (${m})">
        ${f("search",15)}
        <span>Search topics...</span>
        <kbd class="search-kbd">${m}</kbd>
      </button>

      <!-- Local File Status Pill -->
      <button class="sync-status-pill" id="header-sync-pill" title="Stored locally in data/progress.json">
        <span class="sync-dot ${g}"></span>
        <span>${b}</span>
      </button>

      <!-- Theme Toggle -->
      <button class="btn-icon" id="header-theme-btn" title="Toggle dark / light theme">
        ${f(c==="dark"?"sun":"moon",17)}
      </button>

      <!-- Data / Settings Button -->
      <button class="btn-icon" id="header-data-btn" title="Data Backup & JSON Management">
        ${f("database",17)}
      </button>
    </div>
  `,(v=i.querySelector("#header-search-btn"))==null||v.addEventListener("click",e),(l=i.querySelector("#header-sync-pill"))==null||l.addEventListener("click",s),(u=i.querySelector("#header-theme-btn"))==null||u.addEventListener("click",t),(r=i.querySelector("#header-data-btn"))==null||r.addEventListener("click",s)}function X(i,{currentRoute:e,onNavigate:s,onOpenData:t,metrics:c,currentTheme:n,onToggleTheme:d}){var g,b;const m=[{id:"dashboard",label:"Dashboard",icon:"dashboard"},{id:"roadmap",label:"Roadmap",icon:"roadmap"},{id:"implementations",label:"Implementations",icon:"implementations",badge:`${c.completedPracticalMilestones}/${c.totalPracticalMilestones}`},{id:"gaps",label:"Knowledge Gaps",icon:"gaps",badge:c.openGapsCount>0?c.openGapsCount:null,alert:c.openGapsCount>0},{id:"review",label:"Review Queue",icon:"review",badge:c.reviewCount>0?c.reviewCount:null,alert:c.reviewCount>0}];i.innerHTML=`
    <div class="nav-section">
      <div class="nav-label">Navigation</div>
      ${m.map(v=>`
        <div class="nav-item ${e===v.id?"active":""}" data-route="${v.id}">
          <div class="nav-item-content">
            <span class="nav-item-icon">${f(v.icon,18)}</span>
            <span>${v.label}</span>
          </div>
          ${v.badge!==null&&v.badge!==void 0?`
            <span class="nav-badge ${v.alert?"alert":""}">${v.badge}</span>
          `:""}
        </div>
      `).join("")}
    </div>

    <div class="sidebar-footer">
      <div class="nav-item" id="sidebar-data-btn">
        <div class="nav-item-content">
          <span class="nav-item-icon">${f("database",18)}</span>
          <span>Data & Sync</span>
        </div>
      </div>
      <div class="nav-item" id="sidebar-theme-btn">
        <div class="nav-item-content">
          <span class="nav-item-icon">${f(n==="dark"?"sun":"moon",18)}</span>
          <span>${n==="dark"?"Light Mode":"Dark Mode"}</span>
        </div>
      </div>
    </div>
  `,i.querySelectorAll(".nav-item[data-route]").forEach(v=>{v.addEventListener("click",()=>{const l=v.getAttribute("data-route");l&&s(l)})}),(g=i.querySelector("#sidebar-data-btn"))==null||g.addEventListener("click",t),(b=i.querySelector("#sidebar-theme-btn"))==null||b.addEventListener("click",d)}function ee(i,{state:e,metrics:s,onOpenTopic:t,onNavigateSection:c}){var m,g;const n=e.currentFocus?M.get(e.currentFocus):null,d=e.currentFocus?e.userTopics[e.currentFocus]||{}:null;i.innerHTML=`
    <div class="dashboard-grid">
      <!-- 1. Current Focus Hero Card -->
      <div class="focus-hero-card ${n?"active-focus":""}">
        <div>
          <div class="focus-badge-tag">
            ${f("target",14)}
            <span>${n?"Currently Learning":"Current Focus"}</span>
          </div>
          <div class="focus-topic-name">
            ${n?n.title:"No topic actively set as current focus"}
          </div>
          <div class="focus-topic-sub">
            ${n?`${n.sectionTitle} • Status: <strong>${((d==null?void 0:d.status)||h.NOT_STARTED).replace("_"," ")}</strong>`:'Pick any topic in the roadmap and click "Set as Current Focus" to anchor your study session.'}
          </div>
        </div>
        <div>
          ${n?`
            <button class="btn btn-primary" id="dashboard-open-focus-btn">
              <span>Open Topic</span>
              ${f("chevron-right",15)}
            </button>
          `:`
            <button class="btn btn-secondary" id="dashboard-browse-roadmap-btn">
              <span>Browse Roadmap</span>
              ${f("chevron-right",15)}
            </button>
          `}
        </div>
      </div>

      <!-- 2. Dual Progress Metrics (Knowledge & Practical) -->
      <div class="metrics-row">
        <!-- Overall Knowledge Progress -->
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Knowledge Mastery</span>
            <span class="metric-sub">Weighted Score</span>
          </div>
          <div class="metric-value-row">
            <span class="metric-num brand">${s.overallKnowledgePct}%</span>
            <span class="metric-sub">across ${s.totalTopics} topics</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill brand" style="width: ${s.overallKnowledgePct}%"></div>
          </div>
        </div>

        <!-- Practical Implementation Progress -->
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Practical Implementation</span>
            <span class="metric-sub">Hands-on Code</span>
          </div>
          <div class="metric-value-row">
            <span class="metric-num emerald">${s.overallPracticalPct}%</span>
            <span class="metric-sub">${s.completedPracticalMilestones} / ${s.totalPracticalMilestones} milestones</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill emerald" style="width: ${s.overallPracticalPct}%"></div>
          </div>
        </div>

        <!-- Open Knowledge Gaps -->
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Knowledge Gaps</span>
            ${f("gaps",16,"text-muted")}
          </div>
          <div class="metric-value-row">
            <span class="metric-num ${s.openGapsCount>0?"priority-high":""}">${s.openGapsCount}</span>
            <span class="metric-sub">unresolved questions</span>
          </div>
          <div class="metric-sub">
            Capture doubts as you study to resolve later.
          </div>
        </div>

        <!-- Topics to Review -->
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Review Queue</span>
            ${f("review",16,"text-muted")}
          </div>
          <div class="metric-value-row">
            <span class="metric-num ${s.reviewCount>0?"priority-medium":""}">${s.reviewCount}</span>
            <span class="metric-sub">topics flagged</span>
          </div>
          <div class="metric-sub">
            Spaced repetition queue for long-term retention.
          </div>
        </div>
      </div>

      <!-- 3. Knowledge Status Counts Breakdown -->
      <div class="status-counts-grid">
        <div class="status-stat-pill solid">
          <span class="status-stat-label">Solid (Mastered)</span>
          <span class="status-stat-val">${s.statusCounts[h.SOLID]||0}</span>
        </div>
        <div class="status-stat-pill familiar">
          <span class="status-stat-label">Familiar</span>
          <span class="status-stat-val">${s.statusCounts[h.FAMILIAR]||0}</span>
        </div>
        <div class="status-stat-pill learning">
          <span class="status-stat-label">Learning</span>
          <span class="status-stat-val">${s.statusCounts[h.LEARNING]||0}</span>
        </div>
        <div class="status-stat-pill not-started">
          <span class="status-stat-label">Not Started</span>
          <span class="status-stat-val">${s.statusCounts[h.NOT_STARTED]||0}</span>
        </div>
      </div>

      <!-- 4. Section-by-Section Breakdown -->
      <div class="dashboard-sections-container">
        <div class="dashboard-sections-header">
          <span>Curriculum Progress by Section</span>
          <span class="metric-sub">Click a section to open in Roadmap</span>
        </div>

        <div class="section-progress-list">
          ${s.sections.map(b=>`
            <div class="section-progress-item" data-section-id="${b.id}">
              <div class="section-item-header">
                <span class="section-item-title">${b.title}</span>
                <span class="section-item-pct">${b.knowledgePct}%</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill brand" style="width: ${b.knowledgePct}%"></div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `,(m=i.querySelector("#dashboard-open-focus-btn"))==null||m.addEventListener("click",()=>{e.currentFocus&&t(e.currentFocus)}),(g=i.querySelector("#dashboard-browse-roadmap-btn"))==null||g.addEventListener("click",()=>{c(null)}),i.querySelectorAll(".section-progress-item").forEach(b=>{b.addEventListener("click",()=>{const v=b.getAttribute("data-section-id");v&&c(v)})})}function te(i,{state:e,metrics:s,filters:t,onSetFilters:c,onOpenTopic:n,onCycleStatus:d,targetSectionId:m=null}){var u,r,o;const g=e.userTopics||{};let b=!1;function v(a,p){const k=p.status||h.NOT_STARTED;if(t.status&&t.status!=="ALL"&&k!==t.status||t.review&&t.review==="REVIEW_ONLY"&&!p.needsReview)return!1;if(t.practical&&t.practical!=="ALL"){const L=I(a).practical,S=L.filter(A=>p.checklist&&p.checklist[A.id]).length,$=L.length;if(t.practical==="NOT_STARTED"&&S!==0||t.practical==="IN_PROGRESS"&&(S===0||S===$)||t.practical==="COMPLETE"&&S!==$)return!1}if(t.query&&t.query.trim()){const w=t.query.toLowerCase().trim();if(!a.title.toLowerCase().includes(w))return!1}return!0}const l=N.map(a=>{const p=a.topics.filter(w=>v(w,g[w.id]||{})),k=s.sections.find(w=>w.id===a.id);return{...a,topics:p,totalCount:a.topics.length,knowledgePct:k?k.knowledgePct:0}}).filter(a=>a.topics.length>0||!t.query);if(i.innerHTML=`
    <div class="view-header">
      <div class="view-title-row">
        <div>
          <h1 class="view-heading">ML / DL Roadmap</h1>
          <p class="view-subheading">Hierarchical progression from Classical ML to Modern Deep Learning & LLMs.</p>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" id="toggle-expand-all-btn">
            <span>Expand / Collapse All</span>
          </button>
        </div>
      </div>

      <!-- Filters Toolbar -->
      <div class="filter-bar">
        <!-- Knowledge Status Filter -->
        <div class="filter-group">
          <span class="filter-label">Status:</span>
          <button class="filter-chip ${t.status==="ALL"?"active":""}" data-filter-status="ALL">All</button>
          <button class="filter-chip ${t.status===h.NOT_STARTED?"active":""}" data-filter-status="${h.NOT_STARTED}">Not Started</button>
          <button class="filter-chip ${t.status===h.LEARNING?"active":""}" data-filter-status="${h.LEARNING}">Learning</button>
          <button class="filter-chip ${t.status===h.FAMILIAR?"active":""}" data-filter-status="${h.FAMILIAR}">Familiar</button>
          <button class="filter-chip ${t.status===h.SOLID?"active":""}" data-filter-status="${h.SOLID}">Solid</button>
        </div>

        <div style="height: 18px; width: 1px; background: var(--color-border); margin: 0 0.25rem;"></div>

        <!-- Review Filter -->
        <div class="filter-group">
          <button class="filter-chip review ${t.review==="REVIEW_ONLY"?"active":""}" id="filter-review-toggle">
            ${f("flag",13)}
            <span>Needs Review</span>
          </button>
        </div>

        <div style="height: 18px; width: 1px; background: var(--color-border); margin: 0 0.25rem;"></div>

        <!-- Practical Filter -->
        <div class="filter-group">
          <span class="filter-label">Practical:</span>
          <button class="filter-chip ${t.practical==="ALL"?"active":""}" data-filter-practical="ALL">All</button>
          <button class="filter-chip ${t.practical==="IN_PROGRESS"?"active":""}" data-filter-practical="IN_PROGRESS">In Progress</button>
          <button class="filter-chip ${t.practical==="COMPLETE"?"active":""}" data-filter-practical="COMPLETE">Complete</button>
        </div>
      </div>
    </div>

    <!-- Sections Accordion Tree -->
    <div class="roadmap-sections-tree">
      ${l.length===0?`
        <div class="empty-state">
          <div class="empty-state-icon">${f("search",32)}</div>
          <div class="empty-state-title">No topics match your filters</div>
          <div class="empty-state-desc">Try clearing your filters or search term to see roadmap topics.</div>
          <button class="btn btn-secondary btn-sm" id="reset-filters-btn" style="margin-top: 1rem;">Reset Filters</button>
        </div>
      `:l.map((a,p)=>`
          <div class="roadmap-section-card ${(m?a.id===m:p===0||a.topics.some(w=>w.id===e.currentFocus))?"expanded":""}" id="section-card-${a.id}" data-section-id="${a.id}">
            <div class="section-accordion-header">
              <div class="section-header-left">
                <span class="section-chevron">${f("chevron-right",18)}</span>
                <span class="section-title">${a.title}</span>
                <span class="section-topic-count">${a.topics.length} topics</span>
              </div>
              <div class="section-header-right">
                <div class="progress-bar-track" style="width: 100px;">
                  <div class="progress-bar-fill brand" style="width: ${a.knowledgePct}%"></div>
                </div>
                <span class="section-pct-pill">${a.knowledgePct}%</span>
              </div>
            </div>

            <div class="section-topics-list">
              ${a.topics.map(w=>{const L=g[w.id]||{},S=L.status||h.NOT_STARTED,$=e.currentFocus===w.id,R=I(w).practical,E=R.filter(C=>L.checklist&&L.checklist[C.id]).length;return`
                  <div class="topic-row ${$?"current-focus":""}" data-topic-id="${w.id}">
                    <div class="topic-row-left">
                      <span class="topic-bullet"></span>
                      <span class="topic-name">${w.title}</span>
                    </div>

                    <div class="topic-row-badges">
                      ${L.needsReview?`
                        <span class="review-flag-indicator" title="Marked for review">
                          ${f("flag",11)}
                          <span>Review</span>
                        </span>
                      `:""}

                      ${R.length>0?`
                        <span class="practical-mini-indicator" title="Practical tasks completed">
                          ${E}/${R.length} code
                        </span>
                      `:""}

                      <button class="status-badge ${S.toLowerCase().replace("_","-")} clickable" data-cycle-id="${w.id}" title="Click to cycle status">
                        <span class="status-dot"></span>
                        <span>${S.replace("_"," ")}</span>
                      </button>
                    </div>
                  </div>
                `}).join("")}
            </div>
          </div>
        `).join("")}
    </div>
  `,i.querySelectorAll(".section-accordion-header").forEach(a=>{a.addEventListener("click",()=>{const p=a.closest(".roadmap-section-card");p&&p.classList.toggle("expanded")})}),(u=i.querySelector("#toggle-expand-all-btn"))==null||u.addEventListener("click",()=>{const a=i.querySelectorAll(".roadmap-section-card");b=!b,a.forEach(p=>{b?p.classList.add("expanded"):p.classList.remove("expanded")})}),i.querySelectorAll("[data-filter-status]").forEach(a=>{a.addEventListener("click",()=>{const p=a.getAttribute("data-filter-status");c({...t,status:p})})}),(r=i.querySelector("#filter-review-toggle"))==null||r.addEventListener("click",()=>{const a=t.review==="REVIEW_ONLY"?"ALL":"REVIEW_ONLY";c({...t,review:a})}),i.querySelectorAll("[data-filter-practical]").forEach(a=>{a.addEventListener("click",()=>{const p=a.getAttribute("data-filter-practical");c({...t,practical:p})})}),(o=i.querySelector("#reset-filters-btn"))==null||o.addEventListener("click",()=>{c({status:"ALL",review:"ALL",practical:"ALL",query:""})}),i.querySelectorAll(".topic-row").forEach(a=>{a.addEventListener("click",p=>{if(p.target.closest("[data-cycle-id]"))return;const k=a.getAttribute("data-topic-id");k&&n(k)})}),i.querySelectorAll("[data-cycle-id]").forEach(a=>{a.addEventListener("click",p=>{p.stopPropagation();const k=a.getAttribute("data-cycle-id");k&&d(k)})}),m){const a=i.querySelector(`#section-card-${m}`);a&&a.scrollIntoView({behavior:"smooth",block:"start"})}}function se(i,{state:e,onToggleMilestone:s,onOpenTopic:t}){const c=Y(e);i.innerHTML=`
    <div class="view-header">
      <div class="view-title-row">
        <div>
          <h1 class="view-heading">From-Scratch Implementation Tracker</h1>
          <p class="view-subheading">Build core ML algorithms from scratch to solidify intuition and numerical mechanics.</p>
        </div>
        <div>
          <span class="brand-badge" style="font-size: 0.82rem; padding: 0.35rem 0.75rem;">
            ${c.completedMilestones} / ${c.totalMilestones} Milestones Complete (${c.pct}%)
          </span>
        </div>
      </div>

      <div class="progress-bar-track" style="height: 9px; margin-top: 0.5rem;">
        <div class="progress-bar-fill emerald" style="width: ${c.pct}%"></div>
      </div>
    </div>

    <div class="implementation-container">
      <div class="implementation-table-card">
        <table class="impl-table">
          <thead>
            <tr>
              <th style="width: 28%;">Algorithm</th>
              <th style="width: 14%;">Concept Understood</th>
              <th style="width: 15%;">From-Scratch Code</th>
              <th style="width: 14%;">Toy Data Test</th>
              <th style="width: 15%;">vs. Sklearn</th>
              <th style="width: 14%;">Real Dataset</th>
            </tr>
          </thead>
          <tbody>
            ${c.algorithms.map(n=>`
              <tr>
                <td>
                  <div class="impl-algo-name" data-open-topic="${n.topicId}">
                    <span>${n.title}</span>
                    ${f("external-link",13,"text-subtle")}
                  </div>
                  <div class="metric-sub" style="margin-top: 0.2rem;">
                    ${n.completedCount} / ${n.totalCount} completed (${n.pct}%)
                  </div>
                </td>
                ${n.milestones.map(d=>`
                  <td class="impl-milestone-cell">
                    <input 
                      type="checkbox" 
                      class="milestone-checkbox" 
                      data-topic-id="${n.topicId}" 
                      data-milestone-id="${d.id}"
                      ${d.completed?"checked":""}
                      title="${d.label}"
                    />
                  </td>
                `).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="metric-card" style="background-color: var(--color-surface); border-radius: var(--radius-xl);">
        <div style="font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">Why Implement From Scratch?</div>
        <p style="color: var(--color-text-muted); font-size: 0.88rem; line-height: 1.5;">
          Implementing algorithms with only NumPy reveals edge cases, matrix vectorization, gradient stability, and optimization behavior that high-level frameworks abstract away. Testing against Scikit-Learn verifies correctness on identical data.
        </p>
      </div>
    </div>
  `,i.querySelectorAll(".milestone-checkbox").forEach(n=>{n.addEventListener("change",()=>{const d=n.getAttribute("data-topic-id"),m=n.getAttribute("data-milestone-id");d&&m&&s(d,m)})}),i.querySelectorAll("[data-open-topic]").forEach(n=>{n.addEventListener("click",()=>{const d=n.getAttribute("data-open-topic");d&&t(d)})})}function ie(i,{state:e,onOpenTopic:s,onAddGap:t,onToggleResolved:c,onDeleteGap:n}){var v;const d=e.knowledgeGaps||[];let m="OPEN";function g(){var r;const l=i.querySelector("#gaps-list-container");if(!l)return;let u=d;if(m==="OPEN"?u=d.filter(o=>!o.resolved):m==="RESOLVED"&&(u=d.filter(o=>o.resolved)),u.length===0){d.length===0?(l.innerHTML=`
          <div class="empty-state">
            <div class="empty-state-icon">${f("gaps",36)}</div>
            <div class="empty-state-title">You haven't recorded any knowledge gaps yet.</div>
            <div class="empty-state-desc">Whenever you encounter a concept or mathematical detail you don't fully understand while studying, record it here.</div>
            <button class="btn btn-primary btn-sm" id="empty-add-gap-btn" style="margin-top: 1.25rem;">
              ${f("plus",15)}
              <span>Add First Knowledge Gap</span>
            </button>
          </div>
        `,(r=l.querySelector("#empty-add-gap-btn"))==null||r.addEventListener("click",b)):l.innerHTML=`
          <div class="empty-state">
            <div class="empty-state-icon">${f("check",36)}</div>
            <div class="empty-state-title">No knowledge gaps in this view</div>
            <div class="empty-state-desc">${m==="OPEN"?"All recorded knowledge gaps have been resolved. Great work!":"No resolved knowledge gaps yet."}</div>
          </div>
        `;return}l.innerHTML=`
      <div class="gaps-list">
        ${u.map(o=>{const a=o.topicId?M.get(o.topicId):null;return`
            <div class="gap-card ${o.resolved?"resolved":""}" data-gap-id="${o.id}">
              <div class="gap-card-left">
                <input 
                  type="checkbox" 
                  class="gap-resolve-check" 
                  data-gap-id="${o.id}" 
                  ${o.resolved?"checked":""} 
                  title="Mark as resolved"
                />
                <div>
                  <div class="gap-title">${o.title}</div>
                  <div class="gap-meta-row">
                    <span class="priority-badge ${o.priority.toLowerCase()}">
                      ${o.priority==="High"?"🔴 High":o.priority==="Medium"?"🟡 Medium":"🟢 Low"}
                    </span>
                    ${a?`
                      <span class="gap-topic-tag" data-topic-id="${a.id}">
                        ${a.title}
                      </span>
                    `:""}
                  </div>
                </div>
              </div>

              <div>
                <button class="btn-icon" data-delete-gap="${o.id}" title="Delete knowledge gap">
                  ${f("trash",16)}
                </button>
              </div>
            </div>
          `}).join("")}
      </div>
    `,l.querySelectorAll(".gap-resolve-check").forEach(o=>{o.addEventListener("change",()=>{const a=o.getAttribute("data-gap-id");a&&c(a)})}),l.querySelectorAll(".gap-topic-tag").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-topic-id");a&&s(a)})}),l.querySelectorAll("[data-delete-gap]").forEach(o=>{o.addEventListener("click",()=>{const a=o.getAttribute("data-delete-gap");a&&confirm("Delete this knowledge gap?")&&n(a)})})}function b(){var r,o,a,p;const l=document.getElementById("modal-container");if(!l)return;l.innerHTML=`
      <div class="modal-backdrop active" id="add-gap-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title">Record Knowledge Gap</h2>
            <button class="btn-icon" id="close-add-gap-modal">${f("x",18)}</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">What concept or question is unclear?</label>
              <input 
                type="text" 
                class="form-input" 
                id="new-gap-title" 
                placeholder="e.g. Why does PCA maximize variance instead of minimizing error?" 
                autofocus 
              />
            </div>

            <div class="form-group">
              <label class="form-label">Associated Roadmap Topic (optional)</label>
              <select class="form-select" id="new-gap-topic">
                <option value="">-- Unassigned --</option>
                ${N.map(k=>`
                  <optgroup label="${k.title}">
                    ${k.topics.map(w=>`<option value="${w.id}">${w.title}</option>`).join("")}
                  </optgroup>
                `).join("")}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Priority</label>
              <select class="form-select" id="new-gap-priority">
                <option value="High">High (Blocking understanding)</option>
                <option value="Medium" selected>Medium (Important to solidify)</option>
                <option value="Low">Low (Curiosity / nice-to-know)</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" id="cancel-add-gap">Cancel</button>
            <button class="btn btn-primary" id="save-new-gap">Add Knowledge Gap</button>
          </div>
        </div>
      </div>
    `;const u=()=>{l.innerHTML=""};(r=l.querySelector("#close-add-gap-modal"))==null||r.addEventListener("click",u),(o=l.querySelector("#cancel-add-gap"))==null||o.addEventListener("click",u),(a=l.querySelector("#add-gap-backdrop"))==null||a.addEventListener("click",k=>{k.target.id==="add-gap-backdrop"&&u()}),(p=l.querySelector("#save-new-gap"))==null||p.addEventListener("click",()=>{const k=l.querySelector("#new-gap-title"),w=l.querySelector("#new-gap-topic"),L=l.querySelector("#new-gap-priority"),S=k==null?void 0:k.value.trim();if(!S){k==null||k.focus();return}t(S,(w==null?void 0:w.value)||null,(L==null?void 0:L.value)||"Medium"),u()})}i.innerHTML=`
    <div class="view-header">
      <div class="view-title-row">
        <div>
          <h1 class="view-heading">Knowledge Gaps</h1>
          <p class="view-subheading">Track specific conceptual doubts and intuitive blockers encountered during study.</p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" id="trigger-add-gap-btn">
            ${f("plus",16)}
            <span>Add Knowledge Gap</span>
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-bar">
        <button class="filter-chip ${m==="OPEN"?"active":""}" data-tab="OPEN">Open Doubts</button>
        <button class="filter-chip ${m==="ALL"?"active":""}" data-tab="ALL">All Gaps (${d.length})</button>
        <button class="filter-chip ${m==="RESOLVED"?"active":""}" data-tab="RESOLVED">Resolved</button>
      </div>
    </div>

    <div class="gaps-container">
      <div id="gaps-list-container"></div>
    </div>
  `,i.querySelectorAll("[data-tab]").forEach(l=>{l.addEventListener("click",()=>{m=l.getAttribute("data-tab"),i.querySelectorAll("[data-tab]").forEach(u=>u.classList.toggle("active",u===l)),g()})}),(v=i.querySelector("#trigger-add-gap-btn"))==null||v.addEventListener("click",b),g()}function ae(i,{state:e,onOpenTopic:s,onToggleReview:t,onCycleStatus:c}){var v;const n=e.userTopics||{};let d="ALL";const g=Object.keys(n).filter(l=>{var u;return(u=n[l])==null?void 0:u.needsReview}).map(l=>{const u=M.get(l);return u?{...u,...n[l]}:null}).filter(Boolean);function b(){const l=i.querySelector("#review-queue-list");if(!l)return;let u=g;if(d!=="ALL"&&(u=g.filter(r=>r.sectionId===d)),u.length===0){g.length===0?l.innerHTML=`
          <div class="empty-state">
            <div class="empty-state-icon">${f("check",40)}</div>
            <div class="empty-state-title">Your review queue is empty. Nice work.</div>
            <div class="empty-state-desc">As you study topics in the roadmap, flag any topic with "Needs Review" whenever you want to revisit it later for spaced repetition.</div>
          </div>
        `:l.innerHTML=`
          <div class="empty-state">
            <div class="empty-state-icon">${f("search",36)}</div>
            <div class="empty-state-title">No review items in this section</div>
            <div class="empty-state-desc">Try selecting another section or "All Sections".</div>
          </div>
        `;return}l.innerHTML=`
      <div class="roadmap-sections-tree">
        ${u.map(r=>{const o=r.status||h.NOT_STARTED;return`
            <div class="gap-card" data-topic-id="${r.id}">
              <div class="gap-card-left" style="align-items: center;">
                <button class="status-badge ${o.toLowerCase().replace("_","-")}" data-cycle-status="${r.id}" title="Click to cycle status">
                  <span class="status-dot"></span>
                  <span>${o.replace("_"," ")}</span>
                </button>

                <div style="cursor: pointer;" data-open-topic="${r.id}">
                  <div class="gap-title" style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${r.title}</span>
                    ${f("external-link",14,"text-subtle")}
                  </div>
                  <div class="metric-sub" style="margin-top: 0.15rem;">
                    ${r.sectionTitle}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm" data-remove-review="${r.id}">
                  ${f("check",14)}
                  <span>Done Reviewing</span>
                </button>
              </div>
            </div>
          `}).join("")}
      </div>
    `,l.querySelectorAll("[data-remove-review]").forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-remove-review");o&&t(o)})}),l.querySelectorAll("[data-cycle-status]").forEach(r=>{r.addEventListener("click",o=>{o.stopPropagation();const a=r.getAttribute("data-cycle-status");a&&c(a)})}),l.querySelectorAll("[data-open-topic]").forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-open-topic");o&&s(o)})})}i.innerHTML=`
    <div class="view-header">
      <div class="view-title-row">
        <div>
          <h1 class="view-heading">Review Queue</h1>
          <p class="view-subheading">Spaced repetition queue for topics you flagged to reinforce.</p>
        </div>
        <div>
          <span class="brand-badge" style="font-size: 0.82rem; padding: 0.35rem 0.75rem;">
            Needs Review: ${g.length}
          </span>
        </div>
      </div>

      <!-- Section Filter Dropdown -->
      <div class="filter-bar">
        <span class="filter-label">Filter Section:</span>
        <select class="form-select" id="review-section-filter" style="padding: 0.3rem 0.7rem; font-size: 0.82rem; max-width: 320px;">
          <option value="ALL">All Sections (${g.length})</option>
          ${N.map(l=>{const u=g.filter(r=>r.sectionId===l.id).length;return u===0?"":`<option value="${l.id}">${l.title} (${u})</option>`}).join("")}
        </select>
      </div>
    </div>

    <div id="review-queue-list"></div>
  `,(v=i.querySelector("#review-section-filter"))==null||v.addEventListener("change",l=>{d=l.target.value,b()}),b()}function re(i,{topicId:e,state:s,onClose:t,onSetStatus:c,onCycleStatus:n,onToggleChecklist:d,onUpdateNotes:m,onToggleFocus:g,onToggleReview:b,onAddResource:v,onDeleteResource:l,onAddGapForTopic:u}){var E,C,_,P,F,q,G;if(!e){i.innerHTML="";return}const r=M.get(e);if(!r)return;const o=s.userTopics[e]||{status:h.NOT_STARTED,needsReview:!1,notes:"",checklist:{},resources:[]},a=o.status||h.NOT_STARTED,p=s.currentFocus===e,k=!!o.needsReview,w=I(r),L=[...r.resources||[],...o.resources||[]],S=(s.knowledgeGaps||[]).filter(y=>y.topicId===e);i.innerHTML=`
    <div class="drawer-backdrop active" id="drawer-backdrop"></div>
    <div class="topic-drawer active" id="topic-drawer-panel">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="drawer-title-row">
          <div>
            <div class="drawer-section-title">${r.sectionTitle}</div>
            <h2 class="drawer-title">${r.title}</h2>
          </div>
          <button class="btn-icon" id="close-drawer-btn" title="Close drawer (Esc)">
            ${f("x",20)}
          </button>
        </div>

        <div class="drawer-meta-row">
          <!-- Status Selector Dropdown -->
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <select class="form-select" id="drawer-status-select" style="padding: 0.25rem 0.6rem; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; font-weight: 700;">
              <option value="${h.NOT_STARTED}" ${a===h.NOT_STARTED?"selected":""}>NOT STARTED (0%)</option>
              <option value="${h.LEARNING}" ${a===h.LEARNING?"selected":""}>LEARNING (33%)</option>
              <option value="${h.FAMILIAR}" ${a===h.FAMILIAR?"selected":""}>FAMILIAR (66%)</option>
              <option value="${h.SOLID}" ${a===h.SOLID?"selected":""}>SOLID (100%)</option>
            </select>
          </div>

          <!-- Current Focus Toggle -->
          <button class="btn btn-sm ${p?"btn-primary":"btn-secondary"}" id="drawer-focus-toggle">
            ${f("target",14)}
            <span>${p?"Current Focus":"Set as Current Focus"}</span>
          </button>

          <!-- Needs Review Toggle -->
          <button class="btn btn-sm ${k?"btn-danger":"btn-secondary"}" id="drawer-review-toggle">
            ${f("flag",14)}
            <span>${k?"Flagged for Review":"Mark for Review"}</span>
          </button>
        </div>
      </div>

      <!-- Drawer Body Content -->
      <div class="drawer-body">
        <!-- 1. Knowledge Checklist -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Knowledge Milestones</span>
            <span class="metric-sub">${w.knowledge.filter(y=>{var T;return(T=o.checklist)==null?void 0:T[y.id]}).length} / ${w.knowledge.length}</span>
          </div>
          <div class="checklist-group">
            ${w.knowledge.map(y=>{var x;const T=!!((x=o.checklist)!=null&&x[y.id]);return`
                <label class="check-item ${T?"completed":""}">
                  <input type="checkbox" data-check-id="${y.id}" ${T?"checked":""} />
                  <span class="check-item-label">${y.label}</span>
                </label>
              `}).join("")}
          </div>
        </div>

        <!-- 2. Practical Checklist -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Practical Implementation</span>
            <span class="metric-sub">${w.practical.filter(y=>{var T;return(T=o.checklist)==null?void 0:T[y.id]}).length} / ${w.practical.length}</span>
          </div>
          <div class="checklist-group">
            ${w.practical.map(y=>{var x;const T=!!((x=o.checklist)!=null&&x[y.id]);return`
                <label class="check-item ${T?"completed":""}">
                  <input type="checkbox" data-check-id="${y.id}" ${T?"checked":""} />
                  <span class="check-item-label">${y.label}</span>
                </label>
              `}).join("")}
          </div>
        </div>

        <!-- 3. Notes Area -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Personal Notes</span>
            <span class="metric-sub" id="notes-save-status">Auto-saved</span>
          </div>
          <textarea 
            class="notes-textarea" 
            id="drawer-notes-input" 
            placeholder="Key formulas, matrix shapes, theoretical takeaways, or edge cases..."
          >${o.notes||""}</textarea>
          <div class="notes-footer">
            <span>Markdown supported in thought flow</span>
          </div>
        </div>

        <!-- 4. Linked Knowledge Gaps -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Knowledge Gaps (${S.length})</span>
            <button class="btn btn-subtle btn-sm" id="drawer-add-gap-btn">
              ${f("plus",13)}
              <span>Add Gap</span>
            </button>
          </div>

          ${S.length===0?`
            <div class="metric-sub" style="font-style: italic;">No specific knowledge gaps logged for this topic yet.</div>
          `:`
            <div class="checklist-group">
              ${S.map(y=>`
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
                  <span style="font-size: 0.88rem; ${y.resolved?"text-decoration: line-through; opacity: 0.6;":""}">${y.title}</span>
                  <span class="priority-badge ${y.priority.toLowerCase()}">${y.priority}</span>
                </div>
              `).join("")}
            </div>
          `}
        </div>

        <!-- 5. Resources -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Curated & Attached Resources</span>
          </div>

          ${L.length===0?`
            <div class="metric-sub" style="font-style: italic; margin-bottom: 1rem;">No resources added yet.</div>
          `:`
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
              ${L.map(y=>`
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0.6rem; background-color: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                  <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
                    <span class="nav-badge" style="font-size: 0.68rem;">${y.type}</span>
                    <a href="${y.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.86rem; color: var(--color-text-main); font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                      ${y.title}
                    </a>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.35rem;">
                    <a href="${y.url}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="Open resource">
                      ${f("external-link",14)}
                    </a>
                    ${y.id.startsWith("res-")&&!["res-1","res-lr-1","res-log-1","res-knn-1","res-nb-1","res-dt-1","res-km-1","res-pca-1","res-att-paper"].includes(y.id)?`
                      <button class="btn-icon" data-delete-resource="${y.id}" title="Remove resource">
                        ${f("trash",14)}
                      </button>
                    `:""}
                  </div>
                </div>
              `).join("")}
            </div>
          `}

          <!-- Quick Add Resource Form -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid var(--color-border);">
            <div style="font-size: 0.78rem; font-weight: 600; color: var(--color-text-muted);">Attach Resource:</div>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" class="form-input" id="new-res-title" placeholder="Title (e.g. Chapter 2 Notes)" style="flex: 1;" />
              <select class="form-select" id="new-res-type" style="width: 100px;">
                <option value="Book">Book</option>
                <option value="Paper">Paper</option>
                <option value="Video">Video</option>
                <option value="Article">Article</option>
                <option value="Documentation">Docs</option>
                <option value="Course">Course</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <input type="url" class="form-input" id="new-res-url" placeholder="https://..." style="flex: 1;" />
              <button class="btn btn-secondary btn-sm" id="save-res-btn">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,(E=i.querySelector("#close-drawer-btn"))==null||E.addEventListener("click",t),(C=i.querySelector("#drawer-backdrop"))==null||C.addEventListener("click",t),(_=i.querySelector("#drawer-status-select"))==null||_.addEventListener("change",y=>{c(e,y.target.value)}),(P=i.querySelector("#drawer-focus-toggle"))==null||P.addEventListener("click",()=>{g(e)}),(F=i.querySelector("#drawer-review-toggle"))==null||F.addEventListener("click",()=>{b(e)}),i.querySelectorAll("[data-check-id]").forEach(y=>{y.addEventListener("change",()=>{const T=y.getAttribute("data-check-id");T&&d(e,T)})});const $=i.querySelector("#drawer-notes-input"),A=i.querySelector("#notes-save-status");let R=null;$==null||$.addEventListener("input",()=>{A&&(A.textContent="Saving..."),clearTimeout(R),R=setTimeout(()=>{m(e,$.value),A&&(A.textContent="Saved")},500)}),(q=i.querySelector("#drawer-add-gap-btn"))==null||q.addEventListener("click",()=>{const y=prompt(`What question or doubt do you have about ${r.title}?`);y&&y.trim()&&u(y.trim(),e)}),(G=i.querySelector("#save-res-btn"))==null||G.addEventListener("click",()=>{var z,B,V;const y=(z=i.querySelector("#new-res-title"))==null?void 0:z.value.trim(),T=(B=i.querySelector("#new-res-url"))==null?void 0:B.value.trim(),x=(V=i.querySelector("#new-res-type"))==null?void 0:V.value;if(!y||!T){alert("Please enter both title and URL.");return}v(e,{title:y,url:T,type:x})}),i.querySelectorAll("[data-delete-resource]").forEach(y=>{y.addEventListener("click",()=>{const T=y.getAttribute("data-delete-resource");T&&l(e,T)})})}function oe(i,{state:e,onClose:s,onSelectTopic:t,onSelectSection:c}){var l,u;let n=0,d=[];function m(r){if(!r||!r.trim())return[];const o=r.toLowerCase().trim(),a=[];return M.forEach(p=>{(p.title.toLowerCase().includes(o)||p.sectionTitle.toLowerCase().includes(o))&&a.push({type:"topic",id:p.id,title:p.title,sub:p.sectionTitle,badge:"Topic"})}),N.forEach(p=>{(p.title.toLowerCase().includes(o)||p.description.toLowerCase().includes(o))&&a.push({type:"section",id:p.id,title:p.title,sub:p.description,badge:"Section"})}),(e.knowledgeGaps||[]).forEach(p=>{if(p.title.toLowerCase().includes(o)){const k=p.topicId?M.get(p.topicId):null;a.push({type:"gap",id:p.topicId||null,title:p.title,sub:k?`Gap on ${k.title}`:"Unassigned Gap",badge:"Knowledge Gap"})}}),a.slice(0,15)}function g(){const r=i.querySelector("#search-results");if(r){if(d.length===0){r.innerHTML=`
        <div style="padding: 2rem; text-align: center; color: var(--color-text-subtle); font-size: 0.88rem;">
          No matching topics or knowledge gaps found.
        </div>
      `;return}r.innerHTML=d.map((o,a)=>`
      <div class="search-result-item ${a===n?"selected":""}" data-idx="${a}">
        <div>
          <div class="search-result-title">${o.title}</div>
          <div class="search-result-section">${o.sub}</div>
        </div>
        <span class="nav-badge" style="font-size: 0.68rem;">${o.badge}</span>
      </div>
    `).join(""),r.querySelectorAll(".search-result-item").forEach(o=>{o.addEventListener("click",()=>{const a=parseInt(o.getAttribute("data-idx"),10);b(d[a])})})}}function b(r){r&&(s(),r.type==="topic"||r.type==="gap"&&r.id?t(r.id):r.type==="section"&&c(r.id))}i.innerHTML=`
    <div class="modal-backdrop active" id="search-modal-backdrop">
      <div class="modal-dialog search-modal" id="search-modal-box">
        <div class="search-input-wrapper">
          ${f("search",20,"text-muted")}
          <input 
            type="text" 
            class="search-input" 
            id="global-search-input" 
            placeholder="Type a topic, section, or algorithm (e.g. gradient, logistic, pca)..." 
            autocomplete="off"
          />
          <button class="btn-icon" id="close-search-btn">${f("x",18)}</button>
        </div>

        <div class="search-results-list" id="search-results">
          <div style="padding: 1.5rem; text-align: center; color: var(--color-text-subtle); font-size: 0.88rem;">
            Type at least 1 character to search all 15 sections and 150+ topics.
          </div>
        </div>
      </div>
    </div>
  `;const v=i.querySelector("#global-search-input");setTimeout(()=>v==null?void 0:v.focus(),50),v==null||v.addEventListener("input",r=>{d=m(r.target.value),n=0,g()}),v==null||v.addEventListener("keydown",r=>{r.key==="ArrowDown"?(r.preventDefault(),d.length>0&&(n=(n+1)%d.length,g())):r.key==="ArrowUp"?(r.preventDefault(),d.length>0&&(n=(n-1+d.length)%d.length,g())):r.key==="Enter"?(r.preventDefault(),d[n]&&b(d[n])):r.key==="Escape"&&s()}),(l=i.querySelector("#close-search-btn"))==null||l.addEventListener("click",s),(u=i.querySelector("#search-modal-backdrop"))==null||u.addEventListener("click",r=>{r.target.id==="search-modal-backdrop"&&s()})}function ne(i){const e={version:i.version||1,exportedAt:new Date().toISOString(),userTopics:i.userTopics||{},currentFocus:i.currentFocus||null,knowledgeGaps:i.knowledgeGaps||[],theme:i.theme||"dark"},s=JSON.stringify(e,null,2),t=new Blob([s],{type:"application/json"}),c=URL.createObjectURL(t),n=new Date,m=`ml_dl_roadmap_backup_${`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}-${String(n.getDate()).padStart(2,"0")}`}.json`,g=document.createElement("a");g.href=c,g.download=m,document.body.appendChild(g),g.click(),document.body.removeChild(g),URL.revokeObjectURL(c)}function ce(i){let e;try{e=JSON.parse(i)}catch{throw new Error("Invalid JSON format. Please ensure the file contains valid JSON.")}if(typeof e!="object"||e===null)throw new Error("Import data must be a JSON object.");if(!e.userTopics&&!e.knowledgeGaps)throw new Error("Import file does not appear to be a valid ML/DL Roadmap backup.");return{version:e.version||1,userTopics:e.userTopics||{},currentFocus:e.currentFocus||null,knowledgeGaps:Array.isArray(e.knowledgeGaps)?e.knowledgeGaps:[],theme:e.theme==="light"?"light":"dark"}}function le(i,{state:e,lastSavedAt:s,onClose:t,onResetProgress:c,onImportState:n}){var b,v,l,u,r,o;const d=Object.keys(e.userTopics||{}).length,m=(e.knowledgeGaps||[]).length,g=s?new Date(s).toLocaleTimeString():e.updatedAt?new Date(e.updatedAt).toLocaleTimeString():"Not modified yet";i.innerHTML=`
    <div class="modal-backdrop active" id="data-modal-backdrop">
      <div class="modal-dialog" style="max-width: 540px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${f("database",20,"text-brand")}
            <h2 class="modal-title">Data Storage & File Management</h2>
          </div>
          <button class="btn-icon" id="close-data-modal-btn">${f("x",18)}</button>
        </div>

        <div class="modal-body">
          <!-- 1. Local File Storage in Repo -->
          <div class="drawer-card">
            <div class="drawer-card-title">
              <span>Repository File Storage</span>
              <span class="nav-badge">data/progress.json</span>
            </div>
            <p style="font-size: 0.84rem; color: var(--color-text-muted); margin-bottom: 0.85rem; line-height: 1.45;">
              All your topic statuses, checklists, notes, and knowledge gaps are automatically saved to:
              <br/>
              <code style="color: var(--color-brand-300); font-weight: 600;">data/progress.json</code> in this repository.
            </p>
            <div style="font-size: 0.78rem; color: var(--color-text-subtle); display: flex; flex-direction: column; gap: 0.25rem;">
              <div>• Last disk write: <strong>${g}</strong></div>
              <div>• Active topic records: <strong>${d}</strong></div>
              <div>• Knowledge gaps: <strong>${m}</strong></div>
              <div style="margin-top: 0.4rem; color: var(--color-status-solid);">
                ✓ You can commit <code>data/progress.json</code> to Git anytime to version-control your learning journey.
              </div>
            </div>
          </div>

          <!-- 2. Manual JSON Backup & Restore -->
          <div class="drawer-card">
            <div class="drawer-card-title">
              <span>Standalone Backup / Restore</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 1rem;">
              Download a standalone timestamped JSON snapshot or restore from a previous file.
            </p>

            <div style="display: flex; gap: 0.75rem;">
              <button class="btn btn-secondary btn-sm" id="export-json-btn">
                <span>Export Snapshot JSON</span>
              </button>
              
              <label class="btn btn-secondary btn-sm" style="cursor: pointer;">
                <span>Import JSON</span>
                <input type="file" id="import-json-file" accept=".json" style="display: none;" />
              </label>
            </div>
          </div>

          <!-- 3. Safe Reset -->
          <div class="drawer-card" style="border-color: rgba(244, 63, 94, 0.3);">
            <div class="drawer-card-title" style="color: var(--color-priority-high);">
              <span>Reset All Progress</span>
            </div>
            <p style="font-size: 0.82rem; color: var(--color-text-muted); margin-bottom: 0.85rem;">
              Clears all topic statuses, milestones, notes, and gaps back to clean slate.
            </p>
            <button class="btn btn-danger btn-sm" id="reset-all-btn">
              <span>Reset All Progress</span>
            </button>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-primary" id="save-data-settings-btn">Done</button>
        </div>
      </div>
    </div>
  `,(b=i.querySelector("#close-data-modal-btn"))==null||b.addEventListener("click",t),(v=i.querySelector("#save-data-settings-btn"))==null||v.addEventListener("click",t),(l=i.querySelector("#data-modal-backdrop"))==null||l.addEventListener("click",a=>{a.target.id==="data-modal-backdrop"&&t()}),(u=i.querySelector("#export-json-btn"))==null||u.addEventListener("click",()=>{ne(e)}),(r=i.querySelector("#import-json-file"))==null||r.addEventListener("change",a=>{var w;const p=(w=a.target.files)==null?void 0:w[0];if(!p)return;const k=new FileReader;k.onload=L=>{try{const S=ce(L.target.result);confirm("Importing this file will replace your current progress. Continue?")&&(n(S),alert("Progress imported successfully!"),t())}catch(S){alert(`Failed to import: ${S.message}`)}},k.readAsText(p)}),(o=i.querySelector("#reset-all-btn"))==null||o.addEventListener("click",()=>{prompt(`This will reset all your topic statuses, checklists, notes, and knowledge gaps back to zero.

Type RESET to confirm:`)==="RESET"&&(c(),alert("All progress has been reset to clean slate."),t())})}class de{constructor(){this.store=H,this.currentRoute="dashboard",this.targetSectionId=null,this.activeDrawerTopicId=null,this.isSearchOpen=!1,this.isDataModalOpen=!1,this.fileSyncStatus="synced",this.roadmapFilters={status:"ALL",review:"ALL",practical:"ALL",query:""},this.headerEl=document.getElementById("app-header"),this.sidebarEl=document.getElementById("app-sidebar"),this.mainEl=document.getElementById("main-content"),this.drawerEl=document.getElementById("topic-drawer-container"),this.modalEl=document.getElementById("modal-container"),this.searchModalEl=document.getElementById("search-modal-container"),this.init()}init(){const e=this.store.getState();document.documentElement.setAttribute("data-theme",e.theme||"dark"),this.store.subscribe((s,t)=>{s==="file_sync_status"?(this.fileSyncStatus=t.status,this.renderHeaderOnly()):this.render()}),window.addEventListener("keydown",s=>{(s.metaKey||s.ctrlKey)&&s.key.toLowerCase()==="k"?(s.preventDefault(),this.openSearch()):s.key==="Escape"&&(this.isSearchOpen?this.closeSearch():this.isDataModalOpen?this.closeDataModal():this.activeDrawerTopicId&&this.closeDrawer())}),this.render()}navigate(e,s=null){this.currentRoute=e,this.targetSectionId=s,window.scrollTo({top:0,behavior:"smooth"}),this.render()}openTopicDrawer(e){this.activeDrawerTopicId=e,this.renderDrawer()}closeDrawer(){this.activeDrawerTopicId=null,this.renderDrawer()}openSearch(){this.isSearchOpen=!0,this.renderSearch()}closeSearch(){this.isSearchOpen=!1,this.renderSearch()}openDataModal(){this.isDataModalOpen=!0,this.renderModals()}closeDataModal(){this.isDataModalOpen=!1,this.renderModals()}toggleTheme(){const s=this.store.getState().theme==="dark"?"light":"dark";this.store.setTheme(s)}renderHeaderOnly(){const e=this.store.getState();Z(this.headerEl,{currentTheme:e.theme,fileSyncStatus:this.fileSyncStatus,onOpenSearch:()=>this.openSearch(),onOpenData:()=>this.openDataModal(),onToggleTheme:()=>this.toggleTheme()})}render(){const e=this.store.getState(),s=Q(e);this.renderHeaderOnly(),X(this.sidebarEl,{currentRoute:this.currentRoute,metrics:s,currentTheme:e.theme,onNavigate:t=>this.navigate(t),onOpenData:()=>this.openDataModal(),onToggleTheme:()=>this.toggleTheme()}),this.renderView(e,s),this.renderDrawer(),this.renderModals(),this.renderSearch()}renderView(e,s){switch(this.currentRoute){case"dashboard":ee(this.mainEl,{state:e,metrics:s,onOpenTopic:t=>this.openTopicDrawer(t),onNavigateSection:t=>this.navigate("roadmap",t)});break;case"roadmap":te(this.mainEl,{state:e,metrics:s,filters:this.roadmapFilters,targetSectionId:this.targetSectionId,onSetFilters:t=>{this.roadmapFilters=t,this.render()},onOpenTopic:t=>this.openTopicDrawer(t),onCycleStatus:t=>this.store.cycleTopicStatus(t)});break;case"implementations":se(this.mainEl,{state:e,onToggleMilestone:(t,c)=>this.store.toggleChecklist(t,c),onOpenTopic:t=>this.openTopicDrawer(t)});break;case"gaps":ie(this.mainEl,{state:e,onOpenTopic:t=>this.openTopicDrawer(t),onAddGap:(t,c,n)=>this.store.addKnowledgeGap(t,c,n),onToggleResolved:t=>this.store.toggleGapResolved(t),onDeleteGap:t=>this.store.deleteKnowledgeGap(t)});break;case"review":ae(this.mainEl,{state:e,onOpenTopic:t=>this.openTopicDrawer(t),onToggleReview:t=>this.store.toggleNeedsReview(t),onCycleStatus:t=>this.store.cycleTopicStatus(t)});break;default:this.currentRoute="dashboard",this.render()}}renderDrawer(){const e=this.store.getState();re(this.drawerEl,{topicId:this.activeDrawerTopicId,state:e,onClose:()=>this.closeDrawer(),onSetStatus:(s,t)=>this.store.setTopicStatus(s,t),onCycleStatus:s=>this.store.cycleTopicStatus(s),onToggleChecklist:(s,t)=>this.store.toggleChecklist(s,t),onUpdateNotes:(s,t)=>this.store.setTopicNotes(s,t),onToggleFocus:s=>this.store.setCurrentFocus(s),onToggleReview:s=>this.store.toggleNeedsReview(s),onAddResource:(s,t)=>this.store.addTopicResource(s,t),onDeleteResource:(s,t)=>this.store.deleteTopicResource(s,t),onAddGapForTopic:(s,t)=>{this.store.addKnowledgeGap(s,t,"Medium"),this.renderDrawer()}})}renderSearch(){if(!this.isSearchOpen){this.searchModalEl.innerHTML="";return}const e=this.store.getState();oe(this.searchModalEl,{state:e,onClose:()=>this.closeSearch(),onSelectTopic:s=>this.openTopicDrawer(s),onSelectSection:s=>this.navigate("roadmap",s)})}renderModals(){if(!this.isDataModalOpen){this.modalEl.innerHTML="";return}const e=this.store.getState();le(this.modalEl,{state:e,lastSavedAt:this.store.lastSavedAt,onClose:()=>this.closeDataModal(),onResetProgress:()=>this.store.resetState(),onImportState:s=>this.store.importFullState(s)})}}document.addEventListener("DOMContentLoaded",()=>{window.app=new de});
