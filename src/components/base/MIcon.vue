<template>
  <InlineSvg v-if="src"
             :src="src"
             :width="width"
             :height="height"
             :pathFill="pathFill"
             :style="`margin-left : ${ml}rem; margin-right : ${mr}rem;`"
             @loaded="svgLoaded($event)"
             @unloaded="svgUnloaded"
             @error="svgLoadError($event)"
             @click="onClick"
             class="icon"
             ref="icon"
             aria-label="icon"/>
</template>

<script setup lang="ts">
import InlineSvg from 'vue-inline-svg';
import {onMounted, ref, watch} from "vue";
import {refs} from "@/utils/refs";
import {commonSvgLoader, styleLoader} from "@/utils/assetLoader";

const props = withDefaults(defineProps<{
  icon?: string
  width?: number
  height?: number
  pathFill?: string
  ml?: number
  mr?: number
}>(), {
  icon: '',
  width: 24,
  height: 24,
  pathFill: '',
  ml: 0,
  mr: 0
})

const emit = defineEmits<{
  'loaded': [value: any]
  'unloaded': []
  'error': [value: any]
  'click': []
}>()

const src = ref<string>();
onMounted(async ()=>{
  svgIconLoaded(props.icon);
})


const icon = refs(InlineSvg);
async function svgLoaded(e: any) {

  // svg icon 형성시 단일 path로 구성
  const path = e.children[0];
  if (props.pathFill.includes('$')) {

    //색상 변수 적용시
    let varColor: string = props.pathFill.replace('$', '');

    if (props.pathFill !== '' && path !== undefined && path.childNodes.length === 0) {
      path.attributes.fill.value = styleLoader.get(varColor);
    } else {
      return false;
    }

  } else {

    // 색상값 직접 적용시
    if (props.pathFill !== '' && path !== undefined && path.childNodes.length === 0) {
      path.attributes.fill.value = props.pathFill;
    } else {
      return false;
    }

  }
  emit('loaded', e);
}

async function svgIconLoaded(icon:string) {
  console.log("hi")
  try {
    const path = `../assets/img/${icon}.svg`
    const svg: any = await commonSvgLoader.get(path)
    if(svg && svg.default) {
      src.value = svg.default;
    }
  } catch (e) {
    console.log(e); // todo. 나중에 CDN으로 개선 예정
  }
}

function svgUnloaded() {
  emit('unloaded');
}

function svgLoadError(e: any) {
  emit('error', e);
}

function onClick() {
  emit('click');
}

// icon 색상 동적 대응
watch(() => props.pathFill, async (newVal) => {
  if (icon.value?.$el?.children && !!icon.value?.$el?.children[0]) {
    const svgPath = icon.value?.$el.children[0];

    if (newVal.includes('$')) {

      //색상 변수 적용시
      let varColor = newVal.replace('$', '');

      if (newVal !== '' && svgPath !== undefined && svgPath.childNodes.length === 0) {
        svgPath.attributes.fill.value = styleLoader.get(varColor);
      } else {
        return false;
      }

    } else {

      // 색상값 직접 적용시
      if (newVal !== '' && svgPath !== undefined && svgPath.childNodes.length === 0) {
        svgPath.attributes.fill.value = newVal;
      } else {
        return false;
      }
    }

  }
})
// icon 모양 동적 대응
watch(() => props.icon,  (newVal) => {
  svgIconLoaded(newVal);
})


</script>

<style lang="scss" scoped>
// bootsrap css 설정 무시
svg {
  overflow: unset !important;
  display: inline-block !important;
}
</style>
