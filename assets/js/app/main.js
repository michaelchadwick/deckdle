/* main */
/* app entry point and main functions */
/* global Deckdle */

// settings: saved in LOCAL STORAGE
Deckdle.settings = {}

// config: only saved while game is loaded
Deckdle.config = DECKDLE_DEFAULTS.config

// state: saved between sessions in LOCAL STORAGE
Deckdle.state = DECKDLE_DEFAULTS.state

if (!localStorage.getItem(DECKDLE_SETTINGS_LS_KEY)) {
  localStorage.setItem(DECKDLE_SETTINGS_LS_KEY, JSON.stringify(DECKDLE_DEFAULTS.settings))
}

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

    case 'loading':
      this.myModal = new Modal(
        'throbber',
        'Loading',
        'loading...',
        null,
        null,
        false
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

    case 'game-over-win':
      const stockCount = Deckdle.__getState()['stock'].length
      if (stockCount > 0) {
        modalText = `
          You won with a score of ${stockCount} UNDER par! :-D
        `
      } else {
        modalText = `
          You won with a score of par. :-)
        `
      }

      this.myModal = new Modal('perm', 'Game Over (Win)', modalText, null, null)

      Deckdle._playSFX('win')

      break

    case 'game-over-lose':
      modalText = `
        You lost with a score of ${Deckdle._tableauCount()} OVER par. :-(
      `

      this.myModal = new Modal('perm', 'Game Over (Lose)', modalText, null, null)

      Deckdle._playSFX('lose')

      break

    case 'win-game':
      this.myModal = new Modal('temp', null, 'Congratulations!', null, null)
      break

    case 'win-game-hax':
      this.myModal = new Modal(
        'temp',
        null,
        'Hacking the game, I see',
        null,
        null
      )
      break
  }
}

// start the engine
Deckdle.initApp = async () => {
  // set env
  const hasHostname = DECKDLE_ENV_PROD_URL.includes(document.location.hostname)

  Deckdle.env = hasHostname ? 'prod' : 'local'

  // if local dev, show debug stuff
  if (Deckdle.env == 'local') {
    Deckdle._initDebug()

    if (!document.title.includes('(LH) ')) {
      document.title = '(LH) ' + document.title
    }
  }

  Deckdle._attachEventListeners()

  // lib/ui.js
  Deckdle.ui._updateGameType()

  Deckdle._getNebyooApps()

  // lib/localStorage.js
  Deckdle._loadGame()
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

// create new setupId, which resets progress
Deckdle._createNewSetup = async function (gameMode, setupId = null) {
  // set config to defaults
  Deckdle.__setConfig('foo', [], gameMode)

  // set state to defaults
  Deckdle.__setState('base', [], gameMode)
  Deckdle.__setState('gameState', 'IN_PROGRESS', gameMode)
  Deckdle.__setState('gameType', DECKDLE_DEFAULT_GAMETYPE, gameMode)
  Deckdle.__setState('gameWon', false, gameMode)
  Deckdle.__setState('lastCompletedTime', null, gameMode)
  Deckdle.__setState('lastPlayedTime', null, gameMode)
  Deckdle.__setState('stock', [], gameMode)
  Deckdle.__setState('tableau', {}, gameMode)

  // get setupId
  if (gameMode == 'free') {
    if (!setupId) {
      try {
        setupId = await Deckdle.__getNewSetupId()
      } catch (err) {
        console.error('could not get new setupId', err)
      }
    }
  } else {
    // 'daily' always uses day hash
    try {
      const response = await fetch(DECKDLE_DAILY_SCRIPT)
      const data = await response.json()
      setupId = data['setupId']

      Deckdle.__updateDailyDetails(data['index'])

      if (!setupId) {
        console.error('daily setupId went bork', setupId)
      }
    } catch (e) {
      console.error('could not get daily setupId', e)
    }
  }

  // set gameMode's state setupId
  Deckdle.__setState('setupId', setupId, gameMode)
  Deckdle._saveGame()

  // create Deckdle puzzle
  try {
    const puzzle = await Deckdle.__createPuzzle(
      Deckdle.__getState(gameMode).setupId
    )

    if (puzzle) {
      // clear everything
      Deckdle._emptyPlayingField()

      // fill DOM cards
      Deckdle._fillCards()
    }
  } catch (err) {
    console.error('could not create new puzzle', err)
  }
}

// load existing setupId, which retains past progress
Deckdle._loadExistingSetup = async function (gameMode, setupId = null) {
  // set config to defaults
  Deckdle.__setConfig('foo', [], gameMode)

  // new game with static seed word
  if (gameMode == 'free') {
    if (!setupId) {
      try {
        setupId = await Deckdle.__getNewSetupId()
      } catch (err) {
        console.error('could not get new setupId', err)
      }
    }
  } else {
    // 'daily' always uses day hash
    try {
      const response = await fetch(DECKDLE_DAILY_SCRIPT)
      const data = await response.json()
      setupId = data['setupId']

      Deckdle.__updateDailyDetails(data['index'])

      if (!setupId) {
        console.error('daily setupId went bork', setupId)
      }
    } catch (e) {
      console.error('could not get daily setupId', e)
    }
  }

  // set gameMode's state setupId
  Deckdle.__setState('setupId', setupId, gameMode)
  Deckdle._saveGame()

  // load existing solutionSet
  try {
    const puzzle = await Deckdle.__createPuzzle(
      Deckdle.__getState(gameMode).setupId
    )

    if (puzzle) {
      let lsState = null

      if (Deckdle.__getGameMode() == 'daily') {
        lsState = JSON.parse(localStorage.getItem(DECKDLE_STATE_DAILY_LS_KEY))
      } else {
        lsState = JSON.parse(localStorage.getItem(DECKDLE_STATE_FREE_LS_KEY))
      }

      Deckdle.__setState('guessedWords', [], gameMode)

      if (
        lsState[Deckdle.__getSessionIndex()].guessedWords &&
        lsState[Deckdle.__getSessionIndex()].guessedWords.length
      ) {
        lsState[Deckdle.__getSessionIndex()].guessedWords.forEach((word) => {
          Deckdle.__getState().guessedWords.push(word)
          Deckdle.__getConfig().solutionSet[word.length][word] = 1
        })

        // set score to existing number of guessedWords
        Deckdle._setScore(Deckdle.__getState(gameMode).guessedWords.length)
      } else {
        Deckdle._setScore(0)
      }

      // fill DOM cards
      Deckdle._fillCards()

      // see if we've already won
      Deckdle._checkWinState()
    }
  } catch (err) {
    console.error('could not create puzzle', err)
  }
}

// ask to create new free gamemode puzzle
Deckdle._confirmFreeCreateNew = async function () {
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

  // set score to 0
  Deckdle._setScore(0)

  // re-enable DOM inputs
  Deckdle._resetInput()

  // fill DOM cards
  Deckdle._fillCards()

  // save those defaults to localStorage
  Deckdle._saveGame()
}

// game state checking
Deckdle._checkWinState = function () {
  // console.log('checking win state...')

  // tableau exhausted
  if (Deckdle._tableauCount() == 0) {
    Deckdle.modalOpen('game-over-win')
  }
  // stock exhausted and no valid tableau card
  else if (
    Deckdle.__getState().stock.length == 0 &&
    !Deckdle._tableauHasValidCard()
  ) {
    Deckdle.modalOpen('game-over-lose')
  }
}

Deckdle._emptyPlayingField = function () {
  // clear tableau, stock, base
  Deckdle.dom.interactive.tableau.replaceChildren()
  Deckdle.dom.interactive.stock.querySelectorAll('.card').forEach(card => card.remove())
  Deckdle.dom.interactive.base.querySelectorAll('.card').forEach(card => card.remove())
}

Deckdle._fillCards = function () {
  // create <div id="tableau"><div class="col"> * 7</div>
  for (let i = 0; i < 7; i++) {
    const col = document.createElement('div')
    col.classList.add('col')
    col.id = `col${i}`
    Deckdle.dom.interactive.tableau.appendChild(col)
  }

  const tableauCards = Deckdle.__getState()['tableau']

  let colId = 0

  // fill tableau UI with cards
  Object.keys(tableauCards).forEach(col => {
    Object.values(tableauCards[col]).forEach((card, index) => {
      if (index == 4) {
        Deckdle.ui._addCardToTableau(
          card,
          colId,
          classes = ['available', 'animate__animated', 'animate__slideInDown']
        )
      } else {
        Deckdle.ui._addCardToTableau(
          card,
          colId,
          classes = ['animate__animated', 'animate__slideInDown']
        )
      }
    })

    colId++
  })

  Deckdle.dom.tableauCount.innerText = Deckdle._tableauCount()

  // fill stock UI with leftover cards
  Deckdle.__getState()['stock'].forEach(card => {
    Deckdle.ui._addCardToStock(card)
  })

  Deckdle._moveCardFromStockToBase()

  Deckdle.dom.stockCount.innerText = Deckdle.__getState()['stock'].length
  Deckdle.dom.baseCount.innerText = Deckdle.__getState()['base'].length
}

// copy results to clipboard for sharing
Deckdle._shareResults = async function (type = 'completion') {
  let shareText = ''
  const size = Deckdle.__getSolutionSize()
  const hints = Deckdle.__getHintsUsed()

  if (type == 'completion') {
    shareText += `🧩 Deckdle #${Deckdle.dailyNumber}\n${size}/${size} words, ${hints} hints\n`
    shareText += DECKDLE_SHARE_URL
  } else if (type == 'pangram') {
    shareText += `🧩 Deckdle #${Deckdle.dailyNumber}\nPangram found!\n`
    shareText += DECKDLE_SHARE_URL
  }

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

Deckdle.__createPuzzle = async (setupId, type = 'golf') => {
  // console.log(`new '${Deckdle.__getGameMode()}' Puzzle(${setupId}, '${type}')`)

  try {
    return new Puzzle(setupId, (type = 'golf'))
  } catch (err) {
    console.error('new Puzzle() failed', err)
  }
}

/************************************************************************
 * ON PAGE LOAD, DO THIS *
 ************************************************************************/

// set up game
Deckdle.initApp()
