<template>
  <view class="main">
    <div class="main-body">
      <uni-card isForm>
        <uni-form-item label="申报文件名称">
          <view class="disabled">{{ info.name }}</view>
        </uni-form-item>
        <uni-form-item label="报审单位">
          <view class="disabled">{{ info.reportingUnit }}</view>
        </uni-form-item>
        <uni-form-item label="执行人">
          <view class="disabled">{{ info.executorName }}</view>
        </uni-form-item>
        <uni-form-item label="负责人">
          <view class="disabled">{{ info.principalName }}</view>
        </uni-form-item>
        <uni-form-item label="注意事项">
          <view class="disabled">{{ info.precautions }}</view>
        </uni-form-item>
        <uni-form-item label="文件是否归档">
          <view class="disabled">{{ info.archiveFlag === 0 ? '否' : '是' }}</view>
        </uni-form-item>
        <uni-form-item label="创建人">
          <view class="disabled">{{ info.creatorName }}</view>
        </uni-form-item>
        <uni-form-item label="创建时间">
          <view class="disabled">{{ info.createTime }}</view>
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button class="button" type="warn" @click="handleDelete">删除</button>
      </view>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
export default {
  name: 'ParentDetail',
  data() {
    return {
      id: '',
      isLoading: false,
      info: {}
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
    if (this.id) {
      this.getDetail()
    }
  },
  onNavigationBarButtonTap(obj) {
    this.$utils.toUrl(`/pages/completion-epc/data-manage/early-stage-data-prepare/addParent?id=${this.id}`)
  },
  methods: {
    async getDetail() {
      let res = await Api.getParentTaskDetail(this.id)
      this.info = { ...res.data }
    },
    // 点击删除按钮
    async handleDelete() {
      uni.showModal({
        title: '提示',
        content: '确定要删除？',
        success: async res => {
          if (res.confirm) {
            await Api.deleteParentTask(this.id)
            uni.setStorageSync('current', null)
            this.$utils.showToast('删除成功')
            this.$utils.goBack()
            // this.$utils.toUrl('/pages/completion-epc/data-manage/early-stage-data-prepare/index')
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
