<template>
  <div class="main">
    <uni-card>
      <histogram-chart
        ref="chart"
        style="height: 500rpx;"
        :dataAs="histogramData"
        :basicAs="basicAs"
        :yAxisAs="yAxisAs"
        canvasId="ht1"
        labelKey="label"
        valueKey="value"
      />
    </uni-card>
    <uni-form-custom align="left">
      <uni-card title="合计">
        <uni-form-item v-if="filterForm.planTypeList === '1' || !filterForm.planTypeList" label="预计收入金额(元)">
          {{ form.totalPlanIncomeMoney }}
        </uni-form-item>
        <uni-form-item v-if="filterForm.planTypeList === '1' || !filterForm.planTypeList" label="实际收入金额(元)">
          {{ form.totalActualIncomeMoney }}
        </uni-form-item>
        <uni-form-item
          v-if="['2', '3'].includes(filterForm.planTypeList) || !filterForm.planTypeList"
          label="预计支出金额(元)"
        >
          {{ form.totalPlanExpenditureMoney }}
        </uni-form-item>
        <uni-form-item
          v-if="['2', '3'].includes(filterForm.planTypeList) || !filterForm.planTypeList"
          label="实际支出金额(元)"
        >
          {{ form.totalActualExpenditureMoney }}
        </uni-form-item>
      </uni-card>
      <h2>收支明细</h2>
      <uni-card v-for="(e, index) in list" :key="'' + e.year + e.month">
        <uni-form-item label="序号">{{ index + 1 }}</uni-form-item>
        <uni-form-item label="年度">{{ e.year }}</uni-form-item>
        <uni-form-item label="月度">{{ e.month }}</uni-form-item>
        <uni-form-item v-if="filterForm.planTypeList === '1' || !filterForm.planTypeList" label="预计收入金额(元)">
          {{ e.planIncomeMoney }}
        </uni-form-item>
        <uni-form-item v-if="filterForm.planTypeList === '1' || !filterForm.planTypeList" label="实际收入金额(元)">
          {{ e.actualIncomeMoney }}
        </uni-form-item>
        <uni-form-item
          v-if="['2', '3'].includes(filterForm.planTypeList) || !filterForm.planTypeList"
          label="预计支出金额(元)"
        >
          {{ e.planExpenditureMoney }}
        </uni-form-item>
        <uni-form-item
          v-if="['2', '3'].includes(filterForm.planTypeList) || !filterForm.planTypeList"
          label="实际支出金额(元)"
        >
          {{ e.actualExpenditureMoney }}
        </uni-form-item>
      </uni-card>
    </uni-form-custom>
    <uni-drawer-custom ref="filterRef" @submit="handleDrawerFormChange" @reset="handleDrawerReset">
      <div class="drawer-custom">
        <h6 class="label">分析类型</h6>
        <uni-checkbox-button-group
          v-model="drawerForm.planTypeList"
          :options="planTypeList"
          hasAll
        ></uni-checkbox-button-group>
        <h6 class="label">起始日期</h6>
        <uni-date-picker v-model="drawerForm.startDate" fields="month" />
        <h6 class="label">截止日期</h6>
        <uni-date-picker v-model="drawerForm.endDate" fields="month" />
      </div>
    </uni-drawer-custom>
  </div>
</template>

<script>
import _ from 'lodash'
import HistogramChart from '@/components/stan-ucharts/HistogramChart'
import moment from 'moment'
export default {
  name: 'Analyze',
  components: { HistogramChart },
  data() {
    return {
      filterForm: {
        projectId: uni.getStorageSync('projectId'),
        planTypeList: null,
        startDate: moment()
          .subtract(4, 'months')
          .format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment().format('YYYY-MM-DD HH:mm:ss')
      },
      histogramData: {
        label: [],
        value: []
      },
      form: {},
      drawerForm: {},
      list: [],
      planTypeList: [
        { label: '收入计划', value: '1' },
        { label: '支出计划', value: '2' },
        { label: '管理费支出', value: '3' }
      ],
      basicAs: {
        enableScroll: true,
        dataLabel: false,
        xAxis: {
          disableGrid: true,
          axisLine: false,
          calibration: true,
          itemCount: 5
        },
        yAxis: {
          disableGrid: false,
          gridType: 'dash',
          format(val) {
            return val + '万'
          }
        }
      },
      yAxisAs: {
        formatter: {
          type: 'number'
        }
      }
    }
  },
  created() {
    this.refresh()
    this.initFilterForm = _.cloneDeep(this.filterForm)
  },
  mounted() {},
  // 下拉刷新
  onPullDownRefresh() {
    this.refresh()
  },
  onNavigationBarButtonTap(obj) {
    if (obj.key === 'filter') {
      this.$refs.filterRef.open()
      this.drawerForm = _.cloneDeep(this.filterForm)
    }
  },
  methods: {
    async refresh() {
      const filterForm = _.cloneDeep(this.filterForm)
      filterForm.startDate = moment(filterForm.startDate)
        .startOf('month')
        .format('YYYY-MM-DD 00:00:00')
      filterForm.endDate = moment(filterForm.endDate)
        .endOf('month')
        .format('YYYY-MM-DD 23:59:59')
      if (filterForm.planTypeList) {
        filterForm.planTypeList = [filterForm.planTypeList]
      } else {
        filterForm.planTypeList = ['1', '2', '3']
      }
      const res = await this.fly.construction.post('/fund/plan/analyze', filterForm)
      this.list = res.data
      this.form = {
        totalActualIncomeMoney: _.sumBy(res.data, 'actualIncomeMoney'),
        totalActualExpenditureMoney: _.sumBy(res.data, 'actualExpenditureMoney'),
        totalPlanIncomeMoney: _.sumBy(res.data, 'planIncomeMoney'),
        totalPlanExpenditureMoney: _.sumBy(res.data, 'planExpenditureMoney')
      }
      let value = []
      if (this.filterForm.planTypeList === '1') {
        value.push(
          ...[
            { name: '预计收入', data: res.data.map(f => (f.planIncomeMoney || 0) / 10000) },
            { name: '实际收入', data: res.data.map(f => (f.actualIncomeMoney || 0) / 10000) }
          ]
        )
      } else if (['2', '3'].includes(this.filterForm.planTypeList)) {
        value.push(
          ...[
            { name: '预计支出', data: res.data.map(f => (f.planExpenditureMoney || 0) / 10000) },
            { name: '实际支出', data: res.data.map(f => (f.actualExpenditureMoney || 0) / 10000) }
          ]
        )
      } else {
        value.push(
          ...[
            { name: '预计收入', data: res.data.map(f => (f.planIncomeMoney || 0) / 10000) },
            { name: '实际收入', data: res.data.map(f => (f.actualIncomeMoney || 0) / 10000) },
            { name: '预计支出', data: res.data.map(f => (f.planExpenditureMoney || 0) / 10000) },
            { name: '实际支出', data: res.data.map(f => (f.actualExpenditureMoney || 0) / 10000) }
          ]
        )
      }
      this.histogramData = {
        label: res.data.map(e => '' + e.year + e.month.padStart(2, '0')),
        value
      }
    },
    handleDrawerFormChange() {
      this.filterForm = _.assign(this.filterForm, this.drawerForm)
      this.refresh()
    },
    handleDrawerReset() {
      this.filterForm = _.cloneDeep(this.initFilterForm)
      this.refresh()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  padding: 0 0 30px;
}
.uni-card {
  width: 700px;
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
h2 {
  font-size: 16px;
  padding: 20px 40px 0;
}
</style>
