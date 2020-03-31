<template>
  <div>
    <el-form
      ref="postForm"
      :model="postForm"
      :rules="rules"
      class="form-container"
    >
      <sticky :z-index="10" :class-name="'sub-navbar ' + postForm.status">
        <span class="head-title">大屏编辑</span>
        <!--        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">-->
        <!--          发布-->
        <!--        </el-button>-->
        <div class="head-btn-list">
          <el-button @click="goPrev">返回</el-button>
          <el-button
            v-loading="loading"
            class="el-icon-edit"
            type="primary"
            @click="submitForm"
          >
            发布
          </el-button>
        </div>
      </sticky>
      <div class="createPost-main-container">
        <el-row>
          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput
                v-model="postForm.rdb.bigScreenName"
                :maxlength="100"
                name="name"
                required
              >
                大屏名称
              </MDinput>
            </el-form-item>
            <div class="postInfo-container">
              <el-row>
                <el-col :span="8">
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="企业数:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model.number="postForm.rdb.enterpriseNums"
                        type="number"
                        placeholder="请输入企业数"
                      />
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="就业人数:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model.number="postForm.rdb.obtainEmployment"
                        type="number"
                        placeholder="请输入就业人数"
                      />
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="援企数:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model.number="postForm.rdb.yuanQiNums"
                        type="number"
                        placeholder="请输入援企数"
                      />
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="昨日新增:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model.number="postForm.rdb.yYesterdayAdd"
                        type="number"
                        placeholder="请输入昨日新增"
                      />
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="稳岗数:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model.number="postForm.rdb.wenGangNums"
                        type="number"
                        placeholder="请输入稳岗数"
                      />
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="昨日新增:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model.number="postForm.rdb.wYesterdayAdd"
                        type="number"
                        placeholder="请输入昨日新增"
                      />
                    </el-form-item>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div class="postInfo-container">
              <p class="container-title">企业复工情况</p>
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    label-width="90px"
                    label="复工企业:"
                    class="postInfo-container-item"
                  >
                    <el-input
                      v-model.number="postForm.er.resumedEnterprise"
                      type="number"
                      placeholder="请输入复工企业"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label-width="90px"
                    label="未复工企业:"
                    class="postInfo-container-item"
                  >
                    <el-input
                      v-model.number="postForm.er.noResumedEnterprise"
                      type="number"
                      placeholder="请输入未复工企业"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label-width="90px"
                    label="已返岗人数:"
                    class="postInfo-container-item"
                  >
                    <el-input
                      v-model.number="postForm.er.returnedWorkNumbers"
                      type="number"
                      placeholder="请输入已返岗人数"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    label-width="90px"
                    label="未返岗人数:"
                    class="postInfo-container-item"
                  >
                    <el-input
                      v-model.number="postForm.er.noReturnedWorkNumbers"
                      type="number"
                      placeholder="请输入未返岗人数"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="postTable-container">
              <p class="container-title">重点企业预警</p>
              <el-button
                type="primary"
                @click="addModalData('kews')"
              >新增数据</el-button>
              <el-table
                :data="postForm.kews"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-top:10px"
              >
                <el-table-column min-width="200px" label="企业名称">
                  <template slot-scope="{ row }">
                    <span>{{ row.enterpriseName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="税收（万）">
                  <template slot-scope="{ row }">
                    <span>{{ row.taxRevenue }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="复工率（%）">
                  <template slot-scope="{ row }">
                    <span>{{ row.returnRate }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="{ row }">
                    <el-button
                      type="success"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="editItem('kews', row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="warning"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="delectItem('kews', row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="postInfo-container">
              <p class="container-title">企业用工需求</p>
              <el-row>
                <el-col :span="8">
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="招聘企业:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model="postForm.epneed.recruitmentEnterprise"
                        placeholder="请输入招聘企业"
                      />
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="昨日新增:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model="postForm.epneed.rYesterdayAdd"
                        placeholder="请输入昨日新增"
                      />
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="招聘岗位:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model="postForm.epneed.positions"
                        placeholder="请输入招聘岗位"
                      />
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="昨日新增:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model="postForm.epneed.pYesterdayAdd"
                        placeholder="请输入昨日新增"
                      />
                    </el-form-item>
                  </el-row>
                </el-col>
                <el-col :span="8">
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="缺工人数:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model="postForm.epneed.needWorkerNums"
                        placeholder="请输入缺工人数"
                      />
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item
                      label-width="80px"
                      label="昨日新增:"
                      class="postInfo-container-item"
                    >
                      <el-input
                        v-model="postForm.epneed.nYesterdayAdd"
                        placeholder="请输入昨日新增"
                      />
                    </el-form-item>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div class="postTable-container">
              <p class="container-title">用工缺口岗位</p>
              <el-button
                type="primary"
                @click="addModalData('jobGaps')"
              >新增数据</el-button>
              <el-table
                :data="postForm.jobGaps"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-top:10px"
              >
                <el-table-column min-width="200px" label="岗位">
                  <template slot-scope="{ row }">
                    <span>{{ row.job }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="缺口比例">
                  <template slot-scope="{ row }">
                    <span>{{ row.gap }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="{ row }">
                    <el-button
                      type="success"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="editItem('jobGaps', row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="warning"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="delectItem('jobGaps', row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="postTable-container">
              <p class="container-title">企业数/复工率</p>
              <el-button
                type="primary"
                @click="addModalData('ewns')"
              >新增数据</el-button>
              <el-table
                :data="postForm.ewns"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-top:10px"
              >
                <el-table-column min-width="200px" label="地区">
                  <template slot-scope="{ row }">
                    <span>{{ row.region }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="企业数">
                  <template slot-scope="{ row }">
                    <span>{{ row.enterpriseNums }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="复工率（%）">
                  <template slot-scope="{ row }">
                    <span>{{ row.resumptionWork }}</span>
                  </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="{ row }">
                    <el-button
                      type="success"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="editItem('ewns', row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="warning"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="delectItem('ewns', row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="postTable-container">
              <p class="container-title">支柱产业</p>
              <el-button
                type="primary"
                @click="addModalData('pis')"
              >新增数据</el-button>
              <el-table
                :data="postForm.pis"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-top:10px"
              >
                <el-table-column min-width="200px" label="产业名称">
                  <template slot-scope="{ row }">
                    <span>{{ row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="税收(亿)">
                  <template slot-scope="{ row }">
                    <span>{{ row.taxRevenue }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="{ row }">
                    <el-button
                      type="success"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="editItem('pis', row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="warning"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="delectItem('pis', row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="postTable-container">
              <p class="container-title">预计返岗人数</p>
              <el-button
                type="primary"
                @click="addModalData('pnrs')"
              >新增数据</el-button>
              <el-table
                :data="postForm.pnrs"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-top:10px"
              >
                <el-table-column min-width="200px" label="时间">
                  <template slot-scope="{ row }">
                    <span>{{ row.countTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="本地预计返岗人数">
                  <template slot-scope="{ row }">
                    <span>{{ row.local }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="异地预计返岗人数">
                  <template slot-scope="{ row }">
                    <span>{{ row.nonlocal }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="200">
                  <template slot-scope="{ row }">
                    <el-button
                      type="success"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="editItem('pnrs', row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="warning"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="delectItem('pnrs', row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="postTable-container">
              <p class="container-title">人才画像（饼图）</p>
              <el-row :gutter="20">
                <el-col :span="12">
                  <span>按年龄划分</span>
                  <el-button
                    type="primary"
                    @click="addModalData('age')"
                  >新增数据</el-button>
                  <el-table
                    :data="postForm.ppBean.age"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;margin-top:10px"
                  >
                    <el-table-column label="选项">
                      <template slot-scope="{ row }">
                        <span>{{ row.option }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="占比">
                      <template slot-scope="{ row }">
                        <span>{{ row.share }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="200">
                      <template slot-scope="{ row }">
                        <el-button
                          type="success"
                          size="small"
                          icon="el-icon-circle-check-outline"
                          @click="editItem('age', row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          type="warning"
                          size="small"
                          icon="el-icon-circle-check-outline"
                          @click="delectItem('age', row)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="12">
                  <span>按学历划分：</span>
                  <el-button
                    type="primary"
                    @click="addModalData('education')"
                  >新增数据</el-button>
                  <el-table
                    :data="postForm.ppBean.education"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;margin-top:10px"
                  >
                    <el-table-column label="选项">
                      <template slot-scope="{ row }">
                        <span>{{ row.option }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="占比">
                      <template slot-scope="{ row }">
                        <span>{{ row.share }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="200">
                      <template slot-scope="{ row }">
                        <el-button
                          type="success"
                          size="small"
                          icon="el-icon-circle-check-outline"
                          @click="editItem('education', row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          type="warning"
                          size="small"
                          icon="el-icon-circle-check-outline"
                          @click="delectItem('education', row)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <span>按薪资划分</span>
                  <el-button
                    type="primary"
                    @click="addModalData('salary')"
                  >新增数据</el-button>
                  <el-table
                    :data="postForm.ppBean.salary"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;margin-top:10px"
                  >
                    <el-table-column label="选项">
                      <template slot-scope="{ row }">
                        <span>{{ row.option }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="占比">
                      <template slot-scope="{ row }">
                        <span>{{ row.share }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="200">
                      <template slot-scope="{ row }">
                        <el-button
                          type="success"
                          size="small"
                          icon="el-icon-circle-check-outline"
                          @click="editItem('salary', row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          type="warning"
                          size="small"
                          icon="el-icon-circle-check-outline"
                          @click="delectItem('salary', row)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="12">
                  <span>按类型划分：</span>
                  <el-button
                    type="primary"
                    @click="addModalData('type')"
                  >新增数据</el-button>
                  <el-table
                    :data="postForm.ppBean.type"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%;margin-top:10px"
                  >
                    <el-table-column label="选项">
                      <template slot-scope="{ row }">
                        <span>{{ row.option }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column label="占比">
                      <template slot-scope="{ row }">
                        <span>{{ row.share }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="200">
                      <template slot-scope="{ row }">
                        <el-button
                          type="success"
                          size="small"
                          icon="el-icon-circle-check-outline"
                          @click="editItem('type', row)"
                        >
                          编辑
                        </el-button>
                        <el-button
                          type="warning"
                          size="small"
                          icon="el-icon-circle-check-outline"
                          @click="delectItem('type', row)"
                        >
                          删除
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
            <div class="postTable-container">
              <p class="container-title">求职意向</p>
              <el-button
                type="primary"
                @click="addModalData('jobints')"
              >新增数据</el-button>
              <el-table
                :data="postForm.jobints"
                border
                fit
                highlight-current-row
                style="width: 100%;margin-top:10px"
              >
                <el-table-column min-width="200px" label="职位">
                  <template slot-scope="{ row }">
                    <span>{{ row.position }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="本地预计返岗人数">
                  <template slot-scope="{ row }">
                    <span>{{ row.num }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="数量" width="200">
                  <template slot-scope="{ row }">
                    <el-button
                      type="success"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="editItem('jobints', row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="warning"
                      size="small"
                      icon="el-icon-circle-check-outline"
                      @click="delectItem('jobints', row)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div></el-form>
    <!-- 弹出窗-->
    <!-- 新增的弹窗-->
    <el-dialog
      :visible.sync="dialogResVisible"
      :title="dialogType === 'new' ? '新建数据' : '编辑数据'"
      :before-close="closeModal"
    >
      <el-form
        ref="dataForm"
        :model="modalData"
        :rules="rules"
        label-width="100px"
        label-position="right"
      >
        <el-form-item
          v-for="(v, i) in modalTemp"
          :key="i"
          :label="v.label"
          :prop="v.value"
        >
          <el-input
            v-if="!v.options && !v.date"
            v-model="modalData[v.value]"
            :type="v.type || 'text'"
            :placeholder="'请输入' + v.label"
          />
          <el-select
            v-if="v.options"
            v-model="modalData[v.value]"
            :placeholder="'请输入' + v.label"
            style="width: 100%"
          >
            <el-option
              v-for="item in v.options"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            />
          </el-select>
          <el-date-picker
            v-if="v.date"
            v-model="modalData[v.value]"
            value-format="yyyy-MM-dd"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="closeModal"
        >取消</el-button>
        <el-button type="primary" @click="saveModalData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MDinput from '@/components/MDinput'
import Sticky from '../../components/Sticky/index'
import { getDetailById, modifyData } from '../../api/monitor'
import { deepClone } from '@/utils'
import { getDicList } from '../../api/common'
const defaultForm = {
  rdb: {
    bigScreenName: '',
    enterpriseNums: '',
    obtainEmployment: '',
    wenGangNums: '',
    wYesterdayAdd: '',
    yuanQiNums: '',
    yYesterdayAdd: ''
  },
  er: {
    resumedEnterprise: '',
    noResumedEnterprise: '',
    noReturnedWorkNumbers: '',
    returnedWorkNumbers: ''
  },
  epneed: {
    needWorkerNums: '',
    nYesterdayAdd: '',
    positions: '',
    pYesterdayAdd: '',
    recruitmentEnterprise: '',
    rYesterdayAdd: ''
  },
  kews: [],
  ewns: [],
  jobGaps: [],
  jobints: [],
  pis: [],
  pnrs: [],
  ppBean: {
    age: [],
    education: [],
    salary: [],
    type: []
  }
}

export default {
  name: 'MonitorEdit',
  status: 'draft',
  components: { Sticky, MDinput },
  filters: {
    filterHtml(val) {
      return val.replace(/<[^>]*>/g)
    }
  },
  data() {
    return {
      postForm: deepClone(defaultForm),
      query: {
        area: null
      },
      loading: false,
      rules: {
        // title: [{ validator: validateRequire }],
        // content: [{ validator: validateRequire }]
        // isRequire: [{ required: true, message: '请完善数据', trigger: 'blur' }]
      },
      dialogResVisible: false,
      modalData: {
        code: '',
        name: '',
        method: '',
        description: '',
        url: '',
        type: 'url',
        parentId: '',
        level: ''
      },
      modalTemp: [],
      modalType: '',
      dialogType: 'new',
      ageOptions: [],
      eduOptions: [],
      jobNatureOptions: [],
      salaryOptions: []
    }
  },

  created() {
    const area = this.$route.query && this.$route.query.area
    if (area) {
      this.fetchData(area)
      this.query.area = area
      // this.ageOptions = [
      //   { label: '18-25岁', key: 'age18to24' },
      //   { label: '25-35岁', key: 'age25to34' },
      //   { label: '35-45岁', key: 'age35to44' },
      //   { label: '45-55岁', key: 'age45to54' },
      //   { label: '55岁以上', key: 'age55to120' }
      // ]
      // this.eduOptions = [
      //   { label: '初中及以下', key: 'edu01' },
      //   { label: '高中/中专', key: 'edu23' },
      //   { label: '大专', key: 'edu4' },
      //   { label: '本科及以上', key: 'edu567' }
      // ]
      // this.salaryOptions = [
      //   { label: '1千-2千', key: 'salary0' },
      //   { label: '2千-4千', key: 'salary1' },
      //   { label: '4千-6千', key: 'salary2' },
      //   { label: '6千-8千', key: 'salary3' },
      //   { label: '8千-1万', key: 'salary4' },
      //   { label: '1万-1.2万', key: 'salary5' },
      //   { label: '1.2万-1.5万', key: 'salary6' },
      //   { label: '1.5万以上', key: 'salary7' }
      // ]
      // this.jobNatureOptions = [
      //   { label: '全职', key: 'jobNature0' },
      //   { label: '兼职', key: 'jobNature1' },
      //   { label: '临时', key: 'jobNature2' },
      //   { label: '实习', key: 'jobNature3' },
      //   { label: '灵活就业及其他', key: 'jobNature4' }
      // ]
      this.ageOptions = getDicList('ageRange')
      this.eduOptions = getDicList('education')
      this.jobNatureOptions = getDicList('jobNature')
      this.salaryOptions = getDicList('salary')
    }
  },
  methods: {
    goPrev() {
      this.$router.go(-1)
    },
    /**
     * 给提交的数据做处理
     * @param form
     * */
    handleForm(form) {
      const myForm = deepClone(form)
      // 要给form中每一项加上一个area
      const areaStr = this.query.area + '';
      ['rdb', 'er', 'epneed'].forEach((key) => {
        myForm[key].area = areaStr
        if (myForm[key].id) {
          delete myForm[key].id
        }
      })
      myForm.kews = myForm.kews.map((item) => ({
        area: areaStr,
        enterpriseName: item.enterpriseName,
        returnRate: parseFloat(item.returnRate),
        taxRevenue: parseFloat(item.taxRevenue)
      }))
      myForm.ewns = myForm.ewns.map((item) => ({
        area: areaStr,
        region: item.region,
        enterpriseName: item.enterpriseName,
        enterpriseNums: parseFloat(item.enterpriseNums),
        resumptionWork: parseFloat(item.resumptionWork)
      }))
      myForm.jobGaps = myForm.jobGaps.map((item) => ({
        area: areaStr,
        job: item.job,
        gap: parseFloat(item.gap)
      }))
      myForm.jobints = myForm.jobints.map((item) => ({
        area: areaStr,
        position: item.position,
        num: parseFloat(item.num)
      }))
      myForm.pis = myForm.pis.map((item) => ({
        area: areaStr,
        name: item.name,
        taxRevenue: parseFloat(item.taxRevenue)
      }))
      myForm.pnrs = myForm.pnrs.map((item) => ({
        area: areaStr,
        countTime: item.countTime,
        local: parseFloat(item.local),
        nonlocal: parseFloat(item.nonlocal)
      }))
      const keys = ['kews', 'ewns', 'jobGaps', 'jobints', 'pis', 'pnrs']
      keys.forEach((key) => {
        if (!myForm[key].length) myForm[key] = [{}]
      })
      if (myForm.ppBean.age.length) {
        myForm.ppBean.insertAge = true
        myForm.ppBean.age = myForm.ppBean.age.reduce((res, curr) => {
          const ageCode = this.ageOptions.find(option => option.label === curr.option).value
          res.push({ area: areaStr, ageName: curr.option, ageRate: curr.share, ageCode })
          return res
        }, [])
      } else {
        myForm.ppBean.insertAge = false
        myForm.ppBean.age = [{ area: areaStr }]
      }
      if (myForm.ppBean.education.length) {
        myForm.ppBean.insertEdu = true
        myForm.ppBean.education = myForm.ppBean.education.reduce((res, curr) => {
          const eduCode = this.eduOptions.find(option => option.label === curr.option).value
          res.push({ area: areaStr, eduName: curr.option, eduRate: curr.share, eduCode })
          return res
        }, [])
      } else {
        myForm.ppBean.insertEdu = false
        myForm.ppBean.education = [{ area: areaStr }]
      }
      if (myForm.ppBean.type.length) {
        myForm.ppBean.insertType = true
        myForm.ppBean.type = myForm.ppBean.type.reduce((res, curr) => {
          const jobCode = this.jobNatureOptions.find(option => option.label === curr.option).value
          res.push({ area: areaStr, jobName: curr.option, jobRate: curr.share, jobCode })
          return res
        }, [])
      } else {
        myForm.ppBean.insertType = false
        myForm.ppBean.type = [{ area: areaStr }]
      }
      if (myForm.ppBean.salary.length) {
        myForm.ppBean.insertSalary = true
        myForm.ppBean.salary = myForm.ppBean.salary.reduce((res, curr) => {
          const salaryCode = this.salaryOptions.find(option => option.label === curr.option).value
          res.push({ area: areaStr, salaryName: curr.option, salaryRate: curr.share, salaryCode })
          return res
        }, [])
      } else {
        myForm.ppBean.insertSalary = false
        myForm.ppBean.salary = [{ area: areaStr }]
      }
      return myForm
    },
    /**
     * 发布
     */
    submitForm(e) {
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          const form = this.handleForm(this.postForm)
          this.modify(form)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    /**
     * 修改
     * @param form
     * @returns {Promise<void>}
     */
    async modify(form) {
      this.loading = true
      const { code } = await modifyData(form)
      if (code === 0) {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.status = 'published'
        this.$router.push({
          path: '/monitor/monitorList'
        })
      }
      this.loading = false
    },
    /**
     * 根据区域获取详情
     * @param area
     */
    async fetchData(area) {
      const { data } = await getDetailById(area)
      console.log('data', data)
      if (data) {
        this.postForm = {
          rdb: data.rdb || this.postForm.rdb,
          er: data.er || this.postForm.er,
          epneed: data.epneed || this.postForm.epneed,
          kews: data.kews ? data.kews.map((item, index) => ({ ...item, index })) : [],
          ewns: data.ewns ? data.ewns.map((item, index) => ({ ...item, index })) : [],
          jobGaps: data.jobGaps ? data.jobGaps.map((item, index) => ({ ...item, index, gap: item.gapValue })) : [],
          jobints: data.jobints ? data.jobints.map((item, index) => ({ ...item, index })) : [],
          pis: data.pis ? data.pis.map((item, index) => ({ ...item, index })) : [],
          pnrs: data.pnrs ? data.pnrs.map((item, index) => ({ ...item, index })) : [],
          ppBean: this.postForm.ppBean
        }
        if (data.ppBean) {
          this.postForm.ppBean.age = data.ppBean.age.map((age, index) => ({ option: age.ageName, share: age.ageRate, index }))
          this.postForm.ppBean.education = data.ppBean.education.map((edu, index) => ({ option: edu.eduName, share: edu.eduRate, index }))
          this.postForm.ppBean.salary = data.ppBean.salary.map((salary, index) => ({ option: salary.salaryName, share: salary.salaryRate, index }))
          this.postForm.ppBean.type = data.ppBean.type.map((type, index) => ({ option: type.jobName, share: type.jobRate, index }))
        }
      }
    },
    // Modal操作
    // 新增一行数据
    addModalData(type, row) {
      this.dialogResVisible = true
      this.$nextTick(() => {
        if (this.$refs.dataForm && this.$refs.dataForm.clearValidate) {
          this.$refs.dataForm.clearValidate()
        }
      })
      const kewsType = [
        {
          value: 'enterpriseName',
          label: '企业名称'
        },
        {
          value: 'taxRevenue',
          label: '税收',
          type: 'number'
        },
        {
          value: 'returnRate',
          label: '复工率',
          type: 'number',
          noValidate: true
        }
      ]
      const ewnsType = [
        {
          value: 'region',
          label: '地区'
        },
        {
          value: 'enterpriseNums',
          label: '企业数',
          type: 'number'
        },
        {
          value: 'resumptionWork',
          label: '复工率',
          type: 'number'
        }
      ]
      const jobGapsType = [
        {
          value: 'job',
          label: '岗位'
        },
        {
          value: 'gap',
          label: '缺口比例',
          type: 'number'
        }
      ]
      const pisType = [
        {
          value: 'name',
          label: '产业名称'
        },
        {
          value: 'taxRevenue',
          label: '税收（亿）',
          type: 'number'
        }
      ]
      const pnrsType = [
        {
          value: 'countTime',
          label: '时间',
          date: true
        },
        {
          value: 'local',
          label: '本地预计返岗人数',
          type: 'number'
        },
        {
          value: 'nonlocal',
          label: '异地预计返岗人数',
          type: 'number'
        }
      ]
      const ppBeanType = [
        {
          value: 'option',
          label: '选项'
        },
        {
          value: 'share',
          label: '占比',
          type: 'number'
        }
      ]
      const ppBeanAgeType = [
        {
          value: 'option',
          label: '选项',
          options: this.ageOptions.filter(
            age => this.postForm.ppBean.age.findIndex(bean => bean.option === age.label) === -1 || (row && row.option === age.label)
          )
        },
        {
          value: 'share',
          label: '占比',
          type: 'number'
        }
      ]
      const ppBeanEduType = [
        {
          value: 'option',
          label: '选项',
          options: this.eduOptions.filter(
            edu => this.postForm.ppBean.education.findIndex(bean => bean.option === edu.label) === -1 || (row && row.option === edu.label)
          )
        },
        {
          value: 'share',
          label: '占比',
          type: 'number'
        }
      ]
      const ppBeanTypeType = [
        {
          value: 'option',
          label: '选项',
          options: this.jobNatureOptions.filter(
            job => this.postForm.ppBean.type.findIndex(bean => bean.option === job.label) === -1 || (row && row.option === job.label)
          )
        },
        {
          value: 'share',
          label: '占比',
          type: 'number'
        }
      ]
      const ppBeanSalaryType = [
        {
          value: 'option',
          label: '选项',
          options: this.salaryOptions.filter(
            salary => this.postForm.ppBean.salary.findIndex(bean => bean.option === salary.label) === -1 || (row && row.option === salary.label)
          )
        },
        {
          value: 'share',
          label: '占比',
          type: 'number'
        }
      ]
      const jobintsType = [
        {
          value: 'position',
          label: '职位'
        },
        {
          value: 'num',
          label: '数量',
          type: 'number'
        }
      ]
      switch (type) {
        case 'kews':
          this.modalTemp = kewsType
          break
        case 'ewns':
          this.modalTemp = ewnsType
          break
        case 'jobGaps':
          this.modalTemp = jobGapsType
          break
        case 'pis':
          this.modalTemp = pisType
          break
        case 'pnrs':
          this.modalTemp = pnrsType
          break
        case 'jobints':
          this.modalTemp = jobintsType
          break
        case 'age':
          this.modalTemp = ppBeanAgeType
          break
        case 'education':
          this.modalTemp = ppBeanEduType
          break
        case 'type':
          this.modalTemp = ppBeanTypeType
          break
        case 'salary':
          this.modalTemp = ppBeanSalaryType
          break
        default:
          this.modalTemp = ppBeanType
          break
      }
      // 重置modal的item
      let form = {}
      if (row) {
        form = Object.assign({}, row)
      } else {
        this.modalTemp.forEach(v => {
          form[v.value] = ''
        })
      }
      this.rules = this.modalTemp.reduce((rules, curr) => {
        if (curr.noValidate) return rules
        rules[curr.value] = [{ required: true, message: '请完善数据', trigger: 'blur' }]
        return rules
      }, {})
      form.modalType = type
      this.modalData = form
    },
    // 保存新增数据
    saveModalData() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          const modal = this.modalData
          let dataTemp = []
          if (
            modal.modalType === 'age' ||
            modal.modalType === 'education' ||
            modal.modalType === 'salary' ||
            modal.modalType === 'type'
          ) {
            dataTemp = this.postForm.ppBean[modal.modalType]
          } else {
            dataTemp = this.postForm[modal.modalType]
          }
          if (this.dialogType === 'new') {
            modal.index = dataTemp.length
            dataTemp.push(modal)
          } else {
            dataTemp.forEach((v, i) => {
              if (modal.index === i) {
                // dataTemp[i] = modal
                this.$set(dataTemp, i, modal)
              }
            })
          }
          if (
            modal.modalType === 'age' ||
            modal.modalType === 'education' ||
            modal.modalType === 'salary' ||
            modal.modalType === 'type'
          ) {
            this.postForm.ppBean[modal.modalType] = dataTemp
          } else {
            this.postForm[modal.modalType] = dataTemp
            // this.$set(this.postForm, modal.modalType, dataTemp)
          }
          this.dialogResVisible = false
        }
      })
    },
    // 关闭弹窗
    closeModal() {
      this.$refs.dataForm.clearValidate()
      this.dialogResVisible = false
    },
    // table内编辑
    editItem(type, row) {
      console.log(row)
      this.dialogType = 'edit'
      this.addModalData(type, row)
    },
    delectItem(type, row) {
      if (
        type === 'age' ||
        type === 'education' ||
        type === 'salary' ||
        type === 'type'
      ) {
        const index = this.postForm.ppBean[type].findIndex(item => item === row)
        this.postForm.ppBean[type].splice(index, 1)
      } else {
        const index = this.postForm[type].findIndex(item => item === row)
        this.postForm[type].splice(index, 1)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "~@/styles/mixin.scss";

.createPost-main-container {
  padding: 40px 45px 20px 50px;

  .postInfo-container {
    position: relative;
    @include clearfix;
    margin-bottom: 10px;

    .postInfo-container-item {
      float: left;
    }
  }

  .container-title {
    border-bottom: 1px solid;
    padding-bottom: 5px;
    color: #4b6bd0;
    font-size: 18px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
}
</style>
