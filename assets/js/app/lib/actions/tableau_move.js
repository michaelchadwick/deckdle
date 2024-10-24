/* lib/actions/tableau_move.js */
/* class definition for TableauMove */
/* global Move */
/* eslint-disable no-unused-vars */

class TableauMove extends Move {
  constructor(colId, rowId) {
    super()
    this.type = 'tableau'
    this.colId = parseInt(colId)
    this.rowId = parseInt(rowId)
  }
}
