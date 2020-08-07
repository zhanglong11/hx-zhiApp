<template>
  <div class="main">
    <div class="info">
      <uni-card>
        <uni-form-item label="会议名称" align="left">
          <span>{{ detail.meetingName }}</span>
        </uni-form-item>
        <uni-form-item label="会议主题" align="left">
          <span>{{ detail.meetingSubject }}</span>
        </uni-form-item>
        <uni-form-item :border="false" label="发起人" align="left">
          <span>{{ detail.initiatorName }}</span>
        </uni-form-item>
        <uni-form-item :border="false" label="会议地点" align="left">
          <span>{{ detail.meetingAddress }}</span>
        </uni-form-item>
        <uni-form-item :border="false" label="会议时间" align="left" style="width: 100%;">
          <span>{{ detail.startTime | ymdhm }} - {{ detail.endTime | ymdhm }}</span>
        </uni-form-item>
        <uni-form-item :border="false" label="参与人员" align="left">
          <span>{{ _.join(_.map(detail.attenderList, 'attenderName'), ',') }}</span>
        </uni-form-item>
        <uni-form-item :border="false" label="会议内容" align="left">
          <span>{{ detail.meetingContent }}</span>
        </uni-form-item>
        <uni-form-item :border="false" label="会议状态" align="left" style="width: 100%;">
          <span>{{ $getLabel(meetingStatusList, detail.status) }}</span>
        </uni-form-item>
        <uni-form-item :border="false" label="记录人" align="left" style="width: 100%;">
          <span>{{ detail.recorderName }}</span>
        </uni-form-item>
        <uni-form-item :border="false" label="会议资料" align="left" style="width: 100%;">
          <uni-attachment :value="detail.meetingFileId"></uni-attachment>
        </uni-form-item>
        <uni-form-item v-if="detail.meetingResult" label="会议结果记录" align="left">
          <span>{{ detail.meetingResult }}</span>
        </uni-form-item>
        <uni-form-item v-if="detail.resultFileId" label="会议纪要" align="left">
          <span>{{ detail.resultFileId }}</span>
        </uni-form-item>
      </uni-card>
      <uni-card>
        <uni-form-item label="创建人">{{ detail.creatorName }}</uni-form-item>
        <uni-form-item label="创建时间">{{ detail.createTime }}</uni-form-item>
      </uni-card>
      <view
        v-if="
          detail.status === 0 && $hasPower('ProjectMeetingDeleteEpc') && detail.creator === $store.state.user.userId
        "
        class="btn-wrapper"
      >
        <button class="button" type="warn" @click="remove()">删除</button>
      </view>
      <view v-if="[1].includes(detail.status)">
        <!-- 通用审批 start -->
        <uni-check-card :id="id" ref="checkCard" />
        <!-- 通用审批 end -->
      </view>

      <view v-if="[1, 2, 3, 4, 5].includes(detail.status)">
        <uni-check-detail :id="id"></uni-check-detail>
      </view>

      <!--审核通过之后 记录人填写会议结果记录-->
      <uni-card v-if="detail.status === 4 && detail.recorderId === $store.state.user.userId">
        <uni-form-item label="会议结果记录">
          <textarea v-model="form.meetingResult" autoHeight placeholder="请输入" />
        </uni-form-item>
        <uni-form-item label="会议纪要">
          <uni-attachment v-model="form.resultFileId" edit />
        </uni-form-item>
        <view class="btn-wrapper">
          <button class="button" type="primary" @click="submitResult('saveResultAndSubmit')">提交</button>
        </view>
      </uni-card>
      <!--审核通过之后 记录人填写会议结果记录-->

      <uni-card v-if="[5].includes(detail.status)" title="会议记录">
        <uni-form-item label="会议结果记录">
          <div>{{ detail.meetingResult }}</div>
        </uni-form-item>
        <uni-form-item label="会议纪要">
          <uni-attachment v-model="detail.resultFileId" />
        </uni-form-item>
      </uni-card>
    </div>
  </div>
</template>

<script>
import meetingStatusList from './lib/meetingStatusList'
import UniAttachment from '@/components/uni-attachment/uni-attachment'
export default {
  name: 'MeetingDetails',
  components: { UniAttachment },
  data() {
    return {
      id: null,
      detail: {},
      form: {},
      meetingStatusList
    }
  },
  onLoad(options) {
    this.id = options.id
    this.refresh()
    if (!this.$hasPower('ProjectMeetingEditEpc')) {
      this.$utils.hideNavButton.call(this)
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'edit') {
      this.$utils.toUrl(`/pages/project-approval-Epc/meeting-add?id=${this.id}`)
    }
    if (obj.key === 'save') {
      this.submit()
    }
  },
  methods: {
    refresh() {
      this.axios.system.get('systemMeeting/get/' + this.id).then(res => {
        this.detail = res.data
        this.form.id = this.id
        const isRecorder = res.data.status === 2 && this.$store.state.user.userId === res.data.recorderId
        if (isRecorder) {
          this.$utils.setNavButton.call(this, 0, {
            text: '暂存',
            key: 'save',
            fontSize: 14
          })
        } else if (![0, 2].includes(res.data.status)) {
          this.$utils.hideNavButton.call(this)
        }
        if (res.data.creator !== this.$store.state.user.userId) {
          this.$utils.hideNavButton.call(this)
        }
      })
    },
    async remove() {
      uni.showModal({
        title: '提示',
        content: '确定要删除？',
        success: res => {
          if (res.confirm) {
            this.axios.system.post('systemMeeting/delete/' + this.id).then(() => {
              this.$utils.showToast('删除成功')
              this.$utils.goBack()
            })
          }
        }
      })
    },
    // 提交会议结果
    submitResult(action = 'saveResult') {
      this.axios.system.post('systemMeeting/' + action, _.assign({}, this.detail, this.form)).then(res => {
        this.$utils.showToast('操作成功')
        this.refresh()
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  padding-top: 15px;
  padding-bottom: 30px;
}
.uni-card {
  width: 700px;
}
</style>
