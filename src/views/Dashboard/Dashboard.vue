<template>
  <div class="content">
    <el-row class="board-echats">
      <el-col :span="8">
        <div class="board-echats-box">
          <div ref="chartA" class="chart"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="board-echats-box">
          <div ref="chartB" class="chart"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="board-echats-box">
          <div ref="chartC" class="chart"></div>
        </div>
      </el-col>
    </el-row>
    <el-row class="board-user">
      <el-col :span="24">
        <com-user-summary :height="userSummaryH"></com-user-summary>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { commMixin } from '@/utils/commMixin'
import ComUserSummary from '../components/ComUserSummary.vue'
export default {
  mixins: [commMixin],
  components: {
    ComUserSummary
  },
  data() {
    return {
      eChartA: null,
      eChartB: null,
      eChartC: null,
      userSummaryH: '0'
    }
  },
  created() {
    this.initFrameH('userSummaryH', 120)
    window.onresize = () => {
      this.initFrameH('userSummaryH', 120)
    }
  },
  methods: {
    initChartA() {
      console.log("init Chart A ============")
      const option = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ]
          }
        ]
      };
      const chartDom = this.$refs.chartA
      this.eChartA = echarts.init(chartDom, null, { width: 'auto' })
      option && this.eChartA.setOption(option, true)
    },
    initChartB() {
      const option = {
        title: {
          x: 'center',
          text: 'ECharts例子个数统计',
          subtext: 'Rainbow bar example',
          link: 'http://echarts.baidu.com/doc/example.html'
        },
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          show: false,
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        grid: {
          borderWidth: 0,
          y: 80,
          y2: 60
        },
        xAxis: [
          {
            type: 'category',
            show: false,
            data: ['Line', 'Bar', 'Scatter', 'K', 'Pie', 'Radar', 'Chord', 'Force', 'Map', 'Gauge', 'Funnel']
          }
        ],
        yAxis: [
          {
            type: 'value',
            show: false
          }
        ],
        series: [
          {
            name: 'ECharts例子个数统计',
            type: 'bar',
            itemStyle: {
              normal: {
                color: function (params) {
                  // build a color map as your need.
                  var colorList = [
                    '#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#27727B',
                    '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD',
                    '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0'
                  ];
                  return colorList[params.dataIndex]
                },
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{b}\n{c}'
                }
              }
            },
            data: [12, 21, 10, 4, 12, 5, 6, 5, 25, 23, 7],
            markPoint: {
              tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0,0,0,0)',
                formatter: function (params) {
                  return `<img src="${params.data.symbol.replace('image://', '')}" />`;
                }
              },
              data: [
                { xAxis: 0, y: 350, name: 'Line', symbolSize: 20, symbol: 'image://../asset/ico/折线图.png' },
                { xAxis: 1, y: 350, name: 'Bar', symbolSize: 20, symbol: 'image://../asset/ico/柱状图.png' },
                { xAxis: 2, y: 350, name: 'Scatter', symbolSize: 20, symbol: 'image://../asset/ico/散点图.png' },
                { xAxis: 3, y: 350, name: 'K', symbolSize: 20, symbol: 'image://../asset/ico/K线图.png' },
                { xAxis: 4, y: 350, name: 'Pie', symbolSize: 20, symbol: 'image://../asset/ico/饼状图.png' },
                { xAxis: 5, y: 350, name: 'Radar', symbolSize: 20, symbol: 'image://../asset/ico/雷达图.png' },
                { xAxis: 6, y: 350, name: 'Chord', symbolSize: 20, symbol: 'image://../asset/ico/和弦图.png' },
                { xAxis: 7, y: 350, name: 'Force', symbolSize: 20, symbol: 'image://../asset/ico/力导向图.png' },
                { xAxis: 8, y: 350, name: 'Map', symbolSize: 20, symbol: 'image://../asset/ico/地图.png' },
                { xAxis: 9, y: 350, name: 'Gauge', symbolSize: 20, symbol: 'image://../asset/ico/仪表盘.png' },
                { xAxis: 10, y: 350, name: 'Funnel', symbolSize: 20, symbol: 'image://../asset/ico/漏斗图.png' },
              ]
            }
          }
        ]
      };
      const chartDom = this.$refs.chartB
      this.eChartB = echarts.init(chartDom, null, { width: 'auto' })
      option && this.eChartB.setOption(option, true)
    },
    initChartC() {
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '视频广告']
        },
        toolbox: {
          show: false,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            data: [150, 232, 201, 154, 190, 330, 410]
          }
        ]
      };
      const chartDom = this.$refs.chartC
      this.eChartC = echarts.init(chartDom, null, { width: 'auto' })
      option && this.eChartC.setOption(option, true)
    }
  },
  mounted() {
    setTimeout(() => {
      this.initChartA()
      this.initChartB()
      this.initChartC()
      this.$echartsResize(this.eChartA)
      this.$echartsResize(this.eChartB)
      this.$echartsResize(this.eChartC)
    }, 300)
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content {
  height: 100%;
  background-color: $body-main-box;

  .board-echats {
    .board-echats-box {
      height: 350px;
      background: white;
      border-radius: 3px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      margin: 10px;
    }
  }

  .board-user {

    .board-user-box {
      height: calc(100vh - 440px);
      background: white;
      border-radius: 3px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      margin: 10px;
      padding: 5px;
    }
  }

  .chart {
    min-height: 350px;
    width: 100%;
    height: 100%;
    padding: 0px;
    border-radius: 3px;
  }
}
</style>
