/**
 * Dashboard View Component
 * Executive overview of learning progress, active focus, status breakdown, and section metrics.
 */

import { TOPIC_MAP } from '../data/roadmap.js';
import { getIcon } from '../utils/icons.js';
import { STATUS_TYPES } from '../utils/storage.js';

export function renderDashboardView(container, { state, metrics, onOpenTopic, onNavigateSection }) {
  const currentFocusTopic = state.currentFocus ? TOPIC_MAP.get(state.currentFocus) : null;
  const currentFocusData = state.currentFocus ? (state.userTopics[state.currentFocus] || {}) : null;

  container.innerHTML = `
    <div class="dashboard-grid">
      <!-- 1. Current Focus Hero Card -->
      <div class="focus-hero-card ${currentFocusTopic ? 'active-focus' : ''}">
        <div>
          <div class="focus-badge-tag">
            ${getIcon('target', 14)}
            <span>${currentFocusTopic ? 'Currently Learning' : 'Current Focus'}</span>
          </div>
          <div class="focus-topic-name">
            ${currentFocusTopic ? currentFocusTopic.title : 'No topic actively set as current focus'}
          </div>
          <div class="focus-topic-sub">
            ${currentFocusTopic 
              ? `${currentFocusTopic.sectionTitle} • Status: <strong>${(currentFocusData?.status || STATUS_TYPES.NOT_STARTED).replace('_', ' ')}</strong>` 
              : 'Pick any topic in the roadmap and click "Set as Current Focus" to anchor your study session.'}
          </div>
        </div>
        <div>
          ${currentFocusTopic ? `
            <button class="btn btn-primary" id="dashboard-open-focus-btn">
              <span>Open Topic</span>
              ${getIcon('chevron-right', 15)}
            </button>
          ` : `
            <button class="btn btn-secondary" id="dashboard-browse-roadmap-btn">
              <span>Browse Roadmap</span>
              ${getIcon('chevron-right', 15)}
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
            <span class="metric-num brand">${metrics.overallKnowledgePct}%</span>
            <span class="metric-sub">across ${metrics.totalTopics} topics</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill brand" style="width: ${metrics.overallKnowledgePct}%"></div>
          </div>
        </div>

        <!-- Practical Implementation Progress -->
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Practical Implementation</span>
            <span class="metric-sub">Hands-on Code</span>
          </div>
          <div class="metric-value-row">
            <span class="metric-num emerald">${metrics.overallPracticalPct}%</span>
            <span class="metric-sub">${metrics.completedPracticalMilestones} / ${metrics.totalPracticalMilestones} milestones</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill emerald" style="width: ${metrics.overallPracticalPct}%"></div>
          </div>
        </div>

        <!-- Open Knowledge Gaps -->
        <div class="metric-card">
          <div class="metric-header">
            <span class="metric-title">Knowledge Gaps</span>
            ${getIcon('gaps', 16, 'text-muted')}
          </div>
          <div class="metric-value-row">
            <span class="metric-num ${metrics.openGapsCount > 0 ? 'priority-high' : ''}">${metrics.openGapsCount}</span>
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
            ${getIcon('review', 16, 'text-muted')}
          </div>
          <div class="metric-value-row">
            <span class="metric-num ${metrics.reviewCount > 0 ? 'priority-medium' : ''}">${metrics.reviewCount}</span>
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
          <span class="status-stat-val">${metrics.statusCounts[STATUS_TYPES.SOLID] || 0}</span>
        </div>
        <div class="status-stat-pill familiar">
          <span class="status-stat-label">Familiar</span>
          <span class="status-stat-val">${metrics.statusCounts[STATUS_TYPES.FAMILIAR] || 0}</span>
        </div>
        <div class="status-stat-pill learning">
          <span class="status-stat-label">Learning</span>
          <span class="status-stat-val">${metrics.statusCounts[STATUS_TYPES.LEARNING] || 0}</span>
        </div>
        <div class="status-stat-pill not-started">
          <span class="status-stat-label">Not Started</span>
          <span class="status-stat-val">${metrics.statusCounts[STATUS_TYPES.NOT_STARTED] || 0}</span>
        </div>
      </div>

      <!-- 4. Section-by-Section Breakdown -->
      <div class="dashboard-sections-container">
        <div class="dashboard-sections-header">
          <span>Curriculum Progress by Section</span>
          <span class="metric-sub">Click a section to open in Roadmap</span>
        </div>

        <div class="section-progress-list">
          ${metrics.sections.map(sec => `
            <div class="section-progress-item" data-section-id="${sec.id}">
              <div class="section-item-header">
                <span class="section-item-title">${sec.title}</span>
                <span class="section-item-pct">${sec.knowledgePct}%</span>
              </div>
              <div class="progress-bar-track">
                <div class="progress-bar-fill brand" style="width: ${sec.knowledgePct}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  container.querySelector('#dashboard-open-focus-btn')?.addEventListener('click', () => {
    if (state.currentFocus) onOpenTopic(state.currentFocus);
  });

  container.querySelector('#dashboard-browse-roadmap-btn')?.addEventListener('click', () => {
    onNavigateSection(null);
  });

  container.querySelectorAll('.section-progress-item').forEach(item => {
    item.addEventListener('click', () => {
      const secId = item.getAttribute('data-section-id');
      if (secId) onNavigateSection(secId);
    });
  });
}
