context('00-basic', () => {
  context('combo', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl)
      cy.get('#combo').as('combo')
      cy.get('#combo .text').as('comboMult')
      cy.get('#tableau #col0 .card.available').as('validCol0Card')
      cy.get('#tableau #col1 .card.available').as('validCol1Card')
      cy.get('#tableau #col2 .card.available').as('validCol2Card')
      cy.get('#tableau #col3 .card.available').as('validCol3Card')
      cy.get('#tableau #col4 .card.available').as('validCol4Card')
      cy.get('#tableau #col5 .card.available').as('validCol5Card')
      cy.get('#tableau #col6 .card.available').as('validCol6Card')
      cy.get('#base .card:last-of-type').as('topBaseCard')
    })

    it('should show no combo meter on load', () => {
      cy.get('@combo').should('not.be.visible')
    })

    xit('should show x2 combo meter when a combo of 2 cards is achieved', () => {
      cy.get('@validCol0Card').click()
      cy.get('@validCol0Card').click({ force: true })
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '2')
        .should('have.attr', 'data-rank', '4')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x2')
    })

    xit('should show x5 combo meter when a combo of 5 cards is achieved', () => {
      cy.get('@validCol0Card').click()
      cy.get('@validCol0Card').click({ force: true })
      cy.get('@validCol0Card').click({ force: true })
      cy.get('@validCol0Card').click({ force: true })
      cy.get('@validCol0Card').click({ force: true })
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '2')
        .should('have.attr', 'data-rank', '7')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x5')
    })
  })
})
