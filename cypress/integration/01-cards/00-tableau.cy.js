/// <reference types="Cypress" />

context('01-cards', () => {
  context('tableau', () => {
    context('golf', () => {
      const TABLEAU_COL_COUNT = 7
      const TABLEAU_CARD_MAX_COUNT = 35

      beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)

        cy.get('#tableau-count .count').as('tableauCount')
        cy.get('#tableau .col').as('cols')
        cy.get('#tableau .card').as('cards')
        cy.get('#tableau #col0 .card:last-of-type').as('validCard')
        cy.get('#tableau #col1 .card:last-of-type').as('invalidAvailCard')
        cy.get('#tableau #col1 .card:first-of-type').as('UnavailableCard')
        cy.get('#base .card:last-of-type').as('baseTopCard')
      })

      it('should have 7 columns', () => {
        cy.get('@cols').should('have.length', TABLEAU_COL_COUNT)
      })

      it('should have 35 cards', () => {
        cy.get('@cards').should('have.length', TABLEAU_CARD_MAX_COUNT)
        cy.get('@tableauCount').should('have.text', TABLEAU_CARD_MAX_COUNT.toString())
      })

      it('should have available card at the bottom of each column', () => {
        cy.get('@cols').each(($el) => {
          cy.wrap($el).find('.card:last-of-type').should('have.class', 'available')
        })
      })

      it('should highlight available card on hover', () => {
        cy.get('@validCard').should('have.css', 'border', '1px solid rgb(17, 17, 17)')
        cy.get('@validCard').focus()
        cy.get('@validCard').should('have.css', 'border', '1px dashed rgb(101, 65, 44)')

        cy.get('@validCard').blur()
        cy.get('@validCard').should('have.css', 'border', '1px solid rgb(17, 17, 17)')
      })

      it('should remove valid available card and add to base', () => {
        cy.get('@validCard').click().should('have.class', 'removed')
        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '3')
      })

      it('should fail to remove invalid available card', () => {
        cy.get('@invalidAvailCard')
          .click()
          .should('have.class', 'available')
          .should('not.have.class', 'removed')
        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '2')
      })

      it('should fail to remove unavailable card', () => {
        cy.get('@UnavailableCard').click({ force: true }).should('not.have.class', 'available')
        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '2')
      })
    })
  })
})
