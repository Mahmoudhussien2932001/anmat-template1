import { useEffect, useMemo, useReducer } from 'react'
import { loadSession, reduceSession, saveSession } from './assessmentState.js'
import { SessionContext } from './sessionContext.js'

export function SessionProvider({ children }) {
  const [state, dispatch] = useReducer(reduceSession, null, loadSession)

  useEffect(() => {
    saveSession(state)
  }, [state])

  const api = useMemo(() => ({
    audience: state.audience,
    assessments: state.assessments,
    handoff: state.handoff,
    setAudience: (audience) => dispatch({ type: 'set-audience', audience }),
    setAnswer: (audience, questionId, answerId) => dispatch({ type: 'answer', audience, questionId, answerId }),
    setStep: (audience, step) => dispatch({ type: 'set-step', audience, step }),
    showResult: (audience) => dispatch({ type: 'show-result', audience }),
    editAnswers: (audience) => dispatch({ type: 'edit', audience }),
    restart: (audience) => dispatch({ type: 'restart', audience }),
    setHandoff: (handoff) => dispatch({ type: 'set-handoff', handoff }),
  }), [state])

  return <SessionContext.Provider value={api}>{children}</SessionContext.Provider>
}
