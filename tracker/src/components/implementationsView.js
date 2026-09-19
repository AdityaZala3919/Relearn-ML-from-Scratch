/**
 * Implementations View Component
 * Dedicated tracker for from-scratch algorithm implementations and milestones.
 * Directly synced with topic checklists as a single source of truth.
 */

import { calculateImplementationMetrics } from '../utils/progress.js';
import { getIcon } from '../utils/icons.js';

export function renderImplementationsView(container, { state, onToggleMilestone, onOpenTopic }) {
  const implData = calculateImplementationMetrics(state);

  container.innerHTML = `
    <div class="view-header">
      <div class="view-title-row">
        <div>
          <h1 class="view-heading">From-Scratch Implementation Tracker</h1>
          <p class="view-subheading">Build core ML algorithms from scratch to solidify intuition and numerical mechanics.</p>
        </div>
        <div>
          <span class="brand-badge" style="font-size: 0.82rem; padding: 0.35rem 0.75rem;">
            ${implData.completedMilestones} / ${implData.totalMilestones} Milestones Complete (${implData.pct}%)
          </span>
        </div>
      </div>

      <div class="progress-bar-track" style="height: 9px; margin-top: 0.5rem;">
        <div class="progress-bar-fill emerald" style="width: ${implData.pct}%"></div>
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
            ${implData.algorithms.map(algo => `
              <tr>
                <td>
                  <div class="impl-algo-name" data-open-topic="${algo.topicId}">
                    <span>${algo.title}</span>
                    ${getIcon('external-link', 13, 'text-subtle')}
                  </div>
                  <div class="metric-sub" style="margin-top: 0.2rem;">
                    ${algo.completedCount} / ${algo.totalCount} completed (${algo.pct}%)
                  </div>
                </td>
                ${algo.milestones.map(m => `
                  <td class="impl-milestone-cell">
                    <input 
                      type="checkbox" 
                      class="milestone-checkbox" 
                      data-topic-id="${algo.topicId}" 
                      data-milestone-id="${m.id}"
                      ${m.completed ? 'checked' : ''}
                      title="${m.label}"
                    />
                  </td>
                `).join('')}
              </tr>
            `).join('')}
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
  `;

  // Milestone toggles
  container.querySelectorAll('.milestone-checkbox').forEach(box => {
    box.addEventListener('change', () => {
      const topicId = box.getAttribute('data-topic-id');
      const milestoneId = box.getAttribute('data-milestone-id');
      if (topicId && milestoneId) {
        onToggleMilestone(topicId, milestoneId);
      }
    });
  });

  // Open topic drawer from table
  container.querySelectorAll('[data-open-topic]').forEach(el => {
    el.addEventListener('click', () => {
      const topicId = el.getAttribute('data-open-topic');
      if (topicId) onOpenTopic(topicId);
    });
  });
}
