<template>
  <!--  应用管理-->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="应用名称" class="form-inline">
              <el-input v-model.trim="postForm.name" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="区域" class="form-inline">
              <el-cascader ref="area" v-model="areaAddr" :props="props" clearable style="width: 300px" @change="areaChange" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" class="fr" @click="handleAdd">新建应用</el-button>
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
        prop="name"
        label="应用名称"
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
        label="应用地址"
        align="center"
      >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.url" placement="top-start">
            <span>{{ scope.row.url }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="应用图"
        align="center"
      >
        <template slot-scope="scope">
          <img v-if="scope.row.picture" :src="scope.row.picture" class="list-img" alt="应用图">
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="添加时间"
        align="center"
        width="160"
      />
      <el-table-column
        prop="updateTime"
        label="更新时间"
        align="center"
        width="160"
      />
      <el-table-column
        label="操作"
        width="180"
        align="center"
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
    <!--    新增应用-->
    <el-dialog :title="dialogStatus === 'edit'?'修改应用':'新增应用'" :visible.sync="dialogVisible" width="520px">
      <el-form ref="dataForm" :rules="rules" :model="modalForm" label-position="right" label-width="80px">
        <el-form-item label="应用名称" prop="name">
          <el-input v-model="modalForm.name" />
        </el-form-item>
        <el-form-item
          prop="picture"
          label="应用图"
        >
          <el-upload
            class="avatar-uploader"
            accept=".png,.jpg,.jpeg,.PNG"
            :headers="myHeaders"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="modalForm.picture" :src="modalForm.picture" class="avatar">
            <i v-if="modalForm.picture" class="el-icon-delete" @click.stop="imgRemove()" />
            <i v-if="!modalForm.picture" class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="所属地区" prop="areaAddr">
          <el-cascader
            ref="areaArr"
            v-model="modalForm.areaAddr"
            :props="props"
            class="width100"
            :placeholder="areaPlaceholder"
            @change="areaChangeModal"
          />
        </el-form-item>
        <el-form-item label="应用地址" prop="url">
          <el-input v-model="modalForm.url" />
        </el-form-item>
        <el-form-item label="版本介绍" prop="versionIntroduction">
          <el-input v-model="modalForm.versionIntroduction" :autosize="{ minRows: 3, maxRows: 7}" type="textarea" placeholder="请输入介绍" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmForm">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTabList, addApp, editApp, delApp } from '../../api/app'
import Pagination from '@/components/Pagination'
import { getArea } from '../../api/region'

export default {
  components: { Pagination },
  filters: {},
  data() {
    return {
      myHeaders: { Authorization: 'bearer ' + this.$store.state.user.token },
      uploadUrl: 'api/person/api/v2/person/upload',
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1,
      isLoading: false,
      tableLoading: false,
      areaAddr: [],
      postForm: {
        name: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: ''
      },
      dialogVisible: false,
      dialogStatus: 'create',
      modalForm: {
        id: '',
        name: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: '',
        picture: '', // 图片地址
        url: '',
        areaAddr: [], // 所属地区
        versionIntroduction: ''
      },
      rules: {
        name: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
        picture: [{ required: true, message: '应用图不能为空', trigger: 'blur' }],
        areaAddr: [{ required: true, message: '所属地区不能为空', trigger: 'blur' }],
        versionIntroduction: [{ required: true, message: '版本介绍不能为空', trigger: 'blur' }]
      },
      areaPlaceholder: '请选择',
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
      areaProps: {
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
        checkStrictly: false
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    reset() {
      this.areaAddr = []
      this.postForm = {}
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
      const { data } = await getTabList(this.pageNo, this.pageSize, this.postForm)
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
      this.getDataList()
    },
    /**
       * 重置弹窗字段
       */
    resetTemp() {
      this.modalForm = {
        name: '',
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: '',
        picture: '', // 图片地址
        areaAddr: [],
        url: '',
        versionIntroduction: ''
      }
      this.areaPlaceholder = '请选择'
    },
    /**
       * 新增应用
       */
    handleAdd() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 编辑
       * @param row
       */
    handleEdit(row) {
      this.dialogStatus = 'edit'
      this.dialogVisible = true
      const areaAddr = []
      if (row.provinceCode) areaAddr.push(parseInt(row.provinceCode))
      if (row.cityCode) areaAddr.push(parseInt(row.cityCode))
      if (row.areaCode) areaAddr.push(parseInt(row.areaCode))
      this.modalForm = {
        id: row.id,
        name: row.name,
        province: row.province,
        provinceCode: row.provinceCode,
        city: row.city,
        cityCode: row.cityCode,
        area: row.area,
        areaCode: row.areaCode,
        picture: row.picture,
        areaAddr: areaAddr,
        url: row.url,
        versionIntroduction: row.versionIntroduction
      }
      this.areaProps = {
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
        }
      }
      this.areaPlaceholder = `${row.province} / ${row.city} / ${row.area}`
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    /**
       * 确定提交
       */
    async confirmForm() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            name: this.modalForm.name,
            picture: this.modalForm.picture,
            city: this.modalForm.city,
            cityCode: this.modalForm.cityCode,
            province: this.modalForm.province,
            provinceCode: this.modalForm.provinceCode,
            area: this.modalForm.area,
            areaCode: this.modalForm.areaCode,
            url: this.modalForm.url,
            versionIntroduction: this.modalForm.versionIntroduction
          }
          if (this.dialogStatus === 'create') {
            addApp(params).then(() => {
              this.dialogVisible = false
              this.getDataList()
              this.$message.success('添加应用成功')
            })
          } else if (this.dialogStatus === 'edit') {
            params.id = this.modalForm.id
            // 修改应用 调接口

            editApp(params).then(() => {
              this.dialogVisible = false
              this.getDataList()
              this.$message.success('修改应用成功')
            })
          }
        }
      })
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
    areaChangeModal() {
      const areaNameModal = this.$refs['areaArr'].getCheckedNodes()[0].pathLabels
      this.modalForm.province = areaNameModal[0] || ''
      this.modalForm.provinceCode = this.modalForm.areaAddr[0] || ''
      this.modalForm.city = areaNameModal[1] || ''
      this.modalForm.cityCode = this.modalForm.areaAddr[1] || ''
      this.modalForm.area = areaNameModal[2] || ''
      this.modalForm.areaCode = this.modalForm.areaAddr[2] || ''
    },
    /**
       * 删除
       * @param scope
       */
    async handleDelete(scope) {
      this.$confirm('确定要删除该条记录吗?', '提示语', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delApp(scope.id).then((res) => {
          if (res.code === 0) {
            this.getDataList()
            this.$message.success('删除成功')
          }
        }).catch(() => {
          this.$message.error('删除失败')
        })
      })
    },
    // 上传图片
    handleSuccess(res, file) {
      this.modalForm.picture = res.data
    },
    imgRemove() {
      this.modalForm.picture = ''
    },
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const isImg =
        testmsg === 'jpg' ||
        testmsg === 'JPG' ||
        testmsg === 'png' ||
        testmsg === 'PNG'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isImg) {
        this.$message.error('上传图片只能是png / jpg / PNG格式')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isImg && isLt2M
    }
  }
}
</script>

<style scoped lang="scss">
  .list-img {
    width: 50px;
    height: 30px;
  }

  .avatar-uploader {
    width: 270px;
    height: 125px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .el-upload {
      width: 100%;
      height: 100%;
    }

    &:hover {
      border-color: #409EFF;
    }
    &:hover .el-icon-delete {
      background-color: red;
    }
    div {
      width: 100%;
      height: 100%;

      & img {
        width: 270px;
        height: 125px;
        display: block;
      }

      .el-icon-delete {
        font-size: 20px;
        position: absolute;
        right: 0;
        top: 0;
        padding: 6px;
        z-index: 100;
        background-color: #db3b21;
        color: #fff;
        border-bottom-left-radius: 6px;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 270px;
        height: 125px;
        line-height: 125px;
        text-align: center;
      }
    }
  }
</style>
