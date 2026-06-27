export const matchPairsTemplate = {
  id: 'chapter-x-match-1',
  type: 'match-pairs',
  instruction: 'Match each number group to the correct example.',
  leftItems: [
    { id: 'whole-number', label: 'Whole Number' },
    { id: 'integer', label: 'Integer' },
    { id: 'fraction', label: 'Fraction' },
  ],
  rightItems: [
    { id: 'right-zero', label: '0' },
    { id: 'right-negative-three', label: '-3' },
    { id: 'right-three-fourths', label: '3/4' },
  ],
  answer: {
    'whole-number': 'right-zero',
    integer: 'right-negative-three',
    fraction: 'right-three-fourths',
  },
  feedback: 'Correct. Each number group is matched to the right example.',
}
