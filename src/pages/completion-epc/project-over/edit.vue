<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="项目移交名称" prop="transferName">
            <textarea v-model.trim="form.transferName" :maxlength="-1" placeholder="请输入内容" auto-height />
          </uni-form-item>
          <uni-form-item label="EPC单位" prop="transferUnit">
            <textarea v-model.trim="form.transferUnit" :maxlength="-1" placeholder="请输入内容" auto-height />
          </uni-form-item>
          <uni-form-item label="移交内容" align="left">
            <view class="disabled">{{ form.transferScope }}</view>
          </uni-form-item>
          <uni-form-item label="验收合格日期">
            <view class="disabled">{{ form.acceptancePassTime | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="接管单位">
            <view class="disabled">{{ form.takeOverUnit }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息开始 -->
        <uni-card isForm>
          <uni-form-item label="备注" align="left" class="block-item">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="移交附件" prop="fileIds">
            <uni-attachment v-model="form.fileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息结束 -->
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleTenderSubmit(true)">保存</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import Api from '../api/projectOver'
export default {
  name: 'DetailProjectOverEpc',
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        transferName: { required: true },
        transferUnit: { required: true }
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
    this.handleTenderSubmit(false)
  },
  methods: {
    async getDetail() {
      let res = await Api.getDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
    },
    // 点击保存按钮
    async handleTenderSubmit(isSubmit) {
      await this.$refs.form.validate()
      // 开启表单验证
      const { transferName, transferUnit, fileId, id, remark } = this.form
      let params = _.assign({
        transferName: transferName,
        transferUnit: transferUnit,
        fileId: fileId,
        id: id,
        remark: remark
      })
      this.isLoading = true
      await Api.getUpdate(params)
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.isLoading = true
        this.$utils.goBack(2)
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('edit.less');
</style>
