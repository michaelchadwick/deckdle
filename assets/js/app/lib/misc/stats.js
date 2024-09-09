/* lib/misc/stats */
/* function for modal stats */
/* global Deckdle */

Deckdle._getGameCount = function (mode) {
  let ls =
    mode == 'daily'
      ? localStorage.getItem(DECKDLE_STATE_DAILY_LS_KEY)
      : localStorage.getItem(DECKDLE_STATE_FREE_LS_KEY)

  return ls ? JSON.parse(ls).filter((session) => session.lastCompletedTime).length : 0
}
