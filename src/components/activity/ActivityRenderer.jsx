import CountingLockActivity from './CountingLockActivity'
import DragGroupActivity from './DragGroupActivity'
import DragOrderActivity from './DragOrderActivity'
import GatekeeperActivity from './GatekeeperActivity'
import IntegerTrialActivity from './IntegerTrialActivity'
import MemoryMatchActivity from './MemoryMatchActivity'
import MatchPairsActivity from './MatchPairsActivity'
import MultipleChoiceActivity from './MultipleChoiceActivity'
import RealNumberLineActivity from './RealNumberLineActivity'
import TilePuzzleActivity from './TilePuzzleActivity'

function ActivityRenderer(props) {
  const { question } = props

  if (question.type === 'drag-order') {
    return <DragOrderActivity {...props} />
  }

  if (question.type === 'counting-lock') {
    return <CountingLockActivity {...props} />
  }

  if (question.type === 'gatekeeper') {
    return <GatekeeperActivity {...props} />
  }

  if (question.type === 'integer-trial') {
    return <IntegerTrialActivity {...props} />
  }

  if (question.type === 'memory-match') {
    return <MemoryMatchActivity {...props} />
  }

  if (question.type === 'real-number-line') {
    return <RealNumberLineActivity {...props} />
  }

  if (question.type === 'drag-group') {
    return <DragGroupActivity {...props} />
  }

  if (question.type === 'match-pairs') {
    return <MatchPairsActivity {...props} />
  }

  if (question.type === 'tile-puzzle') {
    return <TilePuzzleActivity {...props} />
  }

  return <MultipleChoiceActivity {...props} />
}

export default ActivityRenderer
