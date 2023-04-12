<template>
  <div>
    <el-row :gutter="10" style="margin: 10px">
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="¥16560">
            <template slot="charts">
              <span>周同比&nbsp;&nbsp;56.67% <svg t="1681018293695" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4402" width="16" height="16"><path d="M631.168 426.666667a21.333333 21.333333 0 0 1 15.061333 36.437333l-119.125333 119.125333a21.333333 21.333333 0 0 1-30.208 0l-119.125333-119.125333A21.333333 21.333333 0 0 1 392.832 426.666667h238.336z" fill="#1296db" p-id="4403"></path></svg></span>
              &nbsp;&nbsp;
              <span>日同比&nbsp;&nbsp;19.96% <svg t="1681023322793" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7036" width="16" height="16"><path d="M522.24 626.368l166.4-221.888A12.8 12.8 0 0 0 678.4 384H345.6a12.8 12.8 0 0 0-10.24 20.48l166.4 221.888a12.8 12.8 0 0 0 20.48 0z" fill="#d81e06" p-id="7037"></path></svg></span>
            </template>
            <template slot="footer">
              <span>日销售额¥12456</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail  title="访问量"  count="88460">
            <template slot="charts">
              <LineCard></LineCard>
            </template>
            <template slot="footer">
              <span>日访问量1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail  title="支付笔数"  count="88430">
            <template slot="charts">
              <BarCharts></BarCharts>
            </template>
            <template slot="footer">
              <span>转换率64%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Detail  title="运营活动效果"  count="78%">
            <template slot="charts">
              <ProgressCharts></ProgressCharts>
            </template>
            <template slot="footer">
              <span class="svg">周同比&nbsp;&nbsp;56.67% <svg t="1681018293695" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4402" width="16" height="16"><path d="M631.168 426.666667a21.333333 21.333333 0 0 1 15.061333 36.437333l-119.125333 119.125333a21.333333 21.333333 0 0 1-30.208 0l-119.125333-119.125333A21.333333 21.333333 0 0 1 392.832 426.666667h238.336z" fill="#1296db" p-id="4403"></path></svg></span>
              &nbsp;&nbsp;
              <span class="svg">日同比&nbsp;&nbsp;19.96% <svg t="1681029651072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7343" width="16" height="16"><path d="M522.24 626.368l166.4-221.888A12.8 12.8 0 0 0 678.4 384H345.6a12.8 12.8 0 0 0-10.24 20.48l166.4 221.888a12.8 12.8 0 0 0 20.48 0z" fill="#d81e06" p-id="7344"></path></svg></span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineCard from './LineCard'
import BarCharts from './barCharts'
import ProgressCharts from './ProgressCharts'

export default {
  name: 'Card',
  components: {
    Detail,
    LineCard,
    BarCharts,
    ProgressCharts
  },
  data () {
    return {

    };
  },
  methods: {}
}
</script>

<style scoped>
.svg {
  font-size: 14px;
}
</style>