/* class definition for Deck of Cards */
/* global Card, Chance */
/* eslint-disable no-unused-vars */

class Deck {
  constructor(initialShuffle = false, setupId = null) {
    this.cards = []

    this.#fillDeck()

    if (initialShuffle && setupId) {
      this.shuffle(setupId)
    }
  }

  size = () => {
    return this.cards.length
  }

  list = () => {
    let display = ''

    this.cards.forEach((card) => {
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
      const index = vals.findIndex((v) => v.rank == card.rank && v.suit == card.suit)

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

    // shuffle them using chance.js
    this.cards = shuffleOrder.shuffle(this.cards)
  }

  hasValidMove = (type = 'golf') => {
    let hasValid = false

    switch (type) {
      case 'golf':
      default: {
        let validTableauCards = []

        // grab bottom cards from what would be each tableau column
        validTableauCards.push(this.cards[4])
        validTableauCards.push(this.cards[9])
        validTableauCards.push(this.cards[14])
        validTableauCards.push(this.cards[19])
        validTableauCards.push(this.cards[24])
        validTableauCards.push(this.cards[29])
        validTableauCards.push(this.cards[34])

        // grab last card in deck, which would be top of stock
        const targetCard = this.cards[this.cards.length - 1]

        validTableauCards.forEach((card) => {
          const rankAbove = parseInt(targetCard.rank) + 1 == 15 ? 2 : parseInt(targetCard.rank) + 1
          const rankBelow = parseInt(targetCard.rank) - 1 == 1 ? 14 : parseInt(targetCard.rank) - 1

          if (parseInt(card.rank) == rankAbove || parseInt(card.rank) == rankBelow) {
            hasValid = true
          }
        })
      }
    }

    return hasValid
  }

  #fillDeck = () => {
    const suitIdMin = 0
    const suitIdMax = 4
    const rankIdMin = 2
    const rankIdMax = 15

    let deck = []

    for (let suit = suitIdMin; suit < suitIdMax; suit++) {
      for (let rank = rankIdMin; rank < rankIdMax; rank++) {
        this.cards.push(new Card(suit, rank, 1))
      }
    }

    return deck
  }

  #suitRankCompareFn = (a, b) => {
    a.suit - b.suit || a.rank - b.rank
  }

  #cardExists = (card) => {
    const vals = Object.values(this.cards)

    if (vals.some((c) => c.suit == card.suit) && vals.some((c) => c.rank == card.rank)) {
      return true
    } else {
      return false
    }
  }
}
