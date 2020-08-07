<template>
  <div class="main">
    <scroll-view class="scroll-roll" scroll-y>
      <div class="wrap">
        <uni-card>
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
      </div>
    </scroll-view>
  </div>
</template>

<script>
export default {
  name: 'ApplicationCompletionEpc',
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
