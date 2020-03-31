<template>
  <div>
    <el-form class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '">
        <div class="head-title">职位详情</div>
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
        </div>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="20">
            <el-row>
              <div class="info-list"><span>职位名称：</span> {{ infoData.name }}</div>
              <el-divider />
              <div><span>{{ infoData.area }}</span> | <span>{{ infoData.experienceName }}</span> | <span>{{ infoData.educationName }}</span>
              </div>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="8">
                <el-row>
                  <div class="info-list"><span>薪资范围：</span> {{ infoData.salaryName }}</div>
                  <div class="info-list"><span>职位状态：</span> {{ infoData.statusName }}</div>
                  <div class="info-list"><span>招聘职位数量：</span> {{ infoData.posts }}</div>
                  <div class="info-list"><span>职位更新时间：</span> {{ infoData.publish }}</div>
                  <div class="info-list"><span>要求年龄范围：</span> {{ infoData.ageRangeName }}</div>
                  <div class="info-list"><span>投递总数：</span> {{ infoData.deliveryNum }}</div>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <div class="info-list"><span>要求学历：</span> {{ infoData.educationName }}</div>
                  <div class="info-list"><span>企业名称：</span> {{ infoData.entName }}</div>
                  <div class="info-list"><span>要求工作经验：</span> {{ infoData.experienceName }}</div>
                  <div class="info-list"><span>职位关键词：</span> {{ infoData.functionType }}</div>
                  <div class="info-list"><span>面试邀请状态：</span> {{ infoData.invitationStatus }}</div>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-row>
                  <div class="info-list"><span>工作性质：</span> {{ infoData.jobNature }}</div>
                  <div class="info-list"><span>职能类型：</span> {{ infoData.keyword }}/{{ infoData.keywordTwo }} /{{
                    infoData.keywordThreeName }}
                  </div>
                  <div class="info-list"><span>要求工作经验：</span> {{ infoData.experienceName }}</div>
                  <div class="info-list"><span>职位关键词：</span> {{ infoData.functionType }}</div>
                  <div class="info-list"><span>投递状态：</span> {{ infoData.readstatusName }}</div>
                  <div class="info-list"><span>分享总数：</span> {{ infoData.shareNum }}</div>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="20">
            <el-row>
              <div class="info-list"><span>具体地址：</span> {{ infoData.address }}</div>
              <div class="info-list"><span>职位描述：</span> {{ infoData.description }}</div>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Sticky from '../../components/Sticky/index'
import { getPositionDetaill, getEntJobList, examineEnt } from '../../api/company'

export default {
  status: 'draft',
  components: { Sticky },
  filters: {},
  data() {
    return {
      myHeaders: { Authorization: 'bearer ' + getToken() },
      loading: false,
      infoData: {
        id: ''
      }
    }
  },
  created() {
    // const id = this.$route.query.id
    const id = '367870378750635012'
    if (id) {
      this.fetchData(id)
    }
  },
  methods:
      {
        goPrev() {
          this.$router.go(-1)
        },
        /**
         * 根据Id获取详情
         * @param id
         */
        async fetchData(id) {
          const { data } = await getPositionDetaill(id)
          if (data) {
            this.infoData = data
          }
        }
      }
}
</script>

<style scoped lang="scss">
  .createPost-main-container {
    padding: 40px 30px 20px 30px;

    .info-list {
      line-height: 32px;

      > span {
        color: #888;
      }
    }
  }
</style>
