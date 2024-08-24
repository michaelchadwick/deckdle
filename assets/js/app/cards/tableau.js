/* lib/cards/tableau.js */
/* functions for tableau */

Deckdle._tableauCount = () => {
  const tableau = Deckdle.__getState()['tableau']
  let cardCount = 0

  Object.keys(tableau).forEach((col) => {
    tableau[col].forEach((card) => {
      if (card.status == 1) {
        cardCount++
      }
    })
  })

  return cardCount
}

Deckdle._tableauIsEmpty = () => {
  return Deckdle._tableauCount() == 0
}

Deckdle._tableauHasValidCard = () => {
  const tableau = Deckdle.__getState()['tableau']
  let hasValid = false

  Object.keys(tableau).forEach((col) => {
    if (tableau[col].length) {
      if (Deckdle._tableauCardCanBeRemoved(tableau[col][tableau[col].length - 1])) {
        hasValid = true
      }
    }
  })

  return hasValid
}

Deckdle._tableauCardCanBeRemoved = (card) => {
  // console.log('_tableauCardCanBeRemoved', card)

  const base = Deckdle.__getState()['base']

  if (!base.length) {
    return false
  }

  const baseCard = base[base.length - 1]
  const rankAbove = parseInt(baseCard.rank) + 1 == 15 ? 2 : parseInt(baseCard.rank) + 1
  const rankBelow = parseInt(baseCard.rank) - 1 == 1 ? 14 : parseInt(baseCard.rank) - 1

  if (
    parseInt(card.rank) == rankAbove ||
    parseInt(card.rank) == rankBelow
  ) {
    return true
  } else {
    return false
  }
}

Deckdle._removeCardFromTableau = (card) => {
  const tableau = Deckdle.__getState()['tableau']
  let cardRemoved = null

  Object.keys(tableau).forEach((col) => {
    const bottomCard = tableau[col][tableau[col].length - 1]

    if (bottomCard) {
      if (
        bottomCard.rank == card.dataset.rank &&
        bottomCard.suit == card.dataset.suit
      ) {
        // console.log('removing tableau card', col, tableau[col].length - 1)

        // dont actually remove the card from the tableau
        // just set its status to 0
        // cardRemoved = tableau[col].splice(tableau[col].length - 1, 1)
        tableau[col][tableau[col].length - 1].status = 0
      }
    }
  })

  Deckdle.__setState('tableau', tableau)

  Deckdle.dom.tableauCount.innerText = Deckdle._tableauCount()
}

Deckdle._onTableauClick = (card, colId, rowId) => {
  // console.log('tableau card clicked', card, colId, rowId)

  if (card.classList.contains('available')) {
    if (Deckdle._tableauCardCanBeRemoved(card.dataset)) {
      Deckdle._playSFX('click_tableau')

      Deckdle._removeCardFromTableau(card)

      const cardRemoved = Deckdle.ui._removeCardFromTableau(colId)

      if (cardRemoved) {
        // only transfer 'available' class up the column if there are cards left
        if (rowId - 1 >= 0) {
          Deckdle.dom.interactive.tableau.querySelector(`#${colId} .card[data-row='${rowId - 1}']`).classList.add('available')
        }

        const base = Deckdle.__getState()['base']

        base.push(new Card(cardRemoved.dataset.suit, cardRemoved.dataset.rank))

        Deckdle.ui._moveCardToBase(source = 'tableau')

        Deckdle.__setState('base', base)

        Deckdle._checkWinState()
      } else {
        console.error('could not remove card from tableau')
      }
    }
  }
}