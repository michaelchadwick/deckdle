/// <reference types="Cypress" />

context('anon', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load web app and have correct components', () => {
    cy.title().should('include', 'Deckdle')

    cy.get('header').should('exist')
    cy.get('header #nav-links').should('exist')
    cy.get('header #button-help').should('exist')
    cy.get('header #button-stats').should('exist')
    cy.get('header #button-settings').should('exist')

    cy.get('#game').should('exist')
    cy.get('#game #game-type').should('exist')
    cy.get('#game #cards-container').should('exist')
    cy.get('#game #tableau').should('exist')
    cy.get('#game #tableau-count').should('exist')
    cy.get('#game #user-cards').should('exist')
    cy.get('#game #user-cards #stock').should('exist')
    cy.get('#game #user-cards #base').should('exist')
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
})
