/**
 * Data Management Modal Component
 * Displays local repository file storage status, JSON export/import, and safe reset.
 */

import { getIcon } from '../utils/icons.js';
import { exportStateAsJSON, parseAndValidateImport } from '../utils/exportImport.js';

export function renderDataModal(container, {
  state,
  lastSavedAt,
  onClose,
  onResetProgress,
  onImportState
}) {
  const topicsCount = Object.keys(state.userTopics || {}).length;
  const gapsCount = (state.knowledgeGaps || []).length;
  const savedDisplay = lastSavedAt ? new Date(lastSavedAt).toLocaleTimeString() : (state.updatedAt ? new Date(state.updatedAt).toLocaleTimeString() : 'Not modified yet');

  container.innerHTML = `
    <div class="modal-backdrop active" id="data-modal-backdrop">
      <div class="modal-dialog" style="max-width: 540px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${getIcon('database', 20, 'text-brand')}
            <h2 class="modal-title">Data Storage & File Management</h2>
          </div>
          <button class="btn-icon" id="close-data-modal-btn">${getIcon('x', 18)}</button>
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
              <div>• Last disk write: <strong>${savedDisplay}</strong></div>
              <div>• Active topic records: <strong>${topicsCount}</strong></div>
              <div>• Knowledge gaps: <strong>${gapsCount}</strong></div>
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
  `;

  // Close handlers
  container.querySelector('#close-data-modal-btn')?.addEventListener('click', onClose);
  container.querySelector('#save-data-settings-btn')?.addEventListener('click', onClose);
  container.querySelector('#data-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'data-modal-backdrop') onClose();
  });

  // Export JSON
  container.querySelector('#export-json-btn')?.addEventListener('click', () => {
    exportStateAsJSON(state);
  });

  // Import JSON
  container.querySelector('#import-json-file')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const validated = parseAndValidateImport(event.target.result);
        if (confirm('Importing this file will replace your current progress. Continue?')) {
          onImportState(validated);
          alert('Progress imported successfully!');
          onClose();
        }
      } catch (err) {
        alert(`Failed to import: ${err.message}`);
      }
    };
    reader.readAsText(file);
  });

  // Reset progress
  container.querySelector('#reset-all-btn')?.addEventListener('click', () => {
    const promptAns = prompt('This will reset all your topic statuses, checklists, notes, and knowledge gaps back to zero.\n\nType RESET to confirm:');
    if (promptAns === 'RESET') {
      onResetProgress();
      alert('All progress has been reset to clean slate.');
      onClose();
    }
  });
}
