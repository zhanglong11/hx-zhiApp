<template>
  <textarea
    :value="value"
    auto-height
    :maxlength="-1"
    class="align-right"
    :placeholder="placeholder"
    disabled
    @click="$utils.toUrl(`/pages/recruit-manage-epc/winning/select-tender?&key=${key}`)"
  />
</template>
<script>
import { uniqueId } from 'lodash'
export default {
  name: 'SelectTender',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    name: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      key: ''
    }
  },
  created() {
    this.key = uniqueId('tender_')
    uni.$on('update:select-tender', data => {
      if (data.key === this.key) {
        let info = data.data
        this.$emit('input', info.name)
        this.$emit('update:id', info.id)
        this.$emit('update:name', info.name)
        this.$emit('update:code', info.code)
        this.$emit('update:type', info.type)
        this.$emit('update:mode', info.mode)
        this.$emit('change', {})
      }
    })
  }
}
</script>
<style lang="less" scoped></style>
