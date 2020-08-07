<template>
  <view class="main">
    <uni-card isForm>
      <uni-form-item label="项目移交名称">
        <view class="disabled">{{ info.transferName }}</view>
      </uni-form-item>
      <uni-form-item label="移交单位">
        <view class="disabled">{{ info.transferUnit }}</view>
      </uni-form-item>
      <uni-form-item label="接管单位">
        <view class="disabled">{{ info.takeOverUnit }}</view>
      </uni-form-item>
      <uni-form-item label="移交内容">
        <view class="disabled">{{ info.transferScope }}</view>
      </uni-form-item>
      <uni-form-item label="验收合格日期">
        <view class="disabled">{{ info.acceptancePassTime | ymd }}</view>
      </uni-form-item>
      <uni-form-item label="移交人">
        <view class="disabled">{{ info.transferPersonName }}</view>
      </uni-form-item>
      <uni-form-item label="移交时间">
        <view class="disabled">{{ info.transferTime | ymd }}</view>
      </uni-form-item>
    </uni-card>
    <!-- 备注和附件信息开始 -->
    <uni-card isForm>
      <uni-form-item label="备注" align="left" class="block-item">
        <view class="disabled">{{ info.remark }}</view>
      </uni-form-item>
      <uni-form-item class="file-item" label="附件">
        <uni-attachment v-model="info.fileId"></uni-attachment>
      </uni-form-item>
    </uni-card>
    <!-- 备注和附件信息结束 -->
    <!--未移交 start-->
    <view v-if="info.status === 0" class="btn-wrapper">
      <button class="button" :disabled="isLoading" type="primary" @click="handleTurnOver()">移交</button>
    </view>
    <!--未移交 end-->

    <view> </view>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api/projectOver'
export default {
  name: 'DetailProjectOverEpc',
  data() {
    return {
      isDraft: false,
      id: null,
      isLoading: false,
      info: {},
      form: {
        auditResult: '',
        auditOpinion: ''
      },
      rules: {
        auditResult: { required: true }
      },
      approvalRecordList: [] //审批记录
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userId'])
  },
  onLoad(options) {
    this.id = options.id
    this.isDraft = options.status
    console.log(this.isDraft)
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(`/pages/completion-epc/project-over/edit?id=${this.id}`)
  },
  onReady() {

  },

  methods: {
    init() {
      this.getDetail()
    },
    async getDetail() {
      let res = await Api.getDetail(this.id)
      this.info = res.data
      if (res.data.status === 1) {
        // 移交完成隐藏顶部更多操作
        // #ifdef  APP-PLUS
        let webView = this.$mp.page.$getAppWebview()
        webView.setTitleNViewButtonStyle(0, {
          text: '',
          fontSize: 0
        })

        // #endif
      }
    },
    async handleTurnOver() {
      await Api.getTurnOver(this.id)
      this.$utils.showToast('移交成功')
      setTimeout(() => {
        this.$utils.goBack()
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('edit.less');
</style>
