<template>
  <div>
    <el-card style="margin: 20px 0">
      <!-- 三级联动已经是全局组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
    </el-card>
    <el-card>
      <!-- 将来有三部分进行切换 -->
      <div v-show="scene == 0">
        <!-- 展示SPU列表的结构 -->
        <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 10px" :disabled="!category3Id" @click="addSpu">添加Spu</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <!-- 这里的按钮将来用hintButton替代 -->
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加Sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改Spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前Spu全部Sku" @click="handler(row)"></hint-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除Sku" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination style="text-align:center" :current-page="page" :page-sizes="[3,5,10]" :page-size="limit" layout="prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange">
        </el-pagination>
      </div>

      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu"></SpuForm>
      <SkuForm v-show="scene == 2" @changeScene="changeScene" ref="sku"></SkuForm>
    </el-card>

    <!-- 查看当前spu全部sku的对话框 -->
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" @close="close">
      <!-- table展示sku的列表 -->
      <el-table :data="skuList" border style="width: 100%" v-loading="loading">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格" width="200"></el-table-column>
        <el-table-column property="weight" label="重量"></el-table-column>
        <el-table-column property="" label="默认图片">
          <template slot-scope="{row, $index}">
            <img :src="row.skuDefaultImg" style="width: 100px;height: 100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import SkuForm from "./SkuForm/index.vue";
import SpuForm from "./SpuForm/index.vue";
export default {
  name: "Spu",
  data() {
    return {
      // 一二三级分类的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, //当前第几页
      limit: 3, //每一页需要展示几条数据
      records: [], //spu列表的数据
      total: 0, //分页器一共需要展示数据的条数
      scene: 0, //0代表展示Spu列表数据，1代表添加|修改Spu，2代表添加Sku
      dialogTableVisible: false,        //控制对话框的显示与隐藏
      spu: {},             //收集spu信息
      skuList: [],        //存储的是sku列表的数据
      loading: true,
    };
  },
  methods: {
    //点击分页器某一页按钮的回调
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList;
    },
    // 三级联动的自定义事件，可以把子组件相应的id传给父组件
    getCategoryId({ categoryId, level }) {
      // getCategoryId:获取到一二三级分类的id，  level：区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        // 清除二三级分类id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        // 清除三级分类id
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        // 获取Spu列表数据进行展示
        this.getSpuList();
      }
    },
    // 获取Spu列表的方法
    async getSpuList() {
      // 解构参数
      const { page, limit, category3Id } = this;
      // 携带三个参数
      let res = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (res.code == 200) {
        this.records = res.data.records;
        this.total = res.data.total;
      }
    },
    // 点击添加Spu按钮的回调
    addSpu() {
      this.scene = 1;
      // 通知子组件发请求 -- （ 获取品牌数据、获取销售属性数据）这里要记得传入category3Id，用于添加完Spu数据并点击保存按钮之后向服务器发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改某一个Spu
    updateSpu(row) {
      this.scene = 1;
      // 获取SpuForm子组件
      this.$refs.spu.initSpuForm(row);
    },
    // SpuForm自定义事件
    changeScene({ scene, flag }) {
      // flag：为了区分保存按钮是添加还是修改
      // SpuForm组件中点击取消按钮切换展示结构
      this.scene = scene;
      // 子组件通知父组件切换场景，并且再次获取spu列表的数据，同时跳转当前页
      if (flag == "修改") {
        this.getSpuList(this.page);
      } else {
        this.getSpuList();
      }
    },
    // 删除Spu按钮的回调
    async deleteSpu(row) {
      let res = await this.$API.spu.reqDeleteSpu(row.id);
      if ((res.code = 200)) {
        this.$message({ type: "success", message: "删除成功" });
        // 代表当前页Spu个数如果大于1，删除之后停留在当前页，如果小于1，返回上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    // 添加Sku按钮的回调
    addSku(row) {
      // 切换场景
      this.scene = 2;
      // 父组件调用子组件方法，让子组件发请求 --- 三个请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    //点击查看的当前spu所有的sku按钮触发的回调
    async handler(row) {
      this.dialogTableVisible = true;
      // 将当前spu数据赋值给准备好的spu
      this.spu = row;
      // 发请求获取全部sku数据
      let res = await this.$API.spu.reqFindBySpuId(row.id);
      if(res.code == 200) { 
        this.loading = false;
        this.skuList = res.data;
      }
    },
    // 关闭对话框前的回调
    close() {
      // loading属性再次变为真
      this.loading = true;
      // 清除skuList数据
      this.skuList = [];
    }
  },
  components: {
    SkuForm,
    SpuForm,
  },
};
</script>

<style scoped>
</style>