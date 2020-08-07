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
      <!--草稿编辑状态-->
      <view v-if="userType.includes('1') && form.auditStatus === 0 && isEdit">
        <uni-form-custom ref="signForm" :model="signForm" :rules="signRules">
          <uni-card isForm>
            <uni-form-item label="签署日期" isLink prop="confirmTime">
              <uni-date-picker v-model="signForm.confirmTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="备注" align="right" class="block-item" prop="remark">
              <textarea v-model.trim="signForm.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
          </uni-card>
          <uni-card title="附件信息" isForm>
            <uni-form-item class="file-item" label="上传附件" prop="fileId">
              <uni-attachment v-model="signForm.fileId" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleSubmit(true)">提交</button>
        </view>
      </view>
      <!--草稿详情状态-->
      <view v-if="!isEdit">
        <uni-form-custom ref="form">
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
            <uni-form-item class="file-item" label="上传附件" prop="fileIds">
              <uni-attachment v-model="form.fileId"></uni-attachment>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
      </view>
      <view v-if="[2, 3].includes(form.auditStatus)">
        <uni-card title="审核结果">
          <uni-form-item label="审核结果" :border="false">
            <view class="disabled"> {{ ['通过', '驳回'][form.auditStatus - 2] }}</view>
          </uni-form-item>
          <uni-form-item label="审核人" :border="false"
            ><view class="disabled">{{ form.principalName }}</view></uni-form-item
          >
          <uni-form-item label="审核意见">
            <view class="placeholder">{{ form.auditOpinion }}</view>
          </uni-form-item>
          <uni-form-item label="审核日期" :border="false">
            <view class="disabled">{{ form.auditSubmitTime | ymd }}</view>
          </uni-form-item>
        </uni-card>
      </view>
      <!--        驳回后修改-->
      <view v-if="userType.includes('1') && [3].includes(form.auditStatus)">
        <uni-form-custom ref="signForm" :model="signForm" :rules="signRules">
          <uni-card isForm>
            <uni-form-item label="签署日期" isLink prop="confirmTime">
              <uni-date-picker v-model="signForm.confirmTime" fields="day" mode="date"></uni-date-picker>
            </uni-form-item>
            <uni-form-item label="备注" align="left" class="block-item" prop="remark">
              <textarea v-model.trim="signForm.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
            </uni-form-item>
          </uni-card>
          <uni-card title="附件信息" isForm>
            <uni-form-item class="file-item" label="上传附件" prop="fileId">
              <uni-attachment v-model="signForm.fileId" edit></uni-attachment>
            </uni-form-item>
          </uni-card>
        </uni-form-custom>
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleSubmit(true)">提交</button>
        </view>
      </view>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
export default {
  name: 'Detail',
  data() {
    return {
      id: '',
      userType: '',
      isEdit: false,
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
      signForm: {
        confirmTime: '',
        fileId: ''
      },
      signRules: {
        confirmTime: { required: true },
        fileId: { required: true }
      }
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userName'])
  },
  onLoad(options) {
    this.id = options.id || ''
    this.userType = options.userType || ''
    if (this.id) {
      this.getDetail()
    }
  },
  onReady() {},
  onNavigationBarButtonTap(obj) {
    if (this.isEdit) {
      this.isEdit = false
      this.handleSubmit(false)
    } else {
      this.isEdit = true
    }
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let res = await Api.getParentTaskDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
      this.signForm = {
        confirmTime: res.data.confirmTime,
        remark: res.data.remark,
        fileId: res.data.fileId
      }
      console.log(res.data.auditStatus)
      if (res.data.auditStatus !== 0) {
        this.isEdit = false
      }
      if (this.userType.includes('1') && res.data.auditStatus === 0) {
        this.isEdit = true
      }
      if (this.userType.includes('1')) {
        // #ifdef  APP-PLUS
        if (res.data.auditStatus === 0) {
          let webView = this.$mp.page.$getAppWebview()
          if (this.isEdit) {
            webView.setTitleNViewButtonStyle(0, {
              text: '暂存',
              fontSize: 14,
              color: 'white',
              key: 'save'
            })
          } else {
            webView.setTitleNViewButtonStyle(0, {
              text: '\ue60e',
              fontSize: 27,
              color: 'white',
              fontSrc: '/static/fonts/iconfont.ttf',
              key: 'edit'
            })
          }
        }
        // #endif
      }
    },
    // 点击保存按钮
    async handleSubmit(isSubmit) {
      // 开启表单验证
      await this.$refs.signForm.validate()
      let params = {
        ...this.form,
        ...this.signForm,
        id: this.id,
        type: 1,
        confirmTime: this.moment(this.signForm.confirmTime).format('YYYY-MM-DD 00:00:00')
      }
      this.isLoading = true
      isSubmit ? await Api.submitFileArchive(params) : await Api.submitFileArchive(params)
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
@import url('detail.less');
</style>
