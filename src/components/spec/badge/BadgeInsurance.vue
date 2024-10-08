<template>
  <span class='badge-insurance' v-if='mapKeyOrValue'>
    {{ text }}
  </span>
</template>

<script setup lang='ts'>
import { InsuranceTypeToShortLabel } from '@/constants'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  mapKeyOrValue?: string,
}>(), {})

const text = computed(() => {
  if (!props.mapKeyOrValue) return ''
  return InsuranceTypeToShortLabel[props.mapKeyOrValue]
})

</script>

<style scoped lang='scss'>
.badge-insurance {
  border-radius: 2px;
  padding: .2rem .4rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  @include caption-1($color: rgba(65, 67, 72, 1));
  background: rgba(241, 240, 240, 1);
  white-space: pre;
}
</style>