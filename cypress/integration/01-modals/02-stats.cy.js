/// <reference types="Cypress" />

context('modals', () => {
  context('stats', () => {
    beforeEach(() => {
      cy.get('#button-stats').click()
    })

    it('should load stats modal', () => {
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
    })

    after(() => {
      cy.get('.modal-close').click()
      cy.get('dialog.modal-dialog').should('not.exist')
    })
  })
})
