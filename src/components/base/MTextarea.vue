<template>
  <div class="textarea-box"
       :class="{'error' : validate}">
    <BFormTextarea ref="textarea"
                     :model-value="modelValue"
                     :placeholder="placeholder"
                     :rows="rows"
                     :max-rows="maxRows"
                     :maxlength="limitCnt"
                     :no-resize="'true'"
                     @update:modelValue="emit('update:modelValue',$event)"
                     @focusin="emit('focusin', $event)"
                     @focusout="emit('focusout')"
                     @input="emit('input',$event)"
                     @keyup="emit('keyup',$event)"
                     @keydown="emit('keydown',$event)"
                     @blur="onBlur"
                     @click="onClick"/>
    <p v-if="showLimit"
       class="count-wrap">
      {{ valCnt }} / {{ limitCnt }}
    </p>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {refs} from "@/utils/refs.ts";
import {BFormTextarea} from "bootstrap-vue-next";

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  rows?: number
  maxRows?: number
  limitCnt?: number
  showLimit?: boolean
  validate?: boolean
}>(), {
  modelValue: '',
  placeholder: '',
  rows: 3,
  maxRows: 6,
  limitCnt: -1,
  showLimit: false,
  validate: false
})

const valCnt = computed<number>(() => {
  return (props.modelValue?.length || 0)
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [value: FocusEvent]
  'focusin': [value: any]
  'focusout': []
  'keyup': [value: KeyboardEvent]
  'keydown': [value: KeyboardEvent]
  'blur': []
  'change:cursor': [value: number]
  'click': [value: any]
}>()

function onBlur(){
  emit('blur')
}

function blur(){
  textarea.value?.blur()
}

function focus() {
  textarea.value?.focus();
}

function onClick(e: any) {
  emit('click', e);
  emit('change:cursor', textarea.value?.$el.selectionStart)
}

const textarea = refs(BFormTextarea)

defineExpose({
  blur,
  focus
})

</script>

<style scoped lang="scss">
.textarea-box {
  padding: 5px 8px;
  background: $default-white;
  border-radius: 6px;
  border: 1px solid $gray-300;
  transition: all .15s ease-in-out;
  &:focus-within {
    border-color: $primary-500;
    box-shadow: 0 0 0 2px $primary-100;
  }

  &.error {
    &:focus-within {
      border-color: $red-600;
      box-shadow: none;
    }
  }

  textarea {
    padding: 0;
    overflow-y: auto !important;
    border: 0;
    border-radius: unset;
    @include body-3;

    &::placeholder {
      color: $gray-500;
    }

    &:focus {
      box-shadow: none;
    }
  }

  .count-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
    @include caption-1($color: $gray-500);
  }
}
</style>
