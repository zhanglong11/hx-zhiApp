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
            <view class="disabled">{{ form.executorName }}</view>
          </uni-form-item>
        </uni-card>
        <!--        驳回后修改  或修改-->
        <view v-if="form2.auditStatus === 2 || form2.auditStatus === 3">
          <uni-card title="审核结果">
            <uni-form-item label="审核结果" :border="false">
              <view class="disabled"> {{ form2.auditStatus === 2 ? '通过' : '驳回' }}</view>
            </uni-form-item>
            <uni-form-item label="审核人" :border="false"
              ><view class="disabled">{{ form2.auditName }}</view></uni-form-item
            >
            <uni-form-item label="审核意见">
              <view class="placeholder">{{ form2.auditOpinion }}</view>
            </uni-form-item>
            <uni-form-item label="审核日期" :border="false">
              <view class="disabled">{{ form2.auditTime | ymd }}</view>
            </uni-form-item>
          </uni-card>
        </view>
        <uni-card v-if="status !== 0" isForm>
          <uni-form-item class="file-item" label="附件" prop="fileIds">
            <uni-attachment
              v-model="form2.fileId"
              :edit="[0, 3].includes(form2.auditStatus) || status === 1"
            ></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!--        如果需要进度填报-->
        <view v-if="status === 1 || form2.auditStatus === 3">
          <view class="card-title-outer">
            <view class="title">
              <view>进度计划</view>
              <uni-icons
                class="icon"
                color="#2EB04C"
                type="plus-filled"
                size="24"
                @click="handleAddProcess"
              ></uni-icons>
            </view>
          </view>
          <block>
            <view class="cardOuter">
              <block v-for="(item, index) in paramDTOList" :key="index">
                <uni-form-custom :ref="'process' + index" :model="item" :rules="subRules" style="margin:10px 0">
                  <uni-card>
                    <icon
                      v-if="[0, 3].includes(form2.auditStatus)"
                      class="icon-clear"
                      type="clear"
                      size="26"
                      @click="handleDeleteItem(index)"
                    />
                    <uni-form-item label="序号">
                      <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                    </uni-form-item>
                    <uni-form-item label="进度内容" isRequired prop="content">
                      <input v-model.trim="item.content" class="uni-input" placeholder="请输入进度内容" />
                    </uni-form-item>
                    <uni-form-item label="填写时间">
                      <view class="disabled">{{ item.createTime }}</view>
                    </uni-form-item>
                  </uni-card>
                </uni-form-custom>
              </block>
            </view>
          </block>
          <view class="btn-wrapper">
            <button class="button" type="primary" @click="handleSubmit(true)">提交审核</button>
          </view>
        </view>
        <view v-if="form2.auditStatus === 2">
          <view class="card-title-outer">
            <view class="title">
              <view>进度计划</view>
            </view>
          </view>
          <view class="cardOuter">
            <uni-card v-for="(item, index) in form2.paramDTOList" :key="index">
              <uni-form-item label="序号">
                <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
              </uni-form-item>
              <uni-form-item label="进度内容" isRequired prop="content">
                <view class="disabled">{{ item.content }}</view>
              </uni-form-item>
              <uni-form-item label="填写时间">
                <view class="disabled">{{ item.createTime }}</view>
              </uni-form-item>
            </uni-card>
          </view>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
import moment from 'moment'
export default {
  name: 'ProgressReport',
  data() {
    return {
      id: '',
      pid: '',
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
      fileIds: ''
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  onLoad(options) {
    this.id = options.id || ''
    this.pid = options.pid || ''
    this.id = options.id || ''
    if (this.pid && this.id) {
      this.getDetail()
    }
  },
  onReady() {},
  onNavigationBarButtonTap() {
    if (this.status === 0) {
      this.handleStart()
    } else {
      this.handleSubmit(false)
    }
  },
  methods: {
    async getDetail() {
      let res = await Api.getParentTaskDetail(this.pid)
      let res2 = await Api.getChildTaskDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
      this.form2 = { ...res2.data, projectId: this.projectId }
      this.paramDTOList = this.form2.paramDTOList || []
      this.status = this.form2.taskStatus
      // #ifdef  APP-PLUS
      if (this.status === 1) {
        let webView = this.$mp.page.$getAppWebview()
        webView.setTitleNViewButtonStyle(0, {
          text: '保存',
          fontSize: 14,
          key: 'save'
        })
      }
      // #endif
    },
    handleAddProcess() {
      let obj = {
        content: '',
        createTime: this.moment().format('YYYY-MM-DD HH:mm:ss')
      }
      this.paramDTOList.push(obj)
    },
    handleDeleteItem(index) {
      this.paramDTOList.splice(index, 1)
    },
    async handleStart() {
      await Api.handleStart(this.id)
      await this.getDetail()
    },
    // 点击保存按钮
    async handleSubmit(isSubmit) {
      await Promise.all(
        this.paramDTOList.map((item, index) => {
          return this.$refs['process' + index][0].validate()
        })
      )
      let params = {
        preTaskId: this.id,
        paramDTOList: this.paramDTOList,
        fileId: this.form2.fileId
      }
      this.isLoading = true
      console.log(params)
      // return
      isSubmit ? await Api.submitProcess(params) : await Api.addProcess(params)
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
