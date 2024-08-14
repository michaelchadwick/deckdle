class Puzzle {
  GOLF_COL_MAX = 5
  GOLF_CARD_MAX = 7

  constructor(setupId, type = 'golf', mode = 'free') {
    this.type = type
    this.deck = new Deck()

    // get random, yet deterministic, shuffle
    if (mode == 'daily') {
      this.deck.shuffle(setupId)
    }
    // get random shuffle
    else {
      this.deck.shuffle()
    }

    // create tableau and stock
    this.tableau = this.#createTableau()
    this.stock = this.#createStock()
  }

  /*

  */
  #createTableau = () => {
    // console.log('creating tableau...')

    const tableau = {}

    for (let colId = 0; colId < this.GOLF_CARD_MAX; colId++) {
      tableau[colId] = []
      for (let cardId = 0; cardId < this.GOLF_COL_MAX; cardId++) {
        const card = this.deck.removeTop()
        // console.log('createTableau card', card)
        tableau[colId][cardId] = card
      }
    }

    Deckdle.__setState('tableau', tableau)

    return tableau
  }

  #createStock = () => {
    // console.log('creating stock...')

    const stock = []

    while (this.deck.size()) {
      stock.push(this.deck.removeTop())

      // console.log(`stock has ${stock.length} cards; deck has ${this.deck.size()} cards left`)
    }

    Deckdle.__setState('stock', stock)

    // console.log('stock created', stock)

    return stock
  }
}
