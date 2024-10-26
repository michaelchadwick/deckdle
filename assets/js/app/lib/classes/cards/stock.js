/* functions for stock */
/* global Deckdle, StockAction */
/* eslint-disable no-unused-vars */

// TODO
class Stock {
  constructor() {}

  count = () => {
    return Deckdle.__getState()['stock'].length
  }

  isEmpty = () => {
    if (!Deckdle._stockCount()) {
      Deckdle.dom.interactive.stock.appendChild(Deckdle.ui._createEmptyCard())

      Deckdle._checkWinState()
    }
  }

  moveCardToBase = () => {
    const base = Deckdle.__getState()['base']
    const stock = Deckdle.__getState()['stock']

    // update code model
    base.push(stock.pop())
    Deckdle.__setState('base', base)
    Deckdle.__setState('stock', stock)

    Deckdle._resetCombo()

    Deckdle.__addAction(new StockAction())
    Deckdle.__setState('lastPlayedTime', new Date().getTime())
    Deckdle._saveGame()

    // updates DOM
    Deckdle.ui._removeCardFromStock()
    Deckdle.ui._moveCardToBase('stock')
    Deckdle.ui._updateCardCounts()

    this.isEmpty()
  }

  onClick = () => {
    if (this._stockCount()) {
      this.moveCardToBase()

      Deckdle._playSFX('click_stock', this._stockCount())
    }
  }
}

Deckdle._stockCount = () => {
  return Deckdle.__getState()['stock'].length
}

Deckdle._checkForEmptyStock = () => {
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

  Deckdle.__addAction(new StockAction())
  Deckdle.__setState('lastPlayedTime', new Date().getTime())
  Deckdle._saveGame()

  // updates DOM
  Deckdle.ui._removeCardFromStock()
  Deckdle.ui._moveCardToBase('stock')
  Deckdle.ui._updateCardCounts()

  Deckdle._checkForEmptyStock()
}

Deckdle._onStockClick = () => {
  if (Deckdle._stockCount()) {
    Deckdle._moveCardFromStockToBase()

    Deckdle._playSFX('click_stock', Deckdle._stockCount())
  }
}
