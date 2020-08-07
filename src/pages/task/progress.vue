<template>
  <view class="main is-white">
    <div class="search-wrap-primary">
      <uni-search-bar placeholder="搜索" type="primary" @input="changeKeyWords"></uni-search-bar>
    </div>
    <div class="header-line"></div>
    <scroll-view class="scroll-roll" scroll-y>
      <div class="main-body">
        <view
          v-for="(item, i) in computedList"
          :key="i"
          class="card"
          :class="{ waiting: item.status === 0, finished: item.status === 3 }"
          @click="toDetails(item)"
        >
          <view class="card-body">
            <span v-if="item.tbcCount > 0" class="confirmed"></span>
            <view class="flex-item floor-info">
              {{ item.entityName }}
            </view>
            <!-- 进行中/待确认 start -->
            <template v-if="item.status > 0 && item.status < 3">
              <view class="flex-item progress-info">
                <view>
                  <text>计划进度:</text>
                  <text class="target-completed">
                    <text>{{ item.planFinish }}</text>
                    /
                    <text>{{ item.totalProcedure }}</text>
                  </text>
                </view>
                <view>
                  <text>实际进度:</text>
                  <text class="actual-completed">
                    <text :class="{ 'delay-work': item.actualFinish < item.planFinish }">{{ item.actualFinish }}</text>
                    /
                    <text>{{ item.totalProcedure }}</text>
                  </text>
                </view>
              </view>
              <view class="flex-item progress-wrapper">
                <m-pie-progress
                  :id="`canvas-${i + 1}`"
                  :total-count="item.totalProcedure"
                  :actual-count="item.actualFinish"
                  :target-count="10"
                ></m-pie-progress>
              </view>
            </template>
            <!-- 进行中/待确认 end -->
            <!-- 未开始 start -->
            <template v-if="item.status === 0">
              <view class="flex-item progress-info">
                <text>未开始</text>
              </view>
              <view class="flex-item progress-wrapper">
                <text>{{ item.planStartTime | formatData }}</text
                >开始
              </view>
            </template>
            <!-- 未开始 end -->
            <!-- 已完成 start -->
            <template v-if="item.status === 3">
              <view class="flex-item progress-info">
                <text>延后两天完成</text>
              </view>
              <view class="flex-item progress-wrapper">
                <text>{{ item.actualEndTime | formatData }}</text
                >完成
              </view>
            </template>
            <!-- 已完成 end -->
          </view>
          <!-- 进行中/待确认 start -->
          <template v-if="item.status > 0 && item.status < 3">
            <div class="start-time">
              <span>计划开始：{{ item.planStartTime | formatData }}</span>
              <span>计划结束：{{ item.planEndTime | formatData }}</span>
            </div>
          </template>
          <!-- 进行中/待确认 end -->
        </view>
      </div>
    </scroll-view>
    <!-- 无数据空载页 start -->
    <EmptyTemplate v-if="computedList.length === 0" />
    <!-- 无数据空载页 end -->
  </view>
</template>

<script>
import MPieProgress from '@/components/m-pie-progress'
import { workingAPI } from '@/api/working'
export default {
  components: {
    MPieProgress
  },
  data() {
    return {
      keyWords: '', //搜索关键字
      dataList: []
    }
  },
  computed: {
    // 项目id
    projectId() {
      return this.$store.state.project.projectId
    },
    // 根据关键词自动查询列表数据
    computedList() {
      if (this.keyWords) {
        return this.dataList.filter(e => e.configName.toLowerCase().includes(this.keyWords.toLowerCase()))
      } else {
        return this.dataList
      }
    }
  },
  onShow() {
    // this.init()
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'month') {
      this.$utils.toUrl(`/pages/task/month-control`)
    }
  },
  methods: {
    // 初始化
    init() {
      this.queryList()
    },
    // 项目下单体列表
    async queryList() {
      if (!this.projectId) {
        return
      }
      const result = await workingAPI.getEntityList(this.projectId)
      let datas = result.data || []
      this.dataList = datas.sort(this.$utils.setSort('entityName'))
    },
    // 跳转详情
    toDetails(item) {
      this.$utils.toUrl(`/pages/task/floor?configId=${item.configId}`)
    },
    // 搜索关键词改变
    changeKeyWords({ value }) {
      this.keyWords = value
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./progress.less');
</style>
