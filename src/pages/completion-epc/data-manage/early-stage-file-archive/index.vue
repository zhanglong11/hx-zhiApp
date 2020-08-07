<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleItemClick(item)">
            <view class="card-body">
              <view
                class="card-info"
                :class="{
                  zero: item.auditStatus === 0,
                  one: item.auditStatus === 1,
                  two: item.auditStatus === 2,
                  three: item.auditStatus === 3
                }"
              >
                <view class="title">{{ item.name }}</view>
                <view>报审单位：{{ item.reportingUnit }}</view>
                <view>签署日期：{{ item.confirmTime | ymd }}</view>
<!--                <view>工期：{{ moment(item.planEndTime).diff(moment(item.planStartTime), 'days') }}天</view>-->
              </view>
              <block>
                <uni-status :options="auditStatus" :value="item.auditStatus"></uni-status>
              </block>
            </view>
            <view v-if="[0, 1].includes(item.auditStatus)" class="card-footer  border-top">
              <text>执行人：{{ item.executorName }}</text>
              <text>执行时间： {{ item.confirmTime || '-'  }}</text>
            </view>
            <view v-if="[2, 3].includes(item.auditStatus)" class="card-footer  border-top">
              <text>审核人：{{ item.executorName }}</text>
              <text>审核时间： {{ item.confirmTime || '-' }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
        <EmptyTemplate v-if="total === 0" />
      </view>
    </scroll-view>
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">审批状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.auditStatus" hasAll :options="auditStatus" />
        <h6 class="label">参与人员</h6>
        <uni-select-user v-model="drawerForm.userIds" :mode="2" multiple></uni-select-user>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
import taskStatus from '../lib/taskStatus'
import auditStatus from '../lib/auditStatus'
import _ from 'lodash'
export default {
  data() {
    return {
      taskStatus,
      auditStatus,
      showAdd: false, //右下角点击弹窗
      current: 0,
      currentParentId: '',
      parentTaskList: [], //轮播图父级列表
      filterForm: {
        page: 1,
        rows: 10,
        archiveFlag: 1,
        projectId: wx.getStorageSync('projectId'),
        keyword: ''
      },
      drawerForm: {},
      loading: false,
      list: [],
      total: 0
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {},
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  methods: {
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getParentTaskList({ ...data, projectId: this.projectId, type: 2 })
      this.list.push(...res.data.records)
      this.total = res.data.total
      this.loading = false
    }, 100),
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.keyword = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    handleItemClick(row) {
      if (row.userType.includes(2)) {
        if (row.auditStatus !== 0) {
          this.$utils.toUrl(`/pages/completion-epc/data-manage/early-stage-file-archive/auditDetail?id=${row.id}`)
          return
        }
      }
      this.$utils.toUrl(
        `/pages/completion-epc/data-manage/early-stage-file-archive/detail?id=${row.id}&userType=${row.userType}`
      )
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
