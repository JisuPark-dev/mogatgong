<!--

  참조: https://vcalendar.io/datepicker/basics.html#date-mode
  >> 향후 MDatePickerGroup 컴포넌트 대체용(Jay 작업 예정) / 완료후 해당 주석 삭제 요청

-->


<template>
  <div class="date-picker-range"
       v-on-click-outside="closeCalendar">
    <slot v-if="!!$slots.showButton"
          name="showButton"
          :toggle="toggleDateRangeCalendar"
          :toggleCheck="showCalendar"
          :data="range"/>

    <div v-if="!!$slots.showButton ? showCalendar : true"
         :key="resetKey"
         :class="`dr-${direction}`"
         class="calendar">
      <DatePicker v-model.range="range"
                  @update:picker-date="range"
                  class="range-date"
                  ref="rangeDatePicker"
                  :class="{ 'same-content-date' : todayActive }"
                  :mode="mode"
                  :trim-weeks="trim"
                  :drag-attribute="dragAttribute"
                  :select-attribute="selectAttribute"
                  :attributes="attributes"
                  :rows="rows"
                  :columns="columns"
                  :masks="{ title: title }"
                  @dayclick="onClick($event)"
                  @drag="onDrag">
      </DatePicker>

      <!-- slot으로 처리하고 method (취소, 적용) slot data 로 사용할 수 있음-->
      <div v-if="!!$slots.showButton"
           class="footer-box">
        <div class="left-text-box">
          <p class="text">{{ CONSULT_STATUS_LABEL.RESERVATION_REQUEST }}일 기준</p>
          <p class="range">
            {{ moment(range.start).format('YYYY. M. D (dd)') }}
            <span class="end-date" v-show="range.end !== '' && range.start !== range.end">- {{
                range.end !== '' ? moment(range.end).format('YYYY. M. D (dd)') : ''
              }}</span>
          </p>
        </div>
        <div class="right-button-box">
          <MButton :scale="'xs'"
                   :variant="'outline-gray-text'"
                   @click="moveToday">
            오늘 날짜로 이동
          </MButton>
          <div class="inner-button-box">
            <MButton class="cancel-btn"
                     :variant="'outline-gray-text'"
                     :scale="'xs'"
                     @click="closeCalendar">
              취소
            </MButton>
            <MButton :variant="'custom-blue'"
                     :scale="'xs'"
                     @click="changeDate">
              적용
            </MButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {DatePicker} from "v-calendar";
import 'v-calendar/style.css';
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import {type DateRangeSource, type SimpleDateRange} from "v-calendar/dist/types/src/utils/date/range.d.ts";
import {refs} from "@/utils/refs";
import moment from "moment";
import {type HighlightFillMode} from "v-calendar/dist/types/src/utils/glyph.d.ts";
import {vOnClickOutside} from "@vueuse/components";
import {type DatePickerDate} from "v-calendar/dist/types/src/use/datePicker.d.ts";
import {type CalendarDay} from "v-calendar/dist/types/src/utils/page.d.ts";
import {CONSULT_STATUS_LABEL} from "@commons/constants/consult";
import MButton from '@/components/base/MButton.vue'


/*
* Types
* */
export type DateObj = {
  start: string,
  end: string
}
export type Content = {
  description: string,
  isComplete: false,
}
export type Direction = 'left' | 'right' | 'center';

export type ContentConfig = {
  key?: any,
  content?: boolean | string | {
    class?: string | string[],
    style?: object
  },
  highlight?: boolean | string | {
    color?: string,
    fillMode?: HighlightFillMode,
    class?: string | string[]
    contentClass?: string | string[]
  },
  order?: number,
  dot?: boolean | string | {
    style?: object,
    class?: string | string[],
  },
  bar?: boolean | string | {
    style: object,
    class?: string | string[],
  },
  customData?: Content | Content[] | any    //진료기록
  dates?: Date | Date[] | DatePickerDate
};

export type PropsConfig = ContentConfig | ContentConfig[]


/*
* Props
* */
const props = withDefaults(defineProps<{
  modelValue?: DateObj
  placeholder?: DateObj | string
  direction?: Direction
  disabledDates?: DateRangeSource
  trim?: boolean
  title?: string
  rows?: number
  columns?: number
  mode?: string
  attributes?: PropsConfig
}>(), {
  modelValue: () => ({
    start: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  }),
  placeholder: '날짜 선택',
  direction: 'left',
  trim: true,
  title: 'YYYY년 MMMM',
  rows: 1,
  columns: 2
})


/*
* emits
* */
const emit = defineEmits<{
  'update:modelValue': [value: DateObj]
  'click': [value: CalendarDay]
  'drag': [value: SimpleDateRange]
  'change': [value: any]
  'todayChange': []
}>()


/*
* Data
* */
const rangeDatePicker = refs(DatePicker)
let comparedDate = ref<DateObj>({start: '', end: ''});
const showCalendar = ref(false);
let resetKey = ref(0);


/*
* ModelValue Set(computed)
* */
const range = computed({
  get() {
    return props.modelValue
  },
  set(newVal) {
    const setValue = ref<DateObj>({
      start: moment(newVal.start).format('YYYY-MM-DD'),
      end: moment(newVal.end).format('YYYY-MM-DD')
    })
    emit('update:modelValue', setValue.value);
  }
})

//오늘 날짜로 이동 감지
const todayActive = computed(() => {
  return comparedDate.value?.start === comparedDate.value?.end;
})


/*
* Default Setting (for style)
* */
const defaultAttr = ref<ContentConfig[]>([
  // {
  //   key: 'today',
  //   order: 1,
  //   highlight: {
  //     class: 'active-today',
  //     contentClass: 'active-today-content'
  //   },
  //   dates: new Date()
  // },
])

const setting = ref<ContentConfig[]>(defaultAttr.value);

const attributes = computed(() => {
  if (Array.isArray(props.attributes)) {
    setting.value = [...defaultAttr.value, ...props.attributes]
  } else {
    setting.value = [...defaultAttr.value, props.attributes ?? {}];
  }

  return setting.value;
})

const dragAttribute = ref({
  highlight: {
    start: {
      fillMode: 'solid',
      class: 'drag-range-start',
      contentClass: 'drag-range-content'
    },
    base: {
      fillMode: 'light',
      class: "drag-range-base"
    },
    end: {
      fillMode: 'outline',
      class: "drag-range-end",
      contentClass: 'drag-range-content'
    },
  }
})

const selectAttribute = ref({
  highlight: {
    start: {
      fillMode: 'solid',
      class: 'selected-range-start',
      contentClass: 'selected-range-content',
    },
    base: {
      fillMode: 'light',
      class: "selected-range-base",
      contentClass: 'selected-range-base-date'
    },
    end: {
      fillMode: 'outline',
      class: "selected-range-end",
      contentClass: 'selected-range-content'
    },
  }
})


/*
* methods
* */
function moveToday() {
  rangeDatePicker.value?.move(new Date());
  const today = ref<DateObj>({
    start: moment().format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  })

  emit('update:modelValue', today.value);
  emit('todayChange');
  resetKey.value += 1;
}

function changeDate() {
  showCalendar.value = false;
  emit('change', range.value);
}

function toggleDateRangeCalendar() {
  showCalendar.value = !showCalendar.value
}

function closeCalendar() {
  showCalendar.value = false;
}

function onClick(day: CalendarDay) {
  const start = comparedDate.value.start;
  const end = comparedDate.value.end;

  range.value.start = moment(start).format('YYYY-MM-DD');
  range.value.end = moment(end).format('YYYY-MM-DD');

  // 비교 데이터 같은경우 : end 값 미선택일 경우(최산화 ready set)
  if (range.value.start === range.value.end) {
    range.value.end = '';
  }

  // emit 및 값 전달 SET 완료이후 부분 RELOAD
  nextTick(() => {
    // event 선택값 최종 종료후 부분 reload 진행(v-model 값이 다들어 있는 경우)
    if (range.value.start !== '' && range.value.end !== '') {
      resetKey.value += 1;
    }
  });

  emit('click', day);
}

function onDrag(v: SimpleDateRange) {
  // 비교 데이터 Set
  comparedDate.value.start = moment(v.start).format('YYYY-MM-DD');
  comparedDate.value.end = moment(v.end).format('YYYY-MM-DD');
}


/**
 * Mounted
 * */
onMounted(() => {
  range.value.start = moment(range.value.start).format('YYYY-MM-DD');
  range.value.end = moment(range.value.end).format('YYYY-MM-DD');
  emit('update:modelValue', range.value);
})


/**
 * Watch
 * */
watch(() => (showCalendar.value), (newVal) => {
  if (!newVal && range.value.end === '') {
    range.value.end = range.value.start;
  }
});

defineExpose({
  moveToday
});
</script>

<style scoped lang="scss">
.date-picker-range {
  position: relative;

  .calendar {
    position: absolute;
    top: calc(100% + 4px);
    max-width: fit-content;
    border: 1px solid $gray-300;
    background: $default-white;
    z-index: 3;
    border-radius: 6px;
    overflow: hidden;
    @include elevation-2;

    // calendar 방향
    &.dr-left {
      left: 0;
    }

    &.dr-center {
      left: 50%;
      transform: translateX(-50%);
    }

    &.dr-right {
      right: 0;
    }

    :deep(.range-date) {
      border: 0;
      border-radius: 0;

      &.same-content-date {
        .selected-range-start {
          border-radius: 6px !important;
        }
      }

      .vc-pane-container {
        .vc-pane-header-wrapper {
          padding: 24px 24px 0;

          .vc-header {
            grid-gap: 0;
            height: 36px;
            margin: 0;
            padding: 0;

            .vc-arrow {
              background: unset;
              outline: 0;
              box-shadow: none;

              &:hover {
                background: $gray-200;
              }

              &:active {
                background: $gray-300;
              }
            }
          }
        }

        .vc-pane-layout {
          padding: 24px 0;

          .vc-pane {
            padding: 0 24px;
            border-right: 1px solid $gray-300;

            &:last-child {
              margin-right: 1px;
              border-right: 0;
            }

            .vc-header {
              grid-gap: 0;
              height: unset;
              margin: 0;
              padding: 0;

              .vc-title {
                padding: 0;
                position: relative;
                pointer-events: none;
                z-index: 1;
                background: none;

                > span {
                  display: flex;
                  align-items: center;
                  width: 100%;
                  height: 100%;
                  padding: 4px 12px;
                  @include h4-title;
                }
              }
            }

            .vc-weeks {
              margin-top: 24px;
              padding: 0;

              .vc-week {
                margin-bottom: 2px;

                &:last-child {
                  margin: 0;
                }

                .vc-day {
                  &.in-prev-month {
                    //visibility: hidden;
                    opacity: 0;
                  }

                  /* 오늘, drag or select 시 Style */
                  &.is-today {
                    .vc-day-content {
                      display: flex;
                      flex-direction: column;
                      color: $primary-500;

                      &::before {
                        content: '오늘';
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 100%;
                        position: absolute;
                        top: 0;
                        text-align: center;
                        @include button-5($color: $primary-500);
                      }

                      &.selected-range-content, &.drag-range-content {
                        &::before {
                          color: $default-white;
                        }
                      }
                    }
                  }

                  &:has(.drag-range-start), &:has(.drag-range-end) {
                    .vc-highlights {
                      .vc-day-layer {
                        .active-today {
                          z-index: 2;

                          &::before {
                            color: $default-white !important;
                          }
                        }
                      }
                    }
                  }

                  &:has(.selected-range-start), &:has(.selected-range-end) {
                    .vc-highlights {
                      .vc-day-layer {
                        .active-today {
                          z-index: 2;

                          &::before {
                            color: $default-white !important;
                          }
                        }
                      }
                    }

                    .vc-day-content {
                      color: $default-white !important;
                    }
                  }

                  &.weekday-1 {
                    > div {
                      color: $red-600;
                    }
                  }

                  > div {
                    width: 48px;
                    padding: 18px 0;
                    height: 56px;
                    @include button-2;
                  }

                  .vc-highlights {
                    .vc-day-layer {
                      .vc-highlight {
                        width: 100%;
                        height: 100%;
                        border-radius: 6px;
                        position: relative;
                        overflow: hidden;
                        outline: none;
                        box-shadow: none;
                        border: 0;
                        z-index: 1;

                        &::after {
                          content: '';
                          display: none;
                          width: 100%;
                          height: 100%;
                          position: absolute;
                          top: 0;
                          left: 0;
                          z-index: -1;
                        }

                        /* Select Style */
                        &.selected-range-start {
                          &::after {
                            display: block;
                            background: $primary-500;
                          }

                          border-radius: 6px 0 0 6px !important;
                        }

                        &.selected-range-base {
                          &::after {
                            display: block;
                            background: $primary-50;
                          }
                        }

                        &.selected-range-end {
                          &::after {
                            display: block;
                            background: $primary-500;
                          }

                          border-radius: 0 6px 6px 0 !important;
                        }

                        /* Drag Style */
                        &.drag-range-start, &.drag-range-end {
                          &::after {
                            display: block;
                            background: $primary-500;
                          }

                          border-radius: 6px;
                        }

                        &.drag-range-base {
                          background: none;
                        }
                      }
                    }
                  }

                  .vc-day-content {
                    border-radius: 6px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: none;

                    &:hover {
                      &::after {
                        background: $gray-200;
                      }
                    }

                    &::after {
                      content: '';
                      display: none;
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      left: 0;
                      top: 0;
                      z-index: -1;
                    }

                    /* Select, Drag Content Style */
                    &.selected-range-content {
                      color: $default-white;
                    }

                    &.drag-range-content {
                      color: $default-white;
                    }
                  }

                  /* badge Style - 향후 개선 필요(date badge)로 인한 주석처리 */
                  /* 해당 클래스 요소는 after, before 모두 사용중이기 때문에 상위 요소에 after 사용 */
                  //&:has(.count-green) {
                  //  width: 100%;
                  //  height:100%;
                  //  position: relative;
                  //  &::after {
                  //    content: '13';
                  //    display: flex;
                  //    align-items: center;
                  //    justify-content: center;
                  //    width: 16px;
                  //    height: 14px;
                  //    position: absolute;
                  //    bottom: 2px;
                  //    background: $green-50;
                  //    border-radius: 8px;
                  //    @include button-5($color: $green-900);
                  //  }
                  //}
                }
              }
            }
          }
        }
      }
    }

    .footer-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 17px 24px;
      border-top: 1px solid $gray-300;

      .left-text-box {
        display: flex;
        align-items: center;

        > p {
          display: flex;
          align-items: center;

          &.text {
            @include body-3($color: $gray-600);

            &::after {
              content: '';
              display: block;
              width: 1px;
              margin: 0 5px;
              padding: 6px 0;
              background: $gray-300;
            }
          }

          &.range {
            @include button-3;
          }

          .end-date {
            margin-left: 4px;
          }
        }
      }

      .right-button-box {
        display: flex;
        align-items: center;

        .inner-button-box {
          display: flex;

          &::before {
            content: '';
            display: block;
            width: 1px;
            margin: 6px 16px;
            background: $gray-300;
          }

          .cancel-btn {
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>
