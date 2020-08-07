<template>
  <div class="main is-white">
    <div class="tabs-wrap">
      <uni-tabs v-model="type">
        <uni-tab-pane name="1" label="月度进度"></uni-tab-pane>
        <uni-tab-pane name="2" label="月度耗材"></uni-tab-pane>
      </uni-tabs>
    </div>
    <!--    月度进度开始-->
    <div v-if="type === '1'">
      <p class="date-wrap">
        <uni-date-picker v-model="monthDate" fields="month" />
      </p>
      <histogram-chart
        :dataAs="histogramData2"
        canvasId="ht1"
        labelKey="label"
        valueKey="value"
        :yAxisAs="{
          formatter: {
            type: 'percent' //type:number percent String,额外参数:fixed:NUmber,name:String
          }
        }"
      />
      <div class="table-wrap">
        <h6 class="title">完成工序实际耗材</h6>
        <t-table>
          <t-tr v-for="item in tableData" :key="item.positionNum">
            <t-td>{{ item.name }}</t-td>
            <t-td>{{ item.count }}</t-td>
            <t-td>{{ item.unit }}</t-td>
          </t-tr>
        </t-table>
      </div>
    </div>
    <!--    月度进度结束-->
    <!--    月度耗材开始-->
    <div v-if="type === '2'">
      <p class="date-wrap">
        <uni-date-picker v-model="monthDate" fields="month" />
      </p>
      <histogram-chart
        :dataAs="histogramData2"
        canvasId="ht1"
        labelKey="label"
        valueKey="value"
        :yAxisAs="{
          formatter: {
            type: 'percent' //type:number percent String,额外参数:fixed:NUmber,name:String
          }
        }"
      />
      <div class="table-wrap">
        <h6>完成工序实际耗材</h6>
      </div>
    </div>
    <!--    月度耗材结束-->
  </div>
</template>

<script>
import HistogramChart from '@/components/stan-ucharts/HistogramChart'
import tTable from '@/components/t-table/t-table'
import tTh from '@/components/t-table/t-th'
import tTr from '@/components/t-table/t-tr'
import tTd from '@/components/t-table/t-td'
export default {
  components: { HistogramChart, tTable, tTh, tTr, tTd },
  data() {
    return {
      type: '1',
      monthDate: null,
      tableData: [
        { name: '11', unit: 'kg', count: '22' },
        { name: '22', unit: 'kg', count: '33' }
      ],
      histogramData2: {
        //柱状图Compent  //label应为series value 应为
        label: ['2052', '2013', '2014', '2015', '2016', '2017', '2018'],
        value: [
          {
            name: '',
            data: [0.3, 0.2, 0.5, 0.4, 0.3, 0.1, 0.2]
          }
        ]
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    refresh() {}
  }
}
</script>

<style scoped lang="less">
@import url('./month-control.less');
</style>
