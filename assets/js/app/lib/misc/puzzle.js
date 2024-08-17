/* lib/puzzle.js */
/*
  Creates a new Deck full of Cards, and then uses
  a generated setupId to create a tableau and stock
*/

class Puzzle {
  GOLF_COL_MAX = 5
  GOLF_CARD_MAX = 7

  constructor(setupId, type = 'golf') {
    this.type = type
    this.deck = new Deck()

    // get random, yet deterministic, shuffle
    this.deck.shuffle(setupId)

    this.tableau = this.#createTableau()
    this.stock = this.#createStock()
  }

  #createTableau = () => {
    const tableau = {}

    for (let colId = 0; colId < this.GOLF_CARD_MAX; colId++) {
      tableau[colId] = []
      for (let cardId = 0; cardId < this.GOLF_COL_MAX; cardId++) {
        const card = this.deck.removeTop()

        tableau[colId][cardId] = card
      }
    }

    Deckdle.__setState('tableau', tableau)

    return tableau
  }

  #createStock = () => {
    const stock = []

    while (this.deck.size()) {
      stock.push(this.deck.removeTop())
    }

    Deckdle.__setState('stock', stock)

    return stock
  }
}
