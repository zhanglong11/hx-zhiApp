<template>
  <div class="main">
    <uni-form-custom ref="form" :model="form" :rules="rules">
      <uni-card>
        <uni-form-item prop="planName" label="收入计划名称">
          <input v-model="form.planName" type="text" placeholder="请输入" />
        </uni-form-item>
        <uni-form-item prop="year" label="年月" isLink>
          <uni-date-picker v-model="date" fields="month"></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="预计收入金额">
          <div>{{ expectedAmountOfIncome || 0 }}</div>
        </uni-form-item>
        <uni-form-item prop="remark" label="备注">
          <input v-model="form.remark" type="text" placeholder="请输入" />
        </uni-form-item>
      </uni-card>
      <div class="income-detail-header">
        <h2>收入计划明细</h2>
        <image
          src="/static/images/icon/@2x/icon-add.png"
          @click="
            detailList.push({ _id: _.uniqueId(), detailName: '', planTime: null, planAmount: null, planRemark: null })
          "
        ></image>
      </div>
      <uni-card v-for="(item, index) in detailList" :key="'' + item._id + item.id" :hide-title="false">
        <div slot="title" class="point-header name">
          <span>序号: {{ index + 1 }}</span>
          <span @click="detailList.splice(index, 1)">删除</span>
        </div>
        <uni-form-item label="收入费用" isRequired>
          <uni-input-number v-model="item.detailName" />
        </uni-form-item>
        <uni-form-item label="关联合同" isLink>
          <uni-select-contract
            v-model="item.contractId"
            :secondPartyId="companyId"
            :name.sync="item.contractName"
            :status="5"
          ></uni-select-contract>
        </uni-form-item>
        <uni-form-item label="预计收入时间" isRequired>
          <uni-date-picker v-model="item.planTime" fields="day"></uni-date-picker>
        </uni-form-item>
        <uni-form-item label="预计收入金额(元)" isRequired>
          <uni-input-number v-model="item.planAmount" />
          <!--          <input v-model.number="item.planAmount" type="number" placeholder="请输入" class="align-right" />-->
        </uni-form-item>
        <uni-form-item label="备注">
          <textarea v-model="item.planRemark" autoHeight placeholder="请输入" class="align-right" />
        </uni-form-item>
      </uni-card>
      <view class="btn-wrapper">
        <button class="button" type="primary" @click="submit">保存</button>
      </view>
    </uni-form-custom>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: 'Add',
  data() {
    return {
      id: null,
      form: {
        projectId: uni.getStorageSync('projectId'),
        year: null,
        month: null
      },
      detailList: [{ _id: _.uniqueId() }],
      rules: {
        planName: { required: true },
        year: { required: true },
        month: { required: true }
      },
      companyId: uni.getStorageSync('companyId')
    }
  },
  onLoad(options) {
    this.id = options.id
  },
  computed: {
    expectedAmountOfIncome() {
      return _.sumBy(this.detailList, 'planAmount')
    },
    date: {
      get() {
        if (this.form.year) {
          return moment()
            .year(this.form.year)
            .month(this.form.month - 1)
            .format('YYYY-MM-DD  HH:mm:ss')
        }
        return null
      },
      set(val) {
        this.form.year = moment(val).year()
        this.form.month = moment(val).month() + 1
      }
    }
  },
  created() {
    if (this.id) {
      this.refresh()
      this.$utils.setTitle('编辑收入计划')
    }
  },
  mounted() {},
  methods: {
    refresh() {
      this.fly.construction.get('/fund/plan/get/' + this.id).then(res => {
        this.detailList = res.data.detailListVOList || []
        this.originDetailAddDTOList = _.cloneDeep(res.data.detailListVOList)
        delete res.data.detailListVOList
        this.form = res.data
      })
    },
    async submit() {
      await this.$refs.form.validate()
      for (let e of this.detailList) {
        if (!e.detailName || !e.planTime || !e.planAmount) {
          this.$utils.showToast('收入计划明细有必填项未填写')
          return false
        }
      }
      if (this.id) {
        let form = _.cloneDeep(this.form)
        this.fly.construction
          .post('fund/plan/update', {
            ...form,
            detailAddDTOList: this.detailList
          })
          .then(res => {
            this.$utils.showToast('操作成功')
            setTimeout(() => {
              this.$utils.goBack()
            }, 1000)
          })
      } else {
        let form = _.cloneDeep(this.form)
        form.detailAddDTOList = this.detailList
        this.fly.construction.post('fund/plan/income/add', form).then(res => {
          this.$utils.showToast('操作成功')
          setTimeout(() => {
            this.$utils.toUrl('/pages/fund-epc/income/detail?id=' + res.data)
          }, 1000)
        })
      }
    },
    remove() {}
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.main {
  padding-top: 15px;
}
.uni-card {
  width: 700px;
}
.point-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 30px;
  border-bottom: 1px solid #eee;
  span:last-child {
    color: red !important;
  }
}
.income-detail-header {
  display: flex;
  padding: 20px 35px 0;
  align-items: center;
  h2 {
    font-size: 16px;
  }
  image {
    width: 48px;
    height: 48px;
    margin-left: 15px;
  }
}
</style>
