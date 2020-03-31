<template>
  <div class="welcome-contain">
    <el-carousel :interval="4000" type="card" height="300px">
      <el-carousel-item v-for="(imgUrl,index) in imgs " :key="index">
        <img class="el-image" :src="imgUrl">
      </el-carousel-item>
    </el-carousel>
    <h1>欢迎使用城市中台<span style="font-size: x-large">V0.5</span></h1>
  </div>

</template>

<script>
export default {
  name: 'Welcome',
  data() {
    return {
      imgs: ['http://www.e-tecsun.com/uploadfiles/images/2019/6/20190613091258778.jpg',
        'http://www.e-tecsun.com/uploadfiles/images/2019/6/20190627114720281.jpg',
        'http://www.e-tecsun.com/uploadfiles/images/2019/6/20190613092646615.jpg',
        'http://www.e-tecsun.com/uploadfiles/images/2019/11/20191109091035259.jpg',
        'http://www.e-tecsun.com/uploadfiles/images/2019/11/2019110802073690.jpg',
        'http://www.e-tecsun.com/uploadfiles/images/2019/6/20190621103436422.jpg'
      ]
    }
  }
}
</script>

<style scoped>
  .welcome-contain {
    margin: 30px 30px;
  }

  h1 {
    margin: 30px auto;
    line-height: 130px;
    text-align: center;
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

</style>
