/* lib/localStorage */
/* functions to interact with window.localStorage */
/* global Deckdle */

// load state from LS -> code model
Deckdle._loadGame = async function () {
  let dailyCreateOrLoad = ''
  let freeCreateOrLoad = ''

  /* ************************* */
  /* daily state LS -> code    */
  /* ************************* */

  const lsStateDaily = JSON.parse(
    localStorage.getItem(DECKDLE_STATE_DAILY_LS_KEY)
  )

  // if we have previous LS values, sync them to code model
  if (lsStateDaily && Object.keys(lsStateDaily)) {
    const dailyDefaults = DECKDLE_DEFAULTS.state.daily

    let i = 0
    lsStateDaily.forEach((lsState) => {
      Deckdle.__setState(
        'gameState',
        lsState.gameState || dailyDefaults.gameState,
        'daily',
        i
      )
      Deckdle.__setState('gameWon', lsState.gameWon || false, 'daily', i)
      Deckdle.__setState(
        'lastCompletedTime',
        lsState.lastCompletedTime || null,
        'daily',
        i
      )
      Deckdle.__setState(
        'lastPlayedTime',
        lsState.lastPlayedTime || null,
        'daily',
        i
      )
      Deckdle.__setState(
        'setupId',
        lsState.setupId || dailyDefaults.setupId,
        'daily',
        i
      )

      i++
    })

    // special case for daily word: need to check
    // to make sure time hasn't elapsed on saved progress
    try {
      const response = await fetch(DECKDLE_DAILY_SCRIPT)
      const data = await response.json()
      const dailySetupId = data['setupId']

      // saved setupId and daily setupId are the same? still working on it
      if (dailySetupId == lsStateDaily[Deckdle.__getSessionIndex()].setupId) {
        Deckdle.__setState(
          'gameState',
          lsStateDaily[Deckdle.__getSessionIndex()].gameState,
          'daily'
        )
        Deckdle.__setState(
          'guessedWords',
          lsStateDaily[Deckdle.__getSessionIndex()].guessedWords,
          'daily'
        )

        dailyCreateOrLoad = 'load'
      }
      // time has elapsed on daily puzzle, and new one is needed
      else {
        Deckdle.__setState('gameState', 'IN_PROGRESS', 'daily')

        Deckdle._saveGame()

        dailyCreateOrLoad = 'create'
      }

      Deckdle.__updateDailyDetails(data['index'])
    } catch (e) {
      console.error('could not get daily setupId', e)
    }
  } else {
    dailyCreateOrLoad = 'create'
  }

  /* ************************* */
  /* free state LS -> code     */
  /* ************************* */

  const lsStateFree = JSON.parse(
    localStorage.getItem(DECKDLE_STATE_FREE_LS_KEY)
  )

  // if we have previous LS values, sync them to code model
  if (lsStateFree && Object.keys(lsStateFree)) {
    const freeDefaults = DECKDLE_DEFAULTS.state.free

    let i = 0
    lsStateFree.forEach((lsState) => {
      Deckdle.__setState(
        'gameState',
        lsState.gameState || freeDefaults.gameState,
        'free',
        i
      )
      Deckdle.__setState('gameWon', lsState.gameWon || false, 'free', i)
      Deckdle.__setState(
        'lastPlayedTime',
        lsState.lastPlayedTime || null,
        'free',
        i
      )
      Deckdle.__setState(
        'setupId',
        lsState.setupId || freeDefaults.setupId,
        'free',
        i
      )

      i++
    })

    freeCreateOrLoad = 'load'
  } else {
    freeCreateOrLoad = 'create'
  }

  /* ************************* */
  /* settings LS -> code       */
  /* ************************* */

  Deckdle._loadSettings()

  /* ************************* */
  /* create/load solutionSet   */
  /* ************************* */

  if (!Deckdle.settings.gameMode) {
    Deckdle.settings.gameMode = 'daily'
  }

  if (Deckdle.__getGameMode() == 'daily') {
    // daily
    Deckdle.dom.dailyDetails.classList.add('show')

    if (dailyCreateOrLoad == 'load') {
      await Deckdle._loadExistingSetup(
        'daily',
        Deckdle.__getState('daily').setupId
      )
    } else {
      await Deckdle._createNewSetup('daily')
    }
  } else {
    // free
    if (freeCreateOrLoad == 'load') {
      await Deckdle._loadExistingSetup(
        'free',
        Deckdle.__getState('free').setupId
      )
    } else {
      await Deckdle._createNewSetup('free')
    }
  }

  if (
    Deckdle.__getGameMode() == 'daily' &&
    !Deckdle.__getState('daily').lastPlayedTime
  ) {
    if (Deckdle.settings.firstTime) {
      Deckdle.modalOpen('start')

      Deckdle._saveSetting('firstTime', false)
    }
  }
}
// save state from code model -> LS
Deckdle._saveGame = function () {
  return false

  // save daily game state
  let curDailyState = Deckdle.__getStateObj('daily')

  curDailyState.forEach((sesh) => {
    Object.keys(sesh).forEach((key) => {
      if (sesh[key] === undefined) {
        sesh[key] = null
      }
    })
  })

  try {
    localStorage.setItem(
      DECKDLE_STATE_DAILY_LS_KEY,
      JSON.stringify(curDailyState)
    )
  } catch (error) {
    console.error('localStorage DAILY state save failed', error)
  }

  // save free game state
  let curFreeState = Deckdle.__getStateObj('free')

  curFreeState.forEach((sesh) => {
    Object.keys(sesh).forEach((key) => {
      if (sesh[key] === undefined) {
        sesh[key] = null
      }
    })
  })

  try {
    localStorage.setItem(
      DECKDLE_STATE_FREE_LS_KEY,
      JSON.stringify(curFreeState)
    )
  } catch (error) {
    console.error('localStorage FREE state save failed', error)
  }

  // save global game settings
  try {
    localStorage.setItem(
      DECKDLE_SETTINGS_LS_KEY,
      JSON.stringify(Deckdle.settings)
    )
  } catch (error) {
    console.error('localStorage global settings save failed', error)
  }
}

// load settings (gear icon) from localStorage
Deckdle._loadSettings = async function () {
  const lsSettings = JSON.parse(localStorage.getItem(DECKDLE_SETTINGS_LS_KEY))

  if (lsSettings && Object.keys(lsSettings)) {
    if (lsSettings.darkMode !== undefined) {
      Deckdle.settings.darkMode = lsSettings.darkMode

      if (Deckdle.settings.darkMode) {
        document.body.classList.add('dark-mode')

        const setting = document.getElementById('button-setting-dark-mode')

        if (setting) {
          setting.dataset.status = 'true'
        }
      }
    }

    if (lsSettings.firstTime !== undefined) {
      Deckdle.settings.firstTime = lsSettings.firstTime
    }

    if (lsSettings.gameMode !== undefined) {
      Deckdle.settings.gameMode = lsSettings.gameMode || 'daily'
    }

    if (lsSettings.noisy !== undefined) {
      Deckdle.settings.noisy = lsSettings.noisy || false

      if (Deckdle.settings.noisy) {
        // create synths
        if (!Deckdle.config.synthBGM || !Deckdle.config.synthSFX) {
          Deckdle._initSynths()
        }

        const setting = document.getElementById('button-setting-noisy')

        if (setting) {
          setting.dataset.status = Deckdle.settings.noisy
        }
      }
    }
  } else {
    Deckdle.settings = DECKDLE_DEFAULTS.settings
  }

  // STATE->GAMEMODE
  if (Deckdle.__getGameMode() == 'free') {
    Deckdle.dom.interactive.gameModeDailyLink.dataset.active = false
    Deckdle.dom.interactive.gameModeFreeLink.dataset.active = true
    Deckdle.dom.dailyDetails.classList.remove('show')
    Deckdle.dom.keyboard.btnCreateNew.disabled = false
  }
}
// change a setting (gear icon or difficulty) value
// then save to localStorage
Deckdle._changeSetting = async function (setting, value, event) {
  switch (setting) {
    case 'gameMode':
      switch (value) {
        case 'daily':
          // get setupId for today
          if (!Deckdle.__getState('daily').setupId) {
            try {
              const response = await fetch(DECKDLE_DAILY_SCRIPT)
              const data = await response.json()
              Deckdle.__setState('daily', 'setupId', data['word'])

              Deckdle.__updateDailyDetails(data['index'])
            } catch (e) {
              console.error('could not get daily word', e)
            }
          }

          Deckdle._saveSetting('gameMode', 'daily')
          Deckdle._clearHint()

          Deckdle.dom.interactive.btnCreateNew.disabled = true

          // set dom status
          Deckdle.dom.interactive.gameModeDailyLink.dataset.active = true
          Deckdle.dom.interactive.gameModeFreeLink.dataset.active = false
          Deckdle.dom.interactive.difficultyContainer.classList.remove('show')
          Deckdle.dom.dailyDetails.classList.add('show')

          await Deckdle._loadExistingSetup(
            'daily',
            Deckdle.__getState('daily').setupId
          )

          Deckdle._saveGame()

          break

        case 'free':
          Deckdle._saveSetting('gameMode', 'free')
          Deckdle._clearHint()
          Deckdle._enableUIButtons()

          Deckdle.dom.interactive.btnCreateNew.disabled = false

          // set dom status
          Deckdle.dom.interactive.gameModeDailyLink.dataset.active = false
          Deckdle.dom.interactive.gameModeFreeLink.dataset.active = true
          Deckdle.dom.interactive.difficultyContainer.classList.add('show')
          Deckdle.dom.dailyDetails.classList.remove('show')

          await Deckdle._loadExistingSetup(
            'free',
            Deckdle.__getState('free').setupId
          )

          Deckdle._saveGame()

          break
      }

      break

    case 'darkMode':
      var st = document.getElementById('button-setting-dark-mode').dataset
        .status

      if (st == '' || st == 'false') {
        document.getElementById('button-setting-dark-mode').dataset.status =
          'true'
        document.body.classList.add('dark-mode')

        Deckdle._saveSetting('darkMode', true)
      } else {
        document.getElementById('button-setting-dark-mode').dataset.status =
          'false'
        document.body.classList.remove('dark-mode')

        Deckdle._saveSetting('darkMode', false)
      }

      break

    case 'noisy':
      var st = document.getElementById('button-setting-noisy').dataset.status

      if (st == '' || st == 'false') {
        document.getElementById('button-setting-noisy').dataset.status = 'true'

        Deckdle._initSynths()

        Deckdle._saveSetting('noisy', true)
      } else {
        document.getElementById('button-setting-noisy').dataset.status = 'false'

        Deckdle.dom.keyboard.btnStartMusic.setAttribute('disabled', '')
        Deckdle.dom.keyboard.btnStopMusic.setAttribute('disabled', '')

        Deckdle._saveSetting('noisy', false)
      }

      break
  }
}
// save a setting (gear icon) to localStorage
Deckdle._saveSetting = function (key, value) {
  const settings = JSON.parse(localStorage.getItem(DECKDLE_SETTINGS_LS_KEY))

  // set temp obj that will go to LS
  settings[key] = value
  // set internal code model
  Deckdle.settings[key] = value

  localStorage.setItem(DECKDLE_SETTINGS_LS_KEY, JSON.stringify(settings))
}

// functions for modal win/stats
Deckdle._getGameCount = function (mode) {
  let ls = null

  if (mode == 'free') {
    ls = JSON.parse(localStorage.getItem(DECKDLE_STATE_FREE_LS_KEY))
  } else {
    ls = JSON.parse(localStorage.getItem(DECKDLE_STATE_DAILY_LS_KEY))
  }

  if (ls.length) {
    return ls.filter((key) => key.gameWon == true).length
  } else {
    return 0
  }
}
