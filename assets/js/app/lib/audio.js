/* audio */
/* sound playing mechanisms */
/* global Deckdle */

const DECKDLE_CACHE_AUDIO_KEY = 'deckdle-cache-audio'
const DECKDLE_ASSET_DATA_PATH = '/assets/audio'

// Try to get data from the cache, but fall back to fetching it live.
async function getAudio(cacheName, url) {
  let cachedAudio = await getCachedAudio(cacheName, url)

  if (cachedAudio) {
    return cachedAudio
  }

  const cacheStorage = await caches.open(cacheName)
  await cacheStorage.add(url)
  cachedAudio = await getCachedAudio(cacheName, url)
  await deleteOldCaches(cacheName)

  return cachedAudio
}

// Get data from the cache.
async function getCachedAudio(cacheName, url) {
  const cacheStorage = await caches.open(cacheName)
  const cachedResponse = await cacheStorage.match(url)

  if (!cachedResponse || !cachedResponse.ok) {
    return false
  }

  return await cachedResponse.arrayBuffer()
}

// Delete any old caches to respect user's disk space.
async function deleteOldCaches(currentCache) {
  const keys = await caches.keys()

  for (const key of keys) {
    const isOurCache = DECKDLE_CACHE_AUDIO_KEY

    if (currentCache === key || !isOurCache) {
      continue
    }

    caches.delete(key)
  }
}

// use CacheStorage to check cache
async function useCache(url) {
  const context = new AudioContext()
  const gainNode = context.createGain()
  const source = context.createBufferSource()

  try {
    const audioBuffer = await getAudio(DECKDLE_CACHE_AUDIO_KEY, url)

    gainNode.gain.value = 0.3
    source.buffer = await context.decodeAudioData(audioBuffer)

    source.connect(gainNode)
    gainNode.connect(context.destination)

    source.start()
  } catch (error) {
    console.error(error)
  }
}

// use direct fetch(url)
async function useFetch(url) {
  const context = new AudioContext()
  const gainNode = context.createGain()
  const source = context.createBufferSource()

  const audioBuffer = await fetch(url)
    .then((response) => response.arrayBuffer())
    .then((ArrayBuffer) => context.decodeAudioData(ArrayBuffer))

  gainNode.gain.value = 0.5
  source.buffer = audioBuffer

  source.connect(gainNode)
  gainNode.connect(context.destination)

  source.start()
}

Deckdle._initAudio = async function () {
  const path = DECKDLE_ASSET_DATA_PATH

  await caches.open(DECKDLE_CACHE_AUDIO_KEY).then((cache) => {
    cache.keys().then(function (keys) {
      if (!keys.length) {
        cache.addAll([
          `${path}/click_stock.wav`,
          `${path}/click_tableau.wav`,
          `${path}/lose.wav`,
          `${path}/win.wav`,

        ])
      } else {
        // console.info(`${DECKDLE_CACHE_AUDIO_KEY} is full, so no need to initialize.`)
      }
    })
  })
}

Deckdle._audioPlay = async (soundId) => {
  if (Deckdle.settings.noisy) {
    const path = DECKDLE_ASSET_DATA_PATH
    const format = 'wav'
    const url = `${path}/${soundId}.${format}`

    if ('caches' in self) {
      useCache(url)
    } else {
      useFetch(url)
    }
  }
}
