/* functions for base */
/* global Deckdle, Card */
/* eslint-disable no-unused-vars */

// two options for creation:
// 1. Card array to re-create existing Base
// 2. Null for empty Base
class Base {
  constructor(cards = null, type = 'golf') {
    this.type = type
    this.cards = []

    switch (this.type) {
      case 'golf':
      default: {
        if (cards) {
          cards.forEach((card) => {
            this.addCard(card)
          })
        }
      }
    }
  }

  size = () => {
    return this.cards.length
  }

  isEmpty = () => {
    // return this.cards.length == 0
    return Deckdle.__getState()['base'].length == 0
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

  undoLastMove = (card) => {
    const base = Deckdle.__getState()['base']

    base.pop()

    Deckdle.__setState('base', base)

    Deckdle._animateCSS('#base .card:last-of-type', 'fadeOutUp').then(() => {
      Deckdle.dom.interactive.base.lastChild.remove()
    })

    Deckdle.ui._undoBaseMove(card)

    Deckdle._resetCombo()
  }
}

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
