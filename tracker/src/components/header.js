/**
 * Header Component
 * Global top navigation bar with brand, search trigger, local file indicator, and settings.
 */

import { getIcon } from '../utils/icons.js';

export function renderHeader(container, { onOpenSearch, onOpenData, onToggleTheme, currentTheme, fileSyncStatus }) {
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const shortcutKey = isMac ? '⌘K' : 'Ctrl+K';

  let statusClass = 'synced';
  let statusText = 'data/progress.json';

  if (fileSyncStatus === 'saving') {
    statusClass = 'syncing';
    statusText = 'Saving...';
  } else if (fileSyncStatus === 'error') {
    statusClass = 'offline';
    statusText = 'Save error';
  } else if (fileSyncStatus === 'offline') {
    statusClass = 'offline';
    statusText = 'Local cache';
  }

  container.innerHTML = `
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
      <button class="search-trigger-btn" id="header-search-btn" title="Search topics & knowledge gaps (${shortcutKey})">
        ${getIcon('search', 15)}
        <span>Search topics...</span>
        <kbd class="search-kbd">${shortcutKey}</kbd>
      </button>

      <!-- Local File Status Pill -->
      <button class="sync-status-pill" id="header-sync-pill" title="Stored locally in data/progress.json">
        <span class="sync-dot ${statusClass}"></span>
        <span>${statusText}</span>
      </button>

      <!-- Theme Toggle -->
      <button class="btn-icon" id="header-theme-btn" title="Toggle dark / light theme">
        ${currentTheme === 'dark' ? getIcon('sun', 17) : getIcon('moon', 17)}
      </button>

      <!-- Data / Settings Button -->
      <button class="btn-icon" id="header-data-btn" title="Data Backup & JSON Management">
        ${getIcon('database', 17)}
      </button>
    </div>
  `;

  container.querySelector('#header-search-btn')?.addEventListener('click', onOpenSearch);
  container.querySelector('#header-sync-pill')?.addEventListener('click', onOpenData);
  container.querySelector('#header-theme-btn')?.addEventListener('click', onToggleTheme);
  container.querySelector('#header-data-btn')?.addEventListener('click', onOpenData);
}
