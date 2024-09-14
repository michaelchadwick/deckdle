/// <reference types="Cypress" />

context('modals', () => {
  context('navapps', () => {
    beforeEach(() => {
      cy.get('#button-nav').click()
    })

    it('should load navapps modal', () => {
      cy.get('#nav-overlay').should('exist').should('have.class', 'show')
      cy.get('#nav-overlay').find('.nav-header').should('have.text', 'More Apps By Neb')
      cy.get('#nav-overlay').find('.nav-list a').should('have.length', 8)
      cy.get('#nav-overlay')
        .find('.nav-footer')
        .should('exist')
        .find('#footer-neb-host')
        .should('exist')
    })

    after(() => {
      cy.get('#button-nav-close').click()
      cy.get('#nav-overlay').should('not.have.class', 'show')
    })
  })
})
