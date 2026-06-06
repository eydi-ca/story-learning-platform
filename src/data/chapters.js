export const chapters = [
  {
    id: 'chapter-1',
    number: 1,
    order: 1,
    title: 'The Glowing Book',
    shortDescription: 'Alvin discovers a mysterious book that opens the path to Numberland.',
    description:
      'Begin the journey with Alvin as he discovers the magical book that brings him into a world of numbers.',
    duration: '8 minutes',
    scene: {
      location: 'Classroom Shelves',
      mood: 'Mysterious and bright',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #7c3aed 48%, #22c55e 100%)',
      mascotName: 'Alvin',
      mascotRole: 'Student Explorer',
    },
    story: {
      title: 'The book begins to glow',
      background:
        'Alvin is a student who says people think he is good at math, but he does not fully understand where numbers belong. One afternoon, while cleaning the classroom shelves, he finds an old dusty book hidden behind some papers. The book is titled Journey Across Numberland. As he opens it, the pages glow and numbers begin to float around him.',
      narration:
        'Hi, my name is Alvin. People at school always say I am good at math, not because I memorize answers, but because I try to understand where numbers belong. One afternoon, while cleaning the classroom shelves, I found an old book. When I opened it, the pages began to glow, and I felt myself being pulled into the world inside the book.',
    },
    dialogues: [
      { speaker: 'Alvin', text: 'What is this book? It feels different from the others.' },
      { speaker: 'System', text: 'Reader detected. Compatibility: 100%.' },
      { speaker: 'Alvin', text: 'Wait, why are the pages glowing?' },
      { speaker: 'System', text: 'Initializing learning scenario. World loaded: Numberland.' },
      { speaker: 'System', text: 'Objective: Understand the subsets of real numbers.' },
    ],
    tutorial: {
      title: 'Introduction to Numberland',
      summary:
        'Numberland is a magical world where different kinds of numbers live in different regions. In this journey, Alvin will learn how numbers are grouped and how they relate to one another. The Number Line will serve as the rainbow bridge that connects these number groups.',
      points: [
        'Numberland groups numbers into regions.',
        'Alvin must understand how different number groups relate.',
        'The Number Line connects the number groups like a rainbow bridge.',
      ],
    },
    activities: [
      {
        id: 'c1-q1',
        question: 'Who is the main character of the story?',
        choices: ['Alvin', 'Leo', 'Marco', 'Noah'],
        answer: 'Alvin',
        feedback: 'Correct. Alvin is the student who discovers the glowing book.',
      },
      {
        id: 'c1-q2',
        question: 'What is the title of the book Alvin found?',
        choices: ['Journey Across Numberland', 'The Magic Forest', 'The Lost Kingdom', 'The Book of Spells'],
        answer: 'Journey Across Numberland',
        feedback: 'Correct. The book is called Journey Across Numberland.',
      },
      {
        id: 'c1-q3',
        question: 'What happened when Alvin opened the book?',
        choices: ['The pages began to glow', 'The book disappeared', 'The classroom became dark', 'The teacher entered the room'],
        answer: 'The pages began to glow',
        feedback: 'Correct. The glowing pages pulled Alvin into Numberland.',
      },
      {
        id: 'c1-q4',
        question: "What is Alvin's main learning objective in Numberland?",
        choices: ['To understand the subsets of real numbers', 'To find hidden treasure', 'To defeat a monster', 'To memorize multiplication only'],
        answer: 'To understand the subsets of real numbers',
        feedback: 'Correct. The story introduces the subsets of real numbers.',
      },
      {
        id: 'c1-q5',
        question: 'What does Numberland represent?',
        choices: ['A world where numbers are grouped and explained', 'A regular classroom', 'A sports field', 'A city without numbers'],
        answer: 'A world where numbers are grouped and explained',
        feedback: 'Correct. Numberland is a story world used to explain different types of numbers.',
      },
    ],
  },
  {
    id: 'chapter-2',
    number: 2,
    order: 2,
    title: 'The Rainbow Number Line',
    shortDescription: 'Alvin sees the Number Line as a glowing rainbow bridge.',
    description: 'Explore the rainbow bridge that divides and connects the regions of Numberland.',
    duration: '9 minutes',
    scene: {
      location: 'Numberland Cliff',
      mood: 'Wide and wondrous',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 22%, #22c55e 48%, #3b82f6 72%, #8b5cf6 100%)',
      mascotName: 'Number Line',
      mascotRole: 'Rainbow Bridge',
    },
    story: {
      title: 'The bridge across Numberland',
      background:
        'Alvin finds himself standing on a cliff overlooking a vast kingdom. Stretching across the land is a glowing rainbow path called the Number Line. It shines like a bridge of light, dividing the land while also connecting every region.',
      narration:
        'I found myself standing on a cliff, looking over a strange and beautiful kingdom. In front of me was a glowing rainbow path. It was the Number Line, shimmering like a bridge of light across Numberland.',
    },
    dialogues: [
      { speaker: 'Alvin', text: 'This place is huge. Is that rainbow path the Number Line?' },
      { speaker: 'System', text: 'Correct. The Number Line is the bridge that connects number regions.' },
      { speaker: 'Alvin', text: 'So every number has a place here?' },
      { speaker: 'System', text: 'Yes. Your task is to understand where each number belongs.' },
      { speaker: 'Alvin', text: 'Then I need to cross the bridge and complete the challenges.' },
    ],
    tutorial: {
      title: 'The Number Line',
      summary:
        'The Number Line is a visual way to arrange numbers. Numbers can be placed from left to right. Smaller numbers are usually on the left, while larger numbers are on the right. In the story, the Number Line appears as a rainbow bridge because it connects the different number groups in Numberland.',
      points: [
        'A number line shows where numbers belong.',
        'Smaller numbers are usually placed on the left.',
        'Larger numbers are usually placed on the right.',
      ],
    },
    activities: [
      {
        id: 'c2-q1',
        question: 'What does the rainbow bridge represent?',
        choices: ['The Number Line', 'A river', 'A mountain', 'A classroom'],
        answer: 'The Number Line',
        feedback: 'Correct. The rainbow bridge represents the Number Line.',
      },
      {
        id: 'c2-q2',
        question: 'What is the purpose of the Number Line?',
        choices: ['To show where numbers belong', 'To hide numbers', 'To erase numbers', 'To replace all numbers'],
        answer: 'To show where numbers belong',
        feedback: 'Correct. The Number Line helps show the position and order of numbers.',
      },
      {
        id: 'c2-q3',
        question: 'On a typical number line, where are smaller numbers usually found?',
        choices: ['On the left', 'On the right', 'At the top', 'Outside the line'],
        answer: 'On the left',
        feedback: 'Correct. Smaller numbers are usually placed on the left side.',
      },
      {
        id: 'c2-q4',
        question: 'On a typical number line, where are larger numbers usually found?',
        choices: ['On the right', 'On the left', 'Below the page', 'Nowhere'],
        answer: 'On the right',
        feedback: 'Correct. Larger numbers are usually placed on the right side.',
      },
      {
        id: 'c2-q5',
        question: 'In the story, what does Alvin need to do in Numberland?',
        choices: ['Complete challenges and understand number groups', 'Go home immediately', 'Ignore the system', 'Destroy the bridge'],
        answer: 'Complete challenges and understand number groups',
        feedback: 'Correct. Alvin must complete challenges to learn about number groups.',
      },
    ],
  },
  {
    id: 'chapter-3',
    number: 3,
    order: 3,
    title: 'The Counting Forest',
    shortDescription: 'Alvin learns about counting numbers in the forest altar challenge.',
    description: 'Enter the Counting Forest and identify the numbers used for counting.',
    duration: '10 minutes',
    scene: {
      location: 'Counting Forest',
      mood: 'Quiet and curious',
      gradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 48%, #bef264 100%)',
      mascotName: 'Alvin',
      mascotRole: 'Counting Challenger',
    },
    story: {
      title: 'The forest altar',
      background:
        'Alvin lands in a quiet forest. At the center is a broken stone altar with glowing slots. Scattered around the forest are different numbers. The system tells Alvin that the Counting Numbers are positive whole numbers used for counting.',
      narration:
        'I landed in a quiet forest. In front of me was a broken stone altar with empty slots. Numbers floated around me. I realized the altar needed only counting numbers to activate.',
    },
    dialogues: [
      { speaker: 'System', text: 'Chapter 1: The Counting Forest.' },
      { speaker: 'System', text: 'Counting Numbers detected. Positive whole numbers only.' },
      { speaker: 'Alvin', text: 'So I should start at 1 and keep counting upward?' },
      { speaker: 'System', text: 'Correct. No zero, no negatives, no fractions, and no decimals.' },
      { speaker: 'Alvin', text: 'Then the correct numbers are 1, 2, 3, 4, and 5.' },
    ],
    tutorial: {
      title: 'Counting Numbers / Natural Numbers',
      summary:
        'Counting numbers, also called natural numbers, are numbers used for counting objects. They start at 1 and continue upward. Examples are 1, 2, 3, 4, 5, and so on. Counting numbers do not include 0, negative numbers, fractions, or decimals.',
      points: [
        'Counting numbers start at 1.',
        'They continue upward as 1, 2, 3, 4, 5, and so on.',
        'They do not include 0, negatives, fractions, or decimals.',
      ],
    },
    activities: [
      {
        id: 'c3-q1',
        question: 'Which of the following is a counting number?',
        choices: ['3', '0', '-2', '1/2'],
        answer: '3',
        feedback: 'Correct. 3 is a positive whole number used for counting.',
      },
      {
        id: 'c3-q2',
        question: 'Which number is not a counting number?',
        choices: ['0', '1', '2', '5'],
        answer: '0',
        feedback: 'Correct. In this lesson, counting numbers start at 1, so 0 is not included.',
      },
      {
        id: 'c3-q3',
        question: 'Which set contains only counting numbers?',
        choices: ['1, 2, 3, 4', '0, 1, 2, 3', '-1, 1, 2, 3', '1/2, 1, 2, 3'],
        answer: '1, 2, 3, 4',
        feedback: 'Correct. All numbers in this set are counting numbers.',
      },
      {
        id: 'c3-q4',
        question: 'Counting numbers are also called what?',
        choices: ['Natural numbers', 'Irrational numbers', 'Negative numbers', 'Decimal numbers'],
        answer: 'Natural numbers',
        feedback: 'Correct. Counting numbers are also commonly called natural numbers.',
      },
      {
        id: 'c3-q5',
        question: 'Which number should Alvin avoid in the Counting Forest?',
        choices: ['-1', '1', '2', '5'],
        answer: '-1',
        feedback: 'Correct. Negative numbers are not counting numbers.',
      },
    ],
  },
  {
    id: 'chapter-4',
    number: 4,
    order: 4,
    title: 'The Whole Number Gate',
    shortDescription: 'Alvin learns that whole numbers include zero and counting numbers.',
    description: 'Open the gate by choosing only whole numbers.',
    duration: '10 minutes',
    scene: {
      location: 'Whole Number Gate',
      mood: 'Balanced and glowing',
      gradient: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 45%, #a3e635 100%)',
      mascotName: 'Zero Gate',
      mascotRole: 'Whole Number Trial',
    },
    story: {
      title: 'The gate shaped like zero',
      background:
        'Alvin follows the glowing path out of the forest and reaches a massive gate shaped like zero. The gate is silent and waits for the correct set of numbers. Alvin examines the choices and realizes that whole numbers include 0 and the counting numbers.',
      narration:
        'After completing the forest challenge, a light flowed through the trees. A green gem floated into my hand. I followed the glowing path until I reached a gate shaped like zero. To open it, I had to choose the set that contained only whole numbers.',
    },
    dialogues: [
      { speaker: 'System', text: 'Chapter 2: The Whole Number Gate.' },
      { speaker: 'Alvin', text: 'This gate is shaped like zero. Maybe zero belongs here.' },
      { speaker: 'System', text: 'Whole numbers include zero and counting numbers.' },
      { speaker: 'Alvin', text: 'Then the correct set should include 0, 1, 2, 3, and so on.' },
      { speaker: 'System', text: 'Whole Number Gate trial complete.' },
    ],
    tutorial: {
      title: 'Whole Numbers',
      summary:
        'Whole numbers are numbers that include 0 and all counting numbers. Examples are 0, 1, 2, 3, 4, 5, and so on. Whole numbers do not include negative numbers, fractions, or decimals.',
      points: [
        'Whole numbers include 0.',
        'Whole numbers include all counting numbers.',
        'They do not include negatives, fractions, or decimals.',
      ],
    },
    activities: [
      {
        id: 'c4-q1',
        question: 'Which number is included in whole numbers but not in counting numbers?',
        choices: ['0', '-1', '1/2', '0.75'],
        answer: '0',
        feedback: 'Correct. Whole numbers include zero, while counting numbers usually start at 1.',
      },
      {
        id: 'c4-q2',
        question: 'Which set contains only whole numbers?',
        choices: ['0, 4, 6, 9', '-3, 6, 9, 0', '0.75, 4, 3', '1/2, 0, 4'],
        answer: '0, 4, 6, 9',
        feedback: 'Correct. This set contains only zero and positive whole numbers.',
      },
      {
        id: 'c4-q3',
        question: 'Which of the following is not a whole number?',
        choices: ['0.75', '0', '4', '9'],
        answer: '0.75',
        feedback: 'Correct. 0.75 is a decimal, not a whole number.',
      },
      {
        id: 'c4-q4',
        question: 'Whole numbers include which group?',
        choices: ['Zero and counting numbers', 'Only negative numbers', 'Only fractions', 'Only decimals'],
        answer: 'Zero and counting numbers',
        feedback: 'Correct. Whole numbers are 0, 1, 2, 3, and so on.',
      },
      {
        id: 'c4-q5',
        question: 'What shape was the Whole Number Gate in the story?',
        choices: ['Zero', 'Triangle', 'Star', 'Square'],
        answer: 'Zero',
        feedback: 'Correct. The gate was shaped like 0.',
      },
    ],
  },
  {
    id: 'chapter-5',
    number: 5,
    order: 5,
    title: 'The Town of Integers',
    shortDescription: 'Alvin discovers positive numbers, negative numbers, and zero.',
    description: 'Visit the Town of Integers and learn how numbers can move left and right from zero.',
    duration: '11 minutes',
    scene: {
      location: 'Town of Integers',
      mood: 'Divided but ordered',
      gradient: 'linear-gradient(135deg, #dc2626 0%, #64748b 48%, #16a34a 100%)',
      mascotName: 'Zero',
      mascotRole: 'Neutral Point',
    },
    story: {
      title: 'Left, right, and zero',
      background:
        'Alvin steps through the portal and reaches the Town of Integers. The town is divided into two sides. On the right are positive numbers glowing green. On the left are negative numbers glowing red. In the center stands zero, acting as the neutral point.',
      narration:
        'I stepped through the portal and found myself in a strange town. The left side was filled with red negative numbers, while the right side glowed with green positive numbers. In the center stood zero, silent and still.',
    },
    dialogues: [
      { speaker: 'System', text: 'Welcome to the Town of Integers.' },
      { speaker: 'System', text: 'The left side is the Negative District. The right side is the Positive District.' },
      {
        speaker: 'Alvin',
        text: 'So negative numbers are on the left, positive numbers are on the right, and zero is in the middle?',
      },
      { speaker: 'System', text: 'Correct. Together, they form the integers.' },
      { speaker: 'Alvin', text: 'Then integers include negative numbers, zero, and positive whole numbers.' },
    ],
    tutorial: {
      title: 'Integers',
      summary:
        'Integers are numbers that include negative whole numbers, zero, and positive whole numbers. Examples are -3, -2, -1, 0, 1, 2, and 3. Integers do not include fractions or decimals.',
      points: [
        'Integers include negative whole numbers.',
        'Integers include zero.',
        'Integers include positive whole numbers, but not fractions or decimals.',
      ],
    },
    activities: [
      {
        id: 'c5-q1',
        question: 'Which set contains only integers?',
        choices: ['-3, -2, -1, 0, 1', '0.5, 1, 2, 3', '1/2, 0, 4', '0.75, -4, 3'],
        answer: '-3, -2, -1, 0, 1',
        feedback: 'Correct. Integers include negative whole numbers, zero, and positive whole numbers.',
      },
      {
        id: 'c5-q2',
        question: 'Where are negative numbers usually placed on the number line?',
        choices: ['Left of zero', 'Right of zero', 'Above zero', 'They are not placed on the number line'],
        answer: 'Left of zero',
        feedback: 'Correct. Negative numbers are placed to the left of zero.',
      },
      {
        id: 'c5-q3',
        question: 'Where are positive numbers usually placed on the number line?',
        choices: ['Right of zero', 'Left of zero', 'Below zero', 'Outside the number line'],
        answer: 'Right of zero',
        feedback: 'Correct. Positive numbers are placed to the right of zero.',
      },
      {
        id: 'c5-q4',
        question: 'Which number is an integer?',
        choices: ['-5', '0.25', '1/3', '2.6'],
        answer: '-5',
        feedback: 'Correct. -5 is a negative whole number, so it is an integer.',
      },
      {
        id: 'c5-q5',
        question: 'Which of the following is not an integer?',
        choices: ['1/2', '-2', '0', '7'],
        answer: '1/2',
        feedback: 'Correct. Fractions are not integers.',
      },
    ],
  },
  {
    id: 'chapter-6',
    number: 6,
    order: 6,
    title: 'Beyond the Bridge',
    shortDescription: 'Alvin learns about decimals, fractions, percents, and irrational numbers.',
    description: 'Explore the regions beyond the bridge and discover numbers that are not always whole.',
    duration: '12 minutes',
    scene: {
      location: 'Districts Beyond the Bridge',
      mood: 'Expansive and reflective',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #db2777 35%, #4f46e5 70%, #0f172a 100%)',
      mascotName: 'Gem Map',
      mascotRole: 'Number Guide',
    },
    story: {
      title: 'Numbers beyond integers',
      background:
        'After receiving another gem, Alvin studies a system note about the three districts around the town. The Decimal District contains numbers with decimal forms. The Fraction District contains numbers written as parts of a whole. The Percent District contains numbers expressed as percentages. Beyond the bridge lies the Irrational Country, where numbers cannot be written as simple fractions and their decimal forms do not repeat or end.',
      narration:
        'I walked around the town and saw a bridge leading to an unknown island. A system note appeared and explained the Decimal District, Fraction District, and Percent District. Beyond the bridge was the Irrational Country, a place for numbers that cannot be written as simple fractions.',
    },
    dialogues: [
      { speaker: 'System', text: 'The three districts around the town contain numbers that are not limited to integers.' },
      { speaker: 'System', text: 'Decimal District: numbers written in decimal form.' },
      { speaker: 'System', text: 'Fraction District: numbers written as parts of a whole.' },
      { speaker: 'System', text: 'Percent District: numbers written as percentages.' },
      { speaker: 'Alvin', text: 'And beyond the bridge is the Irrational Country?' },
      {
        speaker: 'System',
        text: 'Correct. Irrational numbers cannot be written as simple fractions. Their decimals do not end or repeat.',
      },
    ],
    tutorial: {
      title: 'Decimals, Fractions, Percents, and Irrational Numbers',
      summary:
        'Decimals are numbers written with a decimal point, such as 0.6, 0.75, and 4.3777. Fractions are numbers written as one value over another, such as 1/2 and 3/4. Percents are numbers written using the percent symbol, such as 25% and 100%. Irrational numbers cannot be written as simple fractions, and their decimal forms are non-terminating and non-repeating. Examples include pi and the square root of 2.',
      points: [
        'Decimals use a decimal point, such as 0.75.',
        'Fractions show parts of a whole, such as 3/4.',
        'Irrational numbers cannot be written as simple fractions.',
      ],
    },
    activities: [
      {
        id: 'c6-q1',
        question: 'Which of the following is a decimal?',
        choices: ['0.75', '3/4', '25%', 'sqrt(2)'],
        answer: '0.75',
        feedback: 'Correct. 0.75 is written in decimal form.',
      },
      {
        id: 'c6-q2',
        question: 'Which of the following is a fraction?',
        choices: ['3/4', '0.25', '25%', 'pi'],
        answer: '3/4',
        feedback: 'Correct. 3/4 is written as a fraction.',
      },
      {
        id: 'c6-q3',
        question: 'Which of the following is a percent?',
        choices: ['25%', '0.25', '1/4', 'sqrt(2)'],
        answer: '25%',
        feedback: 'Correct. 25% is written as a percent.',
      },
      {
        id: 'c6-q4',
        question: 'Which of the following is an irrational number?',
        choices: ['sqrt(2)', '0.5', '1/2', '25%'],
        answer: 'sqrt(2)',
        feedback: 'Correct. sqrt(2) is irrational because it cannot be written as a simple fraction.',
      },
      {
        id: 'c6-q5',
        question: 'What is true about irrational numbers?',
        choices: ['Their decimals do not terminate or repeat', 'They are always whole numbers', 'They are always negative', 'They are only counting numbers'],
        answer: 'Their decimals do not terminate or repeat',
        feedback: 'Correct. Irrational numbers have decimal forms that do not end and do not repeat.',
      },
    ],
  },
]
