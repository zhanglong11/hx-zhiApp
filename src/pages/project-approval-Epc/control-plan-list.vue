<template>
  <view class="main">
    <uni-search-bar placeholder="任务名称/填报人/任务编号" @input="handleSearchBarInput"></uni-search-bar>
    <scroll-view v-if="total" class="scroll-roll" scroll-y @scrolltolower="handleScrollToLower">
      <view class="main-body">
        <block>
          <uni-card-tree itemKey="id" :list="computedList" @node-click="toDetails">
            <div slot-scope="{ item }">
              <view class="card-body">
                <div class="title">{{ item.wbsCode }} {{ item.name }}</div>
                <view class="card-info">
                  <view>计划开始时间：{{ item.planStartTime | ymd }}</view>
                  <view>计划结束时间：{{ item.planEndTime | ymd }}</view>
                </view>
                <div class="progress">{{ item.actualProgress * 100 || 0 }}%</div>
                <!--  <uni-load-line
                  class="progress"
                  loadType="circle"
                  :circleInfo="circleInfo"
                  :loadPercent="item.actualProgress"
                ></uni-load-line>-->
              </view>
              <view class="card-footer  border-top">
                <text>创建人：{{ item.creatorName }}</text>
                <text>创建时间： {{ item.createTime | ymd }}</text>
              </view>
            </div>
          </uni-card-tree>
        </block>
      </view>
    </scroll-view>

    <uni-add
      v-if="$hasPower('ProjectPlanAddEpc')"
      @click.native="$utils.toUrl('/pages/project-approval-Epc/control-plan-add')"
    />
    <EmptyTemplate v-if="total === 0" />
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">完成进度</h6>
        <div class="input-group-progress">
          <div>
            <input v-model="drawerForm.progressMin" type="number" />
            <span>%</span>
          </div>
          <span>-</span>
          <div>
            <input v-model="drawerForm.progressMax" type="number" />
            <span>%</span>
          </div>
        </div>
        <h6 class="label">任务状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" hasAll :options="statusList" />
      </div>
    </uni-drawer-custom>
  </view>
</template>

<script>
import treeFilter from '@/utils/treeFilter'
import _ from 'lodash'
import toTree from '@/utils/toTree'
export default {
  name: 'ControlPlanList',
  data() {
    return {
      filterForm: {
        projectId: uni.getStorageSync('projectId'),
        search: '',
        status: null
      },
      drawerForm: {},
      statusList: [
        {
          label: '未开始',
          value: 0
        },
        {
          label: '进行中',
          value: 1
        },
        {
          label: '已结束',
          value: 2
        }
      ],
      circleInfo: { foreground: '#717376', background: '#6ED4BF', circleColor: '#fff' }
    }
  },
  computed: {
    list() {
      return this.$store.state.projectEpc.treeData
    },
    computedList() {
      let list = this.list
      const conditions = []
      if (this.filterForm.search) {
        conditions.push(e => {
          return e.name.includes(this.filterForm.search)
        })
      }
      if (this.filterForm.status || this.filterForm.status === 0) {
        conditions.push(e => e.status === this.filterForm.status)
      }
      if (this.filterForm.progressMin || this.filterForm.progressMax) {
        let min = this.filterForm.progressMin || 0
        let max = this.filterForm.progressMax || 100
        conditions.push(e => e.actualProgress * 100 <= max && e.actualProgress * 100 >= min)
      }
      if (conditions.length) {
        list = treeFilter(list, item => _.every(conditions.map(fn => fn(item))), 'parentTaskUniqueId', 'taskUniqueId')
      }
      return list
    },
    total() {
      return this.list.length
    }
  },
  created() {
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  onShow() {
    this.refresh()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'screen') {
      this.drawerForm = _.cloneDeep(this.filterForm)
      this.$refs.filterRef.open()
    }
  },
  methods: {
    // 请求数据
    refresh() {
      this.$store.dispatch('projectEpc/getList')
    },
    // 筛选条件改变
    handleDrawerFormChange() {
      this.filterForm = this.drawerForm
    },
    // 筛选重置
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      this.filterForm.search = e.value.trim()
    },
    // 跳转详情
    toDetails(row) {
      this.$utils.toUrl('/pages/project-approval-Epc/control-plan-details?id=' + row.id)
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
.uni-searchbar {
  margin: 0 0 30px;
}

.main-body {
  font-size: @h2FontSize;

  .uni-card {
    font-size: 12px;
    color: #4f6481;
    line-height: 48px;
  }
  .card-body {
    padding: 31px;
    color: @h2FontColor;
    display: flex;
    flex-direction: column;

    .card-info {
      flex: 1;
      position: relative;
      width: 100%;
      padding-right: 30px;
      .info-item {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .title {
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
.progress {
  position: absolute;
  top: 80px;
  right: 60px;
}
.input-group-progress {
  display: flex;
  justify-content: center;
  border: none;
  margin-bottom: 10px;
  > span {
    margin: 0 30px;
  }
  > div {
    display: flex;
    font-size: 14px;
    color: #555;
    input {
      width: 200px;
      text-align: center;
      border: 1px solid #aaa;
      font-size: 14px;
      height: 50px;
    }
    span {
      margin-left: 10px;
      color: #999;
    }
  }
}
</style>
