import type { ResultStatus } from '../../types/result'
import { RESULT_STATUS_LABELS } from '../../lib/constants'
import { Badge, type BadgeTone } from '../ui/Badge'

const toneByStatus: Record<ResultStatus, BadgeTone> = {
  draft: 'slate',
  submitted: 'amber',
  approved: 'blue',
  published: 'green',
}

export function ResultStatusBadge({ status }: { status: ResultStatus }) {
  return <Badge label={RESULT_STATUS_LABELS[status]} tone={toneByStatus[status]} />
}