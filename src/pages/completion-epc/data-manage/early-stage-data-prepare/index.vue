<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="swiperContainer">
        <view class="arrow" @click="handleClickLeft">
          <uni-font-awesome type="fa fa-chevron-left" color="#5dc4f5" size="25"></uni-font-awesome>
        </view>
        <view class="swiperWrapper">
          <swiper class="swiper" :current="current" @change="handleChange">
            <swiper-item v-for="(item, index) of parentTaskList" :key="index" :item-id="item.id">
              <view class="swiper-item" @click="handleParentTaskClick(item)">
                <h4>{{ item.name }}</h4>
                <p>报审单位:{{ item.reportingUnit }}</p>
                <p>负责人:{{ item.principalName }}</p>
              </view>
            </swiper-item>
          </swiper>
        </view>
        <view class="arrow" @click="handleClickRight">
          <uni-font-awesome type="fa fa-chevron-right" color="#5dc4f5" size="25"></uni-font-awesome>
        </view>
      </view>

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
                <!--<view>资料提供者：{{ item.code }}</view>-->
                <view>工期：{{ moment(item.planEndTime).diff(moment(item.planStartTime), 'days') }}天</view>
              </view>
              <block v-if="[0, 1].includes(item.taskStatus) && item.auditStatus === 0">
                <uni-status :options="taskStatus" :value="item.taskStatus"></uni-status>
              </block>
              <block v-else>
                <uni-status :options="auditStatus" :value="item.auditStatus"></uni-status>
              </block>
            </view>
            <view v-if="item.userType.includes(2)" class="card-footer  border-top">
              <block v-if="[0, 1].includes(item.auditStatus)">
                <text>执行人：{{ item.executorName }}</text>
                <text class="cardTimeValue">执行时间： {{ item.actualStartTime | formatData }}</text>
              </block>
              <block v-else>
                <text>审核人：{{ item.executorName }}</text>
                <text class="cardTimeValue">审核时间： {{ item.actualStartTime | formatData }}</text>
              </block>
            </view>
            <view v-else class="card-footer  border-top">
              <text>操作人：{{ item.executorName }}</text>
              <text class="cardTimeValue">操作时间： {{ item.actualStartTime | formatData }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
        <EmptyTemplate v-if="total === 0" />
      </view>
    </scroll-view>
    <view v-if="showAdd" class="typeSelect">
      <div @click="handleAddParentTask">新增申报文件</div>
      <div @click="handleAddChildTask">新增资料准备</div>
    </view>
    <uni-add @click.native="showAdd = !showAdd" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">审批状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.auditStatus" hasAll :options="auditStatus" />
        <h6 class="label">填报状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.taskStatus" hasAll :options="taskStatus" />
        <h6 class="label">参与人员</h6>
        <uni-select-user
          v-model="drawerForm.userIds"
          :name.sync="drawerForm.userName"
          :mode="2"
          multiple
        ></uni-select-user>
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
      currentTaskInfo: {},
      parentTaskList: [], //轮播图父级列表
      parentTaskList1: ['a', 'b'], //轮播图父级列表
      filterForm: {
        page: 1,
        rows: 10,
        projectId: wx.getStorageSync('projectId'),
        keyword: ''
      },
      drawerForm: {},
      loading: false,
      list: [],
      copyList: [],
      total: 0
    }
  },
  computed: {
    ...mapGetters(['projectId', 'userId'])
  },
  watch: {},
  created() {},
  onShow() {
    const value = uni.getStorageSync('current')
    this.current = value || 0
    this.getParentTaskList()
  },
  // 下拉刷新
  onPullDownRefresh() {},
  onNavigationBarButtonTap() {
    this.$refs.filterRef.open()
  },
  methods: {
    // 初始化
    init() {},
    //获取申报文件列表(父级)
    async getParentTaskList() {
      let res = await Api.getParentTaskList({ projectId: this.projectId, type: 2 })
      this.parentTaskList = res.data.records
      // this.current = this.current || 0
      await this.getChildTaskList()
    },
    async getChildTaskList() {
      this.currentParentId = this.parentTaskList[this.current].id
      this.currentTaskInfo = this.parentTaskList[this.current]
      let res = await Api.getChildTaskList(this.currentParentId)
      this.list = res.data
      this.copyList = res.data
      this.total = res.data.length
    },
    //swipper滑动事件
    async handleChange(event) {
      this.current = event.detail.current
      this.drawerForm = {}
      await this.getChildTaskList()
      uni.setStorageSync('current', this.current)
    },
    //切换子级
    async handleClickLeft() {
      if (this.current > 0) {
        this.current--
        //await this.getChildTaskList()
      } else {
        this.current = 0
      }
    },
    async handleClickRight() {
      if (this.current < this.parentTaskList.length - 1) {
        this.current++
        //await this.getChildTaskList()
      } else {
        this.current = this.parentTaskList.length - 1
      }
    },
    //新建申报文件
    handleAddParentTask() {
      this.showAdd = false
      this.$utils.toUrl('/pages/completion-epc/data-manage/early-stage-data-prepare/addParent')
    },
    //新建资料准备
    handleAddChildTask() {
      this.showAdd = false
      let that = this
      uni.showActionSheet({
        itemList: that.parentTaskList.map(item => item.name),
        success: function(res) {
          let parentId = that.parentTaskList[res.tapIndex].id
          that.$utils.toUrl(`/pages/completion-epc/data-manage/early-stage-data-prepare/addChild?pid=${parentId}`)
        },
        fail: function(res) {
          console.log(res.errMsg)
        }
      })
    },
    handleDrawerFormChange() {
      this.listFilter()
    },
    handleDrawerReset() {
      this.drawerForm = {}
      this.listFilter()
    },
    // 根据关键词筛选检查列表项
    handleSearchBarConfirm(e) {
      this.filterForm.keyword = e.value.trim()
      this.listFilter()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.listFilter()
    },
    listFilter() {
      //过滤条件
      this.list = this.copyList.filter(item => {
        return (
          item.name.includes(this.filterForm.keyword) &&
          (![null, undefined, ''].includes(this.drawerForm.auditStatus)
            ? this.drawerForm.auditStatus === item.auditStatus
            : true) &&
          (![null, undefined, ''].includes(this.drawerForm.taskStatus)
            ? this.drawerForm.taskStatus === item.taskStatus
            : true) &&
          (![null, undefined, ''].includes(this.drawerForm.userName)
            ? this.drawerForm.userName.includes(item.executorName)
            : true)
        )
      })
      this.total = this.list.length
    },
    //点击申报文件
    handleParentTaskClick(item) {
      this.$utils.toUrl(`/pages/completion-epc/data-manage/early-stage-data-prepare/parentDetail?id=${item.id}`)
    },
    handleItemClick(row) {
      let parentId = this.parentTaskList[this.current].id
      //操作人
      console.log('userType', row.userType, 'auditStatus', row.auditStatus)
      if (row.userType.includes(1)) {
        if (row.auditStatus === 0 || row.auditStatus === 3) {
          this.$utils.toUrl(
            `/pages/completion-epc/data-manage/early-stage-data-prepare/progressReport??id=${row.id}&pid=${parentId}&userType=1`
          )
          return
        }
      }
      //执行人/审核人
      if (row.userType.includes(2)) {
        if (row.taskStatus === 0) {
          this.$utils.toUrl(
            `/pages/completion-epc/data-manage/early-stage-data-prepare/childDetail?id=${row.id}&userType=2`
          )
          return
        }
        //待审核
        if ([1, 2, 3].includes(row.auditStatus)) {
          this.$utils.toUrl(
            `/pages/completion-epc/data-manage/early-stage-data-prepare/childAudit?id=${row.id}&pid=${parentId}`
          )
          return
        }
      }
      //游客
      this.$utils.toUrl(`/pages/completion-epc/data-manage/early-stage-data-prepare/childDetail?id=${row.id}`)
      // this.$utils.toUrl(
      //   `/pages/completion-epc/data-manage/early-stage-data-prepare/progressReport?id=${row.id}&pid=${parentId}`
      // )
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
