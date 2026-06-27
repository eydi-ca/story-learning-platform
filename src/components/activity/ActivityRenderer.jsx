import DragGroupActivity from './DragGroupActivity'
import DragOrderActivity from './DragOrderActivity'
import MatchPairsActivity from './MatchPairsActivity'
import MultipleChoiceActivity from './MultipleChoiceActivity'

function ActivityRenderer(props) {
  const { question } = props

  if (question.type === 'drag-order') {
    return <DragOrderActivity {...props} />
  }

  if (question.type === 'drag-group') {
    return <DragGroupActivity {...props} />
  }

  if (question.type === 'match-pairs') {
    return <MatchPairsActivity {...props} />
  }

  return <MultipleChoiceActivity {...props} />
}

export default ActivityRenderer
