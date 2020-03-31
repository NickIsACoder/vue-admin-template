<template>
  <div class="app-container">
    <el-container>
      <!-- 左侧菜单-->
      <el-aside width="30%">
        <el-tree :data="roleList" :props="defaultProps" default-expand-all @node-click="handleNodeClick" />
      </el-aside>
      <!-- 右侧内容-->
      <el-main>
        <el-button type="primary" @click="handAddRes">添加资源</el-button>
        <el-table
          v-loading="tableLoading"
          :data="resourcesList"
          border
          style="width: 100%;margin-top:10px;"
          row-key="id"
          header-cell-class-name="warning-row"
        >
          <el-table-column align="center" label="序号" width="65" type="index" :index="(index)=>{return (index+1) + (pageNo-1)*pageSize}" />
          <el-table-column
            prop="name"
            label="资源名称"
            align="center"
          />
          <el-table-column
            prop="url"
            label="资源URL"
            align="center"
          />
          <el-table-column
            label="资源类型"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.type === 'url' ? '链接' : '按钮' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="description"
            label="资源描述"
            align="center"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="warning" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页-->
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="nowPage"
          :limit.sync="pageSize"
          :layout="listLayout"
          @pagination="pageChange"
        />

      </el-main>
    </el-container>
    <!-- 弹出窗-->
    <!-- 修改新增资源的弹窗-->
    <el-dialog :visible.sync="dialogResVisible" :title="dialogType === 'new'? '新建资源':'编辑资源'">
      <el-form ref="resourcesForm" :model="resItem" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="资源父级" :hidden="dialogType === 'edit'" required>
          <el-select v-model="chooseValue" placeholder="请选择" @change="chooseChange">
            <el-option
              v-for="item in chooseList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="resItem.level" placeholder="请选择">
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="资源code" prop="code">
          <el-input v-model.trim="resItem.code" placeholder="请输入资源code" clearable />
        </el-form-item>
        <el-form-item label="资源名称" prop="name">
          <el-input v-model.trim="resItem.name" placeholder="请输入资源名称" clearable />
        </el-form-item>
        <el-form-item label="资源方法" prop="method">
          <el-input v-model.trim="resItem.method" placeholder="请输入资源方法" clearable />
        </el-form-item>
        <el-form-item label="资源url" prop="url">
          <el-input v-model.trim="resItem.url" placeholder="请输入资源url" clearable />
        </el-form-item>
        <el-form-item label="资源描述" prop="description">
          <el-input v-model.trim="resItem.description" placeholder="请输入资源描述" clearable />
        </el-form-item>
        <el-form-item label="资源类型" prop="type">
          <el-radio-group v-model="resItem.type">
            <el-radio label="url" border>链接</el-radio>
            <el-radio label="button" border>按钮</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogResVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRes">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getRes, getResAll, findResById, modifyRes, addRes, deleteRes } from '@/api/resource'
/**
 * 复制方法
 */
import { deepClone } from '@/utils'
import { updateRole } from '../../api/role'

export default {
  name: 'Resources',
  components: { Pagination },
  data() {
    return {
      roleList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      total: 0,
      nowPage: 1,
      pageNo: 1,
      pageSize: 10,
      listLayout: 'total, prev, pager, next, jumper', // 标签栏显示的具体内容
      resourcesList: [],
      chooseList: [], // 选择列表
      dialogResVisible: false, // 显示新建资源弹出窗
      dialogType: 'new', // 弹出窗 ,默认是新增，如果是编辑就是edit
      choosePageSize: 100,
      choosePageNo: 1,
      chooseValue: [],
      tableLoading: false,
      levelList: [
        { label: '根路径', value: 1 },
        { label: '链接url', value: 2 },
        { label: '按钮', value: 3 }
      ], // "1是根路径，2是url，3-按钮",
      resItem: {
        code: '',
        name: '',
        method: '',
        description: '',
        url: '',
        type: 'url',
        parentId: '',
        level: ''
      }, // 弹出窗内容
      rules: {
        level: [{ required: true, message: '请选择级别', trigger: 'blur' }],
        code: [{ required: true, message: '请输入资源code', trigger: 'blur' }],
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        method: [{ required: true, message: '请输入资源方法', trigger: 'blur' }],
        url: [{ required: true, message: '请输入资源url', trigger: 'blur' }],
        type: [{ required: true, message: '请选择资源类型', trigger: 'blur' }]
      }
    }
  },
  /**
     * 页面创建调用
     * */
  created() {
    this.getRoles()
  },
  methods: {
    /**
       * 编辑
       * @param scope
       */
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.resItem = scope

      this.dialogResVisible = true
      this.$nextTick(() => {
        this.$refs['resourcesForm'].clearValidate()
      })
      this.getRes()
    },
    /**
       *
       * @param scope
       */
    async handleDelete(scope) {
      const { code } = await deleteRes(scope.id)
      if (code === 0) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getRoles()
      }
    },
    /**
       * 页面
       * @param e
       */
    pageChange(e) {
      var page = e.page
      if (page !== this.pageNo) {
        this.pageNo = page
        this.nowPage = page
        this.getRoles()
      }
    },
    /**
       * 添加资源
       * @param e
       */
    handAddRes(e) {
      this.dialogType = 'new'
      var parentId = this.resItem.parentId
      this.resItem = {
        type: '菜单',
        parentId: parentId
      }
      this.dialogResVisible = true

      this.$nextTick(() => {
        this.$refs['resourcesForm'].clearValidate()
      })
      this.getRes()
    },
    /**
       * 树形点击
       * @param e
       */
    async handleNodeClick(e) {
      var id = e.id
      this.resourcesList.length = 0
      this.resItem.parentId = id
      this.chooseValue = e.name
      var { data } = await findResById(id)
      if (data) {
        this.resourcesList.push(data)
      } else {
        this.resourcesList.push(e)
      }
    },
    /**
     * 获取页面路由列表
     */
    async getRes() {
      this.tableLoading = true
      const { data } = await getRes(this.choosePageNo, this.choosePageSize)
      this.tableLoading = false
      if (data) {
        this.chooseList = data.list
      } else {
        this.$message({
          message: '没有节点可以选择',
          type: 'error'
        })
      }
    },
    /**
       * 获取页面路由列表
       */
    async getRoles() {
      const res = await getResAll()
      this.roleList.length = 0
      if (res.data) {
        this.roleList = this.roleList.concat(res.data)
        if (this.roleList) {
          var id = this.roleList[0].id
          var newList = []
          const { data } = await findResById(id)
          if (data) {
            newList.push(data)
            this.resourcesList = newList
          } else {
            this.resourcesList = []
          }
        }
      }
    },
    /**
     * 弹窗确认按钮
     */
    async confirmRes() {
      if (!this.resItem.parentId) {
        this.$message.error('请选择资源父级')
        return
      }
      this.$refs['resourcesForm'].validate((valid) => {
        if (valid) {
          const params = {
            code: this.resItem.code,
            description: this.resItem.description,
            level: this.resItem.level,
            method: this.resItem.method,
            name: this.resItem.name,
            parentId: this.resItem.parentId,
            type: this.resItem.type,
            url: this.resItem.url
          }
          if (this.dialogType === 'new') { // 新建
            addRes(params).then(() => {
              this.dialogResVisible = false
              this.getRoles()
              this.$message.success('添加成功')
              this.chooseValue = ''
            })
          } else { // 修改
            modifyRes(this.resItem.id, params).then(() => {
              this.dialogResVisible = false
              this.getRoles()
              this.$message.success('修改成功')
              this.chooseValue = ''
            })
          }
        }
      })
    },
    /**
     * 选择变化
     * @param e
     */
    chooseChange(e) {
      if (this.chooseList) {
        var item = this.chooseList.find(item => item.name === e)
        this.resItem.parentId = item.id
        console.log(e, this.resItem.parentId)
      }
    }

  }
}
</script>

<style scoped>

</style>
