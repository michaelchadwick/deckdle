/* lib/constants/specific */
/* global specific constants */
/* eslint-disable no-unused-vars */

const DECKDLE_GOLF_ROW_MAX = 5
const DECKDLE_GOLF_COL_MAX = 7

const DECKDLE_KLONDIKE_ROW_MAX = 7
const DECKDLE_KLONDIKE_COL_MAX = 7

const DECKDLE_DEFAULT_GAMEMODE = 'daily'
const DECKDLE_DEFAULT_GAMETYPE = 'golf'

const DECKDLE_DEFAULT_CONFIG = {
  synthBGM: null,
  synthSFX: null,
}
const DECKDLE_DEFAULT_STATE = {
  base: [],
  gameState: 'IN_PROGRESS',
  gameType: DECKDLE_DEFAULT_GAMETYPE,
  gameWon: false,
  lastCompletedTime: null,
  lastPlayedTime: null,
  setupId: null,
  stock: [],
  tableau: {}
}
const DECKDLE_DEFAULT_SETTINGS = {
  comboCounter: false,
  darkMode: false,
  firstTime: true,
  gameMode: DECKDLE_DEFAULT_GAMEMODE,
  noisy: false,
  soundBGMLevel: 0.1,
  soundSFXLevel: 0.2,
}

const DECKDLE_DEFAULTS = {
  config: { ...DECKDLE_DEFAULT_CONFIG },
  state: {
    daily: [{ ...DECKDLE_DEFAULT_STATE }],
    free: [{ ...DECKDLE_DEFAULT_STATE }],
  },
  settings: DECKDLE_DEFAULT_SETTINGS,
}