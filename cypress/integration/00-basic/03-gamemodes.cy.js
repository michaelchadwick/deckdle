context('00-basic', () => {
  context('gamemodes', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl)
      cy.get('#game #mode-container #gamemode-container #gamemode-0').as('dailyModeLink')
      cy.get('#game #mode-container #gamemode-container #gamemode-1').as('freeModeLink')
      cy.get('#game #mode-container #daily-details').as('dailyDetails')
    })

    it('should load daily golf', () => {
      cy.get('@dailyModeLink').should('have.attr', 'data-active', 'true')
      cy.get('@freeModeLink').should('have.attr', 'data-active', 'false')
      cy.get('@dailyDetails').should('exist')

      cy.get('#game #game-type').should('have.text', 'golf')
    })

    it('should switch to free play and back to daily', () => {
      cy.get('@dailyDetails').should('have.class', 'show')
      cy.get('@dailyModeLink').should('have.attr', 'data-active', 'true')
      cy.get('@freeModeLink').should('have.attr', 'data-active', 'false')

      cy.get('@freeModeLink').click()

      cy.get('@dailyDetails').should('not.have.class', 'show')
      cy.get('@dailyModeLink').should('have.attr', 'data-active', 'false')
      cy.get('@freeModeLink').should('have.attr', 'data-active', 'true')

      cy.get('@dailyModeLink').click()

      cy.get('@dailyDetails').should('have.class', 'show')
      cy.get('@dailyModeLink').should('have.attr', 'data-active', 'true')
      cy.get('@freeModeLink').should('have.attr', 'data-active', 'false')
    })
  })
})
