<template>
  <div>
    <el-form class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '">
        <div class="head-title">企业详情</div>
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
          <el-button v-if="userName !== 'test'" v-loading="loading" class="el-icon-edit" type="primary" @click="goEdit">
            企业信息编辑
          </el-button>
        </div>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="21">
            <el-row>
              <el-col :span="8">
                <div>
                  <div class="info-list"><span>审核状态：</span> {{ infoData.examineStatusName }}</div>
                  <div class="info-list"><span>企业全称：</span> {{ infoData.name }}</div>
                  <div class="info-list"><span>统一社会信用码：</span> {{ infoData.uniformSocialCreditCode }}</div>
                  <div class="info-list"><span>注册资金：</span> {{ infoData.registeredCapital }}</div>
                  <div class="info-list"><span>企业法人：</span> {{ infoData.contactPerson }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <div class="info-list"><span>企业id：</span> {{ infoData.id }}</div>
                  <div class="info-list"><span>企业简称：</span> {{ infoData.shortName }}</div>
                  <div class="info-list"><span>企业社保编号：</span> {{ infoData.socialSecurityNumber }}</div>

                  <div class="info-list"><span>联系电话：</span> {{ infoData.registTel }}</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <div class="info-list"><span>企业性质：</span> {{ infoData.businessNatureName }}</div>
                  <div class="info-list"><span>所属行业：</span> {{ infoData.categoryName }}</div>
                  <div class="info-list"><span>人员规模：</span> {{ infoData.scale }}</div>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <div class="info-list"><span>企业地址：</span>{{ infoData.province }}{{ infoData.city }}{{ infoData.area }}{{ infoData.street }}{{ infoData.address }}</div>
                <div class="info-list"><span>企业简介：</span> {{ infoData.introduction }}</div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <div class="info-list-title">企业营业执照</div>
                <div class="info-list-img">
                  <el-image
                    style="width: 100%; height: 100%;min-height: 150px"
                    :src="infoData.businessLicense"
                    :preview-src-list="[infoData.businessLicense]"
                    fit="contain"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="info-list-title">组织机构代码证</div>
                <div class="info-list-img">
                  <el-image
                    style="width: 100%; height: 100%;min-height: 150px"
                    :src="infoData.organizationCodeCertificate"
                    :preview-src-list="[infoData.organizationCodeCertificate]"
                    fit="contain"
                  >
                    <div slot="error" class="image-slot">
                      <i class="el-icon-picture-outline" />
                    </div>
                  </el-image>
                </div>
              </el-col>
            </el-row>
          </el-col>
          <!--  右边企业logo -->
          <el-col :span="3">
            <div class="info-list-title">企业Logo：</div>
            <div class="info-list-logo">
              <el-image
                style="width: 100px; height: 100px"
                :src="infoData.logo"
                :preview-src-list="[infoData.logo]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
            </div>
            <div class="info-list-br">
              <span>经办人：</span>{{ infoData.managerName }}
            </div>
            <div class="info-list-br">
              <span>经办人电话：</span>{{ infoData.managerTel }}
            </div>
            <div class="info-list-br">
              <span>电子邮箱：</span>{{ infoData.managerEmail }}
            </div>
            <div class="info-list-br">
              <span>经办人身份证号：</span>{{ infoData.managerIdCardNum }}
            </div>
            <div class="info-list-br">
              <span>经办人职位名称：</span>{{ infoData.managerPosition }}
            </div>
          </el-col>
        </el-row>
        <el-row v-if="!isVerify">
          <el-col :span="24">
            <div class="info-list-title">招聘职位</div>
            <div>
              <el-table
                v-loading="tableLoading"
                :data="tableList"
                border
                style="width: 100%;margin-top:10px;"
                row-key="id"
                header-cell-class-name="warning-row"
              >
                <el-table-column align="center" label="序号" width="65" type="index" />
                <el-table-column
                  prop="name"
                  label="岗位名称"
                  align="center"
                />
                <el-table-column
                  prop="salaryName"
                  label="薪资"
                  align="center"
                />
                <el-table-column
                  prop="posts"
                  label="人数"
                  align="center"
                />
                <el-table-column
                  prop="experienceName"
                  label="经验"
                  align="center"
                />
                <el-table-column
                  prop="address"
                  label="工作地址"
                  align="center"
                />
              </el-table>
            </div>
          </el-col>
        </el-row>
        <div>
          <el-row v-if="isVerify ">
            <el-col :span="20" style="margin-top: 30px">
              <el-form-item label="是否审核通过">
                <el-radio-group v-model="examineStatus">
                  <el-radio label="1" border>通过</el-radio>
                  <el-radio label="2" border>不通过</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-button type="primary" @click="confirmRes">确定</el-button>
              <el-button type="warning" @click="goPrev">返回</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Sticky from '../../components/Sticky/index'
import { getDetailById, getEntJobList, examineEnt } from '../../api/company'

export default {
  status: 'draft',
  components: { Sticky },
  filters: {},
  data() {
    return {
      userName: this.$store.state.user.username,
      myHeaders: { Authorization: 'bearer ' + getToken() },
      loading: false,
      infoData: {
        id: ''
      },
      tableList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      nowPage: 1, // 底部标签当前页码
      isLoading: false,
      tableLoading: false,
      type: '',
      isVerify: false, // 是否是审核页面, true 表示审核， false 详情页，则查询 企业下的职位
      examineStatus: '1' // 审核状态
    }
  },
  created() {
    const id = this.$route.query.id
    this.type = this.$route.query.type
    if (id) {
      this.fetchData(id)
      if (this.type === '0') {
        this.isVerify = true // true 表示可以审核
      } else {
        this.isVerify = false
        this.getDataList(id)
      }
    }
  },
  methods:
      {
        goPrev() {
          this.$router.go(-1)
        },
        /**
         * 审核的返回
         */
        goBack() {
          this.$router.push({
            path: '/company/entVerify'
          })
        },
        /**
         * 跳转企业修改信息页面
         */
        goEdit() {
          const id = this.infoData.id
          this.$router.push({
            path: '/company/companyEdit',
            query: {
              id: id
            }
          })
        },
        /**
         * 根据Id获取详情
         * @param id
         */
        async fetchData(id) {
          const { data } = await getDetailById(id)
          if (data) {
            this.infoData = data
            // 若 审核状态 不为 0
            if (this.infoData.examineStatus === 1) {
              this.isVerify = false
            } else if (this.infoData.examineStatus !== 1 && this.type === '0') {
              this.isVerify = true
            }
          }
        },
        /**
         * 获取列表
         * @param id
         */
        async getDataList(id) {
          this.tableLoading = true
          const { code, data } = await getEntJobList(id)
          if (code === 0 && data) {
            if (data && data.length > 0) {
              data.forEach((val) => {
                this.tableList.push(val.position)
              })
            } else {
              this.tableList = []
            }
          }
          this.isLoading = false
          this.tableLoading = false
        },
        /**
         * 企业审核确认
         */
        async confirmRes() {
          if (!this.infoData.id) {
            this.$message({
              message: '企业id 不能为空',
              type: 'warning'
            })
            return
          }
          if (!this.examineStatus) {
            this.$message({
              message: '审核状态不能为空',
              type: 'warning'
            })
            return
          }
          const id = this.infoData.id
          const params = {
            examineStatus: this.examineStatus
          }
          this.loading = true
          const { code } = await examineEnt(id, params)
          if (code === 0) {
            this.$message.success('审核成功')
            this.$router.push({
              path: '/company/entVerify'
            })
          }
          this.loading = false
        }
      }
}
</script>

<style scoped lang="scss">
  .createPost-main-container {
    padding: 40px 30px 20px 30px;

    .info-list {
      line-height: 32px;
      font-size: 14px;

      > span {
        color: #888;
      }
    }

    .info-list-br {
      line-height: 32px;

      > span {
        color: #888;
        display: block;
      }
    }

    .info-list-logo {
      width: 100px;
      height: 100px;
      display: block;
      background: #eee;
      margin: 5px 0;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .info-list-img {
      width: 92%;
      height: 200px;
      display: block;
      background: #f5f7fa;
      margin: 5px 0;
      overflow: hidden;

      > img {
        width: 100%;
        height: 100%;
      }
    }

    .info-list-title {
      font-size: 16px;
      line-height: 36px;
    }
  }

  .article-textarea /deep/ {
    textarea {
      padding-right: 40px;
      resize: none;
      border: none;
      border-radius: 0;
      border-bottom: 1px solid #bfcbd9;
    }
  }

  .avatar-uploader {
    width: 270px;
    height: 125px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409EFF;
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
        font-size: 28px;
        position: absolute;
        right: 4px;
        top: 4px;
        z-index: 100;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 270px;
        height: 125px;
        line-height: 125px;
        text-align: center;
      }
    }
  }
</style>
