<template>
  <span class='badge-schedule-history' :class='classNameForType'>
    {{ text }}
  </span>
</template>

<script setup lang='ts'>
import { computed } from 'vue'
import moment from 'moment'

const props = withDefaults(defineProps<{
  // YYYY-MM-DD 와 같은 형태의 Date로 변환가능한 문자열
  value?: string,
  type?: string
}>(), {})

const text = computed(() => {
  if (!props.value) return ''
  return moment(props.value).format('MM.DD')
})

const classNameForType = computed(() => {
  if (!props.type) return ''
  return `--${props.type}`
})

</script>

<style scoped lang='scss'>
.badge-schedule-history {
  border-radius: 4px;
  padding: .4rem .5rem;
  height: 2.4rem;
  @include caption-2;
  display: inline-block;
  white-space: pre;

  &.--DN {
    background: rgba(231, 243, 248, 1);
    color: rgba(51, 126, 169, 1);
  }

  &.--NO {
    background: rgba(237, 243, 236, 1);
    color: rgba(68, 131, 97, 1);
  }
}
</style>