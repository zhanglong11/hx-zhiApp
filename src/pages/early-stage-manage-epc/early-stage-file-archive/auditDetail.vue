<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form">
        <uni-card isForm>
          <uni-form-item label="申报文件名称">
            <view class="disabled">{{ form.name }}</view>
          </uni-form-item>
          <uni-form-item label="报审单位">
            <view class="disabled">{{ form.reportingUnit }}</view>
          </uni-form-item>
          <uni-form-item label="执行人">
            <view class="disabled">{{ form.executorName }}</view>
          </uni-form-item>
          <uni-form-item label="负责人">
            <view class="disabled">{{ form.principalName }}</view>
          </uni-form-item>
          <uni-form-item label="注意事项">
            <view class="disabled">{{ form.precautions }}</view>
          </uni-form-item>
          <uni-form-item label="文件是否归档">
            <view class="disabled">{{ form.archiveFlag === 0 ? '否' : '是' }}</view>
          </uni-form-item>
          <uni-form-item label="创建人">
            <view class="disabled">{{ form.creatorName }}</view>
          </uni-form-item>
          <uni-form-item label="创建时间">
            <view class="disabled">{{ form.createTime }}</view>
          </uni-form-item>
        </uni-card>
      </uni-form-custom>
      <uni-card isForm>
        <uni-form-item label="签署日期" prop="auditOpinion">
          <view class="disabled">{{ form.confirmTime }}</view>
        </uni-form-item>
        <uni-form-item label="备注" prop="remark">
          <view class="disabled">{{ form.remark }}</view>
        </uni-form-item>
        <uni-form-item label="执行人" prop="remark">
          <view class="disabled">{{ form.executorName }}</view>
        </uni-form-item>
        <uni-form-item label="执行时间" prop="remark">
          <view class="disabled">{{ form.auditSubmitTime | ymd }}</view>
        </uni-form-item>
      </uni-card>
      <uni-card title="附件信息" isForm>
        <uni-form-item class="file-item" label="上传附件" prop="fileId">
          <uni-attachment v-model="form.fileId"></uni-attachment>
        </uni-form-item>
      </uni-card>
      <!--        驳回后修改-->
      <view v-if="[2, 3].includes(form.auditStatus)">
        <uni-card title="审核结果">
          <uni-form-item label="审核结果" :border="false">
            <view class="disabled"> {{ ['通过', '驳回'][form.auditStatus - 2] }}</view>
          </uni-form-item>
          <uni-form-item label="审核人" :border="false"
            ><view class="disabled">{{ form.principalName }}</view>
          </uni-form-item>
          <uni-form-item label="审核意见">
            <view class="placeholder">{{ form.auditOpinion }}</view>
          </uni-form-item>
          <uni-form-item label="审核日期" :border="false">
            <view class="disabled">{{ form.auditSubmitTime | ymd }}</view>
          </uni-form-item>
        </uni-card>
      </view>
      <view v-if="[1].includes(form.auditStatus)">
        <uni-form-custom ref="auditForm" :model="auditForm" :rules="auditRules">
          <uni-card isForm>
            <uni-form-item label="审核结果" isLink isRequired prop="auditStatus">
              <uni-select
                v-model="auditForm.auditResult"
                :options="[
                  { label: '通过', value: 1 },
                  { label: '不通过', value: 0 }
                ]"
              ></uni-select>
            </uni-form-item>
            <uni-form-item label="审核意见" prop="auditOpinion">
              <textarea v-model.trim="auditForm.auditOpinion" :maxlength="-1" auto-height placeholder="点击输入" />
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleAudit">提交审核</button>
        </view>
      </view>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
import moment from 'moment'
export default {
  name: 'AuditDetail',
  data() {
    return {
      id: '',
      status: null,
      auditStatus: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      form2: {
        projectId: wx.getStorageSync('projectId')
      },
      paramDTOList: [], //进度填报
      subRules: {
        content: { required: true }
      },
      auditForm: {
        auditOpinion: '',
        auditResult: ''
      },
      auditRules: {
        auditOpinion: { required: true },
        auditResult: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userName'])
  },
  onLoad(options) {
    this.id = options.id || ''
    if (this.id) {
      this.getDetail()
    }
  },
  onReady() {
    // #ifdef  APP-PLUS
    if (this.status === 0) {
      let webView = this.$mp.page.$getAppWebview()
      webView.setTitleNViewButtonStyle(0, {
        text: '暂存',
        fontSize: 14
      })
    }
    // #endif
  },
  onNavigationBarButtonTap(obj) {},
  methods: {
    async getDetail() {
      let res = await Api.getParentTaskDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
    },
    async handleAudit() {
      await this.$refs.auditForm.validate()
      this.auditForm.auditResult === 1
        ? await Api.passArchiveAudit({ ...this.auditForm, id: this.id })
        : await Api.rejectArchiveAudit({ ...this.auditForm, id: this.id })
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
@import url('detail.less');
</style>
