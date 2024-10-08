/// <reference types="vite/client" />
declare global {
  interface Window {
    kakao: { maps: kakao.maps }
  }
}
