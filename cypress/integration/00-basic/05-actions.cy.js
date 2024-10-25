context('00-basic', () => {
  context('actions', () => {
    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl)

      cy.get('#tableau #col0 .card.available').as('validCol0Card')
      cy.get('#stock .card:last-of-type').as('stockTopCard')
      cy.get('#base .card:last-of-type').as('baseTopCard')
      cy.get('#button-undo-move').as('buttonUndo')
    })

    it('should create a StockAction when the stock is clicked', () => {
      cy.get('@stockTopCard').click()

      const action = {
        type: 'stock',
      }

      cy.wait(100).then(() => {
        const ls = JSON.parse(localStorage.getItem('deckdle-state-daily'))[0]
        const lsLastAction = ls.actions[0]

        cy.wrap(lsLastAction.type).should('eq', action.type)
      })
    })

    it('should create a TableauAction when a valid tableau card is clicked', () => {
      cy.get('@validCol0Card').click()

      const action = {
        type: 'tableau',
        colId: 0,
        rowId: 4,
      }

      cy.wait(100).then(() => {
        const ls = JSON.parse(localStorage.getItem('deckdle-state-daily'))[0]
        const lsLastAction = ls.actions[0]

        cy.wrap(lsLastAction.type).should('eq', action.type)
        cy.wrap(lsLastAction.colId).should('eq', action.colId)
        cy.wrap(lsLastAction.rowId).should('eq', action.rowId)
      })
    })

    it('should create an UndoAction when the undo button is clicked', () => {
      cy.get('@validCol0Card').click()
      cy.get('@buttonUndo').click()

      const action1 = {
        type: 'tableau',
        colId: 0,
        rowId: 4,
      }
      const action2 = {
        type: 'undo',
      }

      cy.wait(100).then(() => {
        const ls = JSON.parse(localStorage.getItem('deckdle-state-daily'))[0]
        const lsAction1 = ls.actions[0]
        const lsAction2 = ls.actions[1]

        cy.wrap(lsAction1.type).should('eq', action1.type)
        cy.wrap(lsAction1.colId).should('eq', action1.colId)
        cy.wrap(lsAction1.rowId).should('eq', action1.rowId)

        cy.wrap(lsAction2.type).should('eq', action2.type)
      })
    })
  })
})
