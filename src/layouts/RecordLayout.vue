<template>
  <div class="main-container">
    <Header>
      <template #left>
        <h1>회의록</h1>
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
</script>

<style scoped lang="scss">
.main-container {
  background: pink;
  width: 600px;
  height: 823px;
  .main-layout__content {
    height: 687px;
    background: #91BFFF;
  }
}
</style>