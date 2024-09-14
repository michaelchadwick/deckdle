/// <reference types="Cypress" />

context('cards', () => {
  context('tableau', () => {
    context('golf', () => {
      beforeEach(() => {
        cy.get('#tableau .col').as('cols')
        cy.get('#tableau #col0 .card:last-of-type').as('validCard')
        cy.get('#tableau #col1 .card:last-of-type').as('invalidAvailCard')
        cy.get('#tableau #col1 .card:first-of-type').as('UnavailableCard')
        cy.get('#base .card:last-of-type').as('topBaseCard')
      })

      it('should have 7 columns', () => {
        cy.get('#tableau .col').should('have.length', 7)
      })

      it('should have available card at the bottom of each column', () => {
        cy.get('#tableau .col').each(($el) => {
          cy.wrap($el).find('.card:last-of-type').should('have.class', 'available')
        })
      })

      it.only('should highlight available card on hover', () => {
        cy.get('@validCard').should('have.css', 'border', '1px solid rgb(17, 17, 17)')
        cy.get('@validCard').focus()
        cy.get('@validCard').should('have.css', 'border', '1px dashed rgb(101, 65, 44)')

        cy.get('@validCard').blur()
        cy.get('@validCard').should('have.css', 'border', '1px solid rgb(17, 17, 17)')
      })

      it('should remove valid available card and add to base', () => {
        cy.get('@validCard').click().should('have.class', 'removed')
        cy.get('@topBaseCard')
          .should('have.attr', 'data-suit', '0')
          .should('have.attr', 'data-rank', '3')
      })

      it('should fail to remove invalid available card', () => {
        cy.get('@invalidAvailCard')
          .click()
          .should('have.class', 'available')
          .should('not.have.class', 'removed')
        cy.get('@topBaseCard')
          .should('have.attr', 'data-suit', '0')
          .should('have.attr', 'data-rank', '2')
      })

      it('should fail to remove unavailable card', () => {
        cy.get('@UnavailableCard').click({ force: true }).should('not.have.class', 'available')
        cy.get('@topBaseCard')
          .should('have.attr', 'data-suit', '0')
          .should('have.attr', 'data-rank', '2')
      })
    })
  })
})
