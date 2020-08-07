<template>
  <div class="main">
    <uni-search-bar placeholder="搜索" @confirm="handleSearchBarConfirmed"></uni-search-bar>
    <scroll-view scroll-y class="scroll-roll list" @refresherrefresh="init" @scrolltolower="loadMore">
      <div v-for="item in list" :key="item.id" class="card item" @click="toDetail(item)">
        <aside>
          <uni-status :options="statusList" :value="item.status"></uni-status>
        </aside>
        <section>
          <h2>
            {{ item.name }}
          </h2>
          <p>收款方：{{ item.payee }}</p>
          <p>付款方：{{ item.payer }}</p>
        </section>
        <footer>
          <span>创建人:{{ item.creatorName }}</span>
          <span>创建时间：{{ item.createTime }}</span>
        </footer>
      </div>
      <EmptyTemplate v-if="list.length === 0"></EmptyTemplate>
      <uni-more :listLength="list.length" :total="total" :loading="loading" />
    </scroll-view>
    <!-- 筛选组件 start -->
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div>
        <h6 class="label">支付阶段</h6>
        <uni-checkbox-button-group
          v-model="drawerForm.paymentStage"
          :options="paymentStageList"
          hasAll
        ></uni-checkbox-button-group>
        <h6 class="label">付款状态</h6>
        <uni-checkbox-button-group v-model="drawerForm.status" :options="statusList" hasAll></uni-checkbox-button-group>
      </div>
    </uni-drawer-custom>
    <!-- 筛选组件 end -->
  </div>
</template>

<script>
import statusList from './lib/statusList'
import paymentStageList from './lib/paymentStageList'
import _ from 'lodash'
import UniCheckboxButtonGroup from '@/components/uni-checkbox-button-group/uni-checkbox-button-group'
export default {
  name: 'Income',
  components: { UniCheckboxButtonGroup },
  data() {
    return {
      filterForm: {
        keyword: '',
        page: 1,
        rows: 10,
        projectId: uni.getStorageSync('projectId'),
        payeeId: uni.getStorageSync('companyId'),
        payYear: '',
        payMonth: ''
      },
      drawerForm: {},
      statusList,
      paymentStageList,
      total: 0,
      loading: false,
      list: []
    }
  },
  onLoad({ year, month }) {
    this.filterForm.payYear = year
    this.filterForm.payMonth = month
  },
  onShow() {
    this.init()
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
      const res = await this.fly.construction.post('contractMeasurementPayment/epcList', this.filterForm)
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
    //searchBar的搜索事件
    handleSearchBarConfirmed(e) {
      this.filterForm.keyword = e.value
      this.init()
    },
    handleDrawerFormChange() {
      this.filterForm = _.assign(this.filterForm, this.drawerForm)
      if (!this.filterForm.status) {
        delete this.filterForm.status
        this.filterForm.statusList = [4, 5]
      }
      this.init()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.init()
    },
    toDetail(row) {
      this.$utils.toUrl(`/pages/fund-epc/income/actual/detail?id=${row.id}`)
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
    aside {
      position: absolute;
      top: 40%;
      right: 40px;
      transform: translateY(-50%);
    }
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
</style>
