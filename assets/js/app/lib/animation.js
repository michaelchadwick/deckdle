/* lib/misc/animation */
/* using Animate.CSS to add and remove animations from things */
/* global Deckdle */

Deckdle._animateCSS = (element, animation, loop, prefix = 'animate__') => {
  // We create a Promise and return it
  return new Promise((resolve) => {
    const animationName = `${prefix}${animation}`
    const node = document.querySelector(element)

    node.classList.add(`${prefix}animated`, animationName)

    if (loop) {
      node.classList.add(`${prefix}infinite`)
    }

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation()
      node.classList.remove(`${prefix}animated`, `${prefix}infinite`, animationName)
      resolve('Animation ended')
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true })
  })
}

Deckdle._winAnimation = async (debug = false) => {
  Deckdle._logStatus('[ANIM] _winAnimation started')
  return new Promise((resolve) => {
    Deckdle._animateCSS('#base', 'tada')

    if (!debug) {
      Deckdle.ui._disableUI()
    }

    setTimeout(() => resolve('[ANIM] _winAnimation ended'), 1000)
  })
}

Deckdle._loseAnimation = async (debug = false) => {
  Deckdle._logStatus('[ANIM] _loseAnimation started')
  return new Promise((resolve) => {
    Deckdle.ui._disableUI()

    setTimeout(() => {
      resolve('[ANIM] _loseAnimation ended')

      if (debug) {
        Deckdle.ui._enableUI()
      }
    }, 1000)
  })
}

Deckdle._resetCardsDuration = () => {
  Array.from(Deckdle.dom.interactive.tableau).forEach((card) =>
    card.style.setProperty('--animate-duration', '100ms')
  )
}
