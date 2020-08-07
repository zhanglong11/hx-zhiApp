<template>
  <view class="main">
    <view class="main-body">
      <uni-card isForm>
        <uni-form-item label="任务编号" isCell align="left">
          {{ detail.wbsCode }}
        </uni-form-item>
        <uni-form-item label="任务名称" isCell align="left">
          {{ detail.name }}
        </uni-form-item>
        <uni-form-item label="父级任务" isCell align="left">
          {{ getTaskName(detail.parentTaskUniqueId) }}
        </uni-form-item>
        <uni-form-item label="前置任务" isCell align="left">
          {{ detail.preTaskName }}
        </uni-form-item>
        <uni-form-item label="计划开始时间" isCell align="left">
          {{ detail.planStartTime | ymd }}
        </uni-form-item>
        <uni-form-item label="计划结束时间" isCell align="left">
          {{ detail.planEndTime | ymd }}
        </uni-form-item>
        <uni-form-item label="计划工期(天)" isCell align="left">
          {{ detail.planDuration }}
        </uni-form-item>
        <uni-form-item label="责任人" isCell align="left">
          {{ detail.principalName }}
        </uni-form-item>
      </uni-card>
      <uni-card isForm>
        <uni-form-item label="创建人" isCell align="left">
          {{ detail.creatorName }}
        </uni-form-item>
        <uni-form-item label="创建时间" isCell align="left">
          {{ detail.createTime }}
        </uni-form-item>
        <uni-form-item label="实际开始时间" isCell align="left">
          {{ detail.actualStartTime }}
        </uni-form-item>
      </uni-card>
      <!-- 未填报按钮 start -->
      <view v-if="detail.status === 0" class="btn-wrapper">
        <button
          v-if="detail.status === 0 && $hasPower('ProjectPlanStartEpc')"
          class="button"
          type="primary"
          :loading="isLoading"
          @click="submitStart()"
        >
          开始
        </button>
        <button v-if="$hasPower('ProjectPlanEditEpc')" class="button" type="default" @click="editItem()">编辑</button>
        <button v-if="$hasPower('ProjectPlanDeleteEpc')" class="button" type="warn" @click="deleteItem()">删除</button>
      </view>
      <!-- 未填报按钮 start -->

      <!-- 进度填报 start -->
      <template v-if="detail.status === 1 && $hasPower('ProjectPlanWriteLogEditEpc')">
        <uni-title title="填报记录">
          <button
            v-if="$hasPower('ProjectPlanWriteLogDetailEpc')"
            slot="extra"
            type="primary"
            class="button view-record"
            @click="showWriteLogs"
          >
            填报记录
          </button>
        </uni-title>
        <uni-card isForm>
          <uni-form-item label="实际结束时间" isLink>
            <uni-date-picker
              v-model="form.actualEndTime"
              fields="day"
              mode="date"
              placeholder="点击选择"
            ></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="实际工期(天)" isCell align="left">
            自动计算
          </uni-form-item>
          <uni-form-item label="进度情况">
            <input v-model.trim="form.remark" placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="当前进度(%)" isRequired>
            <input v-model.trim="form.actualProgress" placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="任务状态" isCell align="left">
            自动计算
          </uni-form-item>
          <uni-form-item label="附件">
            <uni-attachment v-model="form.fileIds" uploadType="image,other" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <view class="btn-wrapper">
          <button
            v-if="$hasPower('ProjectPlanWriteLogEditEpc')"
            class="button"
            type="primary"
            :loading="isLoading"
            @click="save()"
          >
            保存
          </button>
          <button
            v-if="$hasPower('ProjectPlanEndEpc')"
            class="button"
            type="warn"
            :loading="isLoading"
            @click="submitEnd()"
          >
            结束
          </button>
        </view>
      </template>
      <!-- 进度填报 end -->
      <!-- 填报结束 start -->
      <uni-title title="进度填报">
        <button
          v-if="$hasPower('ProjectPlanWriteLogDetailEpc')"
          slot="extra"
          type="primary"
          class="button view-record"
          @click="showWriteLogs"
        >
          填报记录
        </button>
      </uni-title>
      <uni-card v-if="detail.status === 2" isForm>
        <uni-form-item label="实际结束时间" isCell align="left">
          {{ detail.actualEndTime | ymd }}
        </uni-form-item>
        <uni-form-item label="实际工期(天)" isCell align="left">
          {{ detail.actualProgress }}
        </uni-form-item>
        <uni-form-item label="任务状态" isCell align="left">
          {{ statusText }}
        </uni-form-item>
      </uni-card>
      <!-- 填报结束 end -->
    </view>
    <uni-popup ref="popup">
      <div class="popup">
        <div>
          <h3>填报记录</h3>
          <t-table style="width: 650rpx;">
            <t-tr>
              <t-th>填报进度</t-th>
              <t-th>进度情况</t-th>
              <t-th>填报时间</t-th>
              <t-th>附件</t-th>
            </t-tr>
            <t-tr v-for="item in list" :key="item.id">
              <t-td>{{ item.currentProgress }}</t-td>
              <t-td>{{ item.remark }}</t-td>
              <t-td>{{ item.createTime | ymd }}</t-td>
              <t-td v-if="item.fileIds" class="link" @click.native="handleViewAttachment(item)">
                {{ item.fileIds.split(',').length + '个附件' }}
              </t-td>
              <t-td v-else>无</t-td>
            </t-tr>
          </t-table>
        </div>
      </div>
    </uni-popup>
    <uni-popup ref="attachmentDialog">
      <div class="attachment-dialog">
        <uni-attachment
          :value="activeWriteLog.fileIds + activeWriteLog.fileIds + activeWriteLog.fileIds + activeWriteLog.fileIds"
        ></uni-attachment>
      </div>
    </uni-popup>
  </view>
</template>

<script>
import moment from 'moment'
import tTable from '@/components/t-table/t-table'
import tTh from '@/components/t-table/t-th'
import tTr from '@/components/t-table/t-tr'
import tTd from '@/components/t-table/t-td'
export default {
  name: 'ControlPlanAdd',
  components: {
    tTable,
    tTh,
    tTr,
    tTd
  },
  data() {
    return {
      id: '',
      // 表单数据
      detail: {},
      /**
       * 正在查看附件的填报记录
       */
      activeWriteLog: {},
      isLoading: false,
      form: {
        taskId: null
      },
      list: [] // 填报记录
    }
  },
  computed: {
    flatList() {
      return this.$store.state.projectEpc.flatList
    },
    statusText() {
      if (this.detail.actualEndTime) {
        let item = this.detail
        let PS = item.planStartTime.slice(0, 10)
        let PE = item.planEndTime.slice(0, 10)
        let today = moment().format('YYYY-MM-DD')
        if ([1, 2].includes(item.status)) {
          let AS = item.actualStartTime.slice(0, 10)
          if (item.status === 1) {
            if (AS > PS) {
              return '延期开始'
            } else if (AS < PS) {
              return '提前开始'
            } else {
              return '正常开始'
            }
          } else if (item.status === 2) {
            let AE = item.actualEndTime.slice(0, 10)
            if (AE < PE) {
              return '提前结束'
            } else if (AE > PE) {
              return '延期结束'
            } else {
              return '正常结束'
            }
          }
        } else {
          if (today > PS) {
            return '已延期'
          } else {
            return '未开始'
          }
        }
      }
      return ''
    }
  },
  onLoad(option) {
    this.id = option.id
    this.form.taskId = this.id
  },
  async onShow() {
    await this.refresh()
    this.getWriteLog()
  },
  watch: {
    status(val) {
      this.setTitle()
    }
  },
  methods: {
    // 初始化
    async refresh() {
      await this.axios.schedule.get('epc/task/get/' + this.id).then(res => {
        this.detail = res.data
      })
      this.setTitle()
    },
    // 获取填报记录
    getWriteLog() {
      this.axios.schedule
        .post('epc/task/reportList', {
          taskUniqueId: this.detail.taskUniqueId,
          projectId: uni.getStorageSync('projectId'),
          page: 1,
          rows: 1000
        })
        .then(res => {
          this.list = res.data.records
        })
    },
    // 动态设置标题
    setTitle() {
      if (this.detail.status === 0 || this.detail.status === 1) {
        this.$utils.setTitle('任务填报')
      } else {
        this.$utils.setTitle('任务详情')
      }
    },
    // 编辑任务
    editItem() {
      this.$utils.toUrl(`/pages/project-approval-Epc/control-plan-add?id=${this.id}`)
    },
    // 删除任务
    deleteItem() {
      uni.showModal({
        title: '提示',
        content: '确定要删除当前任务？',
        success: e => {
          if (e.confirm) {
            this.$store.dispatch('projectEpc/remove', this.detail)
            this.$utils.showToast('删除成功')
            setTimeout(() => {
              this.goBack()
            }, 1500)
          }
        }
      })
    },
    // 保存
    save() {
      if (!this.form.actualProgress) {
        this.$utils.showToast('当前进度必填')
        return false
      }
      this.isLoading = true
      this.axios.schedule
        .post('epc/task/report', {
          ...this.form,
          taskId: this.id
        })
        .then(res => {
          this.$utils.showToast('保存成功')
          setTimeout(() => {
            this.goBack()
          }, 1500)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    submitStart() {
      this.axios.schedule
        .post('epc/task/start', { actualStartTime: moment().format('YYYY-MM-DD HH:mm:ss'), taskId: this.detail.id })
        .then(res => {
          this.$utils.showToast('开始任务成功')
          this.refresh()
        })
    },
    submitEnd() {
      if (!this.form.actualEndTime) {
        this.$utils.showToast('实际结束时间必填')
        return false
      }
      this.axios.schedule
        .post('epc/task/finish', { actualEndTime: moment().format('YYYY-MM-DD HH:mm:ss'), taskId: this.detail.id })
        .then(res => {
          this.$utils.showToast('结束任务成功')
          this.refresh()
        })
    },
    // 返回
    goBack() {
      this.$utils.goBack()
    },
    getTaskName(id) {
      return _.find(this.flatList, { taskUniqueId: id })?.name ?? ''
    },
    showWriteLogs() {
      this.$refs.popup.open()
    },
    /**
     * 查看附件弹窗
     * @param {Object} item 填报记录
     */
    handleViewAttachment(item) {
      this.activeWriteLog = item
      this.$refs.attachmentDialog.open()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/common.less';
.main-body {
  padding: 0 30px 30px;
}
.view-record {
  line-height: 2 !important;
  font-size: 12px;
  display: flex !important;
  align-items: center;
}
.btn-wrapper {
  display: flex;
  .button {
    flex: 1;
  }
}
.popup {
  font-size: 0;
  background-color: #fff;
  padding: 25px;
  h3 {
    font-size: 16px;
    line-height: 1;
    margin-bottom: 25px;
    font-weight: normal;
    text-align: center;
  }
}
.attachment-dialog {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 500px;
  padding: 18px;
  overflow: auto;
}
.link {
  color: @mainColor;
}
</style>
