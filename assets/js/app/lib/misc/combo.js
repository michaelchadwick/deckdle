/* lib/misc/combo.js */
/* functions for combo notification */

Deckdle._increaseCombo = () => {
  Deckdle.combo += 1

  const curComboMax = Deckdle.__getState()['comboMax']

  if (Deckdle.combo > curComboMax) {
    Deckdle.__setState('comboMax', Deckdle.combo)
  }

  Deckdle.ui._updateComboCounter()

  Deckdle._saveGame()
}

Deckdle._resetCombo = () => {
  const needsToReset = Deckdle.combo > 1

  Deckdle.combo = 0

  if (needsToReset) {
    Deckdle.ui._updateComboCounter()
  }
}
