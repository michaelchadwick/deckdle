/* audio */
/* using Animate.CSS to add and remove animations from things */
/* global Deckdle */

Deckdle._animateCSS = (element, animation, loop, prefix = 'animate__') => {
  // We create a Promise and return it
  return new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`
    const node = document.querySelector(element)

    node.classList.add(`${prefix}animated`, animationName)

    if (loop) {
      node.classList.add(`${prefix}infinite`)
    }

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation()
      node.classList.remove(
        `${prefix}animated`,
        `${prefix}infinite`,
        animationName
      )
      resolve('Animation ended')
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true })
  })
}

Deckdle.__winAnimation = async function () {
  return new Promise((resolve, reject) => {
    Array.from(Deckdle.dom.interactive.tableau).forEach((card) =>
      card.style.setProperty('--animate-duration', '1000ms')
    )

    setTimeout(() => Deckdle._animateCSS('#tableau #row0', 'bounce'), 0)
    setTimeout(() => Deckdle._animateCSS('#tableau #row1', 'bounce'), 100)
    setTimeout(() => Deckdle._animateCSS('#tableau #row2', 'bounce'), 200)
    setTimeout(() => Deckdle._animateCSS('#tableau #row3', 'bounce'), 300)
    setTimeout(() => Deckdle._animateCSS('#tableau #row4', 'bounce'), 400)

    setTimeout(() => resolve('__winAnimation ended'), 1000)
  })
}

Deckdle.__resetCardsDuration = function () {
  Array.from(Deckdle.dom.interactive.tableau).forEach((card) =>
    card.style.setProperty('--animate-duration', '100ms')
  )
}