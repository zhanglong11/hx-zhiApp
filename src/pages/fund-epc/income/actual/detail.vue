<template>
  <div class="main">
    <uni-form-custom ref="form" align="left" hideRequiredAsterisk disabled>
      <uni-card>
        <uni-form-item label="计量支付名称">
          <div>{{ form.name }}({{ form.code }})</div>
        </uni-form-item>
        <uni-form-item label="合同编号 ">
          <div>{{ form.contractCode }}</div>
        </uni-form-item>
        <uni-form-item label="支付阶段">{{ $getLabel(paymentStageList, form.paymentStage) }}</uni-form-item>
        <uni-form-item label="申请金额合计(元)">
          <div>{{ form.totalAmount }}</div>
        </uni-form-item>
        <uni-form-item label="支付日期">
          <div>{{ form.paymentTime | ymd }}</div>
        </uni-form-item>
        <uni-form-item label="付款方">
          <div>{{ form.payer }}</div>
        </uni-form-item>
        <uni-form-item label="收款方">
          <div>{{ form.payee }}</div>
        </uni-form-item>
        <uni-form-item label="备注">
          <div>{{ form.remark }}</div>
        </uni-form-item>
      </uni-card>
      <uni-card>
        <uni-form-item label="创建人">
          <div>{{ form.creatorName }}</div>
        </uni-form-item>
        <uni-form-item label="创建时间">
          <div>{{ form.createTime }}</div>
        </uni-form-item>
      </uni-card>
      <!--清单施工总承包-->
      <template v-if="form.contractType === 1">
        <uni-card style="overflow: auto">
          <MsTabs v-model="activeIndex" :list="tabsList"></MsTabs>
        </uni-card>

        <!--分部分项工程和单价措施项目清单(支付)-->
        <OrderProject v-if="activeIndex === 0" :payment-id="id" :contractId="form.contractId"></OrderProject>
        <!--分部分项工程和单价措施项目清单(支付)-->
        <!--总价措施(支付)-->
        <TotalPriceMeasure v-if="activeIndex === 1" :payment-id="id" :contractId="form.contractId"></TotalPriceMeasure>
        <!--总价措施(支付)-->
        <!--计日工(支付)-->
        <DayLabor v-if="activeIndex === 2" :payment-id="id" :contractId="form.contractId"></DayLabor>
        <!--计日工(支付)-->
        <!--索赔项目(支付)-->
        <ClaimProject v-if="activeIndex === 3" :payment-id="id" :contractId="form.contractId"></ClaimProject>
        <!--索赔项目(支付)-->
        <!--迟付款金额(支付)-->
        <DelayPay v-if="activeIndex === 4" :payment-id="id" :contractId="form.contractId"></DelayPay>
        <!--迟付款金额(支付)-->
        <!--其他（支付）-->
        <OtherPay v-if="activeIndex === 5" :payment-id="id" :contractId="form.contractId"></OtherPay>
        <!--其他（支付）-->
        <!--保证金(扣款)-->
        <SecurityDeposit v-if="activeIndex === 6" :payment-id="id" :contractId="form.contractId"></SecurityDeposit>
        <!--保证金(扣款)-->
        <!--预付款(扣款)-->
        <Prepayment v-if="activeIndex === 7" :payment-id="id" :contractId="form.contractId"></Prepayment>
        <!--预付款(扣款)-->
        <!--违约赔偿(扣款)-->
        <BreakContractClaim
          v-if="activeIndex === 8"
          :payment-id="id"
          :contractId="form.contractId"
        ></BreakContractClaim>
        <!--违约赔偿(扣款)-->
        <!--其它(扣款)-->
        <OtherDeduct v-if="activeIndex === 9" :payment-id="id" :contractId="form.contractId"></OtherDeduct>
        <!--其它(扣款)-->
      </template>
      <!--清单其他合同-->
      <template v-if="form.contractType === 99">
        <uni-card style="overflow: auto">
          <MsTabs v-model="activeIndex" :list="tabsListOther"></MsTabs>
        </uni-card>
        <!--清单项目-->
        <OrderProject v-if="activeIndex === 0" :payment-id="id" :contractId="form.contractId"></OrderProject>
        <!--清单项目-->
        <!--索赔项目(支付)-->
        <ClaimProject v-if="activeIndex === 1" :payment-id="id" :contractId="form.contractId"></ClaimProject>
        <!--索赔项目(支付)-->
        <!--迟付款金额(支付)-->
        <DelayPay v-if="activeIndex === 2" :payment-id="id" :contractId="form.contractId"></DelayPay>
        <!--迟付款金额(支付)-->
        <!--其他（支付）-->
        <OtherPay v-if="activeIndex === 3" :payment-id="id" :contractId="form.contractId"></OtherPay>
        <!--其他（支付）-->
        <!--保证金(扣款)-->
        <SecurityDeposit v-if="activeIndex === 4" :payment-id="id" :contractId="form.contractId"></SecurityDeposit>
        <!--保证金(扣款)-->
        <!--预付款(扣款)-->
        <Prepayment v-if="activeIndex === 5" :payment-id="id" :contractId="form.contractId"></Prepayment>
        <!--预付款(扣款)-->
        <!--违约赔偿(扣款)-->
        <BreakContractClaim
          v-if="activeIndex === 6"
          :payment-id="id"
          :contractId="form.contractId"
        ></BreakContractClaim>
        <!--违约赔偿(扣款)-->
        <!--其它(扣款)-->
        <OtherDeduct v-if="activeIndex === 7" :payment-id="id" :contractId="form.contractId"></OtherDeduct>
        <!--其它(扣款)-->
      </template>
      <!--清单其他合同-->
    </uni-form-custom>
  </div>
</template>

<script>
import MsTabs from '@/components/ms-tabs'
import paymentStageList from './lib/paymentStageList'
import contractType from './lib/contractType'

import OrderProject from './components/OrderProject'
import TotalPriceMeasure from './components/TotalPriceMeasure'
import DayLabor from './components/DayLabor'
import ClaimProject from './components/ClaimProject'
import DelayPay from './components/DelayPay'
import OtherPay from './components/OtherPay'
import SecurityDeposit from './components/SecurityDeposit'
import Prepayment from './components/Prepayment'
import BreakContractClaim from './components/BreakContractClaim'
import OtherDeduct from './components/OtherDeduct'
export default {
  name: 'Detail',
  components: {
    MsTabs,
    OrderProject,
    TotalPriceMeasure,
    DayLabor,
    ClaimProject,
    DelayPay,
    OtherPay,
    SecurityDeposit,
    Prepayment,
    BreakContractClaim,
    OtherDeduct
  },
  data() {
    return {
      id: null,
      form: {
        projectId: uni.getStorageSync('projectId'),
        detailListVOList: []
      },
      paymentStageList,
      contractType,
      /**
       * 施工总承包tabs选项
       */
      tabsList: [
        { title: '分部分项工程和单价措施项目清单(支付)' },
        { title: '总价措施(支付)' },
        { title: '计日工(支付)' },
        { title: '索赔项目(支付)' },
        { title: '迟付款金额(支付)' },
        { title: '其他（支付）' },
        { title: '保证金(扣款)' },
        { title: '预付款(扣款)' },
        { title: '违约赔偿(扣款)' },
        { title: '其它(扣款)' }
      ],
      /**
       * 其它合同tabs选项
       */
      tabsListOther: [
        { title: '清单项目' },
        { title: '索赔项目(支付)' },
        { title: '迟付款金额(支付)' },
        { title: '其他(支付)' },
        { title: '保证金(扣款)' },
        { title: '预付款(扣款)' },
        { title: '违约赔偿(扣款)' },
        { title: '其他(扣款)' }
      ],
      activeIndex: 0
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  created() {
    if (this.id) this.refresh()
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.construction.get('contractMeasurementPayment/get/' + this.id).then(res => {
        this.form = res.data
      })
    },
    remove() {
      uni.showModal({
        title: '提示',
        content: '确定要删除？',
        success: res => {
          if (res.confirm) {
            this.axios.construction.post('fund/plan/delete/' + this.id).then(() => {
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
.main {
  padding-bottom: 20px;
}
.uni-card {
  width: 700px;
}
div /deep/ .uni-card {
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
  uni-button {
    margin: 0;
    font-size: 13px;
    line-height: 1;
    border-radius: 5px;
  }
}
div /deep/ .uni-scroll-view-content {
  white-space: nowrap;
  li {
    display: inline-block;
    padding: 10px 15px;
    vertical-align: middle;
  }
}
</style>
