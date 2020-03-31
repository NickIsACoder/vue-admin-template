<template>
  <div>
    <el-form class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '">
        <span class="sub-tip"> <em>提示：</em>此为预览页面，不能参与作答！</span>
        <div class="head-title">采集表预览</div>
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
          <el-button class="el-icon-edit" type="primary" @click="closePreview">
            关闭预览
          </el-button>
        </div>
      </sticky>
      <el-row>
        <el-col :span="24">
          <div class="preview-phone">
            <div class="preview-phone-container">
              <div class="preview-phone-container-content">
                <div class="tab-title">{{ quest.title }}</div>
                <div class="tab-content">{{ quest.content }}</div>
                <div class="question">
                  <question-list :question-list="quest" />
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import questionList from './components/questionList'
import { getSurveyQuest } from '../../api/app'
import Sticky from '../../components/Sticky/index'

export default {

  components: { Sticky, questionList },
  filters: {},
  data() {
    return {
      loading: false,
      quest: {
        surveyId: ''
      }
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.fetchData(id)
    }
  },
  methods:
      {
        goPrev() {
          this.$router.go(-1)
        },
        closePreview() {
          this.$router.go(-1)
        },
        /**
         * 根据Id获取详情
         * @param id
         */
        async fetchData(id) {
          const { data } = await getSurveyQuest(id)
          if (data) {
            this.quest = data
          }
        }
      }
}
</script>

<style scoped lang="scss">
  $blue-color: #1890ff;
  $gray-color: #999;
  .sub-navbar {
    .sub-tip {
      position: absolute;
      left: 10px;
      top: 0;
      font-size: 14px;
      color: $gray-color;

      > em {
        color: red;
      }
    }
  }

  .preview-phone {
    width: 960px;
    min-height: 762px;
    margin: 20px auto;
    padding: 10px;

    &-container {
      width: 100%;
      min-height: 620px;
      overflow-y: auto;

      &-content {
        width: 100%;

        .tab-title {
          margin-top: 10px;
          text-align: center;
          line-height: 34px;
          font-size: 16px;
          font-weight: bold;
          color: $blue-color;
        }

        .tab-content {
          font-size: 14px;
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
