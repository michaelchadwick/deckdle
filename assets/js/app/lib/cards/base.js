/* lib/cards/base.js */
/* functions for base */
/* global Deckdle */

Deckdle._isBaseEmpty = () => {
  return Deckdle.__getState()['base'].length == 0
}

Deckdle._removeCardFromBase = (card) => {
  const base = Deckdle.__getState()['base']

  base.pop()

  Deckdle.__setState('base', base)

  Deckdle._animateCSS('#base .card:last-of-type', 'fadeOutUp').then(() => {
    Deckdle.dom.interactive.base.lastChild.remove()
  })

  Deckdle.ui._undoBaseMove(card)

  Deckdle._resetCombo()
}
