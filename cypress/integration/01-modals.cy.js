/// <reference types="Cypress" />

context('anon', () => {
  it('should load help modal and close properly', () => {
    cy.get('#button-help').click()

    cy.get('dialog.modal-dialog').should('exist')
    cy.get('dialog.modal-dialog .modal-window').should('exist')
    cy.get('dialog.modal-dialog .modal-window .modal-title').should(
      'contain.text',
      'How to Play Deckdle'
    )

    cy.get('.modal-close').click()
    cy.get('dialog.modal-dialog').should('not.exist')
  })

  it('should load stats modal and close properly', () => {
    cy.get('#button-stats').click()

    cy.get('dialog.modal-dialog').should('exist')
    cy.get('dialog.modal-dialog .modal-window').should('exist')
    cy.get('dialog.modal-dialog .modal-window .modal-title').should('contain.text', 'Statistics')

    cy.get('.modal-close').click()
    cy.get('dialog.modal-dialog').should('not.exist')
  })

  it('should load settings modal and close properly', () => {
    cy.get('#button-settings').click()

    cy.get('dialog.modal-dialog').should('exist')
    cy.get('dialog.modal-dialog .modal-window').should('exist')
    cy.get('dialog.modal-dialog .modal-window .modal-title').should('contain.text', 'Settings')

    cy.get('.modal-close').click()
    cy.get('dialog.modal-dialog').should('not.exist')
  })
})
