/**
 * Review Queue View Component
 * Spaced repetition and revisit queue for topics flagged with "Needs Review".
 */

import { ROADMAP_SECTIONS, TOPIC_MAP } from '../data/roadmap.js';
import { getIcon } from '../utils/icons.js';
import { STATUS_TYPES } from '../utils/storage.js';

export function renderReviewQueueView(container, {
  state,
  onOpenTopic,
  onToggleReview,
  onCycleStatus
}) {
  const userTopics = state.userTopics || {};
  let selectedSectionFilter = 'ALL';

  // Find all topics with needsReview === true
  const reviewTopicIds = Object.keys(userTopics).filter(id => userTopics[id]?.needsReview);
  const reviewTopics = reviewTopicIds.map(id => {
    const topic = TOPIC_MAP.get(id);
    return topic ? { ...topic, ...userTopics[id] } : null;
  }).filter(Boolean);

  function renderQueue() {
    const queueContainer = container.querySelector('#review-queue-list');
    if (!queueContainer) return;

    let filtered = reviewTopics;
    if (selectedSectionFilter !== 'ALL') {
      filtered = reviewTopics.filter(t => t.sectionId === selectedSectionFilter);
    }

    if (filtered.length === 0) {
      if (reviewTopics.length === 0) {
        queueContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${getIcon('check', 40)}</div>
            <div class="empty-state-title">Your review queue is empty. Nice work.</div>
            <div class="empty-state-desc">As you study topics in the roadmap, flag any topic with "Needs Review" whenever you want to revisit it later for spaced repetition.</div>
          </div>
        `;
      } else {
        queueContainer.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">${getIcon('search', 36)}</div>
            <div class="empty-state-title">No review items in this section</div>
            <div class="empty-state-desc">Try selecting another section or "All Sections".</div>
          </div>
        `;
      }
      return;
    }

    queueContainer.innerHTML = `
      <div class="roadmap-sections-tree">
        ${filtered.map(topic => {
          const status = topic.status || STATUS_TYPES.NOT_STARTED;
          return `
            <div class="gap-card" data-topic-id="${topic.id}">
              <div class="gap-card-left" style="align-items: center;">
                <button class="status-badge ${status.toLowerCase().replace('_', '-')}" data-cycle-status="${topic.id}" title="Click to cycle status">
                  <span class="status-dot"></span>
                  <span>${status.replace('_', ' ')}</span>
                </button>

                <div style="cursor: pointer;" data-open-topic="${topic.id}">
                  <div class="gap-title" style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${topic.title}</span>
                    ${getIcon('external-link', 14, 'text-subtle')}
                  </div>
                  <div class="metric-sub" style="margin-top: 0.15rem;">
                    ${topic.sectionTitle}
                  </div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="btn btn-secondary btn-sm" data-remove-review="${topic.id}">
                  ${getIcon('check', 14)}
                  <span>Done Reviewing</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Remove from review
    queueContainer.querySelectorAll('[data-remove-review]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove-review');
        if (id) onToggleReview(id);
      });
    });

    // Cycle status
    queueContainer.querySelectorAll('[data-cycle-status]').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = badge.getAttribute('data-cycle-status');
        if (id) onCycleStatus(id);
      });
    });

    // Open topic drawer
    queueContainer.querySelectorAll('[data-open-topic]').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-open-topic');
        if (id) onOpenTopic(id);
      });
    });
  }

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-row">
        <div>
          <h1 class="view-heading">Review Queue</h1>
          <p class="view-subheading">Spaced repetition queue for topics you flagged to reinforce.</p>
        </div>
        <div>
          <span class="brand-badge" style="font-size: 0.82rem; padding: 0.35rem 0.75rem;">
            Needs Review: ${reviewTopics.length}
          </span>
        </div>
      </div>

      <!-- Section Filter Dropdown -->
      <div class="filter-bar">
        <span class="filter-label">Filter Section:</span>
        <select class="form-select" id="review-section-filter" style="padding: 0.3rem 0.7rem; font-size: 0.82rem; max-width: 320px;">
          <option value="ALL">All Sections (${reviewTopics.length})</option>
          ${ROADMAP_SECTIONS.map(sec => {
            const count = reviewTopics.filter(t => t.sectionId === sec.id).length;
            if (count === 0) return '';
            return `<option value="${sec.id}">${sec.title} (${count})</option>`;
          }).join('')}
        </select>
      </div>
    </div>

    <div id="review-queue-list"></div>
  `;

  container.querySelector('#review-section-filter')?.addEventListener('change', (e) => {
    selectedSectionFilter = e.target.value;
    renderQueue();
  });

  renderQueue();
}
