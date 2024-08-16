/* debug */
/* debug functions */
/* global Deckdle */

// add debug stuff if local
Deckdle._initDebug = function () {
  // if debug buttons are in template
  if (Deckdle.dom.interactive.debug.all) {
    // show debug buttons
    Deckdle.dom.interactive.debug.all.style.display = 'flex'
    // make header buttons smaller to fit in debug buttons
    document.querySelectorAll('button.icon').forEach((btn) => {
      btn.style.fontSize = '16px'
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
  let configs = Deckdle.config

  var html = ''

  html += `<h3>GLOBAL (ENV: ${Deckdle.env})</h3>`
  html += '<h3>----------------------------</h3>'

  html += '<dl>'

  Object.keys(configs).forEach((config) => {
    html += `<h4>CONFIG: ${config}</h4>`

    Object.keys(configs[config])
      .sort()
      .forEach((key) => {
        if (
          typeof configs[config][key] == 'object' &&
          !Array.isArray(configs[config][key]) &&
          configs[config][key] != null
        ) {
          html += `<dd><code>${key}: {</code><dl>`

          // skip object-within-object key
          if (key == 'solutionSet') {
            html += '<dd><code>v See console.log v</code></dd>'
            html += '</dl><code>}</code></dd>'
          } else {
            Object.keys(configs[config][key]).forEach((k) => {
              var label = k
              var value = configs[config][key][k]

              if (label == 'lastCompletedTime' || label == 'lastPlayedTime') {
                value = Deckdle.__getFormattedDate(new Date(value))
              }

              if (Object.keys(value)) {
                // console.log('found another object', key, label, value)
              } else {
                html += `<dd><code>${label}:</code></dd><dt>${value.join(
                  ', '
                )}</dt>`
              }
            })

            html += '</dl><code>}</code></dd>'
          }
        } else {
          var label = key
          var value = configs[config][key]

          if (label == 'lastCompletedTime' || label == 'lastPlayedTime') {
            if (value) {
              value = Deckdle.__getFormattedDate(new Date(value))
            }
          }

          // special cases
          if (label == 'hintWord') {
            html += `<dd><code>${label}:</code></dd><dt>${
              value ? value.toUpperCase() : value
            }</dt>`
          } else if (label == 'hintObscuredWord' || label == 'letters') {
            html += `<dd><code>${label}:</code></dd><dt>${
              value ? value.map((v) => v.toUpperCase()).join(', ') : value
            }</dt>`
          } else {
            html += `<dd><code>${label}:</code></dd><dt>${value}</dt>`
          }
        }
      })
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

        if (key == 'statistics') {
          Object.keys(states[state][key]).forEach((subkey) => {
            var label = subkey
            var value = states[state][key][subkey]

            html += `<dd><code>${label}:</code></dd><dt>${value}</dt>`
          })

          html += '</dl><code>}</code></dd>'
        } else {
          Object.keys(states[state][key]).forEach((k) => {
            var label = k
            var value = states[state][key][k]

            if (label == 'lastCompletedTime' || label == 'lastPlayedTime') {
              value = Deckdle.__getFormattedDate(new Date(value))
            }

            if (value) {
              const val = Array.isArray(value) ? value.join(', ') : value
              html += `<dd><code>${label}:</code></dd><dt>${val}</dt>`
            }
          })

          html += '</dl><code>}</code></dd>'
        }
      } else {
        var label = key
        var value = states[state][key]

        // special cases
        if (label == 'lastCompletedTime' || label == 'lastPlayedTime') {
          if (value) {
            value = Deckdle.__getFormattedDate(new Date(value))
          }
        } else if (label == 'guessedWords') {
          html += `<dd><code>${label}:</code></dd><dt>`
          html += `${
            value ? value.map((v) => v.toUpperCase()).join(', ') : value
          }</dt>`
        } else if (label == 'seedWord') {
          html += `<dd><code>${label}:</code></dd><dt>${
            value ? value.toUpperCase() : value
          }</dt>`
        } else {
          html += `<dd><code>${label}:</code></dd><dt>${value}</dt>`
        }
      }
    })
  })

  html += '</dl>'

  return html
}
