/*
  Creates a new Deck full of Cards, and then uses
  a generated setupId to create a tableau and stock
*/
/* eslint-disable no-undef, no-unused-vars */

class Puzzle {
  MAX_SHUFFLES = 10

  constructor(setupId, type = 'golf', state = null) {
    this.setupId = setupId
    this.type = type
    this.shuffleCount = 0

    if (state) {
      this.tableau = this.#createTableau(state.tableau)
      this.stock = this.#createStock(state.stock)
      this.base = this.#createBase(state.base)
    } else {
      // create new Deck with initial shuffle based on setupId
      this.deck = new Deck(true, this.setupId)
      this.shuffleCount += 1

      // if no valid move, shuffle again
      while (!this.deck.hasValidMove() || this.shuffleCount > this.MAX_SHUFFLES) {
        // get random, yet deterministic, shuffle
        this.deck.shuffle(this.setupId)

        this.shuffleCount += 1
      }

      // randomization has failed me, so give up, but warn
      if (!this.deck.hasValidMove()) {
        console.warn(
          'max shuffle reached, and still no valid move. oh well, just click on the stock!'
        )
      }

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

              cardToAdd = new Card(srcCard.suit, srcCard.rank, srcCard.active)
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
