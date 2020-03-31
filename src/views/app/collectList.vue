<template>
  <!--  采集信息配置管理-->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="60px" label="区域" class="form-inline">
              <el-cascader ref="area" v-model="area" :props="props" clearable style="width: 300px" @change="areaChange" />
            </el-form-item>
            <el-form-item label-width="130px" label="针对用户类型" class="form-inline">
              <el-select v-model="postForm.forUserType" placeholder="请选择">
                <el-option
                  v-for="item in forUserTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label-width="60px" label="标题" class="form-inline">
              <el-input v-model.trim="postForm.title" placeholder="请输入" clearable />
            </el-form-item>
            <br>
            <el-form-item label-width="60px" label="状态" class="form-inline">
              <el-select v-model="postForm.state" placeholder="请选择">
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-button type="primary" style="margin-left:20px" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" class="fr" @click="handleAdd">新建采集表</el-button>
            <el-button type="primary" icon="el-icon-s-unfold" class="fr" @click="gotoModule">选择采集模板</el-button>
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
        fixed
      />
      <el-table-column
        prop="id"
        label="id"
        align="center"
      />
      <el-table-column
        label="所属地区"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.province">{{ scope.row.province }}</span>
          <span v-if="scope.row.city">- {{ scope.row.city }}</span>
          <span v-if="scope.row.area">- {{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        align="center"
        width="300"
      />
      <el-table-column
        label="状态"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.state === 0 ? '未发布' : '进行中' }}
        </template>
      </el-table-column>
      <el-table-column
        label="针对用户类型"
        align="center"
        width="120"
      >
        <template slot-scope="scope">
          {{ scope.row.forUserType === 0 ? '个人' : '企业' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间"
        align="center"
        width="180"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
        align="center"
        width="180"
      />
      <el-table-column
        label="操作"
        width="220"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-dropdown @command="onOptionClick($event, scope.row)">
            <el-button type="danger" size="mini">
              更多<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="preview">预览问卷</el-dropdown-item>
              <el-dropdown-item command="publish">{{ scope.row.state === 0 ? '发布问卷' : '下架问卷' }}</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import { getSurveyList, delSurvey, releaseSurvey, withdrawnSurvey } from '../../api/app'
import Pagination from '@/components/Pagination'
import { getArea } from '../../api/region'

export default {
  components: { Pagination },
  filters: {
  },
  data() {
    return {
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1,
      area: [],
      postForm: {
        name: '',
        state: '',
        title: '',
        // type: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: ''
      },
      isLoading: false,
      tableLoading: false,
      statusList: [
        { label: '未发布', value: 0 },
        { label: '进行中', value: 1 }
      ],
      typeList: [
        { label: '标准', value: 1 },
        { label: '模板', value: 2 },
        { label: '自定义', value: 3 }
      ],
      forUserTypeList: [
        { label: '个人', value: 0 },
        { label: '企业', value: 1 }
      ],
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          getArea(node.value || 100000).then((res) => {
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
      this.postForm = {}
      this.area = []
      this.getDataList()
    },
    gotoModule() {
      this.$router.push({
        path: '/app/surveyModule'
      })
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
      const params = {
        city: this.postForm.city,
        cityCode: this.postForm.cityCode,
        province: this.postForm.province,
        provinceCode: this.postForm.provinceCode,
        area: this.postForm.area,
        areaCode: this.postForm.areaCode,
        state: this.postForm.state,
        title: this.postForm.title,
        forUserType: this.postForm.forUserType
        // type: this.postForm.type
      }
      const { data } = await
      getSurveyList(this.pageNo, this.pageSize, params)
      if (data) {
        var list = data.list
        if (list && list.length > 0) {
          this.tableList = list
          this.total = data.total
          for (const o of this.tableList) {
            const index = this.typeList.findIndex(function(val) {
              return val.value === o.type
            })
            o.type = this.typeList[index].label
          }
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
      this.getDataList()
    },
    /**
     * 级联选择器切换赋值
     */
    areaChange() {
      const node = this.$refs.area.getCheckedNodes()
      const [provinceCode, cityCode, areaCode] = node[0].path
      const [province, city, area] = node[0].pathLabels
      this.postForm.province = province
      this.postForm.provinceCode = provinceCode
      this.postForm.city = city
      this.postForm.cityCode = cityCode
      this.postForm.area = area
      this.postForm.areaCode = areaCode
    },
    /**
     * 新增采集表
     */
    handleAdd() {
      sessionStorage.setItem('moduleAdd', 'newAdd')
      this.$router.push({
        path: `/app/addForm`
      })
    },
    /**
       * 编辑
       * @param row
       */
    handleEdit(row) {
      sessionStorage.setItem('survey', JSON.stringify(row))
      sessionStorage.setItem('moduleAdd', 'edit')
      this.$router.push({
        path: `/app/addForm/${row.id}`
      })
    },
    /**
       * 操作按钮 更多
       * @param {string} command
       * @param {object} row
       */
    onOptionClick(command, row) {
      switch (command) {
        case 'preview':
          this.$router.push({
            path: '/app/preview',
            query: {
              id: row.id
            }
          })
          break
        case 'publish':
          if (row.state === 0) {
            this.releaseSurvey(row)
          } else {
            this.withdrawnSurvey(row)
          }
          break
        case 'delete':
          this.handleDelete(row)
          break
      }
    },
    /**
     * 发布问卷
     * @param {object} scope
     */
    async releaseSurvey(scope) {
      this.$confirm('确定要发布该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        releaseSurvey(scope.id).then(() => {
          this.getDataList()
          this.$message.success('发布成功')
        }).catch(() => {
          this.$message.error('发布失败')
        })
      })
    },
    /**
     * 下架问卷
     * @param {object} scope
     */
    async withdrawnSurvey(scope) {
      this.$confirm('确定要下架该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        withdrawnSurvey(scope.id).then(() => {
          this.getDataList()
          this.$message.success('操作成功')
        }).catch(() => {
          this.$message.error('操作失败')
        })
      })
    },
    /**
       * 删除
       * @param scope
       */
    async handleDelete(scope) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delSurvey(scope.id).then(() => {
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
