<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card>
          <ul class="list">
            <li v-if="$hasPower('FundIncomePlanEpc')" @click="toUrl('/pages/fund-epc/income/index')">
              <image class="list-icon" src="@/static/images/application/FundIncomePlanEpc.png"></image>
              <p>收入计划</p>
            </li>
            <li v-if="$hasPower('FundExpensesPlanEpc')" @click="toUrl('/pages/fund-epc/expense/index')">
              <image class="list-icon" src="@/static/images/application/FundExpensesPlanEpc.png"></image>
              <p>合同支出计划</p>
            </li>
            <li v-if="$hasPower('FundExpensesManagementEpc')" @click="toUrl('/pages/fund-epc/management/index')">
              <image class="list-icon" src="@/static/images/application/FundExpensesManagementEpc.png"></image>
              <p>费用支出计划</p>
            </li>
            <li v-if="$hasPower('FundStatisticEpc')" @click="toUrl('/pages/fund-epc/analyze/index')">
              <image class="list-icon" src="@/static/images/application/FundStatisticEpc.png"></image>
              <p>资金分析</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'ApplicationFundManageEpc',
  data() {
    return {}
  },
  methods: {
    refresh() {},
    toUrl(url) {
      this.$utils.toUrl(url)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
