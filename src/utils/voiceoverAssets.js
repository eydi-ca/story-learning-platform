const voiceoverModules = import.meta.glob(
  [
    '../assets/audio/voiceover/Page 1/*.mp3',
    '../assets/audio/voiceover/Page 2/*.mp3',
    '../assets/audio/voiceover/Page 3/*.mp3',
    '../assets/audio/voiceover/Page 4/*.mp3',
    '../assets/audio/voiceover/Page 5/*.mp3',
    '../assets/audio/voiceover/Page 6/*.mp3',
    '../assets/audio/voiceover/Page 7/*.mp3',
    '../assets/audio/voiceover/Page 8/*.mp3',
    '../assets/audio/voiceover/Page 9/*.mp3',
    '../assets/audio/voiceover/Page 10/*.mp3',
    '../assets/audio/voiceover/Page 11/*.mp3',
    '../assets/audio/voiceover/Page 12/*.mp3',
    '../assets/audio/voiceover/Page 13/*.mp3',
    '../assets/audio/voiceover/Page 14/*.mp3',
    '../assets/audio/voiceover/Page 15/*.mp3',
    '../assets/audio/voiceover/Page 16/*.mp3',
    '../assets/audio/voiceover/Page 17/*.mp3',
    '../assets/audio/voiceover/Page 18/*.mp3',
    '../assets/audio/voiceover/Page 19/*.mp3',
    '../assets/audio/voiceover/Page 20/*.mp3',
    '../assets/audio/voiceover/Page 21/*.mp3',
    '../assets/audio/voiceover/Page 22/*.mp3',
    '../assets/audio/voiceover/Page 23/*.mp3',
    '../assets/audio/voiceover/Page 24/*.mp3',
    '../assets/audio/voiceover/Page 25/*.mp3',
    '../assets/audio/voiceover/Page 26/*.mp3',
    '../assets/audio/voiceover/Page 27/*.mp3',
    '../assets/audio/voiceover/Page 28/*.mp3',
    '../assets/audio/voiceover/Page 29/*.mp3',
    '../assets/audio/voiceover/Page 30/*.mp3',
    '../assets/audio/voiceover/Page 31/*.mp3',
    '../assets/audio/voiceover/Page 32/*.mp3',
    '../assets/audio/voiceover/Page 33/*.mp3',
    '../assets/audio/voiceover/ACTIVITY 1/*.mp3',
    '../assets/audio/voiceover/ACTIVITY 2/*.mp3',
    '../assets/audio/voiceover/ACTIVITY 3/*.mp3',
    '../assets/audio/voiceover/ACTIVITY 3/new/*.mp3',
    '../assets/audio/voiceover/ACTIVITY 4/*.mp3',
    '../assets/audio/voiceover/ACTIVITY 5/*.mp3',
  ],
  {
    eager: true,
    import: 'default',
    query: '?url',
  }
)

export function getVoiceoverSrc(pageNumber, fileName) {
  const normalizedFileName = fileName.endsWith('.mp3') ? fileName : `${fileName}.mp3`
  return (
    voiceoverModules[`../assets/audio/voiceover/Page ${pageNumber}/${normalizedFileName}`] ?? ''
  )
}

export function getActivityVoiceoverSrc(activityFolder, fileName) {
  const normalizedFileName = fileName.endsWith('.mp3') ? fileName : `${fileName}.mp3`
  return (
    voiceoverModules[`../assets/audio/voiceover/${activityFolder}/${normalizedFileName}`] ?? ''
  )
}
