<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card v-if="$hasPower('KanbanInfo')" title="看板信息" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('ProjectKanban')" @click="toUrl('/pages/board/project/project')">
              <image class="list-icon" src="@/static/images/application/ProjectKanban.png"></image>
              <p>项目看板</p>
            </li>
            <li v-if="$hasPower('ProjectIntroduction')" @click="toUrl('/pages/board/project/overview/introduction')">
              <image class="list-icon" src="@/static/images/application/ProjectIntroduction.png"></image>
              <p>项目介绍</p>
            </li>
            <li v-if="$hasPower('EquipmentMonitoring')" @click="toUrl('/pages/board/video/video')">
              <image class="list-icon" src="@/static/images/application/EquipmentMonitoring.png"></image>
              <p>视频监控</p>
            </li>
            <li v-if="$hasPower('Milepost')" @click="toUrl('/pages/board/milestone/milestone')">
              <image class="list-icon" src="@/static/images/application/Milepost.png"></image>
              <p>里程碑</p>
            </li>
          </ul>
        </uni-card>
        <!-- EPC功能 start -->
        <uni-card v-if="$hasPower('ProjectEpc')" title="立项管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('ProjectMeetingEpc')" @click="toUrl('/pages/project-approval-Epc/meeting-list')">
              <image class="list-icon" src="@/static/images/application/ProjectMeetingEpc.png"></image>
              <p>立项会议</p>
            </li>
            <li v-if="$hasPower('ProjectPlanEpc')" @click="toUrl('/pages/project-approval-Epc/control-plan-list')">
              <image class="list-icon" src="@/static/images/application/ProjectPlanEpc.png"></image>
              <p>总控计划</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('EarlyManageEpc')" title="前期管理" :hideTitle="false">
          <ul class="list">
            <li
              v-if="$hasPower('FileExecutorEpc')"
              @click="toUrl('/pages/early-stage-manage-epc/early-stage-data-prepare/index')"
            >
              <image class="list-icon" src="@/static/images/application/FileExecutorEpc.png"></image>
              <p>前期资料准备</p>
            </li>
            <li
              v-if="$hasPower('FileArchiveEpc')"
              @click="toUrl('/pages/early-stage-manage-epc/early-stage-file-archive/index')"
            >
              <image class="list-icon" src="@/static/images/application/FileArchiveEpc.png"></image>
              <p>前期资料归档</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('RecruitManageEpc')" title="招采管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('TenderListEpc')" @click="toUrl('/pages/recruit-manage-epc/tender/index')">
              <image class="list-icon" src="@/static/images/application/TenderListEpc.png"></image>
              <p>招标公告登记</p>
            </li>
            <li v-if="$hasPower('WinningListEpc')" @click="toUrl('/pages/recruit-manage-epc/winning/index')">
              <image class="list-icon" src="@/static/images/application/WinningListEpc.png"></image>
              <p>中标资料登记</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('CompletionEpc')" title="竣工管理" :hideTitle="false">
          <ul class="list">
            <li
              v-if="$hasPower('ExecutorEpc')"
              @click="toUrl('/pages/completion-epc/data-manage/early-stage-data-prepare/index')"
            >
              <image class="list-icon" src="@/static/images/application/ExecutorEpc.png"></image>
              <p>竣工资料准备</p>
            </li>
            <li
              v-if="$hasPower('ArchiveEpc')"
              @click="toUrl('/pages/completion-epc/data-manage/early-stage-file-archive/index')"
            >
              <image class="list-icon" src="@/static/images/application/ArchiveEpc.png"></image>
              <p>竣工资料归档</p>
            </li>
            <li
              v-if="$hasPower('ProjectFirstInspectList')"
              @click="toUrl('/pages/completion-epc/project-first-inspect/index')"
            >
              <image class="list-icon" src="@/static/images/application/ProjectFirstInspectList.png"></image>
              <p>工程初验管理</p>
            </li>
            <li
              v-if="$hasPower('OverInspectListEpc')"
              @click="toUrl('/pages/completion-epc/project-over-inspect/index')"
            >
              <image class="list-icon" src="@/static/images/application/OverInspectListEpc.png"></image>
              <p>竣工验收管理</p>
            </li>
            <li v-if="$hasPower('ProjectOverEpc')" @click="toUrl('/pages/completion-epc/project-over/index')">
              <image class="list-icon" src="@/static/images/application/ProjectOverEpc.png"></image>
              <p>项目移交</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('FundManageEpc')" title="资金管理" :hideTitle="false">
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
        <!-- EPC功能 start -->
        <uni-card v-if="$hasPower('Quality')" title="质量管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('QualityControlQualityCheck')" @click="toUrl('/pages/inspect/index')">
              <image class="list-icon" src="@/static/images/application/QualityControlQualityCheck.png"></image>
              <p>质量检查</p>
            </li>
            <li v-if="$hasPower('QualityAcceptance')" @click="toUrl('/pages/quality/statistics/acceptance/list')">
              <image class="list-icon" src="@/static/images/application/QualityAcceptance.png"></image>
              <p>质量验收</p>
            </li>
            <li v-if="$hasPower('MeasureQuantity')" @click="toUrl('/pages/quality/measure/list')">
              <image class="list-icon" src="@/static/images/application/MeasureQuantity.png"></image>
              <p>实测实量</p>
            </li>
            <li v-if="$hasPower('QualityStatistics')" @click="toUrl('/pages/quality/statistics/chartview/index')">
              <image class="list-icon" src="@/static/images/application/QualityStatistics.png"></image>
              <p>质量统计</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('Safe')" title="安全管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('SafeProcessCheck')" @click="$utils.toUrl('/pages/safe/index')">
              <image class="list-icon" src="@/static/images/application/SafeProcessCheck.png"></image>
              <p>安全检查</p>
            </li>
            <!-- <li @click="$utils.toUrl('/pages/safeCivilizationCheck/index')">
              <image class="list-icon" src="@/static/images/application/anquanwenming.png"></image>
              <p>安全文明</p>
            </li> -->
            <li v-if="$hasPower('SafeStatistics')" @click="toUrl('/pages/safe/statistics/chartview/index')">
              <image class="list-icon" src="@/static/images/application/SafeStatistics.png"></image>
              <p>安全统计</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('AppSchedule')" title="进度管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('ScheduleStatistics')" @click="$utils.toUrl('/pages/schedule/statistics')">
              <image class="list-icon" src="@/static/images/application/ScheduleStatistics.png"></image>
              <p>进度统计</p>
            </li>
            <li v-if="$hasPower('ScheduleFillIn')" @click="$utils.toUrl('/pages/schedule/step-1')">
              <image class="list-icon" src="@/static/images/application/ScheduleFillIn.png"></image>
              <p>进度填报</p>
            </li>
            <li v-if="$hasPower('ScheduleSimulation')" @click="progressSimulation(5)">
              <image class="list-icon" src="@/static/images/application/ScheduleSimulation.png"></image>
              <p>进度模拟</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('Supplies')" title="物资管理" :hideTitle="false">
          <ul class="list">
            <li
              v-if="$hasPower('MaterialManage')"
              @click="$utils.toUrl('/pages/application/application-material?type=1')"
            >
              <image class="list-icon" src="@/static/images/application/MaterialManage.png"></image>
              <p>材料管理</p>
            </li>
            <li
              v-if="$hasPower('EquipmentManage')"
              @click="$utils.toUrl('/pages/application/application-material?type=2')"
            >
              <image class="list-icon" src="@/static/images/application/EquipmentManage.png"></image>
              <p>设备管理</p>
            </li>
          </ul>
        </uni-card>
        <!-- 开发商版本功能 start -->
        <uni-card v-if="$hasPower('Material')" title="材料管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('MaterialPlanListView')" @click="$utils.toUrl('/pages/material/planList/index')">
              <image class="list-icon" src="@/static/images/application/MaterialPlanListView.png"></image>
              <p>甲供材计划单</p>
            </li>
            <li
              v-if="$hasPower('procurementPartyDetail')"
              @click="$utils.toUrl('/pages/material/procurementParty/index')"
            >
              <image class="list-icon" src="@/static/images/application/procurementPartyDetail.png"></image>
              <p>采购通知</p>
            </li>
            <li
              v-if="$hasPower('procurementSupplierDetail')"
              @click="$utils.toUrl('/pages/material/procurementSupplier/index')"
            >
              <image class="list-icon" src="@/static/images/application/procurementSupplierDetail.png"></image>
              <p>采购通知</p>
            </li>
            <li
              v-if="$hasPower('MaterialConfirmCodeDetail')"
              @click="$utils.toUrl('/pages/material/confirmation/index')"
            >
              <image class="list-icon" src="@/static/images/application/MaterialConfirmCodeDetail.png"></image>
              <p>材料确认单</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('ContractMerchants')" title="合同管理" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('ContractDetailMerchants')" @click="$utils.toUrl('/pages/agreement/index')">
              <image class="list-icon" src="@/static/images/application/ContractDetailMerchants.png"></image>
              <p>合同管理</p>
            </li>
          </ul>
        </uni-card>
        <!-- 开发商版本功能 end -->
        <uni-card title="常用办公" :hideTitle="false">
          <ul class="list">
            <!-- 施工版本功能 start -->
            <li v-if="$hasPower('ConstructionLog')" @click="$utils.toUrl('/pages/log/log')">
              <image class="list-icon" src="@/static/images/application/ConstructionLog.png"></image>
              <p>施工日志</p>
            </li>
            <!-- 施工版本功能 end -->
            <!-- 精装修版本功能 start -->
            <li v-if="$hasPower('DecorationProgressSmartDecoration')" @click="$utils.toUrl('/pages/task/progress')">
              <image class="list-icon" src="@/static/images/application/DecorationProgressSmartDecoration.png"></image>
              <p>工序管理</p>
            </li>
            <li
              v-if="$hasPower('ConstructionLogSmartDecoration')"
              @click="$utils.toUrl('/pages/log-SmartDecoration/log')"
            >
              <image class="list-icon" src="@/static/images/application/ConstructionLogSmartDecoration.png"></image>
              <p>施工日志</p>
            </li>
            <!-- 精装修版本功能 end -->
            <!--
            <li @click="$utils.toUrl('')">
              <image class="list-icon" src="@/static/images/application/kaoqinshezhi.png"></image>
              <p>考勤设置</p>
            </li>
             -->
            <li v-if="$hasPower('Contract')" @click="$utils.toUrl('/pages/contract/index')">
              <image class="list-icon" src="@/static/images/application/Contract.png"></image>
              <p>合同管理</p>
            </li>
            <li v-if="$hasPower('BimModal')" @click="$utils.toUrl(progressSimulation(1))">
              <image class="list-icon" src="@/static/images/application/Model.png"></image>
              <p>BIM模型</p>
            </li>
            <li v-if="$hasPower('Labour')" @click="$utils.toUrl('/pages/labour/labour-list')">
              <image class="list-icon" src="@/static/images/application/Labour.png"></image>
              <p>劳务管理</p>
            </li>
            <li v-if="$hasPower('LabourSafety')" @click="$utils.toUrl('/pages/labour/safety/safety-list')">
              <image class="list-icon" src="@/static/images/application/LabourSafety.png"></image>
              <p>安全培训</p>
            </li>
            <li v-if="$hasPower('LabourWorker')" @click="$utils.toUrl('/pages/labour/healthy/healthy-user-list')">
              <image class="list-icon" src="@/static/images/application/LabourWorker.png"></image>
              <p>人员健康</p>
            </li>
            <li
              v-if="$hasPower('LabourCompanyList')"
              @click="$utils.toUrl('/pages/labour/healthy/healthy-vehicle-list')"
            >
              <image class="list-icon" src="@/static/images/application/LabourCompanyList.png"></image>
              <p>车辆消毒</p>
            </li>
            <li
              v-if="$hasPower('EnvironmentalMonitoring')"
              @click="$utils.toUrl('/pages/environmentalMonitoring/list')"
            >
              <image class="list-icon" src="@/static/images/application/EnvironmentalMonitoring.png"></image>
              <p>环境监测</p>
            </li>
          </ul>
        </uni-card>
        <uni-card v-if="$hasPower('DataManage')" title="知识库" :hideTitle="false">
          <ul class="list">
            <li v-if="$hasPower('GroupDataList')" @click="$utils.toUrl('/pages/document/index')">
              <image class="list-icon" src="@/static/images/application/GroupDataList.png"></image>
              <p>集团资料</p>
            </li>
            <li v-if="$hasPower('IndustryDataList')" @click="$utils.toUrl('/pages/document/index')">
              <image class="list-icon" src="@/static/images/application/IndustryDataList.png"></image>
              <p>行业资料</p>
            </li>
            <li v-if="$hasPower('ProjectDataList')" @click="$utils.toUrl('/pages/document/index')">
              <image class="list-icon" src="@/static/images/application/ProjectDataList.png"></image>
              <p>项目资料</p>
            </li>
          </ul>
        </uni-card>
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'Application',
  data() {
    return {}
  },
  computed: {
    projectId() {
      return this.$store.state.project.projectId
    }
  },
  methods: {
    // 进度模拟
    progressSimulation(type) {
      this.$utils.toUrl(`/pages/bim-model/index?id=&projectId=${this.projectId}&showBtn=true&bimType=${type}`)
    },
    // 跳转路由
    toUrl(url) {
      this.$utils.toUrl(url)
    }
  }
}
</script>

<style scoped lang="less">
@import url('./application.less');
</style>
