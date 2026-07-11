import { getVoiceoverSrc } from '../utils/voiceoverAssets'
import prologuePage1Background from '../assets/chapters/prologue/page 1.png'
import prologuePage2Background from '../assets/chapters/prologue/page 2.png'
import prologuePage3Background from '../assets/chapters/prologue/page 3.png'
import prologuePage4Background from '../assets/chapters/prologue/page 4.png'
import prologuePage5Background from '../assets/chapters/prologue/page 5.png'
import prologueCover from '../assets/chapters/prologue/a_journey_begins_cover.png'

const voiceover = getVoiceoverSrc

export const prologue = {
  id: 'prologue',
  title: "Prologue: Alvin's Beginning",
  shortDescription: 'Meet Alvin and follow the full opening sequence before Chapter 1 begins.',
  description:
    "A replayable story introduction that now includes Alvin's full transition into Numberland before Chapter 1 starts.",
  duration: '5 minutes',
  scene: {
    location: 'Before Chapter 1',
    mood: 'Reflective, magical, and cinematic',
    mascotName: 'Alvin',
    mascotRole: 'Student Explorer',
    coverImage: prologueCover,
  },
  story: {
    title: 'The beginning of the journey',
    narration:
      "Hi, my name is Alvin. People at school always say I'm good at math. Not because I memorize answers, but because I understand where numbers belong. To me, numbers feel like they have places, like they're part of a bigger world. When I opened the book, the pages began to glow and everything changed.",
  },
  dialogues: [
    {
      speaker: 'Alvin',
      text: 'Hi, my name is Alvin.',
      audioSrc: voiceover(1, 'P1S1'),
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: "People at school always say I'm good at math.",
      audioSrc: voiceover(1, 'P1S2'),
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: 'Not because I memorize answers, but because I understand where numbers belong.',
      audioSrc: voiceover(1, 'P1S3'),
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: "To me, numbers feel like they have places, like they're part of a bigger world.",
      audioSrc: voiceover(1, 'P1S4'),
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: "One afternoon, while I was cleaning the classroom shelves, I found an old, dusty book hidden behind some papers.",
      audioSrc: voiceover(1, 'P1S5'),
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: "Nearby were photos of my math awards taped to the wall.",
      audioSrc: voiceover(1, 'P1S6'),
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: "I picked the book up, curious.",
      audioSrc: voiceover(1, 'P1S7'),
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: 'When I opened the book, the pages began to glow.',
      audioSrc: voiceover(2, 'P2S1'),
      backgroundSrc: prologuePage2Background,
    },
    {
      speaker: 'Alvin',
      text: 'Numbers spilled out like light.',
      audioSrc: voiceover(2, 'P2S2'),
      backgroundSrc: prologuePage2Background,
    },
    {
      speaker: 'Alvin',
      text: 'Before I could react, the world around me twisted and suddenly, I felt myself being pulled into the book.',
      audioSrc: voiceover(2, 'P2S3'),
      backgroundSrc: prologuePage2Background,
    },
    {
      speaker: 'System',
      text: 'Reader detected. Compatibility: 100%',
      audioSrc: voiceover(2, 'SM1P2'),
      backgroundSrc: prologuePage2Background,
    },
    {
      speaker: 'Alvin',
      text: 'I stared at the glowing words floating in front of me.',
      audioSrc: voiceover(3, 'P3S1'),
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'System',
      text: 'Initializing Learning Scenario... World Loaded: Numberland. Objective: Understand the Subsets of Real Numbers. Participant: Alvin (Reader-Class).',
      audioSrc: voiceover(3, 'SM1P3'),
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'Alvin',
      text: 'A system, a learning Scenario?',
      audioSrc: voiceover(3, 'P3S2'),
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'Alvin',
      text: 'It was too real for me to ignore.',
      audioSrc: voiceover(3, 'P3S3'),
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'Alvin',
      text: 'I steadied myself and prepared to move forward.',
      audioSrc: voiceover(3, 'P3S4'),
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'Alvin',
      text: 'I found myself standing on a cliff overlooking a vast kingdom.',
      audioSrc: voiceover(4, 'P4S1'),
      backgroundSrc: prologuePage4Background,
    },
    {
      speaker: 'Alvin',
      text: 'Stretching endlessly to the left and right was a glowing rainbow path, the Number Line.',
      audioSrc: voiceover(4, 'P4S2'),
      backgroundSrc: prologuePage4Background,
    },
    {
      speaker: 'Alvin',
      text: 'It shimmered like a bridge of light, dividing the land perfectly.',
      audioSrc: voiceover(4, 'P4S3'),
      backgroundSrc: prologuePage4Background,
    },
    {
      speaker: 'System',
      text: 'Map locked. Regions unlock through successful classification.',
      audioSrc: voiceover(4, 'SM1P4'),
      backgroundSrc: prologuePage4Background,
    },
    {
      speaker: 'Alvin',
      text: 'A glowing portal suddenly appeared in front of me.',
      audioSrc: voiceover(5, 'P5S1'),
      backgroundSrc: prologuePage5Background,
    },
    {
      speaker: 'Alvin',
      text: 'Without thinking twice, I stepped forward.',
      audioSrc: voiceover(5, 'P5S2'),
      backgroundSrc: prologuePage5Background,
    },
    {
      speaker: 'System',
      text: 'Enter the Portal',
      audioSrc: voiceover(5, 'SM1P5'),
      backgroundSrc: prologuePage5Background,
    },
  ],
  tutorial: {
    title: 'Before Chapter 1',
    summary:
      'This prologue now covers Alvin introducing himself, discovering the magical book, being pulled into Numberland, encountering the strange system, and arriving at the Number Line before Chapter 1 begins.',
    points: [
      'Alvin explains how he understands numbers through meaning, not memorization.',
      'The glowing book pulls him from the classroom into Numberland.',
      'He arrives at the Number Line and steps forward into the real adventure.',
    ],
  },
}
