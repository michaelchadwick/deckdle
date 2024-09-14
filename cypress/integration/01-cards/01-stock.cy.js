/// <reference types="Cypress" />

context('01-cards', () => {
  context('stock', () => {
    context('golf', () => {
      const STOCK_MAX_COUNT = 16

      beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)

        cy.get('#stock').as('stock')
        cy.get('#stock .card').as('stockCards')
        cy.get('#stock .card:last-of-type').as('stockTopCard')
        cy.get('#base').as('base')
        cy.get('#base .card').as('baseCards')
        cy.get('#base .card:last-of-type').as('baseTopCard')
      })

      it('should begin with 16 cards', () => {
        cy.get('@stockCards').should('have.length', STOCK_MAX_COUNT)
      })

      it('should have a back card on top', () => {
        cy.get('@stockTopCard').should('have.class', 'back')
      })

      it('should remove top card and add to base', () => {
        cy.get('@stockTopCard').click()
        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '0')
          .should('have.attr', 'data-rank', '12')
      })

      it('should fail to remove when empty', () => {
        for (let i = 0; i < STOCK_MAX_COUNT; i++) {
          cy.get('@stockTopCard').click()
        }

        cy.get('@stockTopCard').click()
        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '1')
          .should('have.attr', 'data-rank', '14')
      })
    })
  })
})
