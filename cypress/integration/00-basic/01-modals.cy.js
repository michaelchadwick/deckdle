/// <reference types="Cypress" />

context('00-basic', () => {
  context('modals', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl)
    })

    it('should load navapps modal', () => {
      cy.get('#button-nav').click()

      cy.get('#nav-overlay').should('exist').should('have.class', 'show')
      cy.get('#nav-overlay').find('.nav-header').should('have.text', 'More Apps By Neb')
      cy.get('#nav-overlay').find('.nav-list a').should('have.length', 8)
      cy.get('#nav-overlay')
        .find('.nav-footer')
        .should('exist')
        .find('#footer-neb-host')
        .should('exist')

      cy.get('#button-nav-close').click()
      cy.get('#nav-overlay').should('not.have.class', 'show')
    })

    it('should load help modal', () => {
      cy.get('#button-help').click()

      cy.get('dialog.modal-dialog').should('exist')
      cy.get('dialog.modal-dialog .modal-window').should('exist')
      cy.get('dialog.modal-dialog .modal-window .modal-title').should(
        'contain.text',
        'How to Play Deckdle'
      )
      cy.get('dialog.modal-dialog .modal-window .modal-text').should(
        'contain.text',
        'Deckdle is a daily solitaire card game'
      )
      cy.get('dialog.modal-dialog .modal-window .modal-text').should(
        'contain.text',
        'Exhaust the tableau (the top grid of cards) onto your base (bottom-right stack) before your stock (bottom-left stack) runs out.'
      )

      cy.get('.modal-close').click()
      cy.get('dialog.modal-dialog').should('not.exist')
    })

    it('should load stats modal', () => {
      cy.get('#button-stats').click()

      cy.get('dialog.modal-dialog').should('exist')
      cy.get('dialog.modal-dialog .modal-window').should('exist')
      cy.get('dialog.modal-dialog .modal-window .modal-title').should('contain.text', 'Statistics')
      cy.get('dialog.modal-dialog .modal-window .modal-text .container .statistic-header').should(
        'have.length',
        2
      )
      cy.get('dialog.modal-dialog .modal-window .modal-text .container .statistics').should(
        'have.length',
        2
      )
      cy.get(
        'dialog.modal-dialog .modal-window .modal-text .container .statistics .statistic'
      ).should('not.be.empty')

      cy.get('.modal-close').click()
      cy.get('dialog.modal-dialog').should('not.exist')
    })
  })
})
