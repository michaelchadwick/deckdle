/// <reference types="Cypress" />

context('00-basic', () => {
  context('init', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl)
    })

    it('should load web app with correct global components', () => {
      cy.title().should('include', 'Deckdle')

      cy.get('header').should('exist')
      cy.get('header #nav-links').should('exist')
      cy.get('header #button-help').should('exist')
      cy.get('header #button-stats').should('exist')
      cy.get('header #button-settings').should('exist')

      cy.get('#game').should('exist')
      cy.get('#game #mode-container').should('exist')
      cy.get('#game #mode-container #gamemode-container').should('exist')

      cy.get('#game #game-type').should('exist')

      cy.get('#game #cards-container').should('exist')
      cy.get('#game #tableau').should('exist')
      cy.get('#game #tableau-count').should('exist')

      cy.get('#game #user-cards').should('exist')
      cy.get('#game #user-cards #stock').should('exist')
      cy.get('#game #user-cards #base').should('exist')

      cy.get('#game #keyboard-container').should('exist')
      cy.get('#game #keyboard-container #button-undo-move').should('exist')
      cy.get('#game #keyboard-container #button-undo-move').should('have.attr', 'disabled')
    })
  })
})
