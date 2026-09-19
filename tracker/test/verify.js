import assert from 'node:assert';
import { ROADMAP_SECTIONS, TOPIC_MAP, CORE_IMPLEMENTATION_IDS, getDefaultChecklistForTopic } from '../src/data/roadmap.js';
import { calculateMetrics, calculateImplementationMetrics } from '../src/utils/progress.js';
import { STATUS_TYPES } from '../src/utils/storage.js';
import { parseAndValidateImport } from '../src/utils/exportImport.js';

console.log('--- Starting Automated Verification Suite ---');

// 1. Verify 15 Sections
assert.strictEqual(ROADMAP_SECTIONS.length, 15, 'Must have exactly 15 sections');
console.log('✓ 15 sections verified');

// 2. Verify all topics have unique IDs
const seenIds = new Set();
let totalTopicCount = 0;
ROADMAP_SECTIONS.forEach(sec => {
  assert(sec.topics.length > 0, `Section ${sec.title} has no topics`);
  sec.topics.forEach(t => {
    assert(!seenIds.has(t.id), `Duplicate topic ID: ${t.id}`);
    seenIds.add(t.id);
    totalTopicCount++;
  });
});
console.log(`✓ All ${totalTopicCount} topic IDs are unique across all 15 sections`);

// 3. Verify clean initial state metrics
const cleanState = {
  version: 1,
  userTopics: {},
  currentFocus: null,
  knowledgeGaps: [],
  theme: 'dark'
};

const cleanMetrics = calculateMetrics(cleanState);
assert.strictEqual(cleanMetrics.overallKnowledgePct, 0, 'Clean state must be 0% knowledge progress');
assert.strictEqual(cleanMetrics.overallPracticalPct, 0, 'Clean state must be 0% practical progress');
assert.strictEqual(cleanMetrics.statusCounts[STATUS_TYPES.SOLID], 0, 'Solid count must start at 0');
assert.strictEqual(cleanMetrics.statusCounts[STATUS_TYPES.LEARNING], 0, 'Learning count must start at 0');
assert.strictEqual(cleanMetrics.statusCounts[STATUS_TYPES.NOT_STARTED], totalTopicCount, 'All topics must start at NOT_STARTED');
assert.strictEqual(cleanMetrics.reviewCount, 0, 'Review queue must start empty');
assert.strictEqual(cleanMetrics.openGapsCount, 0, 'Knowledge gaps must start empty');
console.log('✓ Pristine initial user state verified (0% progress, all 150+ topics Not Started)');

// 4. Verify Weighted Progress Updates
const updatedState = {
  ...cleanState,
  userTopics: {
    'supervised-linear-regression': {
      status: STATUS_TYPES.SOLID,
      needsReview: false,
      checklist: { 'p_scratch': true, 'p_toy': true }
    },
    'supervised-logistic-regression': {
      status: STATUS_TYPES.LEARNING,
      needsReview: true,
      checklist: { 'p_scratch': true }
    }
  }
};

const updatedMetrics = calculateMetrics(updatedState);
assert(updatedMetrics.overallKnowledgePct > 0, 'Overall knowledge percentage must increase when topics marked learning/solid');
assert.strictEqual(updatedMetrics.statusCounts[STATUS_TYPES.SOLID], 1, 'Solid count must be 1');
assert.strictEqual(updatedMetrics.statusCounts[STATUS_TYPES.LEARNING], 1, 'Learning count must be 1');
assert.strictEqual(updatedMetrics.reviewCount, 1, 'Review count must be 1');
assert(updatedMetrics.overallPracticalPct > 0, 'Practical progress must reflect completed checklist items');
console.log('✓ Weighted knowledge progress and practical calculation verified');

// 5. Verify Implementation Tracker Single Source of Truth
const implMetrics = calculateImplementationMetrics(updatedState);
assert.strictEqual(implMetrics.algorithms.length, CORE_IMPLEMENTATION_IDS.length, 'All core implementations must be present');
const linReg = implMetrics.algorithms.find(a => a.topicId === 'supervised-linear-regression');
assert(linReg, 'Linear Regression must be in implementations');
assert.strictEqual(linReg.milestones.find(m => m.id === 'p_scratch').completed, true, 'p_scratch must be marked complete in implementations');
assert.strictEqual(linReg.milestones.find(m => m.id === 'p_toy').completed, true, 'p_toy must be marked complete in implementations');
assert.strictEqual(linReg.milestones.find(m => m.id === 'p_real').completed, false, 'p_real must be incomplete');
console.log('✓ Single source of truth between topic checklist and implementation tracker verified');

// 6. Verify JSON Import / Export validation
const exportSample = JSON.stringify({
  version: 1,
  userTopics: { 'test-topic': { status: 'SOLID' } },
  knowledgeGaps: [{ id: 'gap-1', title: 'Why PCA?', priority: 'High', resolved: false }]
});

const validated = parseAndValidateImport(exportSample);
assert.strictEqual(validated.userTopics['test-topic'].status, 'SOLID');
assert.strictEqual(validated.knowledgeGaps.length, 1);
console.log('✓ JSON export/import schema validation verified');

console.log('--- All Automated Verifications Passed Successfully! ---');
