<template>
  <div class="main-container">
    <Header>
      <template #left>
        <div class="left-container">
          <div class="title-box" @click="openSideMenu">{{title.charAt(0)}}</div>
          <h1>{{title}}</h1>
        </div>
      </template>
    </Header>
    <div class="main-layout__content">
      <slot></slot>
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from './Header.vue'
import Footer from './Footer.vue'
import { ref } from 'vue'

const title = ref<string>('홈 페이지')

function openSideMenu() {
  console.log('open side menu')
}
</script>

<style scoped lang="scss">
.main-container {
  width: 600px;
  height: 823px;
  .left-container {
    display: flex;
    align-items: center;
    gap: 12px;
    .title-box{
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      width: 45px;
      height: 45px;
      background: $gray-300;
      @include h5-title($color: $gray-900);
    }
    h1{
      @include h4-title($color: $gray-900);
    }
  }
  .main-layout__content {
    height: 687px;
    background: #91BFFF;
  }
}
</style>