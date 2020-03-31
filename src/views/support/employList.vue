<template>
  <!-- 企业招聘  -->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <!--<el-form-item label-width="80px" label="地区" class="form-inline">
              <el-cascader v-model="postForm.area" :props="props" />
            </el-form-item>-->
            <el-form-item label-width="80px" label="时间段" class="form-inline">
              <el-date-picker
                v-model="postForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label-width="80px" label="企业名称" class="form-inline">
              <el-input v-model.trim="postForm.entName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="联系方式" class="form-inline">
              <el-input v-model.trim="postForm.tel" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="岗位" class="form-inline">
              <el-cascader v-model="postForm.position" :props="postProps" />
            </el-form-item>
            <el-form-item label-width="80px" label="区域" class="form-inline">
              <el-cascader v-model="postForm.area" :props="props" clearable collapse-tags />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button type="primary" @click="downloadTemp">模板下载</el-button>
            <el-upload
              accept=".xls,.xlsx"
              :headers="myHeaders"
              :action="uploadUrl"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              style="display: inline-block"
            >
              <el-button type="primary" :loading="isImporting">导入</el-button>
            </el-upload>
            <el-button type="primary" :loading="isExporting" @click="excelExport">导出</el-button>
            <!--            <el-button type="primary" icon="el-icon-plus" class="fr" @click="handleAdd">新增企业</el-button>-->
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="text-align: right;">
      <el-dropdown :hide-on-click="false">
        <span class="el-dropdown-link">
          筛选字段<i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-checkbox-group v-model="checkList">
            <el-dropdown-item
              v-for="col in tableColumns"
              :key="col.prop"
            >
              <el-checkbox :label="col.label" />
            </el-dropdown-item>
          </el-checkbox-group>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="tableList"
      border
      style="width: 100%;margin-top:10px;"
      row-key="positionId"
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
        v-for="col in tableColumns.filter(coloum => checkList.indexOf(coloum.label) !== -1)"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        align="center"
      />
      <el-table-column
        v-if="userName !== 'test'"
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNo"
      :limit.sync="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      @pagination="pageChange"
    />
  </div>

</template>

<script>
import { getToken } from '@/utils/auth'
import { getEmployList, deleteEmploy, exportEmploy, downloadImportPositionTemplate } from '../../api/support'
import { getPositionType } from '../../api/user'
import Pagination from '@/components/Pagination'
import { findUserRegionByCode } from '../../api/region'

export default {
  name: 'EmployList',
  components: { Pagination },
  filters: {},
  data() {
    return {
      userName: this.$store.state.user.username,
      myHeaders: { Authorization: 'bearer ' + getToken() },
      // uploadUrl: '/api/ent/api/v2/ent/excelImport',
      uploadUrl: '/api/ent/api/v2/ent/excelImportPosition',
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1, // 底部标签当前页码
      postForm: {
        entName: '',
        tel: '',
        time: [],
        area: [],
        position: []
      },
      isLoading: false,
      isImporting: false,
      isExporting: false,
      tableLoading: false,
      checkList: [],
      tableColumns: [
        // 企业全称  联系电话  招聘岗位  招聘人数  工作地点  年龄要求  薪资待遇 更新时间
        { prop: 'name', label: '企业全称', initial: true },
        { prop: 'postsTels', label: '联系电话', initial: true },
        { prop: 'postsName', label: '招聘岗位', initial: true },
        { prop: 'posts', label: '招聘人数', initial: true },
        { prop: 'postAddress', label: '工作地点', initial: true },
        { prop: 'ageRangeDesc', label: '年龄要求', initial: true },
        { prop: 'salaryDesc', label: '薪资待遇', initial: true },
        { prop: 'updatedTimeDesc', label: '更新时间', initial: true }

      ],
      areaList: [],
      props: {
        multiple: true,
        lazy: true,
        lazyLoad(node, resolve) {
          findUserRegionByCode(node.value || 100000).then((res) => {
            let nodes = []
            if (res.code === 0 && res.data) {
              nodes = res.data.map((area) => ({
                label: area.name,
                value: area.id,
                leaf: area.level > 2
              }))
            }
            resolve(nodes)
          })
        },
        checkStrictly: false
      },
      postProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          getPositionType(1, 99, node.value || '').then((res) => {
            let nodes = []
            if (res.code === 0 && res.data) {
              nodes = res.data.list.map((post) => ({
                label: post.msg,
                value: post.code,
                leaf: node.level > 1
              }))
            }
            resolve(nodes)
          })
        }
      },
      distinctList: []
    }
  },
  created() {
    this.getDataList()
    this.checkList = this.tableColumns.filter(col => col.initial).map(col => col.label)
    this.getDistincts()// 区域
  },
  methods: {
    /**
     * 获取全部区域
     */
    async getDistincts() {
      const res = await findUserRegionByCode(100000)
      this.distinctList = []
      if (res.data) {
        this.distinctList = this.distinctList.concat(res.data)
      }
    },
    reset() {
      this.postForm = {
        name: '',
        tel: '',
        time: [],
        area: [],
        position: []
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
      const { entName, tel, time, position } = this.postForm
      const [beginTime, endTime] = time
      const positionCode = (position && position.length) ? position[position.length - 1] : ''
      const codes = []
      for (const item of this.postForm.area) {
        const code = item[item.length - 1]
        codes.push(code)
      }
      const regionCodes = codes.join(',') // 将多选的区域编码用逗号隔开
      const form = {
        page: this.pageNo,
        size: this.pageSize,
        entName, tel, beginTime, endTime, positionCode, regionCodes
      }
      const { data } = await getEmployList(form)
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
      // this.nowPage = page
      this.pageSize = size
      this.getDataList()
    },
    /**
       * 删除简历
       * @param scope
       */
    async handleDelete(scope) {
      const { code } = await deleteEmploy(scope.positionId)
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
    async downloadTemp() {
      // window.open('./template/企业招聘模板.xls')
      const res = await downloadImportPositionTemplate()
      const blob = new Blob([res], { type: 'application/octet-stream' })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = '企业招聘模板.xls' // 文件名（自己随意设置）
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    },
    async excelExport() {
      this.isExporting = true
      const { entName, tel, area, time, position } = this.postForm
      const [beginTime, endTime] = time
      const codes = []
      for (const item of area) {
        const code = item[item.length - 1]
        codes.push(code)
      }
      const regionCodes = codes.join(',') // 将多选的区域编码用逗号隔开
      const positionCode = (position && position.length) ? position[position.length - 1] : ''
      const form = {
        entName, tel, beginTime, endTime, regionCodes, positionCode
      }
      const res = await exportEmploy(form)
      const blob = new Blob([res], { type: 'application/octet-stream' })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = 'excel.xlsx' // 文件名（自己随意设置）
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
      this.isExporting = false
    },
    beforeUpload() {
      this.isImporting = true
    },
    handleSuccess(res) {
      this.isImporting = false
      const { code, msg, data } = res
      if (code === 0) {
        this.$message.success(data || msg)
        this.getDataList()
      } else {
        this.$message.error(msg)
      }
    }
  }
}
</script>

<style>

</style>
