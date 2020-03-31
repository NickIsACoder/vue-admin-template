<template>
  <!--  毕业生报到信息列表-->
  <div class="app-container">
    <div style="margin-bottom: 10px;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="40px" label="姓名" class="form-inline">
              <el-input v-model="postForm.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="身份证号" class="form-inline">
              <el-input v-model="postForm.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="电话号码" class="form-inline">
              <el-input v-model="postForm.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="报到状态" class="form-inline">
              <el-select v-model="postForm.examineStatus" placeholder="请选择">
                <el-option
                  v-for="item in examineStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="是否就业" class="form-inline">
              <el-select v-model="postForm.examineStatus" placeholder="请选择">
                <el-option
                  v-for="item in examineStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-upload" class="fr" @click="handleAdd">导出</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableList"
      border
      style="width: 100%;"
      row-key="id"
      header-cell-class-name="warning-row"
    >
      <el-table-column align="center" label="序号" width="65" type="index" :index="(index)=>{return (index+1) + (pageNo-1)*pageSize}" />
      <el-table-column
        prop="name"
        label="姓名"
        align="center"
      />
      <el-table-column
        prop="businessNature"
        label="手机号码"
        align="center"
      />
      <el-table-column
        prop="scale"
        label="身份证号"
        align="center"
      />
      <el-table-column
        prop="address"
        label="毕业年份"
        align="center"
      />
      <el-table-column
        prop="examineStatusZh"
        label="毕业院校"
        align="center"
      />
      <el-table-column
        prop="scale"
        label="学历"
        align="center"
      />
      <el-table-column
        prop="address"
        label="是否就业"
        align="center"
      />
      <el-table-column
        prop="examineStatusZh"
        label="报到状态"
        align="center"
      />
      <el-table-column
        label="操作"
        width="280"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goDetail(scope.row)">详情</el-button>
          <!--          <el-button type="primary" size="mini" @click="handleDelete(scope.row)">修改密码</el-button>-->
          <!--          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>-->
          <!--          <el-dropdown trigger="click" @command="handleCommand">-->
          <!--            <el-button type="primary" size="mini">-->
          <!--              更多<i class="el-icon-arrow-down el-icon&#45;&#45;right" />-->
          <!--            </el-button>-->
          <!--            <el-dropdown-menu slot="dropdown">-->
          <!--              <el-dropdown-item :command="`edit-${scope.row.id}`">修改密码</el-dropdown-item>-->
          <!--              <el-dropdown-item :command="`del-${scope.row.id}`">删除</el-dropdown-item>-->
          <!--            </el-dropdown-menu>-->
          <!--          </el-dropdown>-->
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

  </div>

</template>

<script>
import { getTableList, deleteData } from '../../api/company'
import { getDictionary, getPositionType } from '../../api/user'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {},
  data() {
    return {
      tableList: [], // 列表数据
      pageNo: 1,
      pageSize: 10,
      total: 0, // 列表总数
      nowPage: 1, // 底部标签当前页码
      postForm: {
        name: '',
        businessNature: '',
        scale: '',
        category: '',
        examineStatus: ''
      },
      busNatureList: [], // 企业性质字典列表
      scaleList: [], // 人员规模
      categoryList: [], // 行业类别列表
      examineStatusList: [
        {
          value: '0',
          label: '未审核'
        }, {
          value: '1',
          label: '已通过审核'
        }, {
          value: '2',
          label: '审核未通过'
        }
      ], // 审核状态
      isLoading: false,
      tableLoading: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 重置条件
    reset() {
      this.postForm = {
        name: '',
        businessNature: '',
        scale: '',
        category: '',
        examineStatus: ''
      }
      this.getDataList()
    },
    /**
       * 查询按钮
       */
    async submitForm() {
      if (this.postForm) {
        this.isLoading = true
        this.pageNo = 1
        this.getDataList()
      }
    },
    /**
       * 获取列表
       */
    async getDataList() {
      this.tableLoading = true
      this.postForm.page = this.pageNo
      this.postForm.size = this.pageSize
      const { data } = await getTableList(this.postForm)
      if (data) {
        var list = data.list
        if (list && list.length > 0) {
          this.tableList = list
          this.total = data.total
        } else {
          this.tableList = []
          this.total = 0
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
      this.getDataList()
    },
    /**
       * 进入详情
       * @param scope
       */
    goDetail(scope) {
      const id = scope.id
      this.$router.push({
        path: '/company/entDetail',
        query: {
          id: id
        }
      })
    },
    /**
       * 修改企业
       * @param scope
       */
    modifyHandle(scope) {
      const id = scope.id
      this.$router.push({
        path: '/company/companyEdit',
        query: {
          id: id
        }
      })
    },
    /**
     * 更多按钮 下拉后 出现两个按钮
     * @param {string} command
     */
    handleCommand(command) {
      const strs = command.split('-')
      // type 为类型， id 为 传参的id
      const type = strs[0]
      const id = strs[1]
      if (type === 'edit') {
        this.handleEditPwd(id)
      } else if (type === 'del') {
        this.$confirm('确定要删除该条记录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleDelete(id)
        }).catch(() => {
        })
      }
    },
    /**
     * 修改密码
     * @param id
     */
    async handleEditPwd(id) {
      // const { code } = await deleteData(id)
      // if (code === 0) {
      //   this.$message({
      //     type: 'success',
      //     message: '修改密码成功'
      //   })
      //   this.getDataList()
      // } else {
      //   this.$message({
      //     type: 'error',
      //     message: '修改密码失败'
      //   })
      // }
    },
    /**
       * 删除(更改企业状态)
       * @param scope
       */
    async handleDelete(scope) {
      const { code } = await deleteData(scope)
      if (code === 0) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getDataList()
      } else {
        this.$message({
          type: 'error',
          message: '删除失败'
        })
      }
    },

    /**
       * 新增企业
       */
    handleAdd() {
      this.$router.push({
        path: '/company/companyEdit'
      })
    },
    /**
       * 获取字典
       */
    async getDictionary(type, typeList) {
      const { code, data } = await getDictionary(type)
      if (code === 0 && data.length > 0) {
        data.forEach((val) => {
          const temp = {}
          temp.value = val.code
          temp.label = val.msg
          typeList.push(temp)
        })
      } else {
        typeList = []
      }
    },
    /**
       * 获取职位
       */
    async getPosition(codeNum, codeList) {
      const pageNo = 1
      const pageSize = 100
      const { code, data } = await getPositionType(pageNo, pageSize, codeNum)
      if (code === 0 && data.list.length > 0) {
        const res = data.list
        res.forEach((val) => {
          const temp = {}
          temp.value = val.code
          temp.label = val.msg
          codeList.push(temp)
        })
      } else {
        codeList = []
      }
    }

  }
}
</script>

<style>

</style>
