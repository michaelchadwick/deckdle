import './commands'
import 'cypress-real-events'

beforeEach(() => {
  // Check firstTime flag so 'Help' modal doesn't display
  const settings = {
    firstTime: false,
    gameMode: 'free',
  }
  localStorage.setItem('deckdle-settings', JSON.stringify(settings))

  cy.visit(Cypress.config().baseUrl)
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
