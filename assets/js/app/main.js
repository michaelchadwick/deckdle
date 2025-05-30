/* app entry point and main functions */
/* global Deckdle */
/* eslint-disable no-undef */

// settings: saved in LOCAL STORAGE
Deckdle.settings = { ...DECKDLE_DEFAULTS.settings }

// config: only saved while game is loaded
Deckdle.config = { ...DECKDLE_DEFAULTS.config }

// state: saved between sessions in LOCAL STORAGE
Deckdle.state = { ...DECKDLE_DEFAULTS.state }

/*************************************************************************
 * public methods *
 *************************************************************************/

// start the engine
Deckdle.initApp = async () => {
  if (window.Cypress) {
    Deckdle.env = 'test'

    Deckdle.dom.headerTitle += ' (TEST)'
  }
  // if local dev, show debug stuff
  if (Deckdle.env == 'local') {
    Deckdle._initDebug()

    if (!document.title.includes('(LH) ')) {
      document.title = '(LH) ' + document.title
    }
  }
  // if loading from omni.neb.host
  if (document.referrer.indexOf('omni.neb.host') >= 0) {
    Deckdle._clearLocalStorage(false)
  }

  Deckdle._getNebyooApps()

  // load free game from specific setupId
  const gameId = Deckdle._loadQueryString('id')
  if (gameId) {
    await Deckdle._createNewSetup('free', gameId)
  } else {
    await Deckdle._loadGame()
  }

  Deckdle.ui._resetComboCounter()
  Deckdle.ui._updateGameType()

  if (Deckdle._isBaseEmpty()) {
    Deckdle._moveCardFromStockToBase()
  }

  Deckdle._attachEventListeners()

  Deckdle._logStatus('[LOADED] /app/main')
}

/*************************************************************************
 * _private methods *
 *************************************************************************/

// create new setupId, which resets progress
Deckdle._createNewSetup = async (gameMode, qsId = null) => {
  let setupId = null

  // if we have finished the current game
  // create a new element in the LS array
  if (Deckdle.__getState().gameState == 'GAME_OVER') {
    // Deckdle._logStatus('[INFO] old setup finished, so creating new session')
    Deckdle._createNewSession()
  } else {
    // Deckdle._logStatus('[INFO] old setup never created or finished, so re-using session')
  }

  Deckdle.__setState('gameState', 'IN_PROGRESS', gameMode)

  setupId = await Deckdle.__createSetupId(gameMode, qsId)

  Deckdle.__setState('setupId', setupId, gameMode)

  // create new Deckdle puzzle
  const puzzle = Deckdle.__createPuzzle(Deckdle.__getState(gameMode).setupId, gameMode)

  Deckdle.__setState('tableau', puzzle.tableau)
  Deckdle.__setState('stock', puzzle.stock)
  Deckdle.__setState('base', puzzle.base)

  Deckdle._logStatus(
    `[CREATED] '${gameMode}' Puzzle from id: '${setupId}', shuffled ${puzzle.shuffleCount} time(s)`,
    puzzle
  )

  Deckdle._saveGame('_createNewSetup', gameMode)

  // fill UI with beautiful cards
  Deckdle.ui._emptyPlayingField()
  Deckdle.ui._dealCards((animate = true))

  if (Deckdle._isBaseEmpty()) {
    const noMoveInPrevGame =
      Deckdle.__getActionCount() == 1 && Deckdle.__getActions()[0].type == 'stock'
    Deckdle._moveCardFromStockToBase(noMoveInPrevGame)
  }

  // Deckdle._logStatus('[CREATE-NEW] setting Deckdle.comboCurrent to 0')
  Deckdle.comboCurrent = 0
  // Deckdle.ui._resetComboCounter()

  Deckdle.ui._enableUI()
}

// load existing setupId, which retains past progress
Deckdle._loadExistingSetup = async (gameMode) => {
  // 'daily' always uses day hash
  if (gameMode == 'daily') {
    // if we are testing, we don't need to grab a hash
    // and instead setupId is already set, like free play
    if (Deckdle.env != 'test') {
      try {
        const response = await fetch(DECKDLE_DAILY_SCRIPT)
        const data = await response.json()
        const setupId = parseInt(data['setupId'])

        Deckdle.ui._updateDailyDetails(data['index'])

        if (!setupId) {
          console.error('retrieval of daily setupId went bork', setupId)
        } else {
          // Deckdle._logStatus('daily setupId was successfully retrieved')
          Deckdle.__setState('setupId', setupId, gameMode)
        }
      } catch (e) {
        console.error('could not get daily setupId', e)
      }
    }
  }
  // free uses current state, so nothing to do

  // load existing Deckdle puzzle from tableau/stock
  const puzzle = Deckdle.__loadPuzzle(
    Deckdle.__getState()['setupId'],
    Deckdle.__getState()['gameType'],
    Deckdle.__getState()
  )

  Deckdle.__setState('tableau', puzzle.tableau)
  Deckdle.__setState('stock', puzzle.stock)
  Deckdle.__setState('base', puzzle.base)

  Deckdle._logStatus(`[LOADED] '${gameMode}' Puzzle from existing card setup`, puzzle)

  // fill UI with beautiful cards
  Deckdle.ui._emptyPlayingField()
  Deckdle.ui._dealCards()

  if (!Deckdle._stockCount()) {
    Deckdle.dom.interactive.stock.appendChild(Deckdle.ui._createEmptyCard())
  }

  Deckdle.ui._resetComboCounter()

  // see if we've already won
  Deckdle._checkWinState()
}

Deckdle._createNewFree = async () => {
  await Deckdle._createNewSetup('free')

  Deckdle.ui._removeModalVestige()
}

// ask to create new free gamemode puzzle
Deckdle._confirmNewFree = async () => {
  if (Deckdle.myModal) {
    Deckdle.myModal._destroyModal()
  }

  Deckdle.myModal = new Modal(
    'confirm',
    'Create New Free Play Puzzle?',
    'Are you sure you want to create a new free play puzzle?',
    'Yes, please',
    'No, never mind'
  )

  const confirmed = await Deckdle.myModal.question()

  if (confirmed) {
    await Deckdle._createNewSetup('free')
  }

  Deckdle.ui._removeModalVestige()
}

// game state checking
Deckdle._checkWinState = () => {
  // Deckdle._logStatus('checking win state...')

  const gameState = Deckdle.__getState().gameState

  if (gameState != 'GAME_OVER_REPLAY') {
    Deckdle.__setState('lastPlayedTime', new Date().getTime())
  }

  // tableau exhausted
  if (Deckdle._tableauCount() == 0) {
    if (gameState != 'GAME_OVER_REPLAY') {
      Deckdle.__setState('gameState', 'GAME_OVER')
      Deckdle.__setState('lastCompletedTime', new Date().getTime())
    }

    Deckdle._winAnimation().then(() => {
      if (gameState == 'GAME_OVER_REPLAY') {
        Deckdle.modalOpen('game-over-replay')
      } else {
        Deckdle.modalOpen('game-over')
      }
    })
  }
  // stock exhausted and no valid tableau card
  else if (Deckdle.__getState().stock.length == 0 && !Deckdle._tableauHasValidCard()) {
    if (gameState != 'GAME_OVER_REPLAY') {
      Deckdle.__setState('gameState', 'GAME_OVER')
      Deckdle.__setState('lastCompletedTime', new Date().getTime())
    }

    Deckdle._loseAnimation().then((msg) => {
      Deckdle._logStatus(msg)

      if (gameState == 'GAME_OVER_REPLAY') {
        Deckdle.modalOpen('game-over-replay')
      } else {
        Deckdle.modalOpen('game-over')
      }
    })
  }

  if (gameState != 'GAME_OVER_REPLAY') {
    Deckdle._saveGame('_checkWinState')
  }
}

Deckdle._loadQueryString = (param) => {
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
Deckdle._shareResults = async () => {
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

Deckdle._replayGame = async () => {
  Deckdle._logStatus('replaying game')

  if (Deckdle.myModal) {
    Deckdle.myModal._destroyModal()
  }

  Deckdle.__setState('gameState', 'GAME_OVER_REPLAY')

  // re-create current Deckdle puzzle
  const gameMode = Deckdle.__getGameMode()
  const setupId = Deckdle.__getState(gameMode).setupId
  const puzzle = Deckdle.__createPuzzle(setupId, gameMode)

  Deckdle.__setState('tableau', puzzle.tableau)
  Deckdle.__setState('stock', puzzle.stock)
  Deckdle.__setState('base', puzzle.base)

  Deckdle._logStatus(`[RE-CREATED] '${gameMode}' Puzzle from id: '${setupId}'`, puzzle)

  // fill UI with beautiful cards
  Deckdle.ui._emptyPlayingField()
  Deckdle.ui._dealCards((animate = true))

  if (Deckdle._isBaseEmpty()) {
    Deckdle._moveCardFromStockToBase()
  }

  // Deckdle._logStatus('[REPLAY] setting Deckdle.comboCurrent to 0')
  Deckdle.comboCurrent = 0
  Deckdle.ui._resetComboCounter()

  // enable the UI, but put it into `replay-mode` so it looks distinct
  Deckdle.ui._enableUI((replay = true))
}

Deckdle._reload = () => {
  location.reload()
}

/************************************************************************
 * _private __helper methods *
 ************************************************************************/

Deckdle.__createPuzzle = (setupId, type = DECKDLE_DEFAULT_GAMETYPE) => {
  return new Puzzle(setupId, type)
}

Deckdle.__loadPuzzle = (setupId, type = DECKDLE_DEFAULT_GAMETYPE, state) => {
  return new Puzzle(setupId, type, state)
}

/************************************************************************
 * ON PAGE LOAD, DO THIS *
 ************************************************************************/

// set up game
Deckdle.initApp()
