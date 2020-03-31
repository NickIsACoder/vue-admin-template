<template>
  <div class="app-container">
    <el-form ref="postForm" :model="postForm" class="form-container">
      <el-row type="flex" :gutter="20" justify="start">
        <el-col :span="24">
          <el-form-item label-width="80px" label="名称" class="form-inline">
            <el-input v-model="postForm.name" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label-width="80px" label="用户类型" class="form-inline">
            <el-select v-model="postForm.userType" placeholder="请选择">
              <el-option
                v-for="item in userTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
          <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
          <el-button type="primary" @click="handleAddUser">新增用户</el-button>
        </el-col>
      </el-row>
    </el-form>
    <!-- 用户列表-->
    <el-table
      v-loading="tableLoading"
      :data="userList"
      style="width: 100%;margin-top:30px;"
      border
      header-cell-class-name="warning-row"
    >
      <el-table-column
        align="center"
        label="序号"
        width="65"
        type="index"
        :index="(index)=>{return (index+1) + (pageNo-1)*pageSize}"
      />
      <el-table-column align="center" label="用户名" prop="username" />
      <el-table-column align="center" label="名称" prop="name" />
      <el-table-column align="center" label="用户类型" prop="userType" />
      <el-table-column align="center" label="电话" prop="mobile" />
      <el-table-column align="center" label="邮箱" prop="email" />
      <el-table-column align="center" label="机构" prop="organizationName" />
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="注册时间">
        <template slot-scope="scope">
          {{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope)">删除</el-button>
          <el-button type="primary" size="mini" style="margin-top: 6px" @click="handleReset(scope)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="nowPage"
      :limit.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @pagination="pageChange"
    />
    <!-- 修改新增用户的弹窗-->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改用户':'新建用户'">
      <el-form ref="userInfo" :rules="userRules" :model="userInfo" label-width="80px" label-position="right">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="userInfo.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="dialogType!=='edit'">
          <el-input
            v-model.trim="userInfo.password"
            placeholder="请输入密码"
            type="password"
            :disabled="dialogType==='edit'"
            clearable
          />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model.trim="userInfo.name" placeholder="请输入名称" clearable />
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input
            v-model.trim="userInfo.mobile"
            placeholder="请输入电话"
            clearable
            auto-complete="off"
            @wheel.native.prevent="stopScrollFun($event)"
          />
        </el-form-item>
        <el-form-item label="头像">
          <el-input v-model.trim="userInfo.headimgUrl" placeholder="请输入头像链接" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="userInfo.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="机构" prop="organization">
          <el-select v-model="userInfo.organization" placeholder="请选择" style="width: 100%" @change="changeOrgan">
            <el-option
              v-for="item in orgList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" required prop="userType">
          <el-radio-group v-model="userInfo.userType" required :disabled="isEdit" @change="changeUserType">
            <el-radio :label="0">个人用户</el-radio>
            <el-radio :label="1">企业用户</el-radio>
            <el-radio :label="3">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色" required prop="type">
          <el-radio-group v-model="userInfo.type" size="mini" @change="changeRadio">
            <el-radio v-for="(item,index) in roleList" :key="index" style="margin: 5px 5px;" :label="item.id" border>{{
              item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
   * 导入组件
   */
import Pagination from '@/components/Pagination'
import { getUserList, addUser, deleteUser, uploadUser, getUserResById, handleReset } from '@/api/user'
import { getRoles } from '@/api/role'
import { getOrganList } from '@/api/organ'
import { deepClone } from '@/utils'
import { isLengthMax6, validateEmail, validateMobile, validateChinese } from '@/utils/validate.js'

export default {
  name: 'UserManager',
  components: { Pagination },
  data() {
    return {
      total: 0,
      pageNo: 1, // 页码
      nowPage: 1,
      pageSize: 10,
      userList: [], // 数据列表
      dialogType: 'new',
      dialogVisible: false,
      userInfo: {
        organization: '',
        role: [],
        userType: -1
      },
      userRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }, { validator: validateChinese, trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }, { validator: isLengthMax6, trigger: 'blur' }],
        organization: [{ required: true, message: '机构不能为空', trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        userType: [{ required: true, message: '用户类型不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '角色不能为空', trigger: 'blur' }]
      },
      roleList: [],
      tableLoading: false,
      typeList: [
        { label: '个人用户', value: 0 },
        { label: '企业用户', value: 1 },
        { label: '游客', value: 2 },
        { label: '超级管理员', value: 3 }
      ], // 用户类型 0-个人用户 1-企业用户 2-游客 3-超级管理员
      orgList: [],
      isEdit: false,
      postForm: {
        name: '',
        userType: ''
      },
      isLoading: false,
      userTypeList: [
        { label: '个人用户', value: 0 },
        { label: '企业用户', value: 1 },
        { label: '超级管理员', value: 3 }
      ]
    }
  },
  created() {
    // 进来先获取用户列表
    this.getList()
    // 获取机构下拉选择
    this.getOrgList()
  },
  methods: {
    parseTime(format, time) {
      this.parseTime(format, time)
    },
    /**
       * 编辑
       * @param scope
       */
    async handleEdit(scope) {
      this.dialogType = 'edit'
      this.isEdit = true
      // 获取列表
      await this.getRoleList()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['userInfo'].clearValidate()
      })
      this.userInfo = deepClone(scope.row)
      // this.userInfo.organization = [this.userInfo.organization]
      var { data } = await getUserResById(scope.row.id)
      var userType = data.userType
      this.$set(this.userInfo, 'userType', userType)
      console.log('handleEdit', data)
      if (data.setRole && data.setRole.length > 0) {
        var id = data.setRole[0].id
        this.$set(this.userInfo, 'type', id)
      }
    },
    /**
       * 锁定
       * @param scope
       */
    handleLock(scope) {
      console.log('handleLock', scope)
    },
    /**
       * 锁定
       * @param scope
       */
    handleDelete({ $index, row }) {
      var id = row.id
      this.$confirm('是否删除该账号?', '提示语', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.tableLoading = true
          await deleteUser(id)
          this.userList.splice($index, 1)
          this.tableLoading = false
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
        })
        .catch(err => {
          console.error(err)
        })
    },
    /**
       * 新增用户
       */
    async handleAddUser() {
      this.getRoleList()
      this.dialogType = 'new'
      this.isEdit = false
      this.userInfo = {}
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['userInfo'].clearValidate()
      })
    },
    /**
       *确认新增或者修改
       */
    async confirmRole() {
      this.$refs['userInfo'].validate((valid) => {
        if (valid) {
          console.log('this.userInfo.userType', this.userInfo.userType)
          const isEdit = this.dialogType === 'edit'
          var roleIds = []
          if (this.userInfo.type) {
            roleIds.push(parseInt(this.userInfo.type))
          }
          const params = {
            email: this.userInfo.email,
            headimgUrl: this.userInfo.headimgUrl,
            name: this.userInfo.name,
            username: this.userInfo.username,
            password: this.userInfo.password,
            mobile: this.userInfo.mobile,
            roleIds: roleIds,
            userType: this.userInfo.userType,
            organization: this.userInfo.organization
          }

          if (isEdit) {
            this.dialogVisible = false
            delete this.userInfo.type
            uploadUser(this.userInfo.id, params).then(res => {
              if (res.code === 0) {
                this.$message.success('修改成功')
                this.getList()
              }
            }).catch(res => {
            })
          } else {
            this.dialogVisible = false
            addUser(params).then(response => {
              var code = response.code
              if (code === 0) {
                this.userInfo.key = this.userInfo.username
                const { username } = this.userInfo
                this.$message.success('新增成功')
                this.$notify({
                  title: '提示语',
                  dangerouslyUseHTMLString: true,
                  message: `<div>用户名: ${username}</div>`,
                  type: 'success'
                })
              }
              this.getList()
            }).catch(res => {
            })
          }
        } else {
          console.log('校验不成功')
        }
      })
      console.log('校验不成功2')
    },
    /**
       *  取消新增或者修改 弹窗
       */
    cancel() {
      this.dialogVisible = false
      this.$refs.userInfo.resetFields()
    },
    /**
       * 获取列表
       * @returns {Promise<void>}
       */
    async getList() {
      this.tableLoading = true
      var { data } = await getUserList(this.pageNo, this.pageSize, this.postForm.userType, this.postForm.name)
      if (data.list) {
        this.userList = data.list.filter(v => v.userType !== 2) // 用户类型为游客的不显示
        this.total = data.total
        for (const o of this.userList) {
          const index = this.typeList.findIndex(function(val) {
            return val.value === o.userType
          })
          o.userType = this.typeList[index].label
        }
      }
      this.isLoading = false
      this.tableLoading = false
    },
    /**
       * 页面更换
       * @param e
       */
    pageChange(e) {
      const page = e.page
      const size = e.limit
      this.pageNo = page
      this.nowPage = page
      this.pageSize = size
      this.getList()
    },
    /**
       *获取角色列表
       * @returns {Promise<void>}
       */
    async getRoleList() {
      this.tableLoading = true
      // var { data } = await getRoles(this.pageNo, this.pageSize)
      var { data } = await getRoles(1, 9999)
      if (data.list) {
        this.roleList = data.list
      }
      this.tableLoading = false
    },

    /**
       *角色类型选择
       */
    changeRadio(value) {
      this.userInfo.type = value
      this.userInfo.role = []
      this.userInfo.role.push(value)
    },
    /**
       * 用户类型选择
       * @param value
       */
    changeUserType(value) {
      console.log('changeUserType', value)
      this.userInfo.userType = value
    },
    /*
    * 获取机构列表
    * */
    async getOrgList() {
      const { data } = await getOrganList(1, 99999, {})
      if (data && data.list) {
        this.orgList = data.list.map((org) => ({
          label: org.departmentName,
          value: org.id
        }))
      }
    },
    changeOrgan(value) {
      console.log('changeOrgan', value)
      this.userInfo.organization = value
    },
    // 重置条件
    reset() {
      this.postForm = {
        name: '',
        userType: ''
      }
      this.getList()
    },
    /**
     * 查询按钮
     */
    async submitForm() {
      if (this.postForm) {
        this.isLoading = true
        this.pageNo = 1
        this.getList()
        this.isLoading = false
      }
    },
    /**
     * 重置密码
     * @param scope
     */
    handleReset({ $index, row }) {
      var id = row.id
      this.$confirm('是否重置密码?', '提示语', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.tableLoading = true
          await handleReset(id)
          this.tableLoading = false
          this.$message({
            type: 'success',
            message: '重置密码成功！'
          })
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  stopScrollFun(evt) {
    evt = evt || window.event
    if (evt.preventDefault) {
      // Firefox
      evt.preventDefault()
      evt.stopPropagation()
    } else {
      // IE
      evt.cancelBubble = true
      evt.returnValue = false
    }
    return false
  }

}
</script>

<style scoped>
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none  !important;;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }

</style>
