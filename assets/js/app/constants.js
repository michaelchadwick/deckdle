/* constant values */
/* eslint-disable no-unused-vars */

const NEBYOOAPPS_SOURCE_URL = 'https://dave.neb.host/?sites'

const DECKDLE_STATE_DAILY_LS_KEY = 'deckdle-state-daily'
const DECKDLE_STATE_FREE_LS_KEY = 'deckdle-state-free'
const DECKDLE_SETTINGS_LS_KEY = 'deckdle-settings'

const DECKDLE_DAILY_SCRIPT = '/assets/php/daily.php'

const DECKDLE_SHARE_URL = `${document.location.origin}/?r=share`

const DECKDLE_GOLF_ROW_MAX = 5
const DECKDLE_GOLF_COL_MAX = 7
const DECKDLE_GOLF_BIRD_MAX = 10

const DECKDLE_KLONDIKE_ROW_MAX = 7
const DECKDLE_KLONDIKE_COL_MAX = 7

const DECKDLE_DEFAULT_GAMEMODE = 'daily'
const DECKDLE_DEFAULT_GAMETYPE = 'golf'

const DECKDLE_DEFAULT_CONFIG = {
  synthBGM: null,
  synthSFX: null,
}
const DECKDLE_DEFAULT_STATE = {
  actions: [],
  base: [],
  comboCurrent: 0,
  comboCurrentMax: 0,
  comboMax: 0,
  gameState: 'IN_PROGRESS',
  gameType: DECKDLE_DEFAULT_GAMETYPE,
  lastCompletedTime: null,
  lastPlayedTime: null,
  sessionIndex: 0,
  setupId: null,
  stock: [],
  tableau: {},
}
const DECKDLE_DEFAULT_SETTINGS = {
  animationDisplay: true,
  comboCounter: true,
  darkMode: false,
  firstTime: true,
  gameMode: DECKDLE_DEFAULT_GAMEMODE,
  noisy: false,
  replayMode: false,
  soundBGMLevel: 0.1,
  soundSFXLevel: 0.2,
}

const DECKDLE_DEFAULTS = {
  config: { ...DECKDLE_DEFAULT_CONFIG },
  state: {
    daily: [JSON.parse(JSON.stringify(DECKDLE_DEFAULT_STATE))],
    free: [JSON.parse(JSON.stringify(DECKDLE_DEFAULT_STATE))],
  },
  settings: DECKDLE_DEFAULT_SETTINGS,
}

const DECKDLE_SCORE_TO_BIRD = {
  1: 'Birdie',
  2: 'Eagle',
  3: 'Albatross',
  4: 'Condor',
  5: 'Ostrich',
  6: 'Phoenix',
  7: 'Robin',
  8: 'Swan',
  9: 'Roc',
}
