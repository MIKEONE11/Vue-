<template>
  <div>
    <el-table style="width: 100%" border :data="list">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110">
        <template slot-scope="{row, $index}">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量(kg)" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格(元)" width="80">
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row, $index}">
          <el-button type="success" icon="el-icon-sort-down" size="mini" v-if="row.isSale == 0" @click="sale(row)"></el-button>
          <el-button type="success" icon="el-icon-sort-up" size="mini" v-else @click="cancel(row)"></el-button>
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
          <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
     -->
    <el-pagination style="margin-top: 20px; text-align:center" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[3, 5, 7]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 抽屉效果 -->
    <!-- 
      :visible.sync     控制抽屉显示与隐藏
      :direction        控制抽屉弹出方向（默认就是从右到左）
      :before-close     关闭前的回调
      :show-close       是否显示 x 按钮
     -->
    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{skuInfo.skuName}}</el-col></el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{skuInfo.price}}</el-col></el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <template>
            <el-tag type="success" style="margin-right: 10px" v-for="(attr, index) in skuInfo.skuAttrValueList" :key="attr.id">{{attr.attrId}}--{{attr.valueId}}</el-tag>
          </template>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
              <img :src="item.imgUrl" alt="" style="width: 227.66px;height: 200px">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 3,
      total: 0,
      // 收集sku列表数据
      list: [],
      // 存储sku详情信息
      skuInfo: {},
      show: false,
    };
  },
  methods: {
    // 获取sku列表数据
    async getSkuList() {
      // 解构出参数
      const { page, limit } = this;
      let res = await this.$API.sku.reqSkuList(page, limit);
      if (res.code == 200) {
        this.total = res.data.total;
        this.list = res.data.records;
      }
    },
    handleCurrentChange(pager) {
      this.page = pager;
      this.getSkuList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    // 上架
    async sale(row) {
      let res = await this.$API.sku.reqSale(row.id);
      if (res.code == 200) {
        row.isSale = 1;
        this.$message({ type: "success", message: "上架成功" });
      }
    },
    // 下架
    async cancel(row) {
      let res = await this.$API.sku.reqCancel(row.id);
      if (res.code == 200) {
        row.isSale = 0;
        this.$message({ type: "success", message: "下架成功" });
      }
    },
    edit() {
      this.$message("正在开发中...");
    },
    // 获取sku详情
    async getSkuInfo(row) {
      // 展示抽屉
      this.show = true;
      let res = await this.$API.sku.reqSkuById(row.id);
      if (res.code == 200) {
        this.skuInfo = res.data;
      }
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

<style scoped>
.el-col-5 {
  font-size: 18px;
  text-align: right;
}

.el-col {
  margin: 10px 10px;
}

.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>