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
                  zero: item.auditStatus === 0,
                  one: item.auditStatus === 1,
                  two: item.auditStatus === 2,
                  three: item.auditStatus === 3
                }"
              >
                <view class="title">{{ item.name }}</view>
                <view>招标公告编号：{{ item.code }}</view>
                <view>招标类型：{{ $getLabel(tenderTypeList, item.type) }}</view>
                <view>招标方式：{{ $getLabel(tenderModeList, item.mode) }}</view>
              </view>
              <block>
                <uni-status :options="status" :value="item.auditStatus"></uni-status>
              </block>
            </view>
            <block>
              <view class="card-footer  border-top">
                <text>创建人：{{ item.creatorName }}</text>
                <text>创建时间： {{ item.createTime | formatData }}</text>
              </view>
            </block>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <uni-add @click.native="handleAddTenderItem" />
    <EmptyTemplate v-if="total === 0" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.auditStatus" hasAll :options="status" />
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api'
import status from '../lib/status'
import _ from 'lodash'
export default {
  data() {
    return {
      status,
      filterForm: {
        page: 1,
        rows: 10,
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
    ...mapGetters(['projectId']),
    tenderTypeList() {
      return this.$getArgList('tenderType')
    },
    tenderModeList() {
      return this.$getArgList('tenderMode')
    }
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
      let res = await Api.getTenderList(data)
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
      this.filterForm.keyword = e.value.trim()
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    handleAddTenderItem() {
      this.$utils.toUrl('/pages/recruit-manage-epc/tender/add')
    },
    handleTenderItemClick(row) {
      this.$utils.toUrl(`/pages/recruit-manage-epc/tender/detail?id=${row.id}&status=${row.auditStatus}`)
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
