<template>
  <div class="group">
    <el-form ref="input_form" :model="input_form" label-width="100px" class="demo-ruleForm">
      <el-form-item label="题目" prop="title" :rules="{ required: true, message: '请输入题目内容', trigger: 'blur' }">
        <el-input v-model="input_form.title" />
      </el-form-item>
      <el-form-item label="题目说明" prop="remark">
        <el-input v-model="input_form.remark" type="textarea" placeholder="请输入题目说明，可以为空" />
      </el-form-item>
      <el-form-item label="单选选项" style="margin-bottom:0;" />
      <el-form-item label="" prop="options">
        <div v-for="(item, index) in input_form.options" :key="index" class="option-item">
          <el-input :key="index" v-model="item.content" :value="index" placeholder="请输入选项内容" style="display:inline-block;width:40%;" />
          <div class="option-btn">
            <el-button class="pad8" type="success" size="small" icon="el-icon-plus" @click="addOption(input_form.options)" />
            <el-button class="pad8" type="warning" size="small" icon="el-icon-delete" @click="delOption(input_form.options,index)" />
            <el-checkbox v-model="item.selected" style="margin-left:10px;" @click.native.prevent="checkChange(item, index)">默认</el-checkbox>
            <!-- <el-radio v-model="defaultSel" :label="index" @click.native.prevent="radioChange(index)" style="margin-left:10px;">默认</el-radio> -->
            <span class="btn" @click="questionRele(item)">关联</span>
          </div>
          <div v-if="item.subQuestionUuids&&item.subQuestionUuids.length>0" class="rele">当前选项已设置题目关联</div>
          <div v-else-if="item.subQuestionIds&&item.subQuestionIds.length>0" class="rele">当前选项已设置题目关联</div>
        </div>
        <div v-show="errShow" class="el-form-item__error">选项不能为空哦</div>
      </el-form-item>
      <el-form-item label="是否必填" style="margin-bottom:0;">
        <el-switch v-model="input_form.required" active-color="#13ce66" />
      </el-form-item>
      <el-form-item v-if="kulist&&kulist.length>0" label="对等关联">
        <el-select v-model="input_form.columnValue" :placeholder="releplaceholder" class="selectItem" clearable @change="columnValueChange">
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
          <p style="margin-bottom: 7px;margin-top: -10px;color:red;font-size:12px;">请选择选中该选项时关联的题目</p>
          <el-form-item label="选项关联题目">
            <el-select v-if="input_form.id" v-model="optionLink.List" class="selectItem" multiple placeholder="请选择关联的题目" @change="selChange">
              <template v-for="item in fullForm">
                <el-option
                  v-if="item.serial>input_form.serial"
                  :key="item.id"
                  :disabled="item.id==input_form.id"
                  :label="item.title"
                  :value="item.id?item.id:item.questionUuid"
                />
              </template>
            </el-select>
            <el-select v-else v-model="optionLink.List" multiple class="selectItem" placeholder="请选择关联的题目" @change="selChange">
              <el-option
                v-for="item in fullForm"
                :key="item.questionUuid"
                :disabled="item.questionUuid==input_form.questionUuid"
                :label="item.title"
                :value="item.questionUuid"
              />
            </el-select>
          </el-form-item>
          <template v-if="showOptionRele">
            <p style="margin-bottom: 7px;margin-top: 5px;color:red;font-size:12px;">请选择选中该选项时,在对等关联题目中关联的选项</p>
            <el-form-item v-if="kulist&&kulist.length>0" label="选项对等关联" style="margin-bottom:0;">
              <el-select v-model="optionReleVal" class="selectItem" placeholder="请选择对等关联的选项" clearable>
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
      defaultSel: -1, // 默认选中的
      errShow: false,
      optionLinkShow: false,
      actItem: {},
      kulistItem: [],
      optionReleVal: '',
      showOptionRele: true,
      releplaceholder: '暂无可关联的题目',
      optionLink: {
        List: [],
        value: []
      }
    }
  },
  watch: {
    question: function(newVal, oldVal) {
      if (newVal === oldVal) {
        return false
      }
      this.input_form = newVal
    },
    'optionLink.List': function(newVal, oldVal) {
      if (newVal === oldVal) {
        return false
      }
      // console.log('sasdsa')
      this.optionLink.List = newVal
    }
  },
  created() {
    if (this.question.title) { // 为编辑情况下
      this.input_form = this.question
      console.log('编辑')
    } else { // 为新建
      console.log('新建')
      this.defaultSel = -1
      this.input_form = {
        columnValue: '',
        defaultValue: '',
        inputType: 2, // 控件类型
        options: [
          {
            columnValue: '',
            content: '选项',
            selected: false,
            serial: 1,
            optionUuid: uuid.v1(), // 仅前端用
            subQuestionIds: [],
            subQuestionUuids: []
          }
        ],
        questionUuid: uuid.v1(),
        remark: '', // 描述
        required: true,
        serial: '', // 序号
        subQuestionIds: [],
        subQuestionUuids: [],
        title: '单选题目',
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
        content: '选项',
        selected: false,
        optionUuid: uuid.v1(), // 仅前端用
        serial: this.input_form.options.length + 1,
        subQuestionIds: [],
        subQuestionUuids: []
      }
      source.push(Object.assign({}, tempData))
    },
    // 删除选项
    delOption(source, index) {
      if (source.length > 1) {
        source.splice(index, 1)
        // this.defaultSel = -1
      } else {
        this.$message.error('最后一个啦，不要删除哦~')
      }
    },
    // 提交题目
    submitForm(formName) {
      for (const i in this.input_form.options) {
        // this.input_form.options[i].selected = false
        const content = this.input_form.options[i].content
        if (content === '') {
          this.errShow = true
          return false
        }
      }
      this.errShow = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit('toSaveData', this.input_form, 'radio', 1)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    selChange(val) {
    },
    // 题目关联
    questionRele(item) {
      // console.log(this.fullForm)
      let releList = []
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
      if (item.subQuestionIds) {
        releList = item.subQuestionIds.slice()
      } else if (item.subQuestionUuids) {
        releList = item.subQuestionUuids.slice()
      }
      for (const i in releList) {
        // console.log(this.deletesQuesUuid)
        // 在删除的id集合中找到已关联的id，则取消此id的关联
        if (this.deletesQuesUuid.indexOf(releList[i]) !== -1) {
          releList.splice(i, 1)
        }
      }
      this.optionLink.List = releList

      // 显示已经关联的值
      if (item.subQuestionIds) {
        for (const a in this.fullForm) {
          if (this.optionLink.List.indexOf(this.fullForm[a].id) !== -1) {
            this.optionLink.value.push(this.fullForm[a].title)
          }
        }
      }

      this.optionLinkShow = true
      this.actItem = item
      // console.log(this.optionLink.List)
    },
    // 增加关联
    saveRele(id) {
      for (const i in this.input_form.options) {
        if (this.input_form.options[i].serial === id) {
          this.input_form.options[i].subQuestionIds = this.optionLink.List
          this.input_form.options[i].columnValue = this.optionReleVal
        }
      }

      this.optionLinkShow = false
      this.optionLink.List = []
      this.optionReleVal = ''
      this.input_form = JSON.parse(JSON.stringify(this.input_form))
    },
    checkChange(item, index) {
      this.input_form.options[index].selected = !this.input_form.options[index].selected
      for (const i in this.input_form.options) {
        if (index !== parseInt(i)) {
          this.input_form.options[i].selected = false
        }
      }
    },
    cancelForm() {
      this.$emit('toCancel', 'radio', 1)
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
.pad8{
  padding: 8px 8px;
}
</style>
