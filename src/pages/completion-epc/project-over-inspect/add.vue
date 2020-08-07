<template>
  <view class="main">
    <div class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="验收名称" prop="name">
            <textarea v-model.trim="form.name" auto-height placeholder="请输入验收名称" />
          </uni-form-item>
          <uni-form-item label="验收范围" prop="acceptanceScope">
            <textarea v-model.trim="form.acceptanceScope" auto-height placeholder="请输入验收范围" />
          </uni-form-item>
          <uni-form-item label="计划验收日期" prop="planAcceptanceTime">
            <uni-date-picker v-model="form.planAcceptanceTime" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="组织单位" prop="organizer">
            <textarea v-model.trim="form.organizer" auto-height placeholder="请输入组织单位" />
          </uni-form-item>
          <uni-form-item label="参加单位" prop="participant">
            <textarea v-model.trim="form.participant" auto-height placeholder="请输入验收范围" />
          </uni-form-item>
          <uni-form-item label="负责人" isLink prop="principalId">
            <uni-select-user v-model="form.principalId" :name.sync="form.principalName" placeholder="请选择" />
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息开始 -->
        <uni-card isForm>
          <uni-form-item label="备注" align="left" class="block-item" prop="remark">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="竣工验收申请附件" prop="acceptanceFileId">
            <uni-attachment v-model="form.acceptanceFileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息结束 -->
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleInspectSubmit(true)">提交</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import Api from '../api/inspect'
export default {
  name: 'OverInspectEdit',
  data() {
    return {
      id: null,
      isLoading: false,
      baseInfo: {},
      form: {
        projectId: wx.getStorageSync('projectId') //复检
      },
      rules: {
        name: { required: true },
        acceptanceScope: { required: true },
        planAcceptanceTime: { required: true },
        organizer: { required: true },
        participant: { required: true },
        principalId: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    this.handleInspectSubmit(false)
  },
  methods: {
    async getDetail() {
      let res = await Api.getDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
    },
    // 点击保存按钮
    async handleInspectSubmit(isSubmit) {
      // 开启表单验证
      await this.$refs.form.validate()
      let params = {
        ...this.form,
        optType: isSubmit ? 2 : 1,
        type: 2, //竣工
        planAcceptanceTime: moment(this.form.planAcceptanceTime).format('YYYY-MM-DD 00:00:00')
      }
      this.isLoading = true
      this.id ? await Api.update(params) : await Api.add(params)
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.isLoading = true
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
.file-item /deep/ .form-label {
  max-width: 120px;
  min-width: unset;
}
</style>
