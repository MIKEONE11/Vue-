<template>
  <div>
    <el-card class="box-card" style="margin: 10px">
      <div slot="header" class="clearfix">
        <!-- 
          v-model="activeName" @tab-click="handleClick"
          date中activeName: "销售额"，则表示默认显示销售额
         -->
        <!-- 头部左侧内容 -->
        <el-tabs class="tab" v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 头部右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker v-model="date" class="data" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" value-format="yyyy-MM-dd">
          </el-date-picker>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="18">
            <!-- 容器 -->
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6">
            <h3>门店{{title}}排名</h3>
            <ul>
              <li>
                <span class="left">1</span>
                <span>肯德基</span>
                <span class="right">1234</span>
              </li>
              <li>
                <span class="left">2</span>
                <span>必胜客</span>
                <span class="right">1234</span>
              </li>
              <li>
                <span class="left">3</span>
                <span>麦当劳</span>
                <span class="right">1234</span>
              </li>
              <li>
                <span class="left1">4</span>
                <span>麦当劳</span>
                <span class="right">1234</span>
              </li>
              <li>
                <span class="left1">5</span>
                <span>麦当劳</span>
                <span class="right">1234</span>
              </li>
              <li>
                <span class="left1">6</span>
                <span>麦当劳</span>
                <span class="right">1234</span>
              </li>
              <li>
                <span class="left1">7</span>
                <span>麦当劳</span>
                <span class="right">1234</span>
              </li>
            </ul>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import * as echarts from "echarts";
// dayjs：用于获取日期
import dayJs from "dayjs";
import { mapState } from "vuex";

export default {
  name: "Sale",
  data() {
    return {
      activeName: "sale",
      myCharts: null,
      // 收集日历的数据
      date: [],
    };
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts);
    // 配置数据
    this.myCharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: this.listState.orderFullYearAxis,
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
         {  //显示Y轴的线
            axisLine: {
                show: true
            },
            //显示Y轴刻度
            axisTick: {
                show: true
            }
        }
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.listState.orderFullYear,
        },
      ],
    });
    // mounted第一次渲染的时候是没有数据的，因此不显示，所以需要在watch中监听一下vuex中list的数据
  },
  methods: {
    setDay() {
      const day = dayJs().format("YYYY-MM-DD"); //获取某天    format()：是一个编码格式
      this.date = [day, day];
    },
    setWeek() {
      const start = dayJs().day(1).format("YYYY-MM-DD"); //获取本周周一
      const end = dayJs().day(7).format("YYYY-MM-DD"); //获取本周周二
      this.date = [start, end];
    },
    setMonth() {
      const start = dayJs().startOf("month").format("YYYY-MM-DD"); //获取本月第一天
      const end = dayJs().endOf("month").format("YYYY-MM-DD"); //获取本月最后一天
      this.date = [start, end];
    },
    setYear() {
      const start = dayJs().startOf("year").format("YYYY-MM-DD"); //获取本月第一天
      const end = dayJs().endOf("year").format("YYYY-MM-DD"); //获取本月最后一天
      this.date = [start, end];
    },
  },
  computed: {
    // 标题切换
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
    ...mapState({
      listState: (state) => state.home.list,
    }),
  },
  // 监听属性
  watch: {
    title() {
      // 重新修改图表的配置数据
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
        xAxis: [
          {
            data: this.title == "销售额"? this.listState.orderFullYearAxis : this.listState.userFullYearAxis
          },
        ],
        series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: this.title == '销售额'? this.listState.orderFullYear : this.listState.userFullYear
        },
      ],
      });
    },
    listState() {

    }
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.tab {
  width: 100%;
}
.right {
  position: absolute;
  right: 0px;
}
.right span {
  margin: 0 10px;
}

.data {
  width: 250px;
  margin: 0 10px;
}

.charts {
  width: 100%;
  height: 300px;
}
.left {
  float: left;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  background-color: #000;
  color: #fff;
  border-radius: 50%;
  margin-right: 20px;
}

ul {
  padding: 0;
}

ul > li {
  list-style: none;
  margin: 20px 0;
}

.left1 {
  margin-right: 20px;
}
</style>