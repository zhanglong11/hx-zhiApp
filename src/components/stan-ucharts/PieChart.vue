<template>
  <view class="pie_chart">
    <canvas
      id="canvasId"
      :canvasId="canvasId"
      :style="{ width: cWidth + 'px', height: cHeight + 'px' }"
      @touchstart="touchstart"
    />
    <slot />
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts'
const pieCharts = {},
  optionAs = {}
export default {
  name: 'PieChart',
  props: {
    dataAs: {
      //数据
      type: Object,
      default: () => ({})
    },
    basicAs: {
      ////通用基础项设置
      type: Object,
      default: () => ({})
    },
    legendAs: {
      //图例设置
      type: Object,
      default: () => ({})
    },
    extraAs: {
      //详情请看 http://doc.ucharts.cn/1172130
      type: Object,
      default: () => ({})
    },
    width: {
      //图标宽度
      type: Number,
      default: 750
    },
    height: {
      //图标高度
      type: Number,
      default: 500
    },
    valueKey: {
      type: String,
      default: 'series'
    },
    canvasId: {
      type: String,
      default: `pie_canvas_${Math.ceil(Math.random(5) * 10000)}`
    },
    colors: {
      type: Array,
      default: () => ['#1890ff', '#2fc25b', '#facc14', '#f04864', '#8543e0', '#90ed7d']
    }
  },
  data() {
    return {}
  },
  computed: {
    cWidth() {
      return uni.upx2px(this.width)
    },
    cHeight() {
      return uni.upx2px(this.height)
    }
  },
  watch: {
    dataAs: {
      immediate: false,
      handler() {
        this.init()
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      let defaultOption = {
        //通用基础项设置 basicAs
        $this: this, //this实例组件内使用图表，必须传入this实例
        canvasId: this.canvasId, //页面组件canvas-id，支付宝中为id
        type: 'pie', //图表类型，可选值为pie、line、column、area、ring、radar、arcbar、gauge、candle、bar、mix、rose、word
        padding: [15, 15, 0, 15], //画布填充边距，顺序为上右下左，同css，但必须4位
        colors: this.colors, //图表配色方案，不传则使用系统默认配置
        rotate: false, //是否横屏展示
        rotateLock: true, //	锁定横屏模式，如果在支付宝和百度小程序中使用横屏模式，请赋值true，否则每次都会旋转90度。跨端使用通过uni-app的条件编译来赋值
        animation: true, //是否动画展示
        dataLabel: true, //是否在图表中显示数据标签内容值
        duration: 1000, //动画展示时长单位毫秒
        fontSize: 12, //全局默认字体大小（可选，单位为px，默认13px）高分屏不必乘像素比，自动根据pixelRatio计算
        background: '#ffffff', //canvas背景颜色（如果页面背景颜色不是白色请设置为页面的背景颜色，默认#ffffff）无作用
        pixelRatio: 1, //像素比，默认为1，仅支付宝小程序需要大于1，其他平台必须为1
        width: this.cWidth, //canvas宽度，单位为px，支付宝高分屏需要乘像素比(pixelRatio)
        height: this.cHeight, //canvas高度，单位为px，支付宝高分屏需要乘像素比

        //数据列表配置项 dataAS
        series: this.dataAs[this.valueKey], //数据列表

        //图列配置 legendAs
        legend: {
          show: true, //是否显示各类别的图例标识
          position: 'top',
          float: 'left',
          padding: 10,
          margin: 0
        },
        //扩展配置 extraAs 详情请看 http://doc.ucharts.cn/1172130
        extra: {
          pie: {
            lableWidth: 15
          }
        }
      }
      optionAs[this.canvasId] = Object.assign(defaultOption, this.basicAs, this.legendAs, this.extraAs)
      pieCharts[this.canvasId] = new uCharts(optionAs[this.canvasId])
    },
    touchstart(e) {
      pieCharts[this.canvasId].touchLegend(e, {
        animation: false
      })
      pieCharts[this.canvasId].showToolTip(e, {
        format: function(item) {
          if (typeof item.data === 'object') {
            return `${item.name}:${item.data.value}`
          } else {
            return `${item.name}:${item.data}`
          }
        }
      })
    }
  }
}
</script>

<style></style>
