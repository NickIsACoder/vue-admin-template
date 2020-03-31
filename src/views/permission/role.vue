<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddRole">新增角色</el-button>
    <!-- 角色列表-->
    <el-table v-loading="tableLoading" :data="rolesList" style="width: 100%;margin-top:10px;" border header-cell-class-name="warning-row">
      <el-table-column align="center" label="序号" width="65" type="index" :index="(index)=>{return (index+1) + (pageNo-1)*pageSize}" />
      <el-table-column align="center" label="角色英文">
        <template slot-scope="scope">
          {{ scope.row.code }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="更新人员">-->
      <!--        <template slot-scope="scope">-->
      <!--          {{ scope.row.updatedBy }}-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" label="更新时间">
        <template slot-scope="scope">
          {{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}') }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="warning" size="small" @click="handleResourse(scope)">权限</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
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
    <!-- 修改新增用户的弹窗-->
    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'修改角色':'新建角色'">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="角色英文名" prop="code">
          <el-input v-model="roleForm.code" placeholder="请输入角色英文名称" />
        </el-form-item>
        <el-form-item label="角色名称" :required="dialogType!=='edit'" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" :required="false">
          <el-input v-model="roleForm.description" placeholder="请输入角色描述" />
        </el-form-item>

      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">确定</el-button>
      </div>
    </el-dialog>
    <!-- 修改新增资源的弹窗-->
    <el-dialog :visible.sync="dialogResVisible" :title="dialogResTitle">
      <el-tree
        ref="tree"
        default-expand-all
        :check-strictly="checkStrictly"
        :data="routesData"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        class="permission-tree"
      />
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogResVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRes">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoles, addRole, deleteRole, updateRole, getRoleResTree } from '@/api/role'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      roleForm: {
        code: '',
        name: '',
        description: ''
      },
      rules: {
        code: [{ required: true, message: '请输入角色英文名', trigger: 'blur' }],
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      routes: [],
      rolesList: [],
      dialogVisible: false,
      dialogResVisible: false,
      dialogResTitle: '角色赋权',
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      pageNo: 1, // 页码
      pageSize: 10, // 页面显示大小
      total: 0, // 列表总数
      nowPage: 1, // 底部标签当前页码
      listLayout: 'total, prev, pager, next, jumper', // 标签栏显示的具体内容
      tableLoading: false
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoles(this.pageNo, this.pageSize)
  },
  methods: {
    parseTime(format, time) {
      this.parseTime(format, time)
    },

    async getRoles() {
      this.tableLoading = true
      const res = await getRoles(this.pageNo, this.pageSize)
      this.rolesList = res.data.list
      this.total = res.data.total
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
      this.getRoles()
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.roleForm = {
        code: '',
        name: '',
        description: ''
      }
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
      this.roleForm = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('是否删除该角色吗?', '提示语', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.tableLoading = true
          await deleteRole(this.rolesList[$index].id)
          this.rolesList.splice($index, 1)
          this.tableLoading = false
          this.getRoles()
          this.$message.success('删除成功')
        })
        .catch(err => { console.error(err) })
    },

    async confirmRole() {
      const isEdit = this.dialogType === 'edit'
      this.$refs['roleForm'].validate(valid => {
        if (valid) {
          const params = {
            code: this.roleForm.code,
            name: this.roleForm.name,
            description: this.roleForm.description
          }
          if (isEdit) {
            updateRole(this.roleForm.id, params).then((res) => {
              if (res.code === 0) {
                this.$message.success('修改成功')
                this.dialogVisible = false
                this.getRoles()
              }
            })
          } else {
            addRole(params).then((res) => {
              if (res.code === 0) {
                this.$message.success('新增成功')
                this.dialogVisible = false
                this.getRoles()
              }
            })
          }
        }
      })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    },

    /**
     *修改权限
     *
     * @param scope
     */
    async  handleResourse(scope) {
      this.dialogResVisible = true
      this.checkStrictly = true
      this.roleForm = deepClone(scope.row)
      var id = this.roleForm.id
      var { data } = await getRoleResTree(id)
      if (data) {
        this.routes = data.resourceTree
        this.$nextTick(() => {
          console.log('this.getCheckItem', this.getCheckItem(this.routes))
          this.$refs.tree.setCheckedKeys(this.getCheckItem(this.routes))
          // set checked state of a node not affects its father and child nodes
          this.checkStrictly = false
        })
      }
    },
    getCheckItem(list) {
      let data = []
      list.forEach(item => {
        if (item.selected) {
          data.push(item.id)
        }
        if (item.children && item.children.length > 0) {
          const temp = this.getCheckItem(item.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },

    /**
     *
     * @param event
     */
    async confirmRes(event) {
      var checkList = this.$refs.tree.getCheckedKeys()
      var parentCheckList = this.$refs.tree.getHalfCheckedKeys()
      if (parentCheckList) {
        checkList = checkList.concat(parentCheckList)
      }
      if (checkList) {
        this.dialogResVisible = false
        var params = {
          code: this.roleForm.code,
          name: this.roleForm.name,
          description: this.roleForm.description,
          resourceIds: checkList
        }
        const { code } = await updateRole(this.roleForm.id, params)
        if (code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getRoles()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
