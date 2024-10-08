<template>
  <div class="search">
    <span class="search__label">{{ props.label }}</span>
    <MInput searchMode v-model="modelValue" :deleteBtn="!!modelValue" @delete="() => (modelValue = '')" />
  </div>
</template>

<script setup lang="ts">
import MInput from '@/components/base/MInput.vue'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label: string
  }>(),
  {}
)

const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<style scoped lang="scss">
.search {
  white-space: nowrap;
  border-radius: 6px;
  border: 1px solid #d6d9dd;
  display: flex;

  &__label {
    border-right: 1px solid #d6d9dd;
    padding: 0.8rem;
    @include button-4(#707378);
  }

  :deep(.input-wrap.search-wrap) {
    border: none;
    padding: 0 1rem;
    height: 100%;
  }

  :deep(.input-default) {
    & > form {
      height: 100%;
    }
  }
}
</style>