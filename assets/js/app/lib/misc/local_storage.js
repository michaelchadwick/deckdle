/* lib/misc/local_storage */
/* functions to interact with window.localStorage */
/* global Deckdle */

// load state from LS -> code model
Deckdle._loadGame = async function () {
  /* ************************* */
  /* settings LS -> code       */
  /* ************************* */

  Deckdle._loadSettings()

  let dailyCreateOrLoad = ''
  let freeCreateOrLoad = ''

  /* ************************* */
  /* daily state LS -> code    */
  /* ************************* */

  const lsStateDaily = JSON.parse(localStorage.getItem(DECKDLE_STATE_DAILY_LS_KEY))

  // if we have previous LS values, sync them to code model
  if (lsStateDaily && Object.keys(lsStateDaily)) {
    const dailyDefaults = DECKDLE_DEFAULTS.state.daily

    let i = 0
    lsStateDaily.forEach((lsState) => {
      Deckdle.__setState('gameState', lsState.gameState || dailyDefaults.gameState, 'daily', i)
      Deckdle.__setState('gameWon', lsState.gameWon || dailyDefaults.gameWon, 'daily', i)
      Deckdle.__setState(
        'lastCompletedTime',
        lsState.lastCompletedTime || dailyDefaults.lastCompletedTime,
        'daily',
        i
      )
      Deckdle.__setState(
        'lastPlayedTime',
        lsState.lastPlayedTime || dailyDefaults.lastPlayedTime,
        'daily',
        i
      )
      Deckdle.__setState('setupId', lsState.setupId || dailyDefaults.setupId, 'daily', i)

      Deckdle.__setState('tableau', lsState.tableau || dailyDefaults.tableau, 'daily', i)
      Deckdle.__setState('stock', lsState.stock || dailyDefaults.stock, 'daily', i)
      Deckdle.__setState('base', lsState.base || dailyDefaults.base, 'daily', i)

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

        Deckdle._saveGame('daily', '_loadGame(daily time elapsed)')

        dailyCreateOrLoad = 'create'
      }

      Deckdle.ui._updateDailyDetails(data['index'])
    } catch (e) {
      console.error('could not get daily setupId', e)
    }
  } else {
    // Deckdle._logStatus('no previous daily state found. creating new daily puzzle.')
    dailyCreateOrLoad = 'create'
  }

  /* ************************* */
  /* free state LS -> code     */
  /* ************************* */

  const lsStateFree = JSON.parse(localStorage.getItem(DECKDLE_STATE_FREE_LS_KEY))

  // if we have previous LS values, sync them to code model
  if (lsStateFree) {
    const freeDefaults = DECKDLE_DEFAULTS.state.free

    let i = 0
    lsStateFree.forEach((lsState) => {
      Deckdle.__setState('gameState', lsState.gameState || freeDefaults.gameState, 'free', i)
      Deckdle.__setState('gameWon', lsState.gameWon || freeDefaults.gameWon, 'free', i)
      Deckdle.__setState(
        'lastCompletedTime',
        lsState.lastCompletedTime || freeDefaults.lastCompletedTime,
        'free',
        i
      )
      Deckdle.__setState(
        'lastPlayedTime',
        lsState.lastPlayedTime || freeDefaults.lastPlayedTime,
        'free',
        i
      )
      Deckdle.__setState('setupId', lsState.setupId || freeDefaults.setupId, 'free', i)

      Deckdle.__setState('tableau', lsState.tableau || freeDefaults.tableau, 'free', i)
      Deckdle.__setState('stock', lsState.stock || freeDefaults.stock, 'free', i)
      Deckdle.__setState('base', lsState.base || freeDefaults.base, 'free', i)

      i++
    })

    freeCreateOrLoad = 'load'
  } else {
    // Deckdle._logStatus('no previous free state found. creating new free puzzle.')
    freeCreateOrLoad = 'create'
  }

  /* ************************* */
  /* create/load puzzle        */
  /* ************************* */

  // make sure a gameMode is set
  if (!Deckdle.settings.gameMode) {
    Deckdle.settings.gameMode = DECKDLE_DEFAULT_GAMEMODE
  }

  // daily load/create
  if (Deckdle.__getGameMode() == 'daily') {
    Deckdle.dom.dailyDetails.classList.add('show')

    if (dailyCreateOrLoad == 'load') {
      await Deckdle._loadExistingSetup('daily')

      Deckdle._logStatus('[LOADED] /app/game(daily)')
    } else {
      await Deckdle._createNewSetup('daily')

      Deckdle._logStatus('[CREATED] /app/game(daily)')
    }
  }
  // free load/create
  else {
    if (freeCreateOrLoad == 'load') {
      await Deckdle._loadExistingSetup('free')

      Deckdle._logStatus('[LOADED] /app/game(free)')
    } else {
      await Deckdle._createNewSetup('free')

      Deckdle._logStatus('[CREATED] /app/game(free)')
    }
  }

  if (Deckdle.settings.firstTime) {
    Deckdle.modalOpen('start')
  }
}
// save state from code model -> LS
Deckdle._saveGame = function (lsType, src = 'unknown') {
  switch (lsType) {
    case 'daily':
      let curDailyState = Deckdle.__getStateObj('daily')

      curDailyState.forEach((sesh) => {
        Object.keys(sesh).forEach((key) => {
          if (sesh[key] === undefined) {
            sesh[key] = null
          }
        })
      })

      localStorage.setItem(DECKDLE_STATE_DAILY_LS_KEY, JSON.stringify(curDailyState))

      break

    case 'free':
      let curFreeState = Deckdle.__getStateObj('free')

      curFreeState.forEach((sesh) => {
        Object.keys(sesh).forEach((key) => {
          if (sesh[key] === undefined) {
            sesh[key] = null
          }
        })
      })

      localStorage.setItem(DECKDLE_STATE_FREE_LS_KEY, JSON.stringify(curFreeState))

      break

    case 'settings':
      localStorage.setItem(DECKDLE_SETTINGS_LS_KEY, JSON.stringify(Deckdle.settings))

      break
  }

  // Deckdle._logStatus(`[SAVED] game(${lsType})`, src)
}

// load settings (gear icon) from localStorage
Deckdle._loadSettings = function () {
  const lsSettings = JSON.parse(localStorage.getItem(DECKDLE_SETTINGS_LS_KEY))
  let setting = null

  if (lsSettings) {
    if (lsSettings.comboCounter !== undefined) {
      Deckdle.settings.comboCounter = lsSettings.comboCounter

      if (Deckdle.settings.comboCounter) {
        Deckdle.dom.combo.classList.add('show')

        setting = document.getElementById('button-setting-combo-counter')

        if (setting) {
          setting.dataset.status = Deckdle.settings.comboCounter
        }
      }

      Deckdle.combo = 0
      Deckdle.ui._resetComboCounter()
    }

    if (lsSettings.darkMode !== undefined) {
      Deckdle.settings.darkMode = lsSettings.darkMode

      if (Deckdle.settings.darkMode) {
        document.body.classList.add('dark-mode')

        setting = document.getElementById('button-setting-dark-mode')

        if (setting) {
          setting.dataset.status = Deckdle.settings.darkMode
        }
      }
    }

    if (lsSettings.firstTime !== undefined) {
      Deckdle.settings.firstTime = lsSettings.firstTime
    }

    if (lsSettings.gameMode !== undefined) {
      Deckdle._saveSetting('gameMode', lsSettings.gameMode)
    }

    if (lsSettings.noisy !== undefined) {
      Deckdle._saveSetting('noisy', lsSettings.noisy)

      if (Deckdle.settings.noisy) {
        // create synths
        if (!Deckdle.config.synthBGM || !Deckdle.config.synthSFX) {
          Deckdle._initSynths()
        }

        setting = document.getElementById('button-setting-noisy')

        if (setting) {
          setting.dataset.status = Deckdle.settings.noisy

          const bgmSetting = document.getElementById('range-setting-bgm-level')
          if (bgmSetting) {
            bgmSetting.removeAttribute('disabled')
          }
          const sfxSetting = document.getElementById('range-setting-sfx-level')
          if (sfxSetting) {
            sfxSetting.removeAttribute('disabled')
          }
          const startBGM = document.querySelector('#button-start-music')
          if (startBGM) {
            startBGM.removeAttribute('disabled')
          }
          const stopBGM = document.querySelector('#button-stop-music')
          if (stopBGM) {
            stopBGM.removeAttribute('disabled')
          }
        }
      } else {
        const bgmSetting = document.getElementById('range-setting-bgm-level')
        if (bgmSetting) {
          bgmSetting.setAttribute('disabled', '')
        }
        const sfxSetting = document.getElementById('range-setting-sfx-level')
        if (sfxSetting) {
          sfxSetting.setAttribute('disabled', '')
        }
      }
    }

    if (lsSettings.soundBGMLevel !== undefined) {
      Deckdle._saveSetting('soundBGMLevel', lsSettings.soundBGMLevel)

      if (Deckdle.config.synthBGM) {
        Deckdle.config.synthBGM.setMasterVol(Deckdle.settings.soundBGMLevel)

        setting = document.getElementById('range-setting-bgm-level')

        if (setting) {
          setting.value = Deckdle.settings.soundBGMLevel * 100
        }
      } else {
        // console.error('no synthBGM found, so cannot set level')
      }
    }
    if (lsSettings.soundSFXLevel !== undefined) {
      Deckdle._saveSetting('soundSFXLevel', lsSettings.soundSFXLevel)

      if (Deckdle.config.synthSFX) {
        Deckdle.config.synthSFX.setMasterVol(Deckdle.settings.soundSFXLevel)

        setting = document.getElementById('range-setting-sfx-level')

        if (setting) {
          setting.value = Deckdle.settings.soundSFXLevel * 100
        }
      } else {
        // console.error('no synthSFX found, so cannot set level')
      }
    }
  } else {
    Deckdle.modalOpen('start')
  }

  // set dom status
  if (Deckdle.__getGameMode() == 'daily') {
    Deckdle.dom.interactive.gameModeDailyLink.dataset.active = true
    Deckdle.dom.interactive.gameModeFreeLink.dataset.active = false
    Deckdle.dom.dailyDetails.classList.add('show')
    Deckdle.dom.input.btnCreateNew.disabled = true
  } else {
    Deckdle.dom.interactive.gameModeDailyLink.dataset.active = false
    Deckdle.dom.interactive.gameModeFreeLink.dataset.active = true
    Deckdle.dom.dailyDetails.classList.remove('show')
    Deckdle.dom.input.btnCreateNew.disabled = false
  }

  Deckdle._logStatus('[LOADED] /app/ls(settings)')
}
// change a setting (gear icon) value
// then save to localStorage
Deckdle._changeSetting = async function (setting, value) {
  switch (setting) {
    case 'comboCounter':
      var st = document.getElementById('button-setting-combo-counter').dataset.status

      if (st == '' || st == 'false') {
        document.getElementById('button-setting-combo-counter').dataset.status = 'true'
        Deckdle.dom.combo.classList.add('show')

        Deckdle._saveSetting('comboCounter', true)
      } else {
        document.getElementById('button-setting-combo-counter').dataset.status = 'false'
        Deckdle.dom.combo.classList.remove('show')

        Deckdle._saveSetting('comboCounter', false)
      }

      Deckdle.combo = 0
      Deckdle.ui._resetComboCounter()

      break

    case 'darkMode':
      var st = document.getElementById('button-setting-dark-mode').dataset.status

      if (st == '' || st == 'false') {
        document.getElementById('button-setting-dark-mode').dataset.status = 'true'
        document.body.classList.add('dark-mode')

        Deckdle._saveSetting('darkMode', true)
      } else {
        document.getElementById('button-setting-dark-mode').dataset.status = 'false'
        document.body.classList.remove('dark-mode')

        Deckdle._saveSetting('darkMode', false)
      }

      break

    case 'gameMode':
      // if at end-state and a gameMode is clicked
      // make sure to close the open modal
      Deckdle.ui._removeModalVestige()

      if (Deckdle.__getGameMode() != value) {
        switch (value) {
          case 'daily':
            // get setupId for today
            if (!Deckdle.__getState('daily').setupId) {
              try {
                const response = await fetch(DECKDLE_DAILY_SCRIPT)
                const data = await response.json()
                Deckdle.__setState('setupId', parseInt(data['setupId']), 'daily')

                Deckdle.ui._updateDailyDetails(data['index'])
              } catch (e) {
                console.error('could not get daily setupId', e)
              }
            }

            Deckdle._saveSetting('gameMode', 'daily')

            // set dom status
            Deckdle.dom.interactive.gameModeDailyLink.dataset.active = true
            Deckdle.dom.interactive.gameModeFreeLink.dataset.active = false
            Deckdle.dom.dailyDetails.classList.add('show')
            Deckdle.dom.input.btnCreateNew.disabled = true

            Deckdle._loadGame()

            break

          case 'free':
            Deckdle._saveSetting('gameMode', 'free')

            // set dom status
            Deckdle.dom.interactive.gameModeDailyLink.dataset.active = false
            Deckdle.dom.interactive.gameModeFreeLink.dataset.active = true
            Deckdle.dom.dailyDetails.classList.remove('show')
            Deckdle.dom.input.btnCreateNew.disabled = false

            Deckdle._loadGame()

            break
        }
      }

      break

    case 'noisy':
      var st = document.getElementById('button-setting-noisy').dataset.status

      if (st == '' || st == 'false') {
        document.getElementById('button-setting-noisy').dataset.status = 'true'

        Deckdle._initSynths()

        document.querySelector('#range-setting-bgm-level').removeAttribute('disabled')
        document.querySelector('#range-setting-sfx-level').removeAttribute('disabled')

        Deckdle._saveSetting('noisy', true)
      } else {
        document.getElementById('button-setting-noisy').dataset.status = 'false'

        document.querySelector('#button-start-music').setAttribute('disabled', '')
        document.querySelector('#button-stop-music').setAttribute('disabled', '')
        document.querySelector('#range-setting-bgm-level').setAttribute('disabled', '')
        document.querySelector('#range-setting-sfx-level').setAttribute('disabled', '')

        Deckdle._saveSetting('noisy', false)
      }

      break

    case 'soundBGMLevel':
      // set config
      const newBGMLevel = parseInt(value) / 100

      if (Deckdle.config.synthBGM) {
        Deckdle.config.synthBGM.setMasterVol(newBGMLevel)
      } else {
        console.error('no synthBGM found, so cannot set level')
      }

      // save to code/LS
      Deckdle._saveSetting('soundBGMLevel', newBGMLevel)

      break

    case 'soundSFXLevel':
      // set config
      const newSFXLevel = parseInt(value) / 100

      if (Deckdle.config.synthSFX) {
        Deckdle.config.synthSFX.setMasterVol(newSFXLevel)
      } else {
        console.error('no synthSFX found, so cannot set level')
      }

      // save to code/LS
      Deckdle._saveSetting('soundSFXLevel', newSFXLevel)

      break
  }

  Deckdle._saveGame('settings', '_changeSetting')

  // Deckdle._logStatus(`[CHANGED] setting(${setting}, ${value})`)
}
// save a setting (gear icon) to localStorage
Deckdle._saveSetting = function (setting, value) {
  const settings = JSON.parse(localStorage.getItem(DECKDLE_SETTINGS_LS_KEY))

  if (settings) {
    // set internal code model
    Deckdle.settings[setting] = value

    // set temp obj that will go to LS
    settings[setting] = value

    // save all settings to LS
    localStorage.setItem(DECKDLE_SETTINGS_LS_KEY, JSON.stringify(settings))

    // Deckdle._logStatus(`[SAVED] setting(${setting}, ${value})`)
  } else {
    console.error('could not parse local storage key', DECKDLE_SETTINGS_LS_KEY)
  }
}
