/// <reference types="Cypress" />

context('anon', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load front page and have correct title', () => {
    cy.get('#game')
      .should('exist')
    cy.title()
      .should('include', 'Deckdle')
  })
})
