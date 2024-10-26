context('00-basic', () => {
  context('undo', () => {
    context('golf', () => {
      const TABLEAU_CARD_MAX_COUNT = 35

      beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)

        cy.get('#tableau-count .count').as('tableauCount')
        cy.get('#tableau .card:not(.removed)').as('potentialCards')
        cy.get('#tableau #col0 .card.available').as('validCol0Card')

        cy.get('#base .card:last-of-type').as('baseTopCard')
        cy.get('#button-undo-move').as('buttonUndo')
      })

      it('should undo a move', () => {
        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '2')
        cy.get('@validCol0Card')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '3')
        cy.get('@potentialCards').should('have.length', TABLEAU_CARD_MAX_COUNT)
        cy.get('@tableauCount').should('have.text', TABLEAU_CARD_MAX_COUNT.toString())

        cy.get('@validCol0Card').click()

        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '3')
        cy.get('@validCol0Card')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '4')
        cy.get('@potentialCards').should('have.length', TABLEAU_CARD_MAX_COUNT - 1)
        cy.get('@tableauCount').should('have.text', (TABLEAU_CARD_MAX_COUNT - 1).toString())

        cy.get('@buttonUndo').click()

        cy.get('@baseTopCard')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '2')
        cy.get('@validCol0Card')
          .should('have.attr', 'data-suit', '2')
          .should('have.attr', 'data-rank', '3')
        cy.get('@potentialCards').should('have.length', TABLEAU_CARD_MAX_COUNT)
        cy.get('@tableauCount').should('have.text', TABLEAU_CARD_MAX_COUNT.toString())
      })
    })
  })
})
