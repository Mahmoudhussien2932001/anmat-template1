import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import { questionsFor } from '../../data/assessment.js'
import { opportunities } from '../../data/opportunities.js'
import { buildHandoff } from '../../lib/handoff.js'
import { evaluateFranchisor } from '../../lib/franchisorResult.js'
import { matchOpportunities } from '../../lib/investorMatch.js'
import { useSession } from '../../state/useSession.js'
import QuestionStep from './QuestionStep.jsx'
import FranchisorResult from '../results/FranchisorResult.jsx'
import InvestorResult from '../results/InvestorResult.jsx'

function focusable(root) {
  return [...root.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])')]
    .filter((node) => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true')
}

export default function AssessmentDialog({ audience, triggerRef, onClose }) {
  const panelRef = useRef(null)
  const navigate = useNavigate()
  const { lang } = useParams()
  const { t, i18n } = useTranslation()
  const mark = i18n.dir() === 'rtl' ? '←' : '→'
  const session = useSession()
  const assessment = session.assessments[audience]
  const questions = questionsFor(audience)
  const answers = assessment.answers
  const franchisorResult = audience === 'franchisor' ? evaluateFranchisor(answers, questions) : null
  const match = audience === 'investor' ? matchOpportunities(opportunities, answers, questions) : null
  const showingResult = assessment.phase === 'result' && Boolean(audience === 'franchisor' ? franchisorResult : match)
  const question = questions[assessment.step]

  useEffect(() => {
    const trigger = triggerRef.current
    function onKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !panelRef.current) return
      const items = focusable(panelRef.current)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const previousBody = document.body.style.overflow
    const previousHtml = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousBody
      document.documentElement.style.overflow = previousHtml
      if (trigger && document.contains(trigger)) trigger.focus()
    }
  }, [onClose, triggerRef])

  useEffect(() => {
    panelRef.current?.querySelector('#assessment-heading')?.focus()
  }, [assessment.step, assessment.phase, showingResult])

  function openContact() {
    const handoff = buildHandoff({
      audience,
      questions,
      answers,
      franchisorResult,
      match,
    })
    if (!handoff) return
    session.setHandoff(handoff)
    onClose()
    navigate(`/${lang}/contact`)
  }

  function showOpportunities() {
    if (!match) return
    const params = new URLSearchParams({
      sector: match.filters.sector,
      level: match.filters.level,
      country: match.filters.country,
    })
    onClose()
    navigate(`/${lang}/opportunities?${params.toString()}`)
  }

  const progressValue = showingResult ? questions.length : assessment.step + 1

  return createPortal(
    <div className="assessment-dialog" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div
        className="assessment-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="assessment-heading"
        ref={panelRef}
      >
        <div className="assessment-toolbar">
          <p className="eyebrow">{audience === 'franchisor' ? t('assessment.franchisorBadge') : t('assessment.investorBadge')}</p>
          <button type="button" className="icon-button" onClick={onClose}>{t('assessment.close')}</button>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={questions.length}
          aria-valuenow={progressValue}
          aria-label={showingResult ? t('assessment.result') : `${t('assessment.question')} ${progressValue} ${t('assessment.of')} ${questions.length}`}
        >
          {questions.map((item, index) => (
            <span key={item.id} className={index < progressValue ? 'is-filled' : ''} />
          ))}
        </div>
        <div className="assessment-body">
          {showingResult && audience === 'franchisor' ? <FranchisorResult result={franchisorResult} /> : null}
          {showingResult && audience === 'investor' ? <InvestorResult match={match} /> : null}
          {!showingResult ? (
            <QuestionStep
              question={question}
              index={assessment.step}
              total={questions.length}
              selectedId={answers[question.id]}
              onSelect={(answerId) => session.setAnswer(audience, question.id, answerId)}
            />
          ) : null}
        </div>
        <div className="assessment-actions">
          {!showingResult ? (
            <>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => session.setStep(audience, assessment.step - 1)}
                disabled={assessment.step === 0}
              >
                {t('assessment.back')}
              </button>
              <button
                type="button"
                className="button"
                disabled={!answers[question.id]}
                onClick={() => {
                  if (assessment.step === questions.length - 1) session.showResult(audience)
                  else session.setStep(audience, assessment.step + 1)
                }}
              >
                {t('assessment.next')}
              </button>
            </>
          ) : (
            <>
              <button type="button" className="button button-ghost" onClick={() => session.editAnswers(audience)}>{t('assessment.edit')}</button>
              <button type="button" className="button button-ghost" onClick={() => session.restart(audience)}>{t('assessment.restart')}</button>
              {audience === 'franchisor' ? (
                <button type="button" className="button" onClick={openContact}>{t('assessment.discussBrand')} {mark}</button>
              ) : null}
              {audience === 'investor' && match.matches.length > 0 ? (
                <button type="button" className="button" onClick={showOpportunities}>{t('assessment.show')} {mark}</button>
              ) : null}
              {audience === 'investor' && match.matches.length === 0 ? (
                <button type="button" className="button" onClick={() => { onClose(); navigate(`/${lang}/opportunities?view=all`) }}>{t('assessment.explore')}</button>
              ) : null}
              {audience === 'investor' ? (
                <button type="button" className="button button-ghost" onClick={openContact}>{t('assessment.discussPrefs')}</button>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
