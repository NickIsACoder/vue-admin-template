<template>
  <!--  政策列表-->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="50px" label="标题" class="form-inline">
              <el-input v-model.trim="postForm.title" placeholder="请输入需要搜索的标题" style="width: 300px" />
            </el-form-item>
            <el-form-item label-width="80px" label="政策类型" class="form-inline">
              <el-select v-model="postForm.type" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="50px" label="区域" class="form-inline">
              <el-cascader v-model="postForm.area" :props="props" clearable />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button v-if="userName !== 'test'" type="primary" icon="el-icon-plus" class="fr" @click="handleAddPolicy">新增政策</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-table
      v-loading="tableLoading"
      :data="policyList"
      border
      style="width: 100%;margin-top:10px;"
      row-key="id"
      header-cell-class-name="warning-row"
    >
      <el-table-column align="center" label="序号" width="65" type="index" />
      <el-table-column label="政策标题" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
          <el-tag v-if="scope.row.tags" size="small">{{ scope.row.tags }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="政策类型"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.category | parseType }}
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
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="userName !== 'test'" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="nowPage"
      :limit.sync="pageSize"
      :layout="listLayout"
      @pagination="pageChange"
    />

  </div>

</template>

<script>
import { getPolicyList, deletePolicy } from '../../api/policy'
import Pagination from '@/components/Pagination'
import { findUserRegionByCode } from '../../api/region'

export default {
  name: 'PolicyList',
  components: { Pagination },
  filters: {
    parseType(val) {
      return val === 1 ? '个人' : '企业'
    }
  },
  data() {
    return {
      userName: this.$store.state.user.username,
      policyList: [], // 政策列表
      pageNo: 1,
      pageSize: 10,
      policyType: '',
      total: 0, // 列表总数
      nowPage: 1, // 底部标签当前页码
      listLayout: 'total, prev, pager, next, jumper', // 标签栏显示的具体内容
      postForm: {
        title: '',
        type: '0',
        area: []
      },
      options: [{
        value: '1',
        label: '个人'
      }, {
        value: '0',
        label: '企业'
      }],
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
    this.getPolicy()
  },
  methods: {
    parseTime(format, time) {
      this.parseTime(format, time)
    },
    /**
     * 重置
     */
    reset() {
      this.postForm = {
        title: '',
        type: '0',
        area: []
      }
      this.getPolicy()
    },
    /**
       * 获取政策列表
       */
    async getPolicy() {
      this.tableLoading = true
      const { area } = this.postForm
      const areaCode = area[area.length - 1]
      const params = {
        type: this.postForm.type,
        key: this.postForm.title,
        sysAreaCode: areaCode
      }
      const { data } = await
      getPolicyList(this.pageNo, this.pageSize, params)
      if (data) {
        var list = data.list
        if (list && list.length > 0) {
          this.policyList = list
          this.total = data.total
        } else {
          this.policyList = []
          this.total = 0
        }
      }
      this.isLoading = false
      this.tableLoading = false
    },
    /**
     * 编辑
     * @param scope
     */
    handleEdit(scope) {
      var id = scope.id
      this.$router.push({
        path: '/policy/policyEdit',
        query: {
          id: id
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
          await deletePolicy(id)
          this.getPolicy()
          this.$message.success('删除成功！')
        })
        .catch(err => {
          console.error(err)
        })
    },
    /**
     * 页面更换
     * @param e
     */
    pageChange(e) {
      var page = e.page
      if (page !== this.pageNo) {
        this.pageNo = page
        this.nowPage = page
        this.getPolicy()
      }
    },
    /**
 * 新建政策
 */
    handleAddPolicy() {
      this.$router.push({
        path: '/policy/policyEdit'
      })
    },
    /**
     * 查询按钮
     */
    async submitForm() {
      if (this.postForm) {
        this.isLoading = true
        this.pageNo = 1
        this.getPolicy()
      }
    }
  }
}
</script>

<style scoped>

</style>
