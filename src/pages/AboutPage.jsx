import { useState } from 'react'
import landingPhoto from '../assets/landingpage-photo.png'
import { siteContent } from '../data/siteContent'

const experienceIcons = {
  Story: BookIcon,
  Lesson: LightIcon,
  Activity: QuestionIcon,
  Progress: ChartIcon,
}

function AboutPage() {
  const { about } = siteContent
  const [openFaq, setOpenFaq] = useState(0)
  const [projectBackground, storyConcept, educationalPurpose, ...closingSections] = about.sections

  return (
    <div>
      <header
        className="relative bg-cover bg-center px-5 py-20 text-center"
        style={{ backgroundImage: `url(${landingPhoto})` }}
      >
        <div className="absolute inset-0 bg-[rgba(43,26,16,0.42)]" />
        <div className="relative mx-auto max-w-3xl text-white">
          <p className="text-sm font-black uppercase tracking-wide text-[color:var(--gold-soft)]">About the project</p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">{about.title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-[#FFF4D6]">{about.subtitle}</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-14">
        <section>
          <InfoSection section={projectBackground} featured />
        </section>

        <section className="mt-10 grid gap-8 lg:grid-cols-[410px_1fr] lg:items-center">
          <div className="parchment-surface interactive-card rounded-xl p-3">
            <img
              className="aspect-square w-full rounded-lg object-cover"
              src={landingPhoto}
              alt="Alvin entering a magical number storybook"
            />
          </div>
          <InfoSection section={storyConcept} />
        </section>

        <section className="section-band -mx-5 mt-12 px-5 py-12">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <InfoSection section={educationalPurpose} plain />
            <div className="grid gap-4 sm:grid-cols-3">
              <IconCard title="Visual" description="Concepts are connected to scenes, places, and objects." icon={<SparkIcon />} />
              <IconCard title="Guided" description="Narration and dialogue help students follow each lesson." icon={<BookIcon />} />
              <IconCard title="Self-Paced" description="Students can review and retry before moving forward." icon={<RefreshIcon />} />
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-wide text-[color:var(--amber)]">Chapter flow</p>
            <h2 className="magic-heading mt-2 text-3xl font-black">{about.learningExperience.title}</h2>
            <div className="mt-4 space-y-3 leading-7 text-[color:var(--muted)]">
              {about.learningExperience.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {about.learningExperience.cards.map((card) => {
              const Icon = experienceIcons[card.title] ?? SparkIcon
              return (
                <article className="parchment-surface interactive-card rounded-xl p-5 text-center" key={card.title}>
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[color:var(--gold-soft)] text-[color:var(--brown)]">
                    <Icon />
                  </span>
                  <h3 className="mt-4 font-black text-[color:var(--brown)]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{card.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {closingSections.map((section) => (
            <InfoSection section={section} key={section.title} />
          ))}
        </div>

        <section className="mt-12">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-wide text-[color:var(--amber)]">Helpful details</p>
            <h2 className="magic-heading mt-2 text-3xl font-black">Frequently Asked Questions</h2>
          </div>
          <div className="mx-auto mt-6 grid max-w-4xl gap-3">
            {about.faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <article className="parchment-surface rounded-xl p-5" key={faq.question}>
                  <button
                    className="flex w-full items-center justify-between gap-4 text-left font-black text-[color:var(--brown)]"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    type="button"
                  >
                    <span>{faq.question}</span>
                    <span
                      className={`shrink-0 text-lg leading-none text-[color:var(--brown)] transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-0' : 'rotate-180'
                      }`}
                    >
                      ^
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
                      isOpen ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1'
                    }`}
                  >
                    <div>
                      <p className="pt-3 leading-7 text-[color:var(--muted)]">{faq.answer}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}

function InfoSection({ section, featured = false, plain = false }) {
  const Wrapper = plain ? 'div' : 'article'
  return (
    <Wrapper className={plain ? '' : `parchment-surface rounded-xl p-6 ${featured ? 'lg:p-8' : ''}`}>
      <h2 className="magic-heading text-2xl font-black">{section.title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-[color:var(--muted)]">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Wrapper>
  )
}

function IconCard({ title, description, icon }) {
  return (
    <article className="parchment-surface interactive-card rounded-xl p-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-[color:var(--gold-soft)] text-[color:var(--brown)]">
        {icon}
      </span>
      <h3 className="mt-4 font-black text-[color:var(--brown)]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{description}</p>
    </article>
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

function LightIcon() {
  return <IconBase><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8 14a6 6 0 1 1 8 0c-.8.7-1 1.4-1 2H9c0-.6-.2-1.3-1-2z" /></IconBase>
}

function QuestionIcon() {
  return <IconBase><path d="M9.1 9a3 3 0 1 1 5.4 1.8c-1.4 1-2.5 1.7-2.5 3.2" /><path d="M12 18h.01" /><circle cx="12" cy="12" r="9" /></IconBase>
}

function ChartIcon() {
  return <IconBase><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 15v-4" /><path d="M12 15V8" /><path d="M16 15v-6" /></IconBase>
}

function SparkIcon() {
  return <IconBase><path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z" /></IconBase>
}

function RefreshIcon() {
  return <IconBase><path d="M20 12a8 8 0 1 1-2.3-5.7" /><path d="M20 4v6h-6" /></IconBase>
}

export default AboutPage
