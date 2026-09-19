/**
 * Knowledge Gaps View Component
 * Tracker for questions and conceptual doubts identified during learning.
 */

import { TOPIC_MAP, ROADMAP_SECTIONS } from '../data/roadmap.js';
import { getIcon } from '../utils/icons.js';

export function renderKnowledgeGapsView(container, {
  state,
  onOpenTopic,
  onAddGap,
  onToggleResolved,
  onDeleteGap
}) {
  const gaps = state.knowledgeGaps || [];
  let filterTab = 'OPEN'; // 'ALL' | 'OPEN' | 'RESOLVED'

  function renderList() {
    const listContainer = container.querySelector('#gaps-list-container');
    if (!listContainer) return;

    let filtered = gaps;
    if (filterTab === 'OPEN') {
      filtered = gaps.filter(g => !g.resolved);
    } else if (filterTab === 'RESOLVED') {
      filtered = gaps.filter(g => g.resolved);
    }

    if (filtered.length === 0) {
      if (gaps.length === 0) {
        listContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${getIcon('gaps', 36)}</div>
            <div class="empty-state-title">You haven't recorded any knowledge gaps yet.</div>
            <div class="empty-state-desc">Whenever you encounter a concept or mathematical detail you don't fully understand while studying, record it here.</div>
            <button class="btn btn-primary btn-sm" id="empty-add-gap-btn" style="margin-top: 1.25rem;">
              ${getIcon('plus', 15)}
              <span>Add First Knowledge Gap</span>
            </button>
          </div>
        `;
        listContainer.querySelector('#empty-add-gap-btn')?.addEventListener('click', showAddModal);
      } else {
        listContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${getIcon('check', 36)}</div>
            <div class="empty-state-title">No knowledge gaps in this view</div>
            <div class="empty-state-desc">${filterTab === 'OPEN' ? 'All recorded knowledge gaps have been resolved. Great work!' : 'No resolved knowledge gaps yet.'}</div>
          </div>
        `;
      }
      return;
    }

    listContainer.innerHTML = `
      <div class="gaps-list">
        ${filtered.map(gap => {
          const topic = gap.topicId ? TOPIC_MAP.get(gap.topicId) : null;
          return `
            <div class="gap-card ${gap.resolved ? 'resolved' : ''}" data-gap-id="${gap.id}">
              <div class="gap-card-left">
                <input 
                  type="checkbox" 
                  class="gap-resolve-check" 
                  data-gap-id="${gap.id}" 
                  ${gap.resolved ? 'checked' : ''} 
                  title="Mark as resolved"
                />
                <div>
                  <div class="gap-title">${gap.title}</div>
                  <div class="gap-meta-row">
                    <span class="priority-badge ${gap.priority.toLowerCase()}">
                      ${gap.priority === 'High' ? '🔴 High' : gap.priority === 'Medium' ? '🟡 Medium' : '🟢 Low'}
                    </span>
                    ${topic ? `
                      <span class="gap-topic-tag" data-topic-id="${topic.id}">
                        ${topic.title}
                      </span>
                    ` : ''}
                  </div>
                </div>
              </div>

              <div>
                <button class="btn-icon" data-delete-gap="${gap.id}" title="Delete knowledge gap">
                  ${getIcon('trash', 16)}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Toggle resolved
    listContainer.querySelectorAll('.gap-resolve-check').forEach(box => {
      box.addEventListener('change', () => {
        const id = box.getAttribute('data-gap-id');
        if (id) onToggleResolved(id);
      });
    });

    // Topic tag click -> Open drawer
    listContainer.querySelectorAll('.gap-topic-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const topicId = tag.getAttribute('data-topic-id');
        if (topicId) onOpenTopic(topicId);
      });
    });

    // Delete button
    listContainer.querySelectorAll('[data-delete-gap]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-gap');
        if (id && confirm('Delete this knowledge gap?')) {
          onDeleteGap(id);
        }
      });
    });
  }

  function showAddModal() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    modalContainer.innerHTML = `
      <div class="modal-backdrop active" id="add-gap-backdrop">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title">Record Knowledge Gap</h2>
            <button class="btn-icon" id="close-add-gap-modal">${getIcon('x', 18)}</button>
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
                ${ROADMAP_SECTIONS.map(sec => `
                  <optgroup label="${sec.title}">
                    ${sec.topics.map(t => `<option value="${t.id}">${t.title}</option>`).join('')}
                  </optgroup>
                `).join('')}
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
    `;

    const close = () => {
      modalContainer.innerHTML = '';
    };

    modalContainer.querySelector('#close-add-gap-modal')?.addEventListener('click', close);
    modalContainer.querySelector('#cancel-add-gap')?.addEventListener('click', close);
    modalContainer.querySelector('#add-gap-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'add-gap-backdrop') close();
    });

    modalContainer.querySelector('#save-new-gap')?.addEventListener('click', () => {
      const titleInput = modalContainer.querySelector('#new-gap-title');
      const topicSelect = modalContainer.querySelector('#new-gap-topic');
      const prioritySelect = modalContainer.querySelector('#new-gap-priority');

      const title = titleInput?.value.trim();
      if (!title) {
        titleInput?.focus();
        return;
      }

      onAddGap(title, topicSelect?.value || null, prioritySelect?.value || 'Medium');
      close();
    });
  }

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-row">
        <div>
          <h1 class="view-heading">Knowledge Gaps</h1>
          <p class="view-subheading">Track specific conceptual doubts and intuitive blockers encountered during study.</p>
        </div>
        <div>
          <button class="btn btn-primary btn-sm" id="trigger-add-gap-btn">
            ${getIcon('plus', 16)}
            <span>Add Knowledge Gap</span>
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-bar">
        <button class="filter-chip ${filterTab === 'OPEN' ? 'active' : ''}" data-tab="OPEN">Open Doubts</button>
        <button class="filter-chip ${filterTab === 'ALL' ? 'active' : ''}" data-tab="ALL">All Gaps (${gaps.length})</button>
        <button class="filter-chip ${filterTab === 'RESOLVED' ? 'active' : ''}" data-tab="RESOLVED">Resolved</button>
      </div>
    </div>

    <div class="gaps-container">
      <div id="gaps-list-container"></div>
    </div>
  `;

  container.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      filterTab = btn.getAttribute('data-tab');
      container.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('active', b === btn));
      renderList();
    });
  });

  container.querySelector('#trigger-add-gap-btn')?.addEventListener('click', showAddModal);

  renderList();
}
