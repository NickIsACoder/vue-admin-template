<template>
  <div class="group">
    <el-form ref="input_form" :model="input_form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="题目" prop="title" :rules="{ required: true, message: '请输入题目内容', trigger: 'blur' }">
        <el-input v-model="input_form.title" />
      </el-form-item>
      <el-form-item label="题目说明" prop="remark">
        <el-input v-model="input_form.remark" type="textarea" placeholder="请输入题目说明，可以为空" />
      </el-form-item>
      <el-form-item label="输入框名称" style="margin-bottom:0" />
      <el-form-item v-for="(item, index) in input_form.options" :key="index" label="" prop="options" style="margin-bottom:0">
        <div class="option-item">
          <el-input :key="index" v-model="item.content" :value="index" placeholder="请输入名称" style="display:inline-block;width:48%;" />
          <div class="option-btn">
            <el-button class="pad8" type="success" size="small" icon="el-icon-plus" @click="addOption(input_form.options)" />
            <el-button class="pad8" type="warning" size="small" icon="el-icon-delete" @click="delOption(input_form.options,index)" />
            <span class="btn" @click="questionRele(item)">关联</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item v-show="errShow" style="margin-top:0px">
        <div class="el-form-item__error">名称不能为空哦</div>
      </el-form-item>
      <el-form-item label="是否必填">
        <el-switch v-model="input_form.required" active-color="#13ce66" />
      </el-form-item>
      <el-form-item v-if="kulist&&kulist.length>0" label="对等关联">
        <el-select v-model="input_form.columnValue" :placeholder="releplaceholder" clearable class="selectItem" @change="columnValueChange">
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

    <el-dialog :visible.sync="optionLinkShow" :title="input_form.title" width="400px" :close-on-click-modal="false" append-to-body>
      <div>
        <el-form>
          <el-form-item label="当前选项" style="margin-bottom:10px;">{{ actItem.content }}</el-form-item>
          <template v-if="showOptionRele">
            <p style="margin-bottom: 7px;margin-top: 15px;color:red;font-size:12px;">请选择选中该选项时,在对等关联题目中关联的选项</p>
            <el-form-item v-if="kulist&&kulist.length>0" label="选项对等关联" style="margin-bottom:0;">
              <el-select v-model="optionReleVal" placeholder="请选择对等关联的选项" class="selectItem" clearable>
                <template v-for="item in kulistItem">
                  <el-option
                    :key="item.columnValue"
                    :label="item.content"
                    :value="item.columnValue"
                  />
                </template>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="optionLinkShow=false">取消</el-button>
        <el-button type="primary" @click="saveRele(actItem.serial)">确定</el-button>
      </div>
    </el-dialog>
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
      optionLinkShow: false,
      actItem: {},
      kulistItem: [],
      optionReleVal: '',
      showOptionRele: true,
      errShow: false,
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
    console.log(this.kulist)
    if (this.question.title) { // 为编辑情况下
      this.input_form = this.question
    } else { // 为新建
      this.input_form = {
        columnValue: '',
        defaultValue: '',
        inputType: 4, // 控件类型
        options: [
          {
            columnValue: '',
            content: '',
            selected: false,
            serial: 1,
            subQuestionUuids: []
          }
        ],
        questionUuid: uuid.v1(),
        remark: '', // 描述
        required: false,
        serial: '', // 序号
        subQuestionUuids: [],
        title: '多输入框题目',
        verify: 0 // 验证类型
      }
    }

    if (this.input_form.columnValue === '') {
      this.showOptionRele = false
    }
    for (const i in this.kulist) {
      if (this.kulist[i].inputType === this.input_form.inputType) {
        this.releplaceholder = '请选择'
      }
      if (this.kulist[i].columnValue === this.input_form.columnValue) {
        this.kulistItem = this.kulist[i].options
      }
    }
  },
  methods: {
    columnValueChange(val) {
      console.log(val)
      if (val === '') {
        this.showOptionRele = false
      } else {
        this.showOptionRele = true
      }
      this.optionReleVal = ''
      this.kulistItem = []
      for (const i in this.kulist) {
        if (this.kulist[i].columnValue === val) {
          this.kulistItem = this.kulist[i].options
        }
      }
      for (const o in this.input_form.options) {
        this.input_form.options[o].columnValue = this.optionReleVal
      }
    },
    addOption(source) {
      const tempData = {
        columnValue: '',
        content: '',
        selected: false,
        serial: this.input_form.options.length + 1,
        subQuestionUuids: []
      }
      source.push(Object.assign({}, tempData))
    },
    // 删除选项
    delOption(source, index) {
      if (source.length > 1) {
        source.splice(index, 1)
      } else {
        this.$message.error('最后一个啦，不要删除哦~')
      }
    },
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
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('toSaveData', this.input_form, 'multiInput', 3)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 题目关联
    questionRele(item) {
      if (this.input_form.columnValue === '') {
        this.$message.error('请先选择对等关联的题目~')
        return false
      }
      this.optionReleVal = ''
      for (const k in this.kulist) {
        if (this.kulist[k].columnValue === this.input_form.columnValue) {
          this.kulistItem = this.kulist[k].options
        }
      }
      console.log('item', item)
      for (const o in this.kulistItem) {
        if (this.kulistItem[o].columnValue === item.columnValue) {
          this.optionReleVal = item.columnValue
        }
      }

      this.optionLinkShow = true
      this.actItem = item
    },
    // 增加关联
    saveRele(id) {
      for (const i in this.input_form.options) {
        if (this.input_form.options[i].serial === id) {
          this.input_form.options[i].columnValue = this.optionReleVal
        }
      }

      this.optionLinkShow = false
      this.optionReleVal = ''
      this.input_form = JSON.parse(JSON.stringify(this.input_form))
    },
    cancelForm() {
      this.$emit('toCancel', 'multiInput', 3)
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
.pad8{
  padding: 8px 8px;
}
.btn{
  border-bottom:1px solid #333;
  cursor: pointer;
  margin-left: 10px;
  &:hover{
    color: #1890ff;
    border-color: #1890ff;
  }
}
</style>
