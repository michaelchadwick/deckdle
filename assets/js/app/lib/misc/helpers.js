/* lib/misc/helpers */
/* misc global functions */
/* global Deckdle */
/* eslint-disable no-undef */

Deckdle._sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// timestamp -> display date
Deckdle.__getFormattedDate = function (date) {
  let formatted_date = ''

  formatted_date += `${date.getFullYear()}/`
  formatted_date += `${(date.getMonth() + 1).toString().padStart(2, '0')}/` // months are 0-indexed!
  formatted_date += `${date.getDate().toString().padStart(2, '0')} `
  formatted_date += `${date.getHours().toString().padStart(2, '0')}:`
  formatted_date += `${date.getMinutes().toString().padStart(2, '0')}:`
  formatted_date += `${date.getSeconds().toString().padStart(2, '0')}`

  return formatted_date
}
Deckdle.__getTodaysDate = function () {
  const d = new Date(Date.now())
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

Deckdle.__hasParentWithMatchingSelector = function (target, selector) {
  return [...document.querySelectorAll(selector)].some(
    (el) => el !== target && el.contains(target)
  )
}

Deckdle.__getParentCard = function (el, selector) {
  var parent_container = el

  do {
    parent_container = parent_container.parentNode
  } while (
    !parent_container.matches(selector) &&
    parent_container !== document.body
  )

  return parent_container
}

Deckdle.__getRandomSetupId = function () {
  return Math.floor(Math.random() * 10000000000)
}
Deckdle.__getGameMode = function () {
  return Deckdle.settings ? Deckdle.settings.gameMode : DECKDLE_DEFAULT_GAMEMODE
}
Deckdle.__getGameType = function () {
  return Deckdle.__getState()['gameType'] ?? DECKDLE_DEFAULT_GAMETYPE
}

Deckdle.__getConfig = function () {
  return Deckdle.config || undefined
}
Deckdle.__setConfig = function (key, val) {
  Deckdle.config[key] = val
}

Deckdle.__getState = function (mode = Deckdle.__getGameMode()) {
  const rootState = Deckdle.state[mode]

  if (rootState) {
    const seshId = Deckdle.__getSessionIndex()
    const state = rootState[seshId]

    return state || undefined
  } else {
    return undefined
  }
}
Deckdle.__setState = function (
  key,
  val,
  mode = Deckdle.__getGameMode(),
  index = Deckdle.__getSessionIndex()
) {
  switch (key) {
    // case 'base':
    //   Deckdle.state[mode][index][key].push(val)
    //   break

    default:
      Deckdle.state[mode][index][key] = val
  }
}

Deckdle.__getSessionIndex = function (mode = Deckdle.__getGameMode()) {
  const rootState = Deckdle.__getStateObj(mode)
  let index = null

  if (rootState) {
    const latestSession = rootState[rootState.length - 1]

    if (Object.prototype.hasOwnProperty.call(latestSession, 'sessionIndex')) {
      index = latestSession.sessionIndex ?? 0
    } else {
      index = rootState.length ? rootState.length - 1 : 0
    }
  } else {
    index = 0
  }

  return index
}

Deckdle.__getStateObj = function (mode = Deckdle.__getGameMode()) {
  const rootState = Deckdle.state[mode]

  return rootState || undefined
}

Deckdle.__addStateObjSession = function (mode = Deckdle.__getGameMode()) {
  const rootState = Deckdle.state[mode]

  if (rootState) {
    const blankState = JSON.parse(JSON.stringify(DECKDLE_DEFAULT_STATE))
    blankState.sessionIndex = Deckdle.__getSessionIndex() + 1
    Deckdle.state[mode].push(blankState)
  } else {
    console.error(`could not add session to '${mode}' state`)
  }
}

Deckdle.__getShareText = (
  mode = Deckdle.__getGameMode(),
  type = Deckdle.__getGameType()
) => {
  let html = ''

  if (mode == 'daily') {
    html += `♦️ Deckdle DAILY #${Deckdle.dailyNumber}\n`
  } else {
    html += `♦️ Deckdle FREE id:${Deckdle.__getState()['setupId']}\n`
  }

  switch (type) {
    case 'golf': {
      const tableauCount = Deckdle._tableauCount()
      const stockCount = Deckdle._stockCount()

      if (tableauCount == 0) {
        if (stockCount == 0) {
          html += `GOLF: 0\n`
        } else if (stockCount > 0) {
          html += `GOLF: -${stockCount}\n`
        }
      } else {
        html += `GOLF: +${tableauCount + stockCount}\n`
      }
      break
    }
  }

  if (mode == 'daily') {
    html += DECKDLE_SHARE_URL
  } else {
    html += `${DECKDLE_SHARE_URL}&id=${Deckdle.__getState()['setupId']}`
  }

  return html
}

// get list of other NebyooApps from Dave
Deckdle._getNebyooApps = async function () {
  if (Deckdle.env == 'test') {
    return null
  }

  const response = await fetch(NEBYOOAPPS_SOURCE_URL)
  const json = await response.json()
  const apps = json.body
  const appList = document.querySelector('.nav-list')

  if (apps) {
    Object.values(apps).forEach((app) => {
      const appLink = document.createElement('a')
      appLink.href = app.url
      appLink.innerText = app.title
      appLink.target = '_blank'
      appList.appendChild(appLink)
    })

    // Deckdle._logStatus('[LOADED] nebyooapps')
  } else {
    console.error('Failed to load NebyooApps')
  }
}
