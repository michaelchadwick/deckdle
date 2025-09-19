/* adds event listeners to dom */
/* global Deckdle */

// user clicks a card (stock or tableau)
Deckdle._onCardClick = (card) => {
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
Deckdle._handleClickTouch = (event) => {
  const dialog = document.getElementsByClassName('modal-dialog')[0]
  const elem = event.target

  if (dialog) {
    const isConfirm = dialog.classList.contains('modal-confirm')
    const isShareLink = elem.classList.contains('share')

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

Deckdle._attachEventListeners = () => {
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

      // + increase combo
      Deckdle.dom.interactive.debug.btnComboIncrease.addEventListener('click', () => {
        Deckdle._debugIncreaseCombo()
      })
      // - decrease combo
      Deckdle.dom.interactive.debug.btnComboDecrease.addEventListener('click', () => {
        Deckdle._debugDecreaseCombo()
      })

      // 🤖 display bot batch score for today's puzzle
      Deckdle.dom.interactive.debug.btnGetBotScore.addEventListener('click', () => {
        Deckdle.modalOpen('bot-score')
      })

      // 🧩 display debug game over modal (over par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverOver.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', false, 1)
      })
      // 🧩 display debug game over modal (par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverPar.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 0)
      })
      // 🧩 display debug game over modal (1 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder1.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 1)
      })
      // 🧩 display debug game over modal (2 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder2.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 2)
      })
      // 🧩 display debug game over modal (3 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder3.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 3)
      })
      // 🧩 display debug game over modal (4 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder4.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 4)
      })
      // 🧩 display debug game over modal (5 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder5.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 5)
      })
      // 🧩 display debug game over modal (6 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder6.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 6)
      })
      // 🧩 display debug game over modal (7 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder7.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 7)
      })
      // 🧩 display debug game over modal (8 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder8.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 8)
      })
      // 🧩 display debug game over modal (9 under par)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverUnder9.addEventListener('click', () => {
        Deckdle._debugGameOver('golf', 'daily', true, 9)
      })
      // 🧩 display debug game over modal (match bot)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverMatchBot.addEventListener(
        'click',
        () => {
          Deckdle._debugGameOver('golf', 'daily', true, 10)
        }
      )
      // 🧩 display debug game over modal (beat bot)
      Deckdle.dom.interactive.debugGameover.btnDebugGameOverBeatBot.addEventListener(
        'click',
        () => {
          Deckdle._debugGameOver('golf', 'daily', true, 11)
        }
      )
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
    (event) => {
      event.preventDefault
    },
    { passive: false }
  )
}

Deckdle._logStatus('[LOADED] /app/events')
