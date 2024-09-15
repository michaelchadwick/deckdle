/* events */
/* adds event listeners to dom */
/* global Deckdle */

// user clicks a card (stock or tableau)
Deckdle._onCardClick = function (card) {
  if (card.parentElement.id == 'stock') {
    Deckdle._onStockClick()
  } else if (card.parentElement.parentElement.id == 'stock') {
    Deckdle._onStockClick()
  } else if (card.parentElement.id == 'tableau') {
    Deckdle._onTableauClick(card, card.id, card.dataset.row)
  } else if (card.parentElement.parentElement.id == 'tableau') {
    Deckdle._onTableauClick(card, card.parentElement.id, card.dataset.row)
  }
}

// handle both clicks and touches outside of modals
Deckdle._handleClickTouch = function (event) {
  const dialog = document.getElementsByClassName('modal-dialog')[0]
  const elem = event.target

  if (dialog) {
    const isConfirm = dialog.classList.contains('modal-confirm')
    const isShareLink = event.target.classList.contains('share')
    // const isEndState = dialog.classList.contains('end-state')

    // only close if not a confirmation or share link!
    if (elem == dialog && !isConfirm && !isShareLink) {
      dialog.remove()
    }
  }
  // capture card click/touch and send meta to handler
  else {
    if (elem == Deckdle.dom.navOverlay) {
      Deckdle.dom.navOverlay.classList.toggle('show')
    } else if (event.target.classList.contains('card')) {
      event.preventDefault()
      Deckdle._onCardClick(elem)
    } else if (Deckdle.__hasParentWithMatchingSelector(elem, '.card')) {
      event.preventDefault()
      Deckdle._onCardClick(Deckdle.__getParentCard(elem, '.card'))
    } else {
      // console.log('something with no handler was clicked/touched', elem)
    }
  }
}

Deckdle._attachEventListeners = function () {
  // {} header icons to open modals
  Deckdle.dom.interactive.btnNav.addEventListener('click', () => {
    Deckdle.dom.navOverlay.classList.toggle('show')
  })
  Deckdle.dom.interactive.btnNavClose.addEventListener('click', () => {
    Deckdle.dom.navOverlay.classList.toggle('show')
  })
  Deckdle.dom.interactive.btnHelp.addEventListener('click', () => Deckdle.modalOpen('help'))
  Deckdle.dom.interactive.btnStats.addEventListener('click', () => Deckdle.modalOpen('stats'))
  Deckdle.dom.interactive.btnSettings.addEventListener('click', () => Deckdle.modalOpen('settings'))

  // ⎌ undo last move
  Deckdle.dom.input.btnUndoMove.addEventListener('click', () => {
    Deckdle._undoLastTableauMove()
  })
  // + create new free game
  Deckdle.dom.input.btnCreateNew.addEventListener('click', () => {
    Deckdle._confirmNewFree()
  })

  // local debug buttons
  if (Deckdle.env == 'local') {
    if (Deckdle.dom.interactive.debug.all) {
      // ⚙️ show current deckdle config
      Deckdle.dom.interactive.debug.btnShowConfig.addEventListener('click', () => {
        Deckdle.modalOpen('show-config')
      })

      // 🎚️ show current deckdle state
      Deckdle.dom.interactive.debug.btnShowState.addEventListener('click', () => {
        Deckdle.modalOpen('show-state')
      })

      // 🗑️ clear localStorage
      Deckdle.dom.interactive.debug.btnClearLS.addEventListener('click', () => {
        Deckdle._clearLocalStorage()
      })

      // 🂡 clear cards
      Deckdle.dom.interactive.debug.btnClearCards.addEventListener('click', () => {
        Deckdle.ui._emptyPlayingField()
      })

      // 🂡 deal cards animation
      Deckdle.dom.interactive.debug.btnDealCards.addEventListener('click', () => {
        Deckdle.ui._emptyPlayingField()
        /* eslint-disable-next-line no-undef */
        Deckdle.ui._dealCards((animate = true))
      })

      // ☺ display win animation
      Deckdle.dom.interactive.debug.btnWinAnimation.addEventListener('click', () => {
        /* eslint-disable-next-line no-undef */
        Deckdle._winAnimation((debug = true)).then((msg) => {
          Deckdle._logStatus(msg)
          Deckdle._resetCardsDuration()
        })
      })

      // ☹ display lose animation
      Deckdle.dom.interactive.debug.btnLoseAnimation.addEventListener('click', () => {
        /* eslint-disable-next-line no-undef */
        Deckdle._loseAnimation((debug = true)).then((msg) => {
          Deckdle._logStatus(msg)
          Deckdle._resetCardsDuration()
        })
      })
    }
  }

  // gotta use keydown, not keypress, or else Delete/Backspace aren't recognized
  document.addEventListener('keydown', (event) => {
    if (event.code == 'Enter') {
      // TODO: take card from stock
    }
  })

  // When the user clicks or touches anywhere outside of the modal, close it
  window.addEventListener('click', Deckdle._handleClickTouch)
  window.addEventListener('touchend', Deckdle._handleClickTouch)

  document.body.addEventListener(
    'touchmove',
    function (event) {
      event.preventDefault
    },
    { passive: false }
  )
}

Deckdle._logStatus('[LOADED] /app/events')
