/* grab references to dom elements */
/* global Deckdle */

// DOM > main divs/elements
Deckdle.dom = {
  gameContainer: document.getElementById('game'),
  navOverlay: document.getElementById('nav-overlay'),
  navContent: document.getElementById('nav-content'),
  headerTitle: document.querySelector('header h1'),
  dailyDetails: document.getElementById('daily-details'),
  gameType: document.getElementById('game-type-title'),
  gameMaxCombo: document.getElementById('game-max-combo'),
  board: document.getElementById('board'),
  cardsContainer: document.getElementById('cards-container'),
  tableauCount: document.querySelector('#tableau-count .count'),
  userCards: document.getElementById('user-cards'),
  stockCount: document.querySelector('#stock .count'),
  baseCount: document.querySelector('#base .count'),
  combo: document.getElementById('combo'),
  comboText: document.querySelector('#combo .text'),
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
  btnComboIncrease: document.getElementById('button-combo-increase'),
  btnComboDecrease: document.getElementById('button-combo-decrease'),
  btnGetBotScore: document.getElementById('button-get-bot-score'),
}
// DOM > interactive elements (debug-gameover)
Deckdle.dom.interactive.debugGameover = {
  all: document.getElementById('debug-buttons-gameover'),
  btnDebugGameOverOver: document.getElementById('button-debug-gameover-over'),
  btnDebugGameOverPar: document.getElementById('button-debug-gameover-par'),
  btnDebugGameOverUnder: document.getElementById('button-debug-gameover-under'),
  btnDebugGameOverMatchBot: document.getElementById('button-debug-gameover-matchbot'),
  btnDebugGameOverBeatBot: document.getElementById('button-debug-gameover-beatbot'),
}
// DOM > keyboard buttons
Deckdle.dom.input = {
  btnCreateNew: document.getElementById('button-create-new'),
  btnUndoMove: document.getElementById('button-undo-move'),
}

Deckdle._logStatus('[LOADED] /app/dom')
