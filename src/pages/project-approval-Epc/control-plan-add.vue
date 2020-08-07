<template>
  <view class="main">
    <view class="main-body">
      <uni-form-custom ref="form" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="任务编号" align="left">
            {{ form.wbsCode }}
          </uni-form-item>
          <uni-form-item label="任务名称" isRequired prop="name">
            <input v-model.trim="form.name" placeholder="请输入内容" />
          </uni-form-item>
          <uni-form-item label="父级任务" isLink>
            <div @click="handleSelectParentClick">{{ parentTask ? parentTask.name : '请选择' }}</div>
            <!--          <uni-select v-model="form.parentTask" :options="parentTask" placeholder="点击选择"></uni-select>-->
          </uni-form-item>
          <uni-form-item label="前置任务" isLink>
            <div @click="handleSelectPreClick">
              {{ preTasks.length ? preTasks.map(e => e.name).join(',') : '请选择' }}
            </div>
            <!--          <uni-select v-model="form.frontTask" :options="frontTask" placeholder="点击选择"></uni-select>-->
          </uni-form-item>
          <uni-form-item label="计划开始时间" prop="planStartTime" isLink>
            <uni-date-picker
              v-model="form.planStartTime"
              fields="day"
              mode="date"
              placeholder="点击选择"
            ></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="计划结束时间" prop="planEndTime" isLink>
            <uni-date-picker
              v-model="form.planEndTime"
              fields="day"
              mode="date"
              value-format="YYYY-MM-DD 23:59:59"
              placeholder="点击选择"
            ></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="计划工期(天)" align="left">
            {{ form.planDuration }}
          </uni-form-item>
          <uni-form-item label="责任人" isLink isRequired prop="principalId">
            <uni-select-user v-model="form.principalId" :name.sync="form.principalName" placeholder="点击选择" />
          </uni-form-item>
          <view class="btn-wrapper">
            <button class="button" type="primary" :loading="isLoading" @click="save()">保存</button>
          </view>
        </uni-card>
      </uni-form-custom>
      <uni-drawer-custom ref="selectParent" :width="600" @submit="handleParentSelected">
        <uni-tree
          ref="selectParentTree"
          :props="{ label: item => item.wbsCode + ' ' + item.name }"
          showRadio
          :tree-data="treeData"
          node-key="id"
        >
        </uni-tree>
      </uni-drawer-custom>
      <uni-drawer-custom ref="selectPre" :width="600" title="选择任务" @submit="handlePreSelected">
        <uni-tree
          ref="selectPreTree"
          checkStrictly
          :props="{ label: item => item.wbsCode + ' ' + item.name }"
          showCheckbox
          :tree-data="treeData"
          node-key="id"
        >
        </uni-tree>
      </uni-drawer-custom>
    </view>
  </view>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'ControlPlanAdd',
  data() {
    return {
      id: '',
      // 表单数据
      form: {
        type: 2,
        status: 0,
        wbsCode: null,
        name: '',
        planStartTime: '',
        planEndTime: '',
        parentTaskUniqueId: '',
        preTaskId: []
      },
      rules: {
        name: [{ required: true }],
        planDuration: [{ required: true }],
        planStartTime: [
          { required: true },
          {
            validator: (rule, val, callback) => {
              if (val) {
                if (!this.form.parentTaskUniqueId) {
                  for (let task of this.treeData) {
                    if (
                      task.taskUniqueId !== this.form.taskUniqueId &&
                      moment(val).isBefore(task.planEndTime, 'date') &&
                      moment(val).isAfter(task.planStartTime, 'date')
                    ) {
                      callback(new Error('与' + task.name + '时间有重叠'))
                    }
                  }
                } else {
                  let parent = _.find(this.flatList, { taskUniqueId: this.form.parentTaskUniqueId })
                  if (parent) {
                    if (
                      moment(val).isBefore(parent.planStartTime, 'date') ||
                      moment(val).isAfter(parent.planEndTime, 'date')
                    ) {
                      callback(new Error('时间必须在父任务范围之内'))
                    }
                  }
                }
              }
              callback()
            }
          }
        ],
        planEndTime: [
          { required: true },
          {
            validator: (rule, val, callback) => {
              if (moment(val).isBefore(this.form.planStartTime)) {
                callback(new Error('结束时间必须大于开始时间'))
              }
              if (!this.form.parentTaskUniqueId) {
                for (let task of this.treeData) {
                  if (
                    task.taskUniqueId !== this.form.taskUniqueId &&
                    moment(val).isBefore(task.planEndTime, 'date') &&
                    moment(val).isAfter(task.planStartTime, 'date')
                  ) {
                    callback(new Error('与任务') + task.name + '时间有重叠')
                  }
                }
              } else {
                let parent = _.find(this.flatList, { taskUniqueId: this.form.parentTaskUniqueId })
                if (parent) {
                  if (
                    moment(val).isBefore(parent.planStartTime, 'date') ||
                    moment(val).isAfter(parent.planEndTime, 'date')
                  ) {
                    callback(new Error('时间必须在父任务范围之内' + parent.planStartTime + '~' + parent.planEndTime))
                  }
                }
              }
              callback()
            }
          }
        ],
        principalId: [{ required: true }]
      },
      parentTask: null,
      preTasks: [],
      isLoading: false
    }
  },
  computed: {
    originList() {
      return this.$store.state.projectEpc.originList
    },
    flatList() {
      return this.$store.state.projectEpc.flatList
    },
    treeData() {
      return this.$store.state.projectEpc.treeData
    }
  },
  watch: {
    'form.parentTaskUniqueId'(val) {
      this.calculateWbsCode()
      if (!this.form.taskUniqueId) {
        const parent = _.find(this.originList, { taskUniqueId: val })
        const children = _.filter(this.originList, { parentTaskUniqueId: val })
        const prev = parent ? _.last(children) : _.last(this.treeData)
        if (prev) {
          this.form.planStartTime = moment(prev.planEndTime)
            .add(1, 'days')
            .format('YYYY-MM-DD 00:00:00')
          this.form.planEndTime = moment(prev.planEndTime)
            .add(1, 'days')
            .format('YYYY-MM-DD 23:59:59')
        } else if (parent) {
          this.form.planStartTime = moment(parent.planStartTime).format('YYYY-MM-DD 00:00:00')
          this.form.planEndTime = moment(parent.planEndTime).format('YYYY-MM-DD 23:59:59')
        }
      }
    },
    'form.planStartTime'(val) {
      if (val && !this.form.planEndTime) {
        this.form.planEndTime = val
      }
    },
    'form.planEndTime'(val) {
      if (val && this.form.planStartTime) {
        this.form.planDuration = moment(val).diff(this.form.planStartTime, 'days') + 1
      }
    }
  },
  async onLoad(option) {
    this.init(option)
  },
  mounted() {
    this.$refs.form.setRules(this.rules)
    if (!this.flatList.length) {
      this.$store.dispatch('projectEpc/getList')
    }
  },
  methods: {
    // 初始化
    init(option) {
      this.id = option.id || ''
      if (this.id) {
        this.axios.schedule.get('epc/task/get/' + this.id).then(res => {
          if (res.data.preTaskId && res.data.preTaskId !== '0')
            res.data.preTaskId = res.data.preTaskId.split(',').map(e => +e)
          else res.data.preTaskId = []
          if (this.form.parentTaskUniqueId) {
            this.parentTask = _.find(this.flatList, { taskUniqueId: this.form.parentTaskUniqueId })
          }
          this.form = res.data
        })
        this.$utils.setTitle('编辑任务')
      }
      if (_.size(this.treeData)) {
        this.form.planStartTime = moment(_.last(this.treeData).planEndTime)
          .add(1, 'days')
          .format('YYYY-MM-DD 00:00:00')
      }
      this.calculateWbsCode()
    },
    // 保存
    async save() {
      await this.$refs.form.validate()
      this.isLoading = true
      let form = _.cloneDeep(this.form)
      Object.assign(form, {
        projectId: uni.getStorageSync('projectId'),
        projectName: uni.getStorageSync('projectName')
      })
      if (_.size(form.preTaskId)) {
        form.preTaskCodes = form.preTaskId.map(id => _.find(this.flatList, { taskUniqueId: id }).name).join(',')
        form.preTaskId = form.preTaskId.join(',')
      } else {
        form.preTaskId = 0
      }
      if (!form.parentTaskUniqueId) form.parentTaskUniqueId = 0
      form.planStartTime = moment(form.planStartTime).format('YYYY-MM-DD 00:00:00')
      form.planEndTime = moment(form.planEndTime).format('YYYY-MM-DD 23:59:59')
      if (this.form.taskUniqueId) {
        this.$store.dispatch('projectEpc/edit', form).finally(() => {
          this.loading = false
          this.$utils.goBack()
        })
      } else {
        this.$store.dispatch('projectEpc/add', form).finally(() => {
          this.loading = false
          this.$utils.goBack()
        })
      }
    },
    // 返回
    goBack() {
      this.$utils.goBack()
    },
    async calculateWbsCode() {
      this.form.wbsCode = await this.$store.dispatch('projectEpc/calculateWbsCode', this.form)
    },
    handleSelectParentClick() {
      this.$refs.selectParent.open()
    },
    handleParentSelected() {
      const checkNodes = this.$refs.selectParentTree.getCheckedNodes()
      this.parentTask = checkNodes[0]
      this.form.parentTaskUniqueId = this.parentTask?.taskUniqueId ?? null
    },
    handleSelectPreClick() {
      this.$refs.selectPre.open()
    },
    handlePreSelected() {
      this.preTasks = this.$refs.selectPreTree.getCheckedNodes()
      this.form.preTaskId = _.map(this.preTasks, 'taskUniqueId')
    }
  }
}
</script>
<style lang="less" scoped>
.main-body {
  padding: 0 30px;
}
</style>
