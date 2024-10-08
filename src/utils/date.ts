import moment from 'moment/moment'

/**
 * 현재기준으로 날짜가 일자로 얼마나 지났는지
 * @param lastVisit
 */
export const dayFromLastVisited = (lastVisit?: string) => {
  if (!lastVisit) return ''
  const diff = moment().diff(lastVisit, 'days', true)
  if (diff > 0) {
    const result = Math.floor(diff)
    if (!result) return ''
    return `+${Math.floor(result)}`
  }
  const result = Math.ceil(diff - 1)
  if (!result) return ''
  return result.toString()
}

/**
 * 들어온 날짜 기준으로 일자가 얼마나 지났는지
 */
export const durationFromLastVisitedToReferenceDate = (lastVisit?: string, referenceDate?: any) => {
  if (!lastVisit || !referenceDate) return ''

  // referenceDate와 lastVisit 모두를 moment로 파싱
  const parsedReferenceDate = moment(referenceDate, 'YYYY-MM-DD')
  const parsedLastVisit = moment(lastVisit, 'YYYY-MM-DD')

  // 유효하지 않은 날짜일 경우
  if (!parsedReferenceDate.isValid() || !parsedLastVisit.isValid()) return ''

  const diff = parsedReferenceDate.diff(parsedLastVisit, 'days', true)

  if (diff > 0) {
    const result = Math.floor(diff)
    if (!result) return ''
    return `+${Math.floor(result)}`
  }

  const result = Math.ceil(diff - 1)
  if (!result) return ''

  return result.toString()
}

