/* app/dom.js */
/* grab references to dom elements */
/* global Deckdle */

// DOM > main divs/elements
Deckdle.dom = {
  navOverlay: document.getElementById('nav-overlay'),
  navContent: document.getElementById('nav-content'),
  dailyDetails: document.getElementById('daily-details'),
  gameType: document.getElementById('game-type'),
  board: document.getElementById('board'),
  tableauCount: document.querySelector('#tableau-count .count'),
  stockCount: document.querySelector('#stock .count'),
  baseCount: document.querySelector('#base .count'),
  combo: document.getElementById('combo'),
  comboText: document.querySelector('#combo .text')
}

// DOM > interactive elements
Deckdle.dom.interactive = {
  btnNav: document.getElementById('button-nav'),
  btnNavClose: document.getElementById('button-nav-close'),
  btnHelp: document.getElementById('button-help'),
  btnStats: document.getElementById('button-stats'),
  btnSettings: document.getElementById('button-settings'),
  gameModeDailyLink: document.getElementById('gamemode-0'),
  gameModeFreeLink: document.getElementById('gamemode-1'),
  cards: document.getElementsByClassName('card'),
  tableau: document.getElementById('tableau'),
  stock: document.getElementById('stock'),
  base: document.getElementById('base'),
}
// DOM > keyboard buttons
Deckdle.dom.keyboard = {
  btnCreateNew: document.getElementById('button-create-new'),
}
// DOM > interactive elements (debug)
Deckdle.dom.interactive.debug = {
  all: document.getElementById('debug-buttons'),
  btnResetProgress: document.getElementById('button-reset-progress'),
  btnShowConfig: document.getElementById('button-show-config'),
  btnShowState: document.getElementById('button-show-state'),
  btnClearLS: document.getElementById('button-clear-ls'),
  btnClearCards: document.getElementById('button-clear-cards'),
  btnDealCards: document.getElementById('button-deal-cards'),
  btnWinAnimation: document.getElementById('button-win-animation'),
  btnLoseAnimation: document.getElementById('button-lose-animation'),
}

Deckdle._logStatus('[LOADED] /app/dom')
