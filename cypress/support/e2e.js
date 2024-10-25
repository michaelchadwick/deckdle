import './commands'
import 'cypress-real-events'

beforeEach(() => {
  // Check firstTime flag so 'Help' modal doesn't display
  const settings = {
    animationDisplay: false,
    firstTime: false,
    gameMode: 'daily',
  }
  localStorage.setItem('deckdle-settings', JSON.stringify(settings))

  // intercept NebyooApps api requests
  cy.intercept('GET', 'https://dave.neb.host/?sites', {
    body: [
      {
        title: 'NebApp 1',
        url: 'https://nebapp1.neb.host',
      },
      {
        title: 'NebApp 2',
        url: 'https://nebapp2.neb.host',
      },
    ],
    contentType: null,
    customType: 'server',
    error: false,
    message: '',
    status: 200,
    statusText: 'OK',
  }).as('daveSites')
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
