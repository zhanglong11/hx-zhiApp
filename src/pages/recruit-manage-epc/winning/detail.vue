<template>
  <view class="main">
    <uni-card isForm>
      <uni-form-item label="招标公告名称">
        <view class="disabled">{{ info.invitationBidName }}</view>
      </uni-form-item>
      <uni-form-item label="招标编号">
        <view class="disabled">{{ info.invitationBidCode }}</view>
      </uni-form-item>
      <uni-form-item label="招标类型">
        <view class="disabled">{{ $getLabel(tenderTypeList, info.type) }}</view>
      </uni-form-item>
      <uni-form-item label="中标方式">
        <view class="disabled">{{ $getLabel(tenderModeList, info.mode) }}</view>
      </uni-form-item>
      <uni-form-item label="中标单位">
        <view class="disabled">{{ info.tenderCompany }}</view>
      </uni-form-item>
      <uni-form-item label="中标金额(元)">
        <view class="disabled">{{ info.tenderMoney }}</view>
      </uni-form-item>
      <uni-form-item label="项目经理">
        <view class="disabled">{{ info.projectManager }}</view>
      </uni-form-item>
      <uni-form-item label="电话">
        <view class="disabled">{{ info.mobile }}</view>
      </uni-form-item>
      <uni-form-item label="公示日期">
        <view class="disabled">{{ info.publicityDate | ymd }}</view>
      </uni-form-item>
      <uni-form-item label="是否联合体中标">
        <view class="disabled">{{ info.isCombo === 1 ? '是' : '不是' }}</view>
      </uni-form-item>
      <uni-form-item label="联合体工作范围">
        <view class="disabled">{{ info.comboWorkingRange }}</view>
      </uni-form-item>
      <uni-form-item label="评审专家">
        <view class="disabled">{{ info.evaluationExpert }}</view>
      </uni-form-item>
    </uni-card>
    <view class="card-title-outer">
      <view class="title">
        <view>管理人员明细</view>
      </view>
    </view>
    <block v-if="info.personParamDTOList.length">
      <block v-for="(item, index) in info.personParamDTOList" :key="index" style="margin:0 5px">
        <uni-card>
          <uni-form-item label="序号">
            <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
          </uni-form-item>
          <uni-form-item label="姓名">
            <view class="disabled">{{ item.name }}</view>
          </uni-form-item>
          <uni-form-item label="身份证号">
            <view class="disabled">{{ item.idcardNumber }}</view>
          </uni-form-item>
          <uni-form-item label="联系电话">
            <view class="disabled">{{ item.mobile }}</view>
          </uni-form-item>
          <uni-form-item label="资格证书" prop="credentials">
            <view class="disabled">{{ item.credentials }}</view>
          </uni-form-item>
          <uni-form-item label="资格等级" prop="qualificationLevel">
            <view class="disabled">{{ item.qualificationLevel }}</view>
          </uni-form-item>
          <uni-form-item label="备注" align="right" prop="remark">
            <view class="disabled">{{ item.remark }}</view>
          </uni-form-item>
        </uni-card>
      </block>
    </block>
    <block v-else>
      <view style="margin:10rpx 30rpx;padding: 40rpx;background-color: #fff;border-radius: 20rpx">暂无管理人员</view>
    </block>
    <!-- 备注和附件信息开始 -->
    <uni-card isForm>
      <uni-form-item label="备注" align="right" class="block-item">
        <view class="disabled">{{ info.remark }}</view>
      </uni-form-item>
      <uni-form-item class="file-item" label="附件">
        <uni-attachment v-model="info.fileIds"></uni-attachment>
      </uni-form-item>
    </uni-card>
    <uni-card isForm>
      <uni-form-item label="创建人" align="right" class="block-item">
        <view class="disabled">{{ info.creatorName }}</view>
      </uni-form-item>
      <uni-form-item class="block-item" label="创建时间">
        <view class="disabled">{{ info.createTime }}</view>
      </uni-form-item>
    </uni-card>
    <!-- 备注和附件信息结束 -->
    <view v-if="info.status === 0" class="btn-wrapper">
      <button class="button" :disabled="isLoading" type="primary" @click="handleWinningDelete(true)">删除</button>
    </view>
    <!--    审核人登录审核吔面-->
    <!--    <view v-if="info.auditName === userId">-->
    <view>
      <!--      待审核页面-->
      <view v-if="info.auditStatus === 1">
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
      </view>
      <!--      已通过或已驳回页面-->
      <!-- <view v-if="[2, 3].includes(info.status)">
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
      <uni-check-card :id="id" ref="checkCard" />
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
  name: 'WinningDetail',
  data() {
    return {
      isDraft: false,
      id: null,
      isLoading: false,
      info: { personParamDTOList: [] },
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
    this.isDraft = options.auditStatus === 0
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(`/pages/recruit-manage-epc/winning/add?id=${this.id}`)
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
      let res = await Api.getWinningDetail(this.id)
      this.info = { ...res.data, personParamDTOList: res.data.personParamDTOList || [] }
    },
    async handleWinningDelete() {
      let res = await Api.deleteWinning(this.id)
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
