<template>
  <!--  新增、修改公告-->
  <div>
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar'">
        <span class="head-title">{{ titleName }}</span>
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
          <el-button
            v-loading="loading"
            class="el-icon-edit"
            type="primary"
            @click="submitForm"
          >
            发布
          </el-button>
        </div>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                标题
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-form-item
                    prop="picture"
                    label="公告主图"
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
                      <img v-if="postForm.picture" :src="postForm.picture" class="avatar">
                      <i v-if="postForm.picture" class="el-icon-delete" @click.stop="imgRemove()" />
                      <i v-if="!postForm.picture" class="el-icon-plus avatar-uploader-icon" />
                    </el-upload>
                    <span style="color: #999">图片建议上传尺寸为120 * 100像素，大小在2M以内</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="区域" prop="areaAddr" class="postInfo-container-item width96">
                    <el-cascader
                      ref="areaArr"
                      v-model="areaAddr"
                      :props="props"
                      clearable
                      class="width100"
                      :placeholder="areaPlaceholder"
                      @change="areaChangeModal"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item prop="content" style="margin-bottom: 30px;" label="公告内容:">
          <Tinymce ref="editor" v-model="postForm.content" :height="400" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
import Sticky from '../../components/Sticky/index'
import { addNews, editNews } from '../../api/policy'
import { findUserRegionByCode } from '../../api/region'

const defaultForm = {
  title: '', // 标题
  content: '', // 文章内容
  id: '',
  area: '',
  areaCode: '',
  city: '',
  cityCode: '',
  province: '',
  provinceCode: '',
  picture: ''
}
export default {
  components: { Sticky, Tinymce, MDinput },
  filters: {
    filterHtml(val) {
      return val.replace(/<[^>]*>/g)
    }
  },
  data() {
    return {
      myHeaders: { Authorization: 'bearer ' + this.$store.state.user.token },
      uploadUrl: 'api/person/api/v2/person/upload',
      userName: this.$store.state.user.username,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      titleName: '新增公告', // 标题
      isEdit: false,
      areaAddr: [],
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
  computed: {},
  watch: {
    areaAddr(val) {
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
  },

  created() {
    const row = this.$route.params.row
    if (Object.entries(this.$route.params).length > 0) {
      this.areaPlaceholder = `${row.province} / ${row.city} / ${row.area}`
      this.titleName = '修改公告'
      this.isEdit = true
      if (row.provinceCode) this.areaAddr.push(parseInt(row.provinceCode))
      if (row.cityCode) this.areaAddr.push(parseInt(row.cityCode))
      if (row.areaCode) this.areaAddr.push(parseInt(row.areaCode))
      this.postForm = {
        title: row.title, // 标题
        content: row.content, // 文章内容
        id: row.id,
        area: row.area,
        areaCode: row.areaCode,
        city: row.city,
        cityCode: row.cityCode,
        province: row.province,
        provinceCode: row.provinceCode,
        picture: row.picture
      }
    }
  },
  methods:
      {
        goPrev() {
          this.$router.go(-1)
        },
        /**
         * 发布
         */
        submitForm() {
          this.$refs.postForm.validate(valid => {
            if (valid) {
              if (!this.areaAddr.length) {
                this.$message.error('区域不能为空')
                return
              }
              const { title, content, area, areaCode, city, cityCode, province, provinceCode, picture } = this.postForm
              const params = {
                title, content, picture
              }
              if (this.postForm.area) params.area = area
              if (this.postForm.areaCode) params.areaCode = areaCode
              if (this.postForm.city) params.city = city
              if (this.postForm.cityCode) params.cityCode = cityCode
              if (this.postForm.province) params.province = province
              if (this.postForm.provinceCode) params.provinceCode = provinceCode
              if (this.postForm.id && this.isEdit) {
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
        async add(params) {
          this.loading = true
          const { code } = await addNews(params)
          if (code === 0) {
            this.$message.success('发布成功！')
            this.$router.push({
              path: '/policy/newsList'
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
          const { code } = await editNews(id, params)
          if (code === 0) {
            this.$message.success('修改成功！')
            this.$router.push({
              path: '/policy/newsList'
            })
          }
          this.loading = false
        },
        // 上传图片
        handleSuccess(res, file) {
          this.postForm.picture = res.data
        },
        imgRemove() {
          this.postForm.picture = ''
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
        areaChangeModal() {
          const node = this.$refs.areaArr.getCheckedNodes()
          const [provinceCode, cityCode, areaCode] = node[0].path
          const [province, city, area] = node[0].pathLabels
          this.postForm.province = province || ''
          this.postForm.provinceCode = provinceCode || ''
          this.postForm.city = city || ''
          this.postForm.cityCode = cityCode || ''
          this.postForm.area = area || ''
          this.postForm.areaCode = areaCode || ''
        }
      }
}
</script>

<style scoped lang="scss">
  @import "~@/styles/mixin.scss";

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
      border-radius: 0px;
      border-bottom: 1px solid #bfcbd9;
    }
  }
  .avatar-uploader {
    width: 120px;
    height: 100px;
    div {
      & img {
        width: 120px;
        height: 100px;
      }
      .avatar-uploader-icon {
        width: 120px;
        height: 100px;
        line-height: 100px;
      }
    }
  }
</style>
