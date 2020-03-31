<template>
  <!-- 企业招聘  -->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="用户类型" class="form-inline">
              <el-select v-model="postForm.userType" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="地区" class="form-inline">
              <!--<el-cascader v-model="postForm.area" :props="props" />-->
              <el-cascader v-model="postForm.area" :props="props" clearable collapse-tags />
            </el-form-item>
            <el-form-item label-width="80px" label="批次号" class="form-inline">
              <el-input v-model.trim="postForm.batchNumber" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="经办人" class="form-inline">
              <el-input v-model.trim="postForm.importPeople" placeholder="请输入" clearable />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
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
        prop="userTypeName"
        label="用户类型"
        align="center"
      />
      <el-table-column
        prop="dataCount"
        label="数量"
        align="center"
      />
      <el-table-column
        label="所属区域"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.province">{{ scope.row.province }}</span>
          <span v-if="scope.row.city">-{{ scope.row.city }}</span>
          <span v-if="scope.row.area">-{{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="batchNumber"
        label="批次号"
        align="center"
      />
      <el-table-column
        prop="importPeople"
        label="经办人"
        align="center"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
        align="center"
      />
      <el-table-column
        v-if="userName !== 'test'"
        label="操作"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="excelExport(scope.row)">导出</el-button>
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
import { getImportRecord } from '../../api/support'
import { findUserRegionByCode } from '../../api/region'
import Pagination from '@/components/Pagination'

export default {
  name: 'ImportRecord',
  components: { Pagination },
  filters: {},
  data() {
    return {
      userName: this.$store.state.user.username,
      myHeaders: { Authorization: 'bearer ' + getToken() },
      uploadUrl: '/api/ent/api/v2/ent/excelImport',
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1, // 底部标签当前页码
      postForm: {
        userType: null,
        area: [],
        batchNumber: '',
        importPeople: ''
      },
      typeList: [
        { label: '个人用户', value: 0 },
        { label: '企业用户', value: 1 },
        { label: '游客', value: 2 },
        { label: '超级管理员', value: 3 }
      ], // 用户类型 0-个人用户 1-企业用户 2-游客 3-超级管理员
      isLoading: false,
      tableLoading: false,
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
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    reset() {
      this.postForm = {
        userType: null,
        area: [],
        batchNumber: '',
        importPeople: ''
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
      const { userType, area, batchNumber, importPeople } = this.postForm
      // const regionCodes = area.join(',')
      const regionCodes = area.map(item => item[item.length - 1]).join(',') // 将多选的区域编码用逗号隔开
      const form = {
        userType, batchNumber, importPeople, regionCodes, pageNo: this.pageNo, pageSize: this.pageSize
      }
      const { data } = await getImportRecord(form)
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
     * 导出
     * @param scope
     */
    async excelExport(scope) {
      const { fileUrl } = scope
      if (fileUrl) {
        window.open(fileUrl)
      } else {
        this.$message.error('此批次未提供下载链接')
      }
      // const { batchNumber, importModel } = scope
      // let res = null
      // if (importModel === '企业招聘') {
      //   res = await excelLoadPosition(batchNumber)
      // } else if (importModel === '企业返工') {
      //   res = await excelLoadRework(batchNumber)
      // } else if (importModel === '个人信息') {
      //   res = await excelLoadPerson(batchNumber)
      // }
      // const blob = new Blob([res], { type: 'application/octet-stream' })
      // const downloadElement = document.createElement('a')
      // const href = window.URL.createObjectURL(blob)
      // downloadElement.href = href
      // downloadElement.download = `${batchNumber}.xlsx` // 文件名（自己随意设置）
      // document.body.appendChild(downloadElement)
      // downloadElement.click()
      // document.body.removeChild(downloadElement) // 下载完成移除元素
      // window.URL.revokeObjectURL(href) // 释放掉blob对象
    }
  }
}
</script>

<style>

</style>
