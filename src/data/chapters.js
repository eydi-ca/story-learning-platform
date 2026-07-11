import landingHeroPhoto from '../assets/landingpage-photo.png'
import { getActivityVoiceoverSrc, getVoiceoverSrc } from '../utils/voiceoverAssets'
import chapter1Page6 from '../assets/chapters/chapter 1/page 6.png'
import chapter1Page7 from '../assets/chapters/chapter 1/page 7.png'
import chapter1Page8 from '../assets/chapters/chapter 1/page 8.png'
import chapter1Cover from '../assets/chapters/chapter 1/chapter1_cover.png'
import chapter2Page9 from '../assets/chapters/chapter 2/page 9.png'
import chapter2Page10 from '../assets/chapters/chapter 2/page 10.png'
import chapter2Page11 from '../assets/chapters/chapter 2/page 11.png'
import chapter2Page12 from '../assets/chapters/chapter 2/page 12.png'
import chapter2Cover from '../assets/chapters/chapter 2/chapter2_cover.png'
import chapter3Page13 from '../assets/chapters/chapter 3/page 13.png'
import chapter3Page14 from '../assets/chapters/chapter 3/page 14.png'
import chapter3Page15 from '../assets/chapters/chapter 3/page 15.png'
import chapter3Cover from '../assets/chapters/chapter 3/chapter3_cover.png'
import chapter4Cover from '../assets/chapters/chapter 4/chapter4_cover.png'
import chapter5Cover from '../assets/chapters/chapter 5/final_quest_cover.png'
import chapter4Page16 from '../assets/chapters/chapter 4/page 16.png'
import chapter4Page17 from '../assets/chapters/chapter 4/page 17.png'
import chapter4Page18 from '../assets/chapters/chapter 4/page 18.png'
import chapter4Page19 from '../assets/chapters/chapter 4/page 19.png'
import chapter4Page20 from '../assets/chapters/chapter 4/page 20.png'
import chapter4Page21 from '../assets/chapters/chapter 4/page 21.png'
import chapter4Page22 from '../assets/chapters/chapter 4/page 22.png'
import chapter5Page23 from '../assets/chapters/chapter 5/page 23.png'
import chapter5Page24 from '../assets/chapters/chapter 5/page 24.png'
import chapter5Page25 from '../assets/chapters/chapter 5/page 25.png'
import chapter5Page26 from '../assets/chapters/chapter 5/page 26.png'
import chapter6Cover from '../assets/chapters/chapter 6/chapter6_cover.png'
import chapter6Page27 from '../assets/chapters/chapter 6/page 27.png'
import chapter6Page28 from '../assets/chapters/chapter 6/page 28.png'
import chapter6Page29 from '../assets/chapters/chapter 6/page 29.png'
import chapter6Page30 from '../assets/chapters/chapter 6/page 30.png'
import chapter6Page31 from '../assets/chapters/chapter 6/page 31.png'
import chapter6Page32 from '../assets/chapters/chapter 6/page 32.png'
import chapter6Page33 from '../assets/chapters/chapter 6/page 33.png'
import gateActivityImage from '../assets/images/gate.png'
import treasurePuzzleImage from '../assets/images/treasure.png'

const voiceover = getVoiceoverSrc
const activityVoiceover = getActivityVoiceoverSrc

export const chapters = [
  {
    id: 'chapter-1',
    number: 1,
    order: 1,
    title: 'The Counting Forest',
    shortDescription: 'Alvin restores the forest altar by choosing only counting numbers.',
    description:
      'Enter the Counting Forest and learn how counting numbers begin at 1 and grow one by one.',
    duration: '12 minutes',
    activityInsertBeforePage: 4,
    scene: {
      location: 'Counting Forest',
      mood: 'Quiet, magical, and focused',
      gradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 48%, #bef264 100%)',
      image: chapter1Page6,
      coverImage: chapter1Cover,
      mascotName: 'Alvin',
      mascotRole: 'Forest Challenger',
    },
    story: {
      title: 'The first sacred gem',
      background:
        'Alvin lands in a quiet forest where a broken altar waits for the correct numbers. Only the right set can restore the forest and reveal the first sacred gem.',
      narration:
        'I landed in a quiet forest. At its center stood a broken stone altar with dark, empty slots. Scattered around it were glowing numbers, waiting for me to decide which ones truly belonged there.',
    },
    dialogues: [
      {
        speaker: 'Alvin',
        text: 'I landed in a quiet forest.',
        audioSrc: voiceover(6, 'P6S1'),
        backgroundSrc: chapter1Page6,
      },
      {
        speaker: 'Alvin',
        text: 'At its center stood a broken stone altar with dark, empty slots.',
        audioSrc: voiceover(6, 'P6S2'),
        backgroundSrc: chapter1Page6,
      },
      {
        speaker: 'Alvin',
        text: 'Scattered around it were glowing numbers.',
        audioSrc: voiceover(6, 'P6S3'),
        backgroundSrc: chapter1Page6,
      },
      {
        speaker: 'Alvin',
        text: '1, 2, 3, -1, 0, 1/5, 4, 5',
        audioSrc: voiceover(6, 'P6S4'),
        backgroundSrc: chapter1Page6,
      },
      {
        speaker: 'System',
        text: 'Counting Numbers detected: Positive whole numbers only.',
        audioSrc: voiceover(6, 'SM1P6'),
        backgroundSrc: chapter1Page6,
      },
      {
        speaker: 'System',
        text: 'Forest altar requires counting numbers to activate.',
        audioSrc: voiceover(6, 'SM2P6'),
        backgroundSrc: chapter1Page6,
      },
      {
        speaker: 'Alvin',
        text: 'I realized the problem immediately.',
        audioSrc: voiceover(7, 'P7S1'),
        backgroundSrc: chapter1Page7,
      },
      {
        speaker: 'Alvin',
        text: 'Counting numbers start at 1 and go up.',
        audioSrc: voiceover(7, 'P7S2'),
        backgroundSrc: chapter1Page7,
      },
      {
        speaker: 'Alvin',
        text: 'No zero. No negatives. No fractions.',
        audioSrc: voiceover(7, 'P7S3'),
        backgroundSrc: chapter1Page7,
      },
      {
        speaker: 'System',
        text: 'Select and place only counting numbers.',
        audioSrc: voiceover(7, 'SM1P7'),
        backgroundSrc: chapter1Page7,
      },
      {
        speaker: 'Alvin',
        text: 'I placed 1, 2, 3, 4, and 5 into the altar.',
        audioSrc: voiceover(7, 'P7S4'),
        backgroundSrc: chapter1Page7,
      },
      {
        speaker: 'Alvin',
        text: 'After completing the task, a light flowed through the forest.',
        audioSrc: voiceover(8, 'P8S1'),
        backgroundSrc: chapter1Page8,
      },
      {
        speaker: 'Alvin',
        text: 'A green gem rose from the altar and floated into my hand.',
        audioSrc: voiceover(8, 'P8S2'),
        backgroundSrc: chapter1Page8,
      },
      {
        speaker: 'System',
        text: 'Sacred Gem Acquired: N.',
        audioSrc: voiceover(8, 'SM1P8'),
        backgroundSrc: chapter1Page8,
      },
    ],
    tutorial: {
      title: 'Counting Numbers',
      summary:
        'Counting numbers are the positive whole numbers we use when counting things one by one. They begin at 1 and continue upward: 1, 2, 3, 4, 5, and so on. They do not include 0, negative numbers, fractions, or decimals.',
      points: [
        'Counting numbers begin at 1.',
        'They help us count things one by one.',
        'They do not include 0, negatives, fractions, or decimals.',
      ],
    },
    activities: [
      {
        id: 'c1-lock-1',
        type: 'counting-lock',
        question: 'Unlock the Counting Lock',
        instruction:
          'Roll each slot until only the correct counting numbers remain, then move to the next round.',
        rounds: [
          {
            id: 'round-1',
            title: 'Round 1',
            slots: [
              { id: 'r1-slot-1', answer: '7', choices: ['7', '0', '-5', '2.5'] },
              { id: 'r1-slot-2', answer: '18', choices: ['18', '-9', '1/2', '√2'] },
              { id: 'r1-slot-3', answer: '42', choices: ['42', '0', '-18', 'π'] },
              { id: 'r1-slot-4', answer: '95', choices: ['95', '-100', '7/8', '5.6'] },
            ],
          },
          {
            id: 'round-2',
            title: 'Round 2',
            slots: [
              { id: 'r2-slot-1', answer: '13', choices: ['13', '-4', '0', '1.25'] },
              { id: 'r2-slot-2', answer: '28', choices: ['28', '-12', '√3', '5/4'] },
              { id: 'r2-slot-3', answer: '66', choices: ['66', '-7', 'π', '2.75'] },
              { id: 'r2-slot-4', answer: '84', choices: ['84', '0', '-30', '√11'] },
              { id: 'r2-slot-5', answer: '109', choices: ['109', '-15', '4/3', '9.4'] },
            ],
          },
          {
            id: 'round-3',
            title: 'Round 3',
            slots: [
              { id: 'r3-slot-1', answer: '3', choices: ['3', '-1', '0', '2.4'] },
              { id: 'r3-slot-2', answer: '24', choices: ['24', '-16', '√5', '7/9'] },
              { id: 'r3-slot-3', answer: '57', choices: ['57', '-40', '0', 'π'] },
              { id: 'r3-slot-4', answer: '81', choices: ['81', '-3', '5/6', '√10'] },
              { id: 'r3-slot-5', answer: '132', choices: ['132', '-22', '3.14', '8/5'] },
              { id: 'r3-slot-6', answer: '250', choices: ['250', '-100', '√13', '0.875'] },
            ],
          },
        ],
        feedback:
          'Excellent. You unlocked every slot by choosing only counting numbers: positive whole numbers that begin at 1.',
        incorrectFeedback:
          'Not every slot is unlocked yet. Review which values are positive whole numbers used for counting.',
        script: {
          opening: {
            title: 'Mission Activated: The Counting Forest',
            lines: [
              'The ancient lock has sealed the path ahead.',
              'Only Adventurers who understand Counting Numbers can unlock it.',
              'Remember: Counting Numbers begin with 1 and continue forever (1, 2, 3, ...). They are used to count objects.',
              'Your mission has 3 rounds.',
              'Each lock slot contains 4 numbers, but only one is a Counting Number.',
              'Choose the correct number to unlock each slot and clear every round.',
              'Unlock the final lock to restore the path and continue your adventure.',
            ],
            lineAudioSrcs: [
              activityVoiceover('ACTIVITY 1', 'A1A1'),
              activityVoiceover('ACTIVITY 1', 'A1A2'),
              activityVoiceover('ACTIVITY 1', 'A1A3'),
              activityVoiceover('ACTIVITY 1', 'A1A4'),
              activityVoiceover('ACTIVITY 1', 'A1A5'),
              activityVoiceover('ACTIVITY 1', 'A1A6'),
            ],
            ctaLabel: 'Press START to begin',
          },
          rounds: [
            {
              title: 'Round 1 Activated',
              lines: [
                'The first magical lock stands before you.',
                'Unlock all 4 slots by choosing the correct Counting Number.',
                'Every correct answer brings you one step closer to opening the forest.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 1', 'A1A7'),
                activityVoiceover('ACTIVITY 1', 'A1A8'),
                activityVoiceover('ACTIVITY 1', 'A1A9n'),
              ],
              ctaLabel: 'Unlock the first lock',
            },
            {
              title: 'Round 2 Activated',
              lines: [
                'The challenge is becoming more difficult.',
                'Unlock all 5 slots.',
                'Stay focused and choose only the Counting Numbers.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 1', 'A1A11P2'),
                activityVoiceover('ACTIVITY 1', 'A1A12n'),
              ],
              ctaLabel: 'Break the second lock',
            },
            {
              title: 'Final Round Activated',
              lines: [
                'This is the strongest lock in the forest.',
                'Unlock all 6 slots to complete your mission.',
                'Choose carefully.',
                'The fate of the forest is in your hands.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 1', 'A1A14'),
                activityVoiceover('ACTIVITY 1', 'A1A15n'),
              ],
              ctaLabel: 'Unlock the final lock',
            },
          ],
          roundSuccess: [
            {
              title: 'Excellent Work!',
              lines: [
                'The first lock has been broken.',
                'The forest recognizes your courage.',
                'A stronger lock now blocks your path.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 1', 'A1A10'),
                activityVoiceover('ACTIVITY 1', 'A1A11P1'),
              ],
              ctaLabel: 'Continue to Round 2',
            },
            {
              title: 'Outstanding!',
              lines: [
                'Another magical lock has fallen.',
                'Only one final challenge stands between you and victory.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 1', 'A1A13n'),
              ],
              ctaLabel: 'Continue to the Final Round',
            },
          ],
          completion: {
            title: 'Mission Complete!',
            lines: [
              'Congratulations!',
              'You successfully identified every Counting Number and unlocked the ancient seal.',
              'The forest is safe once again.',
              'A new path has appeared.',
            ],
            lineAudioSrcs: [
              activityVoiceover('ACTIVITY 1', 'A1A16'),
              activityVoiceover('ACTIVITY 1', 'A1A17'),
            ],
          },
        },
      },
    ],
  },
  {
    id: 'chapter-2',
    number: 2,
    order: 2,
    title: 'The Whole Number Gate',
    shortDescription: 'Alvin opens the zero-shaped gate by identifying the whole numbers.',
    description:
      'Discover how whole numbers include zero together with the counting numbers.',
    duration: '10 minutes',
    activityInsertBeforePage: 5,
    scene: {
      location: 'Whole Number Gate',
      mood: 'Steady, bright, and guarded',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 45%, #a3e635 100%)',
      image: chapter2Page9,
      coverImage: chapter2Cover,
      mascotName: 'Zero',
      mascotRole: 'Gate Guardian',
    },
    story: {
      title: 'The zero-shaped entrance',
      background:
        'Beyond the forest, Alvin reaches a massive gate shaped like zero. The only way through is to identify the set that contains whole numbers.',
      narration:
        'I followed the glowing path out of the forest. At its edge stood a massive gate shaped like 0. In front of it stood Zero itself, silently guarding the entrance.',
    },
    dialogues: [
      { speaker: 'Alvin', text: 'I followed the glowing path out of the forest.', audioSrc: voiceover(9, 'P9S1'), backgroundSrc: chapter2Page9 },
      { speaker: 'Alvin', text: 'At its edge stood a massive gate shaped like 0.', audioSrc: voiceover(9, 'P9S2'), backgroundSrc: chapter2Page9 },
      { speaker: 'Alvin', text: 'In front of it stood Zero itself, silently guarding the entrance.', audioSrc: voiceover(9, 'P9S3'), backgroundSrc: chapter2Page9 },
      { speaker: 'Alvin', text: 'Three glowing sets appeared in the air.', audioSrc: voiceover(10, 'P10S1'), backgroundSrc: chapter2Page10 },
      { speaker: 'System', text: 'Whole Numbers = Counting Numbers + 0.', audioSrc: voiceover(10, 'SM1P10'), backgroundSrc: chapter2Page10 },
      { speaker: 'System', text: 'Identify the set of whole numbers.', audioSrc: voiceover(10, 'SM2P10'), backgroundSrc: chapter2Page10 },
      { speaker: 'Alvin', text: 'I examined them carefully.', audioSrc: voiceover(11, 'P11S1'), backgroundSrc: chapter2Page11 },
      { speaker: 'Alvin', text: 'Set A had negatives.', audioSrc: voiceover(11, 'P11S2'), backgroundSrc: chapter2Page11 },
      { speaker: 'Alvin', text: 'Set B had fractions and decimals.', audioSrc: voiceover(11, 'P11S3'), backgroundSrc: chapter2Page11 },
      { speaker: 'Alvin', text: 'Set C had only whole numbers.', audioSrc: voiceover(11, 'P11S4'), backgroundSrc: chapter2Page11 },
      { speaker: 'Alvin', text: 'I selected Set C.', audioSrc: voiceover(11, 'P11S5'), backgroundSrc: chapter2Page11 },
      { speaker: 'System', text: 'Whole Number Gate Trial complete.', audioSrc: voiceover(11, 'SM1P11'), backgroundSrc: chapter2Page11 },
      { speaker: 'Alvin', text: 'The zero-shaped gate glowed brightly and slowly opened.', audioSrc: voiceover(12, 'P12S1'), backgroundSrc: chapter2Page12 },
      { speaker: 'Alvin', text: 'A blue gem floated into my hands.', audioSrc: voiceover(12, 'P12S2'), backgroundSrc: chapter2Page12 },
      { speaker: 'System', text: 'Sacred Gem Acquired: W.', audioSrc: voiceover(12, 'SM1P12'), backgroundSrc: chapter2Page12 },
      { speaker: 'System', text: 'Map Update: The Portal Gate unlocks.', audioSrc: voiceover(12, 'SM2P12'), backgroundSrc: chapter2Page12 },
    ],
    tutorial: {
      title: 'Whole Numbers',
      summary:
        'Whole numbers are used when counting quantities that may include zero. They include 0 together with the counting numbers: 0, 1, 2, 3, 4, and so on. They do not include negative numbers, fractions, or decimals.',
      points: [
        'Whole numbers include 0.',
        'Whole numbers also include the counting numbers.',
        'They do not include negatives, fractions, or decimals.',
      ],
    },
    activities: [
      {
        id: 'c2-gatekeeper-1',
        type: 'gatekeeper',
        question: 'Gatekeeper of Whole Numbers',
        instruction:
          'A number appears at the Whole Number Gate. Accept it if it is a whole number. Reject it if it is not.',
        gateBackground: gateActivityImage,
        successMessage: 'The gate accepts only whole numbers. The path opens for Alvin.',
        incorrectFeedback:
          'A wrong decision was made at the gate. Restart the full activity and sort the numbers again.',
        cards: [
          { id: 'whole-0', label: '0', correctAction: 'accept' },
          { id: 'whole-2', label: '2', correctAction: 'accept' },
          { id: 'whole-5', label: '5', correctAction: 'accept' },
          { id: 'whole-8', label: '8', correctAction: 'accept' },
          { id: 'whole-11', label: '11', correctAction: 'accept' },
          { id: 'whole-16', label: '16', correctAction: 'accept' },
          { id: 'whole-24', label: '24', correctAction: 'accept' },
          { id: 'whole-39', label: '39', correctAction: 'accept' },
          { id: 'whole-58', label: '58', correctAction: 'accept' },
          { id: 'whole-100', label: '100', correctAction: 'accept' },
          { id: 'not-whole-neg3', label: '-3', correctAction: 'reject' },
          { id: 'not-whole-half', label: '1/2', correctAction: 'reject' },
          { id: 'not-whole-decimal', label: '4.7', correctAction: 'reject' },
          { id: 'not-whole-root2', label: '√2', correctAction: 'reject' },
          { id: 'not-whole-neg10', label: '-10', correctAction: 'reject' },
        ],
        feedback:
          'Correct. Alvin guarded the gate by accepting all whole numbers and rejecting every non-whole number.',
        script: {
          opening: {
            title: 'Mission Activated: The Whole Number Gate',
            lines: [
              'A powerful gate blocks the road ahead.',
              'The Gatekeeper only allows Whole Numbers to pass.',
              'Remember: Whole Numbers include 0 and all positive counting numbers (0, 1, 2, 3, ...). They do not include negative numbers, fractions, decimals, or irrational numbers.',
              'One number will appear before the gate at a time.',
              'If it is a Whole Number, choose ACCEPT.',
              'If it is not a Whole Number, choose REJECT.',
              'Inspect all 15 numbers to unlock the gate and continue your adventure.',
            ],
            ctaLabel: 'Press START to begin',
          },
          completion: {
            title: 'Mission Complete!',
            lines: [
              'Excellent work!',
              'You successfully identified every Whole Number and proved yourself worthy of passing the gate.',
              'The ancient gate slowly opens, revealing the road to the next kingdom.',
            ],
            lineAudioSrcs: [
              activityVoiceover('ACTIVITY 2', 'A2A6'),
              activityVoiceover('ACTIVITY 2', 'A2A7'),
            ],
          },
        },
      },
    ],
  },
  {
    id: 'chapter-3',
    number: 3,
    order: 3,
    title: 'The Town of Integers',
    shortDescription: 'Alvin restores order by placing integers and removing non-integers.',
    description:
      'Explore how integers include negative numbers, zero, and positive whole numbers.',
    duration: '15 minutes',
    activityInsertBeforePage: 4,
    scene: {
      location: 'Town of Integers',
      mood: 'Busy, divided, and orderly',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #64748b 48%, #16a34a 100%)',
      image: chapter3Page13,
      coverImage: chapter3Cover,
      mascotName: 'Zero Portal',
      mascotRole: 'Neutral Center',
    },
    story: {
      title: 'The town in chaos',
      background:
        'A circular town appears, split into negative and positive sides with zero at the center. Fractions and decimals create confusion until Alvin restores the correct order.',
      narration:
        'As I stepped through the portal, I found myself in a circular town. The left side belonged to negative numbers, the right side to positive numbers, and at the center stood the Zero Portal.',
    },
    dialogues: [
      { speaker: 'Alvin', text: 'As I stepped through the portal, I found myself in a circular town.', audioSrc: voiceover(13, 'P13S1'), backgroundSrc: chapter3Page13 },
      { speaker: 'System', text: 'Welcome to the Town of Integers.', audioSrc: voiceover(13, 'SM1P13'), backgroundSrc: chapter3Page13 },
      { speaker: 'System', text: 'The left side is the Negative District.', audioSrc: voiceover(13, 'SM2P13'), backgroundSrc: chapter3Page13 },
      { speaker: 'System', text: 'The right side is the Positive District. At the center stands the Zero Portal, connected to the Counting Forest.', audioSrc: voiceover(13, 'SM3P13'), backgroundSrc: chapter3Page13 },
      { speaker: 'Alvin', text: 'After a few moments, fractions and decimals had entered the town, causing chaos.', audioSrc: voiceover(14, 'P14S1'), backgroundSrc: chapter3Page14 },
      { speaker: 'Alvin', text: 'Numbers wandered along the roads, confused and misplaced.', audioSrc: voiceover(14, 'P14S2'), backgroundSrc: chapter3Page14 },
      { speaker: 'System', text: 'Integers consist of negative numbers, zero, and positive numbers.', audioSrc: voiceover(14, 'SM1P14'), backgroundSrc: chapter3Page14 },
      { speaker: 'System', text: 'Arrange the numbers based on their correct placement in the town, and remove all non-integer numbers to solve the chaos.', audioSrc: voiceover(14, 'SM2P14'), backgroundSrc: chapter3Page14 },
      { speaker: 'Alvin', text: 'I fixed the town step by step.', audioSrc: voiceover(15, 'P15S1'), backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'I placed 0 at the center.', audioSrc: voiceover(15, 'P15S2'), backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'I guided positive numbers to the right.', audioSrc: voiceover(15, 'P15S3'), backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'I led negative numbers to the left.', audioSrc: voiceover(15, 'P15S4'), backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'I removed the fractions and decimals from the town.', audioSrc: voiceover(15, 'P15S5'), backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'The paths aligned.', audioSrc: voiceover(15, 'P15S6'), backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'The town became calm.', audioSrc: voiceover(15, 'P15S7'), backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'A red gem descended into my hands.', audioSrc: voiceover(15, 'P15S8'), backgroundSrc: chapter3Page15 },
      { speaker: 'System', text: 'Sacred Gem Acquired: Z.', audioSrc: voiceover(15, 'SM1P15'), backgroundSrc: chapter3Page15 },
    ],
    tutorial: {
      title: 'Integers',
      summary:
        'Integers are numbers that include negative whole numbers, zero, and positive whole numbers. They are used to describe values above zero, below zero, or exactly zero. Integers do not include fractions or decimals.',
      points: [
        'Integers include negative numbers, zero, and positive whole numbers.',
        'Negative integers are placed to the left of zero.',
        'Fractions and decimals are not integers.',
      ],
    },
    activities: [
      {
        id: 'c3-integer-trial-1',
        type: 'integer-trial',
        question: 'Integer Trial and Town Map',
        instruction:
          'Answer 2 integer questions to obtain each item, then solve the final town map puzzle.',
        imageSrc: treasurePuzzleImage,
        stages: [
          {
            id: 'map-stage',
            itemId: 'map',
            itemLabel: 'Map',
            prompts: [
              {
                id: 'c3-q1',
                question: 'Which of the following best describes an integer?',
                choices: [
                  'Numbers used only for counting',
                  'Numbers that include negative numbers, zero, and positive whole numbers',
                  'Numbers that can only be written as fractions',
                  'Numbers with decimal values only',
                ],
                answer: 'Numbers that include negative numbers, zero, and positive whole numbers',
              },
              {
                id: 'c3-q2',
                question: 'Which of the following is an integer?',
                choices: ['2.5', '3/4', '-8', 'âˆš2'],
                answer: '-8',
              },
            ],
          },
          {
            id: 'torch-stage',
            itemId: 'torch',
            itemLabel: 'Torch',
            prompts: [
              {
                id: 'c3-q3',
                question: 'Which list contains only integers?',
                choices: [
                  '{-5, 0, 8}',
                  '{-4, 2.5, 10}',
                  '{3/4, -8, 6}',
                  '{âˆš2, -5, 9}',
                ],
                answer: '{-5, 0, 8}',
              },
              {
                id: 'c3-q4',
                question: 'Which of the following numbers is an integer?',
                choices: ['-12', '4.8', '7/3', '√5'],
                answer: '-12',
              },
            ],
          },
          {
            id: 'key-stage',
            itemId: 'key',
            itemLabel: 'Key',
            prompts: [
              {
                id: 'c3-q5',
                question: 'Which number is NOT an integer?',
                choices: ['-7', '0', '15', '2.4'],
                answer: '2.4',
              },
              {
                id: 'c3-q6',
                question: 'Which statement is TRUE about integers?',
                choices: [
                  'Integers include fractions.',
                  'Integers include decimals.',
                  'Integers include negative numbers, zero, and positive whole numbers.',
                  'Integers are only positive numbers.',
                ],
                answer: 'Integers include negative numbers, zero, and positive whole numbers.',
              },
            ],
          },
        ],
        script: {
          opening: {
            title: 'Mission Activated: The Town of Integers',
            lines: [
              'The legendary Numberland Treasure is locked inside an ancient treasure chest.',
              'To unlock it, you must collect three sacred items: The Map, The Torch, and The Key.',
              'You can earn these items by answering Integer questions correctly.',
              'Remember: Integers include negative numbers, zero, and positive whole numbers. They do not include fractions, decimals, or irrational numbers.',
              'Collect all three sacred items to unlock the legendary treasure.',
            ],
            ctaLabel: 'Press START to begin',
          },
          stages: [
            {
              title: 'Stage 1 Activated',
              lines: [
                'Answer the next 2 questions to earn the Treasure Map.',
                'Complete the map challenge to reveal the hidden treasure.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 3/new', 'A'),
              ],
              ctaLabel: 'Begin Stage 1',
            },
            {
              title: 'Stage 2 Activated',
              lines: [
                'Answer the next 2 questions to earn the Magic Torch.',
                'Its light will guide you to the final challenge.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 3/new', 'C'),
              ],
              ctaLabel: 'Begin Stage 2',
            },
            {
              title: 'Stage 3 Activated',
              lines: [
                'Answer the next 2 questions to earn the Ancient Key.',
                'Think carefully—every correct answer increases your chance of unlocking the treasure.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 3/new', 'E'),
              ],
              ctaLabel: 'Begin Stage 3',
            },
          ],
          stageSuccess: [
            {
              title: 'Congratulations!',
              lines: ['You earned the Treasure Map.', 'Great job explorer!', ' You are one step closer to the treasure.'],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 3/new', 'B'),
              ],
              ctaLabel: 'Continue',
            },
            {
              title: 'Congratulations!',
              lines: ['You earned the Magic Torch', 'Keep it up!', 'Your journey through Numberland continues.'],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 3/new', 'D'),
              ],
              ctaLabel: 'Continue',
            },
            {
              title: 'Congratulations!',
              lines: [
                'You earned the Ancient Key!',
                'You now have everything you need for the final mission.',
              ],
              lineAudioSrcs: [
                activityVoiceover('ACTIVITY 3/new', 'F'),
              ],
              ctaLabel: 'Continue to the Final Challenge',
            },
          ],
          finalChallenge: {
            title: 'Final Challenge Activated',
            lines: [
              'The legendary treasure chest stands before you.',
              'Restore the town map to unlock the Numberland Treasure.',
              'Trust your knowledge and complete the final puzzle.',
            ],
            lineAudioSrcs: [
              activityVoiceover('ACTIVITY 3/new', 'G'),
            ],
            ctaLabel: 'Unlock the Treasure Chest',
          },
          completion: {
            title: 'Mission Complete!',
            lines: [
              'Congratulations!',
              'You conquered the Town of Integers and claimed the legendary Numberland Treasure.',
              'Reward Unlocked: Numberland Treasure',
              'Your adventure continues!',
            ],
            lineAudioSrcs: [
              activityVoiceover('ACTIVITY 3/new', 'H'),
            ],
          },
        },
        prompts: [
          {
            id: 'c3-q1',
            question: 'Which of the following best describes an integer?',
            choices: [
              'Numbers used only for counting',
              'Numbers that include negative numbers, zero, and positive whole numbers',
              'Numbers that can only be written as fractions',
              'Numbers with decimal values only',
            ],
            answer: 'Numbers that include negative numbers, zero, and positive whole numbers',
          },
          {
            id: 'c3-q2',
            question: 'Which of the following is an integer?',
            choices: ['2.5', '3/4', '-8', '√2'],
            answer: '-8',
          },
          {
            id: 'c3-q3',
            question: 'Which list contains only integers?',
            choices: [
              '{-5, 0, 8}',
              '{-4, 2.5, 10}',
              '{3/4, -8, 6}',
              '{√2, -5, 9}',
            ],
            answer: '{-5, 0, 8}',
          },
          {
            id: 'c3-q4',
            question: 'Which of the following numbers is an integer?',
            choices: ['-12', '4.8', '7/3', '√5'],
            answer: '-12',
          },
          {
            id: 'c3-q5',
            question: 'Which number is NOT an integer?',
            choices: ['-7', '0', '15', '2.4'],
            answer: '2.4',
          },
          {
            id: 'c3-q6',
            question: 'Which statement is TRUE about integers?',
            choices: [
              'Integers include fractions.',
              'Integers include decimals.',
              'Integers include negative numbers, zero, and positive whole numbers.',
              'Integers are only positive numbers.',
            ],
            answer: 'Integers include negative numbers, zero, and positive whole numbers.',
          },
          {
            id: 'c3-q7',
            question:
              'Alvin can only unlock the treasure if he chooses the set that contains only integers. Which set should he choose?',
            choices: [
              '{-8, 0, 15}',
              '{-4, 2.5, 10}',
              '{1/2, -6, 8}',
              '{√2, -2, 7}',
            ],
            answer: '{-8, 0, 15}',
          },
        ],
        feedback:
          'Excellent. You completed the integer quiz and restored the town map, so Alvin can continue fixing the districts.',
        incorrectFeedback:
          'The integer trial is not complete yet. Finish the quiz and solve the town map before moving on.',
      },
    ],
  },
  {
    id: 'chapter-4',
    number: 4,
    order: 4,
    title: 'The Rational and Irrational Countries',
    shortDescription: 'Alvin learns which numbers belong to the Rational Country and which belong beyond the bridge.',
    description:
      'Travel beyond the Town of Integers to classify rational and irrational numbers.',
    duration: '12 minutes',
    activityInsertBeforePage: 8,
    scene: {
      location: 'Rational and Irrational Border',
      mood: 'Expansive, mysterious, and alert',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #db2777 35%, #4f46e5 70%, #0f172a 100%)',
      image: chapter4Page16,
      coverImage: chapter4Cover,
      mascotName: 'System',
      mascotRole: 'Border Guide',
    },
    story: {
      title: 'Beyond the town',
      background:
        'Past the Town of Integers, Alvin discovers the districts of fractions, decimals, and percentages, then reaches the bridge to the Irrational Country where border verification begins.',
      narration:
        'As I walked beyond the Town of Integers, the land slowly changed. The buildings of whole numbers faded, and I found myself standing at the edge of a wide circular zone filled with a new set of numbers.',
    },
    dialogues: [
      {
        speaker: 'Alvin',
        text: 'As I walked beyond the Town of Integers, the land slowly changed.',
        backgroundSrc: chapter4Page16,
        audioSrcs: [
          voiceover(16, 'P16S1'),
          voiceover(16, 'P16S2'),
        ],
      },
      { speaker: 'Alvin', text: 'The buildings of whole numbers faded.', backgroundSrc: chapter4Page16, audioSrc: voiceover(16, 'P16S3.(EDITABLE)mp3') },
      { speaker: 'Alvin', text: 'I found myself standing at the edge of a wide circular zone filled with a new set of numbers, fractions.', backgroundSrc: chapter4Page16, audioSrc: voiceover(16, 'P16S4') },
      { speaker: 'Alvin', text: 'I looked around. Before I could speak, a message appeared.', backgroundSrc: chapter4Page16, audioSrc: voiceover(16, 'P16S5') },
      { speaker: 'System', text: 'Current Location: Fraction City. Surrounding Zones Detected: Decimal City and Percentage City.', backgroundSrc: chapter4Page16, audioSrc: voiceover(16, 'P16SM1') },
      { speaker: 'System', text: 'The three cities circle the Town of Integers.', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 A') },
      { speaker: 'System', text: 'They contain numbers that are not whole but still belong to the Rational Country.', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 B') },
      { speaker: 'System', text: 'Rational Country is composed of any number that can be written as a fraction in the form a/b, where;', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 C') },
      { speaker: 'System', text: 'a and b are integers, b is not equal to 0', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 D') },
      { speaker: 'System', text: 'Decimal City. A place for numbers written in decimal form. Decimals can be:', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 E') },
      { speaker: 'System', text: 'Terminating; meaning they end after a certain number of digits. Examples: 0.5, 2.75, 8.125.', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 F') },
      { speaker: 'System', text: 'Repeating; Meaning one or more digits repeat forever. Examples: 0.3333, 1.272727.', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 G') },
      { speaker: 'System', text: 'Fraction City. A place for numbers written in fractions.', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 H ') },
      { speaker: 'System', text: 'Examples: 3/4, 1/4.', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 I') },
      { speaker: 'System', text: 'Percent City. A place for numbers written as percentages.', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 J') },
      { speaker: 'System', text: 'Examples: 60%, 75%, 16.66%', backgroundSrc: chapter4Page17, audioSrc: voiceover(17, 'Page 17 K') },
      { speaker: 'Alvin', text: 'I walked around the district and saw a bridge going to an unknown island.', backgroundSrc: chapter4Page18, audioSrc: voiceover(18, 'P18S1') },
      { speaker: 'System', text: 'Beyond the bridge is the Irrational Country.', backgroundSrc: chapter4Page18, audioSrc: voiceover(18, 'SM1P18') },
      { speaker: 'System', text: 'Unlike the Rational Country, this place has only two mysterious cities. Their numbers cannot be written as a fraction in the form a/b.', backgroundSrc: chapter4Page19, audioSrc: voiceover(19, 'Page 19 A') },
      { speaker: 'System', text: 'Endless City. A city where the decimal numbers never stop. These numbers are called non-terminating decimals because they continue forever.', backgroundSrc: chapter4Page19, audioSrc: voiceover(19, 'Page 19 B') },
      { speaker: 'System', text: 'Examples include π = 3.1415926..., e  2.7182818....', backgroundSrc: chapter4Page19, audioSrc: voiceover(19, 'Page 19 C') },
      { speaker: 'System', text: 'Patternless City. A city where the decimal numbers never repeat the same pattern. These numbers are called non-repeating decimals.', backgroundSrc: chapter4Page19, audioSrc: voiceover(19, 'Page 19 D') },
      { speaker: 'System', text: 'Examples: √2 = 1.4142135..., √3 = 1.7320508..., √5 = 2.2360679....', backgroundSrc: chapter4Page19, audioSrc: voiceover(19, 'Page 19 E') },
      { speaker: 'System', text: 'Every number in the Irrational Country is both non-terminating and non-repeating. That is why they cannot be written as a fraction.', backgroundSrc: chapter4Page19, audioSrc: voiceover(19, 'Page 19 F') },
      { speaker: 'Alvin', text: 'As I looked at the bridge, I noticed numbers running toward my direction.', backgroundSrc: chapter4Page20, audioSrc: voiceover(20, 'p20s1') },
      { speaker: 'System', text: 'Some numbers have attempted to enter the Rational Country.', backgroundSrc: chapter4Page20, audioSrc: voiceover(20, 'SM1P20') },
      { speaker: 'System', text: 'Do not allow irrational numbers to pass through.', backgroundSrc: chapter4Page20, audioSrc: voiceover(20, 'SM2P20') },
      { speaker: 'System', text: 'The system highlighted the intruders on the bridge.', backgroundSrc: chapter4Page20, audioSrc: voiceover(20, 'SM3P20') },
      { speaker: 'System', text: 'Boundary instability detected.', backgroundSrc: chapter4Page20, audioSrc: voiceover(20, 'SM4P20') },
      { speaker: 'System', text: 'Rational numbers can be written as fractions of integers.', backgroundSrc: chapter4Page20, audioSrc: voiceover(20, 'SM5P20') },
      { speaker: 'System', text: 'Irrational numbers cannot be written as fractions.', backgroundSrc: chapter4Page20, audioSrc: voiceover(20, 'SM6P20') },
      { speaker: 'System', text: 'Verify these intruders: 1.6666..., 1, 0.75, √2, 1.674737..., and π.', backgroundSrc: chapter4Page20, audioSrc: voiceover(20, 'SM7P20') },
      { speaker: 'System', text: 'Boundary Rule: If a number can be written as a fraction, it belongs into rational country.', backgroundSrc: chapter4Page21, audioSrc: voiceover(21, '1st SM1P21 (NOTE_ pakilagay sa unahan pls) ') },
      { speaker: 'Alvin', text: 'I stepped forward.', backgroundSrc: chapter4Page21, audioSrc: voiceover(21, 'P21S1') },
      { speaker: 'Alvin', text: '"This can be written as a fraction," I said, pointing to 1.', backgroundSrc: chapter4Page21, audioSrc: voiceover(21, 'P21S2') },
      { speaker: 'Alvin', text: '"This can be written as 3/4,", I said, about 0.75.', backgroundSrc: chapter4Page21, audioSrc: voiceover(21, 'P21S3') },
      { speaker: 'Alvin', text: '"The decimal repeats,", I said, about 1.6666....', backgroundSrc: chapter4Page21, audioSrc: voiceover(21, 'P21S4') },
      { speaker: 'Alvin', text: '"This decimal never repeats,", I said, about 1.6774737....', backgroundSrc: chapter4Page21, audioSrc: voiceover(21, 'P21S5') },
      { speaker: 'Alvin', text: '"√2 cannot be written as a fraction," I explained.', backgroundSrc: chapter4Page21, audioSrc: voiceover(21, 'P21S6') },
      { speaker: 'Alvin', text: '"No fraction can represent π exactly" I said.', backgroundSrc: chapter4Page21, audioSrc: voiceover(21, 'P21S7') },
      { speaker: 'Alvin', text: 'I guided 1, 0.75, and 1.6666... inside.', backgroundSrc: chapter4Page22, audioSrc: voiceover(22, 'S1P22') },
      { speaker: 'Alvin', text: 'I led √2, 1.674737..., and π back to the Irrational Country.', backgroundSrc: chapter4Page22, audioSrc: voiceover(22, 'S2P22') },
      { speaker: 'System', text: 'Boundary secured.', backgroundSrc: chapter4Page22, audioSrc: voiceover(22, 'SM1P22') },
      { speaker: 'System', text: "Sacred Gems Acquired: Q and Q'.", backgroundSrc: chapter4Page22, audioSrc: voiceover(22, 'SM2p22') },
    ],
    tutorial: {
      title: 'Rational and Irrational Numbers',
      summary:
        'Rational numbers can be written as a fraction of integers. This includes fractions, terminating decimals, repeating decimals, and percentages. Irrational numbers cannot be written as simple fractions, and their decimals never end and never repeat. Examples include π and √2.',
      points: [
        'Rational numbers can be written as a fraction a/b where b is not 0.',
        'Terminating and repeating decimals are rational.',
        'Non-terminating and non-repeating decimals are irrational.',
      ],
    },
    activities: [
      {
        id: 'c4-memory-match-1',
        type: 'memory-match',
        question: 'Memory Match: Rational or Irrational?',
        instruction:
          'Flip two cards at a time to find matching pairs. Each time you find a match, classify the number as Rational Number or Irrational Number before the pair unlocks.',
        pairs: [
          { id: 'pair-08', label: '0.8', classification: 'Rational Number' },
          { id: 'pair-root3', label: '√3', classification: 'Irrational Number' },
          { id: 'pair-34', label: '3/4', classification: 'Rational Number' },
          { id: 'pair-14159', label: '14.159...%', classification: 'Irrational Number' },
          { id: 'pair-neg15', label: '-1.5', classification: 'Rational Number' },
          { id: 'pair-pi', label: 'π', classification: 'Irrational Number' },
          { id: 'pair-7758', label: '7.758…', classification: 'Irrational Number' },
          { id: 'pair-45', label: '45%', classification: 'Rational Number' },
        ],
        feedback:
          'Excellent. You matched every number and classified each one correctly as rational or irrational.',
        incorrectFeedback:
          'Some pairs are still missing or not classified correctly. Keep matching and classifying the numbers.',
        script: {
          opening: {
            title: 'Mission Activated: The Rational & Irrational Countries',
            lines: [
              'The magical Memory Stones have been scattered across two neighboring kingdoms.',
              'Your mission is to restore balance by finding every matching pair.',
              'Rational Numbers can be written as a fraction of two integers.',
              'Irrational Numbers cannot be written as a fraction because their decimals never end and never repeat.',
              'Flip 2 cards at a time.',
              'When you find a matching pair, identify whether it belongs to the Rational Country (Q) or the Irrational Country (Q′).',
              'Unlock all 8 pairs to restore peace between the two kingdoms.',
            ],
            ctaLabel: 'Press START to begin',
          },
          completion: {
            title: 'Mission Complete!',
            lines: [
              'Amazing work!',
              'You found every matching pair and restored peace between the Rational and Irrational Countries.',
              'Reward Unlocked: Twin Gems of Q & Q′',
              'The two kingdoms thank you for your bravery.',
            ],
            lineAudioSrcs: [
              activityVoiceover('ACTIVITY 4', 'A4A6'),
            ],
          },
        },
      },
    ],
  },
  {
    id: 'chapter-5',
    number: 5,
    order: 5,
    title: 'The Real Number Line',
    shortDescription: 'Alvin restores the cracked Number Line and earns the final real-number gem.',
    description:
      'Bring all the number groups together on the Real Number Line and place each value where it belongs.',
    duration: '18 minutes',
    activityInsertBeforePage: 5,
    scene: {
      location: 'Real Number Line',
      mood: 'Grand, reflective, and complete',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 22%, #22c55e 48%, #3b82f6 72%, #8b5cf6 100%)',
      image: chapter5Page23,
      coverImage: chapter5Cover,
      mascotName: 'Number Line',
      mascotRole: 'Kingdom Bridge',
    },
    story: {
      title: 'When everything finds its place',
      background:
        'The rainbow Number Line returns, but the kingdom shakes and the line cracks. Alvin must arrange different real numbers correctly to restore balance and finish his adventure.',
      narration:
        'The rainbow Number Line appeared again, and I followed the path it made. Without warning, the ground shook. The Number Line cracked, and numbers floated chaotically around me.',
    },
    dialogues: [
      { speaker: 'Alvin', text: 'The rainbow Number Line appeared again.', backgroundSrc: chapter5Page23, audioSrc: voiceover(23, 'S1P23') },
      { speaker: 'Alvin', text: 'I followed the path it made.', backgroundSrc: chapter5Page23, audioSrc: voiceover(23, 'S2P23') },
      { speaker: 'System', text: 'The Number Line connects all real numbers. Left: Decreasing. Right: Increasing.', backgroundSrc: chapter5Page23, audioSrc: voiceover(23, 'SM1P23') },
      { speaker: 'Alvin', text: 'Without warning, the ground shook.', backgroundSrc: chapter5Page24, audioSrc: voiceover(24, '1st') },
      { speaker: 'Alvin', text: 'The Number Line cracked.', backgroundSrc: chapter5Page24, audioSrc: voiceover(24, '2nd') },
      { speaker: 'Alvin', text: 'Numbers floated chaotically.', backgroundSrc: chapter5Page24, audioSrc: voiceover(24, '3rd') },
      { speaker: 'Alvin', text: '-4, -1, 0, 2, 3.5, 1/2, and √2.', backgroundSrc: chapter5Page24, audioSrc: voiceover(24, '4th') },
      { speaker: 'System', text: 'Kingdom instability detected.', backgroundSrc: chapter5Page24, audioSrc: voiceover(24, 'SM1') },
      { speaker: 'System', text: 'Restore balance to the kingdom by arranging the numbers from least to greatest on the Number Line.', backgroundSrc: chapter5Page24, audioSrc: voiceover(24, 'SM2') },
      { speaker: 'Alvin', text: 'I placed the numbers correctly.', backgroundSrc: chapter5Page25, audioSrc: voiceover(25, '1st') },
      { speaker: 'Alvin', text: '-4, -1, 0, 1/2, √2, 2, 3.5.', backgroundSrc: chapter5Page25, audioSrc: voiceover(25, '2nd') },
      { speaker: 'Alvin', text: 'The rainbow reformed.', backgroundSrc: chapter5Page25, audioSrc: voiceover(25, '3rd') },
      { speaker: 'System', text: 'Sequence verified.', backgroundSrc: chapter5Page25, audioSrc: voiceover(25, 'SM1') },
      { speaker: 'Alvin', text: 'After completing all the tasks, a bright light surrounded me.', backgroundSrc: chapter5Page26, audioSrc: voiceover(26, '1st (1)') },
      { speaker: 'Alvin', text: 'When I opened my eyes, I was back in the classroom.', backgroundSrc: chapter5Page26, audioSrc: voiceover(26, '2nd (1)') },
      { speaker: 'Alvin', text: 'The book lay closed on my desk.', backgroundSrc: chapter5Page26, audioSrc: voiceover(26, '3rd (1)') },
      { speaker: 'Alvin', text: 'In my hand was a final gem.', backgroundSrc: chapter5Page26, audioSrc: voiceover(26, '4th') },
      { speaker: 'System', text: 'Sacred Gem Acquired: R (Real Numbers).', backgroundSrc: chapter5Page26, audioSrc: voiceover(26, 'SM1 (NOTE_ LAST AUDIO PLS)') },
    ],
    tutorial: {
      title: 'The Real Number Line',
      summary:
        'Real numbers include rational and irrational numbers. Every real number can be compared, ordered, and placed somewhere on the Number Line.',
      points: [
        'Real numbers include rational and irrational numbers.',
        'Every real number can be placed somewhere on the Number Line.',
        'Numbers increase as you move right and decrease as you move left.',
      ],
    },
    activities: [
      {
        id: 'c5-real-number-line-1',
        type: 'real-number-line',
        question: 'The Real Number Line: Find and Plot',
        instruction:
          'Complete Part 1 first by placing each number into one correct subset. Then unlock Part 2 and plot every number onto the real number line.',
        zones: [
          { id: 'counting', label: 'Counting Numbers (N)' },
          { id: 'whole', label: 'Whole Numbers (W)' },
          { id: 'integers', label: 'Integers (Z)' },
          { id: 'rational', label: 'Rational Numbers (Q)' },
          { id: 'irrational', label: "Irrational Numbers (Q')" },
        ],
        items: [
          {
            id: 'rn-6',
            label: '6',
            validZones: ['counting', 'whole', 'integers', 'rational'],
            value: 6,
          },
          {
            id: 'rn-12',
            label: '12',
            validZones: ['counting', 'whole', 'integers', 'rational'],
            value: 12,
          },
          {
            id: 'rn-0',
            label: '0',
            validZones: ['whole', 'integers', 'rational'],
            value: 0,
          },
          {
            id: 'rn-neg8',
            label: '-8',
            validZones: ['integers', 'rational'],
            value: -8,
          },
          {
            id: 'rn-34',
            label: '3/4',
            validZones: ['rational'],
            value: 0.75,
          },
          {
            id: 'rn-neg25',
            label: '-2.5',
            validZones: ['rational'],
            value: -2.5,
          },
          {
            id: 'rn-root2',
            label: '√2',
            validZones: ['irrational'],
            value: 1.414,
            approximation: '1.41',
          },
          {
            id: 'rn-pi',
            label: 'π',
            validZones: ['irrational'],
            value: 3.1416,
            approximation: '3.14',
          },
          {
            id: 'rn-root5',
            label: '√5',
            validZones: ['irrational'],
            value: 2.236,
            approximation: '2.24',
          },
          {
            id: 'rn-repeat',
            label: '7.232323...',
            validZones: ['rational'],
            value: 7.232323,
          },
        ],
        slots: [
          { id: 'slot-neg8', accepts: 'rn-neg8', positionPercent: 7.7 },
          { id: 'slot-neg25', accepts: 'rn-neg25', positionPercent: 28.8 },
          { id: 'slot-0', accepts: 'rn-0', positionPercent: 38.5 },
          { id: 'slot-34', accepts: 'rn-34', positionPercent: 41.3 },
          { id: 'slot-root2', accepts: 'rn-root2', positionPercent: 43.9 },
          { id: 'slot-root5', accepts: 'rn-root5', positionPercent: 47.1 },
          { id: 'slot-pi', accepts: 'rn-pi', positionPercent: 50.5 },
          { id: 'slot-6', accepts: 'rn-6', positionPercent: 61.5 },
          { id: 'slot-repeat', accepts: 'rn-repeat', positionPercent: 66.3 },
          { id: 'slot-12', accepts: 'rn-12', positionPercent: 84.6 },
        ],
        feedback:
          'Excellent. Every number was placed into a correct subset and plotted correctly on the real number line.',
        incorrectFeedback:
          'The real number challenge is not complete yet. Finish both parts before moving on.',
        script: {
          opening: {
            title: 'Final Mission Activated: The Real Number Challenge',
            lines: [
              'Congratulations, Adventurer.',
              'You have successfully explored the Counting Forest, opened the Whole Number Gate, conquered the Town of Integers, and restored peace between the Rational and Irrational Countries.',
              'One final challenge remains.',
              'This is your chance to prove everything you have learned throughout your journey.',
              'The Real Number Challenge consists of two parts.',
              'You must complete Part 1 before Part 2 becomes available.',
            ],
            ctaLabel: 'Press START to begin',
          },
          part1: {
            title: 'Part 1 Activated',
            lines: [
              'Ten numbers have appeared before you.',
              'Your task is to place each number into one correct subset of real numbers.',
              'The available subsets are Counting Numbers (N), Whole Numbers (W), Integers (Z), Rational Numbers (Q), and Irrational Numbers (Q′).',
              'Some numbers belong to more than one subset.',
              'You only need to place each number into one correct subset.',
              'Correctly place all 10 numbers to unlock the final challenge.',
            ],
            ctaLabel: 'Begin Part 1',
          },
          afterPart1: {
            title: 'Part 1 Complete!',
            lines: [
              'Excellent work!',
              'You successfully identified the correct subset for every number.',
              'Your understanding of the subsets of real numbers has unlocked the final challenge.',
              'The Real Number Line is now available.',
            ],
            lineAudioSrcs: [
              activityVoiceover('ACTIVITY 5', 'A5A7'),
            ],
            ctaLabel: 'Proceed to Part 2',
          },
          part2: {
            title: 'Part 2 Activated',
            lines: [
              'The final trial begins now.',
              'Place each number in its correct position on the Real Number Line.',
              'Each position accepts only one number.',
              'Need help with the irrational numbers?',
              'Approximate values will be provided for √2 ≈ 1.41, √5 ≈ 2.24, and π ≈ 3.14.',
              'Use these clues wisely and complete the number line to finish your adventure.',
            ],
            ctaLabel: 'Begin Part 2',
          },
          completion: {
            title: 'Mission Complete!',
            lines: [
              'Congratulations, Adventurer!',
              'You have completed the Final Trial.',
              'Throughout your journey, you mastered Counting Numbers, Whole Numbers, Integers, Rational and Irrational Numbers, and the Real Number Line.',
              'Achievement Unlocked: Master of Numberland',
              'The world of Numberland has been restored because of your knowledge, perseverance, and determination.',
              'Thank you for completing the adventure.',
            ],
            lineAudioSrcs: [
              activityVoiceover('ACTIVITY 5', 'A5A12'),
              activityVoiceover('ACTIVITY 5', 'A5A13'),
              activityVoiceover('ACTIVITY 5', 'A5A14'),
            ],
          },
        },
      },
    ],
  },
  {
    id: 'chapter-6',
    number: 6,
    order: 6,
    title: 'BEYOND NUMBERLAND — NUMBERS IN REAL LIFE',
    shortDescription: 'Alvin connects each number set to everyday situations beyond Numberland.',
    description:
      'Review how counting numbers, whole numbers, integers, rational numbers, and irrational numbers appear in real life.',
    duration: '8 minutes',
    scene: {
      location: 'Beyond Numberland',
      mood: 'Reflective, practical, and complete',
      gradient: 'linear-gradient(135deg, #0f766e 0%, #2563eb 48%, #f59e0b 100%)',
      image: chapter6Page27,
      coverImage: chapter6Cover,
      mascotName: 'Alvin',
      mascotRole: 'Numberland Graduate',
    },
    story: {
      title: 'Numbers outside the book',
      background:
        'Back in the classroom, Alvin realizes that Numberland was not only a magical place. Its lessons appear in counting, measuring, comparing, and understanding the world around him.',
      narration:
        'I held the book close and remembered everything Numberland had taught me. The adventure was over, but the numbers were still everywhere around me.',
    },
    dialogues: [
      { speaker: 'Alvin', text: 'Now I understand.', backgroundSrc: chapter6Page27, audioSrc: voiceover(27, '1st (2)') },
      { speaker: 'Alvin', text: "Numbers aren't confusing anymore.", backgroundSrc: chapter6Page27, audioSrc: voiceover(27, '2nd (2)') },
      { speaker: 'Alvin', text: 'They all have a place.', backgroundSrc: chapter6Page27, audioSrc: voiceover(27, '3rd (2)') },
      { speaker: 'System', text: 'Counting Numbers help us count things one by one, such as people, books, cars, and students in a classroom.', backgroundSrc: chapter6Page28, audioSrc: voiceover(28, '1st') },
      { speaker: 'Alvin', text: 'Counting numbers is useful in our everyday lives. It helps us understand how many things there are, one at a time.', backgroundSrc: chapter6Page28, audioSrc: voiceover(28, '2nd') },
      { speaker: 'Alvin', text: 'Whole Numbers are used when counting quantities that may include zero.', backgroundSrc: chapter6Page29, audioSrc: voiceover(29, '1st (4)') },
      { speaker: 'Alvin', text: 'Such as the number of visitors in a library, books borrowed, or goals scored in a match.', backgroundSrc: chapter6Page29, audioSrc: voiceover(29, '2nd (4)') },
      { speaker: 'Alvin', text: 'Whole Numbers help us keep track of quantities in our daily lives, starting from zero.', backgroundSrc: chapter6Page29, audioSrc: voiceover(29, '3rd') },
      { speaker: 'Alvin', text: 'Integers help us represent values above and below zero, such as temperature degrees, elevator floors, and gains or losses in a game.', backgroundSrc: chapter6Page30, audioSrc: voiceover(30, 'A') },
      { speaker: 'Alvin', text: 'Integers help us describe real-life situations that have values above, below, or equal to zero.', backgroundSrc: chapter6Page30, audioSrc: voiceover(30, '3rd') },
      { speaker: 'Alvin', text: 'Rational Numbers help us measure and share things fairly, such as fractions of a pizza, ingredients in a recipe, or money and distances with decimals.', backgroundSrc: chapter6Page31, audioSrc: voiceover(31, 'A') },
      { speaker: 'Alvin', text: 'Rational Numbers help us measure, share, and compare things in our daily lives.', backgroundSrc: chapter6Page31, audioSrc: voiceover(31, 'B') },
      { speaker: 'Alvin', text: 'Irrational Numbers help us measure circles and distances, such as finding the circumference of a wheel using π or the diagonal of a square using √2.', backgroundSrc: chapter6Page32, audioSrc: voiceover(32, 'A') },
      { speaker: 'Alvin', text: 'Irrational Numbers are used for measurements that involve perfect circles and exact distances that cannot be written as fractions or repeating decimals.', backgroundSrc: chapter6Page32, audioSrc: voiceover(32, 'B') },
      { speaker: 'Alvin', text: 'When everything has a place, everything makes sense.', backgroundSrc: chapter6Page33, audioSrc: voiceover(33, '1st (8)') },
      { speaker: 'Alvin', text: 'Yes, the adventure was over...', backgroundSrc: chapter6Page33, audioSrc: voiceover(33, '2nd (8)') },
      { speaker: 'Alvin', text: 'Yet the lesson would stay with me forever.', backgroundSrc: chapter6Page33, audioSrc: voiceover(33, '3rd (8)') },
      { speaker: 'Alvin', text: 'The End.', backgroundSrc: chapter6Page33, audioSrc: voiceover(33, '4th (5)') },
    ],
    tutorial: {
      title: 'Numbers in Real Life',
      summary:
        'Numberland connects to everyday life. Counting numbers count objects, whole numbers include zero, integers describe opposites around zero, rational numbers help with sharing and measuring, and irrational numbers appear in exact measurements and special constants.',
      points: [
        'Different number sets help describe different real-life situations.',
        'Rational numbers can be written as fractions; irrational numbers cannot.',
        'Real numbers give every value a place on the Number Line.',
      ],
    },
    activities: [],
  },
  {
    id: 'chapter-7',
    number: 7,
    order: 7,
    title: 'Final Assessment',
    assessmentMode: true,
    shortDescription: 'Complete the final exam covering the number system journey.',
    description:
      'Take the final assessment to show what you learned about counting numbers, whole numbers, integers, rational numbers, irrational numbers, and real numbers.',
    duration: '15 minutes',
    activityInsertBeforePage: 2,
    scene: {
      location: 'Final Assessment Hall',
      mood: 'Focused, reflective, and challenging',
      gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #0f172a 100%)',
      image: chapter6Page33,
      coverImage: landingHeroPhoto,
      mascotName: 'System',
      mascotRole: 'Assessment Guide',
    },
    story: {
      title: 'The final exam begins',
      background:
        'After gathering every lesson from Numberland, Alvin reaches the final hall where one last assessment waits.',
      narration:
        'The journey had led me through every part of Numberland. One final challenge remained: a last assessment to prove that I truly understood where numbers belong.',
    },
    dialogues: [
      {
        speaker: 'System',
        text: 'Final Assessment unlocked. Review everything you learned and answer carefully.',
        backgroundSrc: chapter6Page33,
      },
      {
        speaker: 'Alvin',
        text: 'I took a deep breath. This final exam would decide how well I understood the whole journey.',
        backgroundSrc: chapter6Page33,
      },
    ],
    tutorial: {
      title: 'Final Assessment',
      summary:
        'This final assessment covers the key ideas from the full Numberland journey: counting numbers, whole numbers, integers, rational numbers, irrational numbers, and real numbers.',
      points: [
        'Read each question carefully before answering.',
        'Use everything you learned from the previous chapters.',
        'Finish the assessment to complete the full journey.',
      ],
    },
    activities: [
      {
        id: 'c7-final-assessment-1',
        type: 'multiple-choice',
        question: 'Which set of numbers includes counting numbers such as 1, 2, 3, 4, and so on?',
        choices: ['Integers', 'Rational Numbers', 'Counting Numbers', 'Irrational Numbers'],
        answer: 'Counting Numbers',
        feedback: 'Correct. Counting numbers begin at 1 and continue upward.',
      },
      {
        id: 'c7-final-assessment-2',
        type: 'multiple-choice',
        question: 'Which of the following is an integer?',
        choices: ['3.5', '-7', '2/3', '√5'],
        answer: '-7',
        feedback: 'Correct. Integers include negative whole numbers, zero, and positive whole numbers.',
      },
      {
        id: 'c7-final-assessment-3',
        type: 'multiple-choice',
        question: 'Which number is a rational number?',
        choices: ['π', '√2', '5/8', '√7'],
        answer: '5/8',
        feedback: 'Correct. Rational numbers can be written as a fraction of two integers.',
      },
      {
        id: 'c7-final-assessment-4',
        type: 'multiple-choice',
        question: 'Which of the following is an irrational number?',
        choices: ['0.25', '-4', '3/5', 'π'],
        answer: 'π',
        feedback: 'Correct. π is irrational because it cannot be written as a fraction of two integers.',
      },
      {
        id: 'c7-final-assessment-5',
        type: 'multiple-choice',
        question: 'Which set of subsets correctly describes the number 0?',
        choices: [
          'Counting Numbers, Whole Numbers, Integers, Rational Numbers',
          'Whole Numbers, Integers, Rational Numbers',
          'Integers, Rational Numbers, Irrational Numbers',
          'Whole Numbers, Irrational Numbers',
        ],
        answer: 'Whole Numbers, Integers, Rational Numbers',
        feedback: 'Correct. Zero is a whole number, an integer, and a rational number.',
      },
      {
        id: 'c7-final-assessment-6',
        type: 'multiple-choice',
        question: 'Which of the following belongs to the set of whole numbers?',
        choices: ['-1', '1/2', '0', '√3'],
        answer: '0',
        feedback: 'Correct. Whole numbers include 0 and the counting numbers.',
      },
      {
        id: 'c7-final-assessment-7',
        type: 'multiple-choice',
        question: 'The number -12 is classified as:',
        choices: ['Counting Number', 'Whole Number', 'Integer', 'Irrational Number'],
        answer: 'Integer',
        feedback: 'Correct. -12 is an integer because it is a negative whole number.',
      },
      {
        id: 'c7-final-assessment-8',
        type: 'multiple-choice',
        question: 'Which number can be written as a fraction of two integers?',
        choices: ['√11', 'π', '0.75', '√13'],
        answer: '0.75',
        feedback: 'Correct. 0.75 is rational because it can be written as 3/4.',
      },
      {
        id: 'c7-final-assessment-9',
        type: 'multiple-choice',
        question: 'Which set contains all rational and irrational numbers?',
        choices: ['Counting Numbers', 'Integers', 'Whole Numbers', 'Real Numbers'],
        answer: 'Real Numbers',
        feedback: 'Correct. Real numbers include both rational and irrational numbers.',
      },
      {
        id: 'c7-final-assessment-10',
        type: 'multiple-choice',
        question: 'Which of the following is NOT a rational number?',
        choices: ['2.5', '-3', '7/4', '√10'],
        answer: '√10',
        feedback: 'Correct. √10 is irrational.',
      },
      {
        id: 'c7-final-assessment-11',
        type: 'multiple-choice',
        question: 'What type of number is 15?',
        choices: ['Counting Number', 'Irrational Number', 'Rational Number', 'Both A and C'],
        answer: 'Both A and C',
        feedback: 'Correct. 15 is a counting number and also a rational number.',
      },
      {
        id: 'c7-final-assessment-12',
        type: 'multiple-choice',
        question: 'Which of the following is a terminating decimal?',
        choices: ['0.125', 'π', '√2', '√5'],
        answer: '0.125',
        feedback: 'Correct. 0.125 ends, so it is a terminating decimal.',
      },
      {
        id: 'c7-final-assessment-13',
        type: 'multiple-choice',
        question: 'Which number belongs to both the set of integers and rational numbers?',
        choices: ['-8', '√6', 'π', '√15'],
        answer: '-8',
        feedback: 'Correct. Every integer is also a rational number.',
      },
      {
        id: 'c7-final-assessment-14',
        type: 'multiple-choice',
        question: 'Which number should be plotted between 2 and 3 on the real number line?',
        choices: ['-2', '4', '√5', '0'],
        answer: '√5',
        feedback: 'Correct. √5 is approximately 2.236, so it lies between 2 and 3.',
      },
      {
        id: 'c7-final-assessment-15',
        type: 'multiple-choice',
        question: 'Which statement is TRUE?',
        choices: [
          'All irrational numbers are rational numbers.',
          'All whole numbers are irrational numbers.',
          'All counting numbers are whole numbers.',
          'All integers are irrational numbers.',
        ],
        answer: 'All counting numbers are whole numbers.',
        feedback: 'Correct. Counting numbers are a subset of whole numbers.',
      },
    ],
  },
]
