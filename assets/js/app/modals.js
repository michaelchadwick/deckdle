/* various modal configs that get called during gameplay */
/* global Deckdle */
/* eslint-disable no-undef */

Deckdle.modalOpen = async (type) => {
  let modalText
  const gameType = Deckdle.__getState()['gameType']

  switch (type) {
    case 'start':
    case 'help':
      if (Deckdle.myModal) {
        Deckdle.myModal._destroyModal()
      }

      modalText = `
        <p><strong>Deckdle</strong> is a daily solitaire card game. Currently, the only solitaire type is <code>golf</code>, but there are plans to add the classic <code>klondike</code>, <code>pyramid</code>, and <code>spider</code>.</p>
      `

      switch (gameType) {
        case 'golf':
        default:
          modalText += `
            <h3 class="blamph">${gameType}</h3>
            <p>Exhaust the tableau (the top grid of cards) onto your base (bottom-right stack) before your stock (bottom-left stack) runs out. You can move any unobscured card (just click/touch it) as long as its rank (e.g. 2, 8, J, etc.) is <strong>one higher</strong> or <strong>one lower</strong> than the current base card. Suit <strong>does not</strong> matter.</p>
          `
          break
      }

      modalText += `
        <div class="flex">
          <div>
            <h4>Daily</h4>
            <p>Come back every day (at 12 am PST) for a new <span class="blamph">${gameType}</span> solitaire tableau and stock!</p>
          </div>

          <div>
            <h4>Free</h4>
            <p>Play <span class="blamph">${gameType}</span> solitaire endlessly!
          </div>
        </div>

        <p>Settings for dark mode, sounds, and a visual combo counter can be adjusted using the <i class="fa-solid fa-gear"></i> icon.</p>

        <hr />

        <p><strong>Dev</strong>: <a href="https://michaelchadwick.info" target="_blank">Michael Chadwick</a>.</p>
      `

      Deckdle.myModal = new Modal('perm', 'How to Play Deckdle', modalText, null, null)

      if (!localStorage.getItem(DECKDLE_SETTINGS_LS_KEY)) {
        localStorage.setItem(DECKDLE_SETTINGS_LS_KEY, JSON.stringify(DECKDLE_DEFAULTS.settings))
      }

      Deckdle._saveSetting('firstTime', false)

      Deckdle._loadSettings()

      break

    case 'stats':
      if (Deckdle.myModal) {
        Deckdle.myModal._destroyModal()
      }

      modalText = `
        <div class="container">
      `

      // daily stats
      modalText += `
          <div class="statistic-header">Daily</div>
          <div class="statistic-subheader">
            (<small>New puzzle available at 12am PST</small>)
          </div>

          <div class="statistics">
            <div class="statistic-container">
              <div class="statistic">${Deckdle._getFinishedGameCount('daily')}</div>
              <div class="statistic-label">Game(s) Finished</div>
            </div>
            <div class="statistic-container">
              <div class="statistic">${Deckdle._getBestCombo('daily')}</div>
              <div class="statistic-label">Max<br />Combo</div>
            </div>
            <div class="statistic-container">
              <div class="statistic">${Deckdle._getBestScore('daily')}</div>
              <div class="statistic-label">Best<br />Score</div>
            </div>
          </div>
        `

      // free stats
      modalText += `
          <div class="statistic-header">Free Play</div>
          <div class="statistics">
            <div class="statistic-container">
              <div class="statistic">${Deckdle._getFinishedGameCount('free')}</div>
              <div class="statistic-label">Game(s) Finished</div>
            </div>
            <div class="statistic-container">
              <div class="statistic">${Deckdle._getBestCombo('free')}</div>
              <div class="statistic-label">Max<br />Combo</div>
            </div>
            <div class="statistic-container">
              <div class="statistic">${Deckdle._getBestScore('free')}</div>
              <div class="statistic-label">Best<br />Score</div>
            </div>
          </div>
      `

      if (Deckdle.__getState().gameState == 'GAME_OVER') {
        modalText += `
          <div class="share">
            <button class="game-over share" onclick="Deckdle._shareResults()">Share <i class="fa-solid fa-share-nodes"></i></button>
          </div>
        `
      }

      modalText += `
        </div>
      `

      Deckdle.myModal = new Modal('perm', 'Statistics', modalText, null, null, false)
      break

    case 'settings':
      if (Deckdle.myModal) {
        Deckdle.myModal._destroyModal()
      }

      modalText = `
        <div id="settings">

          <!-- animation display -->
          <div class="setting-row">
            <div class="text">
              <div class="title">Animation</div>
              <div class="description">Display card animations</div>
            </div>
            <div class="control">
              <div class="container">
                <div id="button-setting-animation-display"
                  data-status=""
                  class="switch"
                  onclick="Deckdle._changeSetting('animationDisplay')"
                >
                  <span class="knob"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- combo counter -->
          <div class="setting-row">
            <div class="text">
              <div class="title">Combo Counter</div>
              <div class="description">Show a combination counter for excitement!</div>
            </div>
            <div class="control">
              <div class="container">
                <div id="button-setting-combo-counter"
                  data-status=""
                  class="switch"
                  onclick="Deckdle._changeSetting('comboCounter')"
                >
                  <span class="knob"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- dark mode -->
          <div class="setting-row">
            <div class="text">
              <div class="title">Dark Mode</div>
              <div class="description">Change colors to better suit low light</div>
            </div>
            <div class="control">
              <div class="container">
                <div id="button-setting-dark-mode"
                  data-status=""
                  class="switch"
                  onclick="Deckdle._changeSetting('darkMode')"
                >
                  <span class="knob"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- replay mode -->
          <div class="setting-row">
            <div class="text">
              <div class="title">Replay Mode (Experimental)</div>
              <div class="description">Replay finished daily game, but not save score</div>
            </div>
            <div class="control">
              <div class="container">
                <div id="button-setting-replay-mode"
                  data-status=""
                  class="switch"
                  onclick="Deckdle._changeSetting('replayMode')"
                >
                  <span class="knob"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- noisy -->
          <div class="setting-row">
            <div class="text">
              <div class="title">Sounds</div>
              <div class="description">Enable music and sound.</div>
            </div>
            <div class="control">
              <div class="container">
                <div id="button-setting-noisy"
                  data-status=""
                  class="switch"
                  onclick="Deckdle._changeSetting('noisy')"
                >
                  <span class="knob"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- sound: bgm -->
          <div class="setting-row">
            <div class="text">
              <div class="title">BGM Volume</div>
              <div class="description">Background music volume.</div>
            </div>
            <div class="control">
              <div class="container">
                <input id="range-setting-bgm-level"
                  type="range"
                  min="0"
                  max="100"
                  value="10"
                  disabled="disabled"
                  onchange="Deckdle._changeSetting('soundBGMLevel', event.target.value)"
                >
              </div>
              <button class="spacer" id="button-start-music" title="Start Music" onclick="Deckdle._playBGM()" disabled>
                <i class="fa-solid fa-play"></i>
              </button>
              <button class="spacer" id="button-stop-music" title="Stop Music" onclick="Deckdle._stopBGM()" disabled>
                <i class="fa-solid fa-stop"></i>
              </button>
            </div>
          </div>

          <!-- sound: sfx -->
          <div class="setting-row">
            <div class="text">
              <div class="title">SFX Volume</div>
              <div class="description">Sound effects volume.</div>
            </div>
            <div class="control">
              <div class="container">
                <input id="range-setting-sfx-level"
                  type="range"
                  min="0"
                  max="100"
                  value="20"
                  disabled="disabled"
                  onchange="Deckdle._changeSetting('soundSFXLevel', event.target.value)"
                >
              </div>
              <span class="spacer"></span>
              <span class="spacer"></span>
            </div>
          </div>

        </div>
      `

      Deckdle.myModal = new Modal('perm', 'Settings', modalText, null, null)

      Deckdle._loadSettings()

      break

    case 'show-config':
      Deckdle.myModal = new Modal(
        'perm-debug',
        'Game Config (code model only)',
        Deckdle._displayGameConfig(),
        null,
        null
      )
      break
    case 'show-state':
      Deckdle.myModal = new Modal(
        'perm-debug',
        'Game State (load from/save to LS)',
        Deckdle._displayGameState(),
        null,
        null
      )
      break

    case 'game-over':
      if (Deckdle.myModal) {
        Deckdle.myModal._destroyModal()
      }

      modalText = `
        <div class="container game-over">
      `

      switch (Deckdle.__getState()['gameType']) {
        case 'golf':
        default:
          if (Deckdle._tableauCount() == 0) {
            Deckdle._playSFX('win')

            if (Deckdle._stockCount() > 0) {
              modalText = `
                <div class='score-animation'>
                  <div>Whoa! You shot under par with a score of...</div>
                  <div class='score animate__animated animate__zoomIn'>${Deckdle._stockCount()}</div>
                </div>
                <div class='score-image'>
                  <img src='/assets/images/${Deckdle._stockCount()}below.png' alt='Game Score: ${Deckdle._stockCount()} below par' title='Game Score: ${Deckdle._stockCount()} below par' />
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
                <div class='score animate__animated animate__zoomIn'>${Deckdle._tableauCount()}</div>
                <div>OVER PAR</div>
              </div>
            `
          }

          break
      }

      modalText += `
        <div class='move-count'>
      `
      if (Deckdle.__getUndoCount() > 0) {
        modalText += `
          <strong>${Deckdle.__getActionCount()}</strong> moves (${Deckdle.__getActionCount((countUndos = true))} counting undos)
        `
      } else {
        modalText += `
          <strong>${Deckdle.__getActionCount()}</strong> moves
        `
      }
      modalText += `
        </div>
        <div class="setupid">${Deckdle.__getState().setupId}</div>
      `

      // daily
      if (Deckdle.__getGameMode() == 'daily') {
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

      if (Deckdle.__getState().gameState == 'GAME_OVER') {
        modalText += `
          <div class="share">
            <button class="game-over share" onclick="Deckdle._shareResults()">Share <i class="fa-solid fa-share-nodes"></i></button>
          </div>
        `
      }

      modalText += `
        </div>
      `

      Deckdle.myModal = new Modal('end-state', 'Game Over', modalText, null, null, 'game-over')

      break

    case 'game-over-replay':
      if (Deckdle.myModal) {
        Deckdle.myModal._destroyModal()
      }

      modalText = `
        <div class="container game-over">
      `

      switch (Deckdle.__getState()['gameType']) {
        case 'golf':
        default:
          if (Deckdle._tableauCount() == 0) {
            Deckdle._playSFX('win')

            if (Deckdle._stockCount() > 0) {
              modalText = `
                <div class='score-animation'>
                  <div>Whoa! You shot under par with a score of...</div>
                  <div class='score animate__animated animate__zoomIn'>${Deckdle._stockCount()}</div>
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
                <div class='score animate__animated animate__zoomIn'>${Deckdle._tableauCount()}</div>
                <div>OVER PAR</div>
              </div>
            `
          }

          break
      }

      // daily
      if (Deckdle.__getGameMode() == 'daily') {
        modalText += `
          <div class="para">New daily puzzle available at 12 am PST</div>
          <div class="para highlighted">
            <p>Replay this game...again? Remember, it still won't count towards your actual score.</p>
            <div class="buttons">
              <button class="game-over replay" onclick="Deckdle._replayGame()" title="Replay game...again?">Replay game...again?</button>
            </div>
          </div>
        `
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
        </div>
      `

      Deckdle.myModal = new Modal(
        'end-state',
        'Game Over (Replay)',
        modalText,
        null,
        null,
        'game-over'
      )

      break

    case 'shared':
      if (Deckdle.myModalTemp) {
        Deckdle.myModalTemp._destroyModal()
      }

      Deckdle.myModalTemp = new Modal('temp', null, 'Results copied to clipboard', null, null)
      break

    case 'no-clipboard-access':
      if (Deckdle.myModalTemp) {
        Deckdle.myModalTemp._destroyModal()
      }

      Deckdle.myModalTemp = new Modal(
        'temp',
        null,
        'Sorry, but access to clipboard not available',
        null,
        null
      )
      break

    case 'cleared-local-storage':
      if (Deckdle.myModalTemp) {
        Deckdle.myModalTemp._destroyModal()
      }

      Deckdle.myModalTemp = new Modal('temp', null, 'Local Storage has been cleared', null, null)
      break
  }
}
