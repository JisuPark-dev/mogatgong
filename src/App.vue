<template>
  <RouterView v-slot='{ Component }'>
    <component :is='Component' />
  </RouterView>
</template>

<script setup lang='ts'>
import { RouterView } from 'vue-router'
import { onBeforeMount } from 'vue'
import { loadKakaoMapScript } from '@/utils/geo'

onBeforeMount(() => {
  loadKakaoMapScript(() => {
  })
})
</script>

<style scoped lang='scss'></style>