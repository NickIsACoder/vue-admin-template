<template>
  <div class="modify-contains">
    <el-form ref="form" status-icon :model="form" label-width="80px" :rules="rules">
      <el-form-item label="旧密码" prop="oldpass" required>
        <el-input v-model="form.oldpass" type="password" auto-complete="off" clearable />
      </el-form-item>
      <el-form-item label="新密码" prop="newPass" required>
        <el-input v-model="form.newPass" type="password" auto-complete="off" clearable />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPass" :required="true">
        <el-input v-model="form.confirmPass" type="password" auto-complete="off" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePassword } from '@/api/user'

export default {
  name: 'ModifyPass',
  data() {
    // 自定义规则函数
    var oldpass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('旧密码不能为空'))
      }
      setTimeout(() => {
        if (value.length < 6) {
          callback(new Error('密码必须大于等于6位'))
        } else {
          callback()
        }
      }, 1000)
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.confirmPass !== '') {
          this.$refs.form.validateField('confirmPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldpass: '',
        newPass: '',
        confirmPass: ''
      },
      rules: {
        oldpass: [
          { validator: oldpass, trigger: 'blur' }
        ],
        newPass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit(formName) {
      var params = this.form
      this.$refs[formName].validate((valid) => {
        // 验证通过
        if (valid) {
          const userId = this.$store.state.user.id
          this.CPassword(userId, params)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    CPassword(userId, data) {
      const params = {
        oldPassword: data.oldpass,
        newPassword: data.newPass
      }
      changePassword(userId, params).then(res => {
        if (res) {
          const msg = res.msg
          this.$alert(msg, '提示',
            {
              confirmButtonText: '确定',
              showCancelButton: false
            }
          ).then(async() => {
            this.logout()
          })
        }
      }
      )
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push('/login')// 不重定向
    }
  }
}
</script>

<style scoped>
  .modify-contains {
    margin: 60px auto;
    width: 30%;
    min-width: 300px;
  }

</style>
