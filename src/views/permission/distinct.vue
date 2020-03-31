<template>
  <div class="app-container">
    <el-container>
      <!-- 左侧菜单-->
      <el-aside width="30%">
        <!--:data="distinctList" 直接获取三级改为懒加载一级一级往下查-->
        <el-tree
          :props="defaultProps"
          :load="loadNode"
          lazy
          node-key="id"
          :default-expanded-keys="[100000]"
          accordion
          highlight-current
          @node-click="handleNodeClick"
        />
      </el-aside>
      <!-- 右侧内容-->
      <el-main>
        <el-button type="primary" @click="handAddRes">添加区域</el-button>
        <el-table
          v-loading="tableLoading"
          :data="resourcesList"
          border
          style="width: 100%;margin-top:10px;"
          row-key="id"
          header-cell-class-name="warning-row"
        >
          <el-table-column align="center" label="序号" width="65" type="index" :index="(index) => (index + 1)" />
          <el-table-column
            prop="id"
            label="区域id"
            align="center"
          />
          <el-table-column
            prop="name"
            label="名称"
            align="center"
          />
          <el-table-column
            prop="pinyin"
            label="拼音"
            align="center"
          />
          <el-table-column
            prop="mername"
            label="组合名称"
            align="center"
          />
          <el-table-column
            prop="sname"
            label="简称"
            align="center"
          />
          <el-table-column
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
    <!-- 弹出窗-->
    <!-- 修改新增资源的弹窗-->
    <el-dialog :visible.sync="dialogResVisible" :title="dialogType === 'new'? '添加区域':'编辑区域'" :before-close="closeDialog">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
        <el-form-item label="区域id" prop="id">
          <el-input v-model.number="form.id" type="number" placeholder="请输入区域id" />
        </el-form-item>
        <el-form-item label="区域名称" prop="name">
          <el-input v-model.trim="form.name" placeholder="请输入区域名称" />
        </el-form-item>
        <el-form-item label="拼音" prop="pinyin">
          <el-input v-model.trim="form.pinyin" placeholder="请输入拼音" />
        </el-form-item>
        <el-form-item label="组合名称">
          <el-input v-model.trim="form.mername" placeholder="请输入组合名称" />
        </el-form-item>
        <el-form-item label="区域简称">
          <el-input v-model.trim="form.sname" placeholder="请输入区域简称" />
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input v-model.trim="form.lng" placeholder="请输入经度" />
        </el-form-item>
        <el-form-item label="纬度" prop="lng">
          <el-input v-model.trim="form.lat" placeholder="请输入纬度" />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="confirmRes">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAreaTree, getArea, addRegion, updateRegion, delRegion } from '@/api/region'
import { validatelng, validateChinese } from '@/utils/validate.js'

export default {
  name: 'Distinct',
  data() {
    return {
      distinctList: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      resourcesList: [],
      dialogResVisible: false, // 显示新建资源弹出窗
      dialogType: 'new', // 弹出窗 ,默认是新增，如果是编辑就是edit
      tableLoading: false,
      form: {
        id: null,
        name: '',
        pinyin: '',
        mername: '',
        sname: '',
        lng: null,
        lat: null
      },
      rules: {
        id: [{ required: true, message: '请输入区域id', trigger: 'blur' }],
        name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
        pinyin: [{ validator: validateChinese, trigger: 'blur' }],
        lng: [{ validator: validatelng, trigger: 'blur' }]
      },
      selectNode: {},
      node: [], // 记录树形的数据， 用来新增修改删除后做更新操作
      resolve: null // 同上
    }
  },
  /**
     * 页面创建调用
     * */
  created() {
    // this.getDistincts()
  },
  methods: {
    /*
    * 树结构 懒加载
    * */
    loadNode(node, resolve) {
      // 没有数据时，即 初始化时 记录node,resolve 为了以后更新操作
      if (node.level === 0) {
        this.node = node
        this.resolve = resolve
      }
      // 设置了默认展开 中国， 同时默认把选中的selectNode设置成中国，方便用户一进来可以直接做中国下的区域添加
      if (node.level === 1) {
        this.selectNode = node.data
        this.getTable(this.selectNode.id)
      }
      getArea(node.level === 0 ? 0 : node.data.id).then(res => {
        const { code, data } = res
        if (code === 0) {
          resolve(data)
        }
      })
    },
    /*
    * 更新树数据
    * */
    resetTree() {
      this.node.childNodes = []
      this.loadNode(this.node, this.resolve)
    },
    /**
       * 编辑
       * @param scope
       */
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.form = scope

      this.dialogResVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    /*
    * 删除区域
    * @param scope
    * */
    async handleDelete(scope) {
      const { code } = await delRegion(scope.id)
      if (code === 0) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.resetTree()
        // this.getDistincts()
      }
    },
    /**
       * 添加区域
       * @param e
       */
    handAddRes(e) {
      this.dialogType = 'new'
      this.form = {
        id: null,
        name: '',
        pinyin: '',
        mername: '',
        sname: '',
        lng: null,
        lat: null,
        pid: this.selectNode.id,
        level: this.selectNode.level + 1
      }

      this.dialogResVisible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    /**
       * 树形点击
       * @param node
       */
    async handleNodeClick(node) {
      this.selectNode = node
      this.getTable(this.selectNode.id)
    },
    /*
    * 获取右边表格
    * */
    async getTable(id) {
      this.tableLoading = true
      const { data } = await getArea(id)
      if (data) {
        this.resourcesList = data
      } else {
        this.resourcesList = []
      }
      this.tableLoading = false
    },
    /**
     * 获取全部区域
     */
    async getDistincts() {
      const res = await getAreaTree(0)
      this.distinctList = []
      if (res.data) {
        this.distinctList = this.distinctList.concat(res.data)
        if (this.distinctList && this.distinctList.length) {
          this.selectNode = this.distinctList[0]
          this.getTable(this.selectNode.id)
        }
      }
    },
    /*
    * 关闭弹窗 并且重置表单
    * */
    closeDialog() {
      // this.$refs.form.resetFields()
      this.dialogResVisible = false
    },
    /**
       * 弹窗确认按钮
       */
    async confirmRes() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.dialogType === 'new') { // 新建
            addRegion(this.form).then(() => {
              this.dialogResVisible = false
              this.$message.success('添加成功')
              this.resetTree()
              // this.getDistincts()
            })
          } else { // 修改
            updateRegion(this.form).then(() => {
              this.dialogResVisible = false
              this.$message.success('修改成功')
              this.resetTree()
              // this.getDistincts()
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
