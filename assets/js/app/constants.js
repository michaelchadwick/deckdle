/* constants */
/* set any global app constants */
/* eslint-disable no-unused-vars */

const NEBYOOAPPS_SOURCE_URL = 'https://dave.neb.host/?sites'
const DECKDLE_SHARE_URL = 'https://deckdle.neb.host/?r=share'

const DECKDLE_ENV_PROD_URL = ['deckdle.fun', 'deckdle.neb.host']

const DECKDLE_STATE_DAILY_LS_KEY = 'deckdle-state-daily'
const DECKDLE_STATE_FREE_LS_KEY = 'deckdle-state-free'
const DECKDLE_SETTINGS_LS_KEY = 'deckdle-settings'

const DECKDLE_DAILY_SCRIPT = '/assets/scripts/daily.php'

const DECKDLE_DEFAULT_GAMETYPE = 'golf'

const DECKDLE_DEFAULT_CONFIG = {
  synthBGM: null,
  synthSFX: null,
}
const DECKDLE_DEFAULT_STATE = {
  base: [],
  gameState: 'IN_PROGRESS',
  gameType: 'golf',
  gameWon: false,
  lastCompletedTime: null,
  lastPlayedTime: null,
  setupId: null,
  stock: [],
  tableau: {}
}
const DECKDLE_DEFAULT_SETTINGS = {
  darkMode: false,
  firstTime: true,
  gameMode: 'free',
  noisy: false,
  soundBGMLevel: 0.1,
  soundSFXLevel: 0.2,
}

const DECKDLE_DEFAULTS = {
  config: {
    daily: { ...DECKDLE_DEFAULT_CONFIG },
    free: { ...DECKDLE_DEFAULT_CONFIG },
  },
  state: {
    daily: [{ ...DECKDLE_DEFAULT_STATE }],
    free: [{ ...DECKDLE_DEFAULT_STATE }],
  },
  settings: DECKDLE_DEFAULT_SETTINGS,
}
