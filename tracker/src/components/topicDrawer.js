/**
 * Topic Detail Drawer Component
 * Slide-over deep-dive panel for topic status, checklists, notes, knowledge gaps, and resources.
 */

import { TOPIC_MAP, getDefaultChecklistForTopic } from '../data/roadmap.js';
import { getIcon } from '../utils/icons.js';
import { STATUS_TYPES } from '../utils/storage.js';

export function renderTopicDrawer(container, {
  topicId,
  state,
  onClose,
  onSetStatus,
  onCycleStatus,
  onToggleChecklist,
  onUpdateNotes,
  onToggleFocus,
  onToggleReview,
  onAddResource,
  onDeleteResource,
  onAddGapForTopic
}) {
  if (!topicId) {
    container.innerHTML = '';
    return;
  }

  const topic = TOPIC_MAP.get(topicId);
  if (!topic) return;

  const topicData = state.userTopics[topicId] || {
    status: STATUS_TYPES.NOT_STARTED,
    needsReview: false,
    notes: '',
    checklist: {},
    resources: []
  };

  const status = topicData.status || STATUS_TYPES.NOT_STARTED;
  const isFocus = state.currentFocus === topicId;
  const needsReview = !!topicData.needsReview;
  const checklists = getDefaultChecklistForTopic(topic);

  // Combine default resources + user resources
  const allResources = [
    ...(topic.resources || []),
    ...(topicData.resources || [])
  ];

  // Knowledge gaps linked to this topic
  const linkedGaps = (state.knowledgeGaps || []).filter(g => g.topicId === topicId);

  container.innerHTML = `
    <div class="drawer-backdrop active" id="drawer-backdrop"></div>
    <div class="topic-drawer active" id="topic-drawer-panel">
      <!-- Drawer Header -->
      <div class="drawer-header">
        <div class="drawer-title-row">
          <div>
            <div class="drawer-section-title">${topic.sectionTitle}</div>
            <h2 class="drawer-title">${topic.title}</h2>
          </div>
          <button class="btn-icon" id="close-drawer-btn" title="Close drawer (Esc)">
            ${getIcon('x', 20)}
          </button>
        </div>

        <div class="drawer-meta-row">
          <!-- Status Selector Dropdown -->
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <select class="form-select" id="drawer-status-select" style="padding: 0.25rem 0.6rem; font-size: 0.8rem; font-family: 'JetBrains Mono', monospace; font-weight: 700;">
              <option value="${STATUS_TYPES.NOT_STARTED}" ${status === STATUS_TYPES.NOT_STARTED ? 'selected' : ''}>NOT STARTED (0%)</option>
              <option value="${STATUS_TYPES.LEARNING}" ${status === STATUS_TYPES.LEARNING ? 'selected' : ''}>LEARNING (33%)</option>
              <option value="${STATUS_TYPES.FAMILIAR}" ${status === STATUS_TYPES.FAMILIAR ? 'selected' : ''}>FAMILIAR (66%)</option>
              <option value="${STATUS_TYPES.SOLID}" ${status === STATUS_TYPES.SOLID ? 'selected' : ''}>SOLID (100%)</option>
            </select>
          </div>

          <!-- Current Focus Toggle -->
          <button class="btn btn-sm ${isFocus ? 'btn-primary' : 'btn-secondary'}" id="drawer-focus-toggle">
            ${getIcon('target', 14)}
            <span>${isFocus ? 'Current Focus' : 'Set as Current Focus'}</span>
          </button>

          <!-- Needs Review Toggle -->
          <button class="btn btn-sm ${needsReview ? 'btn-danger' : 'btn-secondary'}" id="drawer-review-toggle">
            ${getIcon('flag', 14)}
            <span>${needsReview ? 'Flagged for Review' : 'Mark for Review'}</span>
          </button>
        </div>
      </div>

      <!-- Drawer Body Content -->
      <div class="drawer-body">
        <!-- 1. Knowledge Checklist -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Knowledge Milestones</span>
            <span class="metric-sub">${checklists.knowledge.filter(k => topicData.checklist?.[k.id]).length} / ${checklists.knowledge.length}</span>
          </div>
          <div class="checklist-group">
            ${checklists.knowledge.map(item => {
              const isChecked = !!topicData.checklist?.[item.id];
              return `
                <label class="check-item ${isChecked ? 'completed' : ''}">
                  <input type="checkbox" data-check-id="${item.id}" ${isChecked ? 'checked' : ''} />
                  <span class="check-item-label">${item.label}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 2. Practical Checklist -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Practical Implementation</span>
            <span class="metric-sub">${checklists.practical.filter(p => topicData.checklist?.[p.id]).length} / ${checklists.practical.length}</span>
          </div>
          <div class="checklist-group">
            ${checklists.practical.map(item => {
              const isChecked = !!topicData.checklist?.[item.id];
              return `
                <label class="check-item ${isChecked ? 'completed' : ''}">
                  <input type="checkbox" data-check-id="${item.id}" ${isChecked ? 'checked' : ''} />
                  <span class="check-item-label">${item.label}</span>
                </label>
              `;
            }).join('')}
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
          >${topicData.notes || ''}</textarea>
          <div class="notes-footer">
            <span>Markdown supported in thought flow</span>
          </div>
        </div>

        <!-- 4. Linked Knowledge Gaps -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Knowledge Gaps (${linkedGaps.length})</span>
            <button class="btn btn-subtle btn-sm" id="drawer-add-gap-btn">
              ${getIcon('plus', 13)}
              <span>Add Gap</span>
            </button>
          </div>

          ${linkedGaps.length === 0 ? `
            <div class="metric-sub" style="font-style: italic;">No specific knowledge gaps logged for this topic yet.</div>
          ` : `
            <div class="checklist-group">
              ${linkedGaps.map(g => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.35rem 0; border-bottom: 1px solid rgba(255,255,255,0.03);">
                  <span style="font-size: 0.88rem; ${g.resolved ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${g.title}</span>
                  <span class="priority-badge ${g.priority.toLowerCase()}">${g.priority}</span>
                </div>
              `).join('')}
            </div>
          `}
        </div>

        <!-- 5. Resources -->
        <div class="drawer-card">
          <div class="drawer-card-title">
            <span>Curated & Attached Resources</span>
          </div>

          ${allResources.length === 0 ? `
            <div class="metric-sub" style="font-style: italic; margin-bottom: 1rem;">No resources added yet.</div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
              ${allResources.map(r => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.4rem 0.6rem; background-color: var(--color-bg); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                  <div style="display: flex; align-items: center; gap: 0.5rem; min-width: 0;">
                    <span class="nav-badge" style="font-size: 0.68rem;">${r.type}</span>
                    <a href="${r.url}" target="_blank" rel="noopener noreferrer" style="font-size: 0.86rem; color: var(--color-text-main); font-weight: 500; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                      ${r.title}
                    </a>
                  </div>
                  <div style="display: flex; align-items: center; gap: 0.35rem;">
                    <a href="${r.url}" target="_blank" rel="noopener noreferrer" class="btn-icon" title="Open resource">
                      ${getIcon('external-link', 14)}
                    </a>
                    ${r.id.startsWith('res-') && !['res-1', 'res-lr-1', 'res-log-1', 'res-knn-1', 'res-nb-1', 'res-dt-1', 'res-km-1', 'res-pca-1', 'res-att-paper'].includes(r.id) ? `
                      <button class="btn-icon" data-delete-resource="${r.id}" title="Remove resource">
                        ${getIcon('trash', 14)}
                      </button>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
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
  `;

  // Close handlers
  container.querySelector('#close-drawer-btn')?.addEventListener('click', onClose);
  container.querySelector('#drawer-backdrop')?.addEventListener('click', onClose);

  // Status Selector
  container.querySelector('#drawer-status-select')?.addEventListener('change', (e) => {
    onSetStatus(topicId, e.target.value);
  });

  // Current Focus toggle
  container.querySelector('#drawer-focus-toggle')?.addEventListener('click', () => {
    onToggleFocus(topicId);
  });

  // Review toggle
  container.querySelector('#drawer-review-toggle')?.addEventListener('click', () => {
    onToggleReview(topicId);
  });

  // Checklist item toggles
  container.querySelectorAll('[data-check-id]').forEach(box => {
    box.addEventListener('change', () => {
      const itemId = box.getAttribute('data-check-id');
      if (itemId) onToggleChecklist(topicId, itemId);
    });
  });

  // Notes debounced auto-save
  const notesArea = container.querySelector('#drawer-notes-input');
  const saveStatus = container.querySelector('#notes-save-status');
  let saveTimer = null;

  notesArea?.addEventListener('input', () => {
    if (saveStatus) saveStatus.textContent = 'Saving...';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      onUpdateNotes(topicId, notesArea.value);
      if (saveStatus) saveStatus.textContent = 'Saved';
    }, 500);
  });

  // Add Gap for this topic
  container.querySelector('#drawer-add-gap-btn')?.addEventListener('click', () => {
    const q = prompt(`What question or doubt do you have about ${topic.title}?`);
    if (q && q.trim()) {
      onAddGapForTopic(q.trim(), topicId);
    }
  });

  // Add Resource
  container.querySelector('#save-res-btn')?.addEventListener('click', () => {
    const title = container.querySelector('#new-res-title')?.value.trim();
    const url = container.querySelector('#new-res-url')?.value.trim();
    const type = container.querySelector('#new-res-type')?.value;

    if (!title || !url) {
      alert('Please enter both title and URL.');
      return;
    }

    onAddResource(topicId, { title, url, type });
  });

  // Delete Resource
  container.querySelectorAll('[data-delete-resource]').forEach(btn => {
    btn.addEventListener('click', () => {
      const resId = btn.getAttribute('data-delete-resource');
      if (resId) onDeleteResource(topicId, resId);
    });
  });
}
