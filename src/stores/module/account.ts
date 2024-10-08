import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    isLogin: false,
    jwtToken: '',
    refreshToken: '',
    sessionId: '',
    hospitalSeq: ''
  }),
  actions: {
    login({ jwtToken = '', refreshToken = '', sessionId = ''}) {
      this.isLogin = true
      this.jwtToken = jwtToken
      this.refreshToken = refreshToken
      this.sessionId = sessionId
    },
    setHospitalSeq(hospitalSeq: string) {
      this.hospitalSeq = hospitalSeq
    },
  },
  getters: {
    getIsLogin(): boolean {
      return this.isLogin
    },
    getJwtToken(): string {
      return this.jwtToken
    },
    getRefreshToken(): string {
      return this.refreshToken
    },
    getSessionId(): string {
      return this.sessionId;
    },
    getHospitalSeq(): string {
      return this.hospitalSeq;
    },
  },
  persist: true
})
