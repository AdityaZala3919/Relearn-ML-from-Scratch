/**
 * Sidebar Component
 * Left navigation panel for desktop and mobile navigation.
 */

import { getIcon } from '../utils/icons.js';

export function renderSidebar(container, { currentRoute, onNavigate, onOpenData, metrics, currentTheme, onToggleTheme }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'roadmap', label: 'Roadmap', icon: 'roadmap' },
    { id: 'implementations', label: 'Implementations', icon: 'implementations', badge: `${metrics.completedPracticalMilestones}/${metrics.totalPracticalMilestones}` },
    { id: 'gaps', label: 'Knowledge Gaps', icon: 'gaps', badge: metrics.openGapsCount > 0 ? metrics.openGapsCount : null, alert: metrics.openGapsCount > 0 },
    { id: 'review', label: 'Review Queue', icon: 'review', badge: metrics.reviewCount > 0 ? metrics.reviewCount : null, alert: metrics.reviewCount > 0 }
  ];

  container.innerHTML = `
    <div class="nav-section">
      <div class="nav-label">Navigation</div>
      ${navItems.map(item => `
        <div class="nav-item ${currentRoute === item.id ? 'active' : ''}" data-route="${item.id}">
          <div class="nav-item-content">
            <span class="nav-item-icon">${getIcon(item.icon, 18)}</span>
            <span>${item.label}</span>
          </div>
          ${item.badge !== null && item.badge !== undefined ? `
            <span class="nav-badge ${item.alert ? 'alert' : ''}">${item.badge}</span>
          ` : ''}
        </div>
      `).join('')}
    </div>

    <div class="sidebar-footer">
      <div class="nav-item" id="sidebar-data-btn">
        <div class="nav-item-content">
          <span class="nav-item-icon">${getIcon('database', 18)}</span>
          <span>Data & Sync</span>
        </div>
      </div>
      <div class="nav-item" id="sidebar-theme-btn">
        <div class="nav-item-content">
          <span class="nav-item-icon">${currentTheme === 'dark' ? getIcon('sun', 18) : getIcon('moon', 18)}</span>
          <span>${currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </div>
      </div>
    </div>
  `;

  // Attach navigation events
  container.querySelectorAll('.nav-item[data-route]').forEach(el => {
    el.addEventListener('click', () => {
      const route = el.getAttribute('data-route');
      if (route) onNavigate(route);
    });
  });

  container.querySelector('#sidebar-data-btn')?.addEventListener('click', onOpenData);
  container.querySelector('#sidebar-theme-btn')?.addEventListener('click', onToggleTheme);
}
