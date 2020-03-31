<template>
  <!--求职者信息录入/编辑-->
  <div>
    <el-form ref="form" :model="form" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '">
        <span class="head-title">{{ titleName }}</span>
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
          <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">
            提交
          </el-button>
        </div>
      </sticky>
      <div class="post-main-container">
        <el-divider content-position="left">
          <el-tag>基本信息</el-tag>
        </el-divider>
        <el-row>
          <el-col :span="16">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="name"
                    label="姓名"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model.trim="form.name" placeholder="请输入" clearable prefix-icon="el-icon-edit" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="idCard"
                    label="身份证号"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model.trim="form.idCard" placeholder="请输入" clearable prefix-icon="el-icon-edit" @blur="getBirthday(form.idCard)" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="mobile"
                    label="手机号码"
                    class="postInfo-container-item width96"
                  >
                    <el-input
                      v-model.trim="form.mobile"
                      placeholder="请输入"
                      type="text"
                      clearable
                      prefix-icon="el-icon-edit"
                      :disabled="isDisable"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="sex"
                    label="性别"
                    class="postInfo-container-item width96"
                  >
                    <el-radio-group v-model="form.sex">
                      <el-radio v-for="item in dict.personalSex" :label="item.value">{{ item.label }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="mail"
                    label="邮箱"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model.trim="form.mail" placeholder="请输入" clearable prefix-icon="el-icon-edit" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="birthday"
                    label="出生年月"
                    class="postInfo-container-item width96"
                  >
                    <el-date-picker
                      v-model="form.birthday"
                      type="month"
                      format="yyyy-MM"
                      value-format="yyyy-MM"
                      placeholder="请选择出生年月"
                      class="width100"
                      :picker-options="pickerOptions"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="personalState"
                    label="当前状态"
                    class="postInfo-container-item width96"
                  >
                    <el-select v-model="form.personalState" placeholder="请选择" class="width100" clearable>
                      <el-option
                        v-for="item in dict.personalState"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="jobNature"
                    label="工作性质"
                    class="postInfo-container-item width96"
                  >
                    <el-select v-model="form.jobNature" placeholder="请选择" class="width100" clearable>
                      <el-option
                        v-for="item in dict.jobNature"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="education"
                    label="学历"
                    class="postInfo-container-item width96"
                  >
                    <el-select v-model="form.education" placeholder="请选择" class="width100" clearable>
                      <el-option
                        v-for="item in dict.education"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="education"
                    label="工作年限"
                    class="postInfo-container-item width96"
                  >
                    <el-select v-model="form.workYear" placeholder="请选择" class="width100" clearable>
                      <el-option
                        v-for="item in dict.experience"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="expectJobSalary"
                    label="期待薪酬"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model.trim="form.hopeSalarySmall" placeholder="请输入最低" type="number" clearable style="width:48%">
                      <template slot="append">K</template>
                    </el-input>
                    -
                    <el-input v-model.trim="form.hopeSalaryBig" placeholder="请输入最高" type="number" clearable style="width:48%">
                      <template slot="append">K</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="nowAreaAddr"
                    label="现居地"
                    class="postInfo-container-item width96"
                  >
                    <el-cascader
                      ref="nowAreaAddrr"
                      v-model="form.nowAreaAddr"
                      :props="areaProps"
                      clearable
                      class="width100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="areaAddr"
                    label="期待工作地点"
                    class="postInfo-container-item width96"
                  >
                    <el-cascader
                      ref="areaAddrr"
                      v-model="form.areaAddr"
                      :props="props"
                      clearable
                      class="width100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label-width="120px"
                    prop="expectJobType"
                    label="期待职位类型"
                    class="postInfo-container-item width96"
                  >
                    <el-cascader
                      ref="jobArr"
                      v-model="jobTypeArr"
                      :props="postProps"
                      clearable
                      class="width100"
                      :placeholder="jobPlaceholder"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="24">
                  <el-form-item
                    label-width="100px"
                    prop="coverImage"
                    label=""
                    class="postInfo-container-item width96"
                  >
                    <el-upload
                      class="avatar-uploader"
                      accept=".png,.jpg,.jpeg,.PNG"
                      :headers="myHeaders"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="successLogo"
                      :before-upload="beforeUpload"
                      :on-remove="handleRemove"
                    >
                      <img v-if="form.portrait" :src="form.portrait" class="avatar">
                      <i v-if="form.portrait" class="el-icon-delete" @click.stop="imgRemove()" />
                      <i v-if="!form.portrait" class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                    <span style="color: #999">头像建议上传大小在2M以内</span>
                  </el-form-item>
                </el-col>
              </el-row>

            </div>
          </el-col>
        </el-row>
        <el-divider content-position="left">
          <el-tag>附加信息</el-tag>
        </el-divider>
        <el-row>
          <el-col :span="16">
            <el-form-item
              label-width="120px"
              prop="workExperience"
              label="工作经历"
              class="postInfo-container-item width100"
            >
              <el-input
                v-model="form.workExperience"
                :autosize="{ minRows: 4, maxRows: 7}"
                type="textarea"
                placeholder="请填写"
                style="width: 98%"
              />
            </el-form-item>
            <el-form-item
              label-width="120px"
              prop="educationalBackground"
              label="教育背景"
              class="postInfo-container-item width100"
            >
              <el-input
                v-model="form.educationalBackground"
                :autosize="{ minRows: 4, maxRows: 7}"
                type="textarea"
                placeholder="请填写"
                style="width: 98%"
              />
            </el-form-item>
            <el-form-item
              label-width="120px"
              prop="selfEvaluation"
              label="自我评价"
              class="postInfo-container-item width100"
            >
              <el-input
                v-model="form.selfEvaluation"
                :autosize="{ minRows: 4, maxRows: 7}"
                type="textarea"
                placeholder="请填写"
                style="width: 98%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item
              label-width="120px"
              prop="certificates"
              label="上传证书"
              class="postInfo-container-item width96"
            >
              <el-upload
                :headers="myHeaders"
                :action="uploadUrl"
                accept=".png,.jpg,.jpeg,.PNG"
                list-type="picture-card"
                :on-preview="picCardPreview"
                :on-remove="handleRemoveCard"
                :on-success="successUpload"
                :before-upload="beforeUpload"
                :file-list="picList"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <span style="color: #999">上传证书建议上传大小在10M以内</span>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              label-width="120px"
              prop="works"
              label="上传作品"
              class="postInfo-container-item width96"
            >
              <el-upload
                :headers="myHeaders"
                :action="uploadUrl"
                accept=".png,.jpg,.jpeg,.PNG"
                list-type="picture-card"
                :on-preview="picCardPreview"
                :on-remove="handleRemoveWorks"
                :on-success="successUploadWorks"
                :before-upload="beforeUpload"
                :file-list="worksList"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
              <span style="color: #999">上传作品建议上传大小在10M以内</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '../../components/Sticky/index'
import { addSeeker, editSeeker, getDetailById } from '../../api/jobSeeker'
import { findUserRegionByCode, getArea } from '../../api/region'
import { getPositionType, getDictionary } from '../../api/user'

const defaultForm = {
  portrait: '', // 头像
  name: '', // 姓名
  idCard: '', // 身份证号码
  mobile: '',
  sex: '',
  mail: '',
  birthday: '', // 出生年月
  personalState: '', // 个人当前状态
  jobNature: '', // 工作性质
  education: '', // 学历
  hopeSalaryBig: '', // 期望最高薪酬
  hopeSalarySmall: '', // 期望最低薪酬
  expectJobType: '', // 期望职位类别
  groupType: '', // 群体类别
  workYear: '', // 工作年限
  workExperience: '', // 工作经历
  selfEvaluation: '', // 自我评价
  educationalBackground: '', // 教育背景
  certificates: [], // 证书
  works: [], // 作品
  areaAddr: [], // 期待工作地点
  nowAreaAddr: [] // 现居地
}
// 验证正则
const telPattern = /^[0-9]{11}$|^(0\d{2})-(\d{8})$|^(0\d{3})-(\d{7})$/
const idCardPat = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
const mailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const numReg = /^[1-9]\d*$/
export default {
  components: { Sticky },
  filters: {},
  data() {
    return {
      myHeaders: { Authorization: 'bearer ' + this.$store.state.user.token },
      uploadUrl: '/api/person/api/v2/person/upload',
      form: Object.assign({}, defaultForm),
      loading: false,
      titleName: '新增求职者信息',
      rules: {
        name: [{ required: true, message: '请填写姓名', trigger: 'blur' }],
        idCard: [{ required: true, message: '请填写身份证号', trigger: 'blur' },
          { pattern: idCardPat, message: '请输入正确的身份证号', trigger: 'blur' }],
        mobile: [{ required: true, message: '请填写手机号', trigger: 'blur' },
          { pattern: telPattern, message: '请输入正确的号码', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        mail: [{ pattern: mailReg, message: '请输入正确的邮箱', trigger: 'blur' }],
        nowAreaAddr: [{ required: true, message: '请选择现居地', trigger: 'change' }],
        areaAddr: [{ required: true, message: '请选择期待工作地点', trigger: 'change' }],
        hopeSalaryBig: [{ pattern: numReg, message: '请输入正整数', trigger: 'blur' }],
        hopeSalarySmall: [{ pattern: numReg, message: '请输入正整数', trigger: 'blur' }]
      },
      dict: { // 字典
        personalSex: [], // 性别
        personalState: [], // 当前状态
        jobNature: [], // 工作性质
        education: [], // 学历
        groupType: [], // 群体类别
        experience: [], // 工作经验字典 // 工作年限
        salary: [] // 月薪
      },
      areaAddr: [],
      nowAreaAddr: [],
      jobTypeArr: [],
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
        }
      },
      areaProps: {
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
        checkStrictly: false
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e7 // 不能选择 当月之后的
        }
      },
      dialogImageUrl: '',
      dialogVisible: false,
      picList: [], // 上传证书
      worksList: [], // 上传作品
      fileList: [],
      jobPlaceholder: '请选择',
      isDisable: false // 手机号不能更改
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
      this.form.id = id
      this.titleName = '修改求职者信息'
      this.isDisable = true
    }
    this.getAllDict()
  },
  methods: {
    /**
       * 获取字典
       */
    getAllDict() {
      const types = Object.keys(this.dict)
      Promise.all(types.map(type => getDictionary(type))).then(resArr => {
        resArr.forEach((res, index) => {
          if (res.code === 0) {
            this.dict[types[index]] = res.data.map(r => ({ label: r.msg, value: r.code }))
          }
        })
      })
    },
    getBirthdayByIdNO(IdNO) {
      let birthday = ''
      if (IdNO.length === 18) {
        birthday = IdNO.substr(6, 6)
        return birthday.replace(/(.{4})(.{2})/, '$1-$2')
      } else if (IdNO.length === 15) {
        birthday = '19' + IdNO.substr(6, 6)
        return birthday.replace(/(.{4})(.{2})/, '$1-$2')
      } else {
        return ''
      }
    },
    /**
     * 根据身份证获取 出生年月
     */
    getBirthday(val) {
      this.form.birthday = this.getBirthdayByIdNO(val)
    },
    goPrev() {
      this.$router.go(-1)
    },
    /**
       * 根据Id获取详情
       * @param id
       */
    async fetchData(id) {
      const { data } = await getDetailById(id)
      if (data) {
        const nowAddr = []
        const areaAddress = []
        // 现居地回显
        if (data.nowProvinceCode) nowAddr.push(parseInt(data.nowProvinceCode))
        if (data.nowCityCode) nowAddr.push(parseInt(data.nowCityCode))
        if (data.nowAreaCode) nowAddr.push(parseInt(data.nowAreaCode))
        // 期待工作地回显
        if (data.expectJobProvinceCode) areaAddress.push(parseInt(data.expectJobProvinceCode))
        if (data.expectJobCityCode) areaAddress.push(parseInt(data.expectJobCityCode))
        if (data.expectJobAreaCode) areaAddress.push(parseInt(data.expectJobAreaCode))
        this.form = data
        this.form.nowAreaAddr = nowAddr
        this.form.areaAddr = areaAddress
        // 图片回显
        if (this.form.certificateList !== null && this.form.certificateList.length) {
          this.form.certificateList.map(img => {
            this.picList.push({
              url: img
            })
          })
        }
        if (this.form.workList !== null && this.form.workList.length) {
          this.form.workList.map(img => {
            this.worksList.push({
              url: img
            })
          })
        }
        this.jobPlaceholder = `${this.form.expectJobTypeName}`
      }
    },
    goBack() {
      this.$router.push({
        path: '/company/companyList'
      })
    },
    /**
       * 发布
       */
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.nowAreaAddr.length) {
            const node = this.$refs.nowAreaAddrr.getCheckedNodes()
            const [provinceCode, cityCode, areaCode] = node[0].path
            const [province, city, area] = node[0].pathLabels
            this.form.nowProvince = province
            this.form.nowProvinceCode = provinceCode
            this.form.nowCity = city
            this.form.nowCityCode = cityCode
            this.form.nowArea = area
            this.form.nowAreaCode = areaCode
          }
          if (this.form.areaAddr.length) {
            const node = this.$refs.areaAddrr.getCheckedNodes()
            const [provinceCode, cityCode, areaCode] = node[0].path
            const [province, city, area] = node[0].pathLabels
            this.form.expectJobProvince = province
            this.form.expectJobProvinceCode = provinceCode
            this.form.expectJobCity = city
            this.form.expectJobCityCode = cityCode
            this.form.expectJobArea = area
            this.form.expectJobAreaCode = areaCode
          }
          const certList = []
          if (this.picList.length) {
            this.picList.map(val => {
              certList.push(val.url)
            })
          }
          const works = []
          if (this.worksList.length) {
            this.worksList.map(val => {
              works.push(val.url)
            })
          }
          if (this.form.hopeSalarySmall && !numReg.test(this.form.hopeSalarySmall)) {
            this.$message.error('期待薪酬请输入正整数')
            return
          }
          if (this.form.hopeSalaryBig && !numReg.test(this.form.hopeSalaryBig)) {
            this.$message.error('期待薪酬请输入正整数')
            return
          }
          if (parseInt(this.form.hopeSalaryBig) < parseInt(this.form.hopeSalarySmall)) {
            this.$message.error('期待薪酬下限不高于上限')
            return
          }
          const expectJobType = (this.jobTypeArr && this.jobTypeArr.length) ? this.jobTypeArr[this.jobTypeArr.length - 1] : '' // 期望职位类别
          const {
            portrait, name, idCard, mobile, sex, mail, birthday, personalState, jobNature, education, workExperience, selfEvaluation,
            educationalBackground, expectJobProvince, expectJobProvinceCode,
            expectJobCity, expectJobCityCode, expectJobArea, expectJobAreaCode, nowProvince, nowProvinceCode, nowCity, nowCityCode, nowArea, nowAreaCode, workYear
          } = this.form
          const params = {
            portrait,
            name,
            idCard,
            mobile,
            sex,
            mail,
            birthday,
            personalState,
            jobNature,
            education,
            workExperience,
            selfEvaluation,
            educationalBackground,
            expectJobProvince,
            expectJobProvinceCode,
            expectJobCity,
            expectJobCityCode,
            expectJobArea,
            expectJobAreaCode,
            nowProvince,
            nowProvinceCode,
            nowCity,
            nowCityCode,
            nowArea,
            nowAreaCode,
            expectJobType,
            workYear,
            hopeSalaryBig: parseInt(this.form.hopeSalaryBig) || 0,
            hopeSalarySmall: parseInt(this.form.hopeSalarySmall) || 0,
            works: works,
            certificates: certList
          }
          if (this.form.id) {
            this.modify(this.form.id, params)
          } else {
            this.add(params)
          }
        } else {
          return false
        }
      })
    },
    /**
       * 添加
       * @returns {Promise<void>}
       */
    async add(params) {
      this.loading = true
      const { code } = await addSeeker(params)
      if (code === 0) {
        this.$message.success('发布成功')
        this.$router.push({
          path: '/jobSeeker/seekerList'
        })
      }
      this.loading = false
    },
    /**
       * 修改
       * @param id
       * @param params
       */
    async modify(id, params) {
      this.loading = true
      const { code } = await editSeeker(id, params)
      if (code === 0) {
        this.$message.success('修改成功')
        this.$router.push({
          path: '/jobSeeker/seekerList'
        })
      }
      this.loading = false
    },
    // 上传封面图
    handleRemove(file, fileList) {
    },
    successLogo(res, file) {
      this.form.portrait = res.data
    },
    // 删除图片
    imgRemove() {
      this.form.portrait = ''
    },
    beforeUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
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
    /**
       * 上传证书
       */
    successUpload(res, file) {
      const uid = file.uid
      this.picList.push({ key: uid, url: res.data })
    },
    handleRemoveCard(file, fileList) {
      for (const i in this.picList) {
        if (this.picList[i].url === file.url) {
          this.picList.splice(i, 1)
        }
      }
    },
    /**
       * 上传作品
       */
    successUploadWorks(res, file) {
      const uid = file.uid
      this.worksList.push({ key: uid, url: res.data })
    },
    handleRemoveWorks(file, fileList) {
      for (const i in this.worksList) {
        if (this.worksList[i].url === file.url) {
          this.worksList.splice(i, 1)
        }
      }
    },
    picCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang="scss">
  @import "~@/styles/mixin.scss";

  .post-main-container {
    padding: 40px 25px 20px 25px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
        font-size: 14px;
      }
    }
  }

  .width100 {
    width: 100%;
  }

  .avatar-uploader {
    width: 125px;
    height: 125px;

    div {
      width: 100%;
      height: 100%;

      & img {
        width: 100%;
        height: 100%;
        display: block;
      }

    }
  }
</style>
