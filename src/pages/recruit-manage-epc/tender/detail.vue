<template>
  <view class="main">
    <uni-card isForm>
      <uni-form-item label="招标公告名称">
        <view class="disabled">{{ info.name }}</view>
      </uni-form-item>
      <uni-form-item label="招标公告编码">
        <view class="disabled">{{ info.code }}</view>
      </uni-form-item>
      <uni-form-item label="招标类型">
        <view class="disabled">{{ $getLabel(tenderTypeList, info.type) }}</view>
      </uni-form-item>
      <uni-form-item label="招标方式">
        <view class="disabled">{{ $getLabel(tenderModeList, info.mode) }}</view>
      </uni-form-item>
      <uni-form-item label="公告发布日期">
        <view class="disabled">{{ info.publishDate | ymd }}</view>
      </uni-form-item>
      <uni-form-item label="投标截止日期">
        <view class="disabled">{{ info.endDate | ymd }}</view>
      </uni-form-item>
      <uni-form-item label="开标地点">
        <view class="disabled">{{ info.address }}</view>
      </uni-form-item>
      <uni-form-item label="创建人">
        <view class="disabled">{{ info.creatorName }}</view>
      </uni-form-item>
      <uni-form-item label="创建时间">
        <view class="disabled">{{ info.createTime }}</view>
      </uni-form-item>
    </uni-card>
    <!-- 备注和附件信息开始 -->
    <uni-card isForm>
      <uni-form-item label="备注" align="left" class="block-item">
        <view class="disabled">{{ info.remark }}</view>
      </uni-form-item>
      <uni-form-item class="file-item" label="附件">
        <uni-attachment v-model="info.fileIds"></uni-attachment>
      </uni-form-item>
    </uni-card>
    <!-- 备注和附件信息结束 -->
    <view v-if="info.auditStatus === 0" class="btn-wrapper">
      <button class="button" :disabled="isLoading" type="primary" @click="handleTenderDelete(true)">删除</button>
    </view>
    <!--    审核人登录审核吔面-->
    <!--    <view v-if="info.auditName === userId">-->
    <view>
      <!--      待审核页面-->
      <!--  <view v-if="info.auditStatus === 1">
        <uni-card isForm>
          <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
            <uni-form-item label="审核结果" isLink prop="auditResult">
              <uni-select
                v-model="form.auditResult"
                :options="[
                  { label: '合格', value: 1 },
                  { label: '不合格', value: 0 }
                ]"
              ></uni-select>
            </uni-form-item>
            <uni-form-item label="审核意见" prop="auditOpinion">
              <textarea v-model="form.auditOpinion" placeholder="请输入" auto-height />
            </uni-form-item>
          </uni-form-custom>
        </uni-card>
      </view>-->
      <!--      已通过或已驳回页面-->
      <!-- <view v-if="[2, 3].includes(info.auditStatus)">
        <uni-card title="审核结果">
          <uni-form-item label="审核结果" :border="false">
            <view class="disabled">{{ ['通过', '驳回'][0] }}</view>
          </uni-form-item>
          <uni-form-item label="审核人" :border="false"
            ><view class="disabled">{{ info.auditName }}</view></uni-form-item
          >
          <uni-form-item label="审核意见">
            <view class="placeholder">{{ info.optionContent }}</view>
          </uni-form-item>
          <uni-form-item label="审核日期" :border="false">
            <view class="disabled">{{ info.auditTime | ymd }}</view>
          </uni-form-item>
        </uni-card>
      </view>-->
      <!-- 审批记录 start -->
      <uni-check-detail :id="id"></uni-check-detail>
      <!-- 审批记录 end -->
      <!-- 通用审批 start -->
      <block v-if="info.auditStatus === 1">
        <uni-check-card :id="id" ref="checkCard" />
      </block>
      <!-- 通用审批 end -->
    </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import Api from '../api'
import { workFlowApi } from '@/api/work-flow'
export default {
  name: 'TenderDetail',
  data() {
    return {
      id: null,
      isLoading: false,
      info: {},
      form: {
        auditResult: '',
        auditOpinion: ''
      },
      rules: {
        auditResult: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userId']),
    tenderTypeList() {
      return this.$getArgList('tenderType')
    },
    tenderModeList() {
      return this.$getArgList('tenderMode')
    }
  },
  onLoad(options) {
    this.id = options.id
    this.init()
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(`/pages/recruit-manage-epc/tender/add?id=${this.id}`)
  },
  onReady() {},
  methods: {
    init() {
      this.getDetail()
    },
    async getDetail() {
      let res = await Api.getTenderDetail(this.id)
      this.info = res.data
      // #ifdef  APP-PLUS
      if (res.data.auditStatus !== 0 || this.userId !== res.data.creator) {
        let webView = this.$mp.page.$getAppWebview()
        webView.setTitleNViewButtonStyle(0, {
          text: '',
          fontSize: 0
        })
      }
      // #endif
    },
    async handleTenderDelete() {
      let res = await Api.deleteTender(this.id)
      this.$utils.showToast('删除成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
