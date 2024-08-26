/* lib/misc/combo.js */
/* functions for combo notification */

Deckdle._increaseCombo = () => {
  Deckdle.combo += 1
  Deckdle.ui._updateComboCounter()
}

Deckdle._resetCombo = () => {
  if (Deckdle.combo > 1) {
    Deckdle.combo = 0
    Deckdle.ui._updateComboCounter()
  }
}