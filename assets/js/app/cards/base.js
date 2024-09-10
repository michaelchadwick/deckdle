/* lib/cards/base.js */
/* functions for base */

Deckdle._isBaseEmpty = function () {
  return Deckdle.__getState()['base'].length == 0
}

Deckdle._removeCardFromBase = function (card) {
  const base = Deckdle.__getState()['base']

  base.pop()

  Deckdle.__setState('base', base)

  Deckdle._animateCSS('#base .card:last-of-type', 'fadeOutUp').then(() => {
    Deckdle.dom.interactive.base.lastChild.remove()
  })

  Deckdle.ui._undoBaseMove(card)

  Deckdle._resetCombo()
}
