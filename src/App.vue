<template>
  <div id="app" @click="isClick">
    <router-view />
  </div>
</template>

<script>
import defaultSettings from '@/settings'
export default {
  name: 'App',
  data() {
    return {
      lastTime: null, // 最后一次点击的时间
      currentTime: null, // 当前点击的时间
      timeOut: defaultSettings.timeout // 设置超时时间：30分钟，可自定义时间
    }
  },
  methods: {
    isClick() {
      // 判断已经登录
      if (this.$store.state.user.token) {
        this.currentTime = new Date().getTime()// 记录这次点击的时间
        // 判断上次最后一次点击的时间和这次点击的时间是否大于30分钟
        if (this.lastTime && this.currentTime - this.lastTime > this.timeOut) {
          this.$alert('您超过半个小时未操作，页面已经超时，请重新登录!', '温馨提示', {
            confirmButtonText: '确认',
            showCancelButton: false,
            showClose: false
          })
            .then(async() => {
              this.logout()
            })
            .catch(err => {
              console.error(err)
            })
        }
      }
      this.lastTime = new Date().getTime() // 如果在30分钟内点击，则把这次点击的时间记录覆盖掉之前存的最后一次点击的时间
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)//重定向，如果不想重定向

      this.$router.push('/login')// 不重定向
    }
  }
}
</script>
