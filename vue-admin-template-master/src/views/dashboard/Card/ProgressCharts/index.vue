<template>
  <div class="lineCharts" ref="charts">
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "ProgressCharts",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 最小值与最大值
        min: 0,
        max: 100
      },
      yAxis: {
        // 隐藏y轴
        show: false,
        // 均分（在y轴均分可以使图表横向排列）
        type: "category",
      },
      // 系列
      series: [
        {
          type: "bar",
          data: [78],
          // 柱状图的宽度
          barWidth: 10,
          color: 'yellowgreen',
          // 背景颜色设置
          showBackground: true,
          backgroundStyle: {
            color: '#eee'
          },
          // 文本
          label: {
            show: true,
            // 改变文本内容
            formatter: '|',
            // 文本标签位置
            position: 'right'
          }
        },
      ],
      //调整图标布局
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style scoped>
.lineCharts {
  width: 100%;
  height: 100%;
}
</style>