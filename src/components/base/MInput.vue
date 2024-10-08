<template>
  <div class="input-default"
       :class="{'input-expand':isLimitText}">
    <p v-if="title.length"
       class="input-title">{{ title }}<span v-if="necessary" class="necessary"> *</span></p>
    <BForm @submit="$event.preventDefault()">
      <div class="input-wrap"
           :class="{'search-wrap': searchMode, 'delete-btn' : deleteBtn}">
        <MIcon v-if="searchMode"
               :icon="'ic_magnifyingglass_fill'"
               :pathFill="'$gray-500'"
               :width="16"
               :height="16" />
        <BFormInput ref="input"
                      :placeholder="placeholder"
                      :type="type"
                      :min="minNumber"
                      :max="maxNumber"
                      :readonly="readonly"
                      :disabled="disabled"
                      :state="state"
                      :isLimitText="isLimitText"
                      :maxlength="limitCnt"
                      autocomplete="off"
                      v-model="data"
                      :class="{'fill' : fill, 'error' : validate }"
                      @input="onInput"
                      @enter="onEnter"
                      @keyup="onKeyup"
                      @keydown="onKeydown"
                      @click="onClick"
                      @blur="onBlur"
                      @update="onUpdate"
                      @change.native="onChange"
                      @focusin="onFocusin"
                      @focusout="onFocusout"/>
        <MIcon v-if="deleteBtn"
               :class="{'delete-icon' : data.length}"
               :icon="'ic_xmark_circle_fill'"
               :pathFill="'$gray-500'"
               :width="14"
               :height="14"
               @click="() => { emit('delete'); data = '' }"/>
      </div>
    </BForm>
    <p v-if="isLimitText"
       class="text-count">{{ modelValue?.length ?? 0 }}/{{ limitCnt }}</p>
    <p class="error-text" v-if="validate && invalidText">{{ invalidText }}</p>
  </div>
</template>
<script setup lang="ts">
import {BFormInput, BForm, type InputType} from "bootstrap-vue-next";
import {refs} from "@/utils/refs";
import {computed} from "vue";
import MIcon from "@/components/base/MIcon.vue";

const input = refs(BFormInput);

const props = withDefaults(defineProps<{
  modelValue?: string
  pattern?: string
  placeholder?: string
  type?: InputType
  fill?: boolean
  minNumber?: number
  maxNumber?: number
  readonly?: boolean
  disabled?: boolean
  state?: 'true' | 'false' | '' | boolean | null
  isLimitText?: boolean
  limitCnt?: number
  maxLength?: number
  validateRule?: (value: string) => string
  validate?: boolean
  invalidText?: string
  title?: string
  necessary? : boolean
  searchMode?: boolean
  deleteBtn?: boolean
}>(), {
  modelValue: '',
  placeholder: '',
  type: 'text',
  fill: false,
  minNumber: 0,
  readonly: false,
  disabled: false,
  state: null,
  isLimitText: false,
  limitCnt: -1,
  maxLength: -1,
  validate: false,
  title: '',
  necessary: false,
  searchMode: false,
  deleteBtn: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [value: any]
  'enter': [value: any]
  'keyup': [value: KeyboardEvent]
  'keydown': [value: KeyboardEvent]
  'blur': [value: any]
  'click': [value: any]
  'change': [value: any]
  'update': [value: any]
  'focusout': [value: any]
  'focusin': [value: any]
  'formatter': [value:any, e:any]
  'delete': []
}>()

const data = computed({
  get() {
    return props.modelValue;
  },
  set(newVal) {
    emit('update:modelValue', newVal);
  }
})

function onInput(v: any) {
  emit('input', v);
}

function onEnter(v: any) {
  emit('enter', v);
}

function onKeyup(v: any) {
  emit('keyup', v);
}

function onKeydown(v: any) {
  emit('keydown', v);
}

function onBlur(v: any) {
  emit('blur', v);
}

function onClick(v: any) {
  emit('click', v);
}

function onChange(v: any) {
  emit('change', v);
}

function onUpdate(v: any) {
  emit('update', v);
}

function onFocusout(v: any) {
  emit('focusout', v);
}

function onFocusin(v: any) {
  emit('focusin', v);
}

function focus() {
  input.value?.focus();
}

function blur() {
  input.value?.blur();
}

// function formatter(value: any, e?:any) {
//   if (props.validateRule) {
//     e.target.value = props.validateRule(value);
//     return props.validateRule(value);
//   }
//   return defaultRule(value, e);
// }
//
// function defaultRule(value: string, e?:any) {
//   if (props.maxLength !== -1 && value?.length > props.maxLength) {
//     value = value.substring(0, props.maxLength);
//   }
//   e.target.value = value;
//   return value;
// }

defineExpose({
  focus,
  blur
})

</script>

<style scoped lang="scss">
input {
  // Default(line)
  border: .1rem solid $gray-300;
  background: $default-white;
  box-sizing: border-box;
  padding: .5rem .8rem;
  border-radius: .6rem;
  @include body-3($line-height: normal);
  &:focus {
    border-color: $primary-500;
    box-shadow: 0 0 0 .2rem $primary-100;
  }
  &::placeholder {
    color: $gray-500;
  }
  &:disabled {
    border-color: $gray-200;
    color: $gray-400;
    background: $default-white;
    cursor: no-drop;
    &::placeholder {
      color: $gray-400;
    }
  }
  // Fill
  &.fill {
    border-color: transparent;
    background: $gray-100;
    &:focus {
      border-color: $primary-500;
      box-shadow: 0px 0px 0px 2px $primary-100;
      background: $default-white;
    }
    &:disabled {
      color: $gray-400;
      background: $gray-50;
      cursor: no-drop;
      &::placeholder {
        color: $gray-400;
      }
    }
  }

  &.error {
    &:focus {
      border-color: $red-600;
      box-shadow: none;
    }
  }
}

.input-default {
  width: 100%;

  /* error text 생성 시 input 위치 재조정 */
  &:has(.error-text) {
    .text-count {
      top: calc(50% - 1.3rem);
    }
  }

  /* title text */
  .input-title {
    margin-bottom: .8rem;
    @include button-3($color: $gray-700);

    .necessary {
      color: $red-600;
    }
  }

  /* error text */
  .error-text {
    margin-top: 8px;
    @include caption-1($color: $red-600);
  }

  /* 검색 모드 search icon + delete icon */
  .search-wrap, .delete-btn {
    display: flex;
    align-items: center;
    padding: 0 1rem;
    height: 100%;
    border: .1rem solid $gray-300;
    border-radius: .6rem;
    background: $default-white;
    box-sizing: border-box;

    &.delete-btn {
      padding-left: 0;

      .delete-icon {
        cursor: pointer;
      }
    }

    input {
      border: 0;
      background: none;
      &:focus {
        box-shadow: none;
      }
    }

    &:focus-within {
      border: .1rem solid $primary-500;
      box-shadow: 0 0 0 .2rem $primary-100;
    }
  }
}

.input-expand {
  position: relative;

  input {
    padding-right: 7.5rem;
  }

  .text-count {
    position: absolute;
    top: 50%;
    right: 1rem;
    transform: translateY(-50%);
    @include caption-1($color: $gray-500);
  }
}
</style>
