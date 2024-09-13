/* lib/misc/debug */
/* debug functions */
/* global Deckdle */
/* eslint-disable no-undef */

// add debug stuff if local
Deckdle._initDebug = function () {
  // if debug buttons are in template
  if (Deckdle.dom.interactive.debug.all) {
    // show debug buttons
    Deckdle.dom.interactive.debug.all.style.display = 'flex'
    // make header buttons smaller to fit in debug buttons
    document.querySelectorAll('button.icon').forEach((btn) => {
      btn.style.fontSize = '16px'

      if (btn.id == 'button-nav') {
        btn.querySelector('img').style.height = '16px'
        btn.querySelector('img').style.width = '16px'
      }
    })
  }

  var qd = {}
  if (location.search)
    location.search
      .substr(1)
      .split('&')
      .forEach(function (item) {
        var s = item.split('='),
          k = s[0],
          v = s[1] && decodeURIComponent(s[1]) //  null-coalescing / short-circuit
        //(k in qd) ? qd[k].push(v) : qd[k] = [v]
        ;(qd[k] = qd[k] || []).push(v) // null-coalescing / short-circuit
      })

  if (qd.debugCSS && qd.debugCSS == 1) {
    var debugStyles = document.createElement('link')
    debugStyles.rel = 'stylesheet'
    debugStyles.href = './assets/css/debug.css'
    document.head.appendChild(debugStyles)
  }
}

// modal: debug: display Deckdle.config
Deckdle._displayGameConfig = function () {
  let config = Deckdle.config

  var html = ''

  html += `<h3>GLOBAL (ENV: ${Deckdle.env})</h3>`
  html += '<h3>----------------------------</h3>'

  html += '<dl>'

  html += `<h4>CONFIG</h4>`

  Object.keys(config)
    .sort()
    .forEach((key) => {
      if (typeof config[key] == 'object' && !Array.isArray(config[key]) && config[key] != null) {
        html += `<dd><code>${key}: {</code><dl>`

        Object.keys(config[key]).forEach((k) => {
          var label = k
          var value = config[key][k]

          if (Object.keys(value)) {
            // console.log('found another object', key, label, value)
          } else {
            html += `<dd><code>${label}:</code></dd><dt>${value.join(', ')}</dt>`
          }
        })

        html += '</dl><code>}</code></dd>'
      } else {
        var label = key
        var value = config[key]

        // special cases
        html += `<dd><code>${label}:</code></dd><dt>${value}</dt>`
      }
    })

  html += '</dl>'

  return html
}
// modal: debug: display Deckdle.state
Deckdle._displayGameState = function () {
  let states = Deckdle.state

  var html = ''

  html += '<dl>'

  Object.keys(states).forEach((state) => {
    html += `<h4>STATE: ${state}</h4>`

    Object.keys(states[state]).forEach((key) => {
      if (
        typeof states[state][key] == 'object' &&
        !Array.isArray(states[state][key]) &&
        states[state][key] != null
      ) {
        html += `<dd><code>${key}: {</code><dl>`

        Object.keys(states[state][key]).forEach((k) => {
          var label = k
          var value = states[state][key][k]

          const consoleKeys = ['base', 'stock', 'tableau']

          if (consoleKeys.includes(label)) {
            html += `<dd><code>${label}:</code></dd><dt>see dev console (⌥⌘I)</dt>`
            Deckdle._logStatus(`[DEBUG] #${key}[${state}]${label}`, value)
          } else {
            if (label == 'lastCompletedTime' || label == 'lastPlayedTime') {
              value = Deckdle.__getFormattedDate(new Date(value))
            }

            if (value) {
              const val = Array.isArray(value) ? value.join(', ') : value
              html += `<dd><code>${label}:</code></dd><dt>${val}</dt>`
            }
          }
        })

        html += '</dl><code>}</code></dd>'
      } else {
        var label = key
        var value = states[state][key]

        // special cases
        if (label == 'lastCompletedTime' || label == 'lastPlayedTime') {
          if (value) {
            value = Deckdle.__getFormattedDate(new Date(value))
          }
        } else {
          html += `<dd><code>${label}:</code></dd><dt>${value}</dt>`
        }
      }
    })
  })

  html += '</dl>'

  return html
}
// modal: debug: clear localStorage
Deckdle._clearLocalStorage = function () {
  localStorage.clear()

  if (
    localStorage.key(DECKDLE_SETTINGS_LS_KEY) == undefined &&
    localStorage.key(DECKDLE_STATE_DAILY_LS_KEY) == undefined &&
    localStorage.key(DECKDLE_STATE_FREE_LS_KEY) == undefined
  ) {
    Deckdle.modalOpen('cleared-local-storage')
  }
}

Deckdle._debugCombo = function () {
  Deckdle._playSFX('click_tableau_valid')
  Deckdle._increaseCombo()
}
