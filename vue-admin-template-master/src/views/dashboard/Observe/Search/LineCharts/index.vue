<template>
  <div>
    <div class="header">
      <span>搜索用户数</span>
      <svg t="1680972285058" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2620" width="20" height="20"><path d="M512 97.52381c228.912762 0 414.47619 185.563429 414.47619 414.47619s-185.563429 414.47619-414.47619 414.47619S97.52381 740.912762 97.52381 512 283.087238 97.52381 512 97.52381z m0 73.142857C323.486476 170.666667 170.666667 323.486476 170.666667 512s152.81981 341.333333 341.333333 341.333333 341.333333-152.81981 341.333333-341.333333S700.513524 170.666667 512 170.666667z m36.571429 268.190476v292.571428h-73.142858V438.857143h73.142858z m0-121.904762v73.142857h-73.142858v-73.142857h73.142858z" p-id="2621" fill="#d9d9d9"></path></svg>
    </div>
    <div class="main">
      <span class="search-header">12321</span>
      <span>17.1</span>
      <svg t="1681018293695" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4402" width="16" height="16"><path d="M631.168 426.666667a21.333333 21.333333 0 0 1 15.061333 36.437333l-119.125333 119.125333a21.333333 21.333333 0 0 1-30.208 0l-119.125333-119.125333A21.333333 21.333333 0 0 1 392.832 426.666667h238.336z" fill="#1296db" p-id="4403"></path></svg></span>
      <svg t="1681023322793" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7036" width="16" height="16"><path d="M522.24 626.368l166.4-221.888A12.8 12.8 0 0 0 678.4 384H345.6a12.8 12.8 0 0 0-10.24 20.48l166.4 221.888a12.8 12.8 0 0 0 20.48 0z" fill="#d81e06" p-id="7037"></path></svg></span>                 
    </div>
    <div class="footer" ref="lineCharts"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'index',
  data () {
    return {

    };
  },
  mounted() {
    let myCharts = echarts.init(this.$refs.lineCharts);
    myCharts.setOption({
      xAxis: {
        type: 'category',
        show: false,
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: 'line',
          data:[10,16,31,8,25,13,23,17,28],
          // 拐点样式设置
          itemStyle: {
            opacity: 0, //隐藏拐点
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
                  color: "skyblue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              // global: false, // 缺省为 false
            },
          },
        }
      ],

      //调整图标布局
      grid: {
        left: -20,
        right: 0,
        top: 0,
        bottom: 0,
      },
    })
  },
  methods: {}
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
}
.header span {
  margin-right: 20px;
  color: #ccc;
}

.search-header {
  margin-right: 20px;
  font-size: 22px;
}

.main {
  margin-top: 10px;
}

.el-card__body {
  padding-top: 10px;
}

.footer {
  width: 100%;
  height: 40px;
}
</style>