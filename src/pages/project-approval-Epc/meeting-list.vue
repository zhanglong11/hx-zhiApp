<template>
  <view class="main">
    <uni-search-bar
      placeholder="会议名称/会议地点/发起人/参与人"
      @confirm="handleSearchBarConfirm"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card v-for="item in list" :key="item.id" @click.native="handleClick(item)">
            <view class="card-body">
              <view class="card-info">
                <view class="title">{{ item.meetingName }}</view>
                <view>会议地点：{{ item.meetingAddress }}</view>
                <view>会议开始时间：{{ item.startTime | formatData }}</view>
                <view>会议结束时间：{{ item.endTime | formatData }}</view>
              </view>

              <block>
                <uni-status :options="meetingStatusList" :value="item.status"></uni-status>
              </block>
            </view>
            <view class="card-footer  border-top">
              <text>发起人：{{ item.initiatorName }}</text>
              <text>发起时间： {{ item.createTime | formatData }}</text>
            </view>
          </uni-card>
        </block>
        <uni-more style="margin-top: 15px;" :listLength="list.length" :total="total" :loading="loading" />
      </view>
    </scroll-view>

    <uni-add v-if="$hasPower('ProjectMeetingAddEpc')" @click.native="handleAdd" />
    <EmptyTemplate v-if="total === 0" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">会议状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="meetingStatusList" />
        <h6 class="label">会议时间</h6>
        <div style="display: flex;align-items: center;justify-content: center;">
          <uni-date-picker
            v-model="drawerForm.startTime"
            placeholder="开始日期"
            fields="day"
            mode="date"
          ></uni-date-picker>
          <span style="margin: 0 30px 10px;"> ~ </span>
          <uni-date-picker
            v-model="drawerForm.endTime"
            placeholder="结束日期"
            value-format="YYYY-MM-DD 23:59:59"
            fields="day"
            mode="date"
          ></uni-date-picker>
        </div>
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import meetingStatusList from './lib/meetingStatusList'
export default {
  data() {
    return {
      filterForm: {
        page: 1,
        rows: 10,
        meetingType: 'meetingType_1'
      },
      drawerForm: {},
      loading: false,
      list: [],
      total: 0,
      meetingStatusList
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
      this.fly.system
        .post('systemMeeting/list', data, { isLoading: true })
        .then(res => {
          this.list.push(...res.data.records)
          this.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
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
    handleAdd() {
      this.$utils.toUrl('/pages/project-approval-Epc/meeting-add')
    },
    handleClick(row) {
      this.$utils.toUrl(`/pages/project-approval-Epc/meeting-details?id=${row.id}`)
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
@import '~@/styles/common';
.main-body {
  font-size: @h2FontSize;

  .uni-card {
    margin-top: 30px;
    font-size: 12px;
    color: #4f6481;
    line-height: 48px;
    width: 700px;
  }
  .card-body {
    padding: 31px;
    color: @h2FontColor;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-info {
      flex: 1;
      width: 50%;
      position: relative;
      padding-right: 30px;
      .info-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .title {
      padding-left: 16px;
      font-size: @h2FontSize;
      font-weight: bold;
      position: relative;
      margin-bottom: 15px;
      color: #020202;
      .ellipsis;
    }
  }

  .card-footer {
    display: flex;
    line-height: 76px;
    justify-content: space-between;
    padding: 0 31px;
    color: #4f6481;
  }
}
</style>
