<template>
  <div class='address-box' :id='props.id' />
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue'
import { getLatLngFromSearch } from '@/utils/geo'

interface LatLng {
  lat?: string
  lng?: string
}

export interface VueDaumPostcodeCompleteResult extends LatLng {
  postcode: string
  postcode1: string
  postcode2: string
  postcodeSeq: string
  zonecode: string
  address: string
  addressEnglish: string
  addressType: string
  bcode: string
  bname: string
  bnameEnglish: string
  bname1: string
  bname1English: string
  bname2: string
  bname2English: string
  sido: string
  sidoEnglish: string
  sigungu: string
  sigunguEnglish: string
  sigunguCode: string
  userLanguageType: string
  query: string
  buildingName: string
  buildingCode: string
  apartment: string
  jibunAddress: string
  jibunAddressEnglish: string
  roadAddress: string
  roadAddressEnglish: string
  autoRoadAddress: string
  autoRoadAddressEnglish: string
  autoJibunAddress: string
  autoJibunAddressEnglish: string
  userSelectedType: string
  noSelected: string
  hname: string
  roadnameCode: string
  roadname: string
  roadnameEnglish: string
}

const emit = defineEmits<{
  load: []
  error: [value: Error]
  complete: [value: VueDaumPostcodeCompleteResult]
}>()
const isLoad = ref(false)

const props = withDefaults(
  defineProps<{
    id?: string
  }>(),
  {
    id: 'daum-address'
  }
)
let address: any

function loadScript() {
  const script = document.createElement('script')
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.onload = () => window.daum.postcode.load(loadAddress)
  script.onerror = (e) => {
    const error = new Error(`Load ${script.src} failed.`)
    error.cause = e
    emit('error', error)
  }
  document.head.appendChild(script)
}

async function loadAddress() {
  if (isLoad.value || address) return
  const container = document.getElementById('daum-address')
  address = new window.daum.Postcode({
    width: '100%',
    height: '100%',
    oncomplete: (data: VueDaumPostcodeCompleteResult) => {
      getLatLngFromSearch(data.roadAddress, (result) => {
        if (result && result?.length) {
          const searchResult = result[0]
          emit('complete', { ...data, lng: searchResult.x, lat: searchResult.y })
          return
        }
        emit('complete', data)
      })
    }
  }).embed(container, {
    autoClose: false
  })
  isLoad.value = true
  emit('load')
}

onMounted(() => {
  if (window.daum && window.daum.postcode) {
    loadAddress()
  } else {
    loadScript()
  }
})
</script>
<style scoped lang='scss'>
.address-box {
  min-height: 60rem;
  display: flex;

  :deep(*[id^='__daum__layer_']) {
    height: auto !important;
  }
}
</style>