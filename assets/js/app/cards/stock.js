/* lib/cards/stock.js */
/* functions for stock */
/* global Deckdle */

Deckdle._stockCount = function () {
  return Deckdle.__getState()['stock'].length
}

Deckdle._checkForEmptyStock = function () {
  if (!Deckdle._stockCount()) {
    Deckdle.dom.interactive.stock.appendChild(Deckdle.ui._createEmptyCard())

    Deckdle._checkWinState()
  }
}

Deckdle._moveCardFromStockToBase = () => {
  const base = Deckdle.__getState()['base']
  const stock = Deckdle.__getState()['stock']

  // update code model
  base.push(stock.pop())
  Deckdle.__setState('base', base)
  Deckdle.__setState('stock', stock)

  Deckdle._resetCombo()

  Deckdle.__setState('lastPlayedTime', new Date().getTime())
  Deckdle._saveGame()

  // updates DOM
  Deckdle.ui._removeCardFromStock()
  Deckdle.ui._moveCardToBase('stock')
  Deckdle.ui._updateCardCounts()

  Deckdle._checkForEmptyStock()
}

Deckdle._onStockClick = function () {
  if (Deckdle.__getState()['stock'].length) {
    Deckdle._moveCardFromStockToBase()

    Deckdle._playSFX('click_stock', Deckdle.__getState()['stock'].length)
  }
}
