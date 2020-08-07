<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="任务名称" prop="name">
            <textarea v-model.trim="form.name" auto-height placeholder="请输入资料名称" />
          </uni-form-item>
          <!-- <uni-form-item label="资料提供者" isLink isRequired prop="executorId">
            <uni-select-user v-model="form.executorId" :name.sync="form.executorName" placeholder="请选择资料提供者" />
          </uni-form-item>-->
          <uni-form-item label="操作人" isLink isRequired prop="executorId">
            <uni-select-user v-model="form.executorId" :name.sync="form.executorName" placeholder="请选择操作人" />
          </uni-form-item>
          <uni-form-item label="计划开始时间" isLink prop="planStartTime">
            <uni-date-picker v-model="form.planStartTime" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="计划结束时间" isLink prop="planEndTime">
            <uni-date-picker v-model="form.planEndTime" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="工期(天)">
            <view>{{
              (form.planStartTime &&
                form.planEndTime &&
                moment(form.planEndTime).diff(moment(form.planStartTime), 'days')) + 1 || '-'
            }}</view>
          </uni-form-item>
          <uni-form-item label="执行人">
            <view>{{ principalName }}</view>
          </uni-form-item>
          <uni-form-item label="文件是否归档" isLink isRequired prop="archiveFlag">
            <uni-select
              v-model="form.archiveFlag"
              :options="[
                { label: '是', value: 1 },
                { label: '否', value: 0 }
              ]"
            ></uni-select>
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息开始 -->
        <uni-card isForm>
          <uni-form-item label="备注" align="left" class="block-item" prop="remark">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息结束 -->
        <view class="btn-wrapper">
          <!--          <button class="button" :disabled="isLoading" type="primary" @click="handleChildTaskSubmit(true)">保存</button>-->
          <button class="button" type="primary" @click="handleChildTaskSubmit(false)">提 交</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
export default {
  name: 'AddChild',
  data() {
    return {
      id: '',
      pid: '',
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        name: { required: true },
        executorId: { required: true },
        planStartTime: { required: true },
        planEndTime: { required: true }
      },
      principalName: '' //执行人信息，取申报文件的执行人
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
    this.pid = options.pid || ''
    if (this.id) {
      this.getDetail()
    }
    if (this.pid) this.getParentInfo()
  },
  onNavigationBarButtonTap(obj) {
    this.handleChildTaskSubmit(false)
  },
  methods: {
    async getDetail() {
      let res = await Api.getChildTaskDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
    },
    // 获取申报文件信息
    async getParentInfo() {
      let res = await Api.getParentTaskDetail(this.pid)
      this.principalName = (res.data && res.data.executorName) || ''
    },
    // 点击保存按钮
    async handleChildTaskSubmit(isSubmit) {
      // 开启表单验证
      await this.$refs.form.validate()
      let params = {
        ...this.form,
        pid: this.pid,
        planStartTime: this.moment(this.form.planStartTime).format('YYYY-MM-DD 00:00:00'),
        planEndTime: this.moment(this.form.planEndTime).format('YYYY-MM-DD 00:00:00'),
        duration: this.moment(this.form.planEndTime).diff(this.moment(this.form.planStartTime), 'days') + 1
      }
      this.isLoading = true
      isSubmit ? await Api.submitChildTask(params) : await Api.addChildTask(params)
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.isLoading = false
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('addChild.less');
</style>
