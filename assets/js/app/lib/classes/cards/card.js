/* class definition for Card */
/* eslint-disable no-unused-vars */

class Card {
  constructor(suit = 3, rank = 1, active = true) {
    this.suit = suit
    this.rank = rank
    this.active = active // exists in tableau (false == removed because taken)
  }

  show = (type = null) => {
    let display

    switch (type) {
      case 'long':
        display = {
          rank: this.rankDisplay(this.rank),
          suit: this.suitDisplay(this.suit),
        }

        return `${display.rank} of ${display.suit}`

      case 'short':
      default:
        display = {
          rank: this.rankDisplay(this.rank),
          suit: this.suitDisplay(this.suit, (type = 'symbol')),
        }

        return `${display.rank}${display.suit}`
    }
  }

  matches = (card) => {
    return this.rank == card.rank && this.suit == card.suit
  }

  rankDisplay = (rank) => {
    switch (parseInt(rank)) {
      case 2:
        return 2
      case 3:
        return 3
      case 4:
        return 4
      case 5:
        return 5
      case 6:
        return 6
      case 7:
        return 7
      case 8:
        return 8
      case 9:
        return 9
      case 10:
        return 10
      case 11:
        return 'J'
      case 12:
        return 'Q'
      case 13:
        return 'K'
      case 14:
        return 'A'
    }
  }

  suitDisplay = (suit, type = 'symbol') => {
    if (type == 'symbol') {
      switch (parseInt(suit)) {
        case 0:
          return '♣'
        case 1:
          return '♦'
        case 2:
          return '♥'
        case 3:
          return '♠'
      }
    } else {
      switch (parseInt(suit)) {
        case 0:
          return 'clubs'
        case 1:
          return 'diamonds'
        case 2:
          return 'hearts'
        case 3:
          return 'spades'
      }
    }
  }
}
