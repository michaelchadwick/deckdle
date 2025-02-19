/* functions for tableau */
/* global Deckdle, Card, TableauAction, UndoAction */
/* eslint-disable no-unused-vars */

// TODO
class Tableau {
  constructor() {}

  count = (cards = null) => {
    let tableau = null

    if (cards) {
      tableau = cards
    } else {
      tableau = Deckdle.__getState()['tableau']
    }

    let cardCount = 0

    Object.keys(tableau).forEach((col) => {
      const activeColCards = tableau[col].filter((card) => card.status == 1)

      cardCount += activeColCards.length
    })

    return cardCount
  }

  isEmpty = () => {
    return this.count() == 0
  }

  hasValidCard = (type = 'golf') => {
    let hasValid = false
    const tableau = Deckdle.__getState()['tableau']

    switch (type) {
      case 'golf':
      default: {
        Object.keys(tableau).forEach((col) => {
          if (tableau[col].filter((card) => card.status == 1).length) {
            const row = tableau[col].filter((card) => card.status == 1).length - 1

            if (this.isValidCard(tableau[col][row])) {
              hasValid = true
            }
          }
        })
      }
    }

    return hasValid
  }

  isValidCard = (card, type = 'golf') => {
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

  removeCard = (card) => {
    const tableau = Deckdle.__getState()['tableau']

    Object.keys(tableau).forEach((col) => {
      const bottomCard = tableau[col][tableau[col].filter((card) => card.status == 1).length - 1]

      if (bottomCard) {
        if (bottomCard.rank == card.dataset.rank && bottomCard.suit == card.dataset.suit) {
          tableau[col][tableau[col].filter((card) => card.status == 1).length - 1].status = 0

          bottomCard.row = parseInt(card.dataset.row)
          bottomCard.col = parseInt(col)

          Deckdle._lastTableauMove = bottomCard
        }
      }
    })

    Deckdle._increaseCombo()

    Deckdle.dom.input.btnUndoMove.disabled = false

    Deckdle.__setState('tableau', tableau)
    Deckdle._saveGame()
  }

  undoLastMove = () => {
    if (Deckdle._lastTableauMove) {
      const card = Deckdle._lastTableauMove
      const tableauCards = Deckdle.__getState()['tableau']

      tableauCards[card.col][card.row].status = 1
      Deckdle._removeCardFromBase(card)

      Deckdle.__addAction(new UndoAction())
      Deckdle.__setState('tableau', tableauCards)
      Deckdle._saveGame()
    }
  }

  onClick = (card, colId, rowId) => {
    if (card.classList.contains('available')) {
      if (this.isValidCard(card.dataset)) {
        Deckdle._playSFX('click_tableau_valid')

        this.removeCard(card)

        const cardRemoved = Deckdle.ui._removeCardFromTableau(colId)

        if (cardRemoved) {
          // only transfer 'available' class up the column if there are cards left
          if (rowId - 1 >= 0) {
            Deckdle.dom.interactive.tableau
              .querySelector(`#${colId} .card[data-row='${rowId - 1}']`)
              .classList.add('available')
          }

          const base = Deckdle.__getState()['base']

          base.push(new Card(cardRemoved.dataset.suit, cardRemoved.dataset.rank))

          Deckdle.ui._moveCardToBase('tableau')

          Deckdle.__addAction(new TableauAction(colId.substring(colId.length - 1), rowId))
          Deckdle.__setState('base', base)
          Deckdle._saveGame()

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
    const activeColCards = tableau[col].filter((card) => card.status == 1)

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
        if (tableau[col].filter((card) => card.status == 1).length) {
          const row = tableau[col].filter((card) => card.status == 1).length - 1

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
    const bottomCard = tableau[col][tableau[col].filter((card) => card.status == 1).length - 1]

    if (bottomCard) {
      if (bottomCard.rank == card.dataset.rank && bottomCard.suit == card.dataset.suit) {
        tableau[col][tableau[col].filter((card) => card.status == 1).length - 1].status = 0

        bottomCard.row = parseInt(card.dataset.row)
        bottomCard.col = parseInt(col)

        Deckdle._lastTableauMove = bottomCard
      }
    }
  })

  Deckdle._increaseCombo()

  Deckdle.dom.input.btnUndoMove.disabled = false

  Deckdle.__setState('tableau', tableau)
  Deckdle._saveGame()
}

// undo last move from tableau to base
Deckdle._undoLastTableauMove = () => {
  if (Deckdle._lastTableauMove) {
    const card = Deckdle._lastTableauMove
    const tableauCards = Deckdle.__getState()['tableau']

    tableauCards[card.col][card.row].status = 1
    Deckdle._removeCardFromBase(card)

    Deckdle.__addAction(new UndoAction())
    Deckdle.__setState('tableau', tableauCards)
    Deckdle._saveGame()
  }
}

Deckdle._onTableauClick = (card, colId, rowId) => {
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

        base.push(new Card(cardRemoved.dataset.suit, cardRemoved.dataset.rank))

        Deckdle.ui._moveCardToBase('tableau')

        Deckdle.__addAction(new TableauAction(colId.substring(colId.length - 1), rowId))
        Deckdle.__setState('base', base)
        Deckdle._saveGame()

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
