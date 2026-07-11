const preloadCache = new Map()

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export function preloadAudio(src) {
  if (!src) return Promise.resolve(null)
  if (preloadCache.has(src)) return preloadCache.get(src)

  const promise = new Promise((resolve) => {
    const audio = new Audio(src)
    let settled = false
    const timeout = window.setTimeout(() => finish(), 8000)

    function finish() {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      audio.removeEventListener('canplaythrough', finish)
      audio.removeEventListener('loadeddata', finish)
      audio.removeEventListener('error', finish)
      resolve(audio)
    }

    audio.preload = 'auto'
    audio.addEventListener('canplaythrough', finish)
    audio.addEventListener('loadeddata', finish)
    audio.addEventListener('error', finish)
    audio.load()
  })

  preloadCache.set(src, promise)
  return promise
}

export function preloadAudioSources(sources = []) {
  sources.filter(Boolean).forEach((src) => {
    void preloadAudio(src)
  })
}

export function waitForAudioReady(audio) {
  if (!audio) return Promise.resolve()
  if (audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve()

  return new Promise((resolve) => {
    let settled = false
    const timeout = window.setTimeout(() => finish(), 8000)

    function finish() {
      if (settled) return
      settled = true
      window.clearTimeout(timeout)
      audio.removeEventListener('canplaythrough', finish)
      audio.removeEventListener('loadeddata', finish)
      audio.removeEventListener('error', finish)
      resolve()
    }

    audio.preload = 'auto'
    audio.addEventListener('canplaythrough', finish)
    audio.addEventListener('loadeddata', finish)
    audio.addEventListener('error', finish)
    audio.load()
  })
}

export async function playPreparedAudio(audio) {
  await waitForAudioReady(audio)

  try {
    await audio.play()
  } catch (error) {
    await wait(250)
    await audio.play()
  }
}
