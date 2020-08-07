<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="申报文件名称" prop="name">
            <textarea v-model.trim="form.name" auto-height placeholder="请输入申报文件名称" />
          </uni-form-item>
          <uni-form-item label="报审单位" prop="reportingUnit">
            <textarea v-model.trim="form.reportingUnit" auto-height placeholder="请输入报审单位" />
          </uni-form-item>
          <uni-form-item label="执行人" isLink isRequired prop="executorId">
            <uni-select-user v-model="form.executorId" :name.sync="form.executorName" placeholder="请选择" />
          </uni-form-item>
          <uni-form-item label="负责人" isLink isRequired prop="principalId">
            <uni-select-user v-model="form.principalId" :name.sync="form.principalName" placeholder="请选择" />
          </uni-form-item>
          <uni-form-item label="注意事项" prop="precautions">
            <textarea v-model.trim="form.precautions" auto-height placeholder="请输入注意事项" />
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
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleParentSubmit(false)">保存</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
import regular from '@/lib/regular'
export default {
  name: 'AddParent',
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        name: [{ required: true }],
        reportingUnit: { required: true },
        executorId: { required: true },
        principalId: { required: true },
        precautions: { required: true },
        archiveFlag: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.$utils.setTitle('编辑申报文件')
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    this.handleParentSubmit(false)
  },
  methods: {
    async getDetail() {
      let res = await Api.getParentTaskDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
    },
    // 点击保存按钮
    async handleParentSubmit(isSubmit) {
      // 开启表单验证
      await this.$refs.form.validate()
      let params = {
        ...this.form,
        projectId: this.projectId,
        type: 2
      }
      this.isLoading = true
      let res
      if (this.id) {
        isSubmit
          ? await Api.submitParentTask(params).finally(() => {
              this.isLoading = false
            })
          : await Api.updateParentTask(params).finally(() => {
              this.isLoading = false
            })
      } else {
        res = isSubmit
          ? await Api.submitParentTask(params).finally(() => {
              this.isLoading = false
            })
          : await Api.addParentTask(params).finally(() => {
              this.isLoading = false
            })
      }
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        // this.$utils.goBack()
        if (this.id) {
          this.$utils.goBack(2)
          // this.$utils.toUrl('/pages/completion-epc/data-manage/early-stage-data-prepare/index')
        } else {
          this.$utils.goBack()
          // this.$utils.toUrl(`/pages/completion-epc/data-manage/early-stage-data-prepare/parentDetail?id=${res.data}`, 2)
        }
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('addParent.less');
</style>
