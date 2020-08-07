<template>
  <div>
    <uni-card v-for="(item, index) in list" :key="item.id">
      <uni-form-item label="项目编号">{{ index + 1 }}</uni-form-item>
      <uni-form-item label="项目名称">{{ item.itemCode }}</uni-form-item>
      <uni-form-item label="项目特征">{{ item.itemName }}</uni-form-item>
      <uni-form-item label="单位">{{ item.itemFeature }}</uni-form-item>
      <uni-form-item label="单价(元)">{{ item.unit }}</uni-form-item>
      <uni-form-item label="数量">{{ item.comprehensiveUnitPrice }}</uni-form-item>
      <uni-form-item label="已计量完成工作量">{{ item.quantity }}</uni-form-item>
      <uni-form-item label="本期完成数量">{{ item.measureFinishQuantity }}</uni-form-item>
      <uni-form-item label="本期完成金额(元)">{{ item.currentFinishQuantity }}</uni-form-item>
      <uni-form-item label="审核量">{{ item.currentFinishMoney }}</uni-form-item>
      <uni-form-item label="审核金额(元)">{{ item.auditQuantity }}</uni-form-item>
    </uni-card>
  </div>
</template>
<script>
export default {
  name: 'OrderProject',
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
      let res = await this.axios.construction.post('/contractMeasurementPaymentSubpackage/list', {
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
