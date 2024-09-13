/* lib/misc/puzzle */
/*
  Creates a new Deck full of Cards, and then uses
  a generated setupId to create a tableau and stock
*/
/* eslint-disable no-undef, no-unused-vars */

class Puzzle {
  constructor(setupId, type = 'golf', state = null) {
    this.setupId = setupId
    this.type = type

    if (state) {
      this.tableau = this.#createTableau(state.tableau)
      this.stock = this.#createStock(state.stock)
      this.base = this.#createBase(state.base)
    } else {
      this.deck = new Deck()

      // get random, yet deterministic, shuffle
      this.deck.shuffle(setupId)

      this.tableau = this.#createTableau()
      this.stock = this.#createStock()
      this.base = []
    }
  }

  #createTableau = (source = null) => {
    const tableau = {}

    switch (this.type) {
      case 'golf':
      default:
        for (let colId = 0; colId < DECKDLE_GOLF_COL_MAX; colId++) {
          tableau[colId] = []
          for (let cardId = 0; cardId < DECKDLE_GOLF_ROW_MAX; cardId++) {
            let cardToAdd = null

            if (source) {
              const srcCard = source[colId][cardId]

              cardToAdd = new Card(srcCard.suit, srcCard.rank, srcCard.status)
            } else {
              cardToAdd = this.deck.removeTop()
            }

            tableau[colId][cardId] = cardToAdd
          }
        }

        break
    }

    return tableau
  }

  #createStock = (source = null) => {
    const stock = []

    if (source) {
      source.forEach((card) => {
        stock.push(new Card(card.suit, card.rank))
      })
    } else {
      while (this.deck.size()) {
        stock.push(this.deck.removeTop())
      }
    }

    return stock
  }

  #createBase = (source) => {
    const base = []

    source.forEach((card) => {
      base.push(new Card(card.suit, card.rank))
    })

    return base
  }
}
