<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="Sku名称">
        {{spu.spuName}}
      </el-form-item>
      <el-form-item label="Sku名称">
        <el-input placeholder="Sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <!-- el-input：type属性为number表示框内的如果是数字可以进行点击实现加减操作 -->
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form label-width="80px">
          <el-form-item :label="attr.attrName" v-for="(attr, index) in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="(attrValue, index) in attr.attrValueList" :key="attrValue.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.saleIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column prop="prop" type="selection" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row, $index}">
              <img :src="row.imgUrl" alt="" style="width: 100px; height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <el-button type="primary" v-if="row.isDefault == 0" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性的数据
      attrInfoList: [],
      //收集sku信息的字段

      skuInfo: {
        // 第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,

        // 第二类收集的数据：通过双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",

        // 第三类收集的数据：自己书写代码收集
        skuSaleAttrValueList: [
          //销售属性列表数据
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
        skuAttrValueList: [
          //平台属性列表数据
          // {
          //   attrId: 0,
          //   valueId: 0,
          // },
        ],
        skuDefaultImg: "", //默认图片
        skuImageList: [
          //收集图片的字段
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
      },
      spu: {}, //父组件传入的spu数据
      // 收集选中图片的数据字段，但是收集的数据目前缺少isDefalut字段，将来提交给服务器数据的时候，需要整理参数
      imageList: [],
    };
  },
  methods: {
    // 获取skuForm数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给的数据
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;

      // 获取图片的数据
      let res = await this.$API.spu.reqSpuImgList(spu.id);
      if (res.code == 200) {
        let list = res.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      // 获取销售属性的数据
      let res1 = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (res1.code == 200) {
        this.spuSaleAttrList = res1.data;
      }
      // 获取平台属性的数据
      let res2 = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (res2.code == 200) {
        this.attrInfoList = res2.data;
      }
    },
    // 排他操作
    changeDefault(row) {
      // 图片列表数据的isDefault字段变为0
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      // 点击的那个图片的isDefault字段变为1
      row.isDefault = 1;
      // 收集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //取消按钮的回调
    cancel() {
      this.$emit("changeScene", { scene: 0, flag: "" });
      // 清除数据
      Object.assign(this._data, this.$options.data());
    },
    // table表格复选框按钮的事件
    handleSelectionChange(params) {
      // 获取到用户选中图片信息的数据，但是，当前收集的数据中，缺少isDefault字段
      this.imageList = params;
    },
    // 保存按钮的回调
    async save() {
      // 整理参数（还有三个数据不是放在skuInfo中）
      // 1.整理平台属性     
      /* 方法1:使用forEach方法
      let arr = []
      this.attrInfoList.forEach(item=>{
       // 当前平台属性是否选择
       if(item.attrIdAndValueId) {
        let [attrId,valueId] = item.attrIdAndValueId.split(":");
        // 将两个字段赋值给一个对象
        let obj = {attrId,valueId};
        // 将平台属性对象添加进准备好的数组中
        arr.push(obj)
       }
      })
      //  将整理好的参数赋值给skuInfo.skuAttrValueList
      this.skuInfo.skuAttrValueList = arr; */
      // 方法2:使用reduce方法
      let arr = this.attrInfoList.reduce((initArr, item) => {
        if (item.attrIdAndValueId) {
          let [attrId, valueId] = item.attrIdAndValueId.split(":");
          initArr.push({ attrId, valueId });
        }
        return initArr
      }, []);
      this.skuInfo.skuAttrValueList = arr;
      // 2.整理销售属性
      let arr1 = this.spuSaleAttrList.reduce((initArr, item) => {
        if(item.saleIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(":");
          initArr.push({saleAttrId, saleAttrValueId})
        }
        return initArr
      }, []);
      this.skuInfo.skuSaleAttrValueList = arr1;
      // 3.整理图片的数据   使用map方法，将一个数组隐射为另一个数组
      this.skuInfo.skuImageList = this.imageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发请求
      let res = await this.$API.spu.reqAddSku(this.skuInfo);
      if(res.code == 200) {
        // 切换场景
        this.$emit("changeScene", { scene: 0, flag: "" });
        this.$message({type: 'success', message: '添加成功'})
      }
    },
  },
};
</script>

<style scoped>
</style>