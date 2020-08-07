<template>
  <view class="main">
    <uni-search-bar
      placeholder="搜索验收范围"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleItemClick(item)">
            <view class="card-body">
              <view
                class="card-info"
                :class="{
                  zero: item.inspectStatus === 0,
                  one: item.inspectStatus === 1,
                  two: item.inspectStatus === 2,
                  three: item.inspectStatus === 3
                }"
              >
                <view class="title">{{ item.name }}</view>
                <view>验收范围：{{ item.acceptanceScope }}</view>
                <view>合同开、竣工日期：{{ item.beginTime | ymd }}~{{ item.endTime | ymd }}</view>
                <view>实际开、竣工日期：{{ item.passBeginTime | ymd }}~{{ item.passEndTime | ymd }}</view>
              </view>
              <block v-if="item.acceptanceStatus !== 5">
                <uni-status :options="inspectStatus" :value="item.acceptanceStatus"></uni-status>
              </block>
              <block v-else>
                <uni-status :options="rectifyStatus" :value="item.rectifyStatus"></uni-status>
              </block>
            </view>
            <view class="card-footer  border-top">
              <!--<block v-if="[0, 1, 2, 3].includes(item.acceptanceStatus)">
                <text> 负责人:{{ item.principalName }} </text>
                <text class="cardTimeValue">创建时间： {{ item.createTime || '-' }}</text>
              </block>
              <block v-if="[5].includes(item.acceptanceStatus)">
                <block v-if="[2, 3, 4].includes(item.rectifyStatus)">
                  <text> 整改人:{{ item.rectifyPrincipalName }} </text>
                  <text class="cardTimeValue">整改时间： {{ item.actualAcceptanceTime || '-' }}</text>
                </block>
                <block v-else>
                  <text> 复检人:{{ item.principalName }} </text>
                  <text class="cardTimeValue">复检时间： {{ item.acceptancePassTime || '-' }}</text>
                </block>
              </block>
              <block v-else>
                <text> 填报人:{{ item.fillPersonName }} </text>
                <text class="cardTimeValue">填报时间： {{ item.actualAcceptanceTime || '-' }}</text>
              </block>-->
              <text> 负责人:{{ item.principalName }} </text>
              <text class="cardTimeValue">创建时间： {{ item.createTime || '-' }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>
    <!--    <uni-add @click.native="handleAddInspect" />-->
    <EmptyTemplate v-if="total === 0" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">验收状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.acceptanceStatus" hasAll :options="inspectStatus" />
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '../api/inspect'
import inspectStatus from '../lib/inspectStatus'
import rectifyStatus from '../lib/rectifyStatus'
import _ from 'lodash'
export default {
  name: 'OverInspectList',
  data() {
    return {
      inspectStatus,
      rectifyStatus,
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
    async refresh() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      let res = await Api.getList({ ...data, type: 2 })
      this.list.push(...res.data.records)
      this.total = res.data.total
      this.loading = false
    },
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
    handleAddInspect() {
      this.$utils.toUrl('/pages/completion-epc/project-over-inspect/add')
    },
    handleItemClick(row) {
      this.$utils.toUrl(`/pages/completion-epc/project-over-inspect/detail?id=${row.id}`)
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
