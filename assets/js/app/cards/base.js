/* lib/cards/base.js */
/* functions for base */

Deckdle._isBaseEmpty = function () {
  return Deckdle.__getState()['base'].length == 0
}