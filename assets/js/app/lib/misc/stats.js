/* lib/misc/stats */
/* function for modal stats */
/* global Deckdle */

Deckdle._getFinishedGameCount = function (mode) {
  let ls =
    mode == 'daily'
      ? localStorage.getItem(DECKDLE_STATE_DAILY_LS_KEY)
      : localStorage.getItem(DECKDLE_STATE_FREE_LS_KEY)

  return ls ? JSON.parse(ls).filter((session) => session.lastCompletedTime).length : 0
}

Deckdle._getBestCombo = function (mode) {
  let ls =
    mode == 'daily'
      ? localStorage.getItem(DECKDLE_STATE_DAILY_LS_KEY)
      : localStorage.getItem(DECKDLE_STATE_FREE_LS_KEY)

  return ls ? Math.max(...JSON.parse(ls).map((session) => session.comboMax)) : 0
}

Deckdle._getBestScore = function (mode) {
  let ls =
    mode == 'daily'
      ? localStorage.getItem(DECKDLE_STATE_DAILY_LS_KEY)
      : localStorage.getItem(DECKDLE_STATE_FREE_LS_KEY)

  if (ls) {
    const sessionsFinished = JSON.parse(ls).filter((session) => session.lastCompletedTime)
    let bestScore = 35
    let score = null

    if (sessionsFinished.length) {
      sessionsFinished.forEach((session) => {
        if (Deckdle._tableauCount(session.tableau) == 0) {
          score = -session.stock.length
        } else {
          score = Deckdle._tableauCount(session.tableau)
        }

        console.log('session score', score)

        if (score < bestScore) {
          bestScore = score
        }
      })

      if (bestScore < 0) {
        return `-${bestScore.toString()}`
      } else if (bestScore == 0) {
        return bestScore.toString()
      } else {
        return `+${bestScore.toString()}`
      }
    } else {
      return 'N/A'
    }
  } else {
    return 'N/A'
  }
}
