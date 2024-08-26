/* lib/ui */
/* functions that update the UI */
/* global Deckdle */

Deckdle.ui = {}

Deckdle.ui._createCard = (card, cardType, classes = [], draggable = false) => {
  const cardDiv = document.createElement('div')

  if (classes.length) {
    cardDiv.classList.add('card')
    cardDiv.classList.add(...classes)
  } else {
    cardDiv.classList.add('card')
  }
  cardDiv.draggable = draggable
  cardDiv.dataset.rank = card.rank
  cardDiv.dataset.suit = card.suit
  cardDiv.dataset.status = card.status
  cardDiv.dataset.type = cardType

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

Deckdle.ui._addCardToStock = function (card, animate = false) {
  const newCard = Deckdle.ui._createCard(card, 'stock', ['back'])

  Deckdle.dom.interactive.stock.appendChild(newCard)

  if (animate) {
    Deckdle._animateCSS(`#stock .card:last-of-type`, 'flipInX')
  }
}
Deckdle.ui._removeCardFromStock = () => {
  // Deckdle._logStatus('[UI][CHANGING] removing card from stock')

  const stock = Deckdle.dom.interactive.stock

  if (stock.lastElementChild.classList.contains('card')) {
    // Deckdle._animateCSS('#stock .card:last-of-type', 'fadeOutRight').then(() => {
      // stock.removeChild(stock.lastElementChild)
    // })
    stock.removeChild(stock.lastElementChild)
  }
}

Deckdle.ui._addCardToBase = (card) => {
  const newCard = Deckdle.ui._createCard(
    new Card(card.suit, card.rank),
    (cardType = 'base'),
  )

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
}

Deckdle.ui._updateStockBaseCounts = () => {
  Deckdle.dom.stockCount.innerText = Deckdle.__getState()['stock'].length
  Deckdle.dom.baseCount.innerText = Deckdle.__getState()['base'].length
}

Deckdle.ui._updateGameType = () => {
  Deckdle.dom.gameType.innerText = Deckdle.__getState()['gameType']
}

Deckdle.ui._emptyPlayingField = function () {
  // clear tableau, stock, base
  Deckdle.dom.interactive.tableau.replaceChildren()
  Deckdle.dom.interactive.stock.querySelectorAll('.card').forEach(card => card.remove())
  Deckdle.dom.interactive.base.querySelectorAll('.card').forEach(card => card.remove())
}

Deckdle.ui._fillCards = function (animate = false) {
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
  Object.keys(tableauCards).forEach(col => {
    Object.values(tableauCards[col]).forEach((card, index) => {
      const lastValidCardIndex = tableauCards[col].filter(card => card.status == 1).length - 1
      const cardClasses = index == lastValidCardIndex ? ['available'] : []
      const newCard = Deckdle.ui._createCard(card, 'tableau', cardClasses)

      Deckdle.ui._addCardToTableau(newCard, colId)

      if (animate) {
        Deckdle._animateCSS(`#tableau #col${colId} .card[data-row="${newCard.dataset.row}"]`, 'slideInDown')
      }
    })

    colId++
  })
  Deckdle.dom.tableauCount.innerText = Deckdle._tableauCount()

  // fill stock UI with stock cards
  const stockCards = Deckdle.__getState()['stock']
  stockCards.forEach(card => {
    Deckdle.ui._addCardToStock(card, animate)
  })

  // fill base UI with base cards
  const baseCards = Deckdle.__getState()['base']
  baseCards.forEach(card => {
    Deckdle.ui._addCardToBase(card)
  })

  Deckdle.ui._updateStockBaseCounts()
}

Deckdle.ui._updateDailyDetails = function (index) {
  Deckdle.dailyNumber = parseInt(index) + 1
  Deckdle.dom.dailyDetails.querySelector('.index').innerHTML = (
    parseInt(index) + 1
  ).toString()
  Deckdle.dom.dailyDetails.querySelector('.day').innerHTML =
    Deckdle.__getTodaysDate()
}

Deckdle.ui._updateComboCounter = function () {
  const comboLevel = Deckdle.combo

  // need 'show' class via setting
  if (Deckdle.dom.combo.classList.contains('show')) {
    Deckdle.dom.combo.classList.remove('animate_animated')

    if (comboLevel > 1) {
      Deckdle.dom.comboText.classList.add('x')

      Deckdle.dom.comboText.innerText = `x${Deckdle.combo}`
      if (comboLevel <= 10) {
        Deckdle.dom.comboText.classList.add(`x${comboLevel}`)
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

Deckdle.ui._resetComboCounter = function () {
  Deckdle.dom.comboText.classList.remove('x', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8', 'x9', 'x10')
}