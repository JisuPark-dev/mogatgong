<template>
  <div class="not-found">
    <b> 페이지를 찾을 수 없습니다. (404) </b>
    <RouterLink to="/">
      <MButton variant="custom-blue">홈으로 이동하기</MButton>
    </RouterLink>
  </div>
</template>
<script setup lang="ts">
import MButton from '@/components/base/MButton.vue'
</script>
<style lang="scss" scoped>
.not-found {
  gap: 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > b {
    @include h2-title;
  }
}
</style>