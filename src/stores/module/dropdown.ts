import { defineStore } from 'pinia'

const addDropdownItem = (list: string[], item: string, limit: number = 5) => {
  let result = [...list]
  const refinedItem = (item ?? '').trim()
  if (!refinedItem) return result
  const i = result.indexOf(refinedItem)
  const notFound = -1
  if (i === notFound) {
    result.unshift(refinedItem)
    result = result.slice(0, limit)
    return result
  }
  const filteredList = result.filter((value, index) => index !== i)
  result = [refinedItem, ...filteredList]
  return result
}

export const useDropdownStore = defineStore('dropdown', {
  state: () => ({
    doctorNameList: [],
    nurseNameList: [],
    regionNameList: [],
    chronicDiseaseNameList: []
  } as {
    doctorNameList: string[],
    nurseNameList: string[],
    regionNameList: string[],
    chronicDiseaseNameList: string[]
  }),
  actions: {
    addDoctor(name: string) {
      this.doctorNameList = addDropdownItem(this.doctorNameList, name)
    },
    addNurse(name: string) {
      this.nurseNameList = addDropdownItem(this.nurseNameList, name)
    },
    addRegion(name: string) {
      this.regionNameList = addDropdownItem(this.regionNameList, name)
    },
    addChronicDisease(name: string) {
      this.chronicDiseaseNameList = addDropdownItem(this.chronicDiseaseNameList, name, 15)
    }
  },
  getters: {
    getDoctorNameList(): string[] {
      return this.doctorNameList
    },
    getNurseNameList(): string[] {
      return this.nurseNameList
    },
    getRegionNameList(): string[] {
      return this.regionNameList
    },
    getChronicDiseaseNameList(): string[] {
      return this.chronicDiseaseNameList
    }
  },
  persist: true
})
