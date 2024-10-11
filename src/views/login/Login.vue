<template>
  <div>
    <h3>loading...</h3>
  </div>
</template>

<script setup lang='ts'>
import {onMounted, watch} from 'vue'
import {useAccountStore} from '@/stores/module/account'
import {useRoute, useRouter} from 'vue-router'

const accountStore = useAccountStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  const token = route.query['token']
  const tokenPayload = parseJwt(token?.toString());
  accountStore.setHospitalSeq(tokenPayload.hospitalSeq)
  accountStore.login({
    jwtToken: token?.toString()
  })

})

function parseJwt(token?: string) {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1]; // Payload 부분만 추출
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // Payload를 JSON 객체로 변환
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
}

watch(() => accountStore.getIsLogin, () => {
  if (accountStore.getIsLogin) {
    router.replace('/')
  }
}, { immediate: true })
</script>

<style scoped lang='scss'>

</style>