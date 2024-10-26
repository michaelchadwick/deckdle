/* lib/misc/debug */
/* debug functions */
/* global Deckdle */
/* eslint-disable no-undef */

// add debug stuff if local
Deckdle._initDebug = () => {
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
}

// modal: debug: display Deckdle.config
Deckdle._displayGameConfig = () => {
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

          if (value) {
            if (Object.keys(value)) {
              // console.log('found another object', key, label, value)
            } else {
              html += `<dd><code>${label}:</code></dd><dt>${value.join(', ')}</dt>`
            }
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
Deckdle._displayGameState = () => {
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

          const consoleKeys = ['actions', 'base', 'stock', 'tableau']

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
Deckdle._clearLocalStorage = () => {
  localStorage.clear()

  if (
    localStorage.key(DECKDLE_SETTINGS_LS_KEY) == undefined &&
    localStorage.key(DECKDLE_STATE_DAILY_LS_KEY) == undefined &&
    localStorage.key(DECKDLE_STATE_FREE_LS_KEY) == undefined
  ) {
    Deckdle.modalOpen('cleared-local-storage')
  }
}

Deckdle._debugCombo = () => {
  Deckdle._playSFX('click_tableau_valid')
  Deckdle._increaseCombo()
}

Deckdle._debugGameOver = (type = 'golf', gameMode = 'daily', win = true, score = 1) => {
  if (Deckdle.myModal) {
    Deckdle.myModal._destroyModal()
  }

  let modalText = `
    <div class="container game-over">
  `

  switch (type) {
    case 'golf':
    default:
      if (win) {
        Deckdle._playSFX('win')

        if (score > 0) {
          modalText = `
            <div class='score-animation'>
              <div>Whoa! You shot under par with a score of...</div>
              <div class='score animate__animated animate__zoomIn'>-${score}</div>
            </div>
            <div class='score-image'>
              <img src='/assets/images/${score}below.png' alt='Game Score: ${score} below par' title='Game Score: ${score} below par' />
            </div>
          `
        } else {
          modalText = `
            <div class='score-animation'>
              <div>Whew! You just barely hit...</div>
              <div class='score animate__animated animate__zoomIn'>PAR</div>
            </div>
          `
        }
      } else {
        Deckdle._playSFX('lose')

        modalText = `
          <div class='score-animation'>
            <div>You didn't quite clear it with a score of...</div>
            <div class='score animate__animated animate__zoomIn'>${score}</div>
            <div>OVER PAR</div>
          </div>
        `
      }

      break
  }

  // daily
  if (gameMode == 'daily') {
    modalText += `
      <div class="para">New daily puzzle available at 12 am PST</div>
    `

    if (Deckdle.settings.replayMode) {
      modalText += `
        <div class="para highlighted">
          <p>You may retry this game to improve your score, but it won't count towards your actual score.</p>
          <div class="buttons">
            <button class="game-over replay" onclick="Deckdle._replayGame()" title="Replay game?">Replay game?</button>
          </div>
        </div>
      `
    }
  }
  // free
  else {
    modalText += `
      <div class="buttons">
        <button class="game-over new-free" onclick="Deckdle._createNewFree()" title="Try another?">Try another?</button>
      </div>
    `
  }

  modalText += `
    <div class="share">
      <button class="game-over share" onclick="Deckdle._shareResults()">Share <i class="fa-solid fa-share-nodes"></i></button>
    </div>
  `

  modalText += `
    </div>
  `

  Deckdle.myModal = new Modal('end-state', 'Game Over', modalText, null, null, 'game-over')
}
