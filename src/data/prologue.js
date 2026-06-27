import prologuePage1Audio0 from '../assets/audio/prolouge_page1/audio_0_Hi__My_name_is_Alvin_.mp3'
import prologuePage1Audio1 from '../assets/audio/prolouge_page1/audio_1_People_at_school_always_say_I_m_good_at_math__.mp3'
import prologuePage1Audio2 from '../assets/audio/prolouge_page1/audio_2_not_because_I_memorize_answers__but_because_I_understand_where_numbers_belong_.mp3'
import prologuePage1Audio3 from '../assets/audio/prolouge_page1/audio_3_To_me__numbers_feel_like_they_have_places__like_they_re_part_of_a_bigger_world_.mp3'
import prologuePage2Audio0 from '../assets/audio/prolouge_page2/audio_0_When_I_opened_the_book__the_pages_began_to_glow__Numbers_spilled_out_like_light__.mp3'
import prologuePage2Audio1 from '../assets/audio/prolouge_page2/audio_1_before_i_could_react_pulled_into_the_book.mp3'
import prologuePage3Audio0 from '../assets/audio/prologue_page3/audio_0_I_stared_at_the_glowing_words_floating_in_front_of_me_.mp3'
import prologuePage3Audio1 from '../assets/audio/prologue_page3/audio_1_A_system__A_learning_scenario__.mp3'
import prologuePage3Audio2 from '../assets/audio/prologue_page3/audio_2_It_was_too_real_for_me_to_ignore_.mp3'
import prologuePage3Audio3 from '../assets/audio/prologue_page3/audio_3_I_steadied_myself_and_prepared_to_move_forward.mp3'
import prologuePage4Audio0 from '../assets/audio/prolouge_page4/audio_0_I_found_myself_standing_on_a_cliff_overlooking_a_vast_kingdom__.mp3'
import prologuePage4Audio1 from '../assets/audio/prolouge_page4/audio_1_Stretching_endlessly_to_the_left_and_right_was_a_glowing_rainbow_path_the_Number_Line__.mp3'
import prologuePage4Audio2 from '../assets/audio/prolouge_page4/audio_2_It_shimmered_like_a_bridge_of_light__dividing_the_land_perfectly_.mp3'
import prologuePage5Audio0 from '../assets/audio/prolouge_page5/audio_0_A_glowing_portal_suddenly_appeared_in_front_of_me__.mp3'
import prologuePage5Audio1 from '../assets/audio/prolouge_page5/audio_1_Without_thinking_twice__I_stepped_forward_.mp3'
import prologuePage1Background from '../assets/chapters/prologue/page 1.png'
import prologuePage2Background from '../assets/chapters/prologue/page 2.png'
import prologuePage3Background from '../assets/chapters/prologue/page 3.png'
import prologuePage4Background from '../assets/chapters/prologue/page 4.png'
import prologuePage5Background from '../assets/chapters/prologue/page 5.png'

export const prologue = {
  id: 'prologue',
  title: "Prologue: Alvin's Beginning",
  shortDescription: 'Meet Alvin and follow the full opening sequence before Chapter 1 begins.',
  description:
    "A replayable story introduction that now includes Alvin's full transition into Numberland before Chapter 1 starts.",
  duration: '7 minutes',
  scene: {
    location: 'Before Chapter 1',
    mood: 'Reflective, magical, and cinematic',
    mascotName: 'Alvin',
    mascotRole: 'Student Explorer',
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
      audioSrc: prologuePage1Audio0,
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: "People at school always say I'm good at math.",
      audioSrc: prologuePage1Audio1,
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: 'Not because I memorize answers, but because I understand where numbers belong.',
      audioSrc: prologuePage1Audio2,
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: "To me, numbers feel like they have places, like they're part of a bigger world.",
      audioSrc: prologuePage1Audio3,
      backgroundSrc: prologuePage1Background,
    },
    {
      speaker: 'Alvin',
      text: 'When I opened the book, the pages began to glow. Numbers spilled out like light.',
      audioSrc: prologuePage2Audio0,
      backgroundSrc: prologuePage2Background,
    },
    {
      speaker: 'Alvin',
      text: 'Before I could react, the world around me twisted and suddenly, I felt myself being pulled into the book.',
      audioSrc: prologuePage2Audio1,
      backgroundSrc: prologuePage2Background,
    },
    {
      speaker: 'Alvin',
      text: 'I stared at the glowing words floating in front of me.',
      audioSrc: prologuePage3Audio0,
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'System',
      text: 'A system. A learning scenario.',
      audioSrc: prologuePage3Audio1,
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'Alvin',
      text: 'It was too real for me to ignore.',
      audioSrc: prologuePage3Audio2,
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'Alvin',
      text: 'I steadied myself and prepared to move forward.',
      audioSrc: prologuePage3Audio3,
      backgroundSrc: prologuePage3Background,
    },
    {
      speaker: 'Alvin',
      text: 'I found myself standing on a cliff overlooking a vast kingdom.',
      audioSrc: prologuePage4Audio0,
      backgroundSrc: prologuePage4Background,
    },
    {
      speaker: 'Alvin',
      text: 'Stretching endlessly to the left and right was a glowing rainbow path, the Number Line.',
      audioSrc: prologuePage4Audio1,
      backgroundSrc: prologuePage4Background,
    },
    {
      speaker: 'Alvin',
      text: 'It shimmered like a bridge of light, dividing the land perfectly.',
      audioSrc: prologuePage4Audio2,
      backgroundSrc: prologuePage4Background,
    },
    {
      speaker: 'Alvin',
      text: 'A glowing portal suddenly appeared in front of me.',
      audioSrc: prologuePage5Audio0,
      backgroundSrc: prologuePage5Background,
    },
    {
      speaker: 'Alvin',
      text: 'Without thinking twice, I stepped forward.',
      audioSrc: prologuePage5Audio1,
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
