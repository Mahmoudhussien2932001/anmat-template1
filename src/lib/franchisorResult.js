import { RULES_VERSION, answerLabel, isComplete } from '../data/assessment.js'

const GAP_COPY = {
  'business-model': 'فجوة في التحقق من نموذج العمل',
  operations: 'فجوة في توثيق التشغيل',
  'financial-model': 'فجوة في النموذج المالي للوحدة',
  'team-independence': 'فجوة في استقلالية الفريق عن حضور المالك',
}

const SUGGESTED_SERVICES = {
  readiness: { id: 'readiness', label: 'مراجعة جاهزية العلامة' },
  development: { id: 'development', label: 'تطوير برنامج امتياز متكامل' },
  attraction: { id: 'attraction', label: 'طرح الفرصة واستقطاب الشركاء' },
  network: { id: 'network', label: 'دعم شبكة الامتياز الحالية' },
}

function gap(id, support) {
  return { id, label: GAP_COPY[id], support }
}

export function evaluateFranchisor(answers, questions) {
  if (!isComplete(questions, answers)) return null

  const suggestedService = SUGGESTED_SERVICES[answers.priority]
  if (!suggestedService) return null

  const gaps = []
  if (answers.stage === 'idea') {
    gaps.push(gap('business-model', answerLabel(questions, 'stage', answers.stage)))
  }
  if (answers.operations === 'partial' || answers.operations === 'none') {
    gaps.push(gap('operations', answerLabel(questions, 'operations', answers.operations)))
  }
  if (answers.financials === 'partial' || answers.financials === 'missing') {
    gaps.push(gap('financial-model', answerLabel(questions, 'financials', answers.financials)))
  }
  if (answers.independence === 'owner' || answers.independence === 'unknown') {
    gaps.push(gap('team-independence', answerLabel(questions, 'independence', answers.independence)))
  }

  return {
    rulesVersion: RULES_VERSION,
    hasGaps: gaps.length > 0,
    title: gaps.length
      ? 'الخطوة الأنسب: تقوية أساس علامتك.'
      : 'الخطوة التالية: تقييم تفصيلي للتوسع.',
    gaps,
    suggestedService,
    explanation: 'هذا تقييم أولي لترتيب الحوار، وليس اعتمادًا لجاهزية العلامة.',
  }
}
