<template>
  <div>
    <view class="label" :class="{ placeholder: !Boolean(text) }" @click="show">
      {{ newText || text || placeholder }}
    </view>
    <w-picker
      ref="date"
      :startYear="startYear"
      :endYear="endYear"
      :fields="fields"
      :mode="mode"
      :value="computedValue"
      @confirm="change"
    ></w-picker>
  </div>
</template>

<script>
import wPicker from '@/components/w-picker/w-picker'
import moment from 'moment'
export default {
  name: 'UniPicker',
  components: { wPicker },
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    mode: {
      type: String,
      default: 'date'
    },
    value: {
      default: null
    },
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    fields: {
      type: String,
      default: null
    },
    startYear: {
      default: 1920
    },
    endYear: {
      default: 2030
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newText: null
    }
  },
  computed: {
    text() {
      if (this.value) {
        if (this.fields === 'day') {
          return this.value.slice(0, 10)
        } else if (this.fields === 'minute') {
          return this.value.slice(0, 16)
        } else if (this.fields === 'month') {
          return this.value.slice(0, 7)
        } else if (this.fields === 'year') {
          return this.value.slice(0, 4)
        } else {
          return this.value
        }
      } else {
        return null
      }
    },
    computedValue() {
      if (this.value) {
        if (this.fields === 'day') {
          return this.value.slice(0, 10)
        } else if (this.fields === 'minute') {
          return this.value.slice(0, 16)
        } else if (this.fields === 'month') {
          return this.value.slice(0, 7)
        } else if (this.fields === 'year') {
          return this.value.slice(0, 4)
        } else {
          return this.value
        }
      } else {
        return null
      }
    }
  },
  methods: {
    change(e) {
      let value = e.value
      if (this.valueFormat) {
        value = moment(value).format(this.valueFormat)
      }
      this.$emit('input', value)
    },
    show() {
      if (this.disabled) {
        return
      }
      this.$refs.date.show()
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/styles/common';
.placeholder {
  color: @placeholderColor;
}
</style>
