import chapter1Page6 from '../assets/chapters/chapter 1/page 6.png'
import chapter1Page7 from '../assets/chapters/chapter 1/page 7.png'
import chapter1Page8 from '../assets/chapters/chapter 1/page 8.png'
import chapter2Page9 from '../assets/chapters/chapter 2/page 9.png'
import chapter2Page10 from '../assets/chapters/chapter 2/page 10.png'
import chapter2Page11 from '../assets/chapters/chapter 2/page 11.png'
import chapter2Page12 from '../assets/chapters/chapter 2/page 12.png'
import chapter3Page13 from '../assets/chapters/chapter 3/page 13.png'
import chapter3Page14 from '../assets/chapters/chapter 3/page 14.png'
import chapter3Page15 from '../assets/chapters/chapter 3/page 15.png'
import chapter4Page16 from '../assets/storybookcontent_complete/Story Book Content/page 16.png'
import chapter4Page17 from '../assets/storybookcontent_complete/Story Book Content/page 17.png'
import chapter4Page18 from '../assets/storybookcontent_complete/Story Book Content/page 18.png'
import chapter4Page19 from '../assets/storybookcontent_complete/Story Book Content/page 19.png'
import chapter4Page20 from '../assets/storybookcontent_complete/Story Book Content/page 20.png'
import chapter5Page21 from '../assets/storybookcontent_complete/Story Book Content/page 21.png'
import chapter5Page22 from '../assets/storybookcontent_complete/Story Book Content/page 22.jpg'
import chapter5Page23 from '../assets/storybookcontent_complete/Story Book Content/page 23.png'
import chapter5Page24 from '../assets/storybookcontent_complete/Story Book Content/page 24.png'
import chapter5Page25 from '../assets/storybookcontent_complete/Story Book Content/page 25.png'
import chapter5Page26 from '../assets/storybookcontent_complete/Story Book Content/page 26.png'

export const chapters = [
  {
    id: 'chapter-1',
    number: 1,
    order: 1,
    title: 'The Counting Forest',
    shortDescription: 'Alvin restores the forest altar by choosing only counting numbers.',
    description:
      'Enter the Counting Forest and learn how counting numbers begin at 1 and grow one by one.',
    duration: '8 minutes',
    scene: {
      location: 'Counting Forest',
      mood: 'Quiet, magical, and focused',
      gradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 48%, #bef264 100%)',
      image: chapter1Page6,
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
      { speaker: 'Alvin', text: 'I landed in a quiet forest. At its center stood a broken stone altar with dark, empty slots.', backgroundSrc: chapter1Page6 },
      { speaker: 'Alvin', text: 'Scattered around it were glowing numbers.', backgroundSrc: chapter1Page6 },
      { speaker: 'System', text: 'Counting Numbers detected: Positive whole numbers only.', backgroundSrc: chapter1Page6 },
      { speaker: 'System', text: 'Forest altar requires counting numbers to activate.', backgroundSrc: chapter1Page6 },
      { speaker: 'Alvin', text: 'I realized the problem immediately.', backgroundSrc: chapter1Page7 },
      { speaker: 'Alvin', text: 'Counting numbers start at 1 and go up. No zero. No negatives. No fractions.', backgroundSrc: chapter1Page7 },
      { speaker: 'Alvin', text: 'I placed 1, 2, 3, 4, and 5 into the altar.', backgroundSrc: chapter1Page7 },
      { speaker: 'System', text: 'Select and place only counting numbers.', backgroundSrc: chapter1Page7 },
      { speaker: 'Alvin', text: 'After completing the task, a light flowed through the forest.', backgroundSrc: chapter1Page8 },
      { speaker: 'Alvin', text: 'A green gem rose from the altar and floated into my hand.', backgroundSrc: chapter1Page8 },
      { speaker: 'System', text: 'Sacred Gem Acquired: N.', backgroundSrc: chapter1Page8 },
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
        id: 'c1-q1',
        question: 'Which of the following is a counting number?',
        choices: ['3', '0', '-2', '1/2'],
        answer: '3',
        feedback: 'Correct. 3 is a positive whole number used for counting.',
      },
      {
        id: 'c1-q2',
        question: 'Which number is not a counting number?',
        choices: ['0', '1', '2', '5'],
        answer: '0',
        feedback: 'Correct. In this lesson, counting numbers start at 1, so 0 is not included.',
      },
      {
        id: 'c1-q3',
        question: 'Which set contains only counting numbers?',
        choices: ['1, 2, 3, 4', '0, 1, 2, 3', '-1, 1, 2, 3', '1/2, 1, 2, 3'],
        answer: '1, 2, 3, 4',
        feedback: 'Correct. All numbers in this set are counting numbers.',
      },
      {
        id: 'c1-q4',
        question: 'Counting numbers are also called what?',
        choices: ['Natural numbers', 'Irrational numbers', 'Negative numbers', 'Decimal numbers'],
        answer: 'Natural numbers',
        feedback: 'Correct. Counting numbers are also commonly called natural numbers.',
      },
      {
        id: 'c1-q5',
        question: 'Which number should Alvin avoid in the Counting Forest?',
        choices: ['-1', '1', '2', '5'],
        answer: '-1',
        feedback: 'Correct. Negative numbers are not counting numbers.',
      },
      {
        id: 'c1-drag-1',
        type: 'drag-group',
        instruction: 'Drag the counting numbers into the magic altar.',
        items: ['1', '0', '3', '-2', '5', '2.5'],
        answer: ['1', '3', '5'],
        dropLabel: 'Counting Numbers',
        feedback: 'Correct. Counting numbers start at 1 and continue upward without decimals or negatives.',
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
    duration: '9 minutes',
    scene: {
      location: 'Whole Number Gate',
      mood: 'Steady, bright, and guarded',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 45%, #a3e635 100%)',
      image: chapter2Page9,
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
      { speaker: 'Alvin', text: 'I followed the glowing path out of the forest.', backgroundSrc: chapter2Page9 },
      { speaker: 'Alvin', text: 'At its edge stood a massive gate shaped like 0.', backgroundSrc: chapter2Page9 },
      { speaker: 'Alvin', text: 'In front of it stood Zero itself, silently guarding the entrance.', backgroundSrc: chapter2Page9 },
      { speaker: 'Alvin', text: 'Three glowing sets appeared in the air.', backgroundSrc: chapter2Page9 },
      { speaker: 'System', text: 'Whole Numbers = Counting Numbers + 0.', backgroundSrc: chapter2Page10 },
      { speaker: 'System', text: 'Identify the set of whole numbers.', backgroundSrc: chapter2Page10 },
      { speaker: 'Alvin', text: 'I examined them carefully.', backgroundSrc: chapter2Page11 },
      { speaker: 'Alvin', text: 'Set A had negatives. Set B had fractions and decimals. Set C had only whole numbers.', backgroundSrc: chapter2Page11 },
      { speaker: 'Alvin', text: 'I selected Set C.', backgroundSrc: chapter2Page11 },
      { speaker: 'System', text: 'Whole Number Gate Trial complete.', backgroundSrc: chapter2Page11 },
      { speaker: 'Alvin', text: 'The zero-shaped gate glowed brightly and slowly opened.', backgroundSrc: chapter2Page12 },
      { speaker: 'Alvin', text: 'A blue gem floated into my hands.', backgroundSrc: chapter2Page12 },
      { speaker: 'System', text: 'Sacred Gem Acquired: W.', backgroundSrc: chapter2Page12 },
      { speaker: 'System', text: 'Map Update: The Portal Gate unlocks.', backgroundSrc: chapter2Page12 },
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
        id: 'c2-q1',
        question: 'Which number is included in whole numbers but not in counting numbers?',
        choices: ['0', '-1', '1/2', '0.75'],
        answer: '0',
        feedback: 'Correct. Whole numbers include zero, while counting numbers usually start at 1.',
      },
      {
        id: 'c2-q2',
        question: 'Which set contains only whole numbers?',
        choices: ['0, 4, 6, 9', '-3, 6, 9, 0', '0.75, 4, 3', '1/2, 0, 4'],
        answer: '0, 4, 6, 9',
        feedback: 'Correct. This set contains only zero and positive whole numbers.',
      },
      {
        id: 'c2-q3',
        question: 'Which of the following is not a whole number?',
        choices: ['0.75', '0', '4', '9'],
        answer: '0.75',
        feedback: 'Correct. 0.75 is a decimal, not a whole number.',
      },
      {
        id: 'c2-q4',
        question: 'Whole numbers include which group?',
        choices: ['Zero and counting numbers', 'Only negative numbers', 'Only fractions', 'Only decimals'],
        answer: 'Zero and counting numbers',
        feedback: 'Correct. Whole numbers are 0, 1, 2, 3, and so on.',
      },
      {
        id: 'c2-q5',
        question: 'What shape was the gate in the story?',
        choices: ['Zero', 'Triangle', 'Star', 'Square'],
        answer: 'Zero',
        feedback: 'Correct. The gate was shaped like 0.',
      },
      {
        id: 'c2-match-1',
        type: 'match-pairs',
        instruction: 'Match each whole-number idea to the correct example.',
        leftItems: [
          { id: 'whole', label: 'Whole Number' },
          { id: 'counting', label: 'Counting Number' },
          { id: 'not-whole', label: 'Not a Whole Number' },
        ],
        rightItems: [
          { id: 'right-0', label: '0' },
          { id: 'right-5', label: '5' },
          { id: 'right-0-75', label: '0.75' },
        ],
        answer: {
          whole: 'right-0',
          counting: 'right-5',
          'not-whole': 'right-0-75',
        },
        feedback: 'Correct. Zero is a whole number, 5 is a counting number, and 0.75 is not a whole number.',
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
    duration: '10 minutes',
    scene: {
      location: 'Town of Integers',
      mood: 'Busy, divided, and orderly',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #64748b 48%, #16a34a 100%)',
      image: chapter3Page13,
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
      { speaker: 'Alvin', text: 'As I stepped through the portal, I found myself in a circular town.', backgroundSrc: chapter3Page13 },
      { speaker: 'System', text: 'Welcome to the Town of Integers.', backgroundSrc: chapter3Page13 },
      { speaker: 'System', text: 'The left side is the Negative District.', backgroundSrc: chapter3Page13 },
      { speaker: 'System', text: 'The right side is the Positive District.', backgroundSrc: chapter3Page13 },
      { speaker: 'System', text: 'At the center stands the Zero Portal, connected to the Counting Forest.', backgroundSrc: chapter3Page13 },
      { speaker: 'Alvin', text: 'After a few moments, fractions and decimals had entered the town, causing chaos.', backgroundSrc: chapter3Page14 },
      { speaker: 'Alvin', text: 'Numbers wandered along the roads, confused and misplaced.', backgroundSrc: chapter3Page14 },
      { speaker: 'System', text: 'Integers consist of negative numbers, zero, and positive numbers.', backgroundSrc: chapter3Page14 },
      { speaker: 'System', text: 'Arrange the numbers based on their correct placement in the town, and remove all non-integer numbers to solve the chaos.', backgroundSrc: chapter3Page14 },
      { speaker: 'Alvin', text: 'I fixed the town step by step.', backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'I placed 0 at the center. I guided positive numbers to the right and negative numbers to the left.', backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'I removed the fractions and decimals from the town.', backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'The paths aligned. The town became calm.', backgroundSrc: chapter3Page15 },
      { speaker: 'Alvin', text: 'A red gem descended into my hands.', backgroundSrc: chapter3Page15 },
      { speaker: 'System', text: 'Sacred Gem Acquired: Z.', backgroundSrc: chapter3Page15 },
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
        id: 'c3-q1',
        question: 'Which set contains only integers?',
        choices: ['-3, -2, -1, 0, 1', '0.5, 1, 2, 3', '1/2, 0, 4', '0.75, -4, 3'],
        answer: '-3, -2, -1, 0, 1',
        feedback: 'Correct. Integers include negative whole numbers, zero, and positive whole numbers.',
      },
      {
        id: 'c3-q2',
        question: 'Where are negative numbers usually placed on the number line?',
        choices: ['Left of zero', 'Right of zero', 'Above zero', 'They are not placed on the number line'],
        answer: 'Left of zero',
        feedback: 'Correct. Negative numbers are placed to the left of zero.',
      },
      {
        id: 'c3-q3',
        question: 'Where are positive numbers usually placed on the number line?',
        choices: ['Right of zero', 'Left of zero', 'Below zero', 'Outside the number line'],
        answer: 'Right of zero',
        feedback: 'Correct. Positive numbers are placed to the right of zero.',
      },
      {
        id: 'c3-q4',
        question: 'Which number is an integer?',
        choices: ['-5', '0.25', '1/3', '2.6'],
        answer: '-5',
        feedback: 'Correct. -5 is a negative whole number, so it is an integer.',
      },
      {
        id: 'c3-q5',
        question: 'Which of the following is not an integer?',
        choices: ['1/2', '-2', '0', '7'],
        answer: '1/2',
        feedback: 'Correct. Fractions are not integers.',
      },
      {
        id: 'c3-drag-1',
        type: 'drag-group',
        instruction: 'Drag only the integers into the town gate.',
        items: ['-3', '0', '4', '1/2', '2.5', '-1'],
        answer: ['-3', '0', '4', '-1'],
        dropLabel: 'Integers',
        feedback: 'Correct. Integers include negatives, zero, and positive whole numbers only.',
      },
    ],
  },
  {
    id: 'chapter-4',
    number: 4,
    order: 4,
    title: "The Rational and Irrational Countries",
    shortDescription: 'Alvin learns which numbers belong to the Rational Country and which belong beyond the bridge.',
    description:
      'Travel beyond the Town of Integers to classify rational and irrational numbers.',
    duration: '12 minutes',
    scene: {
      location: 'Rational and Irrational Border',
      mood: 'Expansive, mysterious, and alert',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #db2777 35%, #4f46e5 70%, #0f172a 100%)',
      image: chapter4Page16,
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
      { speaker: 'Alvin', text: 'As I walked beyond the Town of Integers, the land slowly changed.', backgroundSrc: chapter4Page16 },
      { speaker: 'Alvin', text: 'The buildings of whole numbers faded, and I found myself standing at the edge of a wide circular zone filled with a new set of numbers.', backgroundSrc: chapter4Page16 },
      { speaker: 'System', text: 'Current Location: Fraction District.', backgroundSrc: chapter4Page16 },
      { speaker: 'System', text: 'Surrounding Zones Detected: Decimal District and Percentage District.', backgroundSrc: chapter4Page16 },
      { speaker: 'System', text: 'The three districts circle the Town of Integers. They contain numbers that are not whole but still belong to the Rational Country.', backgroundSrc: chapter4Page17 },
      { speaker: 'System', text: 'Decimal District: numbers written in decimal form, including terminating and repeating decimals.', backgroundSrc: chapter4Page17 },
      { speaker: 'System', text: 'Fraction District: numbers written as fractions, like 3/4, 1/4, and 8/9.', backgroundSrc: chapter4Page17 },
      { speaker: 'System', text: 'Percent District: numbers written as percentages, like 60%, 75%, and 16.66%.', backgroundSrc: chapter4Page17 },
      { speaker: 'System', text: 'Rational Country is composed of any number that can be written as a fraction in the form a/b, where a and b are integers and b is not equal to 0.', backgroundSrc: chapter4Page17 },
      { speaker: 'System', text: 'If the decimal stops or repeats, it is rational.', backgroundSrc: chapter4Page17 },
      { speaker: 'Alvin', text: 'I walked around the district and saw a bridge going to an unknown island.', backgroundSrc: chapter4Page18 },
      { speaker: 'System', text: 'Beyond the bridge is the Irrational Country.', backgroundSrc: chapter4Page18 },
      { speaker: 'System', text: 'Irrational Country is composed of numbers that cannot be written in fraction form. These include non-repeating and non-terminating decimals.', backgroundSrc: chapter4Page19 },
      { speaker: 'System', text: 'Examples include π = 3.1415926..., e = 2.7182818284..., and √2 = 1.4142...', backgroundSrc: chapter4Page19 },
      { speaker: 'System', text: 'If the decimal never stops and never repeats, it is irrational.', backgroundSrc: chapter4Page19 },
      { speaker: 'Alvin', text: 'As I looked at the bridge, I noticed numbers running toward my direction.', backgroundSrc: chapter4Page20 },
      { speaker: 'System', text: 'Some numbers have attempted to enter the Rational Country. Do not allow irrational numbers to pass through.', backgroundSrc: chapter4Page20 },
      { speaker: 'System', text: 'Boundary instability detected. Rational numbers can be written as fractions of integers. Irrational numbers cannot be written as fractions.', backgroundSrc: chapter4Page20 },
      { speaker: 'System', text: 'Border Verification: Verify these intruders: 1.6666..., 1, 0.75, √2, 1.674737..., π.', backgroundSrc: chapter4Page20 },
      { speaker: 'Alvin', text: 'I guided 1, 0.75, and 1.6666... inside.', backgroundSrc: chapter4Page20 },
      { speaker: 'Alvin', text: 'I led √2, 1.674737..., and π to the Irrational Country.', backgroundSrc: chapter4Page20 },
      { speaker: 'System', text: 'Boundary secured.', backgroundSrc: chapter4Page20 },
      { speaker: 'System', text: "Sacred Gems Acquired: Q and Q'.", backgroundSrc: chapter4Page20 },
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
        id: 'c4-q1',
        question: 'Which of the following is a rational number?',
        choices: ['0.75', 'π', '√2', '1.674737...'],
        answer: '0.75',
        feedback: 'Correct. 0.75 is a terminating decimal, so it is rational.',
      },
      {
        id: 'c4-q2',
        question: 'Which of the following is irrational?',
        choices: ['√2', '3/4', '25%', '1.6666...'],
        answer: '√2',
        feedback: 'Correct. √2 cannot be written as a simple fraction and has a non-repeating decimal form.',
      },
      {
        id: 'c4-q3',
        question: 'What is true about rational numbers?',
        choices: ['They can be written as fractions of integers', 'They are always negative', 'They never repeat', 'They cannot include decimals'],
        answer: 'They can be written as fractions of integers',
        feedback: 'Correct. Rational numbers can be expressed as a fraction a/b.',
      },
      {
        id: 'c4-q4',
        question: 'Which decimal is irrational?',
        choices: ['1.674737...', '1.6666...', '0.5', '2.75'],
        answer: '1.674737...',
        feedback: 'Correct. It is treated here as non-terminating and non-repeating, so it is irrational.',
      },
      {
        id: 'c4-q5',
        question: 'Which set should be allowed into the Rational Country?',
        choices: ['1, 0.75, 1.6666...', 'π, √2, 1.674737...', 'π, 1, √2', '√2, 0.75, π'],
        answer: '1, 0.75, 1.6666...',
        feedback: 'Correct. Those numbers are rational because they are integers or terminating/repeating decimals.',
      },
      {
        id: 'c4-match-1',
        type: 'match-pairs',
        instruction: 'Match each number to the country where it belongs.',
        leftItems: [
          { id: 'num-075', label: '0.75' },
          { id: 'num-pi', label: 'π' },
          { id: 'num-root2', label: '√2' },
        ],
        rightItems: [
          { id: 'country-rational', label: 'Rational Country' },
          { id: 'country-irrational-a', label: 'Irrational Country' },
          { id: 'country-irrational-b', label: 'Irrational Country' },
        ],
        answer: {
          'num-075': 'country-rational',
          'num-pi': 'country-irrational-a',
          'num-root2': 'country-irrational-b',
        },
        feedback: 'Correct. 0.75 is rational, while π and √2 are irrational.',
      },
    ],
  },
  {
    id: 'chapter-5',
    number: 5,
    order: 5,
    title: 'The Real Number Line',
    shortDescription: 'Alvin restores the cracked Number Line and reaches the ending of the journey.',
    description:
      'Bring all the number groups together on the Real Number Line, then prepare for the final assessment placeholder.',
    duration: '10 minutes',
    scene: {
      location: 'Real Number Line',
      mood: 'Grand, reflective, and complete',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 22%, #22c55e 48%, #3b82f6 72%, #8b5cf6 100%)',
      image: chapter5Page21,
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
      { speaker: 'Alvin', text: 'The rainbow Number Line appeared again.', backgroundSrc: chapter5Page21 },
      { speaker: 'Alvin', text: 'I followed the path it made.', backgroundSrc: chapter5Page21 },
      { speaker: 'System', text: 'The Number Line connects all real numbers.', backgroundSrc: chapter5Page21 },
      { speaker: 'System', text: 'Left: Decreasing. Right: Increasing.', backgroundSrc: chapter5Page21 },
      { speaker: 'Alvin', text: 'Without warning, the ground shook.', backgroundSrc: chapter5Page22 },
      { speaker: 'Alvin', text: 'The Number Line cracked.', backgroundSrc: chapter5Page22 },
      { speaker: 'System', text: 'Kingdom instability detected.', backgroundSrc: chapter5Page22 },
      { speaker: 'System', text: 'Restore balance to the kingdom by arranging the numbers from least to greatest on the Number Line.', backgroundSrc: chapter5Page22 },
      { speaker: 'Alvin', text: 'The numbers floated chaotically: -4, -1, 0, 2, 3.5, 1/2, and √2.', backgroundSrc: chapter5Page22 },
      { speaker: 'Alvin', text: 'I placed the numbers correctly: -4, -1, 0, 1/2, √2, 2, 3.5.', backgroundSrc: chapter5Page23 },
      { speaker: 'System', text: 'Sequence verified.', backgroundSrc: chapter5Page23 },
      { speaker: 'System', text: 'Sacred Gem Acquired: R (Real Numbers).', backgroundSrc: chapter5Page24 },
      { speaker: 'Alvin', text: 'After completing all the tasks, a bright light surrounded me.', backgroundSrc: chapter5Page24 },
      { speaker: 'Alvin', text: 'When I opened my eyes, I was back in the classroom.', backgroundSrc: chapter5Page24 },
      { speaker: 'Alvin', text: 'The book lay closed on my desk. In my hand was a final gem.', backgroundSrc: chapter5Page24 },
      { speaker: 'Alvin', text: "Now I understand. Numbers aren't confusing anymore. They all have a place.", backgroundSrc: chapter5Page25 },
      { speaker: 'System', text: 'When everything has a place, everything makes sense.', backgroundSrc: chapter5Page26 },
      { speaker: 'System', text: 'Yes, the adventure was over, yet the lesson would stay with me forever.', backgroundSrc: chapter5Page26 },
      { speaker: 'System', text: 'The End.', backgroundSrc: chapter5Page26 },
    ],
    tutorial: {
      title: 'Real Numbers Summary',
      summary:
        'Real numbers include all the number groups Alvin encountered: counting numbers, whole numbers, integers, rational numbers, and irrational numbers. On the Real Number Line, every real number has a place. This final chapter also serves as the placeholder location for the future final assessment.',
      points: [
        'Real numbers include rational and irrational numbers.',
        'Every real number can be placed somewhere on the Number Line.',
        'This chapter is the summary checkpoint before the future final assessment.',
      ],
    },
    activities: [
      {
        id: 'c5-placeholder-1',
        question: 'Final assessment placeholder: which option confirms this chapter is reserved for the future final exam?',
        choices: ['This is the final assessment placeholder', 'This chapter should be deleted', 'Only integers matter here', 'The final exam is already complete'],
        answer: 'This is the final assessment placeholder',
        feedback: 'Correct. This activity is only a temporary placeholder until the real final assessment is added.',
      },
    ],
  },
]
