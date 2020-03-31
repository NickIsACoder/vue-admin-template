<template>
  <div class="group">
    <el-form ref="input_form" :model="input_form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="题目" prop="title" :rules="{ required: true, message: '请输入题目内容', trigger: 'blur' }">
        <el-input v-model="input_form.title" />
      </el-form-item>
      <el-form-item label="题目说明" prop="remark">
        <el-input v-model="input_form.remark" type="textarea" placeholder="请输入题目说明，可以为空" />
      </el-form-item>
      <!-- 一题限上传一张,不显示选项进行增减 -->
      <!-- <el-form-item label="选项" prop="options">
        <div v-for="(item, index) in input_form.options" :key="index" class="option-item">
          <el-upload :action="uploadUrl" :headers="myHeaders" :show-file-list="false" list-type="picture-card" class="notallow" style="display:inline-block;">
            <i class="el-icon-plus" />
          </el-upload>
          <div class="option-btn">
            <el-button class="pad8" type="success" size="small" icon="el-icon-plus" @click="addOption(input_form.options)" />
            <el-button class="pad8" type="warning" size="small" icon="el-icon-delete" @click="delOption(input_form.options,index)" />
          </div>
        </div>
      </el-form-item> -->
      <el-form-item label="是否必填">
        <el-switch v-model="input_form.required" active-color="#13ce66" />
      </el-form-item>
      <el-form-item v-if="kulist&&kulist.length>0" label="对等关联">
        <el-select v-model="input_form.columnValue" :placeholder="releplaceholder" class="selectItem" clearable>
          <template v-for="item in kulist">
            <el-option v-if="item.inputType==input_form.inputType" :key="item.columnValue" :label="item.title" :value="item.columnValue" />
          </template>
        </el-select>
      </el-form-item>
      <div class="btnBox">
        <el-button type="primary" @click="submitForm('input_form')">确定</el-button>
        <el-button @click="cancelForm()">取消</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
const uuid = require('uuid')
export default {
  props: {
    fullForm: { // 全部题目
      type: Array,
      default() {
        return []
      }
    },
    question: { // 当前题目
      type: Object,
      default() {
        return {}
      }
    },
    deletesQuesUuid: { // 问卷中所删除的题目的uuid
      type: Array,
      default() {
        return []
      }
    },
    kulist: { // 使用的题库
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      input_form: {},
      releplaceholder: '暂无可关联的题目',
      myHeaders: { Authorization: 'bearer ' + this.$store.state.user.token },
      uploadUrl: 'api/person/api/v2/person/upload'
    }
  },
  watch: {
    question: function(newVal, oldVal) {
      if (newVal === oldVal) {
        return false
      }
      this.input_form = newVal
    }
  },
  created() {
    if (this.question.title) { // 为编辑情况下
      this.input_form = this.question
    } else { // 为新建
      this.input_form = {
        columnValue: '',
        defaultValue: '',
        inputType: 7, // 控件类型
        options: [
          {
            columnValue: '',
            content: '选项',
            selected: false,
            serial: 1,
            optionUuid: uuid.v1(), // 仅前端用
            subQuestionUuids: []
          }
        ],
        questionUuid: uuid.v1(),
        remark: '', // 描述
        required: false,
        serial: '', // 序号
        subQuestionUuids: [],
        title: '图片上传',
        verify: 0 // 验证类型
      }
    }
    for (const i in this.kulist) {
      if (this.kulist[i].inputType === this.input_form.inputType) {
        this.releplaceholder = '请选择'
      }
    }
  },
  methods: {
    addOption(source) {
      const tempData = {
        columnValue: '',
        content: '选项',
        selected: false,
        serial: this.input_form.options.length + 1,
        optionUuid: uuid.v1(), // 仅前端用
        subQuestionUuids: []
      }
      source.push(Object.assign({}, tempData))
    },
    // 删除选项
    delOption(source, index) {
      if (source.length > 1) {
        source.splice(index, 1)
        this.input_form.default = 1
      } else {
        this.$message.error('最后一个啦，不要删除哦~')
      }
    },
    // 提交题目
    submitForm(formName) {
      this.errShow = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('toSaveData', this.input_form, 'uploadInput', 6)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelForm() {
      this.$emit('toCancel', 'uploadInput', 6)
    }
  }
}
</script>

<style scoped lang="scss">
.option-btn{
  // width: 50%;
  display:inline-block;
  padding-left: 10px;
  box-sizing: border-box;
}
.option-item{
  margin-bottom:10px;
}
.btnBox{
  text-align: center;
}
.btn{
  border-bottom:1px solid #333;
  cursor: pointer;
  &:hover{
    color: #1890ff;
    border-color: #1890ff;
  }
}
.rele{
  background: #f1f1f1;
    height: 20px;
    font-size: 12px;
    line-height: 20px;
    padding-left: 20px;
    width: 48%;
}
.el-form-item /deep/ .el-upload--picture-card {
  width: 90px;
  height: 80px;
}
.el-form-item /deep/ .el-upload {
  width: 80px;
  height: 80px;
  line-height: 80px;
  pointer-events: none;
}
.el-form-item /deep/ .avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.notallow{
  cursor: not-allowed;
}
.pad8{
  padding: 8px 8px;
}
</style>
