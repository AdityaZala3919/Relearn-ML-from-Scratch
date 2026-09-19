/**
 * Storage & Reactive State Store
 * 
 * Manages user state in local `data/progress.json` file in the repository,
 * backed by browser localStorage for zero-latency instant updates.
 */

const STORAGE_KEY = 'ml_dl_learning_roadmap_state_v1';

export const STATUS_TYPES = {
  NOT_STARTED: 'NOT_STARTED',
  LEARNING: 'LEARNING',
  FAMILIAR: 'FAMILIAR',
  SOLID: 'SOLID'
};

const DEFAULT_STATE = {
  version: 1,
  userTopics: {},
  currentFocus: null,
  knowledgeGaps: [],
  theme: 'dark',
  updatedAt: null
};

class StateStore {
  constructor() {
    this.state = this.loadInitialState();
    this.listeners = new Set();
    this.fileSyncStatus = 'synced'; // 'synced' | 'saving' | 'error'
    this.lastSavedAt = null;

    // Try loading latest file from repo on startup if in browser
    if (typeof window !== 'undefined') {
      this.syncWithLocalFile();
    }
  }

  loadInitialState() {
    try {
      if (typeof localStorage === 'undefined') return { ...DEFAULT_STATE };
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATE,
        ...parsed
      };
    } catch (e) {
      console.error('Failed to load state from localStorage:', e);
      return { ...DEFAULT_STATE };
    }
  }

  async syncWithLocalFile() {
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const fileData = await res.json();
        if (fileData && typeof fileData === 'object' && Object.keys(fileData).length > 0) {
          // If file has user topics or newer data, update state
          if (fileData.userTopics || fileData.knowledgeGaps) {
            this.state = {
              ...this.state,
              ...fileData
            };
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            }
            this.lastSavedAt = fileData.updatedAt || new Date().toISOString();
            this.emit('state_updated', this.state);
          }
        }
      }
    } catch (err) {
      // Running statically without Vite server or offline
      console.log('Local file API not reachable, using localStorage buffer.');
    }
  }

  save(eventType = 'state_updated') {
    try {
      this.state.updatedAt = new Date().toISOString();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      }
      this.emit(eventType, this.state);
      this.scheduleFileSave();
    } catch (e) {
      console.error('Failed to save state:', e);
    }
  }

  scheduleFileSave() {
    if (typeof fetch === 'undefined') return;
    this.fileSyncStatus = 'saving';
    this.emit('file_sync_status', { status: 'saving' });

    if (this._saveTimer) clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(async () => {
      try {
        const res = await fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.state)
        });
        if (res.ok) {
          this.fileSyncStatus = 'synced';
          this.lastSavedAt = this.state.updatedAt;
          this.emit('file_sync_status', { status: 'synced', lastSavedAt: this.lastSavedAt });
        } else {
          this.fileSyncStatus = 'error';
          this.emit('file_sync_status', { status: 'error' });
        }
      } catch (err) {
        this.fileSyncStatus = 'offline';
        this.emit('file_sync_status', { status: 'offline' });
      }
    }, 400); // 400ms debounced disk write to data/progress.json
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  emit(eventType, data) {
    this.listeners.forEach(fn => {
      try {
        fn(eventType, data);
      } catch (err) {
        console.error('Error in state listener:', err);
      }
    });
  }

  getState() {
    return this.state;
  }

  getTopicData(topicId) {
    if (!this.state.userTopics[topicId]) {
      return {
        status: STATUS_TYPES.NOT_STARTED,
        needsReview: false,
        notes: '',
        checklist: {},
        resources: []
      };
    }
    return this.state.userTopics[topicId];
  }

  setTopicStatus(topicId, status) {
    if (!this.state.userTopics[topicId]) {
      this.state.userTopics[topicId] = this.getTopicData(topicId);
    }
    this.state.userTopics[topicId].status = status;
    this.save('topic_status_changed');
  }

  cycleTopicStatus(topicId) {
    const current = this.getTopicData(topicId).status;
    let next = STATUS_TYPES.NOT_STARTED;
    if (current === STATUS_TYPES.NOT_STARTED) next = STATUS_TYPES.LEARNING;
    else if (current === STATUS_TYPES.LEARNING) next = STATUS_TYPES.FAMILIAR;
    else if (current === STATUS_TYPES.FAMILIAR) next = STATUS_TYPES.SOLID;
    else next = STATUS_TYPES.NOT_STARTED;

    this.setTopicStatus(topicId, next);
    return next;
  }

  toggleChecklist(topicId, itemId) {
    if (!this.state.userTopics[topicId]) {
      this.state.userTopics[topicId] = this.getTopicData(topicId);
    }
    const current = !!this.state.userTopics[topicId].checklist[itemId];
    this.state.userTopics[topicId].checklist[itemId] = !current;
    this.save('checklist_toggled');
  }

  setTopicNotes(topicId, notes) {
    if (!this.state.userTopics[topicId]) {
      this.state.userTopics[topicId] = this.getTopicData(topicId);
    }
    this.state.userTopics[topicId].notes = notes;
    this.save('notes_updated');
  }

  toggleNeedsReview(topicId) {
    if (!this.state.userTopics[topicId]) {
      this.state.userTopics[topicId] = this.getTopicData(topicId);
    }
    this.state.userTopics[topicId].needsReview = !this.state.userTopics[topicId].needsReview;
    this.save('review_toggled');
  }

  setCurrentFocus(topicId) {
    if (this.state.currentFocus === topicId) {
      this.state.currentFocus = null;
    } else {
      this.state.currentFocus = topicId;
    }
    this.save('focus_changed');
  }

  // Knowledge Gaps API
  addKnowledgeGap(title, topicId, priority = 'Medium') {
    const newGap = {
      id: 'gap-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: title.trim(),
      topicId: topicId || null,
      priority,
      resolved: false,
      createdAt: new Date().toISOString()
    };
    this.state.knowledgeGaps.unshift(newGap);
    this.save('gap_added');
    return newGap;
  }

  updateKnowledgeGap(id, updates) {
    const idx = this.state.knowledgeGaps.findIndex(g => g.id === id);
    if (idx !== -1) {
      this.state.knowledgeGaps[idx] = {
        ...this.state.knowledgeGaps[idx],
        ...updates
      };
      this.save('gap_updated');
    }
  }

  toggleGapResolved(id) {
    const gap = this.state.knowledgeGaps.find(g => g.id === id);
    if (gap) {
      gap.resolved = !gap.resolved;
      this.save('gap_resolved_toggled');
    }
  }

  deleteKnowledgeGap(id) {
    this.state.knowledgeGaps = this.state.knowledgeGaps.filter(g => g.id !== id);
    this.save('gap_deleted');
  }

  // Resources API
  addTopicResource(topicId, resource) {
    if (!this.state.userTopics[topicId]) {
      this.state.userTopics[topicId] = this.getTopicData(topicId);
    }
    const resItem = {
      id: 'res-' + Date.now(),
      title: resource.title.trim(),
      url: resource.url.trim(),
      type: resource.type || 'Other'
    };
    this.state.userTopics[topicId].resources.push(resItem);
    this.save('resource_added');
  }

  deleteTopicResource(topicId, resourceId) {
    if (this.state.userTopics[topicId]) {
      this.state.userTopics[topicId].resources = this.state.userTopics[topicId].resources.filter(r => r.id !== resourceId);
      this.save('resource_deleted');
    }
  }

  // Theme & Settings
  setTheme(theme) {
    this.state.theme = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    this.save('theme_changed');
  }

  resetState() {
    this.state = {
      ...DEFAULT_STATE,
      theme: this.state.theme
    };
    this.save('state_reset');
  }

  importFullState(newState) {
    this.state = {
      ...DEFAULT_STATE,
      ...newState,
      theme: newState.theme || this.state.theme
    };
    this.save('state_imported');
  }
}

export const store = new StateStore();
