/// <reference types="Cypress" />

context('00-basic', () => {
  context('modals', () => {
    context('settings', () => {
      beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)

        cy.get('#button-settings').click()
        cy.get('dialog.modal-dialog .modal-window .modal-text').as('text')
        cy.get('dialog.modal-dialog .modal-window .modal-text .switch').as('switches')
      })

      it('should load settings modal', () => {
        cy.get('dialog.modal-dialog').should('exist')
        cy.get('dialog.modal-dialog .modal-window').should('exist')
        cy.get('dialog.modal-dialog .modal-window .modal-title').should('contain.text', 'Settings')

        cy.get('@text').find('.setting-row').should('have.length', 5)
        cy.get('@switches').should('have.length', 3)
      })

      it('should toggle all switch-type settings', () => {
        cy.get('@switches').each(($el) => {
          cy.wrap($el).should('have.attr', 'data-status')
          cy.wrap($el).click()
          cy.wrap($el).should('have.attr', 'data-status', 'true')

          if ($el[0].id == 'button-setting-noisy') {
            cy.get('#range-setting-bgm-level').should('not.be.disabled')
            cy.get('#range-setting-sfx-level').should('not.be.disabled')
          } else {
            cy.get('#range-setting-bgm-level').should('be.disabled')
            cy.get('#range-setting-sfx-level').should('be.disabled')
          }

          cy.wrap($el).click()
          cy.wrap($el).should('have.attr', 'data-status', 'false')
        })
      })

      after(() => {
        cy.get('.modal-close').click()
        cy.get('dialog.modal-dialog').should('not.exist')
      })
    })
  })
})
