<template>
  <div class="main">
    <uni-search-bar
      placeholder="支出计划名称/创建人"
      @confirm="handleSearchBarConfirmed"
      @input="handleSearchBarInput"
    ></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll list" @refresherrefresh="init" @scrolltolower="loadMore">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <section>
          <h2>
            {{ item.planName }}
          </h2>
          <p>预计支出金额(元)：{{ item.totalAmount }}</p>
          <p>实际支出金额（元）：{{ item.actualAmount || 0 }}</p>
        </section>
        <footer>
          <span>创建人:{{ item.creatorName }}</span>
          <span>创建时间：{{ item.createTime | ymd }}</span>
        </footer>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <uni-add v-if="$hasPower('FundExpensesPlanAddEpc')" @click="handlerAdd"></uni-add>
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div class="drawer-custom">
        <h6 class="label">年份</h6>
        <uni-date-picker v-model="drawerForm.year" fields="year" value-format="YYYY" />
        <div style="border: 1rpx solid #9993;margin:5px 0 10px ;"></div>
        <h6 class="label">月份</h6>
        <uni-select
          v-model="drawerForm.month"
          :options="new Array(12).fill('').map((e, index) => ({ label: index + 1, value: index + 1 }))"
        />
        <div style="border: 1rpx solid #9993;margin:5px 0 10px ;"></div>
      </div>
    </uni-drawer-custom>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
export default {
  name: 'Expense',
  data() {
    return {
      filterForm: {
        keyword: '',
        page: 1,
        rows: 10,
        projectId: uni.getStorageSync('projectId'),
        planType: 2
      },
      drawerForm: {},
      total: 0,
      loading: false,
      list: []
    }
  },
  onShow() {
    this.init()
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  mounted() {},
  // 下拉刷新
  onPullDownRefresh() {
    this.init()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'filter') {
      this.$refs.filterRef.open()
      this.drawerForm = _.cloneDeep(this.filterForm)
    }
  },
  methods: {
    async refresh() {
      this.loading = true
      const res = await this.fly.construction.post('/fund/plan/list', this.filterForm)
      this.loading = false
      this.total = res.data.total
      this.list = [...this.list, ...res.data.records]
    },
    loadMore() {
      if (this.total === this.list.length || this.loading) return false
      this.filterForm.page++
      this.refresh()
    },
    init() {
      this.filterForm.page = 1
      this.list = []
      this.refresh(true)
    },

    handlerAdd() {
      this.$utils.toUrl(`/pages/fund-epc/expense/add`)
    },
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.keyword = e.value
      this.init()
    },
    // 当用户清空关键词时触发
    handleSearchBarInput(e) {
      if (e.value.trim()) return
      this.filterForm.keyword = ''
      this.init()
    },
    handleDrawerFormChange() {
      this.filterForm = _.assign(this.filterForm, this.drawerForm)
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    remove() {},
    toDetail(row) {
      this.$utils.toUrl(`/pages/fund-epc/expense/detail?id=${row.id}`)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  padding-top: 15px;
}
.uni-searchbar {
  margin: 25px 0;
}
.list {
  .item {
    width: 700px;
    height: auto;
    position: relative;
    margin-bottom: 25px;
    list-style: none;
    section {
      padding: 20px 31px;
      position: relative;
      h2 {
        font-size: 14px;
        font-weight: normal;
        display: flex;
        align-items: center;
        span {
          width: 5px;
          height: 26px;
          margin-right: 10px;
          border-radius: 2.5px;
        }
      }

      p {
        margin-top: 30px;
        color: #989898;
      }
    }

    p,
    span {
      font-size: 12px;
    }

    footer {
      margin: 0 31px;
      display: flex;
      line-height: 76px;
      justify-content: space-between;
      border-top: 1px solid #f1f1f1;

      span {
        color: #4f6481;
      }
    }
  }
}
.drawer-custom {
  uni-input {
    border: 1px solid #ccc;
    margin-bottom: 20px;
    font-size: 14px;
    height: 60px;
    color: #666;
    padding: 0 10px;
  }
}
</style>
