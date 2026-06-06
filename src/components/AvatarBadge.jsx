import { useState } from 'react'
import { getAvatar } from '../data/avatars'

function AvatarBadge({ avatarId, size = 'md' }) {
  const avatar = getAvatar(avatarId)
  const [imageFailed, setImageFailed] = useState(false)
  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-20 w-20 text-xl',
    xl: 'h-28 w-28 text-2xl',
  }

  return (
    <div className={`${sizes[size]} ${avatar.color} flex shrink-0 items-center justify-center overflow-hidden rounded-full font-bold text-white shadow-sm ring-2 ring-white`}>
      {avatar.src && !imageFailed ? (
        <img
          className="h-full w-full object-cover"
          src={avatar.src}
          alt={avatar.name}
          onError={() => setImageFailed(true)}
        />
      ) : (
        avatar.initials
      )}
    </div>
  )
}

export default AvatarBadge
