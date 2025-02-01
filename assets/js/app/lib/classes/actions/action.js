/* class definition for Action */
/* eslint-disable no-unused-vars */

class Action {
  constructor(type) {
    this.type = type
  }

  show = () => {
    return this.constructor.name.toString()
  }
}
