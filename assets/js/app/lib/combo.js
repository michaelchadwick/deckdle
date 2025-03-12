/* functions for combo notification */
/* global Deckdle */

Deckdle._increaseCombo = () => {
  Deckdle.comboCurrent += 1

  if (Deckdle.comboCurrent > Deckdle.comboCurrentMax) {
    Deckdle.comboCurrentMax += 1
  }

  const comboOverallMax = Deckdle.__getState()['comboMax']

  if (Deckdle.comboCurrent > comboOverallMax) {
    Deckdle.__setState('comboMax', Deckdle.comboCurrent)
  }

  Deckdle.ui._updateComboCounter()

  Deckdle._saveGame('_increaseCombo')
}

Deckdle._resetCombo = () => {
  const needsToReset = Deckdle.comboCurrent > 1

  Deckdle.comboCurrent = 0

  if (needsToReset) {
    Deckdle.ui._updateComboCounter()
  }
}
