/**
 * Export, Import & Data Management Utilities
 */

export function exportStateAsJSON(state) {
  const exportPayload = {
    version: state.version || 1,
    exportedAt: new Date().toISOString(),
    userTopics: state.userTopics || {},
    currentFocus: state.currentFocus || null,
    knowledgeGaps: state.knowledgeGaps || [],
    theme: state.theme || 'dark'
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const d = new Date();
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const filename = `ml_dl_roadmap_backup_${dateStr}.json`;

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseAndValidateImport(jsonString) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('Invalid JSON format. Please ensure the file contains valid JSON.');
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Import data must be a JSON object.');
  }

  // Basic validation
  if (!parsed.userTopics && !parsed.knowledgeGaps) {
    throw new Error('Import file does not appear to be a valid ML/DL Roadmap backup.');
  }

  return {
    version: parsed.version || 1,
    userTopics: parsed.userTopics || {},
    currentFocus: parsed.currentFocus || null,
    knowledgeGaps: Array.isArray(parsed.knowledgeGaps) ? parsed.knowledgeGaps : [],
    theme: parsed.theme === 'light' ? 'light' : 'dark'
  };
}
