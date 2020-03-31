<template>
  <!-- 个人求职  -->
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
            <el-form-item label-width="80px" label="姓名" class="form-inline">
              <el-input v-model="postForm.personName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="联系方式" class="form-inline">
              <el-input v-model="postForm.mobile" placeholder="请输入" clearable />
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
        :key="col.label+col.prop"
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
import { getPersonList, deletePerson, exportPerson, excelImportsTemplate } from '../../api/support'
import Pagination from '@/components/Pagination'
import { findUserRegionByCode } from '../../api/region'

export default {
  name: 'PersonalJobList',
  components: { Pagination },
  filters: {},
  data() {
    return {
      userName: this.$store.state.user.username,
      myHeaders: { Authorization: 'bearer ' + getToken() },
      // uploadUrl: '/api/person/api/v2/person/excelImport',
      uploadUrl: '/api/person/api/v2/person/excelImportData',
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1, // 底部标签当前页码
      postForm: {
        personName: '',
        mobile: '',
        time: [],
        area: []
      },
      isLoading: false,
      isImporting: false,
      isExporting: false,
      tableLoading: false,
      checkList: [],
      tableColumns: [
        { prop: 'name', label: '姓名', initial: true },
        { prop: 'idCard', label: '身份证' },
        { prop: 'sexDes', label: '性别' },
        { prop: 'ageName', label: '年龄' },
        { prop: 'mobile', label: '手机号码', initial: true },
        { prop: 'educationName', label: '学历' },
        { prop: 'area', label: '现居地', initial: true },
        { prop: 'nowAddress', label: '详细地址' },
        { prop: 'expectIndustryName', label: '期望行业' },
        { prop: 'expectJobTypeName', label: '期望岗位', initial: true },
        { prop: 'expectJobSalaryName', label: '期望薪资', initial: true },
        { prop: 'jobNatureName', label: '期望工作性质' },
        { prop: 'expectArea', label: '期望工作地点', initial: true },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'updateTime', label: '更新时间', initial: true }
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
        checkStrictly: true
      },
      distinctList: []
    }
  },
  created() {
    this.getDataList()
    this.checkList = this.tableColumns.filter(col => col.initial).map(col => col.label)
    this.getDistincts() // 区域
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
        personName: '',
        mobile: '',
        time: [],
        area: []
      }
      this.pageNo = 1
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
      const { personName, mobile, time } = this.postForm
      const [beginTime, endTime] = time
      const codes = []
      for (const item of this.postForm.area) {
        const code = item[item.length - 1]
        codes.push(code)
      }
      const regionCodes = codes.join(',') // 将多选的区域编码用逗号隔开
      const form = {
        page: this.pageNo,
        size: this.pageSize,
        personName, mobile, beginTime, endTime, regionCodes
      }
      const { data } = await getPersonList(form)
      if (data) {
        var list = data.list
        if (list && list.length > 0) {
          this.tableList = list.map((item) => ({
            ...item,
            area: item.nowProvince + '-' + item.nowCity + '-' + item.nowArea,
            expectArea: item.expectJobProvince + '-' + item.expectJobCity + '-' + item.expectJobArea
          }))
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
      console.log(e)
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
      const { code } = await deletePerson(scope.id)
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
      // window.open('./template/个人求职模板.xls')
      const res = await excelImportsTemplate()
      const blob = new Blob([res], { type: 'application/octet-stream' })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      downloadElement.download = '个人求职模板.xls' // 文件名（自己随意设置）
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    },
    async excelExport() {
      this.isExporting = true
      const { personName, mobile, area, time } = this.postForm
      const [beginTime, endTime] = time
      // const [nowProvince, nowCity, nowArea] = area
      const codes = []
      for (const item of area) {
        const code = item[item.length - 1]
        codes.push(code)
      }
      const regionCodes = codes.join(',') // 将多选的区域编码用逗号隔开
      const form = {
        personName, mobile, beginTime, endTime, regionCodes
      }
      const res = await exportPerson(form)
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
      const { code, msg } = res
      if (code === 0) {
        this.$message.success(msg)
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
