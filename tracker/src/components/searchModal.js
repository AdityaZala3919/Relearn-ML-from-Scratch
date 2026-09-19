/**
 * Search Command Palette Component
 * Global instant search across topics, sections, knowledge gaps, and implementations.
 */

import { ROADMAP_SECTIONS, TOPIC_MAP, CORE_IMPLEMENTATION_IDS } from '../data/roadmap.js';
import { getIcon } from '../utils/icons.js';

export function renderSearchModal(container, { state, onClose, onSelectTopic, onSelectSection }) {
  let selectedIndex = 0;
  let currentResults = [];

  function performSearch(query) {
    if (!query || !query.trim()) {
      return [];
    }

    const q = query.toLowerCase().trim();
    const results = [];

    // 1. Topics
    TOPIC_MAP.forEach(topic => {
      if (topic.title.toLowerCase().includes(q) || topic.sectionTitle.toLowerCase().includes(q)) {
        results.push({
          type: 'topic',
          id: topic.id,
          title: topic.title,
          sub: topic.sectionTitle,
          badge: 'Topic'
        });
      }
    });

    // 2. Sections
    ROADMAP_SECTIONS.forEach(sec => {
      if (sec.title.toLowerCase().includes(q) || sec.description.toLowerCase().includes(q)) {
        results.push({
          type: 'section',
          id: sec.id,
          title: sec.title,
          sub: sec.description,
          badge: 'Section'
        });
      }
    });

    // 3. Knowledge Gaps
    (state.knowledgeGaps || []).forEach(gap => {
      if (gap.title.toLowerCase().includes(q)) {
        const topic = gap.topicId ? TOPIC_MAP.get(gap.topicId) : null;
        results.push({
          type: 'gap',
          id: gap.topicId || null,
          title: gap.title,
          sub: topic ? `Gap on ${topic.title}` : 'Unassigned Gap',
          badge: 'Knowledge Gap'
        });
      }
    });

    return results.slice(0, 15);
  }

  function renderList() {
    const listEl = container.querySelector('#search-results');
    if (!listEl) return;

    if (currentResults.length === 0) {
      listEl.innerHTML = `
        <div style="padding: 2rem; text-align: center; color: var(--color-text-subtle); font-size: 0.88rem;">
          No matching topics or knowledge gaps found.
        </div>
      `;
      return;
    }

    listEl.innerHTML = currentResults.map((item, idx) => `
      <div class="search-result-item ${idx === selectedIndex ? 'selected' : ''}" data-idx="${idx}">
        <div>
          <div class="search-result-title">${item.title}</div>
          <div class="search-result-section">${item.sub}</div>
        </div>
        <span class="nav-badge" style="font-size: 0.68rem;">${item.badge}</span>
      </div>
    `).join('');

    listEl.querySelectorAll('.search-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        selectItem(currentResults[idx]);
      });
    });
  }

  function selectItem(item) {
    if (!item) return;
    onClose();
    if (item.type === 'topic' || (item.type === 'gap' && item.id)) {
      onSelectTopic(item.id);
    } else if (item.type === 'section') {
      onSelectSection(item.id);
    }
  }

  container.innerHTML = `
    <div class="modal-backdrop active" id="search-modal-backdrop">
      <div class="modal-dialog search-modal" id="search-modal-box">
        <div class="search-input-wrapper">
          ${getIcon('search', 20, 'text-muted')}
          <input 
            type="text" 
            class="search-input" 
            id="global-search-input" 
            placeholder="Type a topic, section, or algorithm (e.g. gradient, logistic, pca)..." 
            autocomplete="off"
          />
          <button class="btn-icon" id="close-search-btn">${getIcon('x', 18)}</button>
        </div>

        <div class="search-results-list" id="search-results">
          <div style="padding: 1.5rem; text-align: center; color: var(--color-text-subtle); font-size: 0.88rem;">
            Type at least 1 character to search all 15 sections and 150+ topics.
          </div>
        </div>
      </div>
    </div>
  `;

  const inputEl = container.querySelector('#global-search-input');
  setTimeout(() => inputEl?.focus(), 50);

  inputEl?.addEventListener('input', (e) => {
    currentResults = performSearch(e.target.value);
    selectedIndex = 0;
    renderList();
  });

  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex + 1) % currentResults.length;
        renderList();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentResults.length > 0) {
        selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
        renderList();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentResults[selectedIndex]) {
        selectItem(currentResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  });

  container.querySelector('#close-search-btn')?.addEventListener('click', onClose);
  container.querySelector('#search-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'search-modal-backdrop') onClose();
  });
}
