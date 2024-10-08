<template>
  <label class='identification-number'>
    <span v-if='props.label' class='identification-number__label' :class="{ '--required': props.isRequired }">{{
        props.label
      }}</span>
    <span class='identification-number__inner-wrap'>
      <!-- 주민번호 앞자리 -->
      <MInput
        v-model='idNumberFront'
        ref='idNumberFrontInput'
        class='identification-number__frontNum'
        :maxLength='6'
        :limitCnt='6'
        pattern='[0-9]*'
        inputMode='numeric'
        enterkeyhint='next'
        tabindex='1'
        :onkeyup='onIdNumberFrontInput'
      />
      <!-- 주민번호 뒷자리 -->
      <span class='identification-number__dash'>-</span>
      <MInput
        v-model='idNumberBack'
        ref='idNumberBackInput'
        class='identification-number__backNum'
        :maxLength='7'
        :limitCnt='7'
        pattern='[0-9]*'
        inputMode='numeric'
        enterkeyhint='next'
        tabindex='2'
      />
    </span>
  </label>
</template>

<script setup lang='ts'>
import MInput from '@/components/base/MInput.vue'
import { refs } from '@/utils/refs'
import { ref, watch } from 'vue'

const idNumberFrontInput = refs(MInput)
const idNumberBackInput = refs(MInput)
const idNumberFront = ref<string>('')
const idNumberBack = ref<string>('')

const props = withDefaults(
  defineProps<{
    label?: string
    isRequired?: boolean
    modelValue: {
      idNumberFront: string
      idNumberBack: string
    }
  }>(),
  {
    modelValue: () => ({
      idNumberFront: '',
      idNumberBack: ''
    })
  }
)

function onIdNumberFrontInput() {
  if (idNumberFront.value.length >= 6) {
    idNumberBackInput.value?.focus()
  }
}

const emit = defineEmits<{
  'update:modelValue': [
    info: {
      idNumberFront: string
      idNumberBack: string
    }
  ]
  change: [
    info: {
      idNumberFront: string
      idNumberBack: string
    }
  ]
}>()

const refine = (front: string, back: string) => {
  front = front.trim()
  back = back.trim()
  return {
    idNumberFront: front,
    idNumberBack: back
  }
}

watch(
  () => props.modelValue,
  () => {
    const res = refine(props.modelValue.idNumberFront, props.modelValue.idNumberBack)
    idNumberFront.value = res.idNumberFront
    idNumberBack.value = res.idNumberBack
  },
  { immediate: true }
)

watch([idNumberFront, idNumberBack], ([front, back]) => {
  const res = refine(front, back)
  emit('update:modelValue', res)
  emit('change', res)
})
</script>

<style scoped lang='scss'>
.identification-number {
  display: flex;
  flex-direction: column;
  flex: 1;

  &__label {
    flex: 1;
    @include button-3($color: rgba(80, 83, 89, 1));
    margin-bottom: 0.8rem;

    &.--required {

      &::after {
        margin-left: 0.2rem;
        content: '*';
        color: rgba(240, 47, 48, 1);
      }
    }
  }

  &__inner-wrap {
    display: flex;
    align-items: center;
  }

  :deep(.input-default) {
    input {
      @include body-3;
      padding: .4rem;

      &::placeholder {
        letter-spacing: normal;
      }
    }
  }

  &__dash {
    padding: 0 .8rem;
  }
}
</style>