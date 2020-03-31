<template>
  <div class="group">
    <el-form ref="input_form" :model="input_form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="题目" prop="title" :rules="{ required: true, message: '请输入题目内容', trigger: 'blur' }">
        <el-input v-model="input_form.title" :prefix-icon="icon" />
      </el-form-item>
      <el-form-item label="题目说明" prop="remark">
        <el-input v-model="input_form.remark" type="textarea" placeholder="请输入题目说明，可以为空" />
      </el-form-item>
      <el-form-item label="属性验证">
        <el-select v-model="input_form.verify" placeholder="请选择" @change="typeChange">
          <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span style="margin-left:20px">必填</span>
        <el-switch v-model="input_form.required" style="margin-left:5px" active-color="#1890ff" />
      </el-form-item>
      <el-form-item v-if="kulist&&kulist.length>0" label="对等关联">
        <el-select v-model="input_form.columnValue" :placeholder="releplaceholder" class="selectItem" clearable>
          <template v-for="item in kulist">
            <el-option
              v-if="(item.inputType==input_form.inputType)&&(item.verify==input_form.verify)"
              :key="item.columnValue"
              :label="item.title"
              :value="item.columnValue"
            />
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
      types: [
        { value: 0, label: '无验证' },
        { value: 1, label: '整数' },
        { value: 2, label: '小数' },
        { value: 3, label: '手机' },
        { value: 4, label: '固话' },
        { value: 5, label: '手机或固话' },
        { value: 6, label: '邮件' },
        { value: 7, label: '身份证' },
        { value: 8, label: '省份' },
        { value: 9, label: '省市区' },
        { value: 10, label: '日期' },
        { value: 11, label: '英文' }
      ],
      icon: '',
      releplaceholder: '暂无可关联的题目'
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
        inputType: 1,
        options: [],
        questionUuid: uuid.v1(),
        remark: '',
        required: false,
        serial: '', // 序号
        subQuestionUuids: [],
        title: '标题',
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
  // 提交题目
    submitForm(formName) {
      for (const i in this.input_form.options) {
        const content = this.input_form.options[i].content
        if (content === '') {
          // this.$message.error('选项不能为空哦~');
          this.errShow = true
          return false
        }
      }
      this.errShow = false
      // this.input_form.require = this.input_form.require ? 1 : 0
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('toSaveData', this.input_form, 'input', 0)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelForm() {
      this.$emit('toCancel', 'input', 0)
    },
    typeChange(val) {
      this.input_form.columnValue = ''
    //   this.icon = ''
    //   switch (val) {this.isLoading = false
    //     case 3:
    //       this.icon = 'el-icon-mobile-phone'
    //       break
    //     case 4:
    //       this.icon = 'el-icon-s-home'
    //       break
    //     case 5:
    //       this.icon = 'el-icon-phone'
    //       break
    //     case 6:
    //       this.icon = 'el-icon-eleme'
    //       break
    //     case 7:
    //       this.icon = 'el-icon-user'
    //       break
    //     case 9:
    //       this.icon = 'el-icon-location'
    //       break
    //     case 10:
    //       this.icon = 'el-icon-date'
    //       break
    //   }
    }
  }
}
</script>

<style scoped lang="scss">
.option-btn{
//   width: 50%;
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
.pad8{
  padding: 8px 8px;
}
</style>
