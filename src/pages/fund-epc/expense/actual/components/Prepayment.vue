<template>
  <div>
    <uni-card v-for="(item, index) in list" :key="item.id">
      <uni-form-item label="序号">{{ index + 1 }}</uni-form-item>
      <uni-form-item label="付款单编号">{{ item.orderCode }}</uni-form-item>
      <uni-form-item label="付款单名称">{{ item.orderName }}</uni-form-item>
      <uni-form-item label="预存款单金额(元)">{{ item.orderTotalAmount }}</uni-form-item>
      <uni-form-item label="已扣款金额(元)">{{ item.withholdMoney }}</uni-form-item>
      <uni-form-item label="申请金额(元)">{{ item.applyMoney }}</uni-form-item>
      <uni-form-item label="备注">{{ item.remark }}</uni-form-item>
      <uni-form-item label="审核金额(元)">{{ item.auditMoney }}</uni-form-item>
    </uni-card>
  </div>
</template>
<script>
export default {
  name: 'Prepayment',
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
      let res = await this.axios.construction.post('/contractMeasurementPaymentAdvance/list', {
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
