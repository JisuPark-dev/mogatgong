<template>
  <div class='map-scheduler-wrap'>
    <div class='map-scheduler-filter'>
      <span class='map-scheduler-filter__left'>
        <MButton variant='custom-gray-text' scale='xxs' @click='resetFilters'>리셋</MButton>
        <MDropDownMultiSelect
            label='환자분류'
            icon='ic_clip_bold'
            enableSelectAll
            v-model='patientTypes'
            @refetchPatientList="refetchPatientList"
            :dropdownItems="[
                { tag: ScheduleType['DIS'], color: '#FEA4AE' },
                { tag: ScheduleType['DIL'], color: '#DE5A79' },
                { tag: ScheduleType['HOM'], color: '#FFE17C' },
                { tag: ScheduleType['COM'], color: '#4CBBAE' }
              ]"
        />
        <MDateBetween @refetchPatientList="reloadPatientList" v-model='durationAfterVisit' />


        <MDropDownMultiSelect
          label='구역'
          icon='ic_mappin_bold'
          enableSelectAll
          @refetchPatientList="refetchPatientList"
          v-model='filterDistrict'
          :dropdownItems='districts?.map(item => ({ tag: item }))'
          :displayItemLimit='2'
        />
        <MDropDownMultiSelect
            label='중요'
            icon='ic_exclamationmark_circle_bold'
            enableSelectAll
            v-model='urgentFilterTypes'
            @refetchPatientList="refetchPatientList"
            :background="['#FFEBEE', '#E5F7E8']"
            :dropdownItems="[
                { tag: '이번달 미방문', backgroundColor: '#FFEBEE' },
                { tag: '모비닥 추천', backgroundColor: '#E5F7E8'},
              ]"
            :infoIcon="true"
        />
      </span>
    </div>
    <!-- 카카오 지도 -->
    <div class='map-scheduler' :id='props.id' ref='container'></div>
  </div>
</template>

<script setup lang='ts'>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import MDateBetween from '@/components/base/MDateBetween.vue'
import MButton from '@/components/base/MButton.vue'
import MDropDownMultiSelect from '@/components/base/MDropDownMultiSelect.vue'
import { ScheduleLabelToType, ScheduleType, ScheduleKeys } from '@/constants'
import { useQuery } from '@tanstack/vue-query'
import query from '@/constants/queries'
import { $api } from '@/plugins/api-service-plugin'
import {durationFromLastVisitedToReferenceDate} from '@/utils/date'
import type { IScheduleHistorySimpleResponseByDate } from '@/types/services/schedule'
import type { IPatientSimpleResponse } from '@/types/services/patient'
import MarkerClustererOptions = kakao.maps.MarkerClustererOptions;
import type {IEmployeeResponse} from "@/types/services/employee";

const props = withDefaults(
  defineProps<{
    id: string
    scheduleHistoryList?: IScheduleHistorySimpleResponseByDate[]
    doctors: IEmployeeResponse[]
    nurses: IEmployeeResponse[]
    selectedDate: string
  }>(),
  {
    scheduleHistoryList: () => []
  }
)

const emit = defineEmits<{
  overlayClick: [item: ItemType, priority?: number],
  selectAllClick: [item: ItemType[]];
  deSelectAllClick: [item: ItemType[]];
}>()

async function reloadPatientList() {
  await refetchPatientList()
}

let prevOverlayList: typeof drawInfoWindows.value = []
const filterDistrict = ref<string[]>([])
const durationAfterVisit = ref<{date: number, isChecked : boolean}>({date: 0, isChecked: true});
const patientTypes = ref<string[]>([ScheduleType['DIS'], ScheduleType['HOM']])
const urgentFilterTypes = ref<string[]>([]);

const appKey: string = '' // TODO: app key를 별도로 넣어야 합니다.
let map: kakao.maps.Map | null = null
let clusterer: kakao.maps.MarkerClusterer | null = null
const isLoad = ref(false)
const container = ref<HTMLDivElement>()

const { data: patientList, refetch: refetchPatientList } = useQuery({
  queryKey: [query.patientFindAllForMap()],
  queryFn: async () => {
    const { data } = await $api.patientService.findAllForMap({
      scheduleType: patientTypes.value.length > 0 ? patientTypes.value.map(item => ScheduleLabelToType[item]) : undefined,
      durationAfterVisit: durationAfterVisit.value.date,
      newPatientInclusion: durationAfterVisit.value.isChecked,
      district: filterDistrict.value,
      selectedDate: props.selectedDate,
      isNotVisitedThisMonth: urgentFilterTypes.value.includes('이번달 미방문'),
      isUrgentVisit: urgentFilterTypes.value.includes('모비닥 추천')
    })
    return data
  },
  enabled: false
})

const { data: hospitalDetail } = useQuery({
  queryKey: [query.findHospital()],
  queryFn: async () => {
    const { data } = await $api.hospitalService.findHospital()
    return data
  }
})

watch(hospitalDetail, () => {
  // 현재 병원 위치로 지도 중실을 변경한다
  if (!container.value || !map) return
  const [lat, lng] = hospitalDetail.value?.location.split(',') ?? ['', '']
  map.setCenter(new kakao.maps.LatLng(Number(lat), Number(lng)))
}, { immediate: true })


const mergedPatientList = ref<(Partial<IScheduleHistorySimpleResponseByDate> & Partial<IPatientSimpleResponse>)[]>([])
// 선택한 내용이 기존 내용을 덮어써서 지도에 들어가야한다
watch([() => props.scheduleHistoryList, patientList], async () => {
  if (!patientList.value) return
  const superSet = patientList.value
  const notIncludedPatients = superSet.filter((patient) => {
    const found = props.scheduleHistoryList.find((history) => patient.seq === history.patientSeq)
    return !found
  })
  mergedPatientList.value = [...notIncludedPatients, ...props.scheduleHistoryList]

}, { immediate: true })
watch(props.scheduleHistoryList, async () => {
  await refetchPatientList();
})

const toColor = (type?: string, isOrder?: boolean) => {
  if (isOrder) {
    return '#347BF6'
  }
  switch (type) {
    case ScheduleKeys.DIS: {
      return '#FEA4AE'
    }
    case ScheduleKeys.HOM: {
      return '#FFE17C'
    }
    case ScheduleKeys.DIL:{
      return '#DE5A79'
    }
    default: {
      return '#4CBBAE'
    }
  }
}

const mapItems = computed(() => {
  return mergedPatientList.value.map((item) => {
    const historyList = [...(item.schedulesHistoryList || [])].pop()
    const lastVisited = historyList ? durationFromLastVisitedToReferenceDate(historyList.date, props.selectedDate) : ''
    const doctorName = historyList ? props.doctors.find(d=> d.seq === historyList.doctorSeq)?.name : '';
    const nurseName = historyList ? props.nurses.find(n=> n.seq === historyList.nurseSeq)?.name : '';
    const text = `${item.name ?? item.patientName}${lastVisited ? `(${lastVisited})` : ''}`
    return {
      seq: item.seq,
      name: item.name ?? item.patientName,
      ingScheduleSeq: item.ingScheduleSeq,
      lat: item.lat,
      lng: item.lng,
      text,
      color: toColor(item.type, !!item.priority),
      order: item.priority,
      priorityContact: item.priorityContact,
      patientContact: item.contact,
      patientNote: item.contactNote,
      familyContact: item.familyContact,
      familyNote: item.familyNote,
      caregiverContact: item.caregiverContact,
      caregiverNote: item.caregiverNote,
      lastVisited: lastVisited,
      doctorName: doctorName,
      nurseName : nurseName,
      medicalFeeType: item.type,
      filteringType: item.filteringType,
    }
  })
})

const groupByLngLat = computed(() => {
  const result: { [key: string]: (typeof mapItems.value)[0][] } = {}
  mapItems.value.forEach(item => {
    const key = `${item.lng}/${item.lat}`
    let value = result[key]
    if (!value) {
      result[key] = [item]
      return
    }
    result[key] = [...result[key], item]
  })
  return Object.values(result)
})

const { data: districts } = useQuery({
  queryKey: [query.patientFindDistricts()],
  queryFn: async () => {
    const { data } = await $api.patientService.findDistricts()
    return data
  }
})

const loadScript = () => {
  const script = document.createElement('script')
  script.src =
    '//dapi.kakao.com/v2/maps/sdk.js?appkey=' +
    appKey +
    '&autoload=false&libraries=clusterer,services'
  script.onload = () => window.kakao.maps.load(loadMap)
  document.head.appendChild(script)
}
const mapLevel = ref(7);

const loadMap = () => {
  if (!container.value) return
  map = new window.kakao.maps.Map(container.value, {
    center: new kakao.maps.LatLng(37.4971450337681, 127.148010202683),
    level: mapLevel.value,
    disableDoubleClickZoom: true
  })
  // 지도 축적 레벨 변경 이벤트 리스너 추가
  kakao.maps.event.addListener(map, 'zoom_changed', () => {
    const newLevel = map.getLevel(); // 변경된 축적 레벨
    mapLevel.value = newLevel; // 축적 레벨을 ref에 저장
  });
  isLoad.value = true
}

function createPatientDetailContent(item: any, event:any) {
  const infoContent = document.createElement('div')
  infoContent.className = 'info-overlay kakao-map-patient-detail-overlay' // patient-detail 클래스 추가

  const screenWidth = window.innerWidth; // 화면의 전체 너비
  const mouseX = event.clientX;
  if (mouseX < screenWidth / 5*2) {
    // 마우스가 왼쪽 절반에 있는 경우
    infoContent.className = 'info-overlay kakao-map-patient-detail-overlay kakao-map-patient-detail-overlay__left-side' // patient-detail 클래스 추가
  } else {
    // 마우스가 오른쪽 절반에 있는 경우
    infoContent.className = 'info-overlay kakao-map-patient-detail-overlay kakao-map-patient-detail-overlay__right-side' // patient-detail 클래스 추가
  }

  // 환자 이름
  const patientName = document.createElement('h3')
  patientName.innerText = item.name
  patientName.className = 'kakao-map-patient-detail-overlay__name' // 클래스 추가
  infoContent.appendChild(patientName)

  // 본인 연락처
  const patientContactWrapper = document.createElement('div');
  patientContactWrapper.className = 'kakao-map-patient-detail-overlay__contact-wrapper'; // 클래스 추가
  const patientContactLabel = document.createElement('div');
  patientContactLabel.innerText = '본인 연락처';
  patientContactLabel.className = 'kakao-map-patient-detail-overlay__label'; // 클래스 추가
// contact와 note를 감싸는 div 추가
  const patientContactAndNoteWrapper = document.createElement('div');
  patientContactAndNoteWrapper.className = 'kakao-map-patient-detail-overlay__contact-and-note-wrapper';
  const patientContact = document.createElement('div');
  patientContact.innerText = item.patientContact ?? '정보 없음';
  patientContact.className = 'kakao-map-patient-detail-overlay__contact'; // 클래스 추가
  const patientNote = document.createElement('div');
  patientNote.innerText = item.patientNote ? `${item.patientNote}` : '';
  patientNote.className = 'kakao-map-patient-detail-overlay__note'; // 클래스 추가
// contact와 note를 wrapper에 추가
  patientContactAndNoteWrapper.appendChild(patientContact);
  patientContactAndNoteWrapper.appendChild(patientNote);
// 전체 wrapper에 label과 contact+note 추가
  patientContactWrapper.appendChild(patientContactLabel);
  patientContactWrapper.appendChild(patientContactAndNoteWrapper);
  infoContent.appendChild(patientContactWrapper);

  // 주보호자 연락처
  const familyContactWrapper = document.createElement('div');
  familyContactWrapper.className = 'kakao-map-patient-detail-overlay__contact-wrapper';
  const familyContactLabel = document.createElement('div');
  familyContactLabel.innerText = '주보호자 연락처';
  familyContactLabel.className = 'kakao-map-patient-detail-overlay__label';
// contact와 note를 감싸는 div 추가
  const familyContactAndNoteWrapper = document.createElement('div');
  familyContactAndNoteWrapper.className = 'kakao-map-patient-detail-overlay__contact-and-note-wrapper';
  const familyContact = document.createElement('div');
  familyContact.innerText = item.familyContact ?? '정보 없음';
  familyContact.className = 'kakao-map-patient-detail-overlay__contact';
  const familyNote = document.createElement('div');
  familyNote.innerText = item.familyNote ? `${item.familyNote}` : '';
  familyNote.className = 'kakao-map-patient-detail-overlay__note'; // 클래스 추가
// contact와 note를 wrapper에 추가
  familyContactAndNoteWrapper.appendChild(familyContact);
  familyContactAndNoteWrapper.appendChild(familyNote);
// 전체 wrapper에 label과 contact+note 추가
  familyContactWrapper.appendChild(familyContactLabel);
  familyContactWrapper.appendChild(familyContactAndNoteWrapper);

  // 활동지원사 연락처
  const caregiverContactWrapper = document.createElement('div');
  caregiverContactWrapper.className = 'kakao-map-patient-detail-overlay__contact-wrapper';
  const caregiverContactLabel = document.createElement('div');
  caregiverContactLabel.innerText = '활동지원사 연락처';
  caregiverContactLabel.className = 'kakao-map-patient-detail-overlay__label';
// contact와 note를 감싸는 div 추가
  const caregiverContactAndNoteWrapper = document.createElement('div');
  caregiverContactAndNoteWrapper.className = 'kakao-map-patient-detail-overlay__contact-and-note-wrapper';
  const caregiverContact = document.createElement('div');
  caregiverContact.innerText = item.caregiverContact ?? '정보 없음';
  caregiverContact.className = 'kakao-map-patient-detail-overlay__contact';
  const caregiverNote = document.createElement('div');
  caregiverNote.innerText = item.caregiverNote ?? '정보 없음';
  caregiverNote.className = 'kakao-map-patient-detail-overlay__note';
// contact와 note를 wrapper에 추가
  caregiverContactAndNoteWrapper.appendChild(caregiverContact);
  caregiverContactAndNoteWrapper.appendChild(caregiverNote);
// 전체 wrapper에 label과 contact+note 추가
  caregiverContactWrapper.appendChild(caregiverContactLabel);
  caregiverContactWrapper.appendChild(caregiverContactAndNoteWrapper);
  infoContent.appendChild(caregiverContactWrapper);

  const starIcon = document.createElement('div')
  starIcon.innerText = '★'
  starIcon.className = 'kakao-map-patient-detail-overlay__star' // 클래스 추가
  // 주보호자에 별 모양 추가
  if (item.priorityContact === 'CRG') {
    caregiverContact.appendChild(starIcon)
  }else if (item.priorityContact === 'PAT') {
    patientContact.appendChild(starIcon)
  }else if (item.priorityContact === 'FAM') {
    familyContact.appendChild(starIcon)
  }
  infoContent.appendChild(familyContactWrapper);

  // 최근 방문 정보
  const lastVisitWrapper = document.createElement('div');
  lastVisitWrapper.className = 'kakao-map-patient-detail-overlay__visit-wrapper';
  const lastVisitLabel = document.createElement('div');
  lastVisitLabel.innerText = '최근방문';
  lastVisitLabel.className = 'kakao-map-patient-detail-overlay__label';
  lastVisitWrapper.appendChild(lastVisitLabel);
// lastVisit, doctorName, nurseName을 감싸는 div 추가
  const employeeWrapper = document.createElement('div');
  employeeWrapper.className = 'kakao-map-patient-detail-overlay__visit-employee-wrapper';
  lastVisitWrapper.appendChild(employeeWrapper);
// 방문 정보
  const lastVisit = document.createElement('div');
  lastVisit.innerText = item.order ? '' : item.lastVisited ? `${item.lastVisited}` : '신규환자';
  lastVisit.className = item.lastVisited
      ? 'kakao-map-patient-detail-overlay__visit'
      : 'kakao-map-patient-detail-overlay__visit--new'; // 신규환자일 때 다른 클래스 적용
  employeeWrapper.appendChild(lastVisit);
// 의사 이름
  const doctorName = document.createElement('div');
  doctorName.innerText = item.doctorName ? `${item.doctorName}` : '';
  doctorName.className = 'kakao-map-patient-detail-overlay__visit__employee';
  employeeWrapper.appendChild(doctorName);
// 간호사 이름
  const nurseName = document.createElement('div');
  nurseName.innerText = item.nurseName ? `${item.nurseName}` : '';
  nurseName.className = 'kakao-map-patient-detail-overlay__visit__employee';
  employeeWrapper.appendChild(nurseName);

  infoContent.appendChild(lastVisitWrapper);

  return infoContent;
}



const createSingleContent = (item: (typeof mapItems.value)[0]) => {
  const circle = document.createElement('span')
  circle.className = 'info-window__circle'
  circle.dataset.order = `${item.order ?? ''}`
  circle.style.background = item.color
  const text = document.createElement('span')
  text.innerText = item.text
  const content = document.createElement('div')
  content.className = `info-window ${item.order && '--order'}`
  if (item.filteringType === 'notVisitedThisMonth') {
    content.style.background='#FFEBEE';
  }else if(item.filteringType === 'urgentVisit') {
    content.style.background='#E5F7E8';
  }
  content.appendChild(circle);
  content.appendChild(text)

  // 각 항목에 mouseover, mouseout 이벤트 추가
  addEventHandle(content, 'mouseenter', (event) => {
    showInfoOverlay(item, event)  // 각 항목에 대해 info 오버레이 표시
  })

  addEventHandle(content, 'mouseleave', () => {
    hideInfoOverlay()  // 마우스 아웃시 info 오버레이 숨김
  })

  return content
}

interface ItemType {
  order?: number;
  color: string;
  text: string;
  lng: number;
  lat: number;
  filteringType: string;
}

const createListContent = (items: ItemType[]) => {
  // 리스트 요소 생성
  const list = document.createElement('ul');
  list.className = 'info-window-wrap__list';

  // 클러스터링 마커 요소 생성
  const marker = document.createElement('div');
  marker.className = 'info-window-wrap__marker';
  marker.dataset.count = `${items.length}`;

  // 모든 아이템이 선택되었는지 확인
  const isAllSelected = items.every(item => item.order !== undefined);
  // '전체 선택' 또는 '전체 해제' 아이템 추가
  const selectAllItem = createSelectAllItem(isAllSelected, items);
  list.appendChild(selectAllItem);

  // 각 아이템에 대한 리스트 요소 생성
  items.forEach((item, index) => {
    const listItem = createListItem(item, index);
    list.appendChild(listItem);
  });

  // 래퍼 요소 생성 및 반환
  const wrapper = document.createElement('div')
  wrapper.className = 'info-window-wrap'
  wrapper.appendChild(list)
  wrapper.appendChild(marker)
  return wrapper
}

// '전체 선택' 또는 '전체 해제' 아이템 생성 함수
const createSelectAllItem = (isAllSelected: boolean, items: ItemType[]) => {
  const selectAllItem = document.createElement('li');
  selectAllItem.className = 'info-window --select-all';
  selectAllItem.innerText = isAllSelected ? '전체 해제' : '전체 선택';

  // 클릭 이벤트 핸들러 추가
  addEventHandle(selectAllItem, 'click', () => {
    if (!isAllSelected) {
      const itemsToSelect: ItemType[] = [];
      items.forEach(item => {
        if (item.order === undefined) {
          itemsToSelect.push(item);
        }
      });
      emit('selectAllClick', itemsToSelect)
    } else {
      // 전체 해제 기능
      const itemsToDeselect: ItemType[] = [];
      items.forEach(item => {
        itemsToDeselect.push(item);
      });
      emit('deSelectAllClick', itemsToDeselect)
    }
  });

  return selectAllItem;
};

// 개별 아이템 리스트 요소 생성 함수
const createListItem = (item: ItemType, index: number) => {
  // 원형 표시 생성
  const circle = document.createElement('span');
  circle.className = 'info-window__circle';
  circle.dataset.order = `${item.order ?? ''}`;
  circle.style.background = item.color;

  // 텍스트 요소 생성
  const text = document.createElement('span');
  text.innerText = item.text;

  // 리스트 아이템 요소 생성
  const listItem = document.createElement('li');
  listItem.dataset.group = `${item.lng}/${item.lat}`;
  listItem.dataset.index = `${index}`;
  listItem.className = `info-window ${item.order ? '--order' : ''}`;
  if (item.filteringType === 'notVisitedThisMonth') {
    listItem.style.background='#FFEBEE';
  }else if(item.filteringType === 'urgentVisit') {
    listItem.style.background='#E5F7E8';
  }
  listItem.appendChild(circle);
  listItem.appendChild(text);

  // 마우스 이벤트 핸들러 추가
  addEventHandle(listItem, 'mouseenter', (event) => {
    showInfoOverlay(item, event);
  });

  addEventHandle(listItem, 'mouseleave', () => {
    hideInfoOverlay();
  });

  return listItem;
};

const drawInfoWindows = computed(() => {
  if (mapLevel.value <= 6) {
    return groupByLngLat.value.map((items) => {
      if (items.length >= 2) {
        const content = createListContent(items)
        const position = new kakao.maps.LatLng(items[0].lat, items[0].lng)
        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1
        })
        overlay.setMap(map)
        return { overlay, content, items }
      }

      return items.map((item) => {
        const content = createSingleContent(item)
        const position = new kakao.maps.LatLng(item.lat, item.lng)
        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1
        })
        overlay.setMap(map)
        return { overlay, content, item }
      })
    }).flat();
  }
  else{
    // mapLevel이 6 초과일 때는 계산을 위해서 drawInfoWindows를 생성하지만, 보이지 않도록 content는 빈 값으로 설정합니다.
    return groupByLngLat.value.map((items) => {
      if (items.length >= 2) {
        const content = ''
        const position = new kakao.maps.LatLng(items[0].lat, items[0].lng)
        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1
        })
        overlay.setMap(map)
        return { overlay, content, items }
      }

      return items.map((item) => {
        const content = ''
        const position = new kakao.maps.LatLng(item.lat, item.lng)
        const overlay = new window.kakao.maps.CustomOverlay({
          position,
          content,
          yAnchor: 1
        })
        overlay.setMap(map)
        return { overlay, content, item }
      })
    }).flat();
  }
})

const patientDetailOverlay = ref<any>(null);

// 마우스 오버시 정보를 보여주는 오버레이 생성 - 기본적으로 content와는 별개의 오버레이가 생성된다고 생각하면 됩니다.
const showInfoOverlay = (item: any, event: any) => {
  if (!item || !map) return
  const position = new kakao.maps.LatLng(item.lat, item.lng)
  const content = createPatientDetailContent(item, event);

  // 오버레이 생성
  patientDetailOverlay.value = new window.kakao.maps.CustomOverlay({
    position: position,
    content: content,
    yAnchor: 1,
    zIndex: 10 // 위에 표시되도록 zIndex 설정
  })

  patientDetailOverlay.value.setMap(map)
}

// 마우스 아웃시 정보를 숨기는 오버레이 제거
const hideInfoOverlay = () => {
  if (patientDetailOverlay.value) {
    patientDetailOverlay.value.setMap(null)
    patientDetailOverlay.value = null
  }
}

const addEventHandle = (target: unknown, type: string, callback: (e: Event) => void) => {
  if (target?.addEventListener) {
    target?.addEventListener(type, callback)
  } else {
    target?.attachEvent('on' + type, callback)
  }
}

watch([mapItems, isLoad, mapLevel], () => {
  if (!isLoad.value) return
  // 기존 오버레이를 지우고 다시그린다
  // TODO: 추후 업데이트 형식으로 구현하기
  hideInfoOverlay(); // overlay.setMap(null) 을 통해서 참조를 잃어버리기 전에 patientDetailOverlay를 지워줍니다.
  prevOverlayList.map(({ overlay }) => {
    overlay.setMap(null)
  })
  prevOverlayList = drawInfoWindows.value.map((windows) => {
    if (mapLevel.value <= 6) { // mapLevel이 5 이하일 때만 클릭 시 추가 삭제가 가능합니다.
      addEventHandle(windows.content, 'click', (e) => {
        e.stopPropagation()
        if (windows.item) {
          emit('overlayClick', windows.item)
        } else if (windows.items) {
          const index = Number(e.target?.closest('li.info-window')?.dataset.index)
          emit('overlayClick', windows.items[index])
        }
      });
    }
    return windows
  })
})

let markers: any = null;
function createImage(src: any, x: number, y: number) {
  let imageSize = new window.kakao.maps.Size(x, y); // 마커이미지의 크기입니다
  return new window.kakao.maps.MarkerImage(src, imageSize);
}
watch([isLoad, mapItems], ()=>{
  clusterer?.removeMarkers(markers)

  // 마커 클러스터러를 생성합니다
  clusterer = new kakao.maps.MarkerClusterer({
    map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
    averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
    minClusterSize:1, //클러스터링되는 최소 단위
    minLevel: 7 // 클러스터 할 최소 지도 레벨
  } as MarkerClustererOptions);

  markers = groupByLngLat.value.map((items)=>{
    let src = `/asset/img/img_dot.svg`; //
    let myLocationIcon = createImage(src, 0.1, 0.1); // 기본마커를 사용하고 싶지 않아서 작은 크기의 임시마커 생성
    return new kakao.maps.Marker({
      position: new kakao.maps.LatLng(items[0].lat, items[0].lng),
      image : myLocationIcon
    })
  })
  clusterer?.addMarkers(markers);
})

onMounted(async () => {
  // refetchPatientList()
  await nextTick()
  if (window.kakao?.maps) {
    loadMap()
  } else {
    loadScript()
  }
})

const resetFilters = () => {
  durationAfterVisit.value = { date: 0, isChecked: true }
  patientTypes.value = []
  filterDistrict.value = []
  refetchPatientList()
}
</script>

<style lang='scss'>
.map-scheduler {
  .info-window-wrap {
    gap: 1.2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;

    &__list {
      box-shadow: 0 0.1rem 0.4rem 0 rgba(0, 0, 0, 0.26);

      .info-window {
        box-shadow: none;
        border-radius: unset;

        &:last-of-type {
          border-radius: 4px;
        }

        &:first-of-type {
          border-radius: 4px;
        }

        &:not(:last-of-type) {
          border-bottom: 1px solid rgba(232, 234, 237, 1);

          &::before {
            z-index: -1;
          }
        }
      }
    }

    &__marker {
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.2);
      width: 4rem;
      height: 4rem;
      position: relative;

      &::before {
        content: attr(data-count);
        @include button-3($color: black);
        position: absolute;
        top: 53%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }

  .info-window {
    gap: 0.4rem;
    border-radius: 4px;
    border-color: white;
    padding: 0.8rem;
    cursor: pointer;
    background: white;
    @include button-3($color: #414348);
    display: flex;
    position: relative;
    box-shadow: 0 0.1rem 0.4rem 0 rgba(0, 0, 0, 0.26);
    user-select: none;

    &.--order {
      border-color: rgba(199, 223, 255, 1);
      background: rgba(199, 223, 255, 1);
    }

    &::before {
      content: '';
      border-width: 5px;
      border-style: solid;
      border-top-color: inherit;
      border-bottom-color: transparent;
      border-left-color: transparent;
      border-right-color: transparent;
      position: absolute;
      top: 100%;
      left: 45%;
    }

    &__circle {
      border-radius: 50%;
      width: 1.6rem;
      height: 1.6rem;
      position: relative;

      &::before {
        content: attr(data-order);
        @include button-5($color: $default-white);
        position: absolute;
        top: 53%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}

/* patient-detail 컨테이너 */
.kakao-map-patient-detail-overlay {
  width: 280px;
  display: flex;
  flex-direction: column;
  background-color: $gray-100;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
  pointer-events: none;
  position: absolute; /* 또는 relative, fixed */
  &__left-side{
    top: -150px;
    left: 70px;
  }
  &__right-side{
    top: -150px;
    left: -350px;
  }

  /* 환자 이름 */
  &__name {
    align-self: center;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }

  /* 연락처 wrapper */
  &__contact-wrapper {
    display: flex;
    margin-bottom: 8px;
  }
  &__contact-and-note-wrapper{
    display: flex;
    flex-direction: column;
  }

  /* 연락처 라벨 */
  &__label {
    @include caption-1($color: $gray-600);
    width: 120px !important;
    margin-right: 8px;
  }

  /* 연락처 정보 */
  &__contact {
    display: flex;
    align-items: center;
    @include button-4($color: $gray-800);
  }

  /* 보호자나 가족 메모 */
  &__note {
    @include caption-2($color: $gray-500);
    max-width: 120px;
    white-space: normal
  }

  /* 보호자 별 아이콘 */
  &__star {
    color: #FFD700;
    margin-left: 5px;
    font-size: 14px;
  }

  /* 최근 방문 정보 */
  &__visit-wrapper {
    display: flex;
    align-items: center;
  }
  &__visit-employee-wrapper{
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__visit {
    @include button-4($color : $gray-800);
  }
  &__visit--new {
    @include button-4($color : $primary-500);
  }
  &__visit__employee{
    @include caption-1($color: $gray-500)
  }
}
</style>
<style scoped lang='scss'>
.map-scheduler-wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-scheduler {
  width: 100%;
  height: 100%;
}

.map-scheduler-filter {
  gap: 1.6rem;
  padding: 2.4rem;
  border-radius: 12px;
  max-width: 100%;
  //width: 110rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 2.5rem;
  background: $default-white;
  z-index: 2;
  left: 50%;
  transform: translate(-50%, 0%);
  white-space: pre;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.16);

  &__left {
    gap: 0.8rem;
    display: flex;
    align-items: center;
  }
}
</style>