<template>
  <!--求职者信息详情-->
  <div>
    <el-form class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar'">
        <span class="head-title">{{ titleName }}</span>
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
          <el-button v-loading="loading" style="margin-left: 10px;" type="primary" @click="goEdit">
            编辑
          </el-button>
        </div>
      </sticky>
      <div class="post-main-container">
        <el-divider content-position="left">
          <el-tag>基本信息</el-tag>
        </el-divider>
        <el-row>
          <el-col :span="16">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="12">
                  <div class="info-list"><span>姓名：</span> {{ infoData.name }}</div>
                  <div class="info-list"><span>手机号码：</span> {{ infoData.mobile }}</div>
                  <div class="info-list"><span>邮箱：</span> {{ infoData.mail }}</div>
                  <div class="info-list"><span>当前状态：</span> {{ infoData.personalStateName }}</div>
                  <div class="info-list"><span>学历：</span> {{ infoData.educationName }}</div>
                  <div class="info-list"><span>期待薪酬：</span>
                    <em v-if="infoData.hopeSalarySmall > 0 && infoData.hopeSalaryBig > 0">
                      <i v-if="infoData.hopeSalarySmall > 0">{{ infoData.hopeSalarySmall }}K </i>
                      <i v-if="infoData.hopeSalaryBig > 0"> - {{ infoData.hopeSalaryBig }} K</i>
                    </em>
                    <em v-else>面议</em></div>
                  <div class="info-list"><span>期待工作地点：</span> {{ infoData.expectJobProvince }}-{{ infoData.expectJobCity }}-{{ infoData.expectJobArea }}</div>
                </el-col>
                <el-col :span="12">
                  <div class="info-list"><span>身份证号：</span> {{ infoData.idCard }}</div>
                  <div class="info-list"><span>性别：</span> {{ infoData.sexDes }}</div>
                  <div class="info-list"><span>出生年月：</span> {{ infoData.birthday }}</div>
                  <div class="info-list"><span>工作性质：</span> {{ infoData.jobNatureName }}</div>
                  <div class="info-list"><span>工作年限：</span> {{ infoData.workYearName }}</div>
                  <div class="info-list"><span>现居地：</span> {{ infoData.nowProvince }}-{{ infoData.nowCity }}-{{ infoData.nowArea }}</div>
                  <div class="info-list"><span>期待职位类型：</span> {{ infoData.expectJobTypeName }}</div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="8">
            <el-image
              style="width: 125px;height: 125px;"
              :src="infoData.portrait"
              :preview-src-list="[infoData.portrait]"
              fit="contain"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </el-col>
        </el-row>
        <el-divider content-position="left">
          <el-tag>附加信息</el-tag>
        </el-divider>
        <el-row>
          <el-col :span="16">
            <el-form-item
              label-width="120px"
              label="工作经历"
            >
              <span>{{ infoData.workExperience }}</span>
            </el-form-item>
            <el-form-item
              label-width="120px"
              label="教育背景"
            >
              <span>{{ infoData.educationalBackground }}</span>
            </el-form-item>
            <el-form-item
              label-width="120px"
              prop="introduction"
              label="自我评价"
              class="postInfo-container-item width100"
            >
              <span>{{ infoData.selfEvaluation }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-col :span="24">
              <el-form-item
                label-width="120px"
                prop="coverImage"
                label="上传证书"
                class="postInfo-container-item width96"
              >
                <el-image v-for="(url,urlIndex) in infoData.certificateList" :key="urlIndex" style="width: 125px;height: 125px;margin-right: 10px;" :src="url" lazy :preview-src-list="infoData.certificateList">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item
                label-width="120px"
                prop="coverImage"
                label="上传作品"
                class="postInfo-container-item width96"
              >
                <el-image v-for="url in infoData.workList" :key="url" style="width: 125px;height: 125px;margin-right: 10px;" :src="url" lazy :preview-src-list="infoData.workList">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                </el-image>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import Sticky from '../../components/Sticky/index'
import { getDetailById } from '../../api/jobSeeker'

export default {
  components: { Sticky },
  data() {
    return {
      infoData: {},
      loading: false,
      titleName: '求职者信息详情'
    }
  },
  created() {
    const id = this.$route.query && this.$route.query.id
    if (id) {
      this.fetchData(id)
      this.infoData.id = id
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
          const { data } = await getDetailById(id)
          if (data) {
            this.infoData = data
          }
        },
        goEdit() {
          this.$router.push({
            path: '/jobSeeker/seekerEdit',
            query: {
              id: this.infoData.userId
            }
          })
        }
      }
}
</script>

<style scoped lang="scss">
  @import "~@/styles/mixin.scss";

  .post-main-container {
    padding: 40px 25px 20px 25px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
        font-size: 14px;
      }
    }
  }

  .info-list {
    line-height: 32px;
    font-size: 16px;
    display: block;
    width: 100%;

    > span {
      display: inline-block;
      width: 120px;
      text-align: right;
      vertical-align: middle;
      font-size: 14px;
      color: #606266;
      padding: 0 12px 0 0;
      font-weight: bold;
    }
  }

  .width100 {
    width: 100%;
  }

  .avatar-uploader {
    width: 125px;
    height: 125px;

    div {
      width: 100%;
      height: 100%;

      & img {
        width: 100%;
        height: 100%;
        display: block;
      }

    }
  }
</style>
