export const chapters = [
  {
    id: 'chapter-1',
    title: 'Chapter 1: The Beginning',
    description: 'Start the story and learn the first lesson.',
    passingScore: 3,
    story: {
      narration:
        'Once upon a time, a young learner discovered a mysterious book that opened a path to knowledge.',
      audioSrc: '/audio/chapter1.mp3',
    },
    dialogues: [
      {
        speaker: 'Guide',
        text: 'Welcome, learner. Today, your journey begins.',
      },
      {
        speaker: 'Student Hero',
        text: 'I am ready to learn and complete the challenge!',
      },
      {
        speaker: 'Guide',
        text: 'Read carefully. The activity later will test your understanding.',
      },
    ],
    tutorial: {
      title: 'Lesson Explanation',
      content:
        'This section explains the main lesson from the story. Students should understand the characters, events, and lesson before answering the activity.',
    },
    activities: [
      {
        id: 'q1',
        question: 'Who welcomed the learner?',
        choices: ['The Guide', 'The Dragon', 'The King', 'The Villager'],
        answer: 'The Guide',
        feedback: 'Correct. The Guide welcomed the learner at the start.',
      },
      {
        id: 'q2',
        question: 'What did the learner discover?',
        choices: ['A sword', 'A mysterious book', 'A map', 'A door'],
        answer: 'A mysterious book',
        feedback: 'Correct. The mysterious book opened the learning journey.',
      },
      {
        id: 'q3',
        question: 'What should students do before the activity?',
        choices: ['Skip the story', 'Read carefully', 'Close the website', 'Guess only'],
        answer: 'Read carefully',
        feedback: 'Correct. Students should read carefully before answering.',
      },
      {
        id: 'q4',
        question: 'What is the purpose of the activity?',
        choices: [
          'To test understanding',
          'To decorate the page',
          'To play music only',
          'To skip the lesson',
        ],
        answer: 'To test understanding',
        feedback: 'Correct. The activity checks student understanding.',
      },
    ],
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: The Challenge',
    description: 'Continue the story and answer a new activity.',
    passingScore: 3,
    story: {
      narration:
        'The learner continued the journey and faced a challenge that required focus and understanding.',
      audioSrc: '/audio/chapter2.mp3',
    },
    dialogues: [
      {
        speaker: 'Guide',
        text: 'You have reached the next part of the story.',
      },
      {
        speaker: 'Student Hero',
        text: 'I will listen, read, and understand the lesson.',
      },
    ],
    tutorial: {
      title: 'Lesson Explanation',
      content:
        'This chapter teaches students to analyze the story events and connect them to the lesson.',
    },
    activities: [
      {
        id: 'q1',
        question: 'What did the learner face?',
        choices: ['A challenge', 'A party', 'A race', 'A storm'],
        answer: 'A challenge',
        feedback: 'Correct. The learner faced a challenge.',
      },
      {
        id: 'q2',
        question: 'What skill is needed in this chapter?',
        choices: ['Focus', 'Running', 'Singing', 'Drawing'],
        answer: 'Focus',
        feedback: 'Correct. The learner needed focus.',
      },
      {
        id: 'q3',
        question: 'What should students connect to the lesson?',
        choices: ['Story events', 'Random words', 'Only pictures', 'Page numbers'],
        answer: 'Story events',
        feedback: 'Correct. Students analyze story events.',
      },
    ],
  },
]