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
  // console.log('adding card to UI tableau', card, colId)

  const row = document.getElementById(`col${colId}`).children.length
  card.dataset.row = row

  document.getElementById(`col${colId}`).appendChild(card)
}

Deckdle.ui._removeCardFromTableau = (colId) => {
  const elem = `#tableau #${colId} .card.available`
  const card = Deckdle.dom.interactive.tableau.querySelector(elem)

  if (card) {
    Deckdle._animateCSS(elem, 'fadeOutDown').then(() => {
      card.classList.add('removed')
      card.classList.remove('available')
    })

    return card
  } else {
    console.error('could not get reference to card to remove')

    return false
  }
}

Deckdle.ui._addCardToStock = (card) => {
  const newCard = Deckdle.ui._createCard(card, 'stock', ['back'])

  Deckdle.dom.interactive.stock.appendChild(newCard)
}

Deckdle.ui._removeCardFromStock = () => {
  const stock = Deckdle.dom.interactive.stock
  if (stock.lastElementChild.classList.contains('card')) {
    stock.removeChild(stock.lastElementChild)
  }
}

Deckdle.ui._addCardToBase = () => {
  const base = Deckdle.__getState()['base']
  const card = base[base.length - 1]
  const newCard = Deckdle.ui._createCard(
    new Card(card.suit, card.rank),
    (cardType = 'base'),
  )

  Deckdle.dom.interactive.base.appendChild(newCard)

  Deckdle._animateCSS(`#base .card:last-of-type`, 'slideInDown')
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

Deckdle.ui._fillCards = function () {
  // create <div id="tableau"><div class="col"> * 7</div>
  for (let i = 0; i < 7; i++) {
    const col = document.createElement('div')
    col.classList.add('col')
    col.id = `col${i}`
    Deckdle.dom.interactive.tableau.appendChild(col)
  }

  const tableauCards = Deckdle.__getState()['tableau']

  let colId = 0

  // fill tableau UI with cards
  Object.keys(tableauCards).forEach(col => {
    Object.values(tableauCards[col]).forEach((card, index) => {
      const cardClasses = index == 4 ? ['available'] : []
      const newCard = Deckdle.ui._createCard(card, 'tableau', cardClasses)

      Deckdle.ui._addCardToTableau(newCard, colId)

      Deckdle._animateCSS(`#tableau #col${colId} .card[data-row="${newCard.dataset.row}"]`, 'slideInDown')
    })

    colId++
  })

  Deckdle.dom.tableauCount.innerText = Deckdle._tableauCount()

  // fill stock UI with leftover cards
  Deckdle.__getState()['stock'].forEach(card => {
    Deckdle.ui._addCardToStock(card)
  })

  Deckdle._moveCardFromStockToBase()

  Deckdle.dom.stockCount.innerText = Deckdle.__getState()['stock'].length
  Deckdle.dom.baseCount.innerText = Deckdle.__getState()['base'].length
}