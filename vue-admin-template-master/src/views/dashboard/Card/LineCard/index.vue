<template>
  <div class="lineCharts" ref="charts">
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "index",
  mounted() {
    // 初始化echarts实例
    let lineCharts = echarts.init(this.$refs.charts);
    // 配置数据
    lineCharts.setOption({
      xAxis: {
        // 隐藏x轴
        show: false,
        type: "category",
      },
      yAxis: {
        // 隐藏y轴
        show: false,
      },
      // 系列
      series: [
        {
          type: "line",
          data: [10, 7, 32, 8, 26, 14, 23,21,30,16,37],
          // 拐点样式设置
          itemStyle: {
            opacity: 0, //隐藏拐点
          },
          // 折线样式设置
          lineStyle: {
            color: "purple", //折线颜色修改
          },
          smooth: true,     //折线平滑样式
          // 填充样式
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          
        },
      ],
      //调整图标布局
      grid: {
        left: -20,
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