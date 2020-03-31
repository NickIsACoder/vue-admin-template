<template>
  <!--  轮播图管理-->
  <div class="app-container">
    <div style="margin: 10px 0;">
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="区域" class="form-inline">
              <el-cascader ref="area" v-model="areaAddr" :props="props" clearable style="width: 300px" />
            </el-form-item>
            <el-button type="primary" icon="el-icon-search" :loading="isLoading" @click="submitForm">查询</el-button>
            <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" class="fr" @click="handleAdd">新增轮播图</el-button>
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
        label="所属地区"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.province">{{ scope.row.province }}</span>
          <span v-if="scope.row.city">- {{ scope.row.city }}</span>
          <span v-if="scope.row.area">- {{ scope.row.area }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="轮播图"
        align="left"
      >
        <template slot-scope="scope">
          <span v-for="(item,index) in scope.row.picInfos">
            <img v-if="item.picUrl" :src="item.picUrl" class="list-img" alt="轮播图">
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          {{ scope.row.status === 1 ? '默认轮播图' : '非默认' }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        width="160"
      >
        <template slot-scope="scope">
          {{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="200"
        align="center"
        fix="right"
      >
        <template slot-scope="scope">
          <el-button type="primary" size="mini" style="margin:2px" @click="addPic(scope.row)">添加图片</el-button>
          <input id="singleImg" type="file" accept="image/PNG,image/png,image/JPG,image/jpg,image/jpeg" style="display: none" @change="getSingleImg">
          <!--          <el-button type="primary" size="mini" style="margin:2px" @click="handleEdit(scope.row)">编辑</el-button>-->
          <el-button type="danger" size="mini" style="margin:2px" @click="handleDel(scope.row)">删除</el-button>
          <el-button
            v-if="scope.row.status !== 1"
            type="primary"
            size="mini"
            style="margin:2px"
            @click="handleSet(scope.row)"
          >设为默认
          </el-button>
          <el-button v-if="scope.row.status === 1" size="mini" style="margin:2px" disabled>默认轮播图
          </el-button>
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
    <!--    新增轮播图-->
    <el-dialog :title="dialogStatus === 'edit'?'修改轮播图':'新增轮播图'" :visible.sync="dialogVisible" width="520px">
      <el-form ref="dataForm" :rules="rules" :model="modalForm" label-position="right" label-width="80px">
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
        <el-form-item
          prop="picture"
          label="轮播图"
        >
          <div class="image-wrap" @click="getFile">
            <img v-if="modalForm.picture" :src="modalForm.picture" class="avatar">
            <i v-if="modalForm.picture" class="el-icon-delete" @click.stop="imgRemove()" />
            <i v-if="!modalForm.picture" class="el-icon-plus avatar-uploader-icon" />
          </div>
          <input id="pfile" type="file" accept="image/PNG,image/png,image/JPG,image/jpg,image/jpeg" style="display: none" @change="getPhoto">
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
import { getCarouselList, addCarouse, addCarouseData, setCarouse, delCarouse } from '../../api/policy'
import Pagination from '@/components/Pagination'
import { findUserRegionByCode } from '../../api/region'

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
      orgList: [],
      postForm: {
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: '',
        sysAreaCode: ''
      },
      dialogVisible: false,
      dialogStatus: 'create',
      modalForm: {
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: '',
        areaAddr: [],
        picture: '',
        file: ''
      },
      rowId: '', // 上传添加图片保存id
      imageList: [],
      rules: {
        areaAddr: [{ required: true, message: '区域不能为空', trigger: 'blur' }]
      },
      imageUrl: '',
      dialogVisPic: false,
      areaPlaceholder: '请选择',
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
      const sysAreaCode = this.areaAddr[this.areaAddr.length - 1]
      const params = {
        sysAreaCode
      }
      this.tableLoading = true
      const { data } = await getCarouselList(this.pageNo, this.pageSize, params)
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
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: '',
        picture: '', // 图片地址base64
        areaAddr: [],
        file: ''
      }
    },
    /**
       * 新增轮播图
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
        province: row.province,
        provinceCode: row.provinceCode,
        city: row.city,
        cityCode: row.cityCode,
        area: row.area,
        areaCode: row.areaCode,
        picture: row.picture,
        areaAddr: areaAddr
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
          const { province, provinceCode, city, cityCode, area, areaCode, file } = this.modalForm
          if (!this.modalForm.file) {
            this.$message.error('图片不能为空')
            return
          }
          const data = new FormData()
          data.append('file', file)
          if (areaCode) data.append('areaCode', areaCode)
          if (area) data.append('area', area)
          if (city) data.append('city', city)
          if (cityCode) data.append('cityCode', cityCode)
          if (province) data.append('province', province)
          if (provinceCode) data.append('provinceCode', provinceCode)
          if (this.dialogStatus === 'create') {
            addCarouseData(data).then(() => {
              this.dialogVisible = false
              this.getDataList()
              this.$message.success('添加轮播图成功')
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
      this.postForm.province = province || ''
      this.postForm.provinceCode = provinceCode || ''
      this.postForm.city = city || ''
      this.postForm.cityCode = cityCode || ''
      this.postForm.area = area || ''
      this.postForm.areaCode = areaCode || ''
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
       * 添加图片
       * @param scope
       */
    addPic(scope) {
      if (scope.picInfos.length > 5) {
        this.$message.error('不能再添加图片')
        return
      }
      this.rowId = scope.id
      document.getElementById('singleImg').click()
    },
    getSingleImg() {
      const file = document.getElementById('singleImg').files[0]
      const name = document.getElementById('singleImg').files[0].name
      const dot = name.toLowerCase().lastIndexOf('.')
      const type = name.substring(dot + 1, name.length)
      if (type !== 'jpg' && type !== 'JPG' && type !== 'png' && type !== 'PNG' && type !== 'jpeg') {
        this.$message.error('上传图片只能是png / jpg / jpeg / PNG / jpeg格式')
        return
      }
      const params = new FormData()
      params.append('file', file)
      params.append('infoId', this.rowId)
      addCarouse(params).then((res) => {
        this.rowId = ''
        if (res.code === 0) {
          this.getDataList()
          this.$message.success('添加成功')
        }
      }).catch(() => {
        this.rowId = ''
        this.$message.error('添加失败')
      })
    },
    /**
       * 设置为默认轮播图
       * @param scope
       */
    async handleSet(scope) {
      this.$confirm('确定要设置为默认轮播图吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setCarouse(scope.id).then((res) => {
          if (res.code === 0) {
            this.getDataList()
            this.$message.success('设置成功')
          }
        }).catch(() => {
          this.$message.error('设置失败')
        })
      })
    },
    /**
       * 删除
       * @param scope
       */
    async handleDel(scope) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = new FormData()
        data.append('id', scope.id)
        delCarouse(data).then((res) => {
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
    handleRemove(file, fileList) {
      console.log(file, fileList)
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
    },

    getFile() {
      document.getElementById('pfile').click()
    },
    getPhoto() {
      const file = document.getElementById('pfile').files[0]
      const name = document.getElementById('pfile').files[0].name
      const dot = name.toLowerCase().lastIndexOf('.')
      const type = name.substring(dot + 1, name.length)
      if (type !== 'jpg' && type !== 'JPG' && type !== 'png' && type !== 'PNG' && type !== 'jpeg') {
        this.$message.error('上传图片只能是png / jpg / jpeg / PNG / jpeg格式')
        return
      }
      this.modalForm.file = file
      const fReader = new FileReader()
      fReader.readAsDataURL(file)
      fReader.onload = (e) => {
        const res = fReader.result
        this.modalForm.picture = res
      }
    },
    imgRemove() {
      this.modalForm.picture = ''
      this.modalForm.file = ''
    }
  }
}
</script>
<style>
  .el-upload--picture-card {
    width: 90px;
    height: 90px;
    line-height: 94px;
  }

  .el-upload-list--picture-card .el-upload-list__item {
    width: 90px;
    height: 90px;
    line-height: 94px;
  }
</style>
<style scoped lang="scss">
  .image-wrap {
    width: 150px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409EFF;
    }

    &:hover .el-icon-delete {
      background-color: red;
    }

    img {
      width: 100%;
      height: 100%;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 150px;
      height: 100px;
      line-height: 100px;
      text-align: center;
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
  }

  .list-img {
    width: 60px;
    height: 30px;
    margin-right: 8px;
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
