<template>
  <!-- 新增采集表 -->
  <div v-loading="isLoading">
    <sticky :z-index="10" :class-name="'sub-navbar '">
      <span class="head-title">{{ titleName }}</span>
      <div class="head-btn-list">
        <div v-if="!radioActive&&!checkboxActive&&!inputActive&&!multiInputActive&&!groupInputActive&&!groupSelActive&&!uploadSelActive" class="topBox">
          <el-button v-if="isAddNew" type="success" icon="el-icon-s-claim" @click="saveForm('questionnaire')">立即创建</el-button>
          <el-button v-else type="success" icon="el-icon-s-claim" @click="saveForm('questionnaire')">保存编辑</el-button>
        </div>
        <el-button icon="el-icon-back" type="primary" @click="func_back">返回</el-button>
        <!-- <el-button icon="el-icon-video-camera" type="primary">预览</el-button> -->
        <!-- <el-button icon="el-icon-s-promotion" type="success">发布</el-button> -->
      </div>
    </sticky>
    <div class="content">
      <div class="leftBox">
        <div class="formBox">
          <div class="formBoxTitle">添加组件</div>
          <el-button v-for="(item, index) in controlType" :key="item.value" class="formItem" :disabled="item.active" @click="addNewOption(item.type,index)">{{ item.label }}</el-button>
        </div>
        <!-- 从模板创建的或者选择不使用题库的，不能选择题库 -->
        <div v-if="(moduleAdd!=='moduleAdd'&&FORMDATA.criterionSurveyId!='')">
          <div v-if="FORMDATA.criterionSurveyId!=-1" class="formBox">
            <div class="formBoxTitle">题库</div>
            <el-menu ref="menu" @open="showBank">
              <div v-for="(item, index) in quesBank" :key="item.id">
                <el-submenu v-if="item.id==FORMDATA.criterionSurveyId" :index="index+'_'+item.id">
                  <template slot="title"><i class="el-icon-s-fold" />{{ item.title }}</template>
                  <el-menu-item-group>
                    <el-menu-item
                      v-for="(option, index2) in quesBankList[index]"
                      :key="option.id"
                      :index="index+'-'+index2"
                      @click="quesClick(index, index2)"
                    >
                      {{ option.title }}
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
              </div>
            </el-menu>
          </div>
        </div>
      </div>

      <div class="rightBox">
        <div class="wqBox">
          <el-form ref="questionnaire" :model="FORMDATA" class="ruleForm">
            <el-form-item ref="title" label="标题" prop="title" :rules="{ required: true, message: '请输入标题', trigger: 'blur' }">
              <el-input v-model="FORMDATA.title" placeholder="请输入标题" />
            </el-form-item>
            <el-form-item label="介绍内容">
              <el-input v-model="FORMDATA.content" type="textarea" placeholder="请输入介绍内容" />
            </el-form-item>
            <el-form-item label="区域" :rules="{ required: true }">
              <el-cascader ref="area" v-model="areaSelected" :placeholder="areaPlaceholder" :props="props" clearable style="width:100%" />
            </el-form-item>
            <el-form-item label="针对用户类型" prop="forUserType" :rules="{ required: true, message: '请选择用户类型', trigger: 'blur' }">
              <el-select v-model="FORMDATA.forUserType" placeholder="请选择" style="width:100%" clearable disabled>
                <el-option
                  v-for="item in forUserTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item prop="picture" label="问卷图" :rules="{ required: true, message: '请添加问卷图', trigger: 'blur' }">
              <el-upload
                class="avatar-uploader"
                accept=".png,.jpg,.jpeg,.PNG"
                :headers="myHeaders"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
              >
                <img v-if="FORMDATA.picture" :src="FORMDATA.picture" class="avatar">
                <i v-if="FORMDATA.picture" class="el-icon-delete" @click.stop="imgRemove()" />
                <i v-if="!FORMDATA.picture" class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
              <p style="position: absolute;top: 5%;left: 210px;color: red;">建议上传比例1:1的图片</p>
            </el-form-item>
          </el-form>
          <!-- 生成的项 -->
          <template v-if="FORMDATA.questions">
            <naireList :question-list="FORMDATA.questions" :kulist="kuList" />
          </template>
          <!-- 生成的项 -->

          <div class="editBox">
            <div v-for="item in actSelList" :key="item.id">
              <template v-if="item!==''">
                <div v-if="item.type=='input'" class="groupBox">
                  <inputTypes :full-form="FORMDATA.questions" :kulist="kuList" @toSaveData="getData(arguments)" @toCancel="getCancel(arguments)" />
                </div>
                <div v-else-if="item.type=='radio'" class="groupBox">
                  <singleSelect :full-form="FORMDATA.questions" :kulist="kuList" @toSaveData="getData(arguments)" @toCancel="getCancel(arguments)" />
                </div>
                <div v-else-if="item.type=='checkbox'" class="groupBox">
                  <multiSelect :full-form="FORMDATA.questions" :kulist="kuList" @toSaveData="getData(arguments)" @toCancel="getCancel(arguments)" />
                </div>
                <div v-else-if="item.type=='multiInput'" class="groupBox">
                  <multiInput :full-form="FORMDATA.questions" :kulist="kuList" @toSaveData="getData(arguments)" @toCancel="getCancel(arguments)" />
                </div>
                <div v-else-if="item.type=='groupInput'" class="groupBox">
                  <multiInputGroup :full-form="FORMDATA.questions" :kulist="kuList" @toSaveData="getData(arguments)" @toCancel="getCancel(arguments)" />
                </div>
                <div v-else-if="item.type=='groupCheck'" class="groupBox">
                  <singleSelGroup :full-form="FORMDATA.questions" :kulist="kuList" @toSaveData="getData(arguments)" @toCancel="getCancel(arguments)" />
                </div>
                <div v-else-if="item.type=='uploadInput'" class="groupBox">
                  <uploadGroup :full-form="FORMDATA.questions" :kulist="kuList" @toSaveData="getData(arguments)" @toCancel="getCancel(arguments)" />
                </div>
              </template>
            </div>

          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="请选择用户类型与题库"
      :visible.sync="dialogVisible"
      width="50%"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div>
        <el-form>
          <el-form-item label="针对用户类型">
            <el-select v-model="FORMDATA.forUserType" placeholder="请选择用户类型" style="width:100%" @change="userTypeChange">
              <el-option
                v-for="item in forUserTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="FORMDATA.forUserType==0" label="题库">
            <el-select v-model="FORMDATA.criterionSurveyId" placeholder="请选择题库" style="width:100%">
              <div v-for="item in forUserTypeList[0].list" :key="item.id">
                <el-option :label="item.title" :value="item.id" />
              </div>
            </el-select>
          </el-form-item>
          <el-form-item v-if="FORMDATA.forUserType==1" label="题库">
            <el-select v-model="FORMDATA.criterionSurveyId" placeholder="请选择题库" style="width:100%">
              <div v-for="item in forUserTypeList[1].list" :key="item.id">
                <el-option :label="item.title" :value="item.id" />
              </div>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="selectSurvey">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
  .content{
    display: flex;
    height: calc(100vh - 100px);
    .leftBox{
      width: 300px;
      float: left;
      position: relative;
      overflow-y: auto;
      padding: 10px;
      -webkit-box-shadow: 0 1px 4px rgba(0,21,41,0.08);
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
    .rightBox{
      display: flow-root;
      width: 100%;
      position: relative;
      overflow-y: auto;
      padding: 10px;
      padding-bottom: 150px;
    }
  }

  .formBox{
    border-bottom: 1px solid #EBEEF5;
    margin-bottom: 20px;
    padding-bottom: 20px;
    .formBoxTitle{
      font-weight:blod;
      font-size: 18px;
      height:40px;
      line-height: 40px;
      padding-left: 20px
    }
    .formItem{
      font-size:14px;
      margin:5px ;
    }
  }
  .el-menu{
    border: none
  }
  .ruleForm{
    width: 70%;
    margin: 0 auto;
  }
  .wqBox{
    .inputItem{
      margin: 10px auto
    }
  }
  .group{
    border: 1px solid #ebeef5;
    padding: 30px;
    width: 80%;
    margin:0 auto;
    margin-bottom: 30px;
    &:hover{
      -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    }
  }
  .groupBox{
    position: relative;
    .close{
      position: absolute;
      right: 11%;
      top: 10px;
      font-size: 24px;
      &:hover{
        cursor: pointer;
      }
    }
  }
  .avatar-uploader {
    width: 125px;
    height: 125px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409EFF;
    }
    &:hover .el-icon-delete {
      background-color: red;
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
        padding: 6px;
        z-index: 100;
        background-color: #db3b21;
        color: #fff;
        border-bottom-left-radius: 6px;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 125px;
        height: 125px;
        line-height: 125px;
        text-align: center;
      }
    }
  }
  .topBox{
    text-align: center;
    display: inline-block;
    margin: 0 10px;
  }
</style>

<script>
const uuid = require('uuid')
import areaData from '../../utils/province_city.json'
import Sticky from '@/components/Sticky/index'
import singleSelect from '@/components/questionList/singleSelect'
import multiSelect from '@/components/questionList/multiSelect'
import inputTypes from '@/components/questionList/inputTypes'
import multiInput from '@/components/questionList/multiInput'
import multiInputGroup from '@/components/questionList/multiInputGroup'
import singleSelGroup from '@/components/questionList/singleSelGroup'
import uploadGroup from '@/components/questionList/uploadGroup'
import naireList from '@/components/questionList/naireList'
import { getArea } from '../../api/region'

import { addSurvey, getSurveyQuest, editSurvey, getStandardSurvey } from '../../api/app'

export default {
  components: {
    Sticky,
    singleSelect,
    multiSelect,
    inputTypes,
    multiInput,
    multiInputGroup,
    singleSelGroup,
    uploadGroup,
    naireList
  },
  filters: {},
  data() {
    return {
      titleName: '采集表',
      quesBank: [], // 题库
      controlType: [
        { value: 1, label: '输入框', type: 'input', active: false },
        { value: 2, label: '单选', type: 'radio', active: false },
        { value: 3, label: '多选', type: 'checkbox', active: false },
        { value: 4, label: '多输入', type: 'multiInput', active: false },
        { value: 5, label: '多组输入', type: 'groupInput', active: false },
        { value: 6, label: '多级单选', type: 'groupCheck', active: false },
        { value: 7, label: '图片上传', type: 'uploadInput', active: false }
      ],
      isLoading: false,
      aeraOptions: areaData, // 存放城市数据
      FORMDATA: {}, // 所有题目
      radioList: 0,
      textarea: '',
      inputActive: false,
      radioActive: false,
      checkboxActive: false,
      multiInputActive: false,
      groupInputActive: false,
      groupSelActive: false,
      uploadSelActive: false,
      areaSelected: [],
      surveyType: [
        { value: 1, label: '标准' },
        { value: 2, label: '模版' },
        { value: 3, label: '自定义' }
      ],
      quesBankList: [],
      isAddNew: true,
      areaPlaceholder: '请选择',
      forUserTypeList: [
        { label: '个人', value: 0, list: [{ title: '不使用题库', id: -1 }] },
        { label: '企业', value: 1, list: [{ title: '不使用题库', id: -1 }] }
      ],
      moduleAdd: 'newAdd', // 创建类型
      dialogVisible: false,
      myHeaders: { Authorization: 'bearer ' + this.$store.state.user.token },
      uploadUrl: 'api/person/api/v2/person/upload',
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
      },
      kuList: [],
      actSelList: []
    }
  },
  mounted() {
    this.moduleAdd = sessionStorage.getItem('moduleAdd')
    if (sessionStorage.getItem('moduleAdd') === 'moduleAdd') { // 从模版库新建
      this.isLoading = true
      this.isAddNew = true
      const theSurvey = JSON.parse(sessionStorage.getItem('survey'))
      this.FORMDATA = theSurvey
      this.FORMDATA.type = 3
      delete this.FORMDATA.id
      this.FORMDATA.criterionSurveyId = ''
      this.func_getSurveyQuest(this.$route.params.survey)
    } else if (sessionStorage.getItem('moduleAdd') === 'edit') { // 编辑
      // 获取题库
      this.isLoading = true
      this.func_getStandardSurvey()
      this.isAddNew = false
      const theSurvey = JSON.parse(sessionStorage.getItem('survey'))
      this.FORMDATA = theSurvey
      this.FORMDATA.questions = []
      console.log(this.FORMDATA)
      this.areaPlaceholder = theSurvey.province
      if (theSurvey.city !== '') {
        this.areaPlaceholder = this.areaPlaceholder + '/' + theSurvey.city
      }
      if (theSurvey.area !== '') {
        this.areaPlaceholder = this.areaPlaceholder + '/' + theSurvey.area
      }
      this.func_getSurveyQuest(theSurvey.id)
      this.selectSurvey(this.FORMDATA.criterionSurveyId)
      this.isLoading = true
    } else if (sessionStorage.getItem('moduleAdd') === 'newAdd') { // 新建
      // 获取题库
      this.isLoading = true
      this.func_getStandardSurvey()
      this.isAddNew = true
      this.FORMDATA = {
        province: '',
        provinceCode: '',
        city: '',
        cityCode: '',
        area: '',
        areaCode: '',
        title: '',
        forUserType: 0,
        criterionSurveyId: '',
        content: '',
        picture: '',
        questions: [],
        state: 0,
        type: 3
      }
    }

    this.titleName = this.isAddNew ? '新增采集表' : '编辑采集表'
  },
  methods: {
    // 选择题库
    selectSurvey() {
      if (this.FORMDATA.criterionSurveyId === '') {
        this.$message.error('请选择题库')
        return false
      } else if (this.FORMDATA.criterionSurveyId === -1) {
        this.dialogVisible = false
        return false
      }
      this.isLoading = true
      this.dialogVisible = false
      getSurveyQuest(this.FORMDATA.criterionSurveyId).then((result) => {
        this.isLoading = false
        if (result.code === 0) {
          this.kuList = result.data.questions
          console.log(this.kuList)
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    userTypeChange(val) {
      console.log(val)
      this.FORMDATA.criterionSurveyId = ''
    },
    // 返回
    func_back() {
      sessionStorage.removeItem('moduleAdd')
      this.$router.go(-1)
    },
    getData(args) {
      this.FORMDATA.questions.push(args[0])
      const _data = JSON.stringify(this.FORMDATA)
      this.FORMDATA = JSON.parse(_data)
      switch (args[1]) {
        case 'radio':
          this.radioActive = false
          break
        case 'checkbox':
          this.checkboxActive = false
          break
        case 'input':
          this.inputActive = false
          break
        case 'multiInput':
          this.multiInputActive = false
          break
        case 'groupInput':
          this.groupInputActive = false
          break
        case 'groupCheck':
          this.groupSelActive = false
          break
        case 'uploadInput':
          this.uploadSelActive = false
          break
      }
      for (const i in this.actSelList) {
        if (this.actSelList[i].type === args[1]) {
          this.actSelList[i] = ''
        }
      }
      this.controlType[args[2]].active = false
    },
    // 取消
    getCancel(args) {
      switch (args[0]) {
        case 'radio':
          this.radioActive = false
          break
        case 'checkbox':
          this.checkboxActive = false
          break
        case 'input':
          this.inputActive = false
          break
        case 'multiInput':
          this.multiInputActive = false
          break
        case 'groupInput':
          this.groupInputActive = false
          break
        case 'groupCheck':
          this.groupSelActive = false
          break
        case 'uploadInput':
          this.uploadSelActive = false
          break
      }
      for (const i in this.actSelList) {
        if (this.actSelList[i].type === args[0]) {
          this.actSelList[i] = ''
        }
      }
      this.controlType[args[1]].active = false
    },
    // 选取控件
    addNewOption(type, index) {
      this.controlType[index].active = true
      this.actSelList.push({ type: type, id: this.actSelList.length })
      if (type === 'radio') {
        this.radioActive = true
      } else if (type === 'checkbox') {
        this.checkboxActive = true
      } else if (type === 'input') {
        this.inputActive = true
      } else if (type === 'multiInput') {
        this.multiInputActive = true
      } else if (type === 'groupInput') {
        this.groupInputActive = true
      } else if (type === 'groupCheck') {
        this.groupSelActive = true
      } else if (type === 'uploadInput') {
        this.uploadSelActive = true
      }
      this.$nextTick(() => {
        var container = this.$el.querySelector('.rightBox')
        container.scrollTop = container.scrollHeight
      })
    },
    // 新增问卷
    async func_addSurvey() {
      const params = this.FORMDATA
      const result = await addSurvey(params)
      this.isLoading = false
      if (result.code === 0) {
        this.$message.success(result.data)
        sessionStorage.removeItem('moduleAdd')
        this.$router.push({
          path: '/app/collectList'
        })
      } else {
        this.isLoading = false
        this.$message.error(result.data)
      }
    },
    // 编辑问卷
    async func_editSurvey() {
      const params = this.FORMDATA

      for (const i in this.surveyType) {
        if (params.type === this.surveyType[i].label) {
          params.type = this.surveyType[i].value
        }
      }

      const result = await editSurvey(params)
      this.isLoading = false
      if (result.code === 0) {
        this.$message.success(result.data)
        this.$router.push({
          path: '/app/collectList'
        })
      } else {
        this.isLoading = false
        this.$message.error(result.data)
      }
    },
    // 获取题库
    async func_getStandardSurvey() {
      const result = await getStandardSurvey()
      this.isLoading = false
      if (result.code === 0) {
        this.quesBank = result.data
        for (const i in this.quesBank) {
          if (this.quesBank[i].forUserType === 0) {
            this.forUserTypeList[0].list.push(this.quesBank[i])
          } else {
            this.forUserTypeList[1].list.push(this.quesBank[i])
          }
        }
        if (this.moduleAdd === 'newAdd') {
          this.dialogVisible = true
        }
      } else {
        this.$message.error(result.msg)
      }
    },
    // 获取所编辑问卷的题目
    async func_getSurveyQuest(id) {
      const params = id
      const result = await getSurveyQuest(params)
      this.isLoading = false
      if (result.code === 0) {
        this.FORMDATA.questions = result.data.questions
        const str = JSON.stringify(this.FORMDATA)
        this.FORMDATA = JSON.parse(str)
      } else {
        this.$message.error(result.msg)
      }
    },
    async showBank(key, keyPath) {
      const index = key.split('_')[0]
      const surveyid = key.split('_')[1]

      if (this.quesBankList[index]) {
        return false
      }
      this.isLoading = true
      const result = await getSurveyQuest(surveyid)
      this.isLoading = false
      if (result.code === 0) {
        this.quesBankList[index] = result.data.questions
        this.$forceUpdate()
      } else {
        this.$message.error(result.msg)
      }
    },
    /**
       * 从题库选题
       * @param index1 题库几
       * @param index2 第几题
       */
    quesClick(index1, index2) {
      // 选中的题目
      let timu = this.quesBankList[index1][index2]
      timu = JSON.parse(JSON.stringify(timu))
      // 从题库中选择的题目要去除已有的id属性，且需生成一个 questionUuid
      delete timu.id
      timu.questionUuid = uuid.v1()
      if (timu.options) {
        timu.options = this.func_deleteid(timu.options, 'fromKu')
      }
      this.FORMDATA.questions.push(timu)
    },
    // 去除选项中id属性
    func_deleteid(data, type) {
      const that = this
      // console.log(data)
      for (var i = 0; i < data.length; i++) {
        data[i].subQuestionUuids = []
        for (var a = 0; a < this.FORMDATA.questions.length; a++) {
          var item = this.FORMDATA.questions[a]
          if (data[i].subQuestionIds) {
            for (var b = 0; b < data[i].subQuestionIds.length; b++) {
              var _item = data[i].subQuestionIds[b]
              if (_item === item.id || _item === item.questionUuid) {
                data[i].subQuestionUuids.push(item.questionUuid)
              }
            }
          }
        }

        if (type || that.isAddNew) {
          delete data[i].id
          delete data[i].parentOptionId
        }
        if (data[i].subOptions) {
          loopData(data[i].subOptions)
        }
      }
      function loopData(_data) {
        for (var j = 0; j < _data.length; j++) {
          if (type || that.isAddNew) {
            delete _data[j].id
            delete _data[j].parentOptionId
          }
          if (_data[j].subOptions) {
            loopData(_data[j].subOptions)
          }
        }
      }
      return data
    },
    // 上传图片
    handleSuccess(res, file) {
      this.FORMDATA.picture = res.data
    },
    imgRemove() {
      this.FORMDATA.picture = ''
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
    // 保存
    saveForm(formName) {
      const cityData = this.$refs['area'].getCheckedNodes()
      if (cityData.length > 0 && cityData[0]) {
        this.FORMDATA.province = cityData[0].pathLabels[0] ? cityData[0].pathLabels[0] : ''
        this.FORMDATA.city = cityData[0].pathLabels[1] ? cityData[0].pathLabels[1] : ''
        this.FORMDATA.area = cityData[0].pathLabels[2] ? cityData[0].pathLabels[2] : ''
        this.FORMDATA.provinceCode = cityData[0].path[0] ? cityData[0].path[0] : ''
        this.FORMDATA.cityCode = cityData[0].path[1] ? cityData[0].path[1] : ''
        this.FORMDATA.areaCode = cityData[0].path[2] ? cityData[0].path[2] : ''
      }
      console.log(this.FORMDATA)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.FORMDATA.cityCode === '') {
            this.$message.error('区域选择错误！')
            return false
          }

          if (this.FORMDATA.questions.length <= 0) {
            this.$message.error('还没添加题目哦~')
            return false
          }

          // 添加问题序号,关联id
          for (let i = 0; i < this.FORMDATA.questions.length; i++) {
            this.FORMDATA.questions[i].serial = i + 1
            if (this.FORMDATA.questions[i].options) {
              this.FORMDATA.questions[i].options = this.func_deleteid(this.FORMDATA.questions[i].options)
            }
          }

          // return false
          this.isLoading = true
          // 是否为新建
          if (!this.isAddNew) {
            this.func_editSurvey()
          } else {
            for (let i = 0; i < this.FORMDATA.questions.length; i++) {
              delete this.FORMDATA.questions[i].id
            }
            this.func_addSurvey()
          }

          console.log(this.FORMDATA)
        } else {
          this.$message.error('有必填项没填哦~')
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
