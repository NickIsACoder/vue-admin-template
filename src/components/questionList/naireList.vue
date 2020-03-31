<template>
  <div class="groupItem">

    <div v-for="(item, index) in questionList" :key="item.title+index" class="question-item">
      <div class="question-order">
        <div class="title">
          Q{{ index + 1 }}：
          {{ item.title }}
          <span v-if="item.required" style="color: #f00;">*</span>
        </div>
        <p v-if="item.remark !== ''" class="question-desc">说明：{{ item.remark }}</p>
      </div>
      <div class="question-content mt-20 mb-20">
        <div v-if="item.inputType==1" class="notallow">
          <el-input type="text" placeholder="请输入..." />
        </div>
        <div v-else-if="item.inputType==2" class="notallow">
          <template>
            <el-radio-group v-model="item.activeItem">
              <el-radio v-for="(option, index2) in item.options" :key="item.inputType+'_'+option.serial+'_'+index2" :label="option.serial" class="optionSty">{{ option.content }}</el-radio>
            </el-radio-group>
          </template>
        </div>
        <div v-else-if="item.inputType==3" class="notallow">
          <el-checkbox v-for="(option, index3) in item.options" :key="item.inputType+'_'+option.serial+'_'+index3" v-model="option.selected" class="optionSty">{{ option.content }}</el-checkbox>
        </div>
        <div v-else-if="item.inputType==4" class="notallow">
          <div class="inputbox">
            <el-input v-for="(option, index4) in item.options" :key="item.inputType+'_'+option.serial+'_'+index4" :placeholder="'请输入'+option.content" class="inputboxItem" />
          </div>
        </div>
        <div v-else-if="item.inputType==5" class="notallow">
          <div v-for="(option, index5) in item.options" :key="item.inputType+'_'+option.serial+'_'+index5" class="inputbox2">
            <label>{{ option.content }}</label>
            <el-input class="inputboxItem" :placeholder="'请输入'+option.content" />
          </div>
        </div>
        <div v-else-if="item.inputType==6">
          <div class="inputbox">
            <el-cascader :key="loadCascader" :options="item.options" :props="optionProps" style="width:100%;" />
            <!-- <el-select v-for="(option) in item.options" :key="option.optionUuid" v-model="selectVal" class="inputboxItem" placeholder="请选择" /> -->
          </div>
        </div>
        <div v-else-if="item.inputType==7" class="notallow">
          <div v-for="(option, index7) in item.options" :key="item.inputType+'_'+option.serial+'_'+index7" class="inputbox" style="display:inline-block;margin-right:20px">
            <el-upload :action="uploadUrl" :headers="myHeaders" :show-file-list="false" list-type="picture-card" class="notallow" style="display:inline-block;">
              <i class="el-icon-plus" />
            </el-upload>
          </div>
        </div>

        <template v-if="item.inputType==2||item.inputType==3">
          <div v-if="item.options" class="releBox" style="margin:5px">
            <div v-for="(option, index8) in item.options" :key="item.inputType+'__'+option.serial+'_'+index8" class="releItem">
              <div v-if="option.subQuestionIds&&option.subQuestionIds.length>0" class="rele">选项【{{ option.content }}】已设置题目关联</div>
              <!-- <div v-else-if="option.subQuestionUuids&&option.subQuestionUuids.length>0" class="rele">bbb选项【{{ option.content }}】已{{option.subQuestionUuids.length}}设置题目关联</div> -->
            </div>
          </div>
        </template>

        <div class="btnBox">
          <span @click="quesEdit(item,item.inputType)">编辑<i class="el-icon-edit" /></span>
          <span @click="quesDelete(item,index)">删除<i class="el-icon-delete" /></span>
        </div>
      </div>
    </div>

    <!-- 编辑 -->
    <el-dialog :visible.sync="editShow" title="编辑题目" width="600px" :close-on-click-modal="false">
      <div v-if="typeToshow!=''">
        <component
          :is="typeToshow"
          :deletes-ques-uuid="deleteQuesUuid"
          :full-form="questionList"
          :question="actQuestion"
          :kulist="kulist"
          @toSaveData="getData(arguments)"
          @toCancel="getCancel(arguments)"
        />
      </div>
    </el-dialog>
    <!-- 编辑 -->

  </div>
</template>

<script>
import singleSelect from '@/components/questionList/singleSelect'
import multiSelect from '@/components/questionList/multiSelect'
import inputTypes from '@/components/questionList/inputTypes'
import multiInput from '@/components/questionList/multiInput'
import multiInputGroup from '@/components/questionList/multiInputGroup'
import singleSelGroup from '@/components/questionList/singleSelGroup'
import uploadGroup from '@/components/questionList/uploadGroup'

export default {
  components: { singleSelect, multiSelect, inputTypes, multiInput, multiInputGroup, singleSelGroup, uploadGroup },
  props: {
    questionList: {
      type: Array,
      default() {
        return []
      }
    },
    kulist: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      selectVal: '',
      editShow: false,
      typeToshow: '',
      actQuestion: {},
      icon: '',
      optionProps: {
        value: 'serial',
        label: 'content',
        children: 'subOptions'
      },
      loadCascader: 0,
      myHeaders: { Authorization: 'bearer ' + this.$store.state.user.token },
      uploadUrl: 'api/person/api/v2/person/upload',
      deleteQuesUuid: [] // 所删除题目的uuid，用于取消关联
    }
  },
  watch: {
    questionList: function(newVal, oldVal) {
      if (newVal === oldVal) {
        return false
      }
      this.getRadioSelected()
    },
    deep: true,
    immediate: true
  },
  created() {
    this.getRadioSelected()
    console.log('列表', this.actQuestion)
  },
  methods: {
    // 设置单选题选中的项
    getRadioSelected() {
      for (const i in this.questionList) {
        const item = this.questionList[i]
        if (item.inputType === 2) {
          item.activeItem = -1
          for (const a in item.options) {
            if (item.options[a].selected) {
              item.activeItem = item.options[a].serial
            }
          }
        }
      }
      // this.$forceUpdate()
    },
    getData(args) {
      // 下拉框数据改变时，重新渲染cascader组件，避免报错
      ++this.loadCascader
      console.log('naire edit')
      this.editShow = false
      this.getRadioSelected()
      for (const i in this.questionList) {
        if (args[0].questionUuid === this.questionList[i].questionUuid) {
          this.questionList[i] = args[0]
        }
      }
      sessionStorage.removeItem('naireListData')
      // this.$forceUpdate()
    },
    getCancel(args) {
      console.log('naire  cancel')
      this.editShow = false
      // 取消时不保存数据
      const naireListData = JSON.parse(sessionStorage.getItem('naireListData'))
      sessionStorage.removeItem('naireListData')
      for (const i in this.questionList) {
        this.questionList[i] = naireListData[i]
      }
    },
    quesDelete(item, index) {
      console.log('删除了题目：' + item.title + '---id：' + item.questionUuid)
      if (item.id) {
        this.deleteQuesUuid.push(item.id)
      } else {
        this.deleteQuesUuid.push(item.questionUuid)
      }
      this.questionList.splice(index, 1)
      // 强制渲染
      this.$forceUpdate()
    },
    quesEdit(item, type) {
      sessionStorage.setItem('naireListData', JSON.stringify(this.questionList))
      this.actQuestion = item
      switch (type) {
        case 1:
          this.typeToshow = 'inputTypes'
          break
        case 2:
          this.typeToshow = 'singleSelect'
          break
        case 3:
          this.typeToshow = 'multiSelect'
          break
        case 4:
          this.typeToshow = 'multiInput'
          break
        case 5:
          this.typeToshow = 'multiInputGroup'
          break
        case 6:
          this.typeToshow = 'singleSelGroup'
          break
        case 7:
          this.typeToshow = 'uploadGroup'
          break
      }
      this.editShow = true
    }
  }
}
</script>

<style scoped lang="scss">
.no-question {
    margin: 30px 0;
    font-size: 14px;
  }

  .question-item {
    width: 100%;
    padding: 20px;
    margin-bottom: 20px;
    box-sizing: border-box;
    position: relative;
    &:hover {
      background: rgba(238, 238, 238, 0.47);
      .btnBox{
        display:block;
      }
    }
    .btnBox{
      position: absolute;
      bottom: 10px;
      right: 5%;
      text-align:right;
      font-size:14px;
      display:none;
      pointer-events: all;
      span{
        cursor: pointer;
        margin-right:10px;
        border-bottom: 1px solid #333;
      }
      i{
        font-size:14px;
      }
    }
    .question-order {
      width: 100%;
      .title {
        font-size: 16px;
        font-weight: bold;
      }
      .desc {
        font-size: 12px;
      }
    }

    .question-content {
    }
  }
.groupItem{
  padding: 30px;
  width: 80%;
  margin:0 auto;
  margin-bottom: 30px;
}
.mt-20{
  margin-top:20px;
}
.mb-20{
  margin-bottom: 20px
}
.notallow{
  pointer-events: none;
}
.inputbox{
  display: flex;
  .inputboxItem{
    flex: 1;
    margin: 0 10px;
  }
}
.inputbox2{
  display: flex;
  margin-bottom:10px;
  label{
    width: 20%;
    height: 36px;
    line-height: 36px;
    text-align:right;
    font-size:14px;
    padding-right:10px
  }
  .inputboxItem{
    width: 50%;
  }
}
.optionSty{
  margin-bottom: 5px
}
.inputbox /deep/ .el-upload--picture-card {
  width: 200px;
  height: 125px;
}
.inputbox /deep/ .el-upload {
  width: 200px;
  height: 125px;
  line-height: 125px;
}
.inputbox /deep/ .avatar {
  width: 200px;
  height: 125px;
  display: block;
}
</style>
