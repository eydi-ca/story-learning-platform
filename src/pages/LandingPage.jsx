import { Link } from 'react-router-dom'
import AvatarBadge from '../components/AvatarBadge'
import landingPhoto from '../assets/landingpage-photo.png'
import { avatars } from '../data/avatars'
import { siteContent } from '../data/siteContent'

const featureIcons = {
  'Story-Based Learning': BookIcon,
  'Rainbow Bridge Timeline': BridgeIcon,
  'RPG-Style Dialogue': ChatIcon,
  'Interactive Activities': PuzzleIcon,
  'Progress Tracking': ChartIcon,
  'Teacher Monitoring': TeacherIcon,
}

const creatorAvatarIds = [
  'forest_archer',
  'wise_wizard',
  'silver_knight',
  'nature_healer',
  'desert_nomad',
]

function LandingPage() {
  const { landing } = siteContent

  return (
    <div className="overflow-hidden">
      <section
        className="relative min-h-[78vh] bg-cover bg-center px-4 py-14 text-white"
        style={{ backgroundImage: `url(${landingPhoto})` }}
      >
        <div className="absolute inset-0 bg-[rgba(43,26,16,0.38)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(43,26,16,0.46)] via-[rgba(43,26,16,0.2)] to-transparent" />
        <div className="relative mx-auto flex min-h-[68vh] max-w-6xl items-center justify-center text-center sm:justify-start sm:text-left">
          <div className="animate-hero-rise max-w-2xl">
            <h1 className="max-w-xl text-4xl font-black leading-tight text-white drop-shadow-[0_3px_12px_rgba(43,26,16,0.45)] sm:text-6xl">
              {landing.heroTitle}
            </h1>
            <p className="mt-4 max-w-xl text-lg font-semibold text-[#FFF4D6] drop-shadow sm:text-xl">{landing.heroSubtitle}</p>
            <p className="mt-5 max-w-xl text-base leading-7 text-white drop-shadow sm:text-lg">
              {landing.heroDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="gold-button interactive-button rounded-lg px-6 py-3 font-bold" to="/signup">
                {landing.primaryButton}
              </Link>
              <a className="interactive-button rounded-lg border border-white/50 bg-white/90 px-6 py-3 font-bold text-[color:var(--brown)]" href="#about-preview">
                {landing.secondaryButton}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about-preview" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-[color:var(--amber)]">Storybook learning</p>
            <h2 className="magic-heading mt-2 text-3xl font-black sm:text-4xl">{landing.aboutTitle}</h2>
            <div className="mt-5 space-y-4 text-base leading-7 text-[color:var(--muted)] sm:text-lg">
              {landing.aboutText.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link className="mt-6 inline-flex rounded-lg border border-[color:var(--border)] bg-[color:var(--cream)] px-5 py-3 font-bold text-[color:var(--brown)] transition hover:bg-[color:var(--gold-soft)]" to="/about">
              Read About Numberland
            </Link>
          </div>
          <div className="parchment-surface interactive-card rounded-xl p-3">
            <img
              className="aspect-square w-full rounded-lg object-cover"
              src={landingPhoto}
              alt="A magical math storybook adventure with Alvin and glowing numbers"
            />
          </div>
        </div>
      </section>

      <section className="section-band">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-black uppercase tracking-wide text-[color:var(--amber)]">Simple learning path</p>
            <h2 className="magic-heading mt-2 text-3xl font-black sm:text-4xl">{landing.howItWorksTitle}</h2>
            <p className="mt-3 text-[color:var(--muted)]">
              Students move through the story in a clear sequence, while teachers can monitor progress by class.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {landing.steps.map((item, index) => (
              <div className="parchment-surface interactive-card group rounded-xl p-5" key={item}>
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color:var(--gold-soft)] text-base font-black text-[color:var(--brown)] shadow-[0_0_18px_rgb(255_216_107_/_0.32)] transition group-hover:bg-[color:var(--amber)]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-black text-[color:var(--brown)]">Step {index + 1}</h3>
                    <p className="mt-1 leading-6 text-[color:var(--muted)]">{item}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-black uppercase tracking-wide text-[color:var(--amber)]">What students use</p>
          <h2 className="magic-heading mt-2 text-3xl font-black sm:text-4xl">{landing.featuresTitle}</h2>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landing.features.map((feature) => {
            const Icon = featureIcons[feature.title] ?? SparkIcon
            return (
              <div className="parchment-surface interactive-card rounded-xl p-6" key={feature.title}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[color:var(--gold-soft)] text-[color:var(--brown)] shadow-[0_0_18px_rgb(255_216_107_/_0.28)]">
                  <Icon />
                </div>
                <h3 className="mt-4 font-black text-[color:var(--brown)]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-wide text-[color:var(--amber)]">Project team</p>
          <h2 className="magic-heading mt-2 text-3xl font-black sm:text-4xl">{landing.teamTitle}</h2>
          <p className="mt-3 text-[color:var(--muted)]">{landing.teamDescription}</p>
        </div>
        <div className="mx-auto mt-8 grid max-w-sm gap-4 sm:max-w-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {landing.team.map((member, index) => (
            <div className="parchment-surface interactive-card flex min-h-[260px] flex-col items-center rounded-xl p-4 text-center" key={member.name}>
              <AvatarBadge avatarId={creatorAvatarIds[index] ?? avatars[index % avatars.length].id} size="lg" />
              <h3 className="mt-4 text-base font-black leading-7 text-[color:var(--brown)]">{member.name}</h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function IconBase({ children }) {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      {children}
    </svg>
  )
}

function BookIcon() {
  return <IconBase><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5v16" /><path d="M8 7h8" /></IconBase>
}

function BridgeIcon() {
  return <IconBase><path d="M4 17c3-6 13-6 16 0" /><path d="M6 17V9" /><path d="M18 17V9" /><path d="M8 13h8" /></IconBase>
}

function ChatIcon() {
  return <IconBase><path d="M5 6h14v10H8l-3 3z" /><path d="M8 10h8" /><path d="M8 13h5" /></IconBase>
}

function PuzzleIcon() {
  return <IconBase><path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5z" /></IconBase>
}

function ChartIcon() {
  return <IconBase><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 15v-4" /><path d="M12 15V8" /><path d="M16 15v-6" /></IconBase>
}

function TeacherIcon() {
  return <IconBase><path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8" /><path d="M4 21a8 8 0 0 1 16 0" /><path d="M18 4h3v6" /></IconBase>
}

function SparkIcon() {
  return <IconBase><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" /></IconBase>
}

export default LandingPage
