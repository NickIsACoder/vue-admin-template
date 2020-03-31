<template>
  <div class="question-wrapper notallow">
    <el-col :span="24" class="question-list">
      <div v-if="Object.keys(viewList).length===0" class="question-box-none">暂无预览内容</div>
      <div v-if="Object.keys(viewList).length !==0" class="question-box">
        <div
          v-for="(view, index) in viewList"
          :key="view.id"
          class="question-item"
          :class="{notallow :false }"
        >
          <div class="question-title">
            <span v-show="view.required" class="req">*</span>
            {{ index + 1 }}、{{ view.title }}
            <p>{{ view.remark }}</p>
          </div>
          <div>
            <div v-if="view.inputType === 1" class="option-item">
              <!--  类型1 根据 verify 判断是什么类型 输入框-->
              <el-input
                v-if="view.verify === 0 || view.verify === 1 || view.verify === 2 ||view.verify === 3 ||view.verify === 4 ||view.verify === 5 ||view.verify === 6 ||view.verify === 7 ||
                  view.verify === 11 "
                v-model="view.inputVal"
                type="text"
                placeholder="请输入..."
                @change="inputChange(view.inputVal, view.verify, view.id)"
              />
              <el-date-picker
                v-if="view.verify === 10"
                v-model="view.dateVal"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                style="width: 100%"
              />
              <div v-if="view.verify === 8">
                <el-cascader
                  ref="area"
                  v-model="view.areaPro"
                  :props="proProps"
                  clearable
                  style="width:100%"
                  placeholder="选择省份"
                  @change="areaChange"
                />
              </div>
              <div v-if="view.verify === 9">
                <el-cascader
                  ref="area"
                  v-model="view.areaAddr"
                  :props="props"
                  clearable
                  style="width:100%"
                  placeholder="选择省市区"
                  @change="areaChange"
                />
              </div>
              <span v-show="view.id === errorId " :id="view.id" style="color: red">{{ errMsg }}</span>
            </div>
            <div v-if="view.inputType === 2">
              <!-- 单选-->
              <div v-for="(option) in view.options" :key="option.id">
                <input
                  :id="option.id"
                  type="radio"
                  :name="option.name"
                  :value="option.content"
                  :checked="option.selected"
                > <label class="radio-wrap" :for="option.id">{{ option.content }}</label>
              </div>
            </div>
            <div v-if="view.inputType === 3">
              <!--  多选 -->
              <el-checkbox v-for="optCheck in view.options" :key="optCheck.id" v-model="optCheck.selected">
                {{ optCheck.content }}
              </el-checkbox>

            </div>
            <div v-if="view.inputType === 4" class="opt-wrap">
              <!--   多输入 start 4 -->
              <el-row>
                <el-col :span="23" class="fr">
                  <div v-for="inputs in view.options" :key="inputs.id" class="opt-wrap-item">
                    <el-input
                      v-model="inputs.value"
                      type="text"
                      :placeholder="`请输入${inputs.content}`"
                      clearable
                    />
                  </div>
                </el-col>
              </el-row>
            </div>
            <div v-if="view.inputType === 5" class="opt-wrap">
              <!--    多级 单个输入 start-->
              <el-row>
                <el-col :span="24" class="fr">
                  <div v-for="inputItem in view.options" :key="inputItem.id" class="opt-wrap-item">
                    <span>{{ inputItem.content }}</span>
                    <el-input
                      v-model="inputItem.value"
                      type="text"
                      placeholder="请输入"
                      clearable
                    />
                  </div>
                </el-col>
              </el-row>
            </div>
            <!--            多级单选  级联选择器 start-->
            <div v-if="view.inputType === 6" class="opt-wrap">
              <el-row>
                <el-col :span="24" class="fr">
                  <el-cascader
                    v-model="cascaderList"
                    :options="view.options"
                    :props="optionProps"
                    style="width:100%;"
                    @change="cascaderChange"
                  />
                </el-col>
              </el-row>
            </div>
            <!--            图片 start-->
            <div v-if="view.inputType === 7" class="opt-wrap">
              <el-row>
                <el-col :span="23" class="fr">

                  <el-upload
                    v-for="(picItem, picIndex) in view.options"
                    :key="picItem.id"
                    class="avatar-uploader"
                    accept=".png,.jpg,.jpeg,.PNG"
                    :headers="myHeaders"
                    :action="uploadUrl"
                    :show-file-list="false"
                    :on-change="(file, fileList) => {selectFile(file, fileList, index)}"
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload"
                  >
                    <!-- <img v-if="picList[index][picIndex]" :src="picList[index][picIndex]" class="avatar">
                    <i v-if="picList[index][picIndex]" class="el-icon-delete" @click.stop="imgRemove(picList[index][picIndex],picIndex)" /> -->
                    <!-- <i v-if="!picList[index][picIndex]" class="el-icon-plus avatar-uploader-icon" /> -->
                    <i class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>

                </el-col>
              </el-row>
            </div>

          </div>
        <!-- 类型 end -->
        </div>
      </div>
    </el-col>
  </div>
</template>

<script>
import { getArea } from '../../../api/region'

export default {
  props: {
    questionList: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      myHeaders: { Authorization: 'bearer ' + this.$store.state.user.token },
      uploadUrl: 'api/person/api/v2/person/upload',
      viewList: [], // 问题列表
      relations: [], // 问题关系
      showIds: [], // 显示的id
      errMsg: '',
      errorId: '',
      checkList: [],
      cascaderList: [],
      subValue: '',
      subValList: [],
      picList: [], // 上传图片
      actIndex: -1,
      isSecond: false,
      optionProps: {
        value: 'id',
        label: 'content',
        children: 'subOptions'
      },
      proProps: {
        lazy: true,
        lazyLoad(node, resolve) {
          getArea(node.value || 100000).then((res) => {
            let nodes = []
            if (res.code === 0 && res.data) {
              nodes = res.data.map((area) => ({
                label: area.name,
                value: area.id,
                leaf: area.level >= 1
              }))
            }
            resolve(nodes)
          })
        },
        checkStrictly: true
      },
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
    questionList(val) {
      this.showIds = val.directShowQuestionIds
      this.viewList = val.questions
      this.relations = val.relations
      var i
      for (i = 0; i < this.viewList.length; i++) {
        if (this.viewList[i].inputType === 7) {
          this.picList.push([])
        }
        if (this.viewList[i].inputType === 2) {
          this.viewList[i].options.forEach((val) => {
            val.name = `radio${i}`
          })
        }
      }
    }
  },
  mounted() {

  },
  methods: {
    /**
       * 监听输入框 第一种类型 input 判断属性类型
       * @param {string} val
       * @param {number} type
       */
    inputChange(val, type, id) {
      const reg1 = /^-?\d+$/ // 整数
      const reg2 = /^(([^0][0-9]+|0)\.([0-9]{1,2}))$/ // 小数
      const reg3 = /^1[3|4|5|7|8]\d{9}$/ // 手机
      const reg4 = /^(\d{3,4}-)?\d{7,8}$/ // 固话
      const reg5 = /^(\d{3,4}-)?\d{7,8}$|^[1][3,4,5,6,7,8,9][0-9]{9}$/ // 手机或固话
      const reg6 = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/ // 邮件
      const reg7 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/ // 身份证
      const reg11 = /^[A-Za-z]+$/ // 只能输入由26个英文字母组成的字符串
      switch (type) {
        case 1: // 整数  /^-?\d+$/
          if (!reg1.test(val)) {
            this.errMsg = '请输入整数'
            this.errorId = id
          } else {
            this.errMsg = ''
          }
          break
        case 2: // 小数
          if (!reg2.test(val)) {
            this.errMsg = '请输入小数'
            this.errorId = id
          } else {
            this.errMsg = ''
          }
          break
        case 3: // 手机  /^1[3|4|5|7|8]\d{9}$/
          if (!reg3.test(val)) {
            this.errMsg = '请输入正确的手机号码'
            this.errorId = id
          } else {
            this.errMsg = ''
          }
          break
        case 4: // 固话
          if (!reg4.test(val)) {
            this.errMsg = '请输入正确的电话号码'
            this.errorId = id
          } else {
            this.errMsg = ''
          }
          break
        case 5: // 手机或固话
          if (!reg5.test(val)) {
            this.errMsg = '请输入正确的号码'
            this.errorId = id
          } else {
            this.errMsg = ''
          }
          break
        case 6: // 邮件
          if (!reg6.test(val)) {
            this.errMsg = '请输入正确的邮件格式'
            this.errorId = id
          } else {
            this.errMsg = ''
          }
          break
        case 7: // 身份证
          if (!reg7.test(val)) {
            this.errMsg = '请输入正确的身份证号'
            this.errorId = id
          } else {
            this.errMsg = ''
          }
          break
        case 11: // 英文字母
          if (!reg11.test(val)) {
            this.errMsg = '只能输入26个英文字母'
            this.errorId = id
          } else {
            this.errMsg = ''
          }
          break
      }
    },
    cascaderChange(arr) {

    },
    /**
       * 级联选择器切换赋值
       */
    areaChange() {
    },
    selectFile(res, file, index) {
      this.actIndex = index
      console.log(index)
    },
    // 上传图片
    handleSuccess(res, file) {
      this.picList[this.actIndex].length = 0
      this.picList[this.actIndex].push(res.data)
    },
    imgRemove(url, index) {
      this.picList[this.actIndex].splice(index, 1)
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isLt2M
    }
  }
}
</script>

<style scoped lang="scss">
  $blue-color: #1890ff;
  $gray-color: #999;
  input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    display: none;
  }

  .question-box-none {
    line-height: 50px;
    font-size: 18px;
    text-align: center;
    margin: 50px;
  }

  .question-box {
    .notallow {
      pointer-events: none;
    }

    .question-item {
      clear: both;
      padding: 10px 14px;
      margin: 4px;

      &:hover {
        background-color: #f5f5f5;
      }
      &:hover .el-icon-delete {
        background-color: red;
      }
      .question-title {
        position: relative;
        font-size: 16px !important;
        font-weight: bold;
        padding: 0 0 8px 0 !important;
        display: block;
        word-wrap: break-word;

        .req {
          color: red !important;
        }

        > p {
          font-size: 12px;
          font-weight: normal;
          line-height: 22px;
          color: $gray-color;
          margin: 2px 0;
          margin-left: 10px;
        }
      }

      .opt-wrap {
        .opt-wrap-item {
          margin-bottom: 5px;

          & > span {
            display: block;
            line-height: 34px;
            font-size: 14px;
            font-weight: bold;
            margin: 3px 0;

            > em.req {
              font-size: 14px;
              color: red;
              margin-right: 5px;
            }
          }
        }
        .avatar-uploader {
          display: inline-block;
          margin-right: 10px;
          width: 100px;
          height: 100px;
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          background-color: #fff;

          &:hover {
            border-color: #409EFF;
          }

          div {
            width: 100%;
            height: 100%;

            & img {
              width: 100%;
              height: 100%;
              display: block;
            }

            .el-icon-delete {
              font-size: 20px;
              position: absolute;
              right: 0;
              top: 0;
              padding: 5px;
              z-index: 100;
              background-color: #db3b21;
              color: #fff;
              border-bottom-left-radius: 6px;
            }

            .avatar-uploader-icon {
              font-size: 28px;
              color: #8c939d;
              width: 100px;
              height: 100px;
              line-height: 100px;
              text-align: center;
            }
          }
        }
      }

      input[type="radio"] + label.radio-wrap {
        color: #606266;
        font-weight: 500;
        font-size: 14px;
        line-height: 30px;

        &::before {
          content: "\a0"; /*不换行空格*/
          display: inline-block;
          vertical-align: middle;
          width: 16px;
          height: 16px;
          margin: 3px 12px 5px 0;
          border-radius: 50%;
          border: 1px solid #DCDFE6;
          background-color: #fff;
        }
      }

      input[type="radio"]:checked + label.radio-wrap {
        color: $blue-color;

        &::before {
          background-color: $blue-color;
          border: 1px solid $blue-color;
          background-clip: content-box;
          padding: 4px;
          color: $blue-color;
        }
      }

      .choose-label {
        cursor: pointer;
        font-size: 16px;
        color: #333;
        text-align: left;

        > label {
          line-height: 28px;
          display: block;
          font-size: 16px;
        }

        .el-checkbox__label {
          font-size: 16px;
        }
      }

      .question-desc {
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        color: $gray-color;
        margin: 2px 0;
      }
    }

    .quest-btn {
      display: block;
      margin: 50px auto;
    }
  }
.notallow{
  pointer-events: none;
  // .question-item{
    cursor:not-allowed
  // }
}
</style>
