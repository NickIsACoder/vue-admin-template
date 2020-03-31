<template>
  <!-- 机构  -->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="区域" class="form-inline">
              <el-cascader v-model="postForm.area" :props="props" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="机构名称" class="form-inline">
              <el-input v-model.trim="postForm.departmentName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="联系方式" class="form-inline">
              <el-input v-model.trim="postForm.phone" placeholder="请输入" clearable />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" class="fr" @click="handleAdd">新增机构</el-button>
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
        prop="departmentName"
        label="机构名称"
        align="center"
      />
      <el-table-column
        prop="phone"
        label="联系方式"
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
        prop="description"
        label="备注"
        align="center"
      />
      <el-table-column
        label="操作"
        width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
    <!-- 弹出窗-->
    <!-- 修改新增的弹窗-->
    <el-dialog :visible.sync="dialogResVisible" :title="dialogType === 'new'? '添加机构':'编辑机构'" :before-close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="机构名称" prop="departmentName">
          <el-input v-model.trim="form.departmentName" placeholder="请输入机构名称" />
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model.trim="form.phone" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-cascader
            ref="area"
            v-model="form.area"
            :options="distinctList"
            :props="{value: 'id', label: 'name', checkStrictly: true}"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model.trim="form.description" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmDialog">确定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { getOrganList, addOrg, updateOrg, deleteOrg } from '../../api/organ'
import { getArea, getAreaTree } from '../../api/region'
import Pagination from '@/components/Pagination'

export default {
  name: 'Organ',
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
        departmentName: '',
        phone: '',
        area: []
      },
      isLoading: false,
      tableLoading: false,
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
      },
      dialogResVisible: false, // 显示新建弹出窗
      dialogType: 'new', // 弹出窗 ,默认是新增，如果是编辑就是edit
      form: {
        departmentName: '',
        phone: '',
        area: [],
        description: ''
      },
      rules: {
        departmentName: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        area: [{ required: true, message: '请选择区域', trigger: 'blur' }]
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
      this.postForm = {
        departmentName: '',
        phone: '',
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
      const { departmentName, phone, area } = this.postForm
      const areaCode = area[area.length - 1]
      const form = {
        departmentName, phone, areaCode
      }
      const { data } = await getOrganList(this.pageNo, this.pageSize, form)
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
      const { code } = await deleteOrg(scope.id)
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
     * 添加机构
     * @param e
     */
    handleAdd(e) {
      this.dialogType = 'new'
      this.form = {
        departmentName: '',
        phone: '',
        area: [],
        description: ''
      }
      this.dialogResVisible = true
    },
    /**
    * 编辑机构
     * @param scope
    * */
    handleEdit(scope) {
      this.dialogType = 'edit'
      const area = []
      if (scope.provinceCode) area.push(parseInt(scope.provinceCode))
      if (scope.cityCode) area.push(parseInt(scope.cityCode))
      if (scope.areaCode) area.push(parseInt(scope.areaCode))
      this.form = {
        id: scope.id,
        departmentName: scope.departmentName,
        phone: scope.phone,
        area: area,
        description: scope.description
      }
      this.dialogResVisible = true
    },
    /*
    * 提交弹窗
    * */
    confirmDialog() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const { id, departmentName, phone, description } = this.form
          const nodes = this.$refs.area.getCheckedNodes()
          const [provinceCode, cityCode, areaCode] = nodes[0].path
          const [province, city, area] = nodes[0].pathLabels
          if (this.dialogType === 'new') {
            const data = {
              departmentName, phone, description, provinceCode, cityCode, areaCode, province, city, area
            }
            addOrg(data).then((res) => {
              const { code, msg } = res
              if (code === 0) {
                this.dialogResVisible = false
                this.$message.success('添加成功')
                this.getDataList()
              } else {
                this.$message.err(msg)
              }
            })
          } else if (this.dialogType === 'edit') {
            const data = {
              id, departmentName, phone, description,
              provinceCode: provinceCode || '',
              cityCode: cityCode || '',
              areaCode: areaCode || '',
              province: province || '',
              city: city || '',
              area: area || ''
            }
            updateOrg(data).then((res) => {
              const { code, msg } = res
              if (code === 0) {
                this.dialogResVisible = false
                this.$message.success('修改成功')
                this.getDataList()
              } else {
                this.$message.err(msg)
              }
            })
          }
        }
      })
    },
    /*
    * 关闭弹窗
    * */
    closeDialog() {
      if (this.$refs.area && this.$refs.area.panel && this.$refs.area.panel.clearCheckedNodes) {
        this.$refs.area.panel.clearCheckedNodes()
      }
      this.$refs.form.resetFields()
      this.dialogResVisible = false
    }
  }
}
</script>

<style>

</style>

