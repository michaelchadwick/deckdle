// Deckdle object init
if (typeof Deckdle === 'undefined') var Deckdle = {}

const DECKDLE_ENV_PROD_URL = ['deckdle.fun', 'deckdle.neb.host']

Deckdle.env = DECKDLE_ENV_PROD_URL.includes(document.location.hostname) ? 'prod' : 'local'
const DECKDLE_SHARE_URL = `${document.location.origin}/?r=share`

Deckdle._logStatus = function (msg, arg = null) {
  if (Deckdle.env == 'local') {
    if (arg) {
      console.log(msg, arg)
    } else {
      console.log(msg)
    }
  }
}

Deckdle._logStatus('[LOADED] /Deckdle')
