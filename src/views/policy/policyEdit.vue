<template>
  <div>
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '+postForm.status">
        <span class="head-title">{{ titleName }}</span>
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
          <el-button
            v-if="userName !== 'test'"
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
                  <el-form-item label-width="80px" label="政策类型" prop="category" class="postInfo-container-item">
                    <el-select v-model="postForm.category" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="60px" label="标签" prop="tags" class="postInfo-container-item">
                    <el-input v-model="postForm.tags" placeholder="请输入标签内容" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="80px" label="区域" prop="areaAddr" class="postInfo-container-item width96">
                    <el-cascader
                      ref="area"
                      v-model="areaAddr"
                      :props="props"
                      clearable
                      class="width100"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom: 40px;" label-width="85px" prop="summary" label="政策摘要">
          <el-input
            v-model="postForm.summary "
            :rows="1"
            type="textarea"
            class="article-textarea"
            autosize
            placeholder="请输入摘要"
          />
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }}个字</span>
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;" label="政策内容:">
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
import { addPolicy, getPolicyById, modifyPolicy } from '../../api/policy'
import { getArea } from '../../api/region'

const defaultForm = {
  title: '', // 文章题目
  content: '', // 文章内容
  summary: '', // 文章摘要
  id: undefined,
  tags: '',
  category: 1
}
export default {
  name: 'PolicyEdit',
  status: 'draft',
  components: { Sticky, Tinymce, MDinput },
  filters: {
    filterHtml(val) {
      return val.replace(/<[^>]*>/g)
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + '为必传项',
          type: 'error'
        })
        callback(new Error(rule.field + '为必传项'))
      } else {
        callback()
      }
    }
    return {
      userName: this.$store.state.user.username,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      options: [{
        value: 1,
        label: '个人'
      }, {
        value: 0,
        label: '企业'
      }],
      policyType: '', // 政策类型
      rules: {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        summary: [{ required: true, message: '摘要不能为空', trigger: 'blur' }],
        tags: [{ required: true, message: '标签不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      },
      titleName: '新增政策', // 标题
      areaAddr: [],
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
  computed: {
    contentShortLength() {
      return this.postForm.summary.length
    }
  },
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
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
      this.postForm.id = id
      this.titleName = '修改政策'
    }

    // Why need to make a copy of this.$route here?
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods:
      {
        goPrev() {
          this.$router.go(-1)
        },
        /**
         * 发布
         */
        submitForm(e) {
          if (this.areaAddr.length) {
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
          this.$refs.postForm.validate(valid => {
            if (valid) {
              if (this.postForm.id) {
                this.modify(this.postForm.id)
              } else {
                this.add()
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
          const { code } = await addPolicy(this.postForm)
          if (code === 0) {
            this.$notify({
              title: '成功',
              message: '发布文章成功',
              type: 'success',
              duration: 2000
            })
            this.status = 'published'
            this.$router.push({
              path: '/policy/policyList'
            })
          }
          this.loading = false
        },
        /**
         * 根据Id获取详情
         * @param id
         */
        async fetchData(id) {
          const { data } = await getPolicyById(id)
          if (data) {
            this.postForm = data
            if (this.postForm.provinceCode) this.areaAddr.push(parseInt(this.postForm.provinceCode))
            if (this.postForm.cityCode) this.areaAddr.push(parseInt(this.postForm.cityCode))
            if (this.postForm.areaCode) this.areaAddr.push(parseInt(this.postForm.areaCode))
          }
        },
        /**
         * 修改
         * @param id
         */
        async modify(id) {
          this.loading = true
          const { code } = await modifyPolicy(id, this.postForm)
          if (code === 0) {
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
            this.status = 'published'
            this.$router.push({
              path: '/policy/policyList'
            })
          }
          this.loading = false
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
      top: 0px;
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

</style>
