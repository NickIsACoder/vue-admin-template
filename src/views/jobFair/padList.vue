<template>
  <!--  pad设备管理-->
  <div class="app-container">
    <div style="margin: 30px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-button type="primary" icon="el-icon-plus" class="fr" @click="handleAdd">新建展位</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableList"
      border
      style="width: 100%;margin-top:10px;"
      row-key="id"
      header-cell-class-name="warning-row"
    >
      <el-table-column
        align="center"
        label="序号"
        width="65"
        type="index"
        :index="(index)=>{return (index+1) + (pageNo-1)*pageSize}"
      />
      <el-table-column
        prop="sn"
        label="设备序号"
        align="center"
      />
      <el-table-column
        prop="mac"
        label="设备mac"
        align="center"
        width="400"
      />
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.status | parseType }}
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="220"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button type="primary" size="mini" @click="handleClose(scope.row)">关机</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="nowPage"
      :limit.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @pagination="pageChange"
    />
    <!--    新增设备-->
    <el-dialog :title="dialogStatus === 'edit'?'修改设备':'新增设备'" :visible.sync="dialogVisible" width="520px">
      <el-form ref="dataForm" :rules="rules" :model="padForm" label-position="right" label-width="100px">
        <el-form-item label="设备序号" prop="sn">
          <el-input v-model="padForm.sn" />
        </el-form-item>
        <el-form-item label="设备mac" prop="mac">
          <el-input v-model="padForm.mac" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmForm">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { padList, addPad, delPad } from '../../api/jobFair'
import Pagination from '@/components/Pagination'
import { getArea } from '../../api/user'

export default {
  components: { Pagination },
  filters: {
    parseType(val) {
      // 1,开机 2 .关机
      return val === '1' ? '开机' : '关机'
    }
  },
  data() {
    return {
      tableList: [], // 列表数据
      pageNo: 1,
      pageSize: 10,
      total: 0, // 列表总数
      nowPage: 1, // 底部标签当前页码
      postForm: {
        name: '',
        status: '',
        type: ''
      },
      isLoading: false,
      tableLoading: false,
      dialogVisible: false,
      dialogStatus: 'create',
      padForm: {
        mac: '', // 设备mac
        sn: '' // 设备序号
      },
      rules: {
        mac: [{ required: true, message: '设备mac 不能为空', trigger: 'blur' }],
        sn: [{ required: true, message: '设备序号不能为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    reset() {
      this.postForm = {}
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
      const params = {}
      const { data } = await
      padList(this.pageNo, this.pageSize)
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
       * 重置弹窗字段
       */
    resetTemp() {
      this.padForm = {
        mac: '', // 设备mac
        sn: '' // 设备序号
      }
    },
    /**
       * 新增设备
       */
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 确定提交
       */
    async confirmForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            mac: this.padForm.mac,
            sn: this.padForm.sn
          }
          if (this.dialogStatus === 'create') {
            addPad(params).then(() => {
              this.dialogVisible = false
              this.getDataList()
              this.$notify({
                title: '提示语',
                message: '添加设备成功',
                type: 'success',
                duration: 2000
              })
            })
          } else if (this.dialogStatus === 'edit') {
            // 修改设备 调接口
            addPad(params).then(() => {
              this.dialogVisible = false
              this.getDataList()
              this.$notify({
                title: '提示语',
                message: '修改设备成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        }
      })
    },
    /**
       * 编辑
       * @param row
       */
    handleEdit(row) {
      this.dialogStatus = 'edit'
      this.dialogVisible = true
      this.padForm = Object.assign({}, row) // copy obj
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 关机、开机
       * @param scope
       */
    async handleClose(scope) {
      this.$confirm('确定要关闭该设备吗?', '提示语', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPad(scope.id).then(() => {
          this.getDataList()
          this.$message.success('修改状态成功')
        }).catch(() => {
          this.$message.error('修改状态失败')
        })
      })
    },
    /**
       * 删除
       * @param scope
       */
    async handleDelete(scope) {
      this.$confirm('确定要删除该条记录吗?', '提示语', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delPad(scope.id).then(() => {
          this.getDataList()
          this.$message.success('删除成功')
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
