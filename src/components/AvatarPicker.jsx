import AvatarBadge from './AvatarBadge'
import { avatars } from '../data/avatars'

function AvatarPicker({ selectedAvatar, onChange, compact = false }) {
  return (
    <div className={`grid gap-3 ${compact ? 'grid-cols-2 sm:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
      {avatars.map((option) => (
        <label
          className={`cursor-pointer rounded-xl border p-3 transition hover:border-sky-300 ${
            selectedAvatar === option.id ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-100' : 'border-slate-200 bg-white'
          }`}
          title={option.name}
          key={option.id}
        >
          <input
            className="sr-only"
            type="radio"
            checked={selectedAvatar === option.id}
            onChange={() => onChange(option.id)}
          />
          <div className="flex flex-col items-center gap-2 text-center">
            <AvatarBadge avatarId={option.id} size={compact ? 'md' : 'lg'} />
          </div>
        </label>
      ))}
    </div>
  )
}

export default AvatarPicker
