/* cards/deck.js */

class Deck {
  constructor(cardArray = null) {
    this.cards = []

    if (cardArray) {
      this.cards = cardArray
    } else {
      this.#fillDeck()
    }
  }

  #fillDeck = () => {
    // console.log('filling new deck with cards...')

    const suitIdMin = 0
    const suitIdMax = 4
    const rankIdMin = 2
    const rankIdMax = 15

    let deck = []

    for (let suit = suitIdMin; suit < suitIdMax; suit++) {
      for (let rank = rankIdMin; rank < rankIdMax; rank++) {
        this.cards.push(new Card(suit, rank))
      }
    }

    // console.log(`deck has been filled with ${this.size()} cards`)

    return deck
  }

  size = () => {
    return this.cards.length
  }

  list = () => {
    let display = ''

    this.cards.forEach(card => {
      display += card.show('short')
    })

    console.log(display)
  }

  addCard = (card) => {
    if (!this.#cardExists(card)) {
      this.cards.push(new Card(card.suit, card.rank))
    }
  }

  removeCard = (card) => {
    if (this.#cardExists(card)) {
      const vals = Object.values(this.cards)
      const index = vals.findIndex(v => v.rank == card.rank && v.suit == card.suit)

      // grab card we are removing
      const card = vals[index]

      // remove card from deck
      this.cards = this.cards.slice(0, index).concat(this.cards.slice(index + 1))

      // return removed card
      return card
    }
  }

  removeTop = () => {
    if (this.size()) {
      return this.cards.shift()
    } else {
      return null
    }
  }

  shuffle = (seed = null) => {
    let shuffleOrder

    // console.log(`shuffling deck, seed: ${seed}`)

    if (seed) {
      // deterministic random shuffle
      shuffleOrder = new Chance(seed)
    } else {
      // random random shuffle
      shuffleOrder = new Chance()
    }

    // set card order:
    // ♣2 -> ♣A, ♦2 -> ♦A, ♥2 - ♥A, ♠2 -> ♠A
    this.cards.sort(this.#suitRankCompareFn)

    // shuffle them deterministically using chance.js
    this.cards = shuffleOrder.shuffle(this.cards)
  }

  #suitRankCompareFn = (a, b) => {
    a.suit - b.suit || a.rank - b.rank
  }

  #cardExists = (card) => {
    const vals = Object.values(this.cards)

    if (
      vals.some(c => c.suit == card.suit) &&
      vals.some(c => c.rank == card.rank)
    ) {
      return true
    } else {
      return false
    }
  }
}
