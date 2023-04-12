<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div class="search-header">
          <span>线上热门搜索</span>
          <el-dropdown>
            <span>
              <i class="el-icon-more"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div>
        <el-row :gutter="10">
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
          <el-col :span="12">
            <LineCharts></LineCharts>
          </el-col>
        </el-row>
        <!-- table表格 -->
        <el-table :data="tableData" style="width: 97%;margin-top: 10px" border>
          <el-table-column label="排名"  width="80" type="index" align="center">
          </el-table-column>
          <el-table-column label="搜索关键字" sortable width="180">
          </el-table-column>
          <el-table-column label="用户数" sortable>
          </el-table-column>
          <el-table-column label="周涨幅" sortable>
          </el-table-column>
        </el-table>
        <el-pagination
          layout="prev, pager, next"
          :total="50"
          class="pagination">
        </el-pagination>
      </div>
  </el-card>
  </div>
</template>

<script>
import LineCharts from "./LineCharts";

export default {
  name: "index",
  data() {
    return {
      tableData: [{}]
    };
  },
  methods: {},
  components: {
    LineCharts,
  },
};
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.search-header {
  display: flex;
  justify-content: space-between;
}

.el-card__header {
  padding: 12px 20px;
}

.pagination {
  float: right;
}
</style>