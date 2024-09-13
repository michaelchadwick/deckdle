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

Deckdle._winAnimation = async function (debug = false) {
  Deckdle._logStatus('_winAnimation started')
  return new Promise((resolve) => {
    Deckdle._animateCSS('#base', 'tada')

    if (!debug) {
      Deckdle._disableUI()
    }

    setTimeout(() => resolve('_winAnimation ended'), 1000)
  })
}

Deckdle._loseAnimationFade = async function (debug = false) {
  Deckdle._logStatus('_loseAnimationFade started')
  return new Promise((resolve) => {
    Deckdle._disableUI()

    setTimeout(() => {
      resolve('_loseAnimationFade ended')

      if (debug) {
        Deckdle._enableUI()
      }
    }, 1000)
  })
}

Deckdle._disableUI = function () {
  // Deckdle._logStatus('disabling UI')

  setTimeout(() => Deckdle.dom.cardsContainer.classList.remove('disabled'), 0)
  setTimeout(() => Deckdle.dom.cardsContainer.classList.add('disabled'), 5)

  const tableauCardArray = Array.from(Deckdle.dom.interactive.tableau.querySelectorAll('.card'))

  tableauCardArray.forEach((card) => {
    setTimeout(() => card.classList.remove('disabled'), 0)
    setTimeout(() => card.classList.add('disabled'), 5)
    card.setAttribute('disabled', true)
  })

  setTimeout(() => Deckdle.dom.userCards.classList.remove('disabled'), 0)
  setTimeout(() => Deckdle.dom.userCards.classList.add('disabled'), 5)

  const stockCardTop = Deckdle.dom.interactive.stock.querySelector('.card:last-of-type')

  setTimeout(() => stockCardTop.classList.remove('disabled'), 0)
  setTimeout(() => stockCardTop.classList.add('disabled'), 5)
  stockCardTop.setAttribute('disabled', true)

  const baseCardTop = Deckdle.dom.interactive.base.querySelector('.card:last-of-type')

  setTimeout(() => baseCardTop.classList.remove('disabled'), 0)
  setTimeout(() => baseCardTop.classList.add('disabled'), 5)
  baseCardTop.setAttribute('disabled', true)

  Deckdle.dom.input.btnUndoMove.disabled = true
}

Deckdle._enableUI = function () {
  // Deckdle._logStatus('enabling UI')

  Deckdle.dom.cardsContainer.classList.remove('disabled')
  Deckdle.dom.userCards.classList.remove('disabled')

  const tableauCardArray = Array.from(Deckdle.dom.interactive.tableau.querySelectorAll('.card'))

  tableauCardArray.forEach((card) => {
    card.classList.remove('disabled')
    card.setAttribute('disabled', false)
  })

  const stockCardTop = Deckdle.dom.interactive.stock.querySelector('.card:last-of-type')

  stockCardTop.classList.remove('disabled')
  stockCardTop.setAttribute('disabled', false)

  const baseCardTop = Deckdle.dom.interactive.base.querySelector('.card:last-of-type')

  baseCardTop.classList.remove('disabled')
  baseCardTop.setAttribute('disabled', false)
}

Deckdle._resetCardsDuration = function () {
  Array.from(Deckdle.dom.interactive.tableau).forEach((card) =>
    card.style.setProperty('--animate-duration', '100ms')
  )
}
