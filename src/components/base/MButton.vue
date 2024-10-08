<template>
  <BButton :variant="props.variant as ButtonVariant"
           :disabled="props.disabled"
           :size="props.scale as Size"
           @focusout="onFocusout"
           @keydown="emit('keydown', $event)"
           @click="onClick($event)">
    <slot/>
  </BButton>
</template>
<script setup lang="ts">
import {BButton, type ButtonVariant, type Size} from "bootstrap-vue-next";
import {useTimer} from "@/composables/timer";

export type MButtonVariant = "text-blue" | "text-gray" | "custom-blue" | "custom-gray" | "custom-gray-text" | "custom-gray-red-text" | ButtonVariant | '' |
  "custom-red" | "outline-blue" | "outline-gray" | "outline-gray-text" |
  "outline-red" | "outline-red-gray" | "outline-normal" | "outline-normal-red" |
  'outline-success' | 'outline-success-text' |
  "warning" | "pre-plus" | "replying" | "tip-view" | "fab" | "fab-circle" | 'custom-blue pre-plus' | 'custom-gray pre-plus' |
  'custom-gray-text pre-plus' | 'outline-blue pre-plus' | 'outline-gray pre-plus' | 'outline-gray-text pre-plus' | 'outline-normal pre-plus' |
  'custom-blue replying' | 'custom-blue tip-view' | 'icon' | 'icon-square' | 'none'
const props = withDefaults(defineProps<{
  variant?: MButtonVariant
  disabled?: boolean
  scale?: Size | 'sm' | "xs" | 'xxs'
  enablePreventingMultipleClick?: boolean;
}>(), {
  variant: '',
  disabled: false,
  scale: "md",
})

const emit = defineEmits<{
  'click': [event: MouseEvent]
  'focusout': []
  'keydown': [event: KeyboardEvent]
}>()

const { resume, reset, isActive } = useTimer();

function onClick(event: MouseEvent) {
  if (props.enablePreventingMultipleClick) {
    if (isActive.value) return;
    reset();
    resume();
    emit('click', event);
  } else {
    emit('click', event);
  }
}

function onFocusout() {
  emit('focusout');
}

</script>
<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  box-shadow: none;
  position: relative;
  z-index: 1;

  &::after {
    content: '';
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 0.25rem;
    z-index: -1;
  }

  // 상태효과(공통 - hover, active)
  &:disabled {
    cursor: no-drop;
    pointer-events: unset;

    &::after {
      display: none !important;
    }
  }

  &:hover {
    &::after {
      display: block;
      background: $scrim-5;
    }
  }

  &:active {
    &::after {
      display: block;
      background: $scrim-7;
    }
  }

  &.btn-custom-blue, &.btn-custom-red, &.btn-fab, &.btn-fab-circle {
    &:hover {
      &::after {
        background: $scrim-10;
      }
    }

    &:active {
      &::after {
        background: $scrim-20;
      }
    }
  }


  // btn icon(통합)
  &.pre-plus {
    &::before {
      content: '';
      display: inline-block;
      width: 2rem;
      height: 2rem;
      background: url("../../assets/images/ic_add_outline_blue.svg");
      background-size: contain;
      margin-right: .8rem;
    }
  }

  &.replying {
    &::before {
      content: '';
      display: inline-block;
      width: 2rem;
      height: 2rem;
      background: url("../../assets/images/ic_replying.svg");
      background-size: contain;
      margin-right: .8rem;
    }
  }

  &.tip-view {
    &::before {
      content: '';
      display: inline-block;
      width: 1.6rem;
      height: 1.6rem;
      background: url("../../assets/images/ic_light_color.svg");
      background-size: contain;
      margin-right: .6rem;
    }
  }

  // btn size
  &.btn-md {
    @include button-md;
    @include button-2;

    &.pre-plus {
      &::before {
        width: 1.8rem;
        height: 1.8rem;
        margin-right: .6rem;
      }
    }

    &::after {
      border-radius: .8rem;
    }
  }

  &.btn-sm {
    @include button-sm;
    @include button-3;

    &.pre-plus {
      &::before {
        width: 1.4rem;
        height: 1.4rem;
        margin-right: .4rem;
      }
    }

    &.tip-view {
      padding: 0 3.5rem;
    }

    &.replying {
      &::before {
        width: 1.4rem;
        height: 1.4rem;
        margin-right: .4rem;
      }
    }

    &::after {
      border-radius: .6rem;
    }
  }

  &.btn-xs {
    @include button-xs;
    @include button-3;

    &.pre-plus {
      &::before {
        width: 1.4rem;
        height: 1.4rem;
        margin-right: .6rem;
      }
    }

    &.replying {
      &::before {
        width: 1.4rem;
        height: 1.4rem;
        margin-right: .6rem;
      }
    }

    &::after {
      border-radius: .6rem;
    }
  }

  &.btn-xxs {
    @include button-xxs;
    @include button-3;

    &.pre-plus {
      &::before {
        width: 1.4rem;
        height: 1.4rem;
        margin-right: .6rem;
      }
    }

    &.replying {
      &::before {
        width: 1.4rem;
        height: 1.4rem;
        margin-right: .6rem;
      }
    }

    &::after {
      border-radius: .4rem;
    }
  }

  // btn variant
  &.btn-text-blue {
    color: $primary-500;

    &:disabled {
      opacity: 0.4;
    }

    &:hover {
      &::after {
        display: none;
      }
    }

    &:active {
      color: $primary-500;
      background: none;
      &::after {
        display: none;
      }
    }
  }

  &.btn-text-gray {
    color: $gray-600;

    &:disabled {
      opacity: 0.4;
    }

    &:hover {
      &::after {
        display: none;
      }
    }

    &:active {
      color: $gray-600;
      background: none;
      &::after {
        display: none;
      }
    }
  }



  &.btn-custom-blue {
    background: $primary-500;
    color: $default-white;

    &:disabled {
      background: $gray-400 !important;
      opacity: .6;
    }

    &:active {
      background: $primary-500;
      color: $default-white;
    }

    &.pre-plus {
      &::before {
        background: url("../../assets/images/ic_add_outline_white.svg");
        background-size: contain;
      }
    }

    &.replying {
      &::before {
        background: url("../../assets/images/ic_replying.svg");
        background-size: contain;
      }
    }
  }

  &.btn-custom-gray {
    background: $gray-100;
    color: $primary-500;

    &.tip-view {
      color: $gray-600;
    }

    &:disabled {
      opacity: .5;
    }

    &:active {
      background: $gray-100;
      color: $primary-500;
    }
  }

  &.btn-custom-gray-text {
    background: $gray-100;
    color: $gray-600;

    &:disabled {
      opacity: .5;
    }

    &:active {
      background: $gray-100;
      color: $gray-600;
    }
  }

  &.btn-custom-gray-red-text {
    background: $gray-100;
    color: $red-600;

    &:disabled {
      opacity: .5;
    }

    &:active {
      background: $gray-100;
      color: $red-600;
    }
  }

  &.btn-custom-red {
    background: $red-600;
    color: $default-white;

    &:disabled {
      opacity: .5;
    }

    &:active {
      background: $red-600;
      color: $default-white;
    }
  }

  &.btn-outline-blue {
    border: 1px solid $primary-500;
    color: $primary-500;
    background: $default-white;

    &:disabled {
      opacity: .4;
    }

    &:active {
      border: 1px solid $primary-500;
      color: $primary-500;
    }
  }

  &.btn-outline-gray {
    background: $default-white;
    border: 1px solid $gray-300;
    color: $primary-500;

    &:disabled {
      opacity: .4;
    }

    &:active {
      border: 1px solid $gray-300;
      color: $primary-500;
    }
  }

  &.btn-outline-gray-text {
    background: $default-white;
    border: 1px solid $gray-300;
    color: $gray-600;

    &:disabled {
      opacity: .4;
    }

    &:active {
      border: 1px solid $gray-300;
      color: $gray-600;
    }
  }

  &.btn-outline-success {
    border: 1px solid $green-300;
    color: $green-500;

    &:disabled {
      opacity: .4;
    }

    &:active {
      border: 1px solid $green-300;
      color: $green-500;
    }
  }

  &.btn-outline-success-text {
    border: 1px solid $green-300;
    color: $green-500;

    &:disabled {
      opacity: .4;
    }

    &:active {
      border: 1px solid $green-300;
      color: $green-500;
    }
  }

  &.btn-outline-red {
    background: $default-white;
    border: 1px solid $red-600;
    color: $red-600;

    &:disabled {
      opacity: .4;
    }

    &:active {
      border: 1px solid $red-600;
      color: $red-600;
    }
  }

  &.btn-outline-red-gray {
    background: $default-white;
    border: 1px solid $gray-300;
    color: $red-600;

    &:disabled {
      opacity: .4;
    }

    &:active {
      border: 1px solid $gray-300;
      color: $red-600;
    }
  }

  &.btn-outline-normal {
    //background: $default-white;
    color: $primary-500;

    &:disabled {
      opacity: .4;
      color: $gray-300 !important;
    }

    &:active {
      color: $primary-500;
    }
  }

  &.btn-outline-normal-red {
    background: $default-white;
    color: $red-600;

    &:disabled {
      opacity: .4;
    }

    &:active {
      color: $red-600;
    };
  }

  &.btn-fab {
    background: $primary-500;
    color: $default-white;
    border-radius: 20px;

    &::after {
      border-radius: 20px;
    }

    &:active {
      background: $primary-500;
      color: $default-white;
      border-radius: 20px;
    }
  }

  &.btn-fab-circle {
    background: $primary-500;
    color: $default-white;
    border-radius: 50%;
    min-width: unset;
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::after {
      border-radius: 50%;
    }

    &:active {
      background: $primary-500;
      color: $default-white;
      border-radius: 50%;
      min-width: unset;
      width: 4rem;
      height: 4rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  &.btn-icon {
    width: fit-content;
    height: fit-content;
    min-width: unset;
    padding: .8rem .4rem;
    border-radius: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    :deep(.btn-content) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &::after{
      border-radius: unset;
    }
  }

  // Icon - 정사각형
  &.btn-icon-square {
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-width: unset !important;
    height: max-content;
    padding: .7rem;

    >:deep(.btn-content) {
      display: flex !important;
      align-items: center;
      height: max-content;
    }
  }

  // 팝업 버튼 variant
  &.btn-warning {
    box-shadow: none !important;
    border: 0 !important;
    color: $default-white;
    background: $red-600;

    &.disabled {
      background: $gray-300;
      opacity: 0.7;
      cursor: no-drop;

      &:hover {
        &::after {
          display: none !important;
        }
      }

      &:active {
        &::after {
          display: none !important;
        }
      }
    }

    &:focus {
      color: $default-white;
      background: $red-600;
      box-shadow: none !important;
    }
  }
}
</style>
