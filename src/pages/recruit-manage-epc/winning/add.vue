<template>
  <view class="main">
    <div>
      <uni-form-custom ref="form" class="main-body" :model="form" :rules="rules">
        <uni-card isForm>
          <uni-form-item label="招标公告名称" prop="invitationBidName" isLink>
            <SelectTender
              :id.sync="form.invitationBidId"
              v-model="form.invitationBidName"
              :code.sync="form.invitationBidCode"
              :type.sync="form.type"
              :mode.sync="form.mode"
              @change="handleSelectTender"
            />
          </uni-form-item>
          <uni-form-item label="招标编号" prop="invitationBidCode">
            <textarea v-model.trim="form.invitationBidCode" disabled auto-height />
          </uni-form-item>
          <uni-form-item label="招标类型" prop="type">
            <uni-select v-model="form.type" :options="tenderTypeList" disabled></uni-select>
          </uni-form-item>
          <uni-form-item label="中标方式" prop="mode">
            <uni-select v-model="form.mode" :options="tenderModeList" disabled></uni-select>
          </uni-form-item>
          <uni-form-item label="中标单位" prop="tenderCompany">
            <textarea v-model.trim="form.tenderCompany" auto-height placeholder="请输入中标单位" />
          </uni-form-item>
          <uni-form-item label="中标金额(元)" prop="tenderMoney">
            <uni-input-number v-model="form.tenderMoney" placeholder="请输入中标金额" />
          </uni-form-item>
          <uni-form-item label="项目经理" prop="projectManager">
            <textarea v-model.trim="form.projectManager" auto-height placeholder="请输入项目经理" />
          </uni-form-item>
          <uni-form-item label="电话" prop="mobile">
            <input v-model="form.mobile" type="number" placeholder="请输入电话" />
          </uni-form-item>
          <uni-form-item label="公示日期" isLink prop="publicityDate">
            <uni-date-picker v-model="form.publicityDate" fields="day" mode="date"></uni-date-picker>
          </uni-form-item>
          <uni-form-item label="是否联合体中标" isLink prop="isCombo">
            <uni-select
              v-model="form.isCombo"
              :options="[
                { label: '是', value: 1 },
                { label: '否', value: 0 }
              ]"
            ></uni-select>
          </uni-form-item>
          <uni-form-item label="联合体工作范围" prop="comboWorkingRange">
            <textarea v-model.trim="form.comboWorkingRange" auto-height placeholder="请输入联合体工作范围" />
          </uni-form-item>
          <uni-form-item label="评审专家" prop="evaluationExpert">
            <input v-model.trim="form.evaluationExpert" placeholder="请输入评审专家" />
          </uni-form-item>
        </uni-card>
        <view class="card-title-outer">
          <view class="title">
            <view>管理人员明细</view>
            <uni-icons class="icon" color="#2EB04C" type="plus-filled" size="24" @click="handleAddManager"></uni-icons>
          </view>
        </view>
        <block v-if="personParamDTOList.length">
          <block v-for="(item, index) in personParamDTOList" :key="index" style="margin:0 5px">
            <uni-form-custom :ref="'manage' + index" :model="item" :rules="subRules" class="border-top">
              <uni-card>
                <icon class="icon-clear" type="clear" size="26" @click="handleDeleteItem(index)" />
                <uni-form-item label="序号">
                  <view>{{ index + 1 > 9 ? index + 1 : '0' + (index + 1) }}</view>
                </uni-form-item>
                <uni-form-item label="姓名" isRequired prop="name">
                  <input v-model.trim="item.name" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="身份证号" isRequired prop="idcardNumber">
                  <input v-model.trim="item.idcardNumber" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="联系电话" isRequired prop="mobile">
                  <input v-model="item.mobile" type="number" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="资格证书" prop="credentials">
                  <input v-model="item.credentials" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="资格等级" prop="qualificationLevel">
                  <input v-model="item.qualificationLevel" class="uni-input" placeholder="请输入" />
                </uni-form-item>
                <uni-form-item label="备注" align="left" prop="remark">
                  <textarea v-model.trim="item.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
                </uni-form-item>
              </uni-card>
            </uni-form-custom>
          </block>
        </block>
        <!-- 备注和附件信息开始 -->
        <uni-card isForm>
          <uni-form-item label="备注" align="left" class="block-item" prop="remark">
            <textarea v-model.trim="form.remark" :maxlength="-1" placeholder="请输入备注信息" auto-height />
          </uni-form-item>
          <uni-form-item class="file-item" label="附件" prop="fileIds">
            <uni-attachment v-model="form.fileIds" edit></uni-attachment>
          </uni-form-item>
        </uni-card>
        <!-- 备注和附件信息结束 -->
        <view class="btn-wrapper">
          <button class="button" :disabled="isLoading" type="primary" @click="handleWinningSubmit(true)">保存</button>
        </view>
      </uni-form-custom>
    </div>
  </view>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import _ from 'lodash'
import Api from '../api'
import SelectTender from '../components/SelectTender'
import regular from '@/lib/regular'
export default {
  name: 'TenderEdit',
  components: { SelectTender },
  data() {
    return {
      id: null,
      isLoading: false,
      form: {
        projectId: wx.getStorageSync('projectId')
      },
      rules: {
        invitationBidName: { required: true },
        invitationBidCode: { required: true },
        mode: { required: true },
        type: { required: true },
        mobile: {},
        tenderCompany: { required: true },
        tenderMoney: [{ required: true }, { pattern: regular.toFixed2, message: '保留两位小数' }],
        projectManager: { required: true },
        publicityDate: { required: true },
        isCombo: { required: true }
      },
      subRules: {
        name: { required: true },
        idcardNumber: { required: true },
        mobile: { required: true }
      },
      personParamDTOList: []
    }
  },
  computed: {
    ...mapGetters(['projectId']),
    tenderTypeList() {
      return this.$getArgList('tenderType')
    },
    tenderModeList() {
      return this.$getArgList('tenderMode')
    }
  },
  onLoad(options) {
    this.id = options.id
    if (this.id) {
      this.getDetail()
      this.$utils.setTitle('编辑中标资料')
    }
  },
  onNavigationBarButtonTap(obj) {
    this.handleWinningSubmit(false)
  },
  methods: {
    async getDetail() {
      let res = await Api.getWinningDetail(this.id)
      this.form = { ...res.data, projectId: this.projectId }
      this.personParamDTOList = res.data.personParamDTOList || []
    },
    handleSelectTender(data) {
      console.log(data)
    },
    //添加管理人员
    handleAddManager() {
      let obj = {
        name: '',
        idcardNumber: '',
        mobile: '',
        credentials: '',
        qualificationLevel: '',
        remark: ''
      }
      this.personParamDTOList.push(obj)
    },
    handleDeleteItem(index) {
      this.personParamDTOList.splice(index, 1)
    },
    // 点击保存按钮
    async handleWinningSubmit(isSubmit) {
      // 开启表单验证
      console.log(this.$refs.form)
      await this.$refs.form.validate()
      await Promise.all(
        this.personParamDTOList.map((item, index) => {
          return this.$refs['manage' + index][0].validate()
        })
      )
      let params = {
        ...this.form,
        publicityDate: moment(this.form.publicityDate).format('YYYY-MM-DD 00:00:00'),
        personParamDTOList: this.personParamDTOList
      }
      this.isLoading = true
      isSubmit ? await Api.submitWinning(params) : await Api.addWinning(params)
      this.$utils.showToast('操作成功')
      setTimeout(() => {
        this.isLoading = true
        this.$utils.goBack()
      }, 1500)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('add.less');
</style>
