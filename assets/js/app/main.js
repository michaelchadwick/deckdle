/* /assets/js/app/main.js */
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
      modalText = `
        <p><strong>Deckdle</strong> is a <s>daily</s> solitaire card game. Currently, the only solitaire type is 'golf', but there are plans to add the classic 'klondike', 'pyramid', and 'spider'.</p>
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
          <s>
            <div>
              <h4>Daily</h4>
              <p>Come back every day (at 12 am PST) for a new <span class="blamph">${gameType}</span> solitaire tableau and stock!</p>
            </div>
          </s>

          <div>
            <h4>Free</h4>
            <p>Play <span class="blamph">${gameType}</span> solitaire endlessly!
          </div>
        </div>

        <p>Settings for dark mode and sounds can be adjusted using the <i class="fa-solid fa-gear"></i> icon.</p>

        <hr />

        <p><strong>Dev</strong>: <a href="https://michaelchadwick.info" target="_blank">Michael Chadwick</a>.</p>
      `

      this.myModal = new Modal(
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
    case 'win':
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

      if (Deckdle.__getState().gameState == 'GAME_OVER') {
        modalText += `
          <div class="share">
            <button class="share" onclick="Deckdle._shareResults()">Share <i class="fa-solid fa-share-nodes"></i></button>
          </div>
        `
      }

      modalText += `
        </div>
      `

      this.myModal = new Modal(
        'perm',
        'Statistics',
        modalText,
        null,
        null,
        false
      )
      break

    case 'settings':
      modalText = `
        <div id="settings">

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
            </div>
          </div>

        </div>
      `

      this.myModal = new Modal('perm', 'Settings', modalText, null, null)

      Deckdle._loadSettings()

      break

    case 'show-config':
      this.myModal = new Modal(
        'perm-debug',
        'Game Config (code model only)',
        Deckdle._displayGameConfig(),
        null,
        null
      )
      break
    case 'show-state':
      this.myModal = new Modal(
        'perm-debug',
        'Game State (load from/save to LS)',
        Deckdle._displayGameState(),
        null,
        null
      )
      break

    case 'shared':
      this.myModal = new Modal(
        'temp',
        null,
        'Results copied to clipboard',
        null,
        null
      )
      break
    case 'no-clipboard-access':
      this.myModal = new Modal(
        'temp',
        null,
        'Sorry, but access to clipboard not available',
        null,
        null
      )
      break

    case 'cleared-local-storage':
      this.myModal = new Modal(
        'temp',
        null,
        'Local Storage has been cleared',
        null,
        null
      )
      break

    case 'game-over-win':
      const stockCount = Deckdle.__getState()['stock'].length
      if (stockCount > 0) {
        modalText = `
          <div class='score-animation'>
            <div>Whoa! You won with a score of...</div>
            <div class='score animate__animated animate__zoomIn'>${stockCount}</div>
            <div>UNDER PAR</div>
          </div>
        `
      } else {
        modalText = `
          <div class='score-animation'>
            <div>Whew. You won with a score of...</div>
            <div class='score animate__animated animate__zoomIn'>PAR</div>
          </div>
        `
      }

      if (Deckdle.__getState().gameState == 'GAME_OVER') {
        modalText += `
          <div class="share">
            <button class="share" onclick="Deckdle._shareResults()">Share <i class="fa-solid fa-share-nodes"></i></button>
          </div>
        `
      }

      this.myModal = new Modal('perm', 'Game Over (Win)', modalText, null, null)

      Deckdle._playSFX('win')

      break

    case 'game-over-lose':
      modalText = `
        <div class='score-animation'>
          <div>Ploo. You lost with a score of...</div>
          <div class='score animate__animated animate__zoomIn'>${Deckdle._tableauCount()}</div>
          <div>OVER PAR</div>
        </div>
      `

      this.myModal = new Modal('perm', 'Game Over (Lose)', modalText, null, null)

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

  // lib/localStorage.js
  await Deckdle._loadGame()

  Deckdle._getNebyooApps()

  Deckdle._attachEventListeners()

  Deckdle._logStatus('[LOADED] /app/main')
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

// create new setupId, which resets progress
Deckdle._createNewSetup = async function (gameMode) {
  let setupId = null

  // 'daily' always uses day hash
  if (gameMode == 'daily') {
    try {
      const response = await fetch(DECKDLE_DAILY_SCRIPT)
      const data = await response.json()
      setupId = data['setupId']

      Deckdle.ui._updateDailyDetails(data['index'])

      if (!setupId) {
        console.error('daily setupId went bork', setupId)
      }
    } catch (e) {
      console.error('could not get daily setupId', e)
    }
  }
  // 'free' generates random setupId
  else {
    setupId = Deckdle.__getRandomSetupId()
  }

  // set gameMode's state setupId
  Deckdle.__setState('setupId', setupId, gameMode)

  // create new Deckdle puzzle
  const puzzle = Deckdle.__createPuzzle(
    Deckdle.__getState(gameMode).setupId,
    Deckdle.__getGameMode()
  )

  Deckdle.__setState('tableau', puzzle.tableau)
  Deckdle.__setState('stock', puzzle.stock)

  console.log(`created '${gameMode}' Puzzle from new setupId`, puzzle)

  Deckdle._saveGame(gameMode, '_createNewSetup')

  // fill UI with beautiful cards
  Deckdle.ui._emptyPlayingField()
  Deckdle.ui._fillCards()
}

// load existing setupId, which retains past progress
Deckdle._loadExistingSetup = async function (gameMode) {
  // 'daily' always uses day hash
  if (gameMode == 'daily') {
    // Deckdle._logStatus('loading existing daily setupId...')

    try {
      const response = await fetch(DECKDLE_DAILY_SCRIPT)
      const data = await response.json()
      const setupId = data['setupId']

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
  const puzzle = Deckdle.__loadPuzzle(Deckdle.__getState()['gameType'], Deckdle.__getState())

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

  // see if we've already won
  Deckdle._checkWinState()
}

// ask to create new free gamemode puzzle
Deckdle._confirmNewFree = async function () {
  const myConfirm = new Modal(
    'confirm',
    'Create New Puzzle?',
    'Are you <strong>sure</strong> you want to create a new puzzle?',
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

// game state checking
Deckdle._checkWinState = function () {
  // console.log('checking win state...')

  Deckdle.__setState('lastPlayedTime', new Date().getTime())

  // tableau exhausted
  if (Deckdle._tableauCount() == 0) {
    Deckdle.__setState('lastCompletedTime', new Date().getTime())

    Deckdle.modalOpen('game-over-win')
  }
  // stock exhausted and no valid tableau card
  else if (
    Deckdle.__getState().stock.length == 0 &&
    !Deckdle._tableauHasValidCard()
  ) {
    Deckdle.__setState('lastCompletedTime', new Date().getTime())

    Deckdle.modalOpen('game-over-lose')
  }

  Deckdle._saveGame(Deckdle.__getGameMode(), 'checkWinState')
}

// copy results to clipboard for sharing
Deckdle._shareResults = async function () {
  let shareText = ''
  const gameType = Deckdle.__getState()['gameType']

  shareText += `♦️ Deckdle #${Deckdle.dailyNumber}\n`

  switch (gameType) {
    case 'golf':
      const stockCount = Deckdle.__getState()['stock'].length

      if (stockCount == 0) {
        shareText += `GOLF: PAR\n`
      } else if (stockCount > 0) {
        shareText += `GOLF: -${stockCount}\n`
      } else {
        shareText += `GOLF: +${stockCount}\n`
      }
      break
  }

  shareText += DECKDLE_SHARE_URL

  if (navigator.canShare) {
    navigator.share({ text: shareText })
  } else {
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

      // const canWrite = await navigator.permissions.query({ name: 'clipboard-write' })

      // if (canWrite.state == 'granted') {
      //   navigator.clipboard.writeText(shareText).then(() => {
      //     Deckdle.modalOpen('shared')
      //   }).catch(() => console.error('could not copy text to clipboard'))
      // } else {
      //   console.warn('clipboard access was denied')

      //   Deckdle.modalOpen('no-clipboard-access')
      // }
    } else {
      console.warn('no sharing or clipboard access available')

      Deckdle.modalOpen('no-clipboard-access')

      return
    }
  }
}

/************************************************************************
 * _private __helper methods *
 ************************************************************************/

Deckdle.__createPuzzle = (setupId, type = 'golf') => {
  return new Puzzle(setupId, type)
}

Deckdle.__loadPuzzle = (type = 'gold', state) => {
  return new Puzzle(null, type, state)
}

/************************************************************************
 * ON PAGE LOAD, DO THIS *
 ************************************************************************/

// set up game
Deckdle.initApp()
