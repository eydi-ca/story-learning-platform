import archerAvatar from '../assets/profiles/archer_avatar.png'
import guardianAvatar from '../assets/profiles/guardian_avatar.png'
import healerAvatar from '../assets/profiles/healer_avatar.png'
import knightAvatar from '../assets/profiles/knight_avatar.png'
import mageAvatar from '../assets/profiles/mage_avatar.png'
import nomadAvatar from '../assets/profiles/nomad_avatar.png'
import rogueAvatar from '../assets/profiles/rogue_avatar.png'
import wizardAvatar from '../assets/profiles/wizard_avatar.png'

export const avatars = [
  { id: 'forest_archer', name: 'Forest Archer', initials: 'FA', src: archerAvatar, color: 'bg-emerald-600' },
  { id: 'wise_wizard', name: 'Wise Wizard', initials: 'WW', src: wizardAvatar, color: 'bg-indigo-600' },
  { id: 'silver_knight', name: 'Silver Knight', initials: 'SK', src: knightAvatar, color: 'bg-slate-600' },
  { id: 'friendly_rogue', name: 'Friendly Rogue', initials: 'FR', src: rogueAvatar, color: 'bg-rose-600' },
  { id: 'desert_nomad', name: 'Desert Nomad', initials: 'DN', src: nomadAvatar, color: 'bg-amber-600' },
  { id: 'nature_healer', name: 'Nature Healer', initials: 'NH', src: healerAvatar, color: 'bg-lime-700' },
  { id: 'scholar_mage', name: 'Scholar Mage', initials: 'SM', src: mageAvatar, color: 'bg-sky-700' },
  { id: 'rainbow_guardian', name: 'Rainbow Bridge Guardian', initials: 'RG', src: guardianAvatar, color: 'bg-fuchsia-700' },
]

export function getAvatar(avatarId) {
  return avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0]
}
