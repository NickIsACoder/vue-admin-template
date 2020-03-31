<template>
  <!--  公告管理-->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="50px" label="区域" class="form-inline">
              <el-cascader v-model="postForm.areaAddr" :props="props" clearable style="width: 300px" />
            </el-form-item>
            <el-form-item label-width="50px" label="公告" class="form-inline">
              <el-input v-model.trim="postForm.title" placeholder="请输入需要搜索的标题" clearable style="width: 300px" />
            </el-form-item>
            <el-form-item label-width="90px" label="更新时间段" class="form-inline">
              <el-date-picker
                v-model="postForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>

            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button type="primary" @click="handleAdd">新增公告</el-button>
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
      <el-table-column align="center" label="序号" width="65" type="index" />
      <el-table-column
        label="公告主图"
        width="80"
        align="center"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.picture" :src="scope.row.picture" class="list-img" alt="公告主图">
        </template>
      </el-table-column>
      <el-table-column label="公告" min-width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="区域"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.province">{{ scope.row.province }}</span>
          <span v-if="scope.row.city">- {{ scope.row.city }}</span>
          <span v-if="scope.row.area">- {{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150"
        align="center"
        fix="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
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
import { getNewsList, deleteNews } from '../../api/policy'
import Pagination from '@/components/Pagination'
import { findUserRegionByCode } from '../../api/region'

export default {
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      policyType: '',
      total: 0, // 列表总数
      nowPage: 1, // 底部标签当前页码
      postForm: {
        title: '',
        area: '',
        city: '',
        province: '',
        areaAddr: [],
        sysAreaCode: '',
        beginTime: '',
        endTime: '',
        time: []
      },
      isLoading: false,
      tableLoading: false,
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
    this.getList()
  },
  methods: {
    /**
       * 重置
       */
    reset() {
      this.postForm = {
        title: '',
        time: [],
        area: '',
        city: '',
        province: '',
        areaAddr: []
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
      }
    },
    /**
       * 获取列表
       */
    async getList() {
      this.tableLoading = true
      const { areaAddr, title, time } = this.postForm
      const [beginTime, endTime] = time
      const sysAreaCode = areaAddr[areaAddr.length - 1]
      const params = {
        sysAreaCode, title, beginTime, endTime
      }
      const { data } = await getNewsList(this.pageNo, this.pageSize, params)
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
    pageChange(e) {
      const page = e.page
      const size = e.limit
      this.pageNo = page
      this.nowPage = page
      this.pageSize = size
      this.getList()
    },
    /**
       * 新建公告
       */
    handleAdd() {
      this.$router.push({
        name: 'newsEdit'
      })
    },
    /**
       * 编辑
       * @param scope
       */
    handleEdit(scope) {
      this.$router.push({
        name: 'newsEdit',
        params: {
          row: scope
        }
      })
    },
    /**
       * 删除
       * @param row
       */
    handleDelete(row) {
      const id = row.id
      this.$confirm('是否删除该条记录?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.tableLoading = true
          await deleteNews(id)
          this.getList()
          this.tableLoading = false
          this.$message.success('删除成功！')
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style scoped>
  .list-img {
    width: 60px;
    height: 50px;
  }
</style>
