/* functions that update the UI */
/* global Deckdle */
/* eslint-disable no-undef */

Deckdle.ui = {}

/* CREATION */

Deckdle.ui._createCard = (card, cardType, classes = [], tabIndex = null, draggable = false) => {
  const cardDiv = document.createElement('div')

  if (classes.length) {
    cardDiv.classList.add('card')
    cardDiv.classList.add(...classes)
  } else {
    cardDiv.classList.add('card')
  }

  card.disabled = false
  cardDiv.draggable = draggable
  cardDiv.dataset.rank = card.rank
  cardDiv.dataset.suit = card.suit
  cardDiv.dataset.status = card.status
  cardDiv.dataset.type = cardType

  if (tabIndex) {
    cardDiv.tabIndex = tabIndex
  }

  const rankTopDiv = document.createElement('div')
  rankTopDiv.classList.add('rank-top')

  const rankBotDiv = document.createElement('div')
  rankBotDiv.classList.add('rank-bot')

  const rankTopLeftDiv = document.createElement('div')
  rankTopLeftDiv.classList.add('rank', 'rank-top-left')
  rankTopLeftDiv.innerText = card.rankDisplay(card.rank)

  const rankTopRightDiv = document.createElement('div')
  rankTopRightDiv.classList.add('rank', 'rank-top-right')
  rankTopRightDiv.innerText = card.rankDisplay(card.rank)

  rankTopDiv.appendChild(rankTopLeftDiv)
  rankTopDiv.appendChild(rankTopRightDiv)

  cardDiv.appendChild(rankTopDiv)

  const suitDiv = document.createElement('div')
  suitDiv.classList.add('suit')
  suitDiv.innerText = card.suitDisplay(card.suit, (type = 'symbol'))

  cardDiv.appendChild(suitDiv)

  const rankBotLeftDiv = document.createElement('div')
  rankBotLeftDiv.classList.add('rank', 'rank-bot-left')
  rankBotLeftDiv.innerText = card.rankDisplay(card.rank)

  const rankBotRightDiv = document.createElement('div')
  rankBotRightDiv.classList.add('rank', 'rank-bot-right')
  rankBotRightDiv.innerText = card.rankDisplay(card.rank)

  rankBotDiv.appendChild(rankBotLeftDiv)
  rankBotDiv.appendChild(rankBotRightDiv)

  cardDiv.appendChild(rankBotDiv)

  return cardDiv
}
Deckdle.ui._createEmptyCard = () => {
  const cardDiv = document.createElement('div')
  cardDiv.classList.add('card', 'empty')

  return cardDiv
}

/* MOVEMENT */

Deckdle.ui._addCardToTableau = (card, colId) => {
  const row = document.getElementById(`col${colId}`).children.length
  card.dataset.row = row

  if (card.dataset.status == 0) {
    card.classList.add('removed')
    card.classList.remove('available')
  }

  document.getElementById(`col${colId}`).appendChild(card)
}
Deckdle.ui._removeCardFromTableau = (colId) => {
  // Deckdle._logStatus('[UI][CHANGING] removing card from tableau')

  const elem = `#tableau #${colId} .card.available`
  const card = Deckdle.dom.interactive.tableau.querySelector(elem)

  if (card) {
    Deckdle._animateCSS(elem, 'fadeOutDown').then(() => {
      card.classList.add('removed')
      card.classList.remove('available')
      card.dataset.status = 0
    })

    return card
  } else {
    console.error('could not get reference to card to remove')

    return false
  }
}

Deckdle.ui._addCardToStock = (card, animate = false) => {
  const newCard = Deckdle.ui._createCard(card, 'stock', ['back'])

  Deckdle.dom.interactive.stock.appendChild(newCard)

  if (animate) {
    Deckdle._animateCSS(`#stock .card:last-of-type`, 'flipInX')
  }
}
Deckdle.ui._removeCardFromStock = () => {
  const stock = Deckdle.dom.interactive.stock

  if (stock.lastElementChild.classList.contains('card')) {
    // Deckdle._animateCSS('#stock .card:last-of-type', 'fadeOutRight').then(() => {
    // stock.removeChild(stock.lastElementChild)
    // })
    stock.removeChild(stock.lastElementChild)

    Deckdle.dom.input.btnUndoMove.disabled = true
  }
}

Deckdle.ui._addCardToBase = (card) => {
  const newCard = Deckdle.ui._createCard(new Card(card.suit, card.rank), (cardType = 'base'))

  Deckdle.dom.interactive.base.appendChild(newCard)
}
Deckdle.ui._moveCardToBase = (source) => {
  // Deckdle._logStatus(`[UI][CHANGING] adding card to base from '${source}'`)

  const base = Deckdle.__getState()['base']
  const card = base[base.length - 1]

  Deckdle.ui._addCardToBase(card)

  // animate new card, depending on where it came from
  switch (source) {
    case 'stock':
      Deckdle._animateCSS(`#base .card:last-of-type`, 'slideInLeft')
      break

    case 'tableau':
      Deckdle._animateCSS(`#base .card:last-of-type`, 'slideInDown')
      break
  }

  Deckdle.ui._updateCardCounts()
}
Deckdle.ui._undoBaseMove = (card) => {
  // if card still remains in column
  // remove its availability
  if (
    Deckdle.dom.interactive.tableau.querySelector(
      `#col${card.col} .card[data-row="${card.row - 1}"]`
    )
  ) {
    Deckdle.dom.interactive.tableau
      .querySelector(`#col${card.col} .card[data-row="${card.row - 1}"]`)
      .classList.remove('available')
  }
  // make card moved back available
  Deckdle.dom.interactive.tableau
    .querySelector(`#col${card.col} .card[data-row="${card.row}"]`)
    .classList.remove('removed')
  Deckdle.dom.interactive.tableau
    .querySelector(`#col${card.col} .card[data-row="${card.row}"]`)
    .classList.add('available')
  Deckdle.dom.interactive.tableau.querySelector(
    `#col${card.col} .card[data-row="${card.row}"]`
  ).dataset.status = 1

  // disable button until next card is moved
  Deckdle.dom.input.btnUndoMove.disabled = true

  Deckdle.ui._resetComboCounter()
  Deckdle.ui._updateCardCounts()
}

/* CARD DEALING */

Deckdle.ui._emptyPlayingField = () => {
  // clear tableau, stock, base
  Deckdle.dom.interactive.tableau.replaceChildren()
  Deckdle.dom.interactive.stock.querySelectorAll('.card').forEach((card) => card.remove())
  Deckdle.dom.interactive.base.querySelectorAll('.card').forEach((card) => card.remove())
}
Deckdle.ui._dealCards = (animate = false) => {
  // Deckdle._logStatus('[UI][LOADING] fillCards()')

  // create <div id="tableau"><div class="col"> * 7</div>
  for (let i = 0; i < 7; i++) {
    const col = document.createElement('div')
    col.classList.add('col')
    col.id = `col${i}`
    Deckdle.dom.interactive.tableau.appendChild(col)
  }

  // fill tableau UI with cards
  const tableauCards = Deckdle.__getState()['tableau']
  let colId = 0
  Object.keys(tableauCards).forEach((col) => {
    Object.values(tableauCards[col]).forEach((card, index) => {
      const lastValidCardIndex = tableauCards[col].filter((card) => card.status == 1).length - 1
      const cardClasses = index == lastValidCardIndex ? ['available'] : []
      const newCard = Deckdle.ui._createCard(card, 'tableau', cardClasses, index ?? 0)

      Deckdle.ui._addCardToTableau(newCard, colId)

      if (animate) {
        const elem = `#tableau #col${colId} .card[data-row="${newCard.dataset.row}"]`

        document.querySelector(elem).classList.add('back')
        Deckdle._animateCSS(elem, 'fadeInDown').then(() => {
          document.querySelector(elem).classList.remove('back')
          Deckdle._animateCSS(elem, 'flipInY')
        })
      }
    })

    colId++
  })

  // fill stock UI with stock cards
  const stockCards = Deckdle.__getState()['stock']
  stockCards.forEach((card) => {
    Deckdle.ui._addCardToStock(card, animate)
  })

  // fill base UI with base cards
  const baseCards = Deckdle.__getState()['base']
  baseCards.forEach((card) => {
    Deckdle.ui._addCardToBase(card)
  })

  Deckdle.ui._updateCardCounts()
}

/* STATUS */

Deckdle.ui._updateDailyDetails = (index) => {
  Deckdle.dailyNumber = parseInt(index) + 1
  Deckdle.dom.dailyDetails.querySelector('.index').innerHTML = (parseInt(index) + 1).toString()
  Deckdle.dom.dailyDetails.querySelector('.day').innerHTML = Deckdle.__getTodaysDate()
}
Deckdle.ui._updateCardCounts = () => {
  Deckdle.dom.tableauCount.innerText = Deckdle._tableauCount()
  Deckdle.dom.stockCount.innerText = Deckdle.__getState()['stock'].length
  Deckdle.dom.baseCount.innerText = Deckdle.__getState()['base'].length
}
Deckdle.ui._updateGameType = () => {
  Deckdle.dom.gameType.innerText = Deckdle.__getState()['gameType']
}

/* COMBO */

Deckdle.ui._updateComboCounter = () => {
  const comboLevel = Deckdle.combo

  // need 'show' class via setting
  if (Deckdle.dom.combo.classList.contains('show')) {
    Deckdle.dom.combo.classList.remove('animate_animated')

    if (comboLevel > 1) {
      Deckdle.dom.combo.classList.add('x')

      Deckdle.dom.comboText.innerText = `x${Deckdle.combo}`
      if (comboLevel <= 35) {
        Deckdle.dom.combo.classList.add(`x${comboLevel}`)
      }
      if (Deckdle.dom.combo.classList.contains('animate__fadeOut')) {
        Deckdle.dom.combo.classList.remove('animate__fadeOut')
      }

      if (!Deckdle.dom.combo.classList.contains('animate__backInUp')) {
        Deckdle._animateCSS('#combo', 'backInUp').then(() => {
          if (!Deckdle.dom.combo.classList.contains('animate__fadeOut')) {
            Deckdle._animateCSS('#combo', 'fadeOut')
          }
        })
      }
    } else if (comboLevel == 0) {
      Deckdle.dom.comboText.innerText = ':-('

      Deckdle._animateCSS('#combo', 'hinge').then(() => {
        Deckdle.ui._resetComboCounter()
      })
    }
  }
}
Deckdle.ui._resetComboCounter = () => {
  Deckdle.dom.combo.classList.remove('x', 'x2', 'x5', 'x10', 'x15', 'x30', 'x35')
}

/* HELPERS */

Deckdle.ui._removeModalVestige = () => {
  const dialog = document.getElementsByClassName('modal-dialog')[0]

  if (dialog) {
    dialog.remove()
  }

  if (Deckdle.myModal) {
    Deckdle.myModal._destroyModal()
  }
}
Deckdle.ui._disableUI = () => {
  if (!Deckdle.dom.gameContainer.classList.contains('disabled')) {
    Deckdle._logStatus('[UI] disabling')

    setTimeout(() => Deckdle.dom.cardsContainer.classList.remove('disabled'), 0)
    setTimeout(() => Deckdle.dom.cardsContainer.classList.add('disabled'), 5)

    const tableauCardArray = Array.from(Deckdle.dom.interactive.tableau.querySelectorAll('.card'))

    tableauCardArray.forEach((card) => {
      setTimeout(() => card.classList.remove('disabled'), 0)
      setTimeout(() => card.classList.add('disabled'), 5)
      card.setAttribute('disabled', true)
    })

    setTimeout(() => Deckdle.dom.userCards.classList.remove('disabled'), 0)
    setTimeout(() => Deckdle.dom.userCards.classList.add('disabled'), 5)

    const stockCardTop = Deckdle.dom.interactive.stock.querySelector('.card:last-of-type')

    setTimeout(() => stockCardTop.classList.remove('disabled'), 0)
    setTimeout(() => stockCardTop.classList.add('disabled'), 5)
    stockCardTop.setAttribute('disabled', true)

    const baseCardTop = Deckdle.dom.interactive.base.querySelector('.card:last-of-type')

    setTimeout(() => baseCardTop.classList.remove('disabled'), 0)
    setTimeout(() => baseCardTop.classList.add('disabled'), 5)
    baseCardTop.setAttribute('disabled', true)

    Deckdle.dom.input.btnUndoMove.disabled = true

    Deckdle.dom.gameContainer.classList.add('disabled')
  }
}
Deckdle.ui._enableUI = (replay = false) => {
  if (Deckdle.dom.gameContainer.classList.contains('disabled')) {
    Deckdle._logStatus('[UI] enabling')

    Deckdle.dom.cardsContainer.classList.remove('disabled')
    Deckdle.dom.userCards.classList.remove('disabled')

    const tableauCardArray = Array.from(Deckdle.dom.interactive.tableau.querySelectorAll('.card'))

    tableauCardArray.forEach((card) => {
      card.classList.remove('disabled')
      card.setAttribute('disabled', false)
    })

    const stockCardTop = Deckdle.dom.interactive.stock.querySelector('.card:last-of-type')

    stockCardTop.classList.remove('disabled')
    stockCardTop.setAttribute('disabled', false)

    const baseCardTop = Deckdle.dom.interactive.base.querySelector('.card:last-of-type')

    baseCardTop.classList.remove('disabled')
    baseCardTop.setAttribute('disabled', false)

    Deckdle.dom.gameContainer.classList.remove('disabled')

    if (replay) {
      document.body.classList.add('replay-mode')
      Deckdle.ui._disableModeSwitcher()
    }
  }
}
Deckdle.ui._disableModeSwitcher = () => {
  const gameMode = Deckdle.__getGameMode()

  if (gameMode == 'daily') {
    Deckdle.dom.interactive.gameModeFreeLink.onclick = ''
    Deckdle.dom.interactive.gameModeFreeLink.classList.add('disabled')
    Deckdle.dom.interactive.gameModeFreeLink.disabled = true
  } else {
    Deckdle.dom.interactive.gameModeDailyLink.onclick = ''
    Deckdle.dom.interactive.gameModeDailyLink.classList.add('disabled')
    Deckdle.dom.interactive.gameModeDailyLink.disabled = true
  }
}

Deckdle._logStatus('[LOADED] /app/ui')
