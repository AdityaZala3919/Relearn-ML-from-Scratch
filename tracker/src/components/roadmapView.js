/**
 * Roadmap View Component
 * Hierarchical accordion of all 15 sections with filters, search, and topic status management.
 */

import { ROADMAP_SECTIONS, getDefaultChecklistForTopic } from '../data/roadmap.js';
import { getIcon } from '../utils/icons.js';
import { STATUS_TYPES } from '../utils/storage.js';

export function renderRoadmapView(container, {
  state,
  metrics,
  filters,
  onSetFilters,
  onOpenTopic,
  onCycleStatus,
  targetSectionId = null
}) {
  const userTopics = state.userTopics || {};
  let allExpanded = false;

  function matchesFilter(topic, topicData) {
    const status = topicData.status || STATUS_TYPES.NOT_STARTED;

    // Status filter
    if (filters.status && filters.status !== 'ALL') {
      if (status !== filters.status) return false;
    }

    // Review filter
    if (filters.review && filters.review === 'REVIEW_ONLY') {
      if (!topicData.needsReview) return false;
    }

    // Practical filter
    if (filters.practical && filters.practical !== 'ALL') {
      const defaultChecklist = getDefaultChecklistForTopic(topic);
      const practicalItems = defaultChecklist.practical;
      const doneCount = practicalItems.filter(p => topicData.checklist && topicData.checklist[p.id]).length;
      const totalCount = practicalItems.length;

      if (filters.practical === 'NOT_STARTED' && doneCount !== 0) return false;
      if (filters.practical === 'IN_PROGRESS' && (doneCount === 0 || doneCount === totalCount)) return false;
      if (filters.practical === 'COMPLETE' && doneCount !== totalCount) return false;
    }

    // Text query filter
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      if (!topic.title.toLowerCase().includes(q)) return false;
    }

    return true;
  }

  // Calculate filtered sections and topics
  const filteredSections = ROADMAP_SECTIONS.map(sec => {
    const filteredTopics = sec.topics.filter(t => matchesFilter(t, userTopics[t.id] || {}));
    const secMetric = metrics.sections.find(s => s.id === sec.id);
    return {
      ...sec,
      topics: filteredTopics,
      totalCount: sec.topics.length,
      knowledgePct: secMetric ? secMetric.knowledgePct : 0
    };
  }).filter(sec => sec.topics.length > 0 || !filters.query);

  container.innerHTML = `
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
          <button class="filter-chip ${filters.status === 'ALL' ? 'active' : ''}" data-filter-status="ALL">All</button>
          <button class="filter-chip ${filters.status === STATUS_TYPES.NOT_STARTED ? 'active' : ''}" data-filter-status="${STATUS_TYPES.NOT_STARTED}">Not Started</button>
          <button class="filter-chip ${filters.status === STATUS_TYPES.LEARNING ? 'active' : ''}" data-filter-status="${STATUS_TYPES.LEARNING}">Learning</button>
          <button class="filter-chip ${filters.status === STATUS_TYPES.FAMILIAR ? 'active' : ''}" data-filter-status="${STATUS_TYPES.FAMILIAR}">Familiar</button>
          <button class="filter-chip ${filters.status === STATUS_TYPES.SOLID ? 'active' : ''}" data-filter-status="${STATUS_TYPES.SOLID}">Solid</button>
        </div>

        <div style="height: 18px; width: 1px; background: var(--color-border); margin: 0 0.25rem;"></div>

        <!-- Review Filter -->
        <div class="filter-group">
          <button class="filter-chip review ${filters.review === 'REVIEW_ONLY' ? 'active' : ''}" id="filter-review-toggle">
            ${getIcon('flag', 13)}
            <span>Needs Review</span>
          </button>
        </div>

        <div style="height: 18px; width: 1px; background: var(--color-border); margin: 0 0.25rem;"></div>

        <!-- Practical Filter -->
        <div class="filter-group">
          <span class="filter-label">Practical:</span>
          <button class="filter-chip ${filters.practical === 'ALL' ? 'active' : ''}" data-filter-practical="ALL">All</button>
          <button class="filter-chip ${filters.practical === 'IN_PROGRESS' ? 'active' : ''}" data-filter-practical="IN_PROGRESS">In Progress</button>
          <button class="filter-chip ${filters.practical === 'COMPLETE' ? 'active' : ''}" data-filter-practical="COMPLETE">Complete</button>
        </div>
      </div>
    </div>

    <!-- Sections Accordion Tree -->
    <div class="roadmap-sections-tree">
      ${filteredSections.length === 0 ? `
        <div class="empty-state">
          <div class="empty-state-icon">${getIcon('search', 32)}</div>
          <div class="empty-state-title">No topics match your filters</div>
          <div class="empty-state-desc">Try clearing your filters or search term to see roadmap topics.</div>
          <button class="btn btn-secondary btn-sm" id="reset-filters-btn" style="margin-top: 1rem;">Reset Filters</button>
        </div>
      ` : filteredSections.map((sec, idx) => {
        const isExpanded = targetSectionId ? (sec.id === targetSectionId) : (idx === 0 || sec.topics.some(t => t.id === state.currentFocus));
        return `
          <div class="roadmap-section-card ${isExpanded ? 'expanded' : ''}" id="section-card-${sec.id}" data-section-id="${sec.id}">
            <div class="section-accordion-header">
              <div class="section-header-left">
                <span class="section-chevron">${getIcon('chevron-right', 18)}</span>
                <span class="section-title">${sec.title}</span>
                <span class="section-topic-count">${sec.topics.length} topics</span>
              </div>
              <div class="section-header-right">
                <div class="progress-bar-track" style="width: 100px;">
                  <div class="progress-bar-fill brand" style="width: ${sec.knowledgePct}%"></div>
                </div>
                <span class="section-pct-pill">${sec.knowledgePct}%</span>
              </div>
            </div>

            <div class="section-topics-list">
              ${sec.topics.map(topic => {
                const topicData = userTopics[topic.id] || {};
                const status = topicData.status || STATUS_TYPES.NOT_STARTED;
                const isFocus = state.currentFocus === topic.id;
                
                // Practical count
                const defaultChecklist = getDefaultChecklistForTopic(topic);
                const practicalItems = defaultChecklist.practical;
                const donePractical = practicalItems.filter(p => topicData.checklist && topicData.checklist[p.id]).length;

                return `
                  <div class="topic-row ${isFocus ? 'current-focus' : ''}" data-topic-id="${topic.id}">
                    <div class="topic-row-left">
                      <span class="topic-bullet"></span>
                      <span class="topic-name">${topic.title}</span>
                    </div>

                    <div class="topic-row-badges">
                      ${topicData.needsReview ? `
                        <span class="review-flag-indicator" title="Marked for review">
                          ${getIcon('flag', 11)}
                          <span>Review</span>
                        </span>
                      ` : ''}

                      ${practicalItems.length > 0 ? `
                        <span class="practical-mini-indicator" title="Practical tasks completed">
                          ${donePractical}/${practicalItems.length} code
                        </span>
                      ` : ''}

                      <button class="status-badge ${status.toLowerCase().replace('_', '-')} clickable" data-cycle-id="${topic.id}" title="Click to cycle status">
                        <span class="status-dot"></span>
                        <span>${status.replace('_', ' ')}</span>
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach event handlers
  container.querySelectorAll('.section-accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const card = header.closest('.roadmap-section-card');
      if (card) card.classList.toggle('expanded');
    });
  });

  // Expand / Collapse all toggle
  container.querySelector('#toggle-expand-all-btn')?.addEventListener('click', () => {
    const cards = container.querySelectorAll('.roadmap-section-card');
    allExpanded = !allExpanded;
    cards.forEach(c => {
      if (allExpanded) c.classList.add('expanded');
      else c.classList.remove('expanded');
    });
  });

  // Filter chips: Status
  container.querySelectorAll('[data-filter-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      const st = btn.getAttribute('data-filter-status');
      onSetFilters({ ...filters, status: st });
    });
  });

  // Filter chip: Review
  container.querySelector('#filter-review-toggle')?.addEventListener('click', () => {
    const nextReview = filters.review === 'REVIEW_ONLY' ? 'ALL' : 'REVIEW_ONLY';
    onSetFilters({ ...filters, review: nextReview });
  });

  // Filter chips: Practical
  container.querySelectorAll('[data-filter-practical]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pr = btn.getAttribute('data-filter-practical');
      onSetFilters({ ...filters, practical: pr });
    });
  });

  container.querySelector('#reset-filters-btn')?.addEventListener('click', () => {
    onSetFilters({ status: 'ALL', review: 'ALL', practical: 'ALL', query: '' });
  });

  // Topic Row click -> Open Drawer
  container.querySelectorAll('.topic-row').forEach(row => {
    row.addEventListener('click', (e) => {
      // If user clicked the status cycle badge directly, do not open drawer
      if (e.target.closest('[data-cycle-id]')) return;
      const topicId = row.getAttribute('data-topic-id');
      if (topicId) onOpenTopic(topicId);
    });
  });

  // Cycle status directly from badge
  container.querySelectorAll('[data-cycle-id]').forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      const topicId = badge.getAttribute('data-cycle-id');
      if (topicId) onCycleStatus(topicId);
    });
  });

  // Scroll to targetSectionId if requested
  if (targetSectionId) {
    const targetEl = container.querySelector(`#section-card-${targetSectionId}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
