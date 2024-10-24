/* lib/misc/audio */
/* global Deckdle, WebAudioTinySynth */

Deckdle._initSynths = () => {
  Deckdle._logStatus('[INITIALIZING] synths')

  if (!Deckdle.__getConfig().synthBGM) {
    // initialize synthBGM instance
    Deckdle.__setConfig(
      'synthBGM',
      new WebAudioTinySynth({
        debug: 0,
        loop: 1,
        masterVol: Deckdle.settings.soundBGMLevel,
        quality: 0, // 0: chiptune, 1: FM
        reverbLev: 0.1,
        useReverb: 1,
        voices: 8,
      })
    )
  }

  Deckdle.config.synthBGM.setLoop(1)
  Deckdle.config.synthBGM.setMasterVol(Deckdle.settings.soundBGMLevel)
  Deckdle.config.synthBGM.setProgram(0, 2)

  if (Deckdle.config.synthBGM) {
    // console.log('* synthBGM initialized!', Deckdle.config.synthBGM)
  } else {
    console.error('* synthBGM could not be initialized')
  }

  if (!Deckdle.__getConfig().synthSFX) {
    // initialize synthBGM instance
    Deckdle.__setConfig(
      'synthSFX',
      new WebAudioTinySynth({
        debug: 0,
        loop: 0,
        masterVol: Deckdle.settings.soundBGMLevel,
        quality: 1, // 0: chiptune, 1: FM
        reverbLev: 0,
        useReverb: 0,
        voices: 8,
      })
    )
  }

  if (Deckdle.config.synthSFX) {
    // console.log('* synthSFX initialized!', Deckdle.config.synthSFX)
  } else {
    console.error('* synthSFX could not be initialized')
  }

  if (document.querySelector('#button-start-music')) {
    document.querySelector('#button-start-music').removeAttribute('disabled')
  }
  if (document.querySelector('#button-stop-music')) {
    document.querySelector('#button-stop-music').removeAttribute('disabled')
  }

  Deckdle._logStatus('[LOADED] /app/lib/audio(synths)')
}

// BackGround Music
// TODO: add more background music?
Deckdle._playBGM = () => {
  if (Deckdle.settings.noisy) {
    const filename = `/assets/audio/deckdle-bgm2.mid`

    Deckdle.config.synthBGM.loadMIDIUrl(filename)

    setTimeout(() => {
      Deckdle.config.synthBGM.playMIDI()
    }, 20)
  }
}
Deckdle._stopBGM = () => {
  Deckdle.config.synthBGM.stopMIDI()
}

// Sound eFfects
Deckdle._playSFX = (action, arg = null) => {
  if (Deckdle.settings.noisy) {
    Deckdle.config.synthSFX.setMasterVol(Deckdle.settings.soundSFXLevel)
    Deckdle.config.synthSFX.setProgram(0, 1)

    let note = arg ? 42 + arg : 42

    switch (action) {
      case 'click_stock':
        Deckdle.config.synthSFX.send([0x90, note, 100])
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, note - 2, 100])
        }, 100)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, note - 4, 100])
        }, 200)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, note, 0])
          Deckdle.config.synthSFX.send([0x80, note - 2, 0])
          Deckdle.config.synthSFX.send([0x80, note - 4, 0])
        }, 300)
        break

      case 'click_tableau_valid':
        Deckdle.config.synthSFX.send([0x90, 60, 100])
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 62, 100])
        }, 40)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 65, 100])
        }, 70)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, 60, 0])
          Deckdle.config.synthSFX.send([0x80, 62, 0])
          Deckdle.config.synthSFX.send([0x80, 65, 0])
        }, 300)
        break

      case 'click_tableau_invalid':
        Deckdle.config.synthSFX.send([0x90, 59, 100])
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 59, 0])
        }, 50)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 60, 80])
        }, 100)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, 60, 0])
        }, 150)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 59, 100])
        }, 200)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, 59, 0])
        }, 250)
        break

      case 'lose':
        Deckdle.config.synthSFX.send([0x90, 48, 100])
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, 48, 0])
        }, 100)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 47, 100])
        }, 150)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, 47, 0])
        }, 250)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 44, 100])
        }, 300)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, 44, 0])
        }, 350)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 43, 100])
        }, 450)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, 43, 0])
        }, 900)
        break

      case 'win':
        Deckdle.config.synthSFX.send([0x90, 74, 70])
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 76, 80])
        }, 50)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 74, 70])
        }, 50)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x90, 79, 100])
        }, 50)
        setTimeout(() => {
          Deckdle.config.synthSFX.send([0x80, 74, 0])
          Deckdle.config.synthSFX.send([0x80, 76, 0])
          Deckdle.config.synthSFX.send([0x80, 79, 0])
        }, 500)
        break
    }
  }
}

// Flags
Deckdle._isBGMPlaying = () => {
  return Deckdle.config.synthBGM ? Deckdle.config.synthBGM.playing : false
}
