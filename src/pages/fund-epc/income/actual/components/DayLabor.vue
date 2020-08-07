<template>
  <div>
    <uni-card v-for="(item, index) in list" :key="item.id">
      <uni-form-item label="序号">{{ index + 1 }}</uni-form-item>
      <uni-form-item label="项目名称">{{ item.itemName }}</uni-form-item>
      <uni-form-item label="单位">{{ item.unit }}</uni-form-item>
      <uni-form-item label="暂定数量">{{ item.interimQuantity }}</uni-form-item>
      <uni-form-item label="实际数量">{{ item.realQuantity }}</uni-form-item>
      <uni-form-item label="综合单价(元)">{{ item.comprehensiveUnitPrice }}</uni-form-item>
      <uni-form-item label="本期完成数量">{{ item.currentFinishQuantity }}</uni-form-item>
      <uni-form-item label="本期完成金额(元)">{{ item.currentFinishMoney }}</uni-form-item>
      <uni-form-item label="所属分类">{{ item.categoryCode }}</uni-form-item>
      <uni-form-item label="审核量">{{ item.auditQuantity }}</uni-form-item>
      <uni-form-item label="审核金额(元)">{{ item.auditMoney }}</uni-form-item>
    </uni-card>
  </div>
</template>
<script>
export default {
  name: 'DayLabor',
  props: {
    contractId: {
      type: [Number, String],
      default: ''
    },
    paymentId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    paymentId: {
      immediate: true,
      handler(val) {
        if (val) this.refresh()
      }
    }
  },
  methods: {
    async refresh() {
      let res = await this.axios.construction.post('/contractMeasurementPaymentDayWorks/list', {
        paymentId: this.paymentId,
        contractId: this.contractId,
        projectId: uni.getStorageSync('projectId'),
        page: 1,
        rows: 20
      })
      this.list = res.data.records
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  padding: 5px;
}
</style>
