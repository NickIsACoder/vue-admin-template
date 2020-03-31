<template>
  <div>
    <sticky :z-index="10" :class-name="'sub-navbar '">
      <div class="head-btn-list">
        <el-button icon="el-icon-back" type="primary" @click="func_back">返回</el-button>
      </div>
    </sticky>
    <div class="content">
      <div class="leftBox">
        <div class="formBox">
          <div class="formBoxTitle">个人采集模板</div>
          <el-menu ref="menu" default-active="0" class="el-menu-vertical-demo" @open="showBank">
            <div v-for="(item, index) in quesBank" :key="item.id">
              <el-menu-item v-if="item.forUserType==0" :index="index.toString()" @click="showBank(index+'_'+item.id)">
                <i class="el-icon-menu" />
                <span slot="title">{{ item.title }}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </div>
        <div class="formBox">
          <div class="formBoxTitle">企业采集模板</div>
          <el-menu ref="menu" default-active="0" class="el-menu-vertical-demo" @open="showBank">
            <div v-for="(item, index) in quesBank" :key="item.id">
              <el-menu-item v-if="item.forUserType==1" :index="index.toString()" @click="showBank(index+'_'+item.id)">
                <i class="el-icon-menu" />
                <span slot="title">{{ item.title }}</span>
              </el-menu-item>
            </div>
          </el-menu>
        </div>
      </div>
      <div v-loading="isLoading" class="rightBox">
        <div v-if="quesBankList.length>0" class="mainbox">
          <p class="title">{{ title }}</p>
          <ol class="timubox">
            <li v-for="(item) in quesBankList" :key="item.id">{{ item.title }}</li>
          </ol>
          <el-button type="primary" style="display:block;margin:20px auto" @click="selectModule()">选择此模板创建</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content{
  display: flex;
  height: calc(100vh - 100px);
  .leftBox{
    width: 280px;
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
.mainbox{
  width: 70%;
  margin: 30px auto;
  background: #F7F7F7;
  padding: 20px 30px
}
.title{
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px
}
.timubox{
  // list-style: none;
  li{
    line-height: 200%;
    // height: 30px;
    // line-height: 30px;
    font-size: 14px
  }
}
</style>

<script>
import Sticky from '@/components/Sticky/index'
import { getStandardSurvey, getSurveyQuest } from '../../api/app'

export default {
  components: { Sticky },
  filters: {},
  data() {
    return {
      quesBank: [], // 题库
      isLoading: false,
      surveyType: [
        { value: 1, label: '标准' },
        { value: 2, label: '模版' },
        { value: 3, label: '自定义' }
      ],
      title: '',
      moduleSelect: {},
      moduleIndex: -1,
      quesBankList: []
    }
  },
  mounted() {
    // 获取题库
    this.isLoading = true
    this.func_getStandardSurvey()
  },
  methods: {
    // 返回
    func_back() {
      this.$router.go(-1)
    },
    // 获取题库
    async func_getStandardSurvey() {
      const result = await getStandardSurvey()
      this.isLoading = false
      if (result.code === 0) {
        this.quesBank = result.data
        this.title = this.quesBank[0].title
        getSurveyQuest(this.quesBank[0].id).then((result) => {
          this.isLoading = false
          if (result.code === 0) {
            this.quesBankList = result.data.questions
            this.moduleIndex = result.data.surveyId
            this.moduleSelect = this.quesBank[0]
          } else {
            this.$message.error(result.msg)
          }
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    // 获取问卷的题目
    async showBank(key, keyPath) {
      console.log(key)
      const index = key.split('_')[0]
      const surveyid = key.split('_')[1]

      this.moduleIndex = surveyid
      this.moduleSelect = this.quesBank[index]
      this.title = this.quesBank[index].title
      this.isLoading = true
      const result = await getSurveyQuest(surveyid)
      this.isLoading = false
      if (result.code === 0) {
        this.quesBankList = result.data.questions
      } else {
        this.$message.error(result.msg)
      }
    },
    selectModule() {
      sessionStorage.setItem('survey', JSON.stringify(this.moduleSelect))
      sessionStorage.setItem('moduleAdd', 'moduleAdd')
      this.$router.push({
        path: `/app/addForm/${this.moduleIndex}`
      })
    }
  }
}
</script>
