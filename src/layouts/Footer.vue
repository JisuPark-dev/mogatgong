<template>
  <footer class="main-footer">
    <div class="main-footer__container">
      <div class="main-footer__container__item">
        <MIcon :icon="'ic_home'"
        :mr="0"
        :width="18"
        :height="18"/>
        홈
      </div>
      <div class="main-footer__container__item">
        <MIcon :icon="'ic_assignment'"
               :mr="0"
               :width="18"
               :height="18"/>
        과제
      </div>
      <div class="main-footer__container__item">
        <MIcon :icon="'ic_question'"
               :mr="0"
               :width="18"
               :height="18"/>
        질문
      </div>
      <div class="main-footer__container__item">
        <MIcon :icon="'ic_record'"
               :mr="0"
               :width="18"
               :height="18"/>
        기록
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
// 필요한 경우 스크립트 로직 추가
import MIcon from '@/components/base/MIcon.vue'
</script>

<style scoped lang="scss">
.main-footer {
  height: 68px;
  background: #DCDCDC;
  &__container{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 68px;
    &__item{
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      gap:4px;
    }
  }
}
</style>