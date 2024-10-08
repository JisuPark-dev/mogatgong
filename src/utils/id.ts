import moment from 'moment'

export const idNumToDate = (id: string) => {
  const yearsRear = id.slice(0, 2)
  const months = id.slice(2, 4)
  const days = id.slice(4, 6)
  const p = Number(id.slice(6, 7))
  let yearsFront = '19'
  // 2000년대 탄생자
  if (p === 3 || p === 4) {
    yearsFront = '20'
  }
  return moment(`${yearsFront}${yearsRear}-${months}-${days}`)
}

export const idNumToAge = (id: string) => {
  const date = idNumToDate(id)
  return moment().diff(date, 'years')
}

// 주민등록번호를 00000-0000000으로 보기 쉽게 만들어준다
export const toIdNumberString = (id: string) => {
  return `${id.slice(0, 6)}-${id.slice(6)}`
}

export const getSexFromId = (id: string) => {
  const p = Number(id.slice(6, 7))
  if (p === 1 || p === 3) {
    return '남'
  }
  if (p === 2 || p === 4) {
    return '여'
  }
  return '알수없음'
}