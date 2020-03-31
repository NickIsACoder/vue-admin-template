<template>
  <div class="app-container">
    <div>
      <el-form ref="postForm" :model="postForm" class="form-container">
        <el-row type="flex" :gutter="20" justify="start">
          <el-col :span="24">
            <el-form-item label-width="80px" label="表单" class="form-inline">
              <el-select v-model="formType" placeholder="请选择" @change="((val)=>{formChange(val, 'form')})">
                <el-option
                  v-for="item in formTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="80px"
              label="企业名称"
              class="form-inline"
            >
              <el-input v-model="postForm.entName" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label-width="80px" label="时间段" class="form-inline">
              <el-date-picker
                v-model="postForm.time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label-width="80px" label="区域" class="form-inline">
              <el-cascader v-model="postForm.area" :props="props" clearable collapse-tags />
            </el-form-item>
            <el-form-item label-width="80px" label="企业类别" class="form-inline">
              <el-select v-model="postForm.companyType" placeholder="请选择">
                <el-option
                  v-for="item in companyTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <div style="display:inline-block;margin-left:10px;">
              <el-button
                type="primary"
                icon="el-icon-search"
                :loading="isLoading"
                @click="submitForm"
              >查询</el-button>
              <el-button type="warning" icon="el-icon-s-open" @click="reset">重置</el-button>
              <el-button type="primary" :loading="isExporting" @click="excelExport">导出</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div>
      <div style="text-align: right;">
        <el-dropdown :hide-on-click="false">
          <span class="el-dropdown-link">
            筛选字段<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-checkbox-group v-model="checkList">
              <el-dropdown-item
                v-for="col in tableColumns[formType]"
                :key="col.prop"
              >
                <el-checkbox :label="col.label" />
              </el-dropdown-item>
            </el-checkbox-group>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table
        v-loading="tableLoading"
        :data="tableList"
        border
        style="width: 100%;margin-top:10px;"
        header-cell-class-name="warning-row"
      >
        <el-table-column
          align="center"
          label="序号"
          width="65"
          type="index"
          :index="(index)=>{return (index+1) + (pageNo-1)*pageSize}"
        />
        <template v-for="(col) in tableColumns[formType].filter(coloum => checkList.indexOf(coloum.label) !== -1)">
          <template v-if="formType!=='detailChange'">
            <el-table-column v-if="col.children" :key="col.label" :label="col.label" align="center" :width="col.width">
              <el-table-column v-for="(item, index2) in col.children" :key="item.prop+index2" :prop="item.prop" :width="item.width" :label="item.label" align="center" />
            </el-table-column>
            <el-table-column v-else :key="col.prop" :prop="col.prop" :label="col.label" align="center" :width="col.width" />
          </template>
          <template v-else>
            <el-table-column v-if="col.heightlight" :key="col.prop" :prop="col.prop" :label="col.label" align="center" :width="col.width">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  :type="scope.row[col.prop] >= 0 ? 'success' : 'danger'"
                >
                  {{ scope.row[col.prop] > 0 ? '+' + scope.row[col.prop] : scope.row[col.prop] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column v-else :key="col.prop" :prop="col.prop" :label="col.label" align="center" :width="col.width" />
          </template>
        </template>
        <el-table-column v-if="formType=='baseEpInfo'&&showBtn" label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showEditBox(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="total" :page="nowPage" :limit.sync="pageSize" layout="total, sizes, prev, pager, next, jumper" @pagination="pageChange" />
    </div>

    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      class="mgt"
    >
      <div class="modalContainer">
        <el-form ref="editForm" :model="dialogList">
          <el-form-item label="企业全称" prop="name" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.name" type="input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系人" prop="contactPerson" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.contactPerson" type="input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="联系电话" prop="tel" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.tel" minlength="11" maxlength="11" type="number" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="是否首次填写" prop="isFirstOperateCn" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-select v-model="dialogList.isFirstOperateCn" style="width:100%" placeholder="请选择">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="企业注册地" prop="registerAddress" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.registerAddress" type="input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="企业所在区域" prop="area" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-cascader ref="area" v-model="dialogList.area" :placeholder="dialogArea" :props="props" style="width:100%" clearable collapse-tags />
            <!-- <el-input v-model="dialogList.area" type="input" :placeholder="dialogArea" placeholder="请输入" /> -->
          </el-form-item>
          <el-form-item label="行业类型" prop="categoryName" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.categoryName" type="input" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="企业在岗职工总数（2019年12月31日用工数）" prop="memberNum" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.memberNum" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="截止目前新招聘人数" prop="newMenber" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.newMenber" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="是否复工" prop="isWork" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-select v-model="dialogList.isWork" placeholder="请选择" class="width100">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="本市户籍返岗人数" prop="thisCityStaffNum" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.thisCityStaffNum" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="非本市户籍返岗人数" prop="otherCityStaffNum" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.otherCityStaffNum" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="缺工人数（不包含未返岗）" prop="needMember" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-input v-model="dialogList.needMember" type="number" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="采集时间" prop="collectTime" :rules="{ required: true, message: '不能为空', trigger: 'blur' }">
            <el-date-picker v-model="dialogList.collectTime" style="width:100%" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modalCancle">取 消</el-button>
        <el-button type="primary" @click="selectSurvey">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<style scoped lang="scss">
.modalContainer{
  max-height: 60vh;
  overflow-y: scroll;
}
.mgt{
  margin-top: -8vh;
}
.modalContainer /deep/ input::-webkit-outer-spin-button,
.modalContainer /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
.modalContainer /deep/ input[type="number"]{
  -webkit-appearance: textfield;
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>

<script>
import {
  getTableList,
  exportExcel,
  delEporRecodes,
  modifyByExample,
  isShowOper,
  getCountChangeList,
  exportCountChangeList
} from '../../api/bengbuSupport'
import { getPositionType } from '../../api/user'
import Pagination from '@/components/Pagination'
import { findUserRegionByCode } from '../../api/region'

export default {
  components: { Pagination },
  filters: {},
  data() {
    return {
      userName: this.$store.state.user.username,
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1, // 底部标签当前页码
      postForm: {
        entName: '',
        time: [],
        area: [],
        companyType: ''
      },
      formType: 'baseEpInfo',
      formTypeList: [
        { label: '基础信息表', value: 'baseEpInfo' },
        { label: '企业用工明细表', value: 'epDetail' },
        { label: '用工情况汇总统计表', value: 'employmentSta' },
        { label: '企业用工情况变动表', value: 'detailChange' }
      ],
      companyTypeList: [
        { label: '927规上企业', value: 'plan927' },
        { label: '30佳企业', value: 'best30' },
        { label: '10强企业', value: 'topTen' },
        { label: '其他', value: 'other' }
      ],
      typeList: [
        { label: '是', value: '是' },
        { label: '否', value: '否' }
      ],
      isLoading: false,
      tableLoading: false,
      isExporting: false,
      checkList: [],
      tableColumns: {
        baseEpInfo: [
          { prop: 'name', label: '企业全称', initial: true, width: 150 },
          { prop: 'contactPerson', label: '联系人', initial: false },
          { prop: 'tel', label: '联系电话', initial: false },
          { prop: 'isFirstOperateCn', label: '是否首次填写', initial: false },
          { prop: 'registerAddress', label: '企业注册地', initial: false },
          { prop: 'area', label: '企业所在区域', initial: false },
          { prop: 'categoryName', label: '行业类型', initial: true },
          { prop: 'memberNum', label: '企业在岗职工总数（2019年12月31日用工数）', initial: true, width: 200 },
          { prop: 'newMenber', label: '截止目前新招聘人数', initial: true, width: 100 },
          { prop: 'isWork', label: '是否复工', initial: false },
          { prop: 'thisCityStaffNum', label: '本市户籍返岗人数', initial: true },
          { prop: 'otherCityStaffNum', label: '非本市户籍返岗人数', initial: true, width: 100 },
          { prop: 'needMember', label: '缺工人数（不包含未返岗）', initial: true, width: 100 },
          { prop: 'collectTime', label: '采集时间', initial: true, width: 150 }
        ],
        epDetail: [
          { prop: 'name', label: '公司全称', initial: true, width: 150 },
          { prop: 'categoryName', label: '行业类型', initial: true },
          { prop: 'memberNum', label: '截至2019年12月31日用工数', initial: true, width: 150 },
          { label: '已返岗人数', initial: true, children: [
            { prop: 'staffNumCount', label: '小计', initial: true },
            { prop: 'reworkRate', label: '复工率', initial: true },
            { prop: 'thisCityStaffNum', label: '本市户籍', initial: true },
            { prop: 'otherCityStaffNum', label: '非本市户籍', initial: true, width: 120 }
          ] },
          { prop: 'newMenber', label: '2020年1月1日至今新招聘人数', initial: true, width: 150 },
          { prop: 'needMember', label: '尚缺工人数（不包含未返岗）', initial: true, width: 150 },
          { prop: 'collectTime', label: '采集时间', initial: true, width: 150 }
        ],
        employmentSta: [
          { prop: 'area', label: '区县名称', initial: true },
          { prop: 'areaCompCount', label: '应统计企业数', initial: true },
          { prop: 'haveRecodeCompCount', label: '已上报企业数', initial: true },
          { prop: 'memberNum', label: '用工数', initial: true },
          { label: '已返岗人数占比', initial: true, children: [
            { prop: 'reworkRate', label: '复工率', initial: true },
            { prop: 'thisCityStaffNum', label: '本市户籍', initial: true },
            { prop: 'otherCityStaffNum', label: '非本市户籍', initial: true }
          ] },
          { prop: 'newMenber', label: '2020年1月1日至今新招聘人数', initial: true, width: 150 },
          { prop: 'needMember', label: '尚缺工人数（不包含未返岗）', initial: true, width: 150 }
        ],
        detailChange: [
          { prop: 'name', label: '公司全称', initial: true, width: 150 },
          { prop: 'categoryName', label: '行业类型', initial: true, width: 150 },
          { prop: 'tel', label: '联系电话', initial: true, width: 150 },
          { prop: 'area', label: '企业所在区域', initial: true, width: 150 },
          { prop: 'memberNum', label: '截止至2019年12月31日用工数', initial: true, width: 150 },
          { prop: 'thisCityStaffNum', label: '已返岗本市户籍', initial: true, width: 150 },
          { prop: 'thisCityStaffNumC', label: '已返岗本市户籍增加', initial: true, width: 150, heightlight: true },
          { prop: 'otherCityStaffNum', label: '已返岗非本市户籍', initial: true, width: 150 },
          { prop: 'otherCityStaffNumC', label: '已返岗非本市户籍增加', initial: true, width: 170, heightlight: true },
          { prop: 'needMember', label: '缺工人数', initial: true, width: 150 },
          { prop: 'needMemberC', label: '缺工人数减少', initial: true, width: 150, heightlight: true },
          { prop: 'newMenber', label: '新招聘人数', initial: true, width: 150 },
          { prop: 'newMenberC', label: '新招聘人数增加', initial: true, width: 150, heightlight: true },
          { prop: 'collectTime', label: '采集时间', initial: true, width: 160 }
        ]
      },
      areaList: [],
      props: {
        multiple: false,
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
      },
      postProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          getPositionType(1, 99, node.value || '').then((res) => {
            let nodes = []
            if (res.code === 0 && res.data) {
              nodes = res.data.list.map((post) => ({
                label: post.msg,
                value: post.code,
                leaf: node.level > 1
              }))
            }
            resolve(nodes)
          })
        }
      },
      distinctList: [],
      dialogVisible: false,
      dialogList: {},
      dialogArea: '',
      showBtn: false
    }
  },
  created() {
    this.getDataList()
    this.checkList = this.tableColumns[this.formType].filter(col => col.initial).map(col => col.label)
    // this.getDistincts()// 区域
    this.func_isShowOper()
  },
  methods: {
    // 是否显示操作按钮
    async func_isShowOper() {
      const params = {}
      this.isLoading = true
      const result = await isShowOper(params)
      this.isLoading = false
      if (result.code === 0) {
        if (parseInt(result.data.isShowOper) !== -1) {
          this.showBtn = true
        }
      }
    },
    // 获取全部区域
    // async getDistincts() {
    //   const res = await findUserRegionByCode(100000)
    //   this.distinctList = []
    //   if (res.data) {
    //     this.distinctList = this.distinctList.concat(res.data)
    //   }
    // },
    reset(value) {
      this.postForm = {
        entName: '',
        time: [],
        area: [],
        companyType: ''
      }
      this.getDataList()
    },
    // 查询按钮
    async submitForm() {
      console.log(this.postForm)
      if (this.postForm) {
        this.isLoading = true
        this.pageNo = 1
        this.nowPage = 1
        this.getDataList()
      }
    },
    // 切换表格
    formChange(value, type) {
      console.log(value)
      this.$nextTick(() => {
        this.checkList = this.tableColumns[this.formType].filter(col => col.initial).map(col => col.label)
        this.pageNo = 1
        this.nowPage = 1
        this.isLoading = true
        this.reset(value)
      })
    },
    // 获取列表
    async getDataList() {
      if (this.formType === 'detailChange') {
        this.func_getCountChangeList()
        return false
      }
      const params = {
        areaCode: this.postForm.area[this.postForm.area.length - 1],
        startTime: this.postForm.time[0],
        endTime: this.postForm.time[1],
        epName: this.postForm.entName,
        epType: this.postForm.companyType,
        epFormType: this.formType,
        isExport: false,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }

      this.isLoading = true
      this.tableLoading = true
      const result = await getTableList(params)
      this.isLoading = false
      this.tableLoading = false
      if (result.code === 0) {
        const arr = result.data.list.map(item => {
          if (!item) return {}
          return {
            ...item,
            isWork: item.isWork,
            isFirstOperateCn: item.isFirstOperateCn,
            staffNumCount: item.thisCityStaffNum + item.otherCityStaffNum
          }
        })
        this.tableList = arr
        this.total = result.data.total
      } else {
        this.$message.error(result.msg)
      }
    },
    // 用工情况变动表列表
    async func_getCountChangeList() {
      const params = {
        areaCode: this.postForm.area[this.postForm.area.length - 1],
        startTime: this.postForm.time[0],
        endTime: this.postForm.time[1],
        epName: this.postForm.entName,
        epType: this.postForm.companyType,
        // epFormType: this.formType,
        isExport: false,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }

      this.isLoading = true
      this.tableLoading = true
      const result = await getCountChangeList(params)
      this.isLoading = false
      this.tableLoading = false
      if (result.code === 0) {
        // const arr = result.data.list.map(item => {
        //   if (!item) return {}
        //   return {
        //     ...item,
        //     thisCityStaffNumC: Math.floor(Math.random() * 100),
        //     otherCityStaffNumC: -Math.floor(Math.random() * 100),
        //   }
        // })
        // this.tableList = arr
        this.tableList = result.data.list
        this.total = result.data.total
      } else {
        this.$message.error(result.msg)
      }
    },
    // 页面更换
    pageChange(e) {
      const page = e.page
      const size = e.limit
      this.pageNo = page
      this.nowPage = page
      this.pageSize = size
      this.getDataList()
    },
    // 删除
    async handleDelete(row) {
      this.$confirm('确认删除该数据吗？', '提示', {
        type: 'warning'
      }).then(() => {
        const params = {
          epId: row.epId,
          recodesId: row.recodesId
        }
        this.func_delEporRecodes(params)
      }).catch(() => {})
    },
    async func_delEporRecodes(params) {
      this.isLoading = true
      const result = await delEporRecodes(params)
      this.isLoading = false
      if (result.code === 0) {
        this.$message.success(result.data)
        this.getDataList()
      } else {
        this.$message.error(result.data)
      }
    },
    // 导出
    async excelExport() {
      this.isExporting = true
      const params = {
        areaCode: this.postForm.area.join(','),
        startTime: this.postForm.time[0],
        endTime: this.postForm.time[1],
        epName: this.postForm.entName,
        epType: this.postForm.companyType,
        epFormType: this.formType,
        isExport: true,
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      let res = ''
      if (this.formType === 'detailChange') {
        res = await exportCountChangeList(params)
      } else {
        res = await exportExcel(params)
      }
      const blob = new Blob([res], { type: 'application/octet-stream' })
      const downloadElement = document.createElement('a')
      const href = window.URL.createObjectURL(blob)
      downloadElement.href = href
      const file = this.formTypeList.filter((item) => {
        if (item.value === this.formType) {
          return item
        }
      })
      downloadElement.download = file[0].label + '.xls' // 文件名（自己随意设置）
      document.body.appendChild(downloadElement)
      downloadElement.click()
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
      this.isExporting = false
    },
    modalCancle() {
      this.dialogVisible = false
      this.$refs['editForm'].resetFields()
    },
    // 显示编辑框
    showEditBox(row) {
      this.dialogVisible = true
      this.dialogArea = row.area
      this.dialogList = JSON.parse(JSON.stringify(row))
      console.log(this.dialogList)
    },
    // 保存编辑
    selectSurvey() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          const obj = JSON.parse(JSON.stringify(this.dialogList))
          const cityData = this.$refs['area'].getCheckedNodes()
          if (cityData.length > 0 && cityData[0]) {
            obj.area = cityData[0].pathLabels[cityData[0].pathLabels.length - 1]
            obj.areaCode = cityData[0].path[cityData[0].path.length - 1]
          }
          obj.category = obj.categoryName
          obj.isFirstOperate = obj.isFirstOperateCn === '是' ? 1 : 0
          obj.isFirstOperateCn = obj.isFirstOperateCn === '是' ? 1 : 0
          obj.iswork = obj.isWork === '是' ? 1 : 0
          obj.isWork = obj.isWork === '是' ? 1 : 0
          obj.newMemberNum = obj.newMenber
          console.log(obj)

          this.func_modifyByExample(obj)
        } else {
          this.$message.error('有必填项没填哦~')
          console.log('error submit!!')
          return false
        }
      })
    },
    async func_modifyByExample(params) {
      this.isLoading = true
      const result = await modifyByExample(params)
      this.isLoading = false
      this.dialogVisible = false
      if (result.code === 0) {
        this.$message.success(result.data)
        this.getDataList()
      } else {
        this.$message.error(result.data)
      }
    }
  }
}
</script>
