<template>
  <div>
    <uni-card v-for="(item, index) in list" :key="item.id">
      <uni-form-item label="序号">{{ index + 1 }}</uni-form-item>
      <uni-form-item label="项目编号">{{ item.itemCode }}</uni-form-item>
      <uni-form-item label="项目名称">{{ item.itemName }}</uni-form-item>
      <uni-form-item label="计算基础">{{ item.calculationBasis }}</uni-form-item>
      <uni-form-item label="费率(%)">{{ item.rate }}</uni-form-item>
      <uni-form-item label="合价金额(元)">{{ item.money }}</uni-form-item>
      <uni-form-item label="调整费率(%)">{{ item.adjustRate }}</uni-form-item>
      <uni-form-item label="调整后金额(元)">{{ item.adjustMoney }}</uni-form-item>
      <uni-form-item label="已计量金额(元)">{{ item.measureFinishMoney }}</uni-form-item>
      <uni-form-item label="本期完成金额">{{ item.currentFinishMoney }}</uni-form-item>
      <uni-form-item label="所属分类">{{ item.categoryCode }}</uni-form-item>
      <uni-form-item label="审核金额(元)">{{ item.auditMoney }}</uni-form-item>
    </uni-card>
  </div>
</template>
<script>
export default {
  name: 'TotalPriceMeasure',
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
      let res = await this.axios.construction.post('/contractMeasurementPaymentTotalPriceMeasure/list', {
        paymentId: this.paymentId,
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
