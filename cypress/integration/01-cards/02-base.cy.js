/// <reference types="Cypress" />

context('01-cards', () => {
  context('base', () => {
    context('golf', () => {
      const BASE_MIN_COUNT = 1
      const BASE_MAX_COUNT = 52

      beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)

        cy.get('#base').as('base')
        cy.get('#base .card-label').as('baseCount')
        cy.get('#base .card').as('baseCards')
        cy.get('#base .card:last-of-type').as('baseTopCard')
      })

      it('should begin with 2 of hearts card', () => {
        cy.get('@baseCards').should('have.length', BASE_MIN_COUNT)
        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '2')

        cy.get('@baseCount').should('contain.text', BASE_MIN_COUNT.toString())
      })
    })
  })
})
