<template>
  <div class="group">
    <el-form ref="input_form" :model="input_form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="题目" prop="title" :rules="{ required: true, message: '请输入题目内容', trigger: 'blur' }">
        <el-input v-model="input_form.title" />
      </el-form-item>
      <el-form-item label="题目说明" prop="remark">
        <el-input v-model="input_form.remark" type="textarea" placeholder="请输入题目说明，可以为空" />
      </el-form-item>
      <!-- <el-form-item label="增/减层级框" style="margin-bottom:0" />
      <el-form-item v-for="(item, index) in input_form.options" :key="index" label="" prop="options" style="margin-bottom:0px">
        <div class="option-item">
          <el-input :key="index" v-model="item.content" :value="index" placeholder="请输入" style="display:inline-block;width:48%;" />
          <div class="option-btn">
            <el-button type="success" size="small" icon="el-icon-plus" @click="addOption(input_form.options)" />
            <el-button type="warning" size="small" icon="el-icon-delete" @click="delOption(input_form.options,index)" />
          </div>
        </div>
      </el-form-item> -->
      <el-form-item label="最多支持三级" style="margin-bottom:0" />
      <el-form-item style="margin-bottom:0px">
        <el-input v-model="jsonTxt" type="textarea" :rows="4" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item v-show="errShow" style="margin-top:0px">
        <div class="el-form-item__error">选项不能为空哦</div>
      </el-form-item>
      <el-form-item label="示例" style="margin-top:30px">
        <div class="tips">
          广东省<br>广东省-广州市-天河区,海珠区,白云区<br>广东省-深圳市-福田区<br>江西省<br>江西省-南昌市-东湖区,西湖区<br>江西省-景德镇市-昌江区,珠山区
        </div>
      </el-form-item>
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
      errShow: false,
      jsonTxt: '',
      releplaceholder: '暂无可关联的题目',
      jsonTxtTips: ``
    }
  },
  watch: {
    question: function(newVal, oldVal) {
      if (newVal === oldVal) {
        return false
      }
      this.input_form = newVal
      this.jsonToTxt(newVal.options)
    }
  },
  created() {
    if (this.question.title) { // 为编辑情况下
      this.input_form = this.question
      this.jsonToTxt(this.question.options)
    } else { // 为新建
      this.input_form = {
        columnValue: '',
        defaultValue: '',
        inputType: 6, // 控件类型
        options: [
          {
            columnValue: '',
            content: '',
            selected: false,
            serial: 0,
            subQuestionUuids: []
          }
        ],
        questionUuid: uuid.v1(),
        remark: '', // 描述
        required: false,
        serial: '', // 序号
        subQuestionUuids: [],
        title: '多级单选题目',
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
    txtToJson() {
      const str = this.jsonTxt.trim()
      const arrStr = str.split('\n')
      var result = []
      arrStr.map(i => {
        const item = i.split(' ')
        if (i.indexOf('-') === -1) {
          result.push({
            columnValue: '',
            content: item[0],
            selected: false,
            serial: result.length + 1,
            subQuestionUuids: [],
            subOptions: []
          })
        } else {
          var _json = item[0].split('-')
          if (!_json[1]) return false
          var cur = result.find(j => j.content === _json[0])
          var subs = []
          if (_json[2]) {
            const _json_sub = _json[2].split(',')
            for (let j = 0; j < _json_sub.length; j++) {
              subs.push({
                columnValue: '',
                content: _json_sub[j],
                selected: false,
                serial: j + 1,
                subQuestionUuids: [],
                subOptions: null
              })
            }
          }
          cur.subOptions.push({
            columnValue: '',
            content: _json[1],
            selected: false,
            serial: cur.subOptions.length + 1,
            subQuestionUuids: [],
            subOptions: subs
          })
        }
      })
      this.input_form.options = []
      console.log(result)
      return result
    },
    jsonToTxt(_json) {
      let alltxt = ''
      for (let i = 0; i < _json.length; i++) {
        const item = _json[i]
        let str = ''
        for (let j = 0; j < item.subOptions.length; j++) {
          const itemSub = item.subOptions[j]
          str = item.content + '-' + itemSub.content + '-'
          if (itemSub.subOptions) {
            for (let k = 0; k < itemSub.subOptions.length; k++) {
              str = str + itemSub.subOptions[k].content + ','
            }
          }
          if (j === 0) str = item.content + '\n' + str

          alltxt = alltxt + str.substring(0, str.length - 1) + '\n'
        }
      }
      // console.log(alltxt)
      this.jsonTxt = alltxt
    },
    addOption(source) {
      const tempData = {
        columnValue: '',
        content: '',
        selected: false,
        serial: this.input_form.options.length,
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
      this.input_form.options = this.txtToJson()
      for (const i in this.input_form.options) {
        const content = this.input_form.options[i].content
        if (content === '') {
          // this.$message.error('选项不能为空哦~');
          this.errShow = true
          return false
        }
      }
      if (this.input_form.options[0].subOptions.length <= 0) {
        this.$message.error('请至少添加两层~')
        return false
      }
      this.errShow = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('toSaveData', this.input_form, 'groupCheck', 5)
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
    questionRele() {},
    cancelForm() {
      this.$emit('toCancel', 'groupCheck', 5)
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
.tips{
  border-radius: 5px;
  width: 400px;
  padding: 10px;
  line-height: 120%;
  background: #f7f7f7;
}
.pad8{
  padding: 8px 8px;
}
</style>
