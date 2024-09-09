/* lib/cards/stock.js */
/* functions for stock */

Deckdle._stockCount = function () {
  return Deckdle.__getState()['stock'].length
}

Deckdle._checkForEmptyStock = function () {
  if (!Deckdle._stockCount()) {
    Deckdle.dom.interactive.stock.appendChild(Deckdle.ui._createEmptyCard())

    Deckdle._checkWinState()
  }
}

Deckdle._onStockClick = function () {
  if (Deckdle.__getState()['stock'].length) {
    Deckdle._moveCardFromStockToBase()

    Deckdle._playSFX('click_stock', Deckdle.__getState()['stock'].length)
  }
}

Deckdle._moveCardFromStockToBase = () => {
  const base = Deckdle.__getState()['base']
  const stock = Deckdle.__getState()['stock']

  if (base.length) {
    Deckdle._resetCombo()
  }

  base.push(stock.pop())

  // updates DOM
  Deckdle.ui._removeCardFromStock()
  Deckdle.ui._moveCardToBase('stock')

  Deckdle.__setState('base', base)
  Deckdle.__setState('stock', stock)

  Deckdle.ui._updateStockBaseCounts()

  Deckdle.__setState('lastPlayedTime', new Date().getTime())

  Deckdle._saveGame(Deckdle.__getGameMode())

  Deckdle._checkForEmptyStock()
}
