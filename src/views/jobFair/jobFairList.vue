<template>
  <!--  招聘会列表-->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="区域" class="form-inline">
              <el-cascader v-model="postForm.area" :props="props" clearable />
            </el-form-item>
            <el-form-item label-width="100px" label="招聘会名称" class="form-inline">
              <el-input v-model.trim="postForm.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="状态" class="form-inline">
              <el-select v-model="postForm.status" placeholder="请选择">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="100px" label="招聘会类型" class="form-inline">
              <el-select v-model="postForm.type" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button v-if="userName !== 'test'" type="primary" icon="el-icon-plus" class="fr" @click="handleAdd">新增招聘会</el-button>
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
        prop="title"
        label="标题"
        align="left"
        width="300"
      />
      <el-table-column
        prop="status"
        label="状态"
        align="center"
      />
      <el-table-column
        label="区域"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column
        label="招聘会类型"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.type | parseType }}
        </template>
      </el-table-column>
      <el-table-column
        label="已报名展位数"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.usedPositionNum }}
        </template>
      </el-table-column>
      <el-table-column
        label="展位数"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.positionNum }}
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="举办地址"
        align="center"
      />

      <el-table-column
        label="操作"
        width="220"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goDetail(scope.row)">详情</el-button>
          <el-button v-if="userName !== 'test'" type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="userName !== 'test'" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
import { getJobList, deleteJob } from '../../api/jobFair'
import Pagination from '@/components/Pagination'
import { getArea, findUserRegionByCode } from '../../api/region'

export default {
  components: { Pagination },
  filters: {
    parseType(val) {
      return val === 1 ? '现场招聘会' : '网络招聘会'
    }
  },
  data() {
    return {
      userName: this.$store.state.user.username,
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1, // 底部标签当前页码
      postForm: {
        name: '',
        status: '',
        type: '',
        area: []
      },
      isLoading: false,
      tableLoading: false,
      statusList: [
        { label: '未开始', value: 1 },
        { label: '进行中', value: 2 },
        { label: '已结束', value: 3 }
      ],
      typeList: [
        { label: '现场招聘会', value: 1 },
        { label: '网络招聘会', value: 2 }
      ],
      props: {
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
        name: '',
        status: '',
        type: '',
        area: []
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
      const { area } = this.postForm
      const areaCode = area[area.length - 1]
      const params = {
        name: this.postForm.name,
        status: this.postForm.status,
        type: this.postForm.type,
        areaCode: areaCode
      }
      const { data } = await
      getJobList(this.pageNo, this.pageSize, params)
      if (data) {
        var list = data.list
        if (list && list.length > 0) {
          this.tableList = list
          this.total = data.total
          for (const o of this.tableList) {
            const index = this.statusList.findIndex(function(val) {
              return val.value === o.status
            })
            o.status = this.statusList[index].label
          }
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
        path: '/jobFair/jobFairDetail',
        query: {
          id: id
        }
      })
    },
    /**
       * 编辑
       * @param scope
       */
    handleEdit(scope) {
      var id = scope.id
      this.$router.push({
        path: '/jobFair/jobFairEdit',
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
      const { code } = await deleteJob(scope.id)
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
       * 新建
       */
    handleAdd() {
      this.$router.push({
        path: '/jobFair/jobFairEdit'
      })
    }
  }
}
</script>

<style scoped>

</style>
