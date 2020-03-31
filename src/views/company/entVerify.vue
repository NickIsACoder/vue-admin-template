<template>
  <!--  企业审核-->
  <div class="app-container">
    <div>
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="公司名称" class="form-inline">
              <el-input v-model="postForm.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="企业性质" class="form-inline">
              <el-select v-model="postForm.businessNature" placeholder="请选择">
                <el-option
                  v-for="item in busNatureList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="人员规模" class="form-inline">
              <el-select v-model="postForm.scale" placeholder="请选择">
                <el-option
                  v-for="item in scaleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="行业" class="form-inline">
              <el-select v-model="postForm.category" placeholder="请选择">
                <el-option
                  v-for="item in categoryList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="审核情况" class="form-inline">
              <el-select v-model="postForm.examineStatus" placeholder="请选择">
                <el-option
                  v-for="item in examineStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="80px" label="区域" class="form-inline">
              <el-cascader v-model="postForm.area" :props="props" clearable collapse-tags />
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
      style="width: 100%;"
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
        prop="name"
        label="企业全称"
        align="center"
      />
      <el-table-column
        prop="businessNature"
        label="企业性质"
        align="center"
      />
      <el-table-column
        prop="scale"
        label="人员规模"
        align="center"
      />
      <el-table-column
        prop="registeredCapital"
        label="注册资金"
        align="center"
      />
      <el-table-column
        prop="address"
        label="地址"
        align="center"
      />
      <el-table-column
        prop="examineStatusZh"
        label="是否通过审核"
        align="center"
      />
      <el-table-column
        label="操作"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="userName !== 'test'">
            <el-button
              v-if="scope.row.examineStatus === 0 || scope.row.examineStatus === 2"
              type="primary"
              size="small"
              @click="verifyHandle(scope.row)"
            >审核
            </el-button>
          </div>
          <el-button v-if="scope.row.examineStatus === 1" size="small" disabled>已通过审核</el-button>
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
import { getTableList } from '../../api/company'
import Pagination from '@/components/Pagination'
import { getDicList } from '../../api/common'
import { findUserRegionByCode } from '../../api/region'

export default {
  components: { Pagination },
  filters: {},
  data() {
    return {
      userName: this.$store.state.user.username,
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
        examineStatus: '',
        area: []
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
      tableLoading: false,
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
    this.categoryList = getDicList('industry') // 行业类型
    this.busNatureList = getDicList('businessNature') // 企业性质
    this.scaleList = getDicList('scale') // 人员规模
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
    // 重置条件
    reset() {
      this.postForm = {
        name: '',
        businessNature: '',
        scale: '',
        category: '',
        examineStatus: '',
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
      this.postForm.page = this.pageNo
      this.postForm.size = this.pageSize
      const { name, businessNature, scale, category, examineStatus, page, size } = this.postForm
      const codes = []
      for (const item of this.postForm.area) {
        const code = item[item.length - 1]
        codes.push(code)
      }
      const regionCodes = codes.join(',') // 将多选的区域编码用逗号隔开
      const form = {
        name, businessNature, scale, category, examineStatus, page, size, regionCodes
      }
      const { data } = await getTableList(form)
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
       * 进入审核详情
       * @param scope
       */
    verifyHandle(scope) {
      const id = scope.id
      this.$router.push({
        path: '/company/entDetail',
        query: {
          id: id,
          type: '0' // 进入审核页面 ，传 0  表示未审核
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
