function AudioPlayer({ src }) {
  if (!src) return null

  return (
    <div className="rounded-xl bg-slate-100 p-4">
      <p className="font-semibold text-slate-700 mb-2">Audio Narration</p>
      <audio controls className="w-full">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}

export default AudioPlayer