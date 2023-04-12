<template>
  <div class="lineCharts" ref="charts">
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "BarCharts",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        // 均分
        type: "category",
      },
      yAxis: {
        // 隐藏y轴
        show: false,
      },
      // 系列
      series: [
        {
          type: "bar",
          data: [10, 7, 32, 8, 26, 14, 23,21,30,16],
          
        },
      ],
      //调整图标布局
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      // 提示信息组件
      tooltip:{}
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