/// <reference types="Cypress" />

context('modals', () => {
  context('help', () => {
    beforeEach(() => {
      cy.get('#button-help').click()
    })

    it('should load help modal', () => {
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
    })

    after(() => {
      cy.get('.modal-close').click()
      cy.get('dialog.modal-dialog').should('not.exist')
    })
  })
})
