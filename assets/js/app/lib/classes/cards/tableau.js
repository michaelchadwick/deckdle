/* functions for tableau */
/* global Deckdle, Card, TableauAction, UndoAction, DECKDLE_GOLF_COL_MAX, DECKDLE_GOLF_ROW_MAX */
/* eslint-disable no-unused-vars */

// two options for creation:
// 1. Deck object to create fresh Tableau
// 2. Card array that re-creates existing Tableau
class Tableau {
  constructor(cards, type = 'golf') {
    this.type = type
    this.cards = {}
    this.lastMove = null

    switch (this.type) {
      case 'golf':
      default: {
        for (let colId = 0; colId < DECKDLE_GOLF_COL_MAX; colId++) {
          this.cards[colId] = []

          for (let cardId = 0; cardId < DECKDLE_GOLF_ROW_MAX; cardId++) {
            let cardToAdd = null

            if (Deckdle._valType(cards) == 'Deck') {
              cardToAdd = cards.removeTop()
            } else {
              const srcCard = cards.cards[colId][cardId]

              cardToAdd = new Card(srcCard.suit, srcCard.rank, srcCard.active)
            }

            this.cards[colId][cardId] = cardToAdd
          }
        }

        break
      }
    }
  }

  size = (type = 'active') => {
    switch (type) {
      case 'all': {
        return Object.keys(this.cards).map((col) =>
          this.cards[col].reduce((acc, curVal) => acc + curVal, 0)
        )
      }

      case 'removed': {
        return Object.keys(this.cards)
          .map((col) => this.cards[col].filter((card) => !card.active).length)
          .reduce((acc, curVal) => acc + curVal, 0)
      }

      case 'valid': {
        return Object.keys(this.cards)
          .map((col) => this.cards[col].filter((card) => card.isValid).length)
          .reduce((acc, curVal) => acc + curVal, 0)
      }

      case 'active':
      default: {
        return Object.keys(this.cards)
          .map((col) => this.cards[col].filter((card) => card.active).length)
          .reduce((acc, curVal) => acc + curVal, 0)
      }
    }
  }

  list = () => {
    let display = []
    let colDisplay = ''

    Object.keys(this.cards).map((col) => {
      colDisplay = ''
      this.cards[col].map((card) => {
        if (card.isValid) {
          let color
          switch (card.suit) {
            case 1:
            case 2:
              color = 'red'
              break
            case 0:
            case 3:
              color = 'yellow'
              break
            default:
              color = 'white'
              break
          }
          if (card.active) {
            colDisplay += card.show()
          } else {
            colDisplay += card.show()
          }
        } else {
          if (card.active) {
            colDisplay += card.show()
          } else {
            colDisplay += card.show()
          }
        }
      })

      display.push(colDisplay)
    })

    return display.join(',')
  }

  getBottomCard = (col) => {
    return this.cards[col][this.cards[col].filter((card) => card.active).length - 1]
  }

  getBottomCardRow = (col) => {
    return this.cards[col].filter((card) => card.active).length - 1
  }

  getCardAtPos = (col, row) => {
    if (col > DECKDLE_GOLF_COL_MAX || row > DECKDLE_GOLF_ROW_MAX) {
      console.error(
        `ERROR - Can't PLAY Tableau card: column (${col}) or row (${row}) out of bounds`
      )

      return false
    }

    return this.cards[col][row]
  }

  getPosFromCard = (card) => {
    let pos = null

    Object.keys(this.cards).forEach((col) => {
      Object.keys(this.cards[col]).forEach((row) => {
        const cardToCheck = this.cards[col][row]

        if (cardToCheck.rank == card.rank && cardToCheck.suit == card.suit) {
          pos = { col, row }
        }
      })
    })

    return pos
  }

  getValidCards = () => {
    const validCards = []

    Object.keys(this.cards).map((col) => {
      this.cards[col].map((card, row) => {
        if (card.isValid) {
          validCards.push({ card, col, row })
        }
      })
    })

    return validCards
  }

  // choose column with largest combo
  getBestCol = (cols) => {
    const scores = []

    cols.forEach((col) => {
      if (!scores[col]) {
        scores.push({ id: col, score: 0 })
      }

      // if column only has one card, it gets one point
      if (this.cards[col].length == 1) {
        scores.filter((score) => score.id == col).score += 1
      }
      // otherwise, go through each card from the bottom
      // and count up how many combos there are (|j - (j - 1)| == 1)
      else {
        let j = this.cards[col].length - 1
        let noFirstCombo = false

        while (j > 0 && !noFirstCombo) {
          const cardFloor = parseInt(this.cards[col][j].rank)
          const cardAbove = parseInt(this.cards[col][j - 1].rank)
          const rankDiff = Math.abs(cardFloor - cardAbove)

          if (rankDiff == 1) {
            scores.filter((score) => score.id == col).score += 1
            j -= 1
          } else {
            noFirstCombo = true
          }
        }
      }
    })

    return scores.sort((a, b) => a.score - b.score)[0].id
  }

  // choose random column from list of valid columns
  getRandCol = (cols) => {
    return Math.floor(Math.random() * cols.length)
  }

  hasValidMove = () => {
    return this.size('valid') > 0
  }

  isValidCard = (card, base) => {
    switch (this.type) {
      case 'golf':
      default: {
        // if base is empty, nothing to compare to
        if (base.isEmpty()) {
          return false
        }

        // if card itself is not Active, return
        if (!card.active) {
          return false
        }

        // if card not bottom of column of active cards, return
        const pos = this.getPosFromCard(card)

        if (pos) {
          const activeCards = this.cards[pos.col].filter((card) => card.active)
          const bottomCard = activeCards[activeCards.length - 1]

          if (bottomCard) {
            if (!bottomCard.matches(card)) {
              // card not the bottom of column of active cards
              return false
            }
          } else {
            // column has no more cards
            return false
          }
        } else {
          // position of card is not valid
          return false
        }

        // check if base card can be played on
        const baseCard = base.topCard()
        const rankAbove = parseInt(baseCard.rank) + 1 == 15 ? 2 : parseInt(baseCard.rank) + 1
        const rankBelow = parseInt(baseCard.rank) - 1 == 1 ? 14 : parseInt(baseCard.rank) - 1

        return parseInt(card.rank) == rankAbove || parseInt(card.rank) == rankBelow
      }
    }
  }

  playCard = (col, row, base) => {
    switch (this.type) {
      case 'golf':
      default: {
        const potentialCard = this.cards[col][row]

        if (this.isValidCard(potentialCard, base)) {
          return this.#removeCard(potentialCard)
        } else {
          console.error(
            `ERROR: Tableau card can't be played: [${col}, ${row}] is an invalid position`
          )
          return null
        }
      }
    }
  }

  // GUI
  removeCard = (card) => {
    const tableau = Deckdle.__getState()['tableau']

    Object.keys(tableau).forEach((col) => {
      const bottomCard = tableau[col][tableau[col].filter((card) => card.active).length - 1]

      if (bottomCard) {
        if (bottomCard.rank == card.dataset.rank && bottomCard.suit == card.dataset.suit) {
          tableau[col][tableau[col].filter((card) => card.active).length - 1].active = false

          bottomCard.row = parseInt(card.dataset.row)
          bottomCard.col = parseInt(col)

          // tableau.lastMove = bottomCard
          // Deckdle.__setState('tableau', tableau)
          Deckdle._lastTableauMove = bottomCard
        }
      }
    })

    Deckdle._increaseCombo()

    Deckdle.dom.input.btnUndoMove.disabled = false

    Deckdle.__setState('tableau', tableau)
    Deckdle._saveGame('Tableau.removeCard')
  }

  // Code Model
  #removeCard = (card) => {
    let cardToRemove = null

    Object.keys(this.cards).forEach((col) => {
      const activeCards = this.cards[col].filter((card) => card.active)
      const bottomCard = activeCards[activeCards.length - 1]

      if (bottomCard) {
        if (bottomCard.matches(card)) {
          this.cards[col][activeCards.length - 1].active = false

          cardToRemove = bottomCard
        } else {
          return null
        }
      } else {
        return null
      }
    })

    return cardToRemove
  }

  // GUI
  undoLastMove = () => {
    if (this.lastMove) {
      const card = this.lastMove
      const tableauCards = Deckdle.__getState()['tableau']

      tableauCards[card.col][card.row].active = true
      Deckdle._removeCardFromBase(card)

      Deckdle.__addAction(new UndoAction())
      Deckdle.__setState('tableau', tableauCards)
      Deckdle._saveGame('Tableau.undoLastMove')
    }
  }
}

Deckdle._getTableauCardAtPos = (col, row) => {
  if (col > DECKDLE_GOLF_COL_MAX || row > DECKDLE_GOLF_ROW_MAX) {
    console.error(`ERROR - Can't PLAY Tableau card: column (${col}) or row (${row}) out of bounds`)

    return false
  }

  const tableau = Deckdle.__getState()['tableau']

  return tableau[col][row]
}

Deckdle._tableauCount = (cards = null) => {
  let tableau = null

  if (cards) {
    tableau = cards
  } else {
    tableau = Deckdle.__getState()['tableau']
  }

  let cardCount = 0

  Object.keys(tableau).forEach((col) => {
    const activeColCards = tableau[col].filter((card) => card.active)

    cardCount += activeColCards.length
  })

  return cardCount
}

Deckdle._tableauIsEmpty = () => {
  return Deckdle._tableauCount() == 0
}

Deckdle._tableauHasValidCard = (type = 'golf') => {
  let hasValid = false
  const tableau = Deckdle.__getState()['tableau']

  switch (type) {
    case 'golf':
    default: {
      Object.keys(tableau).forEach((col) => {
        if (tableau[col].filter((card) => card.active).length) {
          const row = tableau[col].filter((card) => card.active).length - 1

          if (Deckdle._tableauCardIsValid(tableau[col][row])) {
            hasValid = true
          }
        }
      })
    }
  }

  return hasValid
}

Deckdle._tableauCardIsValid = (card, type = 'golf') => {
  switch (type) {
    case 'golf':
    default: {
      const base = Deckdle.__getState()['base']

      if (!base.length) {
        return false
      }

      const baseCard = base[base.length - 1]
      const rankAbove = parseInt(baseCard.rank) + 1 == 15 ? 2 : parseInt(baseCard.rank) + 1
      const rankBelow = parseInt(baseCard.rank) - 1 == 1 ? 14 : parseInt(baseCard.rank) - 1

      if (parseInt(card.rank) == rankAbove || parseInt(card.rank) == rankBelow) {
        return true
      } else {
        return false
      }
    }
  }
}

Deckdle._removeCardFromTableau = (card) => {
  const tableau = Deckdle.__getState()['tableau']

  Object.keys(tableau).forEach((col) => {
    const bottomCard = tableau[col][tableau[col].filter((card) => card.active).length - 1]

    if (bottomCard) {
      if (bottomCard.rank == card.dataset.rank && bottomCard.suit == card.dataset.suit) {
        tableau[col][tableau[col].filter((card) => card.active).length - 1].active = false

        bottomCard.row = parseInt(card.dataset.row)
        bottomCard.col = parseInt(col)

        // tableau.lastMove = bottomCard
        // Deckdle.__setState('tableau', tableau)
        Deckdle._lastTableauMove = bottomCard
      }
    }
  })

  Deckdle._increaseCombo()

  Deckdle.dom.input.btnUndoMove.disabled = false

  Deckdle.__setState('tableau', tableau)
  Deckdle._saveGame('_removeCardFromTableau')
}

// undo last move from tableau to base
Deckdle._undoLastTableauMove = () => {
  const tableau = Deckdle.__getState()['tableau']

  // if (tableauCards.lastMove) {
  if (Deckdle._lastTableauMove) {
    // const card = tableau.lastMove
    const card = Deckdle._lastTableauMove

    tableau[card.col][card.row].active = true
    Deckdle._removeCardFromBase(card)

    Deckdle.__addAction(new UndoAction())
    Deckdle.__setState('tableau', tableau)
    Deckdle._saveGame('_undoLastTableauMove')
  }
}

Deckdle._onTableauClick = (card, colId, rowId) => {
  Deckdle._logStatus('Deckdle._onTableauClick')

  if (card.classList.contains('available')) {
    if (Deckdle._tableauCardIsValid(card.dataset)) {
      Deckdle._playSFX('click_tableau_valid')

      Deckdle._removeCardFromTableau(card)

      const cardRemoved = Deckdle.ui._removeCardFromTableau(colId)

      if (cardRemoved) {
        // only transfer 'available' class up the column if there are cards left
        if (rowId - 1 >= 0) {
          Deckdle.dom.interactive.tableau
            .querySelector(`#${colId} .card[data-row='${rowId - 1}']`)
            .classList.add('available')
        }

        const base = Deckdle.__getState()['base']
        const tableau = Deckdle.__getState()['tableau']

        base.push(new Card(cardRemoved.dataset.suit, cardRemoved.dataset.rank))

        Deckdle.ui._moveCardToBase('tableau')

        Deckdle.__addAction(new TableauAction(colId.substring(colId.length - 1), rowId), tableau)
        Deckdle.__setState('base', base)
        Deckdle._saveGame('_onTableauClick')

        Deckdle._checkWinState()
      } else {
        console.error('could not remove card from tableau')
      }
    } else {
      const cardSelector = `#tableau #${colId} .card[data-row="${rowId}"]`
      if (!document.querySelector(cardSelector).classList.contains('disabled')) {
        Deckdle._animateCSS(cardSelector, 'shakeX').then(() => {
          Deckdle._playSFX('click_tableau_invalid')
        })
      }
    }
  }
}
