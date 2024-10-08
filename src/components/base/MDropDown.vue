<template>
  <div class="custom-drop-down">
    <BListGroup
      class="list-group-custom"
      tabindex="-1"
      :class="[
        { 'fit-list': fitList },
        { right: direction === 'right' },
        { 'right-top': direction === 'rightTop' },
        { 'left-top': direction === 'leftTop' }
      ]"
      :style="{ maxHeight: `${maxHeight}px` }"
    >
      <slot name='beforeItems' />
      <BListGroupItem
        v-for="(item, i) in options"
        :disabled="disabled?.includes(i)"
        :class="[{ selected: modelCursor === i }, { 'bottom-border': listBottomBorder }]"
        @mouseenter="emit('update:modelCursor', i)"
        @mousedown="
          (e: any) => {
            props.enableButton && e.preventDefault()
          }
        "
        @click="onClick(item, i)"
        :button="enableButton"
      >
        <div class="item-inner">
          <slot name="before" :item="item" :index="i">
            <div v-if="isChecked" class="check-container">
              <MIcon
                v-if="i === modelValue || alwaysOn"
                :icon="icInner.length ? icInner[i] : 'ic_checkmark_bold'"
                :pathFill="icInnerFill?.length ? icInnerFill[i] : '$primary-500'"
                :width="16"
                :height="16"
              />
            </div>
          </slot>
          <slot>
            <p class="item-text" v-html="item" :style="background && background[i] ? { background: background[i], borderRadius: '4px', padding:'4px' } : {}" />
          </slot>
          <slot name="after" :item="item" :index="i">
            <div v-if="isBtnX" class="reset-btn" @click.stop="emit('delete', item, i)">
              <MIcon
                :icon="'ic_xmark_circle_fill'"
                :pathFill="'$default-black'"
                :width="14"
                :height="14"
              />
            </div>
          </slot>
        </div>
      </BListGroupItem>
    </BListGroup>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { BListGroup, BListGroupItem } from 'bootstrap-vue-next'
import MIcon from '@/components/base/MIcon.vue'

export type Direction = 'left' | 'right' | 'leftCenter' | 'rightCenter' | 'leftTop' | 'rightTop'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    modelCursor?: number
    options?: string[]
    minCursor?: number
    maxCursor?: number
    disabled?: number[]
    listBottomBorder: boolean
    isChecked?: boolean
    isBtnX?: boolean
    maxHeight?: number
    fitList?: boolean
    direction?: Direction
    icInner?: string[] //여러 아이콘 사용시,
    icInnerFill?: string[] // drop down 아이콘 색상 변경시,
    alwaysOn?: boolean //icInner + alwaysOn = 아이콘 항상 표시,
    enableButton?: boolean
    background?: string[]
  }>(),
  {
    modelValue: -1,
    modelCursor: -1,
    minCursor: -1,
    maxCursor: -1,
    disabled: () => [],
    listBottomBorder: false,
    isBtnX: false,
    isChecked: false,
    options: () => [],
    maxHeight: 300,
    fitList: false,
    direction: 'left',
    icInner: () => [],
    alwaysOn: false,
    enableButton: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'update:modelCursor': [value: number]
  click: [value: string, idx: number]
  delete: [value: string, idx: number]
  close: [value: string, idx: number]
}>()

function onClick(v: string, i: number) {
  emit('update:modelValue', i)
  emit('update:modelCursor', i)
  emit('click', v, i)
}

const maxCheck = computed(() => {
  return props.maxCursor === -1 ? props.options.length : props.maxCursor
})

watch(
  () => props.modelCursor,
  (value) => {
    if (value >= maxCheck.value) emit('update:modelCursor', maxCheck.value - 1)
    if (value < props.minCursor) emit('update:modelCursor', props.minCursor)
  }
)

watch(
  () => props.options,
  () => {
    emit('update:modelCursor', -1)
  }
)

onMounted(() => {
  emit('update:modelCursor', -1)
})
</script>

<style lang="scss" scoped>
.custom-drop-down {
  width: 100%;
  top: 0.5rem;
  position: absolute;
  overflow: visible !important;
  z-index: 30;

  .list-group-custom {
    width: 100%;
    margin-top: 0.4rem;
    padding: 0.6rem;
    overflow: hidden;
    overflow-y: auto;
    border-radius: 0.6rem;
    background: $default-white;
    @include elevation-2;
    // menu list z-index

    &.fit-list {
      width: max-content;
    }

    &.right {
      left: unset;
      right: 0;
    }

    &.right-top {
      top: 0;
      left: 100%;
      right: unset;
      margin-top: 0;
      margin-left: 0.4rem;
    }

    &.left-top {
      top: 0;
      right: 100%;
      left: unset;
      margin-top: 0;
      margin-right: 0.4rem;
    }

    &.hide {
      display: none;
    }

    .list-group-item {
      width: 100%;
      display: flex;
      align-items: center;
      border: 0;
      padding: 0;
      position: relative;
      // disabled 효과
      &.disabled {
        opacity: 0.3;
        cursor: no-drop;
        pointer-events: auto;

        .item-inner {
          &::after {
            display: none !important;
          }

          .reset-btn {
            cursor: no-drop;
            opacity: 0.4 !important;
          }
        }
      }

      // list-bottom-border 효과
      &.bottom-border {
        position: relative;
        margin-bottom: 0.6rem;
        padding-bottom: 0.6rem;

        &::after {
          content: '';
          display: block;
          width: calc(100% - 1.6rem);
          height: 0.1rem;
          background: $gray-300;
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
        }

        &:last-of-type {
          margin-bottom: 0;
          padding-bottom: 0;

          &::after {
            display: none;
          }
        }
      }

      .item-inner {
        display: flex;
        align-items: center;
        width: auto;
        min-height: 2.8rem;
        padding: 0.3rem 0.8rem;

        .check-container {
          width: 2.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-text {
          display: flex;
          align-items: center;
          flex: 1;
          height: 100%;
          margin-left: 0.8rem;
          white-space: nowrap;
          @include body-3($line-height: normal);
        }

        .reset-btn {
          height: 100%;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding-right: 1.2rem;
          padding-left: 0.9rem;
          opacity: 0.4;
          z-index: 10;

          &:hover,
          &:active {
            opacity: 0.6;
          }
        }
      }

      //hover, active, focus 배경
      &.list-group-item-action {
        .item-inner {
          position: relative;
          display: flex;

          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: auto;
            height: 100%;
            border-radius: 0.4rem;
          }
        }

        &:hover {
          .item-inner::after {
            background: $scrim-5;
          }
        }

        &:active,
        &:focus {
          .item-inner::after {
            background: $scrim-10;
          }
        }
      }
    }

    //선택된 list 적용 css
    .selected {
      &.list-group-item-action:hover {
        background: none;
      }

      .item-inner {
        position: relative;

        &::after {
          content: '';
          position: absolute;
          left: -0.8rem;
          top: 0;
          width: calc(100% + 1.6rem);
          height: 100%;
          border-radius: 0.4rem;
          background: $scrim-5;
        }
      }
    }
  }
}
</style>