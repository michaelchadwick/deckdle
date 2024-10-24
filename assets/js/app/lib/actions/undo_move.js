/* lib/actions/undo_move.js */
/* class definition for UndoMove */
/* global Move */
/* eslint-disable no-unused-vars */

class UndoMove extends Move {
  constructor() {
    super()
    this.type = 'undo'
  }
}
