/* app/main.js */
/* app entry point and main functions */
/* global Deckdle */

// settings: saved in LOCAL STORAGE
Deckdle.settings = { ...DECKDLE_DEFAULTS.settings }

// config: only saved while game is loaded
Deckdle.config = { ...DECKDLE_DEFAULTS.config }

// state: saved between sessions in LOCAL STORAGE
Deckdle.state = { ...DECKDLE_DEFAULTS.state }

/*************************************************************************
 * public methods *
 *************************************************************************/

// modal methods
Deckdle.modalOpen = async function (type) {
  let modalText

  switch (type) {
    case 'start':
    case 'help':
      if (Deckdle.myModal) {
        Deckdle.myModal._destroyModal()
      }

      modalText = `
        <p><strong>Deckdle</strong> is a daily solitaire card game. Currently, the only solitaire type is <code>golf</code>, but there are plans to add the classic <code>klondike</code>, <code>pyramid</code>, and <code>spider</code>.</p>
      `

      const gameType = Deckdle.__getState()['gameType']
      switch (gameType) {
        case 'golf':
        default:
          modalText += `
            <h3 class="blamph">${gameType}</h3>
            <p>Exhaust the tableau onto your base before your stock runs out. You can move any unobscured card (just click/touch it) as long as its rank (e.g. 2, 8, J, etc.) is <strong>one higher</strong> or <strong>one lower</strong> than the current base card. Suit <strong>does not</strong> matter.</p>
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

        <p>Settings for dark mode and sounds can be adjusted using the <i class="fa-solid fa-gear"></i> icon.</p>

        <hr />

        <p><strong>Dev</strong>: <a href="https://michaelchadwick.info" target="_blank">Michael Chadwick</a>.</p>
      `

      Deckdle.myModal = new Modal(
        'perm',
        'How to Play Deckdle',
        modalText,
        null,
        null
      )

      if (!localStorage.getItem(DECKDLE_SETTINGS_LS_KEY)) {
        localStorage.setItem(
          DECKDLE_SETTINGS_LS_KEY,
          JSON.stringify(DECKDLE_DEFAULTS.settings)
        )
      }

      Deckdle._saveSetting('firstTime', false)

      break

    case 'stats':
      modalText = `
        <div class="container">

          <div class="statistic-header">Daily</div>
          <div class="statistic-subheader">
            (<small>New puzzle available at 12am PST</small>)
          </div>

          <div class="statistics">
            <div class="statistic-container">
              <div class="statistic">${Deckdle._getGameCount('daily')}</div>
              <div class="statistic-label">Game(s) Finished</div>
            </div>
          </div>
        `

      modalText += `
          <div class="statistic-header">Free Play</div>
          <div class="statistics">
            <div class="statistic-container">
              <div class="statistic">${Deckdle._getGameCount('free')}</div>
              <div class="statistic-label">Game(s) Finished</div>
            </div>
          </div>
      `

      modalText += `
        </div>
      `

      if (Deckdle.myModal) {
        Deckdle.myModal._destroyModal()
      }

      Deckdle.myModal = new Modal(
        'perm',
        'Statistics',
        modalText,
        null,
        null,
        false
      )
      break

    case 'settings':
      if (Deckdle.myModal) {
        Deckdle.myModal._destroyModal()
      }

      modalText = `
        <div id="settings">

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

    case 'shared':
      Deckdle.myModal = new Modal(
        'temp',
        null,
        'Results copied to clipboard',
        null,
        null
      )
      break
    case 'no-clipboard-access':
      Deckdle.myModal = new Modal(
        'temp',
        null,
        'Sorry, but access to clipboard not available',
        null,
        null
      )
      break

    case 'cleared-local-storage':
      Deckdle.myModal = new Modal(
        'temp',
        null,
        'Local Storage has been cleared',
        null,
        null
      )
      break

    case 'game-over-win':
      modalText = `
        <div class="container game-over-win">
      `

      switch (Deckdle._getState()['gameType']) {
        case 'golf':
        default:
          if (Deckdle._stockCount() > 0) {
            modalText = `
              <div class='score-animation'>
                <div>Whoa! You won with a score of...</div>
                <div class='score animate__animated animate__zoomIn'>${Deckdle._stockCount()}</div>
                <div>UNDER PAR</div>
              </div>
            `
          } else {
            modalText = `
              <div class='score-animation'>
                <div>Whew. You just barely hit...</div>
                <div class='score animate__animated animate__zoomIn'>PAR</div>
              </div>
            `
          }

          break
      }

      // daily
      if (Deckdle.__getGameMode() == 'daily') {
        modalText += `<button class="game-over new-free" onclick="Deckdle._changeSetting('gameMode', 'free')" title="Try free play?">Try free play?</button>`
      }
      // free
      else {
        modalText += `<button class="game-over new-free" onclick="Deckdle._createNewFree()" title="Try another free one?">Try another free one?</button>`
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

      if (Deckdle.myModal) Deckdle.myModal._destroyModal()

      Deckdle.myModal = new Modal(
        'end-state',
        'Congratulations! You cleared it!',
        modalText,
        null,
        null,
        'game-over-win'
      )

      Deckdle._playSFX('win')

      break

    case 'game-over-lose':
      modalText = `
        <div class="container game-over-lose">
      `

      modalText = `
        <div class='score-animation'>
          <div>You lost with a score of...</div>
          <div class='score animate__animated animate__zoomIn'>${Deckdle._tableauCount()}</div>
          <div>OVER PAR</div>
        </div>
      `

      // daily
      if (Deckdle.__getGameMode() == 'daily') {
        modalText += `<button class="game-over new-free" onclick="Deckdle._changeSetting('gameMode', 'free')" title="Try free play?">Try free play?</button>`
      }
      // free
      else {
        modalText += `<button class="game-over new-free" onclick="Deckdle._createNewFree()" title="Try another?">Try another?</button>`
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

      if (Deckdle.myModal) Deckdle.myModal._destroyModal()

      Deckdle.myModal = new Modal(
        'end-state',
        "Bummer! You didn't clear it this time!",
        modalText,
        null,
        null,
        'game-over-lose'
      )

      Deckdle._playSFX('lose')

      break
  }
}

// start the engine
Deckdle.initApp = async () => {
  // if local dev, show debug stuff
  if (Deckdle.env == 'local') {
    Deckdle._initDebug()

    if (!document.title.includes('(LH) ')) {
      document.title = '(LH) ' + document.title
    }
  }

  Deckdle._getNebyooApps()

  const gameId = Deckdle._loadQueryString('id')

  if (gameId) {
    await Deckdle._createNewSetup('free', gameId);
  } else {
    await Deckdle._loadGame()
  }

  Deckdle.combo = 0
  Deckdle.ui._resetComboCounter()

  Deckdle._attachEventListeners()

  Deckdle._logStatus('[LOADED] /app/main')
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

// create new setupId, which resets progress
Deckdle._createNewSetup = async function (gameMode, qsId = null) {
  let setupId = null

  Deckdle.__setState('gameState', 'IN_PROGRESS', gameMode)

  // 'daily' always uses day hash
  if (gameMode == 'daily') {
    try {
      const response = await fetch(DECKDLE_DAILY_SCRIPT)
      const data = await response.json()
      setupId = parseInt(data['setupId'])

      Deckdle.ui._updateDailyDetails(data['index'])

      if (!setupId) {
        console.error('retrieval of daily setupId went bork', setupId)
      }
    } catch (e) {
      console.error('could not get daily setupId', e)
    }
  }
  // 'free' generates random setupId
  else {
    if (qsId) {
      setupId = qsId

      if ('URLSearchParams' in window) {
        const url = new URL(window.location)
        url.searchParams.delete('id')
        history.pushState(null, '', url);
      }
    } else {
      setupId = Deckdle.__getRandomSetupId()
    }
  }

  Deckdle.__setState('setupId', setupId, gameMode)

  // create new Deckdle puzzle
  const puzzle = Deckdle.__createPuzzle(
    Deckdle.__getState(gameMode).setupId,
    gameMode
  )

  Deckdle.__setState('tableau', puzzle.tableau)
  Deckdle.__setState('stock', puzzle.stock)
  Deckdle.__setState('base', puzzle.base)

  Deckdle._logStatus(`created '${gameMode}' Puzzle from id: '${setupId}'`, puzzle)

  Deckdle._saveGame(gameMode, '_createNewSetup')

  // fill UI with beautiful cards
  Deckdle.ui._emptyPlayingField()
  Deckdle.ui._fillCards((animate = true))

  if (Deckdle._isBaseEmpty()) {
    Deckdle._moveCardFromStockToBase()
  }

  Deckdle.combo = 0
  Deckdle.ui._resetComboCounter()
}

// load existing setupId, which retains past progress
Deckdle._loadExistingSetup = async function (gameMode) {
  // 'daily' always uses day hash
  if (gameMode == 'daily') {
    try {
      const response = await fetch(DECKDLE_DAILY_SCRIPT)
      const data = await response.json()
      const setupId = parseInt(data['setupId'])

      Deckdle.ui._updateDailyDetails(data['index'])

      if (!setupId) {
        console.error('retrieval of daily setupId went bork', setupId)
      } else {
        console.log('daily setupId was successfully retrieved')
        Deckdle.__setState('setupId', setupId, gameMode)
      }
    } catch (e) {
      console.error('could not get daily setupId', e)
    }
  }
  // free uses current state, so nothing to do
  else {}

  // load existing Deckdle puzzle from tableau/stock
  const puzzle = Deckdle.__loadPuzzle(Deckdle.__getState()['setupId'], Deckdle.__getState()['gameType'], Deckdle.__getState())

  Deckdle.__setState('tableau', puzzle.tableau)
  Deckdle.__setState('stock', puzzle.stock)
  Deckdle.__setState('base', puzzle.base)

  console.log(`loaded '${gameMode}' Puzzle from existing card setup`, puzzle)

  // fill UI with beautiful cards
  Deckdle.ui._emptyPlayingField()
  Deckdle.ui._fillCards()

  if (!Deckdle._stockCount()) {
    Deckdle.dom.interactive.stock.appendChild(Deckdle.ui._createEmptyCard())
  }

  Deckdle.combo = 0
  Deckdle.ui._resetComboCounter()

  // see if we've already won
  Deckdle._checkWinState()
}

Deckdle._createNewFree = async function () {
  if (Deckdle.myModal) Deckdle.myModal._destroyModal()

  await Deckdle._createNewSetup('free')
}

// ask to create new free gamemode puzzle
Deckdle._confirmNewFree = async function () {
  const myConfirm = new Modal(
    'confirm',
    'Create New Free Play Puzzle?',
    'Are you <strong>sure</strong> you want to create a new free play puzzle?',
    'Yes, please',
    'No, never mind'
  )

  try {
    // wait for modal confirmation
    const confirmed = await myConfirm.question()

    if (confirmed) {
      // Deckdle._resetFreeProgress()
      await Deckdle._createNewSetup('free')
    }
  } catch (err) {
    console.error('progress reset failed', err)
  }
}

// reset config, state, and LS for free play
Deckdle._resetFreeProgress = async function () {
  // set config and state to defaults
  Deckdle.config.free = DECKDLE_DEFAULTS.config.free
  Deckdle.state.free = DECKDLE_DEFAULTS.state.free

  // fill UI with beautiful cards
  Deckdle.ui._emptyPlayingField()
  Deckdle.ui._fillCards()

  // save those defaults to localStorage
  Deckdle._saveGame('free', '_resetFreeProgress')
}

// end of daily game button
Deckdle._switchToFree = function () {

}

// game state checking
Deckdle._checkWinState = function () {
  // console.log('checking win state...')

  Deckdle.__setState('lastPlayedTime', new Date().getTime())

  // tableau exhausted
  if (Deckdle._tableauCount() == 0) {
    Deckdle.__setState('gameState', 'GAME_OVER')
    Deckdle.__setState('lastCompletedTime', new Date().getTime())

    Deckdle.modalOpen('game-over-win')
  }
  // stock exhausted and no valid tableau card
  else if (
    Deckdle.__getState().stock.length == 0 &&
    !Deckdle._tableauHasValidCard()
  ) {
    Deckdle.__setState('gameState', 'GAME_OVER')
    Deckdle.__setState('lastCompletedTime', new Date().getTime())

    Deckdle.modalOpen('game-over-lose')
  }

  Deckdle._saveGame(Deckdle.__getGameMode(), 'checkWinState')
}

Deckdle._loadQueryString = function (param) {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  })

  if (params) {
    return params[param]
  } else {
    return false
  }
}

// copy results to clipboard for sharing
Deckdle._shareResults = async function () {
  let shareText = Deckdle.__getShareText()

  // if (navigator.canShare({ text: shareText })) {
  //   navigator.share({ text: shareText }).then(() => {
  //     console.log('sharing was successful')
  //   })
  //   .catch((error) => {
  //     if (error.name == 'AbortError') {
  //       console.log('user canceled share')
  //     } else {
  //       console.log('navigator.share failed', error)
  //     }
  //   })
  //   .finally(() => {
  //     // console.log('navigator.share() ended')
  //   })
  // } else {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          Deckdle.modalOpen('shared')
        })
        .catch(() => {
          console.error('could not copy text to clipboard')

          Deckdle.modalOpen('no-clipboard-access')

          return
        })
    } else {
      console.warn('no sharing or clipboard access available')

      Deckdle.modalOpen('no-clipboard-access')

      return
    }
  // }
}

/************************************************************************
 * _private __helper methods *
 ************************************************************************/

Deckdle.__createPuzzle = (setupId, type = 'golf') => {
  return new Puzzle(setupId, type)
}

Deckdle.__loadPuzzle = (setupId, type = 'golf', state) => {
  return new Puzzle(setupId, type, state)
}

Deckdle.__getShareText = (mode = Deckdle.__getGameMode(), type = Deckdle.__getGameType()) => {
  let html = ''

  if (mode == 'daily') {
    html += `♦️ Deckdle DAILY #${Deckdle.dailyNumber}\n`
  } else {
    html += `♦️ Deckdle FREE id:${Deckdle.__getState()['setupId']}\n`
  }

  switch (type) {
    case 'golf':
      const tableauCount = Deckdle._tableauCount()
      const stockCount = Deckdle._stockCount()

      if (tableauCount == 0) {
        if (stockCount == 0) {
          html += `GOLF (WIN): PAR\n`
        } else if (stockCount > 0) {
          html += `GOLF (WIN): -${stockCount}\n`
        }
      } else {
        html += `GOLF (LOSE): +${tableauCount + stockCount}\n`
      }
      break
  }

  if (mode == 'daily') {
    html += DECKDLE_SHARE_URL
  } else {
    html += `${DECKDLE_SHARE_URL}&id=${Deckdle.__getState()['setupId']}`
  }

  return html
}

/************************************************************************
 * ON PAGE LOAD, DO THIS *
 ************************************************************************/

// set up game
Deckdle.initApp()
