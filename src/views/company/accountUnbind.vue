<template>
  <!--  企业列表-->
  <div class="app-container">
    <!--<div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="公司名称" class="form-inline">
              <el-input v-model.trim="postForm.name" placeholder="请输入" clearable />
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
              <el-select v-model="postForm.category" placeholder="请选择" filterable>
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
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            &lt;!&ndash;            <el-button type="primary" icon="el-icon-plus" class="fr" @click="handleAdd">新增企业</el-button>&ndash;&gt;
          </el-col>
        </el-row>
      </el-form>
    </div>-->
    <aside>
      全部成员 <strong>{{ tableList.length }}</strong> 个
    </aside>
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
        prop="nickName"
        label="昵称"
        align="center"
      />
      <el-table-column
        prop="thirdId"
        label="openid"
        align="center"
      />
      <el-table-column
        prop="type"
        label="类型"
        align="center"
      />
      <el-table-column
        prop="userId"
        label="用户id"
        align="center"
      />
      <el-table-column
        label="操作"
        width="240"
        align="center"
      >
        <template slot-scope="scope">
          <el-button v-if="userName !== 'test'" type="primary" size="mini" @click="unbind(scope.row)">解绑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import { getOpenIdList, unbindOpenId } from '../../api/user'

export default {
  name: 'AccountUnbind',
  filters: {},
  data() {
    return {
      userName: this.$store.state.user.username,
      tableList: [],
      isLoading: false,
      tableLoading: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
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
      const { data } = await getOpenIdList()
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
     * 解绑
     * */
    async unbind(scope) {
      const { code } = await unbindOpenId(scope.id)
      if (code === 0) {
        this.$message({
          type: 'success',
          message: '解绑成功'
        })
        this.getDataList()
      } else {
        this.$message({
          type: 'error',
          message: '解绑失败'
        })
      }
    }
  }
}
</script>

<style>

</style>
