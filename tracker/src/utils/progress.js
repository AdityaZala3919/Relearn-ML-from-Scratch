/**
 * Progress Calculation Engine
 * 
 * Implements weighted knowledge progress calculations and independent practical milestone counts.
 */

import { ROADMAP_SECTIONS, getDefaultChecklistForTopic, CORE_IMPLEMENTATION_IDS, TOPIC_MAP } from '../data/roadmap.js';
import { STATUS_TYPES } from './storage.js';

export const WEIGHTS = {
  [STATUS_TYPES.NOT_STARTED]: 0,
  [STATUS_TYPES.LEARNING]: 33.33,
  [STATUS_TYPES.FAMILIAR]: 66.66,
  [STATUS_TYPES.SOLID]: 100
};

export function getTopicKnowledgePct(status) {
  return WEIGHTS[status] ?? 0;
}

/**
 * Calculates comprehensive progress metrics for dashboard and views
 */
export function calculateMetrics(state) {
  const userTopics = state.userTopics || {};
  let totalTopics = 0;
  let totalKnowledgeWeightedScore = 0;

  const statusCounts = {
    [STATUS_TYPES.SOLID]: 0,
    [STATUS_TYPES.FAMILIAR]: 0,
    [STATUS_TYPES.LEARNING]: 0,
    [STATUS_TYPES.NOT_STARTED]: 0
  };

  let reviewCount = 0;
  let totalPracticalMilestones = 0;
  let completedPracticalMilestones = 0;

  const sectionMetrics = ROADMAP_SECTIONS.map(section => {
    let secTopicsCount = section.topics.length;
    let secKnowledgeScore = 0;
    let secPracticalTotal = 0;
    let secPracticalCompleted = 0;

    section.topics.forEach(topic => {
      totalTopics++;
      const topicData = userTopics[topic.id] || {};
      const status = topicData.status || STATUS_TYPES.NOT_STARTED;
      
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      
      const pct = getTopicKnowledgePct(status);
      secKnowledgeScore += pct;
      totalKnowledgeWeightedScore += pct;

      if (topicData.needsReview) {
        reviewCount++;
      }

      // Checklists
      const defaultChecklist = getDefaultChecklistForTopic(topic);
      const practicalItems = defaultChecklist.practical;
      secPracticalTotal += practicalItems.length;
      totalPracticalMilestones += practicalItems.length;

      practicalItems.forEach(item => {
        if (topicData.checklist && topicData.checklist[item.id]) {
          secPracticalCompleted++;
          completedPracticalMilestones++;
        }
      });
    });

    const secKnowledgePct = secTopicsCount > 0 ? Math.round(secKnowledgeScore / secTopicsCount) : 0;
    const secPracticalPct = secPracticalTotal > 0 ? Math.round((secPracticalCompleted / secPracticalTotal) * 100) : 0;

    return {
      id: section.id,
      title: section.title,
      totalTopics: secTopicsCount,
      knowledgePct: secKnowledgePct,
      practicalPct: secPracticalPct,
      practicalTotal: secPracticalTotal,
      practicalCompleted: secPracticalCompleted
    };
  });

  const overallKnowledgePct = totalTopics > 0 ? Math.round(totalKnowledgeWeightedScore / totalTopics) : 0;
  const overallPracticalPct = totalPracticalMilestones > 0 ? Math.round((completedPracticalMilestones / totalPracticalMilestones) * 100) : 0;

  const openGapsCount = (state.knowledgeGaps || []).filter(g => !g.resolved).length;

  return {
    totalTopics,
    overallKnowledgePct,
    overallPracticalPct,
    totalPracticalMilestones,
    completedPracticalMilestones,
    statusCounts,
    reviewCount,
    openGapsCount,
    sections: sectionMetrics
  };
}

/**
 * Calculates milestone completion for core implementations
 */
export function calculateImplementationMetrics(state) {
  const userTopics = state.userTopics || {};
  let totalMilestones = 0;
  let completedMilestones = 0;

  const algorithms = CORE_IMPLEMENTATION_IDS.map(topicId => {
    const topic = TOPIC_MAP.get(topicId);
    if (!topic) return null;

    const topicData = userTopics[topicId] || {};
    const checklist = topicData.checklist || {};
    const defaultChecklist = getDefaultChecklistForTopic(topic);

    const milestones = defaultChecklist.practical.map(item => {
      totalMilestones++;
      const isDone = !!checklist[item.id];
      if (isDone) completedMilestones++;
      return {
        id: item.id,
        label: item.label,
        completed: isDone
      };
    });

    const completedForAlgo = milestones.filter(m => m.completed).length;
    const pct = milestones.length > 0 ? Math.round((completedForAlgo / milestones.length) * 100) : 0;

    return {
      topicId: topic.id,
      title: topic.title,
      status: topicData.status || STATUS_TYPES.NOT_STARTED,
      milestones,
      completedCount: completedForAlgo,
      totalCount: milestones.length,
      pct
    };
  }).filter(Boolean);

  const pct = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return {
    algorithms,
    totalMilestones,
    completedMilestones,
    pct
  };
}
