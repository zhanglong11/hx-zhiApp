<template>
  <input :value="value" :placeholder="placeholder" class="align-right" @change="changeValue" @input="getVal" />
</template>

<script>
export default {
  name: 'UniInputNumber',
  components: {},
  props: {
    value: {},
    disabled: {
      type: Boolean,
      default: false
    },
    max: {
      type: [String, Number]
    },
    placeholder: {
      type: String,
      default: '请输入'
    }
  },
  data() {
    return {
      initVal: null
    }
  },
  methods: {
    refresh() {},
    changeValue() {
      this.$emit('input', _.isFinite(this.initVal - 0) ? _.round(this.initVal, 2) - 0 : null)
    },
    getVal(e) {
      let val = e.target.value
      if (val.includes('.') && _.endsWith(val, '.')) {
        this.initVal = val
        this.$emit('input', val)
        return
      }
      if (val > this.max) {
        this.initVal = val
        this.$emit('input', this.max)
        return
      }
      let initVal = _.isFinite(val - 0) ? val - 0 : null
      this.initVal = initVal
      this.$emit('input', initVal)
    }
  }
}
</script>

<style scoped lang="less"></style>
