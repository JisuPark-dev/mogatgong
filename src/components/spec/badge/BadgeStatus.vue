<template>
  <span class='badge-status' :class='calcClass' v-if='mapKeyOrValue'>
    <span class='badge-status__status-circle' />
    {{ text }}
  </span>
</template>

<script setup lang='ts'>
import {
  ScheduleStatusLabelToType,
  ScheduleStatusType
} from '@/constants'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  mapKeyOrValue?: string,
}>(), {})

const text = computed(() => {
  if (!props.mapKeyOrValue) return ''
  return ScheduleStatusType[props.mapKeyOrValue]
})
const calcClass = computed(() => {
  const myClass = `--${ScheduleStatusLabelToType[text.value]}`
  return {
    [myClass]: true
  }
})
</script>

<style scoped lang='scss'>
.badge-status {
  padding: .2rem .8rem;
  border-radius: 20px;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: pre;

  &.--ING {
    color: rgba(21, 82, 194, 1);
    background: rgba(235, 242, 255, 1);
  }

  &.--END {
    color: rgba(65, 67, 72, 1);
    background: rgba(232, 234, 237, 1);
  }

  &__status-circle {
    margin-right: .2rem;
    width: .6rem;
    height: .6rem;
    border-radius: 50%;
    background: currentColor;
  }
}
</style>