<template>
  <view class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <view class="main-body">
        <uni-card isForm>
          <!-- <uni-form-item label="工序序号">
            <view class="align-right">{{ formData.floorRule }}</view>
          </uni-form-item> -->
          <uni-form-item label="工序名称">
            <view class="align-right">{{ formData.mainProcedure }}</view>
          </uni-form-item>
          <uni-form-item label="工序阶段">
            <view class="align-right">{{ formData.constructStageName }}</view>
          </uni-form-item>
          <uni-form-item label="工序耗时">
            <view class="align-right">{{ formData.duration }}天</view>
          </uni-form-item>
          <uni-form-item label="工序备注">
            <view class="align-right">{{ formData.procedureRemark }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 计划开始时间和结束时间，不可编辑 -->
        <uni-card isForm>
          <uni-form-item label="计划开始时间">
            <view class="align-right">{{ formData.planStartTime | formatData }}</view>
          </uni-form-item>
          <uni-form-item label="计划结束时间">
            <view class="align-right">{{ formData.planEndTime | formatData }}</view>
          </uni-form-item>
        </uni-card>
        <!-- 实际开始时间和实际结束时间，可编辑 -->
        <uni-card isForm>
          <uni-form-item label="实际开始时间" isLink isRequired>
            <picker mode="date" start="2000-01-01" end="2999-12-30" :value="actualStartTime" @change="changeStartTime">
              <view class="uni-input align-right">{{ actualStartTime || '请选择' }}</view>
            </picker>
          </uni-form-item>
          <uni-form-item label="实际结束时间" isLink isRequired>
            <picker mode="date" start="2000-01-01" end="2999-12-30" :value="actualEndTime" @change="changeBindEndTime">
              <view class="uni-input align-right">{{ actualEndTime || '请选择' }}</view>
            </picker>
          </uni-form-item>
        </uni-card>
        <!-- 可编辑确认人 -->
        <uni-card isForm>
          <uni-form-item label="确认人">
            <view class="align-right">{{ confirmorName }}</view>
          </uni-form-item>
        </uni-card>
        <uni-card isForm>
          <uni-form-item label="备注" type="textarea" align="left">
            <textarea v-model="formData.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="上传附件">
            <uni-attachment v-model="formData.fileId" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <view class="btn-wrapper">
          <button class="button" type="primary" :loading="isLoading" @click="save()">保存</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { workingAPI } from '@/api/working'
export default {
  data() {
    return {
      actualEndTime: null,
      actualStartTime: null,
      isLoading: false,
      id: '',
      formData: {
        id: 0,
        configId: '',
        detailId: '',
        detailSort: 0,
        floorNum: 0,
        floorId: '',
        duration: 0,
        templateId: '',
        startTime: '',
        endTime: '',
        actualStartTime: '',
        actualEndTime: '',
        status: 0,
        fileId: '',
        remark: '',
        confirmorId: '',
        confirmorName: ''
      }
    }
  },
  onLoad(options) {
    this.id = options.id || ''
  },
  onShow() {
    this.init()
  },
  computed: {
    confirmorName() {
      return this.$store.state.user.userName
    }
  },
  methods: {
    // 初始化
    init() {
      this.getDetailsSchedule()
    },
    // 工序任务详情
    async getDetailsSchedule() {
      if (!this.id) {
        return
      }
      const result = await workingAPI.getDetailsSchedule(this.id)
      let datas = result.data
      this.formData = datas
    },
    // 实际开始时间改变
    changeStartTime(e) {
      let time = e.target.value
      // 当结束时间存在时，进行时间验证
      if (this.actualEndTime && new Date(this.actualEndTime).getTime() < new Date(time).getTime()) {
        // 实际结束时间较开始时间晚
        this.$utils.showToast('必须小于结束时间！')
        this.actualStartTime = null
        return
      }
      this.actualStartTime = time
      this.formData.actualStartTime = `${time} 00:00:00`
    },
    // 实际结束时间改变
    changeBindEndTime(e) {
      let time = e.target.value
      // 时间验证，结束时间不能较开始时间早
      if (this.actualStartTime && new Date(this.actualStartTime).getTime() > new Date(time).getTime()) {
        this.$utils.showToast('必须大于开始时间！')
        this.actualEndTime = null
        return
      }
      this.actualEndTime = time
      this.formData.actualEndTime = `${time} 23:59:59`
    },
    // 保存
    async save() {
      if (!this.formData.actualStartTime) {
        this.$utils.showToast('请选择实际开始时间！')
        return
      }
      if (!this.formData.actualEndTime) {
        this.$utils.showToast('请选择实际结束时间！')
        return
      }
      this.formData.confirmorName = this.confirmorName
      try {
        this.isLoading = true
        const result = await workingAPI.updateSchedule(this.formData)
        this.isLoading = false
        this.$utils.showToast('操作成功')
        this.$utils.goBack(2)
      } catch (e) {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./check.less');
</style>
