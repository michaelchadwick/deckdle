/* lib/cards/stock.js */
/* functions for stock */

Deckdle._checkForEmptyStock = function () {
  if (!Deckdle.__getState()['stock'].length) {
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

  base.push(stock.pop())

  Deckdle.ui._removeCardFromStock()
  Deckdle.ui._addCardToBase()

  // console.log('setting base from stock')
  Deckdle.__setState('base', base)
  Deckdle.__setState('stock', stock)

  Deckdle.ui._updateStockBaseCounts()

  Deckdle._checkForEmptyStock()
}