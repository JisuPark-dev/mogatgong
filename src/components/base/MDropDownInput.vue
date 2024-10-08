<template>
  <div class='write-area'>
    <div v-if='inputIcon'
         class='icon-box'
         @click='onIconClick'>
      <MIcon :icon='icName'
             :width='16'
             :height='16'
             :ml='icMl'
             :mr='icMr'
             :pathFill='isFocus && icFocusColor ? icFocusColor : icColor' />
    </div>
    <MInput :model-value='modelValue'
            :class="[
                {'input-focus' : isFocus},
                {'input-icon' : inputIcon},
                {'input-reset' : isBtnX && modelValue?.length}
              ]"
            ref='input'
            :fill='fill'
            :placeholder='placeholder'
            :limitCnt='limitCnt'
            :type='type'
            @update:modelValue="emit('update:modelValue',$event)"
            :title='props.title'
            @focusin='onFocusin'
            @focusout='onFocusout'
            @keydown='onKeydown'
            @keyup='onKeyup'
            :necessary='props.necessary'
            @blur="emit('blur')" />
    <div v-if='isBtnX && modelValue?.length'
         class='reset-btn'
         @click='onDeleteInput'>
<!--      TODO: -->
<!--      <img src='../../assets/images/ic_xmark_circle_fill_black.svg' alt='reset'>-->
    </div>
    <div class='write-area__dropdown-wrap'>
      <MDropDown v-show='showDropdown'
                 ref='dropdownBox'
                 v-model:model-value='dropdownVal'
                 v-model:model-cursor='dropdownCursor'
                 :options='getOptions'
                 @click='onClickDropdown'
                 @delete="(value, idx) => emit('deleteList',value, idx)"
                 :listBottomBorder='listBottomBorder'
                 :disabled='listDisabled'
                 :is-checked='isChecked'
                 :is-btn-x='isBtnX'>
      </MDropDown>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { computed, ref } from 'vue'
import { refs } from '@/utils/refs'
import MDropDown from './MDropDown.vue'
import { escapeRegExp } from 'lodash'
import MInput from './MInput.vue'
import type { InputType } from 'bootstrap-vue-next'
import eventUtil from '@/utils/eventUtil'
import MIcon from '@/components/base/MIcon.vue'

const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  className?: string
  type?: InputType
  options?: any[]
  optionsFilter?: boolean
  limitCnt?: number
  limit?: number
  dropShowCnt?: number
  listDisabled?: number[]
  listBottomBorder?: boolean
  isChecked?: boolean
  isBtnX?: boolean
  inputIcon?: boolean
  icName?: string
  icColor?: string
  icFocusColor?: string
  icMl?: number
  icMr?: number
  fill?: boolean
  title?: string
  necessary?: boolean
}>(), {
  modelValue: '',
  placeholder: '',
  className: '',
  optionsFilter: false,
  options: () => ([]),
  limitCnt: -1,
  limit: 5,
  dropShowCnt: -1,
  listDisabled: () => ([]),
  listBottomBorder: false,
  isChecked: false,
  isBtnX: false,
  inputIcon: false,
  icName: '',
  icColor: '',
  icFocusColor: '',
  icMl: 12,
  icMr: 8,
  fill: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'input': [value: string]
  'click': [value: string, idx: number]
  'deleteList': [value: string, idx: number]
  'deleteInput': []
  'enter': []
  'keydown': [event: KeyboardEvent]
  'keyup': [event: KeyboardEvent]
  'enterKeyDown': []
  'focusin': [event: FocusEvent]
  'focusout': [event: FocusEvent]
  'blur': []
  iconClick: []
}>()

function onDeleteInput() {
  emit('update:modelValue', '')
  emit('deleteInput')
}

function ch2pattern(ch: string) {
  const offset = 44032 /* '가'의 코드 */
  // 한국어 음절
  if (/[가-힣]/.test(ch)) {
    const chCode = ch.charCodeAt(0) - offset
    // 종성이 있으면 문자 그대로를 찾는다.
    if (chCode % 28 > 0) {
      return ch
    }
    const begin = Math.floor(chCode / 28) * 28 + offset
    const end = begin + 27
    return `[\\u${begin.toString(16)}-\\u${end.toString(16)}]`
  }
  // 한글 자음
  if (/[ㄱ-ㅎ]/.test(ch)) {
    const con2syl: any = {
      'ㄱ': '가'.charCodeAt(0),
      'ㄲ': '까'.charCodeAt(0),
      'ㄴ': '나'.charCodeAt(0),
      'ㄷ': '다'.charCodeAt(0),
      'ㄸ': '따'.charCodeAt(0),
      'ㄹ': '라'.charCodeAt(0),
      'ㅁ': '마'.charCodeAt(0),
      'ㅂ': '바'.charCodeAt(0),
      'ㅃ': '빠'.charCodeAt(0),
      'ㅅ': '사'.charCodeAt(0)
    }
    const begin = con2syl[ch] || ((ch.charCodeAt(0) - 12613 /* 'ㅅ'의 코드 */) * 588 + con2syl['ㅅ'])
    const end = begin + 587
    return `[${ch}\\u${begin.toString(16)}-\\u${end.toString(16)}]`
  }
  // 그 외엔 그대로 내보냄
  // escapeRegExp는 lodash에서 가져옴
  return escapeRegExp(ch)
}

function createFuzzyMatcher(input: string) {
  const pattern = input.split('').map(ch2pattern).join('.*?')
  return new RegExp(pattern)
}


const getOptions = computed(() => {
  if (props.optionsFilter) {
    let list: string[] = []
    const regex = createFuzzyMatcher(props.modelValue)
    if (props.modelValue.length > props.dropShowCnt) {
      props.options.forEach((item) => {
        if (regex.test(item)) {
          list.push(item)
        }
      })
    }

    dropdownVal.value = -1
    return list.slice(0, props.limit)
  }
  return props.options
})
const input = refs(MInput)
const dropdownVal = ref(-1)
const dropdownCursor = ref(-1)
const isFocus = ref(false)
const showDropdown = computed(() => {
  return isFocus.value && getOptions.value.length
})

function onFocusin(e: FocusEvent) {
  isFocus.value = true

  if (props.optionsFilter) {
    dropdownVal.value = -1
  }

  emit('focusin', e)
}

function onFocusout(e: FocusEvent) {
  isFocus.value = false
  emit('focusout', e)
}

let isBlur = false

const dropdownBox = ref()

function onKeydown(e: KeyboardEvent) {
  const target = (dropdownBox.value.$el as HTMLElement).getElementsByClassName('list-group')[0]

  if (getOptions.value.length) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      dropdownCursor.value = dropdownCursor.value < getOptions.value.length - 1 ? dropdownCursor.value + 1 : 0
      eventUtil.onScroll(target, dropdownCursor.value + 1, getOptions.value, 300)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      dropdownCursor.value = dropdownCursor.value < 1 ? getOptions.value.length - 1 : dropdownCursor.value - 1
      eventUtil.onScroll(target, dropdownCursor.value + 1, getOptions.value, 300)
    } else if (e.key === 'Enter') {
      if (dropdownCursor.value >= 0) {
        dropdownVal.value = dropdownCursor.value
        emit('update:modelValue', getOptions.value[dropdownVal.value])
        isFocus.value = false
      }
    }
  }

  if (e.key === 'Enter') {
    isBlur = true
    emit('enter')
  }

  emit('keydown', e)
}

function onKeyup(e: KeyboardEvent) {
  if (isBlur) {
    input.value?.blur()
    isBlur = false
    emit('enterKeyDown')
  }
  emit('keyup', e)
}

//마우스 클릭으로 list 선택한 경우 발생
function onClickDropdown() {
  emit('update:modelValue', getOptions.value[dropdownVal.value])
  input.value?.blur()
  emit('click', getOptions.value[dropdownVal.value], dropdownVal.value)
}

function onIconClick() {
  emit('iconClick')
}

function focus() {
  input.value?.focus()
}

defineExpose({
  focus
})

</script>

<style lang='scss' scoped>
.write-area {
  position: relative;

  &__dropdown-wrap {
    position: relative;
  }

  .icon-box {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
  }

  :deep(.input-default) {
    &.input-icon {
      input {
        padding-left: 32px;
      }
    }

    &.input-reset {
      input {
        padding-right: 34px;
      }
    }
  }

  .reset-btn {
    width: 14px;
    height: 100%;
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    cursor: pointer;
    opacity: .4;

    &:hover, &:active {
      opacity: .6;
    }

    img {
      display: block;
      width: 100%;
      object-fit: cover;
    }
  }
}

</style>
