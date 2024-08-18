/* lib/helpers */
/* misc global functions */
/* global Deckdle */

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

  return `${days[d.getDay()]}, ${
    months[d.getMonth()]
  } ${d.getDate()}, ${d.getFullYear()}`
}

Deckdle.__hasParentWithMatchingSelector = function (target, selector) {
  return [...document.querySelectorAll(selector)].some(el =>
    el !== target && el.contains(target)
  )
}

Deckdle.__getParentCard = function (el, selector) {
  var parent_container = el;

  do {
    parent_container = parent_container.parentNode;
  }

  while (!parent_container.matches(selector) && parent_container !== document.body);

  return parent_container;
}

Deckdle.__getRandomSetupId = function () {
  return Math.floor(Math.random() * 10000000000)
}
Deckdle.__getGameMode = function () {
  return Deckdle.settings ? Deckdle.settings.gameMode : DECKDLE_DEFAULTS.settings.gameMode
}

Deckdle.__getConfig = function () {
  return Deckdle.config || undefined
}
Deckdle.__setConfig = function (key, val) {
  Deckdle.config[key] = val

  Deckdle._saveGame('__setConfig')
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

  // Deckdle._saveGame(`__setState(${key}, ${val})`)
  Deckdle._saveGame()

  // if (key == 'base') {
  //   console.log(`__setState(${key})`, val)
  //   console.log('Deckdle.__getState()["base"]', Deckdle.__getState()['base'])
  // }
}

Deckdle.__getStateObj = function (mode = Deckdle.__getGameMode()) {
  const rootState = Deckdle.state[mode]

  return rootState || undefined
}
Deckdle.__getSessionIndex = function (mode = Deckdle.__getGameMode()) {
  const rootState = Deckdle.state[mode]

  return rootState ? rootState.length - 1 : 0
}

// get list of other NebyooApps from Dave
Deckdle._getNebyooApps = async function () {
  const response = await fetch(NEBYOOAPPS_SOURCE_URL)
  const json = await response.json()
  const apps = json.body
  const appList = document.querySelector('.nav-list')

  Object.values(apps).forEach((app) => {
    const appLink = document.createElement('a')
    appLink.href = app.url
    appLink.innerText = app.title
    appLink.target = '_blank'
    appList.appendChild(appLink)
  })

  // Deckdle._logStatus('[LOADED] nebyooapps')
}
