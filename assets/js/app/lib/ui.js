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

Deckdle.ui._addCardToTableau = (card, colId, classes = []) => {
  // console.log('adding card to UI tableau', card, colId)

  const newCard = Deckdle.ui._createCard(card, 'tableau', classes)

  const row = document.getElementById(`col${colId}`).children.length
  newCard.dataset.row = row

  document.getElementById(`col${colId}`).appendChild(newCard)
}

Deckdle.ui._removeCardFromTableau = (colId) => {
  const card = Deckdle.dom.interactive.tableau.querySelector(`#${colId} .card.available`)

  // console.log('card to remove from tableau', card)

  if (card) {
    // card.remove()
    card.classList.add('removed')
    card.classList.remove('available')

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
  const newCard = Deckdle.ui._createCard(new Card(card.suit, card.rank), 'base')

  Deckdle.dom.interactive.base.appendChild(newCard)
}

Deckdle.ui._updateStockBaseCounts = () => {
  Deckdle.dom.stockCount.innerText = Deckdle.__getState()['stock'].length
  Deckdle.dom.baseCount.innerText = Deckdle.__getState()['base'].length
}

Deckdle.ui._updateGameType = () => {
  Deckdle.dom.gameType.innerText = Deckdle.__getState()['gameType']
}