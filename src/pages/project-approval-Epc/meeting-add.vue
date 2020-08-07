<template>
  <div class="main">
    <uni-form-custom ref="form" label-width="120px" :model="form" :rules="rules">
      <uni-card isForm header="发起会议">
        <uni-form-item label="会议名称" prop="meetingName">
          <input v-model="form.meetingName" placeholder="请输入" />
        </uni-form-item>
        <uni-form-item label="会议主题" prop="meetingSubject">
          <input v-model="form.meetingSubject" placeholder="请输入" />
        </uni-form-item>
        <uni-form-item label="发起人" prop="initiatorName">
          <input v-model="form.initiatorName" placeholder="请输入" />
        </uni-form-item>
        <uni-form-item label="会议地点" prop="meetingAddress">
          <input v-model="form.meetingAddress" placeholder="请输入" />
        </uni-form-item>
        <uni-form-item label="会议开始时间" prop="startTime">
          <uni-date-picker v-model="form.startTime" placeholder="请选择" fields="minute" mode="date"></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="会议结束时间" prop="endTime">
          <uni-date-picker v-model="form.endTime" placeholder="请选择" fields="minute" mode="date"></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="记录人" prop="recorderId">
          <uni-select-user
            v-model="form.recorderId"
            value-format="id"
            :name.sync="form.recorderName"
            :multiple="false"
          ></uni-select-user>
        </uni-form-item>
        <uni-form-item label="参会人员" isRequired>
          <uni-select-user
            :id.sync="form.attenderIds"
            :value="form.attenderIds"
            :name.sync="form.attenderNames"
            multiple
          ></uni-select-user>
        </uni-form-item>
        <uni-form-item>
          <textarea v-model="form.extraAttender" auto-height type="text" placeholder="在此输入系统外人员,用 , 隔开" />
        </uni-form-item>
        <uni-form-item label="会议内容" prop="meetingContent">
          <textarea v-model="form.meetingContent" autoHeight type="textarea" placeholder="请输入" />
        </uni-form-item>
        <uni-form-item label="会议资料">
          <uni-attachment v-model="form.meetingFileId" edit></uni-attachment>
        </uni-form-item>
      </uni-card>
    </uni-form-custom>
    <view class="btn-wrapper">
      <button class="button" type="primary" :loading="isLoading" @click="save('saveAndSubmit')">提交</button>
    </view>
  </div>
</template>

<script>
import UniAttachment from '@/components/uni-attachment/uni-attachment'
import _ from 'lodash'
export default {
  name: 'Edit',
  components: { UniAttachment },
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        attenderIds: '',
        attenderNames: '',
        attenderList: [],
        extraAttender: '',
        meetingType: 'meetingType_1',
        startTime: null,
        endTime: null,
        projectId: uni.getStorageSync('projectId')
      },
      rules: {
        meetingName: [{ required: true }],
        initiatorName: [{ required: true }],
        meetingSubject: [{ required: true }],
        meetingAddress: [{ required: true }],
        startTime: [{ required: true }],
        endTime: [{ required: true }],
        recorderId: [{ required: true }]
      }
    }
  },
  computed: {
    userList() {
      return _.unionBy(this.$store.state.userList, 'userId')
    },
    time: {
      get() {
        return this.form.startTime ? [this.form.startTime, this.form.endTime] : null
      },
      set(arr) {
        this.form.startTime = arr[0]
        this.form.endTime = arr[1]
      }
    }
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.refresh()
      this.$utils.setTitle('编辑会议')
    }
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'saveDraft') {
      this.save()
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.axios.system.get('systemMeeting/get/' + this.id).then(res => {
        res.data.attenderIds = res.data.attenderList
          .filter(e => e.attenderId)
          .map(e => e.attenderId)
          .join(',')
        res.data.attenderNames = res.data.attenderList
          .filter(e => e.attenderId)
          .map(e => e.attenderName)
          .join(',')
        res.data.extraAttender = res.data.attenderList
          .filter(e => !e.attenderId)
          .map(e => e.attenderName)
          .join(',')
        this.form = res.data
      })
    },
    async save(action = 'save') {
      await this.$refs.form.validate()
      let form = _.cloneDeep(this.form)
      if (form.attenderIds) {
        const ids = form.attenderIds.split(',')
        const names = form.attenderNames.split(',')
        form.attenderList = ids.map((id, index) => {
          return {
            attenderId: id,
            attenderName: names[index]
          }
        })
      }

      if (form.extraAttender) {
        if(!form.attenderList) form.attenderList = []
        form.attenderList.push(
          ...form.extraAttender
            .trim()
            .replace(/[,，.。;；:： ]/g, ',')
            .split(',')
            .filter(e => e)
            .map(attenderName => ({ attenderId: null, attenderName }))
        )
      }

      if (!form.attenderList.length) {
        this.$utils.showToast('参会人员必填')
        return false
      }

      this.axios.system.post('systemMeeting/' + action, form).then(res => {
        this.$utils.showToast('操作成功')
        setTimeout(() => {
          this.$utils.toUrl('/pages/project-approval-Epc/meeting-details?id=' + res.data, 2)
        }, 1000)
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.uni-card {
  width: 700px;
}
.main {
  padding: 15px 0;
}
</style>
