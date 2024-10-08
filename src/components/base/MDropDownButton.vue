<template>
  <div
    :class="[
      { 'placeholder-effect': modelValue === placeholderIdx },
      { 'select-fill': selectFillMode }
    ]"
    class="drop-btn-wrap"
  >
    <MButton
      :variant="'none'"
      :class="variant"
      :disabled="disabled"
      class="dropDownBtn"
      @click="onClickBtn"
      @keydown="onKeydown"
      @focusout="onFocusout"
    >
      <MIcon
        v-if="btnIcon"
        :icon="icName"
        :ml="icMl"
        :mr="icMr"
        :width="icWidth"
        :height="icHeight"
        :pathFill="disabled ? '$gray-300' : icColor"
      />
      <div v-if="!onlyIc" class="left text-area">
        <span v-if="valAddText !== ''" class="addText">{{ valAddText }}</span>
        {{ options[modelValue] }}
      </div>
      <div class="right arrow-area">
        <MIcon
          :icon="'ic_chevron_down_bold'"
          :class="{ active: dropDownShow }"
          :width="10"
          :height="10"
          :pathFill="arrowBlack ? '$gray-600' : selectFillMode ? '$primary-500' : '$gray-600'"
        />
      </div>
    </MButton>
    <div class="drop-btn-wrap__dropdown-wrap">
      <MDropDown
        v-if="dropDownShow"
        :min-cursor="0"
        v-model:model-value="dropDownVal"
        v-model:model-cursor="dropDownCursor"
        @click="onClickDropDown"
        @delete="(value, idx) => emit('delete', value, idx)"
        :fit-list="fitList"
        :direction="direction"
        :maxHeight="maxHeight"
        :options="options"
        :listBottomBorder="listBottomBorder"
        :disabled="listDisabled"
        :is-checked="isChecked"
        :is-btn-x="isBtnX"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import MDropDown, { type Direction } from '@/components/base/MDropDown.vue'
import MIcon from '@/components/base/MIcon.vue'
import MButton from '@/components/base/MButton.vue'

export type MDropDownBtnType = 'default' | 'sort'
const props = withDefaults(
  defineProps<{
    variant?: MDropDownBtnType
    placeholderIdx?: number
    disabled?: boolean
    btnIcon?: boolean
    icName?: string
    icWidth?: number
    icHeight?: number
    icMr?: number
    icMl?: number
    icColor?: string
    modelValue?: number
    options?: string[]
    listDisabled?: number[]
    listBottomBorder?: boolean
    isChecked?: boolean
    isBtnX?: boolean
    maxHeight?: number
    fitList?: boolean
    valAddText?: string
    selectFillMode?: boolean
    direction?: Direction
    onlyIc?: boolean
    background?: string
    border?: string
    text?: string
    arrowBlack?: boolean
  }>(),
  {
    variant: 'default',
    placeholderIdx: undefined,
    disabled: false,
    btnIcon: false,
    icName: '',
    icWidth: 16,
    icHeight: 16,
    icColor: '',
    icMr: 0,
    icMl: 0.8,
    modelValue: 0,
    options: () => [],
    listDisabled: () => [],
    listBottomBorder: false,
    isChecked: false,
    isBtnX: false,
    fitList: false,
    valAddText: '',
    selectFillMode: false,
    direction: 'left',
    onlyIc: false,
    background: '#EBF2FF',
    border: '0px',
    text: '#347BF6',
    arrowBlack: false
  }
)

function onClickBtn() {
  dropDownShow.value = !dropDownShow.value
}

function onClickDropDown() {
  emit('update:modelValue', dropDownVal.value)
  emit('change', props.options[dropDownVal.value], dropDownVal.value)
  dropDownShow.value = false
}

function onFocusout() {
  dropDownShow.value = false
}

const dropDownShow = ref(false)
const dropDownVal = ref(props.modelValue)
const dropDownCursor = ref(props.modelValue)
const emit = defineEmits<{
  'update:modelValue': [value: number]
  change: [value: string, idx: number]
  delete: [value: string, idx: number]
  close: [value: string, idx: number]
}>()

function onKeydown(e: KeyboardEvent) {
  if (dropDownShow.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      dropDownCursor.value += 1
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      dropDownCursor.value -= 1
    } else if (e.key === 'Enter') {
      dropDownVal.value = dropDownCursor.value
      emit('update:modelValue', dropDownVal.value)
    }
  }
}

watch(
  () => props.modelValue,
  (value) => {
    dropDownVal.value = value
  }
)
</script>

<style lang="scss" scoped>
.drop-btn-wrap {
  --background: v-bind(background);
  --border: v-bind(border);
  --text: v-bind(text);
  height: fit-content;

  &__dropdown-wrap {
    position: relative;
  }

  // placeholder, disabled text 효과
  &.placeholder-effect {
    .btn {
      .left {
        color: $gray-400 !important;
      }
    }
  }

  &:disabled {
    color: $gray-400 !important;
  }

  // select - fill 효과
  &.select-fill {
    .dropDownBtn {
      background: var(--background) !important;
      border: var(--border) !important;

      :deep(.btn-content) {
        .text-area {
          color: var(--text) !important;

          .addText {
            color: $primary-500;
          }
        }
      }
    }
  }

  .dropDownBtn {
    // variant - default
    width: 100%;
    height: 3.2rem;
    display: flex;
    align-content: center;
    border: 0.1rem solid $gray-300;
    border-radius: 0.6rem;
    padding: 0.7rem 0.4rem;
    box-sizing: border-box;

    &::after {
      border-radius: 0.6rem;
    }

    // variant - sort
    &.sort {
      min-width: unset;
      border-color: transparent;
      width: fit-content;
      height: 2.4rem;
      padding: 0.4rem 0.6rem;

      :deep(.btn-content) {
        .left {
          max-width: unset;
          padding-left: 0;
          margin-right: 0.4rem;
          @include button-4();
        }

        .right {
          position: relative;
          padding-right: 0;
        }
      }
    }

    // 공용 효과 css(DropDown)
    &:active {
      border: 1px solid $gray-300;
    }

    // FOCUS 효과 주석 처리 - aiden
    //&:focus {
    //  border-color: $primary-500;
    //  box-shadow: 0px 0px 0px 2px $primary-100;
    //}
    :deep(.icon) {
      transition: all 0.2s ease-in-out;

      &.active {
        transform: rotate(180deg);
      }
    }

    :deep(.btn-content) {
      width: 100%;
      display: flex;
      align-items: center;

      .left {
        max-width: calc(100% - 1.8rem);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        align-content: center;
        line-height: normal;
        padding-left: 0.4rem;
        margin-right: 0.4rem;
        @include button-3();
      }

      .right {
        position: absolute;
        right: 0;
        padding-right: 0.8rem;
      }
    }
  }
}
</style>