<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleTenderItemClick(item)">
            <view class="card-body">
              <view
                class="card-info"
                :class="{
                  zero: item.status === 0,
                  one: item.status === 1,
                  two: item.status === 2,
                  three: item.status === 3
                }"
              >
                <view class="title">{{ item.transferName }}</view>
                <view>移交单位：{{ item.transferUnit }}</view>
                <view>接管单位：{{ item.takeOverUnit }}</view>
                <view>验收合格日期：{{ item.acceptancePassTime }}</view>
              </view>
              <block>
                <uni-status :options="overStatus" :value="item.status"></uni-status>
              </block>
            </view>
            <view class="card-footer  border-top">
              <text>移交人：{{ item.transferPersonName }}</text>
              <text>移交时间： {{ item.transferTime }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <!--    <uni-add @click.native="handleAddTenderItem" />-->
    <EmptyTemplate v-if="total === 0" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="overStatus" />
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api/projectOver'
import overStatus from '../lib/overStatus'
import _ from 'lodash'
export default {
  data() {
    return {
      overStatus,
      filterForm: {
        page: 1,
        rows: 10,
        projectId: wx.getStorageSync('projectId'),
        search: ''
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
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getList(data)
      this.list.push(...res.data.records)
      this.total = res.data.total
      this.loading = false
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
    },
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
      this.filterForm.search = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.search = ''
      this.init()
    },
    handleAddTenderItem() {
      this.$utils.toUrl('/pages/completion-epc/project-over/edit')
    },
    handleTenderItemClick(row) {
      this.$utils.toUrl(`/pages/completion-epc/project-over/detail?id=${row.id}&status=${row.status}`)
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
