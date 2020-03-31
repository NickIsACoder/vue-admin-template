<template>
  <!-- 求职者信息列表 -->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="姓名" class="form-inline">
              <el-input v-model.trim="postForm.personName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="身份证号" class="form-inline">
              <el-input v-model.trim="postForm.idCard" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="联系方式" class="form-inline">
              <el-input v-model.trim="postForm.mobile" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="当前状态" class="form-inline">
              <el-select v-model="postForm.personalState" placeholder="请选择" clearable>
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="现居地" class="form-inline" clearable>
              <el-cascader ref="postArea" v-model="postForm.area" :props="props" clearable collapse-tags style="min-width: 300px" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button type="primary" @click="handleAdd">新增求职者信息</el-button>
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
      row-key="index"
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
        label="期待薪酬"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.hopeSalarySmall > 0 && scope.row.hopeSalaryBig > 0">
            <span v-if="scope.row.hopeSalarySmall > 0">{{ scope.row.hopeSalarySmall }}K </span>
            <span v-if="scope.row.hopeSalaryBig > 0"> - {{ scope.row.hopeSalaryBig }} K</span>
          </span>
          <span v-else>面议</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="220"
        align="center"
        fix="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goDetail(scope.row)">详情</el-button>
          <el-button type="primary" size="mini" @click="modifyHandle(scope.row)">修改</el-button>
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
import { getSeekerList } from '../../api/jobSeeker'
import Pagination from '@/components/Pagination'
import { findUserRegionByCode } from '../../api/region'
import { getDicList } from '../../api/common'
import { deletePerson } from '../../api/support'

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
      postForm: {
        personName: '',
        personalState: '',
        idCard: '',
        mobile: '',
        area: []
      },
      isLoading: false,
      isImporting: false,
      isExporting: false,
      tableLoading: false,
      checkList: [],
      tableColumns: [
        { prop: 'name', label: '姓名', initial: true },
        { prop: 'idCard', label: '身份证号', initial: true },
        { prop: 'sexDes', label: '性别', initial: true },
        { prop: 'birthday', label: '出生年月' },
        { prop: 'mobile', label: '联系方式' },
        { prop: 'educationName', label: '学历', initial: true },
        { prop: 'area', label: '现居地', initial: true },
        { prop: 'personalStateName', label: '当前状态', initial: true },
        { prop: 'expectJobTypeName', label: '期望岗位', initial: true },
        { prop: 'jobNatureName', label: '期望工作性质' },
        { prop: 'expectArea', label: '期望工作地点', initial: true },
        { prop: 'createTime', label: '创建时间' },
        { prop: 'updateTime', label: '更新时间' }
      ],
      stateList: [], // 当前状态
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
    this.checkList = this.tableColumns.filter(col => col.initial).map(col => col.label)
    this.stateList = getDicList('personalState') // 当前状态
  },
  methods: {
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
      const { personName, mobile, idCard, personalState } = this.postForm
      const codes = []
      for (const item of this.postForm.area) {
        const code = item[item.length - 1]
        codes.push(code)
      }
      const regionCodes = codes.join(',') // 将多选的区域编码用逗号隔开
      const form = {
        page: this.pageNo,
        size: this.pageSize,
        personName, mobile, idCard, personalState, regionCodes
      }
      const { data } = await getSeekerList(form)
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
      const page = e.page
      const size = e.limit
      this.pageNo = page
      this.pageSize = size
      this.getDataList()
    },
    /**
       * 新增求职者信息
       */
    handleAdd() {
      this.$router.push({
        path: '/jobSeeker/seekerEdit'
      })
    },
    /**
       * 修改
       * @param scope
       */
    modifyHandle(scope) {
      const id = scope.userId
      this.$router.push({
        path: '/jobSeeker/seekerEdit',
        query: {
          id: id
        }
      })
    },
    /**
       * 进入详情
       * @param scope
       */
    goDetail(scope) {
      const id = scope.userId
      this.$router.push({
        path: '/jobSeeker/seekerDetail',
        query: {
          id: id
        }
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
        deletePerson(scope.id).then((res) => {
          if (res.code === 0) {
            this.getDataList()
            this.$message.success('删除成功')
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    }
  }
}
</script>

<style>

</style>
