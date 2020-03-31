<template>
  <div>
    <el-form class="form-container">
      <sticky :z-index="10" :class-name="'sub-navbar '">
        <div class="head-title">招聘会详情</div>
        <div class="head-btn-list">
          <el-button @click="goPrev()">
            返回
          </el-button>
          <el-button v-if="userName !== 'test'" v-loading="loading" class="el-icon-edit" type="primary" @click="goEdit">
            编辑
          </el-button>
        </div>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <div class="info-list"><span>招聘会名称：</span> {{ infoData.title }}</div>
                  <div class="info-list"><span>招聘会状态：</span> {{ infoData.status }}</div>
                  <div class="info-list"><span>展位数量：</span>{{ infoData.positionNum }}
                  </div>
                  <div class="info-list"><span>是否开启线上申请：</span> {{ infoData.onlineApply | onlineApplyFil }}</div>
                </el-col>
                <el-col :span="8">
                  <div class="info-list"><span>举办单位：</span> {{ infoData.organization }}</div>
                  <div class="info-list"><span>举办时间：</span> {{ infoData.startTime }}</div>
                  <div class="info-list"><span>开放申请：</span> {{ infoData.registrStartTime }}</div>
                  <div v-show="infoData.province" class="info-list"><span>举办区域：</span> {{ infoData.province }} {{
                    infoData.city }} {{ infoData.area }}
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="info-list"><span>类型：</span> {{ infoData.type | parseType }}</div>
                  <div class="info-list"><span>结束时间：</span> {{ infoData.endTime }}</div>
                  <div class="info-list"><span>结束申请：</span> {{ infoData.registrEndTime }}</div>
                </el-col>
                <el-col :span="24">
                  <div class="info-list"><span>举办地点：</span> {{ infoData.address }}</div>
                  <div class="info-list"><span>招聘会简介：</span> {{ infoData.introduction }}</div>
                </el-col>
                <el-col :span="24">
                  <div class="info-list"><span style="vertical-align: top;display: inline-block">招聘会图片：</span>
                    <div style="display: inline-block">
                      <el-image
                        style="width: 270px;height: 125px;"
                        :src="infoData.coverImage"
                        :preview-src-list="[infoData.coverImage]"
                        fit="contain"
                      >
                        <div slot="error" class="image-slot">
                          <i class="el-icon-picture-outline" />
                        </div>
                      </el-image>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div class="info-list-title">分配详情</div>
            <div>
              <el-table
                v-loading="tableLoading"
                :data="tableList"
                border
                style="width: 100%;margin-top:10px;"
                row-key="id"
                header-cell-class-name="warning-row"
              >
                <el-table-column
                  align="center"
                  label="序号"
                  width="65"
                  type="index"
                  :index="(index)=>{return (index+1) + (pageNo-1)*pageSize}"
                />
                <el-table-column
                  label="参展单位"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-link target="_blank" @click="goEntDetail(scope.row)">{{ scope.row.entName }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="managerName"
                  label="联络人"
                  align="center"
                />
                <el-table-column
                  prop="managerTel"
                  label="联络方式"
                  align="center"
                />
                <el-table-column
                  label="招聘岗位"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-link target="_blank" @click="getJobDetail(scope.row)">{{ scope.row.positions }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="statusName"
                  label="状态"
                  align="center"
                />
                <el-table-column
                  label="操作"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div v-if="userName !== 'test'" style="display: inline-block">
                      <el-button
                        v-if="scope.row.status === 1 || scope.row.status === 3"
                        type="primary"
                        size="mini"
                        @click="verifyHandle(scope.row)"
                      >审核
                      </el-button>
                    </div>
                    <el-button type="primary" size="mini" @click="getJobDetail(scope.row)">职位详情</el-button>
                    <!--                    <el-button type="primary" size="mini" @click="dealHandle(scope.row)">上移</el-button>-->
                    <!--                    <el-button type="primary" size="mini" @click="dealHandle(scope.row)">分配</el-button>-->
                    <!--                    <el-button type="primary" size="mini" @click="cancelDeal(scope.row)">取消分配</el-button>-->
                  </template>
                </el-table-column>
              </el-table>
              <!-- 分页-->
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="nowPage"
                :limit.sync="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                @pagination="pageChange"
              />
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <!--审核弹窗-->
    <el-dialog :visible.sync="verifyModal" :title="verifyTitle+'审核'" width="400px">
      <div>
        <span>是否通过审核 </span>
        <el-radio-group v-model="examineStatus">
          <el-radio label="2" border>通过</el-radio>
          <el-radio label="3" border>不通过</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelModal">
          取消
        </el-button>
        <el-button type="primary" @click="confirmForm">
          确定
        </el-button>
      </div>
    </el-dialog>
    <!-- 分配展位的弹窗-->
    <el-dialog :visible.sync="dialogDetail" title="职位详情">
      <div>
        <el-table
          v-loading="btTabLoading"
          :data="boothData"
          border
          fit
          header-cell-class-name="warning-row"
          style="width: 100%;max-height: 600px"
        >
          <el-table-column align="center" label="序号" width="65" type="index" />
          <el-table-column align="center" prop="name" label="职位名称" />
          <el-table-column align="center" prop="posts" label="招聘职位数量" />
          <el-table-column align="center" prop="salaryName" label="薪资" />
          <el-table-column align="center" prop="experienceName" label="经验" />
          <el-table-column align="center" prop="educationName" label="职位要求学历" />
          <el-table-column align="center" prop="ageRangeName" label="年龄范围" />
          <el-table-column align="center" prop="address" label="工作地址" />
        </el-table>
        <pagination
          v-show="btTotal>0"
          :total="btTotal"
          :page.sync="nowPage"
          :limit.sync="btPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          @pagination="btPageChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import Sticky from '../../components/Sticky/index'
import { getDetailById, jobfairEnt, getEntPosition, examineEnt } from '../../api/jobFair'
import Pagination from '@/components/Pagination'

export default {
  status: 'draft',
  components: { Sticky, Pagination },
  filters: {
    parseType(val) {
      return val === 1 ? '现场招聘会' : '网络招聘会'
    },
    onlineApplyFil(val) {
      return val === 1 ? '是' : '否'
    }
  },
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
      dialogDetail: false, // 分配展位的弹窗
      boothData: [], // 分配展位--列表数据
      btPageNo: 1,
      btPageSize: 10,
      btTotal: 0, // 列表总数
      btnowPage: 1, // 底部标签当前页码
      btTabLoading: false,
      postForm: {
        name: '',
        businessNature: '',
        category: ''
      },
      busNatureList: [], // 企业性质字典列表
      categoryList: [], // 行业类别列表
      onlineList: [
        {
          value: '0',
          label: '未申请'
        }, {
          value: '1',
          label: '已申请'
        }
      ], // 是否线上申请
      statusList: [
        { label: '未开始', value: 1 },
        { label: '进行中', value: 2 },
        { label: '已结束', value: 3 }
      ],
      typeList: [
        { label: '现场招聘会', value: 1 },
        { label: '网络招聘会', value: 2 }
      ], // 招聘会类型
      verifyModal: false,
      verifyTitle: '',
      examineStatus: '2', // 审核状态 "2-审核通过 3-审核不通过",
      jobFairId: '', // 招聘会ID
      entId: '',
      userId: '' // 参会公司userid
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.fetchData(id)
      this.getDataList(id)
    }
  },
  methods:
      {
        goPrev() {
          this.$router.go(-1)
        },
        /**
         * 跳转到修改信息页面
         */
        goEdit() {
          const id = this.infoData.id
          this.$router.push({
            path: '/jobFair/jobFairEdit',
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
            const _this = this
            _this.infoData = data
            const index = _this.statusList.findIndex(function(val) {
              return val.value === _this.infoData.status
            })
            _this.infoData.status = _this.statusList[index].label
          }
        },
        /**
         * 获取列表
         */
        async getDataList(id) {
          this.tableLoading = true
          const { code, data } = await jobfairEnt(id, this.pageNo, this.pageSize)
          if (code === 0 && data) {
            if (data && data.list.length > 0) {
              this.tableList = data.list
              this.total = data.total
            } else {
              this.tableList = []
            }
          }
          this.isLoading = false
          this.tableLoading = false
        },
        /**
         * 页面更换
         * @param e
         */
        pageChange(e) {
          const page = e.page
          const size = e.limit
          this.pageNo = page
          this.nowPage = page
          this.pageSize = size
          this.getDataList(this.infoData.id)
        },
        /**
         * 点击参展单位名称
         * @param row
         */
        goEntDetail(row) {
          const id = row.entId
          this.$router.push({
            path: '/company/entDetail',
            query: {
              id: id
            }
          })
        },
        /**
         * 点击招聘岗位 ---根据招聘会id 公司id 获取公司报名的职位
         * @param row
         */
        getJobDetail(row) {
          this.getJobDetailList(row.jobFairId, row.entId, row.userId)
        },
        async getJobDetailList(jobfairid, entId, userId) {
          const params = {
            jobfairid: jobfairid,
            entId: entId,
            userId: userId
          }
          const { code, data } = await getEntPosition(params)
          if (code === 0 && data.length > 0) {
            this.dialogDetail = true
            this.boothData = data
          } else {
            this.boothData = []
            this.dialogDetail = false
            this.$message.success('暂无参加的招聘岗位')
          }
        },
        /**
         * 审核 参会公司
         * @param scope
         */
        verifyHandle(scope) {
          this.jobFairId = scope.jobFairId
          this.userId = scope.userId
          this.entId = scope.entId
          this.verifyTitle = scope.entName
          this.verifyModal = true
        },
        confirmForm() {
          const params = {
            examineStatus: this.examineStatus,
            userId: this.userId
          }
          examineEnt(this.jobFairId, params).then((res) => {
            this.getJobDetailList(this.jobFairId, this.entId, this.userId)
            this.$message.success('操作成功')
            this.cancelModal()
          })
        },
        cancelModal() {
          this.verifyModal = false
          this.jobFairId = ''
          this.userId = ''
          this.entId = ''
          this.verifyTitle = ''
        },
        /**
         * 取消分配
         */
        cancelDeal(id) {

        },
        /**
         * 分配
         */
        dealHandle() {
          // this.dialogDetail = true
        },

        // 弹窗重置条件
        reset() {
          this.postForm = {
            name: '',
            businessNature: ''
          }
          this.getBtDataList()
        },
        /**
         * 查询按钮
         */
        async submitForm() {
          if (this.postForm) {
            this.isLoading = true
            this.pageNo = 1
            this.getBtDataList()
          }
        },
        /**
         * 获取弹窗 列表
         */
        async getBtDataList(id) {
          this.tableLoading = true
          const { code, data } = await jobfairEnt(id, this.pageNo, this.pageSize)
          if (code === 0 && data) {
            const list = data.list
            if (list && list.length > 0) {
              this.tableList = list
              this.total = data.total
            } else {
              this.tableList = []
              this.total = 0
            }
          }
          this.isLoading = false
          this.tableLoading = false
        },
        /**
         * 页面更换 弹窗 的列表
         * @param e
         */
        btPageChange(e) {
          const page = e.page
          const size = e.limit
          this.btPageNo = page
          this.nowPage = page
          this.btPageSize = size
          this.getBtDataList()
        }
      }
}
</script>

<style scoped lang="scss">
  @import "~@/styles/mixin.scss";

  .form-inline {
    display: inline-block;
  }

  .createPost-main-container {
    padding: 40px 45px 20px 50px;

    .info-list {
      line-height: 32px;

      > span {
        color: #888;
      }
    }

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;

      }
    }

    .word-counter {
      width: 40px;
      position: absolute;
      right: 10px;
      top: 0;
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
