export const getLatLngFromSearch = (search: string, cb: (result) => void) => {
  const geocoder = new window.kakao.maps.services.Geocoder()
  geocoder.addressSearch(search, (result) => {
    cb && cb(result)
  }, {
    analyze_type: 'EXACT'
  })
}

export const loadKakaoMapScript = (cb: Function) => {
  const appKey: string = ''// TODO: api key를 별도로 넣어야 합니다.
  const script = document.createElement('script')
  script.src =
    '//dapi.kakao.com/v2/maps/sdk.js?appkey=' +
    appKey +
    '&autoload=false&libraries=clusterer,services'
  script.onload = () => window.kakao.maps.load(cb)
  document.head.appendChild(script)
}