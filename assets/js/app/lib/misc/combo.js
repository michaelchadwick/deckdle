/* lib/misc/combo.js */
/* functions for combo notification */

Deckdle._increaseCombo = () => {
  Deckdle.combo++
  Deckdle.ui._updateComboToaster()
}

Deckdle._resetCombo = () => {
  Deckdle.combo = 0
  Deckdle.ui._updateComboToaster()
}