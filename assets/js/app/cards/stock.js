/* cards/stock.js */

Deckdle._checkForEmptyStock = function () {
  if (!Deckdle.__getState()['stock'].length) {
    Deckdle.dom.interactive.stock.appendChild(Deckdle.ui._createEmptyCard())

    console.log('no more cards in stock')

    Deckdle._checkWinState()
  }
}

Deckdle._onStockClick = function () {
  if (Deckdle.__getState()['stock'].length) {
    Deckdle._moveCardFromStockToBase()
  }
}

Deckdle._moveCardFromStockToBase = () => {
  const base = Deckdle.__getState()['base']
  const stock = Deckdle.__getState()['stock']

  base.push(stock.pop())

  Deckdle.ui._removeCardFromStock()
  Deckdle.ui._addCardToBase()

  Deckdle.__setState('base', base)
  Deckdle.__setState('stock', stock)

  Deckdle.ui._updateStockBaseCounts()

  Deckdle._checkForEmptyStock()
}