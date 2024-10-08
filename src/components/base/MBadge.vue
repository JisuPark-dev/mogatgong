<!--
    용도 : Badge Component
    참조 : 색상값은 핵사코드, scss 변수 모두 사용 가능
-->

<template>
  <div ref="badgeComponent"
       class="badge-component">
    <p ref="badgeText"
       v-html="text"/>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import {styleLoader} from "@/utils/assetLoader";

/**
 * Options
 * */
const props = withDefaults(defineProps<{
  text?: string
  bgColor?: string
  textColor?: string
  borderColor?: string
}>(), {
  text: '',
  bgColor: '$gray-900',
  textColor: '$default-white',
  borderColor: 'transparent'
})


/**
 * 색상 적용 함수
 * */
const badgeComponent = ref<HTMLBaseElement>();
const badgeText = ref<HTMLBaseElement>();
function colorHandler(){
  // 배경색
  if(props.bgColor.includes('$')) {
    //색상 변수 적용시
    let varColor = props.bgColor.replace('$', '');
    if (props.bgColor !== '' && badgeComponent.value) {
      badgeComponent.value.style.background = styleLoader.get(varColor);
    } else {
      return false;
    }
  } else {
    // 색상값 직접 적용시
    if (props.bgColor !== '' && badgeComponent.value) {
      badgeComponent.value.style.background = props.bgColor;
    } else {
      return false;
    }
  }
  // 글자색
  if(props.textColor.includes('$')) {
    //색상 변수 적용시
    let varColor = props.textColor.replace('$', '');
    if (props.textColor !== '' && badgeText.value) {
      badgeText.value.style.color = styleLoader.get(varColor);
    } else {
      return false;
    }
  } else {
    // 색상값 직접 적용시
    if (props.textColor !== '' && badgeText.value) {
      badgeText.value.style.color = props.textColor;
    } else {
      return false;
    }
  }
  // border 색상
  if(props.borderColor.includes('$')) {
    //색상 변수 적용시
    let varColor = props.borderColor.replace('$', '');
    if (props.borderColor !== '' && badgeComponent.value) {
      badgeComponent.value.style.borderColor = styleLoader.get(varColor);
    } else {
      return false;
    }
  } else {
    // 색상값 직접 적용시
    if (props.borderColor !== '' && badgeComponent.value) {
      badgeComponent.value.style.borderColor = props.borderColor;
    } else {
      return false;
    }
  }
}

/**
 * mounted
 * */
onMounted(() => {
  colorHandler();
});


/**
 * watch
 * */
watch(() => props.bgColor, async () => {
  colorHandler();
});

watch(() => props.textColor, async () => {
  colorHandler();
});
</script>


<style scoped lang="scss">
.badge-component {
  width: fit-content;
  height: 16px;
  border-radius: 2px;
  padding: 1px 2px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border: 1px solid;
  >p {
    line-height: normal;
    @include button-5();
  }
}
</style>
