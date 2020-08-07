<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" :model="form">
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
      <uni-form-custom ref="form2" class="main-body" :model="form2">
        <uni-card isForm>
          <uni-form-item label="资料名称">
            <view class="disabled">{{ form2.name }}</view>
          </uni-form-item>
          <uni-form-item label="操作人">
            <view class="disabled">{{ form2.executorName }}</view>
          </uni-form-item>
          <uni-form-item label="计划开始时间">
            <view class="disabled">{{ form2.planStartTime }}</view>
          </uni-form-item>
          <uni-form-item label="计划结束时间">
            <view class="disabled">{{ form2.planEndTime }}</view>
          </uni-form-item>
          <uni-form-item label="工期(天)">
            <view class="disabled">{{ form2.duration || '-' }}</view>
          </uni-form-item>
          <uni-form-item label="执行人">
            <view class="disabled">{{ form2.principalName }}</view>
          </uni-form-item>
        </uni-card>
        <uni-card v-if="form2.fileId" isForm>
          <uni-form-item class="file-item" label="附件" prop="fileIds">
            <uni-attachment v-model="form2.fileId"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <view v-if="form2.paramDTOList.length">
          <view class="card-title-outer">
            <view class="title">
              <view>进度计划</view>
            </view>
          </view>
          <block>
            <block v-for="(item, index) in form2.paramDTOList" :key="index">
              <uni-form-custom :ref="'process' + index" :model="item" :rules="subRules" style="margin:10px 0">
                <uni-card>
                  <uni-form-item label="序号">
                    <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                  </uni-form-item>
                  <uni-form-item label="进度内容" isRequired prop="content">
                    <view class="disabled">{{ item.content }}</view>
                  </uni-form-item>
                  <uni-form-item label="填写时间">
                    <view class="disabled">{{ item.createTime }}</view>
                  </uni-form-item>
                  <!-- <uni-form-item class="file-item" label="附件" prop="fileIds">
                    <uni-attachment v-model="item.fileIds"></uni-attachment>
                  </uni-form-item>-->
                </uni-card>
              </uni-form-custom>
            </block>
          </block>
        </view>
      </uni-form-custom>
      <!--        驳回后修改-->
      <view v-if="[2, 3].includes(auditStatus)">
        <uni-card title="审核结果">
          <uni-form-item label="审核结果" :border="false">
            <view class="disabled"> {{ ['通过', '驳回'][auditStatus - 2] }}</view>
          </uni-form-item>
          <uni-form-item label="审核人" :border="false"
            ><view class="disabled">{{ form2.principalName }}</view></uni-form-item
          >
          <uni-form-item label="审核意见">
            <view class="placeholder">{{ form2.auditOpinion }}</view>
          </uni-form-item>
          <uni-form-item label="审核日期" :border="false">
            <view class="disabled">{{ form2.auditTime | ymd }}</view>
          </uni-form-item>
        </uni-card>
      </view>
      <view v-if="auditStatus === 1">
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
          <button class="button" :disabled="isLoading" type="primary" @click="handleAudit">审核</button>
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
  name: 'ChildAudit',
  data() {
    return {
      id: '',
      pid: '',
      auditStatus: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      form2: {
        projectId: wx.getStorageSync('projectId'),
        paramDTOList: []
      },
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
    this.pid = options.pid || ''
    if (this.pid && this.id) {
      this.getDetail()
    }
  },
  onReady() {
    // #ifdef  APP-PLUS
    if (this.status === 0) {
      let webView = this.$mp.page.$getAppWebview()
      webView.setTitleNViewButtonStyle(0, {
        text: '保存',
        fontSize: 14
      })
    }
    // #endif
  },
  onNavigationBarButtonTap(obj) {},
  methods: {
    async getDetail() {
      let res = await Api.getParentTaskDetail(this.pid)
      let res2 = await Api.getChildTaskDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
      this.form2 = { ...res2.data, projectId: this.projectId, paramDTOList: res2.data.paramDTOList || [] }
      this.auditStatus = this.form2.auditStatus
    },
    async handleAudit() {
      await this.$refs.auditForm.validate()
      this.auditForm.auditResult === 1
        ? await Api.passAudit({ id: this.id, auditOpinion: this.auditForm.auditOpinion })
        : await Api.rejectAudit({ id: this.id, auditOpinion: this.auditForm.auditOpinion })
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
@import url('addChild.less');
</style>
