<template>
  <div class="main">
    <uni-form-custom ref="form" align="left" hideRequiredAsterisk disabled :model="form" :rules="rules">
      <uni-card>
        <uni-form-item prop="planName" label="支出计划名称">
          <input v-model="form.planName" type="text" />
        </uni-form-item>
        <uni-form-item prop="year" label="年度">
          <input v-model="form.year" type="text" />
        </uni-form-item>
        <uni-form-item prop="month" label="月份">
          <input v-model="form.month" type="text" />
        </uni-form-item>
        <uni-form-item label="预计支出金额">
          <div>{{ expectedAmountOfIncome }}</div>
        </uni-form-item>
        <uni-form-item prop="remark" label="备注">
          <input v-model="form.remark" type="text" />
        </uni-form-item>
      </uni-card>
      <uni-card>
        <uni-form-item label="创建人">{{ form.creatorName }}</uni-form-item>
        <uni-form-item label="创建时间">{{ form.createTime }}</uni-form-item>
      </uni-card>
      <div class="income-detail-header">
        <h2>支出计划明细</h2>
        <button
          v-if="$hasPower('FundExpensesPlanPaymentEpc')"
          type="primary"
          @click="$utils.toUrl(`/pages/fund-epc/expense/actual/index?year=${form.year}&month=${form.month}`)"
          >实际支出明细</button
        >
      </div>
      <uni-card v-for="(item, index) in form.detailListVOList" :key="'' + item._id + item.id" :hide-title="false">
        <div slot="title" class="point-header name">
          <span>序号: {{ index + 1 }}</span>
        </div>
        <uni-form-item label="支出费用" isRequired>
          <input v-model="item.detailName" class="align-right" />
        </uni-form-item>
        <uni-form-item label="关联合同">
          <uni-select-contract v-model="item.contractId" :name.sync="item.contractName"></uni-select-contract>
        </uni-form-item>
        <uni-form-item label="预计支出时间" isRequired>
          <uni-date-picker v-model="item.planTime" fields="day"></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="预计支出金额(元)" isRequired>
          <input v-model.number="item.planAmount" type="number" class="align-right" />
        </uni-form-item>
        <uni-form-item label="备注">
          <textarea v-model="item.planRemark" autoHeight class="align-right" />
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button v-if="$hasPower('FundExpensesPlanDeleteEpc')" class="button" type="warn" @click="remove">删除</button>
      </view>
    </uni-form-custom>
  </div>
</template>

<script>
export default {
  name: 'Detail',
  data() {
    return {
      id: null,
      form: {
        projectId: uni.getStorageSync('projectId'),
        detailListVOList: []
      },
      rules: {
        planName: { required: true },
        year: { required: true },
        month: { required: true }
      }
    }
  },
  computed: {
    expectedAmountOfIncome() {
      return _.sumBy(this.form.detailListVOList, 'planAmount')
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  onShow() {
    if (this.id) this.refresh()
    if (!this.$hasPower('FundExpensesPlanEditEpc')) {
      this.$utils.hideNavButton.call(this)
    }
  },
  onNavigationBarButtonTap({ key }) {
    if (key === 'edit') {
      this.$utils.toUrl('/pages/fund-epc/expense/add?id=' + this.id)
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.construction.get('/fund/plan/get/' + this.id).then(res => {
        this.form = res.data
      })
    },
    remove() {
      uni.showModal({
        title: '提示',
        content: '确定要删除？',
        success: res => {
          if (res.confirm) {
            this.axios.construction.get('fund/plan/delete/' + this.id).then(() => {
              this.$utils.showToast('删除成功')
              this.$utils.goBack()
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.uni-card {
  width: 700px;
}
.main {
  padding-top: 15px;
}
.point-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
}
.income-detail-header {
  display: flex;
  padding: 20px 35px 0;
  align-items: center;
  justify-content: space-between;
  h2 {
    font-size: 16px;
  }
  button {
    margin: 0;
    font-size: 13px;
    line-height: 1;
    border-radius: 5px;
  }
}
</style>
