/* functions for stock */
/* global Deckdle, Card, StockAction */
/* eslint-disable no-unused-vars */

// TODO
class Stock {
  constructor(cards, type = 'golf') {
    this.type = type
    this.cards = []

    switch (this.type) {
      case 'golf':
      default: {
        if (Deckdle._valType(cards) == 'Deck') {
          while (cards.size()) {
            this.cards.push(cards.removeTop())
          }
        } else {
          cards.forEach((card) => {
            this.addCard(card)
          })
        }
      }
    }
  }

  // Deckdle._stockCount = () => {
  //   return Deckdle.__getState()['stock'].length
  // }
  size = () => {
    return this.cards.length
  }

  // Deckdle._checkForEmptyStock = () => {
  //   if (!Deckdle._stockCount()) {
  //     Deckdle.dom.interactive.stock.appendChild(Deckdle.ui._createEmptyCard())

  //     Deckdle._checkWinState()
  //   }
  // }
  isEmpty = () => {
    return this.cards.length == 0
  }

  list = () => {
    let display = ''

    this.cards.forEach((card) => {
      display += card.show()
    })

    return display
  }

  addCard = (card) => {
    this.cards.push(new Card(card.suit, card.rank))
  }

  removeCard = () => {
    return this.cards.pop()
  }

  topCard = () => {
    return this.cards[this.cards.length - 1]
  }

  // TODO: GUI
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
    Deckdle._saveGame('Stock.moveCardToBase')

    // updates DOM
    Deckdle.ui._removeCardFromStock()
    Deckdle.ui._moveCardToBase('stock')
    Deckdle.ui._updateCardCounts()

    this.isEmpty()
  }

  // TODO: GUI
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

Deckdle._moveCardFromStockToBase = (noMoveInPrevGame) => {
  const base = Deckdle.__getState()['base']
  const stock = Deckdle.__getState()['stock']

  // update code model
  base.push(stock.pop())
  Deckdle.__setState('base', base)
  Deckdle.__setState('stock', stock)

  Deckdle._resetCombo()

  if (!noMoveInPrevGame) {
    Deckdle.__addAction(new StockAction())
  }
  Deckdle.__setState('lastPlayedTime', new Date().getTime())
  Deckdle._saveGame('_moveCardFromStockToBase')

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
