<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category">
        <span>销售额类别占比</span>
        <el-radio-group v-model="value" size="mini">
          <el-radio-button label="全部渠道"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
          <el-radio-button label="门店"></el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div>
      <div class="charts" ref="charts"></div>
    </div>
  </el-card>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Title",
  data() {
    return {
      value: "全部渠道",
    };
  },
  mounted() {
    let myCharts = echarts.init(this.$refs.charts);
    myCharts.setOption({
      title:{
        text: "视频",
        subtext: 1048,      //副标题
        left: 'center',
        top: 'center'
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outsize",
          },
          emphasis: {
          },
          label: {
            show: true,
          },
          data: [
            { value: 300, name: "视频广告" },
            { value: 735, name: "联盟广告" },
            { value: 580, name: "邮件营销" },
            { value: 484, name: "直接访问" },
            { value: 300, name: "搜索引擎" },
          ],
        },
      ],
    });
    // 绑定事件
    myCharts.on("mouseover", (params) => {
      // 获取鼠标移上去的那条数据
      const {name, value} = params.data;
      // 重新设置标题
      myCharts.setOption({
        title: {
          text: name,
          subtext: value
        }
      })
    })
  },
  methods: {},
};
</script>

<style scoped>
.category {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.header {
  border-bottom: 1px solid #eee;
}

.charts {
  width: 100%;
  height: 300px;
}
</style>