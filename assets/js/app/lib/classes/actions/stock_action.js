/* class definition for StockAction */
/* global Action */
/* eslint-disable no-unused-vars */

class StockAction extends Action {
  constructor(card) {
    super()
    this.type = 'stock'
    this.card = card
  }

  show = () => {
    return `${this.constructor.name.toString()}(${this.card.show()})`
  }
}
