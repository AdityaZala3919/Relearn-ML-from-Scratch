/**
 * Application Bootstrap & Main Controller
 * Handles routing, component lifecycle, reactive state updates, and global shortcuts.
 */

import { store } from './utils/storage.js';
import { calculateMetrics } from './utils/progress.js';

import { renderHeader } from './components/header.js';
import { renderSidebar } from './components/sidebar.js';
import { renderDashboardView } from './components/dashboardView.js';
import { renderRoadmapView } from './components/roadmapView.js';
import { renderImplementationsView } from './components/implementationsView.js';
import { renderKnowledgeGapsView } from './components/knowledgeGapsView.js';
import { renderReviewQueueView } from './components/reviewQueueView.js';
import { renderTopicDrawer } from './components/topicDrawer.js';
import { renderSearchModal } from './components/searchModal.js';
import { renderDataModal } from './components/dataModal.js';

class AppController {
  constructor() {
    this.store = store;

    this.currentRoute = 'dashboard';
    this.targetSectionId = null;
    this.activeDrawerTopicId = null;
    this.isSearchOpen = false;
    this.isDataModalOpen = false;
    this.fileSyncStatus = 'synced';

    this.roadmapFilters = {
      status: 'ALL',
      review: 'ALL',
      practical: 'ALL',
      query: ''
    };

    // Containers
    this.headerEl = document.getElementById('app-header');
    this.sidebarEl = document.getElementById('app-sidebar');
    this.mainEl = document.getElementById('main-content');
    this.drawerEl = document.getElementById('topic-drawer-container');
    this.modalEl = document.getElementById('modal-container');
    this.searchModalEl = document.getElementById('search-modal-container');

    this.init();
  }

  init() {
    // 1. Apply theme
    const state = this.store.getState();
    document.documentElement.setAttribute('data-theme', state.theme || 'dark');

    // 2. Setup reactive subscriptions
    this.store.subscribe((eventType, updatedState) => {
      if (eventType === 'file_sync_status') {
        this.fileSyncStatus = updatedState.status;
        this.renderHeaderOnly();
      } else {
        this.render();
      }
    });

    // 3. Setup global keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openSearch();
      } else if (e.key === 'Escape') {
        if (this.isSearchOpen) this.closeSearch();
        else if (this.isDataModalOpen) this.closeDataModal();
        else if (this.activeDrawerTopicId) this.closeDrawer();
      }
    });

    // 4. Initial Render
    this.render();
  }

  navigate(route, targetSectionId = null) {
    this.currentRoute = route;
    this.targetSectionId = targetSectionId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  openTopicDrawer(topicId) {
    this.activeDrawerTopicId = topicId;
    this.renderDrawer();
  }

  closeDrawer() {
    this.activeDrawerTopicId = null;
    this.renderDrawer();
  }

  openSearch() {
    this.isSearchOpen = true;
    this.renderSearch();
  }

  closeSearch() {
    this.isSearchOpen = false;
    this.renderSearch();
  }

  openDataModal() {
    this.isDataModalOpen = true;
    this.renderModals();
  }

  closeDataModal() {
    this.isDataModalOpen = false;
    this.renderModals();
  }

  toggleTheme() {
    const state = this.store.getState();
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
    this.store.setTheme(nextTheme);
  }

  renderHeaderOnly() {
    const state = this.store.getState();
    renderHeader(this.headerEl, {
      currentTheme: state.theme,
      fileSyncStatus: this.fileSyncStatus,
      onOpenSearch: () => this.openSearch(),
      onOpenData: () => this.openDataModal(),
      onToggleTheme: () => this.toggleTheme()
    });
  }

  render() {
    const state = this.store.getState();
    const metrics = calculateMetrics(state);

    // Render Global Header
    this.renderHeaderOnly();

    // Render Sidebar Navigation
    renderSidebar(this.sidebarEl, {
      currentRoute: this.currentRoute,
      metrics,
      currentTheme: state.theme,
      onNavigate: (route) => this.navigate(route),
      onOpenData: () => this.openDataModal(),
      onToggleTheme: () => this.toggleTheme()
    });

    // Render Active Route View
    this.renderView(state, metrics);

    // Render Drawer & Modals
    this.renderDrawer();
    this.renderModals();
    this.renderSearch();
  }

  renderView(state, metrics) {
    switch (this.currentRoute) {
      case 'dashboard':
        renderDashboardView(this.mainEl, {
          state,
          metrics,
          onOpenTopic: (topicId) => this.openTopicDrawer(topicId),
          onNavigateSection: (secId) => this.navigate('roadmap', secId)
        });
        break;

      case 'roadmap':
        renderRoadmapView(this.mainEl, {
          state,
          metrics,
          filters: this.roadmapFilters,
          targetSectionId: this.targetSectionId,
          onSetFilters: (newFilters) => {
            this.roadmapFilters = newFilters;
            this.render();
          },
          onOpenTopic: (topicId) => this.openTopicDrawer(topicId),
          onCycleStatus: (topicId) => this.store.cycleTopicStatus(topicId)
        });
        break;

      case 'implementations':
        renderImplementationsView(this.mainEl, {
          state,
          onToggleMilestone: (topicId, milestoneId) => this.store.toggleChecklist(topicId, milestoneId),
          onOpenTopic: (topicId) => this.openTopicDrawer(topicId)
        });
        break;

      case 'gaps':
        renderKnowledgeGapsView(this.mainEl, {
          state,
          onOpenTopic: (topicId) => this.openTopicDrawer(topicId),
          onAddGap: (title, topicId, priority) => this.store.addKnowledgeGap(title, topicId, priority),
          onToggleResolved: (id) => this.store.toggleGapResolved(id),
          onDeleteGap: (id) => this.store.deleteKnowledgeGap(id)
        });
        break;

      case 'review':
        renderReviewQueueView(this.mainEl, {
          state,
          onOpenTopic: (topicId) => this.openTopicDrawer(topicId),
          onToggleReview: (topicId) => this.store.toggleNeedsReview(topicId),
          onCycleStatus: (topicId) => this.store.cycleTopicStatus(topicId)
        });
        break;

      default:
        this.currentRoute = 'dashboard';
        this.render();
    }
  }

  renderDrawer() {
    const state = this.store.getState();
    renderTopicDrawer(this.drawerEl, {
      topicId: this.activeDrawerTopicId,
      state,
      onClose: () => this.closeDrawer(),
      onSetStatus: (topicId, status) => this.store.setTopicStatus(topicId, status),
      onCycleStatus: (topicId) => this.store.cycleTopicStatus(topicId),
      onToggleChecklist: (topicId, itemId) => this.store.toggleChecklist(topicId, itemId),
      onUpdateNotes: (topicId, notes) => this.store.setTopicNotes(topicId, notes),
      onToggleFocus: (topicId) => this.store.setCurrentFocus(topicId),
      onToggleReview: (topicId) => this.store.toggleNeedsReview(topicId),
      onAddResource: (topicId, res) => this.store.addTopicResource(topicId, res),
      onDeleteResource: (topicId, resId) => this.store.deleteTopicResource(topicId, resId),
      onAddGapForTopic: (title, topicId) => {
        this.store.addKnowledgeGap(title, topicId, 'Medium');
        this.renderDrawer();
      }
    });
  }

  renderSearch() {
    if (!this.isSearchOpen) {
      this.searchModalEl.innerHTML = '';
      return;
    }

    const state = this.store.getState();
    renderSearchModal(this.searchModalEl, {
      state,
      onClose: () => this.closeSearch(),
      onSelectTopic: (topicId) => this.openTopicDrawer(topicId),
      onSelectSection: (sectionId) => this.navigate('roadmap', sectionId)
    });
  }

  renderModals() {
    if (!this.isDataModalOpen) {
      this.modalEl.innerHTML = '';
      return;
    }

    const state = this.store.getState();
    renderDataModal(this.modalEl, {
      state,
      lastSavedAt: this.store.lastSavedAt,
      onClose: () => this.closeDataModal(),
      onResetProgress: () => this.store.resetState(),
      onImportState: (newState) => this.store.importFullState(newState)
    });
  }
}

// Initialize Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new AppController();
});
