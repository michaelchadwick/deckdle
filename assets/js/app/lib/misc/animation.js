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

Deckdle.__winAnimation = async function () {
  Deckdle._logStatus('__winAnimation started')
  return new Promise((resolve) => {
    Deckdle._animateCSS('#base', 'tada')

    setTimeout(() => resolve('__winAnimation ended'), 1000)
  })
}

Deckdle.__loseAnimationShake = async function () {
  Deckdle._logStatus('__loseAnimationShake started')
  return new Promise((resolve) => {
    const tableauCardArray = Array.from(Deckdle.dom.interactive.tableau.querySelector('.card'))

    tableauCardArray.forEach((card) => card.style.setProperty('--animate-duration', '1000ms'))

    setTimeout(() => Deckdle._animateCSS('#tableau #col0', 'shakeX'), 0)
    setTimeout(() => Deckdle._animateCSS('#tableau #col1', 'shakeX'), 70)
    setTimeout(() => Deckdle._animateCSS('#tableau #col2', 'shakeX'), 140)
    setTimeout(() => Deckdle._animateCSS('#tableau #col3', 'shakeX'), 200)
    setTimeout(() => Deckdle._animateCSS('#tableau #col4', 'shakeX'), 250)
    setTimeout(() => Deckdle._animateCSS('#tableau #col5', 'shakeX'), 285)
    setTimeout(() => Deckdle._animateCSS('#tableau #col6', 'shakeX'), 300)

    setTimeout(() => Deckdle._animateCSS('#stock', 'shakeX'), 330)
    setTimeout(() => Deckdle._animateCSS('#base', 'shakeX'), 350)

    setTimeout(() => resolve('__loseAnimationShake ended'), 1000)
  })
}

Deckdle.__loseAnimationFade = async function () {
  Deckdle._logStatus('__loseAnimationFade started')
  return new Promise((resolve) => {
    const tableauCardArray = Array.from(Deckdle.dom.interactive.tableau.querySelectorAll('.card'))

    tableauCardArray.forEach((card) => {
      setTimeout(() => card.classList.remove('disabled'), 1)
      setTimeout(() => card.classList.add('disabled'), 2)
      card.setAttribute('disabled', true)
    })

    const baseCardTop = Deckdle.dom.interactive.base.querySelector('.card:last-of-type')

    setTimeout(() => baseCardTop.classList.remove('disabled'), 3)
    setTimeout(() => baseCardTop.classList.add('disabled'), 4)
    baseCardTop.setAttribute('disabled', true)

    setTimeout(() => {
      resolve('__loseAnimationFade ended')
    }, 1000)
  })
}

Deckdle.__resetCardsDuration = function () {
  Array.from(Deckdle.dom.interactive.tableau).forEach((card) =>
    card.style.setProperty('--animate-duration', '100ms')
  )
}
