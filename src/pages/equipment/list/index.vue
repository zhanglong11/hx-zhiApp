<template>
  <view class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirm" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handlePreviewItemInfo(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title-wrap">
                  <view class="title">{{ item.name }}</view>
                  <uni-status :options="equipmentStatus" :value="item.useStatus" />
                </view>
                <view class="flex-item">
                  <p>
                    <span class="label">规格型号：</span><span class="info-item">{{ item.models }}</span>
                  </p>
                  <p>
                    <span class="label">设备位置：</span><span class="info-item">{{ item.location }}</span>
                  </p>
                </view>
                <view class="flex-item">
                  <p>
                    <span class="label">设备来源：</span
                    ><span class="info-item">{{ $getLabel(sourceList, item.source) }}</span>
                  </p>
                  <p>
                    <span class="label">设备类别：</span
                    ><span class="info-item">{{ $getLabel(equipmentType, item.type) }}</span>
                  </p>
                </view>
              </view>
            </view>
            <view class="card-footer  border-top">
              <text>创建人：{{ item.creatorName }}</text>
              <text>创建时间： {{ item.createTime | formatData }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add @click.native="handleAddItemInfo" />
    <EmptyTemplate v-if="total === 0" />

    <!-- 筛选功能 -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">设备来源</h6>
        <uni-checkbox-button-group v-model="filterForm.source" :options="sourceList" />
        <p class="item-line" />
        <h6 class="label">使用状态</h6>
        <uni-checkbox-button-group v-model="filterForm.useStatus" :options="equipmentStatus" />
        <p class="item-line" />
        <h6 class="label">参与人员</h6>
        <uni-select-user v-model="userIds" :mode="2" multiple @change="getUser"></uni-select-user>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import Api from '@/api/material/equipment'
import sourceList from './lib/sourceList'
import equipmentStatus from './lib/equipmentStatus'
import equipmentType from './lib/equipmentType'
import _ from 'lodash'
export default {
  data() {
    return {
      filterForm: {
        page: 1,
        rows: 10,
        status: '',
        projectId: wx.getStorageSync('projectId')
      },
      loading: false,
      list: [],
      total: 0,
      sourceList,
      equipmentStatus,
      equipmentType,
      drawerForm: {},
      userIds: null
    }
  },
  computed: {
    ...mapGetters(['projectId'])
  },
  watch: {
    'filterForm.inspectStatus'() {
      this.init()
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  methods: {
    refresh: _.debounce(async function() {
      this.loading = true
      const data = _.cloneDeep(this.filterForm)
      Api.list(data).then(res => {
        console.log(res)
        this.list = res.data.records || []
        this.total = res.data.total
      })
    }, 100),
    // 初始化
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh()
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
    handleAddItemInfo() {
      this.$utils.toUrl('/pages/equipment/list/add')
    },
    handlePreviewItemInfo(row) {
      console.log(row)
      // this.$utils.toUrl(`/pages/material/purchaseOrder/detail?id=${row.id}&status=${row.status}`)
      this.$utils.toUrl(`/pages/equipment/list/detail?id=${row.id}`)
    },
    // 加载更多--无数据时scrollView不存在，不会触发下拉刷新
    handleScrollToLower() {
      if (this.total === this.list.length) return
      this.filterForm.page++
      this.refresh()
    },

    handleDrawerFormChange() {
      // this.filterForm = this.drawerForm
      console.log('filter change', this.filterForm)
      this.init()
    },
    getUser(user) {
      this.filterForm = {
        ...this.filterForm,
        ...{
          userIds: (user.userId && user.userId.split(',')) || null
        }
      }
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.userIds = null
      this.init()
    }
  }
}
</script>

<style lang="less" scoped>
@import url('index.less');
</style>
