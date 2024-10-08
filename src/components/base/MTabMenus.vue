<template>
  <div class="tab-component-wrap">
    <div :class="variant ? variant : ''"
         class="tab-menu-component">
      <b-nav class="tabs-wrap"
             ref="tabsWrap"
             fill>
        <b-nav-item v-for="(item, idx) in tabMenus"
                    ref="tab"
                    :active="modelValue === idx"
                    :active-class="'tab-act'"
                    @click.stop="onTabClick(idx)">
     <span :class="{'update' : item.update}">
       {{ item.text }}
     </span>
        </b-nav-item>
      </b-nav>
    </div>

    <!--tab-icon-btn -->
    <MButton v-if="icName !== ''"
             :variant="'icon'"
             @click="onIconClick">
      <MIcon :icon="icName"
             :width="icWidth"
             :height="icHeight"
             :path-fill="icColor"/>
    </MButton>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from "vue";
import {BNav, BNavItem} from "bootstrap-vue-next";
import {refs} from "@/utils/refs";


interface TabItem {
  text: string
  update?: boolean
}

export type TabVariant = "seg-control"

/**
 * Options
 * */
const props = withDefaults(defineProps<{
  tabMenus?: Array<TabItem>
  modelValue?: number
  icName?: string
  icWidth?: number
  icHeight?: number
  icColor?: string
  variant?: string
}>(), {
  tabMenus: () => [],
  modelValue: 0,
  icName: '',
  icWidth: 16,
  icHeight: 16,
  icColor: '$gray-500'
});


const emit = defineEmits<{
  'update:modelValue': [value: number]
  'iconClick': [event: MouseEvent]
  'change': [value: number]
}>();


/**
 * Click - emit
 * */
function onTabClick(idx:number) {
  scrollCenter(idx);
  emit('update:modelValue', idx);
}
function onIconClick(e: MouseEvent) {
  emit('iconClick', e);
}


const tabsWrap = refs(BNav);
const tab = ref([BNavItem]);
function scrollCenter(idx:number) {
  if(tabsWrap && tab) {
    const element = tab.value[idx + 1]?.$el;
    const wrapper = tabsWrap.value?.$el;

    const activeWidth = element.getBoundingClientRect().width / 2;
    let position = element.offsetLeft + activeWidth;

    const currentScroll = wrapper.scrollLeft;
    const wrapperWidth = wrapper.getBoundingClientRect().width;

    position = position + currentScroll - (wrapperWidth / 2);

    tabsWrap.value?.$el.scroll({
      left: position,
      behavior: 'smooth'
    })
  }
}


/**
 * Watch
 * */
watch(() => props.modelValue, (value) => {
  emit('change', value);
})

</script>

<style scoped lang="scss">
.tab-component-wrap{
  display: flex;
  flex: auto;
  align-items: center;
  height: 32px;
  // Default
  .tab-menu-component {
    width: 100%;
    height: 100%;
    position: relative;
    .tabs-wrap {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-wrap: nowrap;
      width: 100%;
      height: 100%;
      padding: 0 8px;
      box-sizing: border-box;
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      scroll-behavior: smooth;
      @include scrollCustom( $scroll-height: 4px);
      @include notDrag;
      :deep(.nav-item) {
        flex: 1;
        //min-width: 48px;
        height: 100%;
        .nav-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          min-width: 48px;
          padding: 3px 7px;
          border-radius: 4px;
          box-sizing: border-box;
          position: relative;
          &:focus {
            color: $gray-600;
          }
          &:hover {
            &::before {
              display: block;
              background: $scrim-5;
            }
          }
          &:active {
            &::before {
              display: block;
              background: $scrim-10;
            }
          }
          // active primary bar
          &::after {
            content: '';
            display: none;
            width: 100%;
            height: 3px;
            border-radius: 2px;
            position: absolute;
            left: 0;
            bottom: -1px;
            background: $primary-500;
          }
          &::before {
            content: '';
            display: none;
            width: calc(100% - 4px);
            height: calc(100% - 8px);
            border-radius: 4px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
          }

          // active 효과
          &.tab-act {
            color: $gray-900;
            &:focus {
              color: $gray-900;
            }
            &::after{
              display: block;
            }
          }

          // tab-text
          >span {
            position: relative;
            white-space: nowrap;
            width: 100%;
            @include button-4($color: $gray-600);
            // update effect
            &::after{
              content: '';
              display: none;
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background: $red-500;
            }
            &.update {
              display: flex;
              align-items: flex-start;
              justify-content: center;

              &::after{
                display: block;
              }
            }
          }
        }
      }
    }
  }
  // Variant(default css base) : Seg - Control
  .seg-control {
    border: 1px solid $gray-300;
    box-sizing: border-box;
    border-radius: 6px;
    overflow: hidden;
    .tabs-wrap {
      position: relative;
      padding: 0;
      overflow: unset;
      :deep(.nav-item) {
        &:first-of-type {
          .nav-link {
            &::after {
              display: none;
            }
          }
        }
        // 인접 형제 가로 bar 제거
        &:has(.tab-act){
          & + .nav-item {
            .nav-link {
              &::after {
                display: none;
              }
            }
          }
        }
        // tab - style
        .nav-link {
          min-width: unset;
          padding: 7px 7.5px;
          border-radius: unset;
          // hover 효과
          &::before {
            width: 100%;
            height: 100%;
            border-radius: unset;
          }
          // tab0-item 영역 표기 bar
          &::after {
            display: block;
            width: 1px;
            height: 14px;
            top: 50%;
            transform: translateY(-50%);
            background: $gray-300;
          }
          >span {
            line-height: normal;
          }
          // active 효과
          &.tab-act {
            background: $primary-500;
            >span {
              color: $default-white;
            }
            &::after {
              display: none;
            }
          }
        }
      }
    }
  }

  :deep(.btn-icon) {
    width: 24px;
    height: 100%;
    &::before {
      content: '';
      display: block;
      width: 1px;
      height: 16px;
      background: $gray-200;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}
</style>
