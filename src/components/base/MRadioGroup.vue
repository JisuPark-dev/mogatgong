<template>
  <label class='radio-group'
  ><span class='radio-group__label' :class="{ '--required': props.isRequired }">{{
      props.label
    }}</span>
    <BFormRadioGroup
      class='radio-group__radio-group'
      button-variant='outline-light'
      buttons
      v-model='model'
      :options='props.options'
      :required='props.isRequired'
    />
  </label>
</template>

<script setup lang='ts'>
import { BFormRadioGroup } from 'bootstrap-vue-next'

const props = withDefaults(
  defineProps<{
    label?: string
    isRequired?: boolean
    options: Record<string, unknown>[]
    modelValue: Record<string, unknown>
  }>(),
  {}
)

const model = defineModel({ default: 0 })
</script>

<style scoped lang='scss'>
.radio-group {
  display: flex;
  flex-direction: column;
  flex: 1;

  &__label {
    margin-bottom: .8rem;
    @include button-3($color: rgba(80, 83, 89, 1));

    &.--required {
      margin-bottom: 0.8rem;

      &::after {
        margin-left: 0.2rem;
        content: '*';
        color: rgba(240, 47, 48, 1);
      }
    }
  }

  :deep(.radio-group__radio-group) {
    .btn-outline-light {
      --bs-btn-border-color: rgba(214, 217, 221, 1);
      --bs-btn-active-border-color: rgba(214, 217, 221, 1);
    }

    & > input + label {
      @include button-3($color: rgba(152, 155, 160, 1));
    }

    & > input:checked + label {
      @include button-3($color: white);
      background: rgba(52, 123, 246, 1);
    }
  }
}
</style>