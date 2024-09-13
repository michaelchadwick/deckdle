/// <reference types="Cypress" />

context('anon', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load web app have correct global components', () => {
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

  it('should load a tableau with 35 cards', () => {
    cy.get('#tableau .col .card').should('have.length', 35)
  })

  it('should load a stock with 16 cards', () => {
    cy.get('#user-cards #stock .card').should('have.length', 16)
  })

  it('should load a base with 1 card', () => {
    cy.get('#user-cards #base .card').should('have.length', 1)
  })

  it('should load daily golf if no saved progress', () => {
    cy.get('#game #mode-container #gamemode-container #gamemode-0').should(
      'have.attr',
      'data-active',
      'true'
    )
    cy.get('#game #mode-container #gamemode-container #gamemode-1').should(
      'have.attr',
      'data-active',
      'false'
    )
    cy.get('#game #mode-container #daily-details').should('exist')

    cy.get('#game #game-type').should('have.text', 'golf')
  })
})
