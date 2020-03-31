<template>
  <!--  企业列表-->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-button type="primary" @click="handleAdd">新增大屏</el-button>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
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
        prop="id"
        label="id"
        width="65"
        align="center"
      />
      <el-table-column
        prop="name"
        label="名称"
        align="center"
      />
      <el-table-column
        label="区域"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.province">{{ scope.row.province }}</span>
          <span v-if="scope.row.city">-{{ scope.row.city }}</span>
          <span v-if="scope.row.area">-{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="连接"
        width="260"
        align="left"
      >
        <template slot-scope="scope">
          <a :href="scope.row.url" target="_blank">{{ scope.row.url }}</a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="primary" size="mini" @click="modifyHandle(scope.row)">详情</el-button>
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
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改':'新增'">
      <el-form ref="monitorForm" :model="monitorForm" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="区域" prop="areaList">
          <!--<el-input v-model="monitorForm.area" placeholder="请输入区域" />-->
          <el-cascader
            ref="area"
            v-model="monitorForm.areaList"
            :options="distinctList"
            :props="{value: 'id', label: 'name', checkStrictly: true}"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="大屏名称" prop="name">
          <el-input v-model="monitorForm.name" placeholder="请输入大屏名称" />
        </el-form-item>
        <el-form-item label="url地址" :required="false">
          <el-input v-model="monitorForm.url" placeholder="请输入url地址" />
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmMonitor">确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getTableList, deleteData, addMonitor, updateMonitor } from '../../api/monitor'
import { getAreaTree } from '../../api/region'
import { deepClone } from '@/utils'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  filters: {},
  data() {
    return {
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1, // 底部标签当前页码
      postForm: {},
      isLoading: false,
      tableLoading: false,
      dialogVisible: false,
      dialogType: '',
      monitorForm: {
        areaList: '',
        name: '',
        url: ''
      },
      rules: {
        areaList: [{ required: true, message: '请选择区域', trigger: 'blur' }],
        name: [{ required: true, message: '请输入大屏名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入url地址', trigger: 'blur' }]
      },
      distinctList: []
    }
  },
  created() {
    this.getDataList()
    this.getDistincts()
  },
  methods: {
    /**
     * 获取全部区域
     */
    async getDistincts() {
      const res = await getAreaTree(100000)
      this.distinctList = []
      if (res.data) {
        this.distinctList = this.distinctList.concat(res.data)
      }
    },
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
      this.postForm.pageNo = this.pageNo
      this.postForm.pageSize = this.pageSize
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
       * 修改大屏
       * @param scope
       */
    modifyHandle(scope) {
      const { minAreaCode } = scope
      this.$router.push({
        path: '/monitor/monitorEdit',
        query: { area: minAreaCode }
      })
    },
    handleAdd() {
      this.monitorForm = {
        areaList: '',
        name: '',
        url: ''
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['monitorForm'].clearValidate()
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      const areaList = []
      if (scope.row.provinceCode) areaList.push(scope.row.provinceCode)
      if (scope.row.cityCode) areaList.push(scope.row.cityCode)
      if (scope.row.areaCode) areaList.push(scope.row.areaCode)
      this.monitorForm = Object.assign(deepClone(scope.row), { areaList })
    },
    async confirmMonitor() {
      const isEdit = this.dialogType === 'edit'
      this.$refs['monitorForm'].validate(valid => {
        if (valid) {
          const nodes = this.$refs.area.getCheckedNodes()
          const [provinceCode, cityCode, areaCode] = nodes[0].path
          const [province, city, area] = nodes[0].pathLabels
          const params = {
            id: this.monitorForm.id,
            minAreaCode: this.monitorForm.areaList[this.monitorForm.areaList.length - 1],
            name: this.monitorForm.name,
            url: this.monitorForm.url,
            provinceCode: provinceCode || '',
            cityCode: cityCode || '',
            areaCode: areaCode || '',
            province: province || '',
            city: city || '',
            area: area || ''
          }
          if (isEdit) {
            updateMonitor(params).then((res) => {
              if (res.code === 0) {
                this.$message.success('修改成功')
                this.dialogVisible = false
                this.submitForm()
              }
            })
          } else {
            addMonitor(params).then((res) => {
              if (res.code === 0) {
                this.$message.success('新增成功')
                this.dialogVisible = false
                this.submitForm()
              }
            })
          }
        }
      })
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
    }
  }
}
</script>

<style>

</style>
