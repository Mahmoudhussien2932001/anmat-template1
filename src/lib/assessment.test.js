import assert from 'node:assert/strict'
import test from 'node:test'
import { buildInvestorQuestions, franchisorQuestions } from '../data/assessment.js'
import { opportunities } from '../data/opportunities.js'
import { buildHandoff } from './handoff.js'
import { evaluateFranchisor } from './franchisorResult.js'
import { matchOpportunities } from './investorMatch.js'
import { reduceSession, createSession } from '../state/assessmentState.js'

const positive = {
  stage: 'operating',
  operations: 'documented',
  financials: 'documented',
  independence: 'system',
  priority: 'readiness',
}

function records() {
  return [
    { id: 'food-sa-low', name: 'علامة أ', sectorId: 'food', sectorLabel: 'أغذية', levelId: 'low', levelLabel: 'منخفض', countryId: 'sa', countryLabel: 'السعودية' },
    { id: 'food-jo-medium', name: 'علامة ب', sectorId: 'food', sectorLabel: 'أغذية', levelId: 'medium', levelLabel: 'متوسط', countryId: 'jo', countryLabel: 'الأردن' },
    { id: 'retail-sa-high', name: 'علامة ج', sectorId: 'retail', sectorLabel: 'تجزئة', levelId: 'high', levelLabel: 'مرتفع', countryId: 'sa', countryLabel: 'السعودية' },
    { id: 'unknown-level', name: 'علامة د', sectorId: 'food', sectorLabel: 'أغذية', countryId: 'sa', countryLabel: 'السعودية' },
    { id: 'unknown-sector', name: 'علامة هـ', levelId: 'low', levelLabel: 'منخفض', countryId: 'sa', countryLabel: 'السعودية' },
  ]
}

const investorQuestions = buildInvestorQuestions(records())

test('incomplete franchisor answers do not produce a result', () => {
  assert.equal(evaluateFranchisor({}, franchisorQuestions), null)
  assert.equal(evaluateFranchisor({ ...positive, priority: undefined }, franchisorQuestions), null)
})

test('each franchisor gap is detected from its answer id', () => {
  const idea = evaluateFranchisor({ ...positive, stage: 'idea' }, franchisorQuestions)
  const partialOps = evaluateFranchisor({ ...positive, operations: 'partial' }, franchisorQuestions)
  const missingOps = evaluateFranchisor({ ...positive, operations: 'none' }, franchisorQuestions)
  const partialFinance = evaluateFranchisor({ ...positive, financials: 'partial' }, franchisorQuestions)
  const missingFinance = evaluateFranchisor({ ...positive, financials: 'missing' }, franchisorQuestions)
  const owner = evaluateFranchisor({ ...positive, independence: 'owner' }, franchisorQuestions)
  const unknown = evaluateFranchisor({ ...positive, independence: 'unknown' }, franchisorQuestions)

  assert.deepEqual(idea.gaps.map((item) => item.id), ['business-model'])
  assert.deepEqual(partialOps.gaps.map((item) => item.id), ['operations'])
  assert.deepEqual(missingOps.gaps.map((item) => item.id), ['operations'])
  assert.deepEqual(partialFinance.gaps.map((item) => item.id), ['financial-model'])
  assert.deepEqual(missingFinance.gaps.map((item) => item.id), ['financial-model'])
  assert.deepEqual(owner.gaps.map((item) => item.id), ['team-independence'])
  assert.deepEqual(unknown.gaps.map((item) => item.id), ['team-independence'])
  assert.equal(idea.title, 'الخطوة الأنسب: تقوية أساس علامتك.')
})

test('the fifth answer changes the suggested service while gaps stay visible', () => {
  const base = { ...positive, stage: 'idea', operations: 'partial' }
  const readiness = evaluateFranchisor({ ...base, priority: 'readiness' }, franchisorQuestions)
  const development = evaluateFranchisor({ ...base, priority: 'development' }, franchisorQuestions)
  const attraction = evaluateFranchisor({ ...base, priority: 'attraction' }, franchisorQuestions)
  const network = evaluateFranchisor({ ...base, priority: 'network' }, franchisorQuestions)

  assert.equal(readiness.suggestedService.id, 'readiness')
  assert.equal(development.suggestedService.id, 'development')
  assert.equal(attraction.suggestedService.id, 'attraction')
  assert.equal(network.suggestedService.id, 'network')
  for (const result of [readiness, development, attraction, network]) {
    assert.deepEqual(result.gaps.map((item) => item.id), ['business-model', 'operations'])
  }
})

test('fully positive answers produce the detailed-review outcome', () => {
  for (const stage of ['operating', 'expanding']) {
    const result = evaluateFranchisor({ ...positive, stage, priority: 'development' }, franchisorQuestions)
    assert.equal(result.hasGaps, false)
    assert.deepEqual(result.gaps, [])
    assert.equal(result.title, 'الخطوة التالية: تقييم تفصيلي للتوسع.')
    assert.equal(result.suggestedService.id, 'development')
    assert.match(result.explanation, /أولي/)
  }
})

test('investor filters combine with AND', () => {
  const match = matchOpportunities(records(), { sector: 'food', level: 'low', country: 'sa' }, investorQuestions)
  assert.deepEqual(match.matches.map((item) => item.id), ['food-sa-low'])
  assert.equal(match.broadened, false)
})

test('unrestricted choices do not restrict their filter and missing metadata stays out of restricted matches', () => {
  const open = matchOpportunities(records(), { sector: 'all', level: 'undecided', country: 'all' }, investorQuestions)
  assert.equal(open.matches.length, records().length)

  const sectorOnly = matchOpportunities(records(), { sector: 'food', level: 'undecided', country: 'all' }, investorQuestions)
  assert.deepEqual(sectorOnly.matches.map((item) => item.id), ['food-sa-low', 'food-jo-medium', 'unknown-level'])

  const levelOnly = matchOpportunities(records(), { sector: 'all', level: 'low', country: 'all' }, investorQuestions)
  assert.deepEqual(levelOnly.matches.map((item) => item.id), ['food-sa-low', 'unknown-sector'])
})

test('zero matches do not broaden filters', () => {
  const match = matchOpportunities(records(), { sector: 'retail', level: 'low', country: 'jo' }, investorQuestions)
  assert.deepEqual(match.matches, [])
  assert.equal(match.broadened, false)
  assert.deepEqual(match.filters, { sector: 'retail', level: 'low', country: 'jo' })
})

test('incomplete investor answers do not produce a match result', () => {
  assert.equal(matchOpportunities(records(), { sector: 'food' }, investorQuestions), null)
})

test('editing answers updates the franchisor result and handoff', () => {
  let state = createSession()
  for (const [questionId, answerId] of Object.entries(positive)) {
    state = reduceSession(state, { type: 'answer', audience: 'franchisor', questionId, answerId })
  }
  state = reduceSession(state, { type: 'show-result', audience: 'franchisor' })
  let result = evaluateFranchisor(state.assessments.franchisor.answers, franchisorQuestions)
  assert.equal(result.hasGaps, false)

  state = reduceSession(state, { type: 'answer', audience: 'franchisor', questionId: 'financials', answerId: 'missing' })
  result = evaluateFranchisor(state.assessments.franchisor.answers, franchisorQuestions)
  assert.deepEqual(result.gaps.map((item) => item.id), ['financial-model'])
  assert.equal(state.assessments.investor.answers.sector, undefined)

  const handoff = buildHandoff({
    audience: 'franchisor',
    questions: franchisorQuestions,
    answers: state.assessments.franchisor.answers,
    franchisorResult: result,
    match: null,
  })
  assert.equal(handoff.answers.find((item) => item.questionId === 'financials').answerId, 'missing')
  assert.deepEqual(handoff.gaps.map((item) => item.id), ['financial-model'])
  assert.equal(handoff.rulesVersion, result.rulesVersion)
})

test('restart clears only the chosen assessment', () => {
  let state = reduceSession(createSession(), {
    type: 'answer',
    audience: 'franchisor',
    questionId: 'stage',
    answerId: 'idea',
  })
  state = reduceSession(state, { type: 'answer', audience: 'investor', questionId: 'level', answerId: 'low' })
  state = reduceSession(state, { type: 'restart', audience: 'franchisor' })
  assert.deepEqual(state.assessments.franchisor.answers, {})
  assert.equal(state.assessments.investor.answers.level, 'low')
  assert.equal(reduceSession(state, { type: 'show-result', audience: 'franchisor' }).assessments.franchisor.phase, 'questions')
})

test('investor handoff keeps matching ids and does not invent matches', () => {
  const answers = { sector: 'food', level: 'low', country: 'sa' }
  const match = matchOpportunities(records(), answers, investorQuestions)
  const handoff = buildHandoff({
    audience: 'investor',
    questions: investorQuestions,
    answers,
    franchisorResult: null,
    match,
  })
  assert.deepEqual(handoff.opportunityIds, ['food-sa-low'])
  assert.equal(buildHandoff({
    audience: 'investor',
    questions: investorQuestions,
    answers: { sector: 'all' },
    franchisorResult: null,
    match: null,
  }), null)
})

test('listed opportunities stay marked as unconfirmed prototype figures', () => {
  assert.ok(opportunities.length >= 6)
  for (const item of opportunities) {
    assert.equal(item.verified, false)
    assert.ok(item.caveat.ar && item.caveat.en)
  }
})
