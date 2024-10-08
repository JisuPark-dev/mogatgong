<template>
  <BFormCheckbox :model-value='modelValue'
                 :id='id'
                 :state='state'
                 :disabled='disabled'
                 :value='value'
                 :uncheckedValue='unCheckedValue'
                 @update:modelValue="emit('update:modelValue', $event)"
                 @input='onInput'
                 @change='onChange'>
    <slot />
  </BFormCheckbox>
</template>

<script setup lang='ts'>
import { BFormCheckbox } from 'bootstrap-vue-next'
import { computed } from 'vue'
import { Iyn } from '@commons/types/Constant'

export type ICheckBox = boolean | Iyn
const props = withDefaults(defineProps<{
    id?: string,
    modelValue?: ICheckBox
    ynMode?: boolean
    disabled?: 'true' | 'false' | '' | boolean,
    state?: 'true' | 'false' | '' | boolean | null
  }>(), {
    id: '',
    modelValue: false,
    ynMode: false,
    disabled: false,
    state: null,
  }
)

const value = computed((): boolean | 'Y' | 'N' => {
  if (props.ynMode) {
    return 'Y'
  }
  return true
})

const unCheckedValue = computed((): boolean | 'Y' | 'N' => {
  if (props.ynMode) {
    return 'N'
  }
  return false
})


const emit = defineEmits<{
  'change': [value: any]
  'input': [value: any]
  'update:modelValue': [value: any]
}>()

function onChange(v: any) {
  emit('change', v)
}

function onInput(v: any) {
  emit('input', v)
}
</script>

<style scoped lang='scss'>
.form-check {
  display: flex;
  align-items: center;
  margin-bottom: 0;
  @include notDrag;

  :deep(input) {
    cursor: pointer;
    margin-top: 0;
    margin-right: 8px;
    transition: all .2s ease-in-out;
    background-position: center center;
  }

  :deep(label) {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    line-height: normal;
    cursor: pointer;
    @include button-4();
  }
}
</style>
