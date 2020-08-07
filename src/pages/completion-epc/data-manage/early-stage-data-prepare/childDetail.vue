<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form">
        <uni-card isForm>
          <uni-form-item label="资料名称">
            <view class="disabled">{{ form.name }}</view>
          </uni-form-item>
          <uni-form-item label="操作人">
            <view class="disabled">{{ form.executorName }}</view>
          </uni-form-item>
          <uni-form-item label="计划开始时间">
            <view class="disabled">{{ form.planStartTime | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="计划结束时间">
            <view class="disabled">{{ form.planEndTime | ymd }}</view>
          </uni-form-item>
          <uni-form-item label="工期(天)">
            <view>{{ form.duration || '-' }}</view>
          </uni-form-item>
          <uni-form-item label="文件是否归档">
            <view class="disabled">{{ form.archiveFlag === 0 ? '否' : '是' }}</view>
          </uni-form-item>
          <uni-form-item label="执行人">
            <view>{{ form.principalName }}</view>
          </uni-form-item>
        </uni-card>
        <uni-card v-if="form.fileId" isForm>
          <uni-form-item class="file-item" label="附件" prop="fileIds">
            <uni-attachment v-model="form.fileId"></uni-attachment>
          </uni-form-item>
        </uni-card>
        <view v-if="form.paramDTOList">
          <view class="card-title-outer">
            <view class="title">
              <view>进度计划</view>
            </view>
          </view>
          <block>
            <block v-for="(item, index) in form.paramDTOList" :key="index">
              <uni-form-custom  :model="item"  style="margin:10px 0">
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
        <view v-if="userType.includes('2')" class="btn-wrapper">
          <button class="button" type="primary" @click="handleDelete">删除</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
export default {
  name: 'ChildDetail',
  data() {
    return {
      id: '',
      isLoading: false,
      userType: '',
      form: {
        projectId: wx.getStorageSync('projectId')
      }
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
    this.userType = options.userType || ''
    // console.log(this.userType)
    if (this.id) {
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(
      `/pages/completion-epc/data-manage/early-stage-data-prepare/addChild?id=${this.id}&pid=${this.form.pid}`
    )
  },
  methods: {
    async getDetail() {
      let res = await Api.getChildTaskDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
      // #ifdef  APP-PLUS
      if (this.auditStatus !== 0 || this.type === 0) {
        let webView = this.$mp.page.$getAppWebview()
        webView.setTitleNViewButtonStyle(0, {
          text: '',
          fontSize: 27,
          key: 'none'
        })
      }
      // #endif
    },
    // 点击删除
    async handleDelete() {
      uni.showModal({
        title: '提示',
        content: '确定要删除？',
        success: async res => {
          if (res.confirm) {
            await Api.deleteChildTask(this.id)
            this.$utils.showToast('删除成功')
            // this.$utils.goBack()
            this.$utils.toUrl('/pages/completion-epc/data-manage/early-stage-data-prepare/index')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('addChild.less');
</style>
