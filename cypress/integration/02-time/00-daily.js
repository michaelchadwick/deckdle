/// <reference types="Cypress" />

context('02-time', () => {
  context('daily', () => {
    context('golf', () => {
      beforeEach(() => {
        cy.visit(Cypress.config().baseUrl)
      })

      xit('should have the same setup from 00:00:00 to 23:59:00', () => {
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

      xit('should change setup once midnight comes', () => {
        /*
          Pseudo-test:

          const setupIdDay1 = 0000000000
          const setupIdDay2 = 0000000001
          const tableauCards = new Puzzle(setupIdDay1)
          const setupX = {foo:foo}
          const setupY = {bar:bar}
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

          now = new Date(Date.parse("2024-01-02T00:00:00")).getTime();
  	      cy.clock(now, ["Date"]);
          tableauCards.should.be({setupY})
        */
      })
    })
  })
})
