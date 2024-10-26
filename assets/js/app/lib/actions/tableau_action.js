/* lib/actions/tableau_action.js */
/* class definition for TableauAction */
/* global Action */
/* eslint-disable no-unused-vars */

class TableauAction extends Action {
  constructor(colId, rowId) {
    super()
    this.type = 'tableau'
    this.colId = parseInt(colId)
    this.rowId = parseInt(rowId)
  }
}
