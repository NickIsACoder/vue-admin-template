<template>
  <div>
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '">
        <span class="head-title">{{ titleName }}</span>
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
        </div>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="name"
                    label="企业全称"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.name" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="shortName"
                    label="企业简称"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.shortName" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="businessNature"
                    label="企业性质"
                    class="postInfo-container-item width96"
                  >
                    <el-select v-model="postForm.businessNatureCode" placeholder="请选择" class="width100">
                      <el-option
                        v-for="item in busNatureList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="uniformSocialCreditCode"
                    label="统一社会信用码"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.uniformSocialCreditCode" placeholder="请输入" type="text" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="socialSecurityNumber"
                    label="企业社保编号"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.socialSecurityNumber" placeholder="请输入" type="text" clearable />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="category"
                    label="所属行业"
                    class="postInfo-container-item width96"
                  >
                    <el-select v-model="postForm.categoryCode" placeholder="请选择" class="width100">
                      <el-option
                        v-for="item in categoryList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="registeredCapital"
                    label="注册资金"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.registeredCapital" placeholder="请输入" type="text" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="scaleCode"
                    label="人员规模"
                    class="postInfo-container-item width96"
                  >
                    <el-select v-model="postForm.scaleCode" placeholder="请选择" class="width100">
                      <el-option
                        v-for="item in scaleList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="contactPerson"
                    label="企业法人"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.contactPerson" placeholder="请输入" type="text" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="tel"
                    label="联系电话"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.registTel" placeholder="请输入" type="text" clearable :disabled="true" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="managerName"
                    label="企业经办人"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.managerName" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="managerTel"
                    label="经办人电话"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.managerTel" placeholder="请输入" type="text" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="managerEmail"
                    label="经办人电子邮箱"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.managerEmail" placeholder="请输入" type="text" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="managerIdCardNum"
                    label="经办人身份证号"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.managerIdCardNum" placeholder="请输入" type="text" clearable />
                  </el-form-item>
                </el-col>
                <!--                <el-col :span="8">-->
                <!--                  <el-form-item-->
                <!--                    label-width="120px"-->
                <!--                    prop="managerPosition"-->
                <!--                    label="经办人职位名称"-->
                <!--                    class="postInfo-container-item width96"-->
                <!--                  >-->
                <!--                    <el-input v-model="postForm.managerPosition" placeholder="请输入" type="text" clearable />-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
                <!--                <el-col :span="8">-->
                <!--                  <el-form-item-->
                <!--                    label-width="120px"-->
                <!--                    prop="establishment"-->
                <!--                    label="成立日期"-->
                <!--                    class="postInfo-container-item width96"-->
                <!--                  >-->
                <!--                    <el-date-picker-->
                <!--                      v-model="postForm.establishment"-->
                <!--                      type="date"-->
                <!--                      format="yyyy-MM-dd"-->
                <!--                      value-format="yyyy-MM-dd"-->
                <!--                      placeholder="选择成立日期"-->
                <!--                      class="width100"-->
                <!--                    />-->
                <!--                  </el-form-item>-->
                <!--                </el-col>-->
                <el-col :span="20">
                  <el-form-item
                    label-width="120px"
                    prop="address"
                    label="公司地址"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.address" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item
                    label-width="120px"
                    prop="introduction"
                    label="公司简介"
                    class="postInfo-container-item width96"
                  >
                    <el-input
                      v-model="postForm.introduction"
                      :autosize="{ minRows: 3, maxRows: 4}"
                      type="textarea"
                      placeholder="请填写"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="coverImage"
                    label="公司logo"
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
                      <img v-if="postForm.logo" :src="postForm.logo" class="avatar">
                      <i v-if="postForm.logo" class="el-icon-delete" @click.stop="imgRemove('1')" />
                      <i v-if="!postForm.logo" class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                    <span style="color: #999">Logo建议上传尺寸为100 * 100像素，大小在2M以内</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="businessLicense"
                    label="企业营业执照"
                    class="postInfo-container-item width96"
                  >
                    <el-upload
                      class="avatar-uploader"
                      accept=".png,.jpg,.jpeg,.PNG"
                      :headers="myHeaders"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="successBusiness"
                      :before-upload="beforeUpload"
                      :on-remove="handleRemove"
                    >
                      <img v-if="postForm.businessLicense" :src="postForm.businessLicense" class="avatar">
                      <i v-if="postForm.businessLicense" class="el-icon-delete" @click.stop="imgRemove('2')" />
                      <i v-if="!postForm.businessLicense" class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="organizationCodeCertificate"
                    label="组织机构代码证"
                    class="postInfo-container-item width96"
                  >
                    <el-upload
                      class="avatar-uploader"
                      accept=".png,.jpg,.jpeg,.PNG"
                      :headers="myHeaders"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="successOrg"
                      :before-upload="beforeUpload"
                      :on-remove="handleRemove"
                    >
                      <img
                        v-if="postForm.organizationCodeCertificate"
                        :src="postForm.organizationCodeCertificate"
                        class="avatar"
                      >
                      <i
                        v-if="postForm.organizationCodeCertificate"
                        class="el-icon-delete"
                        @click.stop="imgRemove('3')"
                      />
                      <i v-if="!postForm.organizationCodeCertificate" class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <div style="text-align: center">
                    <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="submitForm">
                      提交
                    </el-button>
                    <el-button style="margin-left: 10px;" type="warning" @click="goBack">
                      取消
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Sticky from '../../components/Sticky/index'
import { addHandle, modifyData, getDetailById } from '../../api/company'
import { getDicList } from '../../api/common'

const defaultForm = {
  address: '', // 公司地址
  businessLicense: '',
  businessNature: '', // 企业性质
  businessNatureCode: '', // 企业性质
  category: '',
  categoryCode: '',
  categoryName: '',
  contactPerson: '',
  // establishment: '',
  // financingStage: '',
  idCardBack: '',
  idCardFront: '',
  introduction: '',
  logo: '',
  longitude: '',
  managerEmail: '',
  managerName: '',
  // managerPosition: '',
  // managerQq: '',
  managerIdCardNum: '',
  managerTel: '',
  name: '',
  registeredCapital: '',
  registrationAuthority: '',
  scale: '',
  scaleCode: '',
  shortName: '',
  socialSecurityNumber: '',
  tel: '',
  uniformSocialCreditCode: '',
  organizationCodeCertificate: ''
}
const telPattern = /^[0-9]{11}$|^(0\d{2})-(\d{8})$|^(0\d{3})-(\d{7})$/
export default {
  status: 'draft',
  components: { Sticky },
  filters: {},
  data() {
    return {
      myHeaders: { Authorization: 'bearer ' + getToken() },
      postForm: Object.assign({}, defaultForm),
      loading: false,
      titleName: '新增企业信息', // 标题
      rules: {
        name: [{ required: true, message: '请填写企业名称', trigger: 'change' }],
        // tel: [{ pattern: telPattern, message: '请输入正确的号码' }],
        managerTel: [{ pattern: telPattern, message: '请输入正确的号码' }],
        managerEmail: [{ pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: '请输入正确的邮箱' }]
      },
      busNatureList: [], // 企业性质字典列表
      scaleList: [], // 人员规模
      categoryList: [], // 行业类别列表
      uploadUrl: 'api/person/api/v2/person/upload'

    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
      this.postForm.id = id
      this.titleName = '修改企业信息'
    }
    this.categoryList = getDicList('industry') // 行业类型
    this.busNatureList = getDicList('businessNature') // 企业性质
    this.scaleList = getDicList('scale') // 人员规模
  },
  methods:
      {
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
            this.postForm = data
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
        submitForm(e) {
          this.$refs.postForm.validate(valid => {
            if (valid) {
              const params = {
                address: this.postForm.address,
                businessLicense: this.postForm.businessLicense,
                businessNatureCode: this.postForm.businessNatureCode,
                categoryCode: this.postForm.categoryCode,
                contactPerson: this.postForm.contactPerson,
                // establishment: this.postForm.establishment,
                // financingStage: this.postForm.financingStage,
                introduction: this.postForm.introduction,
                logo: this.postForm.logo,
                managerEmail: this.postForm.managerEmail,
                managerName: this.postForm.managerName,
                // managerPosition: this.postForm.managerPosition,
                // managerQq: this.postForm.managerQq,
                managerIdCardNum: this.postForm.managerIdCardNum,
                managerTel: this.postForm.managerTel,
                name: this.postForm.name,
                registeredCapital: this.postForm.registeredCapital,
                registrationAuthority: this.postForm.registrationAuthority,
                scaleCode: this.postForm.scaleCode,
                shortName: this.postForm.shortName,
                socialSecurityNumber: this.postForm.socialSecurityNumber,
                tel: this.postForm.tel,
                uniformSocialCreditCode: this.postForm.uniformSocialCreditCode,
                organizationCodeCertificate: this.postForm.organizationCodeCertificate
              }

              if (this.postForm.id) {
                this.modify(this.postForm.id, params)
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
        async add() {
          this.loading = true
          const { code } = await addHandle(this.postForm)
          if (code === 0) {
            this.$notify({
              title: '成功',
              message: '发布成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({
              path: '/company/companyList'
            })
          }
          this.loading = false
        },

        /**
         * 修改
         * @param id
         */
        async modify(id, params) {
          this.loading = true
          const { code } = await modifyData(id, params)
          if (code === 0) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({
              path: '/company/companyList'
            })
          }
          this.loading = false
        },
        // 上传封面图
        handleRemove(file, fileList) {
        },
        successLogo(res, file) {
          this.postForm.logo = res.data
        },
        successBusiness(res, file) {
          this.postForm.businessLicense = res.data
        },
        successOrg(res, file) {
          this.postForm.organizationCodeCertificate = res.data
        },
        // 删除图片
        imgRemove(type) {
          if (type === '1') {
            this.postForm.logo = ''
          } else if (type === '2') {
            this.postForm.businessLicense = ''
          } else if (type === '3') {
            this.postForm.organizationCodeCertificate = ''
          }
        },
        beforeUpload(file) {
          const isLt2M = file.size / 1024 / 1024 < 2
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
          }
          return isLt2M
        }
      }
}
</script>

<style scoped lang="scss">
  @import "~@/styles/mixin.scss";

  .createPost-main-container {
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

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #bfcbd9;
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
