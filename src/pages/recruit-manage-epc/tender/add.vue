<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="招标公告名称" prop="name">
            <textarea v-model.trim="form.name" auto-height placeholder="请输入招标公告名称" />
          </uni-form-item>
          <uni-form-item label="招标公告编码" prop="code">
            <textarea v-model.trim="form.code" auto-height placeholder="请输入招标公告编码" />
          </uni-form-item>
          <uni-form-item label="招标类型" isLink prop="type">
            <uni-select v-model="form.type" :options="tenderTypeList"></uni-select>
          </uni-form-item>
          <uni-form-item label="招标方式" isLink prop="mode">
            <uni-select v-model="form.mode" :options="tenderModeList"></uni-select>
          </uni-form-item>
          <uni-form-item label="公告发布日期" isLink prop="publishDate">
            <uni-date-picker v-model="form.publishDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="投标截止日期" isLink prop="endDate">
            <uni-date-picker v-model="form.endDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="开标地点" prop="address">
            <textarea v-model.trim="form.address" auto-height placeholder="请输入开标地点" />
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息开始 -->
        <uni-card isForm>
          <uni-form-item label="备注" align="left" type="textarea" class="block-item" prop="remark">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件" prop="fileIds">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息结束 -->
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleTenderSubmit(true)">提交</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import Api from '../api'
export default {
  name: 'TenderEdit',
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        name: { required: true },
        code: { required: true },
        mode: { required: true },
        type: { required: true },
        publishDate: { required: true },
        endDate: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    tenderTypeList() {
      return this.$getArgList('tenderType')
    },
    tenderModeList() {
      return this.$getArgList('tenderMode')
    }
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    this.handleTenderSubmit(false)
  },
  methods: {
    async getDetail() {
      let res = await Api.getTenderDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
    },
    // 点击保存按钮
    async handleTenderSubmit(isSubmit) {
      // 开启表单验证
      await this.$refs.form.validate()
      let params = {
        ...this.form,
        publishDate: moment(this.form.publishDate).format('YYYY-MM-DD 00:00:00'),
        endDate: moment(this.form.endDate).format('YYYY-MM-DD 00:00:00')
      }
      this.isLoading = true
      isSubmit ? await Api.submitTender(params) : await Api.addTender(params)
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
</style>
