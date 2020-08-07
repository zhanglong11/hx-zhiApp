<template>
  <view class="main">
    <!--待整改-->
    <block v-if="info.rectifyStatus === 2 && info.principalId === userId">
      <uni-card isForm>
        <uni-form-custom ref="noticeForm" class="main-body" :model="noticeForm" :rules="noticeFormRules">
          <uni-form-item label="整改人" isLink prop="rectifyPrincipal">
            <uni-select-user
              v-model="noticeForm.rectifyPrincipal"
              :name.sync="noticeForm.rectifyPrincipalName"
              placeholder="请选择"
            />
          </uni-form-item>
          <uni-form-item label="整改期限" prop="rectifyDeadline">
            <uni-date-picker v-model="noticeForm.rectifyDeadline" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="整改内容" prop="rectifyContent">
            <textarea v-model.trim="noticeForm.rectifyContent" auto-height placeholder="请输入整改内容" />
          </uni-form-item>
        </uni-form-custom>
      </uni-card>
      <view class="btn-wrapper">
        <button class="button" :disabled="isLoading" type="primary" @click="handleNoticeRectify">通知整改</button>
      </view>
    </block>
    <uni-card isForm>
      <uni-form-item label="验收名称" align="left" :border="false">
        <view class="disabled">{{ info.name }}</view>
      </uni-form-item>
      <uni-form-item label="验收范围" align="left" :border="false">
        <view class="disabled">{{ info.acceptanceScope }}</view>
      </uni-form-item>
      <uni-form-item label="计划验收日期" align="left" :border="false">
        <view class="disabled">{{ info.planAcceptanceTime | ymd }}</view>
      </uni-form-item>
      <uni-form-item label="组织单位" align="left" :border="false">
        <view class="disabled">{{ info.organizer }}</view>
      </uni-form-item>
      <uni-form-item label="参加单位" align="left" :border="false">
        <view class="disabled">{{ info.participant }}</view>
      </uni-form-item>
      <uni-form-item label="负责人" align="left" :border="false">
        <view class="disabled">{{ info.principalName }}</view>
      </uni-form-item>
      <uni-form-item label="备注" align="left" :border="false">
        <view class="disabled">{{ info.remark }}</view>
      </uni-form-item>
      <uni-form-item label="填报人" align="left" :border="false">
        <view class="disabled">{{ info.fillPersonName }}</view>
      </uni-form-item>
      <uni-form-item label="填报时间" align="left" :border="false">
        <view class="disabled">{{ info.actualAcceptanceTime | ymd }}</view>
      </uni-form-item>
      <uni-form-item class="file-item" label="初验申请附件" prop="acceptanceFileId">
        <uni-attachment v-model="info.acceptanceFileId"></uni-attachment>
      </uni-form-item>
    </uni-card>
    <!--流程顺序开始-->
    <block v-if="info.flowCharts && info.flowCharts.length">
      <block v-for="item of info.flowCharts" :key="item.id">
        <!--初检结果-->
        <uni-card v-if="item.type === 1" title="验收结果" isForm>
          <uni-form-item label="验收结果" :border="false">
            <view class="disabled">{{ ['不合格', '合格'][item.resultStatus] }}</view>
          </uni-form-item>
          <uni-form-item label="总体意见" :border="false">
            <view class="disabled">{{ info.acceptanceOpinion }}</view>
          </uni-form-item>
          <uni-form-item v-if="item.resultStatus === 0" label="问题记录" :border="false">
            <view class="disabled">{{ info.issueDesctiption }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" label="验收结果附件" :border="false">
            <uni-attachment v-model="info.resultFileId"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="验收人">
            <view class="disabled">{{ info.fillPersonName }}</view>
          </uni-form-item>
          <uni-form-item label="验收日期" :border="false">
            <view class="disabled">{{ info.actualAcceptanceTime | ymd }}</view>
          </uni-form-item>
        </uni-card>
        <!--整改内容-->
        <uni-card v-if="item.type === 2" title="整改内容" isForm>
          <uni-form-item label="问题记录" :border="false">
            <view class="disabled">{{ item.rectifyContent }}</view>
          </uni-form-item>
          <uni-form-item label="整改结果" :border="false">
            <view class="disabled">{{ ['不合格', '合格'][item.rectifyResult] }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" :border="false" label="整改附件" prop="rectifyFileId">
            <uni-attachment v-model="item.rectifyFileId"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="整改人">
            <view class="disabled">{{ item.rectifyPrincipalName }}</view>
          </uni-form-item>
          <uni-form-item label="整改日期" :border="false">
            <view class="disabled">{{ item.rectifyTime | ymd }}</view>
          </uni-form-item>
        </uni-card>
        <!--复验结果-->
        <uni-card v-if="item.type === 3" title="复验结果" isForm>
          <uni-form-item label="复验结果" :border="false">
            <view class="disabled">{{ ['不合格', '合格'][item.reviewResult] }}</view>
          </uni-form-item>
          <uni-form-item label="复验日期" :border="false">
            <view class="disabled">{{ item.reviewTime | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="总体意见" :border="false">
            <view class="disabled">{{ item.reviewOpinion }}</view>
          </uni-form-item>
          <uni-form-item class="file-item" :border="false" label="复验附件">
            <uni-attachment v-model="item.reviewFileId"></uni-attachment>
          </uni-form-item>
          <uni-form-item label="复验人">
            <view class="disabled">{{ item.reviewPrincipalName }}</view>
          </uni-form-item>
        </uni-card>
      </block>
    </block>

    <!--流程顺序结束-->
    <!--整改中-->
    <block v-if="info.rectifyStatus === 3 && info.principalId === userId">
      <uni-card title="通知整改" isForm>
        <uni-form-item label="整改人" :border="false">
          <view class="disabled">{{ info.rectifyPrincipalName }}</view>
        </uni-form-item>
        <uni-form-item label="整改期限" :border="false">
          <view class="disabled">{{ info.rectifyDeadline | ymd }}</view>
        </uni-form-item>
        <uni-form-item label="整改内容" :border="false">
          <view class="disabled">{{ info.rectifyContent }}</view>
        </uni-form-item>
        <uni-form-item label="下达人">
          <view class="disabled">{{ info.principalName }}</view>
        </uni-form-item>
        <uni-form-item label="下达时间" :border="false">
          <view class="disabled">{{ info.rectifyOrderTime | ymd }}</view>
        </uni-form-item>
      </uni-card>
    </block>
    <!--整改中-->
    <!--待验收-->
    <block v-if="info.acceptanceStatus === 2 && info.principalId === userId">
      <uni-card isForm>
        <uni-form-custom ref="inspectForm" class="main-body" :model="inspectForm" :rules="inspectFormRules">
          <uni-form-item label="验收结果" isLink prop="acceptanceResult">
            <uni-select
              v-model="inspectForm.acceptanceResult"
              :options="[
                { label: '合格', value: 1 },
                { label: '不合格', value: 0 }
              ]"
            ></uni-select>
          </uni-form-item>
          <uni-form-item label="验收日期" prop="actualAcceptanceTime">
            <uni-date-picker v-model="inspectForm.actualAcceptanceTime" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="总体意见" prop="acceptanceOpinion">
            <textarea v-model.trim="inspectForm.acceptanceOpinion" auto-height placeholder="请输入验收名称" />
          </uni-form-item>
          <uni-form-item v-if="inspectForm.acceptanceResult === 0" label="问题记录" prop="issueDesctiption">
            <textarea v-model.trim="inspectForm.issueDesctiption" auto-height placeholder="请输入问题记录" />
          </uni-form-item>
          <uni-form-item class="file-item" label="验收结果附件" prop="resultFileId">
            <uni-attachment v-model="inspectForm.resultFileId" edit></uni-attachment>
          </uni-form-item>
        </uni-form-custom>
      </uni-card>
    </block>
    <!--待验收结束-->

    <!--待整改-->
    <block v-if="info.rectifyStatus === 3 && info.rectifyPrincipal === userId">
      <uni-form-custom ref="rectifyForm" class="main-body" :model="rectifyForm" :rules="rectifyFormRules">
        <uni-card isForm>
          <uni-form-item label="整改结果" prop="rectifyResult">
            <textarea v-model.trim="rectifyForm.rectifyResult" auto-height placeholder="请输入整改结果" />
          </uni-form-item>
          <uni-form-item class="file-item" label="整改附件" prop="reviewFileId">
            <uni-attachment v-model="rectifyForm.rectifyFileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
    </block>
    <!--待复检-->
    <block v-if="info.rectifyStatus === 4 && info.principalId === userId">
      <uni-form-custom ref="reviewForm" class="main-body" :model="reviewForm" :rules="reviewFormRules">
        <uni-card isForm>
          <uni-form-item label="复验结果" isLink prop="reviewResult">
            <uni-select
              v-model="reviewForm.reviewResult"
              :options="[
                { label: '合格', value: 1 },
                { label: '不合格', value: 0 }
              ]"
            ></uni-select>
          </uni-form-item>
          <uni-form-item label="总体意见" prop="reviewOpinion">
            <textarea v-model.trim="reviewForm.reviewOpinion" auto-height placeholder="请输入总体意见" />
          </uni-form-item>
          <uni-form-item label="复验日期" prop="reviewTime">
            <uni-date-picker v-model="reviewForm.reviewTime" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item class="file-item" label="整改附件" prop="reviewFileId">
            <uni-attachment v-model="reviewForm.reviewFileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
    </block>
    <!--草稿状态下删除-->
    <view v-if="info.acceptanceStatus === 0" class="btn-wrapper">
      <button class="button" :disabled="isLoading" type="primary" @click="handleDelete">删除</button>
    </view>
    <!-- 待验收验收-->
    <view v-if="info.acceptanceStatus === 2 && info.principalId === userId" class="btn-wrapper">
      <button class="button" :disabled="isLoading" type="primary" @click="handleInspect">验收</button>
    </view>
    <!--驳回修改操作-->
    <view v-if="info.acceptanceStatus === 3 && info.principalId === userId" class="btn-wrapper">
      <button class="button" :disabled="isLoading" type="primary" @click="handleEdit">修改</button>
    </view>
    <!-- 整改中(整改完成操作)-->
    <view v-if="info.rectifyStatus === 3 && info.rectifyPrincipal === userId" class="btn-wrapper">
      <button class="button" :disabled="isLoading" type="primary" @click="handleRectify">整改完成</button>
    </view>
    <!-- 待复检(复检提交操作)-->
    <view v-if="info.rectifyStatus === 4 && info.principalId === userId" class="btn-wrapper">
      <button class="button" :disabled="isLoading" type="primary" @click="handleReview">提交</button>
    </view>

    <!--有审核流程开始-->
    <block v-if="info.acceptanceStatus">
      <uni-check-detail :id="id"></uni-check-detail>
    </block>
    <!--有审核流程结束-->
    <block v-if="info.acceptanceStatus === 1">
      <uni-check-card :id="id" ref="checkCard" :padding="0" />
    </block>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import inspectStatus from '../lib/inspectStatus'
import rectifyStatus from '../lib/rectifyStatus'
import Api from '../api/inspect'
import { workFlowApi } from '@/api/work-flow'
export default {
  name: 'InspectDetail',
  data() {
    return {
      isDraft: false,
      id: null,
      inspectStatus,
      rectifyStatus,
      isLoading: false,
      info: {},
      form: {},
      rules: {
        name: { required: true },
        acceptanceScope: { required: true },
        planAcceptanceTime: { required: true },
        organizer: { required: true },
        participant: { required: true },
        principalId: { required: true }
      },
      inspectForm: {}, //验收表单
      inspectFormRules: {
        acceptanceResult: { required: true },
        actualAcceptanceTime: { required: true }
      },
      noticeForm: {}, //通知下达表单
      noticeFormRules: {
        rectifyPrincipal: { required: true },
        rectifyDeadline: { required: true },
        rectifyContent: { required: true }
      },
      rectifyForm: {}, //整改表单
      rectifyFormRules: {
        rectifyResult: { required: true }
      },
      reviewForm: {}, //复检表格
      reviewFormRules: {
        reviewResult: { required: true },
        reviewTime: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userId'])
  },
  onLoad(options) {
    this.id = options.id
    this.isDraft = options.status === '0'
    this.init()
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    this.handleEdit()
  },
  onReady() {
    // 非草稿状态隐藏顶部更多操作
    // #ifdef  APP-PLUS
    if (!this.isDraft) {
      let webView = this.$mp.page.$getAppWebview()
      webView.setTitleNViewButtonStyle(0, {
        text: '',
        fontSize: 0
      })
    }
    // #endif
  },
  methods: {
    init() {
      this.getDetail()
    },
    async getDetail() {
      let res = await Api.getDetail(this.id)
      this.info = res.data
    },
    //驳回后提交
    async handleSubmit(isSubmit) {
      await this.$refs.form.validate()
      let res = await Api.update({ ...this.info, type: 1, optType: isSubmit ? 2 : 1 })
      this.$utils.showToast('提交成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 500)
    },
    //跳转到编辑页面
    handleEdit() {
      this.$utils.toUrl(`/pages/completion-epc/project-first-inspect/add?id=${this.id}`)
    },
    async handleDelete() {
      let res = await Api.delete(this.id)
      this.$utils.showToast('删除成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 500)
    },
    //验收人验收
    async handleInspect() {
      await this.$refs.inspectForm.validate()
      await Api.inspect({ ...this.inspectForm, id: this.id })
      this.$utils.showToast('验收成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 500)
    },
    //通知整改
    async handleNoticeRectify() {
      await this.$refs.noticeForm.validate()
      await Api.noticeRectify({ ...this.noticeForm, id: this.id })
      this.$utils.showToast('通知成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 500)
    },
    //整改完成
    async handleRectify() {
      await this.$refs.rectifyForm.validate()
      await Api.rectify({ ...this.rectifyForm, id: this.id, rectifyTime: moment().format('YYYY-MM-DD HH:mm:ss') })
      this.$utils.showToast('填写整改成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 500)
    },
    //填写复检结果
    async handleReview() {
      await this.$refs.reviewForm.validate()
      await Api.review({ ...this.reviewForm, id: this.id })
      this.$utils.showToast('提交成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('detail.less');
</style>
