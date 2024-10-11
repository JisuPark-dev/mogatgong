<template>
  <header class="main-header">
    <div class="main-header__left">
      <slot name="left">
        <!-- 기본 컨텐츠 -->
      </slot>
    </div>
    <div class="main-header__right">
      <div class="right-container">
        <MIcon :icon="'ic_question'"
               :mr="0"
               :width="18"
               :height="18"/>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// 필요한 경우 스크립트 로직 추가
import MIcon from '@/components/base/MIcon.vue'
</script>

<style scoped lang="scss">
.main-header {
  height: 68px;
  background: #6441EC;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &__left{
    background: pink;
    padding: 10px;
  }
  &__right{
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    background: pink;
    .right-container{
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      background: $gray-300;
      border-radius: 6px;
    }
  }

}
</style>