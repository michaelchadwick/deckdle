import './commands'

beforeEach(() => {
  const defaultLocalStorageObj = {
    firstTime: false,
  }

  // Set the last-visited date so that the how to play modal doesn't display
  localStorage.setItem('deckdle-settings', JSON.stringify(defaultLocalStorageObj))

  cy.visit(Cypress.config().baseUrl)
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
})
