<template>
  <div class="personInfo-contains">

    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="form.username" :disabled="true" />
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="form.name" clearable />
      </el-form-item>
      <!--<el-form-item label="用户类型">-->
      <!--<el-select v-model="form.region" placeholder="请选择用户类型" style="width: 100%">-->
      <!--<el-option label="城市管理员" value="city" />-->
      <!--<el-option label="政府工作人员" value="government" />-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="电话">
        <el-input v-model="form.mobile" type="text" clearable />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" type="text" clearable />
      </el-form-item>
      <el-form-item label="头像">
        <el-input v-model="form.headImgUrl" type="text" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>

<script>
import { updateRole } from '@/api/role'

export default {
  name: 'Personinfo',
  data() {
    return {
      form: {
        username: this.$store.state.user.username,
        name: this.$store.state.user.name,
        mobile: this.$store.state.user.mobile,
        email: this.$store.state.user.email,
        headImgUrl: this.$store.state.user.avatar,
        roleIds: this.$store.state.user.avatar
      }
    }
  },
  created() {
    console.log(this.$store.state.user)
  },
  methods: {
    onSubmit() {
      console.log('submit!')
      var id = this.$store.state.user.id
      this.updateInfo(id, this.form)
      console.log(id)
      // this.$message({
      //   message: '保存成功',
      //   type: 'success'
      // })
    },
    updateInfo(id, data) {
      var result = updateRole(id, data).then(response => {
        this.$alert(response.msg, '提示', {
          confirmButtonText: '确认',
          showClose: false
        }).then(res => {
          this.$router.push('/welcome')
        })
      })
      console.log('updateRole', result)
    }
  }
}
</script>

<style scoped>
  .personInfo-contains {
    margin: 60px auto;
    width: 30%;
    min-width: 300px;
  }

</style>
