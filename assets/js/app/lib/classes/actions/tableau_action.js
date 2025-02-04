/* class definition for TableauAction */
/* global Deckdle, Action */
/* eslint-disable no-unused-vars */

class TableauAction extends Action {
  constructor(col, row, tableau) {
    super()
    this.type = 'tableau'
    this.card = Deckdle._getTableauCardAtPos(col, row)
    this.colId = parseInt(col)
    this.rowId = parseInt(row)
  }

  show = () => {
    return `${this.constructor.name.toString()}(${this.colId}: ${this.card.show()})`
  }
}
