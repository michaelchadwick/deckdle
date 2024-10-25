context('00-basic', () => {
  context('combo', () => {
    const COL_CARD_MAX = 5

    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl)

      // Turn on comboCounter so we can test it
      let settings = JSON.parse(localStorage.getItem('deckdle-settings'))
      settings.comboCounter = true
      localStorage.setItem('deckdle-settings', JSON.stringify(settings))

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

    xit('should show correct x2 multiplier when two valid cards are played in a row', () => {
      for (let i = 0; i < 2; i++) {
        cy.get('@validCol0Card').click({ force: true, multiple: true })
      }
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '2')
        .should('have.attr', 'data-rank', '4')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x2')
    })

    xit('should show correct x(n*5) multiplier when an appropriate combo is achieved', () => {
      // exhaust col0
      cy.get('@validCol0Card').click()
      for (let i = 0; i < COL_CARD_MAX - 1; i++) {
        cy.get('@validCol0Card').click({ force: true, multiple: true })
      }
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '2')
        .should('have.attr', 'data-rank', '7')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x5')

      // exhaust col1
      cy.get('@validCol1Card').click()
      for (let i = 0; i < COL_CARD_MAX - 1; i++) {
        cy.get('@validCol1Card').click({ force: true, multiple: true })
      }
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '2')
        .should('have.attr', 'data-rank', '12')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x10')

      // exhaust col2
      cy.get('@validCol2Card').click()
      for (let i = 0; i < COL_CARD_MAX - 1; i++) {
        cy.get('@validCol2Card').click({ force: true, multiple: true })
      }
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '3')
        .should('have.attr', 'data-rank', '4')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x15')

      // exhaust col3
      cy.get('@validCol3Card').click()
      for (let i = 0; i < COL_CARD_MAX - 1; i++) {
        cy.get('@validCol3Card').click({ force: true, multiple: true })
      }
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '3')
        .should('have.attr', 'data-rank', '9')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x20')

      // exhaust col4
      cy.get('@validCol4Card').click()
      for (let i = 0; i < COL_CARD_MAX - 1; i++) {
        cy.get('@validCol4Card').click({ force: true, multiple: true })
      }
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '3')
        .should('have.attr', 'data-rank', '14')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x25')

      // exhaust col5
      cy.get('@validCol5Card').click()
      for (let i = 0; i < COL_CARD_MAX - 1; i++) {
        cy.get('@validCol5Card').click({ force: true, multiple: true })
      }
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '0')
        .should('have.attr', 'data-rank', '6')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x30')

      // exhaust col6
      cy.get('@validCol6Card').click()
      for (let i = 0; i < COL_CARD_MAX - 1; i++) {
        cy.get('@validCol6Card').click({ force: true, multiple: true })
      }
      cy.get('@topBaseCard')
        .should('have.attr', 'data-suit', '0')
        .should('have.attr', 'data-rank', '11')

      cy.get('@combo').should('be.visible')
      cy.get('@comboMult').should('have.text', 'x35')
    })
  })
})
