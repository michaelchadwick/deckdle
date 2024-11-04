/// <reference types="Cypress" />

context('02-time', () => {
  context('free', () => {
    context('golf', () => {
      beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)
      })

      xit('should have the same setup until a new game is created', () => {
        /*
          Pseudo-test:

          const setupIdDay1 = 0000000000
          const tableauCards = new Puzzle(setupIdDay1)
          const setupX = {foo:foo}
          let now

          now = new Date(Date.parse("2024-01-01T00:00:00")).getTime();
  	      cy.clock(now, ["Date"]);
          tableauCards.should.be({setupX})

          now = new Date(Date.parse("2024-01-01T12:00:00")).getTime();
  	      cy.clock(now, ["Date"]);
          tableauCards.should.be({setupX})

          now = new Date(Date.parse("2024-01-01T19:00:00")).getTime();
  	      cy.clock(now, ["Date"]);
          tableauCards.should.be({setupX})

          now = new Date(Date.parse("2024-01-01T23:59:59")).getTime();
  	      cy.clock(now, ["Date"]);
          tableauCards.should.be({setupX})
        */
      })
    })
  })
})
