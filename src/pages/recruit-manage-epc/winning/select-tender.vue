<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <radio-group @change="handleSelect">
            <uni-card v-for="item in list" :key="item.id">
              <view class="card-body">
                <view style="width: 60rpx"><radio :value="item.id" :checked="item.checked"/></view>
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
                  <!--<view>招标编号：{{ item.code }}</view>
                  <view>招标类型：{{ $getLabel(tenderTypeList, item.type) }}</view>
                  <view>招标方式：{{ $getLabel(tenderModeList, item.mode) }}</view>-->
                </view>
                <!-- <block>
                  <uni-status :options="status" :value="item.auditStatus"></uni-status>
                </block>-->
              </view>
              <!--<view class="card-footer  border-top">
                <text>创建人：{{ item.creatorName }}</text>
                <text>创建时间： {{ item.createTime }}</text>
              </view>-->
            </uni-card>
          </radio-group>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
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
  props: {
    checkValue: {
      type: [Number, String],
      default: 36480659800333572
    }
  },
  data() {
    return {
      status,
      filterForm: {
        page: 1,
        rows: 10000,
        projectId: wx.getStorageSync('projectId'),
        keyword: ''
      },
      drawerForm: {},
      loading: false,
      list: [],
      total: 0,
      selectItem: null,
      key: ''
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
  onLoad(options) {
    this.key = options.key
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    /*  if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }*/
    if (this.selectItem) {
      uni.$emit('update:select-tender', { key: this.key, data: this.selectItem })
      this.$utils.goBack()
    } else {
      this.$utils.showToast('请选择一条公告')
      return false
    }
  },
  methods: {
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getAvailableTenderList(this.projectId)
      this.list.push(...res.data)
      // this.list[0].checked = true
      this.total = res.data.length || 0
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
    handleAddWinningItem() {
      this.$utils.toUrl('/pages/recruit-manage-epc/winning/add')
    },
    handleWinningItemClick(row) {
      this.$utils.toUrl(`/pages/recruit-manage-epc/winning/detail?id=${row.id}&status=${row.auditStatus}`)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },
    async handleSelect(e) {
      let res =await Api.getTenderDetail(e.detail.value)
      //this.selectItem = this.list.filter(item => item.id === e.detail.value)[0]
      this.selectItem = { ...res.data }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
