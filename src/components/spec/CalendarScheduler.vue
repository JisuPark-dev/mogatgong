<template>
  <div class='scheduler-calendar-wrap'>
    <header class='scheduler-calendar-wrap__header'>
      <span class='scheduler-calendar-wrap__title'>{{ title }}</span>
      <MButton class='scheduler-calendar__today-btn' scale='xxs' variant='outline-gray-text' @click='goToday'>오늘</MButton>
    </header>
    <div class="scheduler-calendar__body">
      <MButton @click='prev'>
        <MIcon icon='ic_chevron_left_bold' :width='15' :height='15' pathFill='rgba(112, 115, 120, 1)' />
      </MButton>

      <Calendar
        ref='calendarRef'
        class='scheduler-calendar'
        isExpanded
        disablePageSwipe
        :attributes='attributes'
        @dayclick='onClickDay'
        view='weekly'
        borderless
      >

      <template v-slot:header='{}' />
      <template v-slot:header-title='{}' />
      <template v-slot:header-prev-button='{ move }'>
        <div @click='move' />
      </template>
      <template v-slot:header-next-button='{ move }'>
        <div @click='move' />
      </template>
      <template v-slot:nav-prev-button='{}' />
      <template v-slot:nav-next-button='{}' />
      </Calendar>
      <MButton @click='next'>
        <MIcon icon='ic_chevron_right_bold' :width='15' :height='15' pathFill='rgba(112, 115, 120, 1)' />
      </MButton>
    </div>
  </div>
</template>
<script setup lang='ts'>
import { Calendar } from 'v-calendar'
import { refs } from '@/utils/refs'
import { computed } from 'vue'
import MButton from '@/components/base/MButton.vue'
import type { CalendarDay } from 'v-calendar/dist/types/src/utils/page.d.ts'
import type { Attribute } from 'v-calendar/dist/types/src/utils/attribute.d.ts'
import moment from 'moment'
import MIcon from '@/components/base/MIcon.vue'

const calendarRef = refs(Calendar)
const props = withDefaults(
  defineProps<{
    items?: Partial<Attribute>[]
  }>(),
  {
    items: () => []
  }
)

const model = defineModel({
  default: ''
})

const title = computed(() => {
  const date = moment(model.value);
  return date.format('MM월 D일 dddd'); // 'dddd'는 요일을 나타냅니다.
});


const today = moment()
const attributes = computed(() => {
  // 현재 날짜에 highlight를 주고 받은 값이랑 합쳐서 달력에 라벨을 표시한다.
  return [
    ...props.items,
    {
      highlight: {
        color: '#347BF6',
        fillMode: 'solid',
      },
      dates: model.value
    }
  ]
})

const moveWeeklyCalendar = (page: number) => {
  // view: weekly의 경우 props.date에 따라 자동으로 페이지 이동이 안되어 수동으로 이동시킨다.
  return calendarRef.value?.moveBy(page)
}

const prev = () => {
  const nextDate = moment(model.value)
  nextDate.subtract(1, 'week')
  model.value = nextDate.format('YYYY-MM-DD')
  moveWeeklyCalendar(-1)
}

const next = () => {
  const nextDate = moment(model.value)
  nextDate.add(1, 'week')
  model.value = nextDate.format('YYYY-MM-DD')
  moveWeeklyCalendar(1)
}

const onClickDay = (day: CalendarDay) => {
  const nextDate = moment(new Date(day.year, day.month - 1, day.day))
  model.value = nextDate.format('YYYY-MM-DD')
}

const goToday = () => {
  model.value = today.format('YYYY-MM-DD')
  calendarRef.value?.move(today.toDate())
}
</script>
<style lang='scss'>
.scheduler-calendar-wrap {
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 16px;
  }

  &__title {
    text-align: center;
    @include button-2($color: $gray-900);
  }
}

.scheduler-calendar {
  margin-bottom: .5rem;
  width: 100%;
  height: 100%;
  font-family: inherit;
  @include button-2;

  &__body{
    display: flex;
    align-items: center;
  }

  .vc-arrow,
  .vc-title {
    background: transparent;
    @include sub-title-1;
  }

  .vc-weeks {
    padding: 0;
    height: 100%;
  }

  .vc-weekday {
    padding: 0;
    height: 3.6rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: $gray-700;
    @include button-3;

    &:first-of-type {
      color: $red-500;
    }
  }

  .weekday-position-1 {
    color: $red-500;
  }

  .vc-day-box-center-center {
    align-items: flex-start;
  }

  .vc-day {
    min-height: 3.8rem;
  }

  .vc-highlight, .vc-day-content{
    border-radius: 4px;
  }
  .vc-highlight{
    background-color: #347BF6;
  }

  .vc-header {
    margin: .2rem 0 2.4rem 0;
  }
  .vc-dots{
    span{
      width: 8px;
      height: 8px;
    }
  }

  .day {
    overflow: hidden;
    height: 100%;
  }

  .vc-header {
    display: none;
  }
}
</style>