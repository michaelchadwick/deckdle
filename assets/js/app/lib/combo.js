/* functions for combo notification */
/* global Deckdle */

Deckdle._increaseCombo = () => {
  let comboCurrentMax = Deckdle.__getState()['comboCurrentMax']
  let comboOverallMax = Deckdle.__getState()['comboMax']

  Deckdle.comboCurrent += 1

  // if the all-time combo max has been eclipsed, save to state
  if (Deckdle.comboCurrent > comboOverallMax) {
    Deckdle.__setState('comboMax', Deckdle.comboCurrent)
  }

  Deckdle.__setState('comboCurrent', Deckdle.comboCurrent)

  // if the current game's max combo has been eclipsed, save to state
  if (Deckdle.comboCurrent > comboCurrentMax) {
    comboCurrentMax += 1
    Deckdle.__setState('comboCurrentMax', comboCurrentMax)
  }

  // update the UI's version of the combo
  Deckdle.ui._updateComboCounter()

  Deckdle._saveGame('_increaseCombo')
}

Deckdle._resetCombo = () => {
  // does the UI need to be updated?
  const uiNeedsToReset = Deckdle.comboCurrent > 1

  // update internal code model
  // Deckdle._logStatus('[COMBO-RESET] setting Deckdle.comboCurrent to 0')
  Deckdle.comboCurrent = 0
  Deckdle.__setState('comboCurrent', 0)

  // update UI if needed
  if (uiNeedsToReset) {
    Deckdle.ui._updateComboCounter()
  }

  Deckdle._saveGame('_resetCombo')
}
