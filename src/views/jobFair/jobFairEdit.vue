<template>
  <div>
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
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
                  <el-form-item label-width="120px" prop="title" label="招聘会标题" class="postInfo-container-item width96">
                    <el-input v-model="postForm.title" placeholder="请输入" clearable class="width400" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="organization"
                    label="举办单位"
                    class="postInfo-container-item width96"
                  >
                    <el-input v-model="postForm.organization" placeholder="请输入" clearable class="width100" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="type"
                    label="招聘会类型"
                    class="postInfo-container-item width96"
                  >
                    <el-select v-model="postForm.type" placeholder="请选择" class="width100">
                      <el-option
                        v-for="item in typeList"
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
                    prop="areaAddr"
                    label="举办区域"
                    class="postInfo-container-item width96"
                  >
                    <el-cascader
                      ref="area"
                      v-model="postForm.areaAddr"
                      :props="props"
                      clearable
                      class="width100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="120px" prop="address" label="举办地址" class="postInfo-container-item width96">
                    <el-input v-model="postForm.address" placeholder="请输入" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="positionNum"
                    label="展位数量"
                    class="postInfo-container-item width96"
                  >
                    <el-input
                      v-model="postForm.positionNum"
                      placeholder="请输入"
                      type="number"
                      min="0"
                      clearable
                      :disabled="isNet"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="startTime"
                    label="举办时间"
                    class="postInfo-container-item width96"
                  >
                    <el-date-picker
                      v-model="postForm.startTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择举办开始日期"
                      class="width100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="120px" prop="endTime" label="截止时间" class="postInfo-container-item width96">
                    <el-date-picker
                      v-model="postForm.endTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择举办结束日期"
                      class="width100"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="registrStartTime"
                    label="开放申请"
                    class="postInfo-container-item width96"
                  >
                    <el-date-picker
                      v-model="postForm.registrStartTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择开放申请日期"
                      class="width100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item
                    label-width="120px"
                    prop="registrEndTime"
                    label="截止申请"
                    class="postInfo-container-item width96"
                  >
                    <el-date-picker
                      v-model="postForm.registrEndTime"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择截止申请日期"
                      class="width100"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label-width="140px" prop="onlineApply" label="是否开启线上申请">
                    <el-radio v-model="postForm.onlineApply" :label="1">是</el-radio>
                    <el-radio v-model="postForm.onlineApply" :label="0">否</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="20">
                  <el-form-item
                    label-width="120px"
                    prop="coverImage"
                    label="招聘会图片"
                    class="postInfo-container-item width96"
                  >
                    <el-upload
                      class="avatar-uploader"
                      accept=".png,.jpg,.jpeg,.PNG"
                      :headers="myHeaders"
                      :action="uploadUrl"
                      :show-file-list="false"
                      :on-success="handleSuccess"
                      :before-upload="beforeUpload"
                      :on-remove="handleRemove"
                    >
                      <img v-if="postForm.coverImage" :src="postForm.coverImage" class="avatar">
                      <i v-if="postForm.coverImage" class="el-icon-delete" @click.stop="imgRemove()" />
                      <i v-if="!postForm.coverImage" class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                    <span style="color: #999">图片建议上传尺寸为270 * 130像素，大小在2M以内</span>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-form-item
                    label-width="120px"
                    prop="introduction"
                    label="招聘会简介"
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
                <el-col :span="24">
                  <div style="text-align: center">
                    <el-button
                      v-if="userName !== 'test'"
                      v-loading="loading"
                      style="margin-left: 10px;"
                      type="primary"
                      @click="submitForm"
                    >
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
import Sticky from '../../components/Sticky/index'
import { addJob, getDetailById, modifyJob } from '../../api/jobFair'
import { getArea } from '../../api/region'

const defaultForm = {
  title: '', // 文章题目
  organization: '', // 举办单位
  type: '', // 类型
  address: '', // 举办地址
  startTime: '', // 招聘会举办时间
  endTime: '', // 招聘会结束时间
  positionNum: '', // 展位数
  registrStartTime: '', // 报名开始时间
  registrEndTime: '', // 报名截止时间
  onlineApply: 1, // 是否开启线上申请 0-否 1-是
  introduction: '', // 介绍
  coverImage: '', // 图片
  areaCode: '',
  areaAddr: []
}
export default {
  status: 'draft',
  components: { Sticky },
  filters: {},
  data() {
    return {
      userName: this.$store.state.user.username,
      myHeaders: { Authorization: 'bearer ' + this.$store.state.user.token },
      postForm: Object.assign({}, defaultForm),
      loading: false,
      titleName: '新增招聘会', // 标题
      rules: {
        title: [{ required: true, message: '请输入招聘会标题', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择招聘会举办时间', trigger: 'change' }],
        registrEndTime: [{ required: true, message: '请选择报名截止时间', trigger: 'change' }],
        organization: [{ required: true, message: '请填写举办单位', trigger: 'change' }], // 举办单位
        type: [{ required: true, message: '请选择类型', trigger: 'change' }], // 类型
        registrStartTime: [{ required: true, message: '请选择报名开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择招聘会结束时间', trigger: 'change' }],
        positionNum: [{
          pattern: /(^[0-9]\d*$)/,
          message: '请输入整数'
        }],
        areaAddr: [{ required: true, message: '举办区域不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '举办地址不能为空', trigger: 'change' }],
        coverImage: [{ required: true, message: '请上传图片', trigger: 'change' }],
        introduction: [{ required: true, message: '请输入介绍内容', trigger: 'blur' }]
      },
      typeList: [
        { label: '现场招聘会', value: 1 },
        { label: '网络招聘会', value: 2 }
      ], // 招聘会类型
      isNet: false,
      uploadUrl: 'api/person/api/v2/person/upload',
      // areaAddr: [],
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
      }
    }
  },
  watch: {
    'postForm.type': function(val) {
      if (val === 2) {
        this.postForm.address = '网络招聘会'
        this.isNet = true
        this.postForm.positionNum = ''
      } else {
        this.isNet = false
      }
    },
    'postForm.areaAddr': function(val) {
      if (val) {
        if (val.length < 2) {
          this.postForm.area = ''
          this.postForm.areaCode = ''
          this.postForm.city = ''
          this.postForm.cityCode = ''
        } else if (val.length < 3) {
          this.postForm.area = ''
          this.postForm.areaCode = ''
        }
      }
    }
  },

  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
      this.postForm.id = id
      this.titleName = '修改招聘会'
    }
  },
  methods:
      {
        goPrev() {
          this.$router.go(-1)
        },
        // 返回
        goBack() {
          this.$router.push({
            path: '/jobFair/jobFairList'
          })
        },
        /**
         * 发布
         */
        submitForm() {
          this.$refs.postForm.validate(valid => {
            if (valid) {
              if (this.postForm.startTime > this.postForm.endTime) {
                this.$message.error('举办开始时间不能晚于结束时间')
                return
              }
              if (this.postForm.registrStartTime > this.postForm.startTime) {
                this.$message.error('招聘会开始时间不能早于开放申请时间')
                return
              }
              if (this.postForm.registrEndTime > this.postForm.endTime) {
                this.$message.error('截止申请时间不能晚于招聘会结束时间')
                return
              }
              if (!this.postForm.areaAddr.length) {
                this.$message.error('举办区域不能为空')
                return
              }
              if (this.postForm.areaAddr.length) {
                const nodes = this.$refs.area.getCheckedNodes()
                const [provinceCode, cityCode, areaCode] = nodes[0].path
                const [province, city, area] = nodes[0].pathLabels
                this.postForm.area = area || ''
                this.postForm.areaCode = areaCode || ''
                this.postForm.city = city || ''
                this.postForm.cityCode = cityCode || ''
                this.postForm.province = province || ''
                this.postForm.provinceCode = provinceCode || ''
              }
              const params = {
                title: this.postForm.title, // 文章题目
                organization: this.postForm.organization, // 举办单位
                type: this.postForm.type, // 类型
                address: this.postForm.address, // 举办地址
                startTime: this.postForm.startTime, // 招聘会举办时间
                endTime: this.postForm.endTime, // 招聘会结束时间
                positionNum: this.postForm.positionNum, // 展位数
                registrStartTime: this.postForm.registrStartTime, // 报名开始时间
                registrEndTime: this.postForm.registrEndTime, // 报名截止时间
                onlineApply: this.postForm.onlineApply, // 是否开启线上申请 0-否 1-是
                introduction: this.postForm.introduction, // 介绍
                coverImage: this.postForm.coverImage, // 图片
                area: this.postForm.area,
                areaCode: this.postForm.areaCode,
                city: this.postForm.city,
                cityCode: this.postForm.cityCode,
                province: this.postForm.province,
                provinceCode: this.postForm.provinceCode
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
         *
         */
        async add(params) {
          this.loading = true
          const { code } = await addJob(params)
          if (code === 0) {
            this.$notify({
              title: '成功',
              message: '发布成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({
              path: '/jobFair/jobFairList'
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
          const { code } = await modifyJob(id, params)
          if (code === 0) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.$router.push({
              path: '/jobFair/jobFairList'
            })
          }
          this.loading = false
        },
        /**
         * 根据Id获取详情
         * @param id
         */
        async fetchData(id) {
          const { data } = await getDetailById(id)
          if (data) {
            this.postForm = data
            if (this.postForm.type === 2) {
              this.postForm.address = '网络招聘会'
              this.postForm.positionNum = ''
              this.isNet = true
            } else {
              this.isNet = false
            }
            const areaAdd = []
            if (this.postForm.provinceCode) areaAdd.push(parseInt(this.postForm.provinceCode))
            if (this.postForm.cityCode) areaAdd.push(parseInt(this.postForm.cityCode))
            if (this.postForm.areaCode) areaAdd.push(parseInt(this.postForm.areaCode))
            this.postForm.areaAddr = areaAdd
            // // 重新设置props，级联才能回显之前没有点击过的选项
            this.props = {
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
            }
          }
        },
        // 上传封面图
        handleRemove(file, fileList) {
        },
        handleSuccess(res, file) {
          this.postForm.coverImage = res.data
        },
        imgRemove() {
          this.postForm.coverImage = ''
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

  .head-title {
    text-align: center;
  }

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;

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
    width: 270px;
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
