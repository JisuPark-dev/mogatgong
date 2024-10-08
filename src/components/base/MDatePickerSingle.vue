<!--

  참조: https://vcalendar.io/datepicker/basics.html#date-mode
  >> 향후 MDatePicker 컴포넌트 대체용(Jay 작업 예정) / 완료후 해당 주석 삭제 요청

-->

<template>
  <div class='date-picker-wrap'
       ref='datePickerWrap'>
    <DatePicker ref='datePicker'
                class='date-picker'
                v-model='date'
                :mode='mode'
                :trim-weeks='trim'
                :select-Attribute='selectAttribute'
                :attributes='attributes'
                :rows='rows'
                :columns='columns'
                :masks='{ title: titleFormat }'
                :disabled-dates='disabledDates'
                :min-date='minDate'
                :max-date='maxDate'
                :min-page='{ year: minPageYear, month: minPageMonth }'
                @update:pages='update'
                @dayclick='onClick'
                @popover-will-show='willShow'
                @popover-did-show='didShow'
                @popover-will-hide='willHide'
                @popover-did-hide='didHide'>
      <!--calendar toggle 버튼-->
      <template #default='{ togglePopover }'>
        <MButton class='popover-btn'
                 ref='toggleButton'
                 :scale="'xs'"
                 :class="{'calendar-active' : btnActive, 'dateActive': date }"
                 @click="togglePopover({placement:placement, modifiers: [{name:'flip', options: { fallbackPlacements:[fixedPlacement] } }]})">
          <MIcon :icon="'ic_calender_bold'"
                 :width='16'
                 :height='16'
                 :mr='.8'
                 :ml='0'
                 :pathFill='icColor' />
          <span class='inner-text'>{{ modelValue ? moment(modelValue).format(props.writeFormat) : placeholder }}</span>
          <MIcon class='chevron-icon'
                 :class="{'active' : btnActive, 'dateActive': date }"
                 :icon="'ic_chevron_down_bold'"
                 :width='10'
                 :height='10'
                 :pathFill="'$gray-600'" />
        </MButton>

      </template>
      <!-- Calendar Header -->
      <!--왼쪽 swipe 버튼-->
      <template #header-prev-button>
        <span class='move-button'>
          <MIcon :icon="'ic_chevron_left_bold'"
                 :width='16'
                 :height='16'
                 :pathFill="'$gray-600'" />
        </span>
      </template>
      <!--Calendar title-->
      <template #header-title='{ title }'>
        <div class='header-title'
             :class="{ 'active' : titleActive }">
          <span class='title'>{{ title }}</span>
          <!--          <MIcon :icon="'ic_chevron_down_bold'"-->
          <!--                 :width="12"-->
          <!--                 :height="12"-->
          <!--                 :pathFill="'$gray-500'" />-->
        </div>
      </template>
      <!--오른쪽 swipe 버튼-->
      <template #header-next-button>
        <span class='move-button'>
          <MIcon :icon="'ic_chevron_right_bold'"
                 :width='16'
                 :height='16'
                 :pathFill="'$gray-600'" />
        </span>
      </template>

      <!-- Calendar Nav Header -->
      <!--      <template #nav-prev-button>-->
      <!--        <span class="move-button">-->
      <!--          <MIcon :icon="'ic_chevron_left_bold'"-->
      <!--                 :width="16"-->
      <!--                 :height="16"-->
      <!--                 :pathFill="'$gray-600'"/>-->
      <!--        </span>-->
      <!--      </template>-->
      <!--      <template #nav-next-button>-->
      <!--        <span class="move-button">-->
      <!--          <MIcon :icon="'ic_chevron_right_bold'"-->
      <!--                 :width="16"-->
      <!--                 :height="16"-->
      <!--                 :pathFill="'$gray-600'"/>-->
      <!--        </span>-->
      <!--      </template>-->
      <template #footer>
        <div class='w-full px-4 pb-3'>
          <button class='moveTodayBtn'
                  @click='moveToday'>
            오늘
          </button>
        </div>
      </template>
    </DatePicker>
  </div>
</template>

<script setup lang='ts'>
import { DatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { type DateModes } from 'v-calendar/dist/types/src/use/datePicker.d.ts'
import { computed, onMounted, ref } from 'vue'
import { type Page } from 'v-calendar/dist/types/src/utils/page.d.ts'
import { refs } from '@/utils/refs'
import moment from 'moment'
import { type CalendarDay } from 'v-calendar/dist/types/src/utils/page.d.ts'
import MIcon from '@/components/base/MIcon.vue'
import MButton from '@/components/base/MButton.vue'
import type { DatePickerDate } from 'v-calendar/dist/types/src/use/datePicker.d.ts'
import type { HighlightFillMode } from 'v-calendar/dist/types/src/utils/glyph.d.ts'

export type DateObj = {
  start: string,
  end: string
}
export type Content = {
  description: string,
  isComplete: false,
}
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

/*
* Types
* */
export type PlacementPosition =
  'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end'
  | 'right-start'
  | 'right-end'
  | 'left-start'
  | 'left-end'

/* props */
const props = withDefaults(defineProps<{
  writeFormat?: string,
  mode?: DateModes,
  placeholder?: string,
  disabledDates?: string,
  minDate?: string,
  maxDate?: string,
  minPageYear?: number,
  minPageMonth?: number,
  icColor?: string,
  titleFormat?: string,
  trim?: boolean,
  rows?: number,
  columns?: number,
  contentName?: string,
  dotColor?: string,
  visibility?: 'click' | 'hover' | 'hover-focus' | 'focus',
  placement?: PlacementPosition,
  fixedPlacement?: PlacementPosition,
}>(), {
  writeFormat: 'YYYY. M. D (dd)',
  mode: 'date',
  placeholder: '날짜 선택',
  minDate: moment(new Date()).format('YYYY-MM-DD'),
  maxDate: moment(new Date()).add(25, 'years').format('YYYY-MM-DD'),
  minPageYear: new Date().getFullYear(),    //오늘 날짜 유동적으로 변환하기 위해 new Date() 사용
  minPageMonth: new Date().getMonth() + 1,      //오늘 날짜 유동적으로 변환하기 위해 new Date() 사용
  visibility: 'click',
  placement: 'bottom-start',
  fixedPlacement: 'bottom-start',
  icColor: '$gray-500',
  dotColor: 'transparent',
  titleFormat: 'YYYY년 MMMM',
  trim: true,
  rows: 1,
  columns: 1
})
onMounted(async () => {
})
/*
* emit
* */
const emit = defineEmits<{
  'change': [value: string]
  'update:pages': [value: Page[]]
  'click': [value: any]
  'didHide': [value: HTMLElement]
  'willShow': [value: HTMLElement]
  'didShow': [value: HTMLElement]
  'willHide': [value: HTMLElement]
}>()

const date = defineModel({
  set(v) {
    if (v) {
      const value = moment(v).format('YYYY-MM-DD')
      emit('change', value)
      return value
    }
    return v
  },
  default: moment().format('YYYY-MM-DD')
})

const datePicker = refs(DatePicker)

/* DatePicker 에서 전달받은 데이터 저장 변수 */
let DateObject = ref<Page[]>([])

/* v-calendar css용 변수 */
const btnActive = ref(false)
const titleActive = ref(false)

/* v-calendar Props */
// 1. Select Date
const selectAttribute = ref<ContentConfig>({
  content: {
    class: 'select-date'
  },
  highlight: {
    class: props.contentName ? props.contentName : 'none-highlight',
    contentClass: `${props.contentName ? props.contentName : 'none'}-highlight-content`
  },
  dot: {
    style: {
      backgroundColor: props.dotColor
    },
    class: [`dot-color-${props.dotColor}`, 'select-dot']
  },
  dates: date.value
})

// 2. Default Date (현재는 오늘 날짜만 표시되나, 차후 computed 사용하여 content date 추가 가능
const attributes = ref<ContentConfig[]>([
  {
    content: {
      class: 'default-date-content'
    },
    dot: {
      class: 'default-date-dot'
    },
    dates: new Date()
  }
])


/*
* methods
* */
function update(item: Page[]) {
  DateObject.value = item
  emit('update:pages', item)
}

function willHide(el: HTMLElement) {
  emit('willHide', el)
}

function didHide(el: HTMLElement) {
  btnActive.value = false
  emit('didHide', el)
}

function willShow(el: HTMLElement) {
  btnActive.value = true
  emit('willShow', el)
}

function didShow(el: HTMLElement) {
  emit('didShow', el)
}

function onClick(day: CalendarDay) {
  emit('click', day)
}

function moveToday() {
  datePicker.value?.move(new Date())
  datePicker.value?.hidePopover()
  emit('update:modelValue', moment().format('YYYY-MM-DD'))
}

</script>

<style lang='scss' scoped>
.date-picker-wrap {
  :deep(.popover-btn) {
    width: 100%;
    padding: .7rem 1.1rem .7rem .8rem;
    border: .1rem solid $gray-300;
    position: relative;

    &.active {
      &::after {
        display: block;
        background: $scrim-7;
      }
    }

    &:active {
      border: .1rem solid $gray-300;
    }

    &.dateActive {
      background: $default-white;

      .btn-content {
        .inner-text {
          color: $gray-900 !important;
        }
      }
    }

    > .btn-content {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: flex-start;

      .inner-text {
        white-space: nowrap;
        @include button-3;
      }

      .chevron-icon {
        margin-left: auto !important;
        transform: rotate(0);

        &.active {
          transform: rotate(180deg);
          transition: all 0.2s ease-in-out; //툭 하고 빠지는게 나을지...
        }
      }
    }
  }

  > :deep(div) {
    > div {
      margin-top: .4rem;

      //calendar
      .date-picker {
        min-width: 32rem;
        max-width: 32rem;
        position: relative;
        //오늘로 이동한 경우
        &.same-content-date {
          .default-date-content {
            background: $primary-500 !important;
            color: $default-white !important;
          }

          .default-date-dot {
            background: $default-white !important;
          }

          .select-dot {
            display: none;
          }
        }

        .vc-pane-container {
          padding: 1.6rem;

          .vc-pane-header-wrapper {
            position: absolute;
            top: 1.6rem;
            width: calc(100% - 3.2rem);
          }
        }

        .vc-pane-layout {
          .vc-pane {
            .vc-title {
              padding: 0;
              position: relative;
              pointer-events: none;
              z-index: 1;

              &.active {
                &::after {
                  display: block;
                  background: $scrim-10;
                }
              }

              .header-title {
                display: flex;
                align-items: center;
                width: 100%;
                height: 100%;
                padding: .4rem 1.2rem;
                @include sub-title-1($weight: 700);

                > span {
                  margin-right: .8rem;
                }
              }
            }

            .vc-weeks {
              padding: 3.2rem 0 0;
              border-radius: .4rem;

              .vc-weekday {
                @include button-3;
              }

              .vc-day {
                position: relative;
                width: 4rem;
                height: 4rem;

                &:has(.select-date) {
                  .default-date-dot {
                    margin-right: 0;
                    background: $default-white !important;
                  }

                  .select-dot {
                    display: none;
                  }
                }

                &.in-prev-month {
                  .vc-day-content {
                    opacity: 1;
                    color: $gray-300;
                  }
                }

                &.in-next-month {
                  .vc-day-content {
                    color: $gray-300;
                  }
                }

                .vc-day-content {
                  width: 100%;
                  height: 100%;
                  border-radius: .4rem;
                  overflow: hidden;
                  @include button-2;
                  position: relative;

                  &::after {
                    content: '';
                    display: none;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                  }

                  &:hover {
                    background: none;

                    &::after {
                      display: block;
                      background: $scrim-5;
                    }
                  }

                  &:active {
                    background: none;

                    &::after {
                      display: block;
                      background: $scrim-10;
                    }
                  }

                  // attribute style
                  &.default-date-content {
                    color: $primary-500;
                  }

                  &.select-date {
                    color: $default-white;
                    background: $primary-500;
                  }

                  &.vc-disabled {
                    color: $gray-500;
                    pointer-events: none;
                  }
                }

                .vc-day-layer {
                  &:has(.default-date-dot) {
                    align-items: flex-start;
                    padding-top: 6px;

                    .default-date-dot {
                      &:last-child {
                        margin-right: 0;
                      }

                      background: $primary-500;
                    }
                  }
                }
              }
            }
          }
        }

        .w-full {
          margin-top: .8rem;
          padding: 0 !important;

          .moveTodayBtn {
            width: 100%;
            padding: .7rem 0;
            border: .1rem solid $gray-300;
            border-radius: .6rem;
            @include button-3($color: $gray-600)
          }
        }

        .vc-header {
          height: unset;
          margin: 0;
          padding: 0;
        }
      }

      //calendar - nav
      .vc-popover-content-wrapper {
        height: 100%;
        transform: unset !important;

        .vc-nav-popover-container {
          min-width: 32rem;
          max-width: 32rem;
          height: 100%;
          padding: 1.6rem;
          margin: 0;
          border: 0;
          background: $default-white;

          .vc-nav-container {
            .vc-nav-header {
              button {
                @include sub-title-1($weight: 700);

                &.vc-nav-title {
                  padding: .4rem 1.2rem;
                }
              }
            }

            .vc-nav-items {
              margin-top: 26px;
              grid-gap: 1px;
              border: 1px solid $gray-200;
              background: $gray-200;

              .vc-nav-item {
                width: 100%;
                padding: 1.5rem 2.8rem;
                background: $default-white;
                border-radius: 0;
                @include h5-title;
                position: relative;

                &.is-active {
                  background: $primary-500;
                  color: $default-white;
                }

                &::after {
                  content: '';
                  display: block;
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  top: 0;
                  left: 0;
                }

                &:hover {
                  &::after {
                    background: $scrim-5;
                  }
                }

                &:active {
                  &::after {
                    background: $scrim-10;
                  }
                }

                &:disabled {
                  opacity: unset;
                  color: $gray-300;
                }
              }
            }
          }
        }
      }

      //기본 스타일 제거, 공통 스타일 추가
      .vc-popover-caret {
        display: none;
      }

      button {
        width: unset;
        height: unset;
        background: none;
        //&:disabled {
        //  opacity: $scrim-3;
        //}
        &.is-active {
          background: $primary-500;
          box-shadow: none;
        }

        .move-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 3.2rem;
          height: 3.2rem;
          border-radius: .4rem;
        }

        &:hover {
          opacity: unset;
          background: $scrim-5;
        }

        &:active {
          background: $scrim-10;
        }
      }

      :focus-within {
        box-shadow: none;
      }
    }
  }
}
</style>
