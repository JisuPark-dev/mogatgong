<template>
  <span class='badge-type' :class='calcClass' v-if='mapKeyOrValue'>
    {{ text }}
  </span>
</template>

<script setup lang='ts'>
import { ScheduleType, ScheduleLabelToType } from '@/constants'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  mapKeyOrValue?: string,
}>(), {})

const text = computed(() => {
  if (!props.mapKeyOrValue) return ''
  return ScheduleType[props.mapKeyOrValue]
})

const calcClass = computed(() => {
  const myClass = `--${ScheduleLabelToType[text.value]}`
  return {
    [myClass]: true
  }
})
</script>

<style scoped lang='scss'>
.badge-type {
  border-radius: 20px;
  padding: .2rem .8rem;
  height: 2.2rem;
  //width: 3.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  @include caption-1($color: rgba(65, 67, 72, 1));
  white-space: pre;

  &.--DIS {
    background: rgba(254, 164, 174, 1);
  }

  &.--HOM {
    background: rgba(255, 225, 124, 1);
  }

  &.--COM {
    background: rgba(76, 187, 174, 1);
  }

  &.--DIL{
    background: rgba(220,90,121,1);
  }
}
</style>