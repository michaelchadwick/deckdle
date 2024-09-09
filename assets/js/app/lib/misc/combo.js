/* lib/misc/combo.js */
/* functions for combo notification */

Deckdle._increaseCombo = () => {
  Deckdle.combo += 1

  const curComboMax = Deckdle.__getState()['comboMax']

  if (Deckdle.combo > curComboMax) {
    Deckdle.__setState('comboMax', Deckdle.combo)
  }

  Deckdle._saveGame(Deckdle.__getGameMode())

  Deckdle.ui._updateComboCounter()
}

Deckdle._resetCombo = () => {
  if (Deckdle.combo > 1) {
    Deckdle.combo = 0
    Deckdle.ui._updateComboCounter()
  }
}
