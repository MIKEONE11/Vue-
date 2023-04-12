<template>
  <div>
    <!-- 三级联动组件 -->
    <!-- 
      inline：是否为行内表单 
      注意要添加:model属性，收集数据
    -->
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <!-- el-select：通过v-model进行数据的收集，并且是收集到子项el-option的:value的数据 -->
        <el-select placeholder="请选择" v-model="cForm.category1Id" @change="handle1" :disabled="show">
          <!-- el-option：value用于收集相应id，用于获取二级菜单的数据 -->
          <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select placeholder="请选择" v-model="cForm.category2Id" @change="handle2" :disabled="show">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2, idnex) in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select placeholder="请选择" v-model="cForm.category3Id" @change="handle3" :disabled="show">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3, idnex) in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      // 一级分类数据
      list1: [],
      // 二级分类的数据
      list2: [],
      // 三级分类的数据
      list3: [],
      // 收集相应的一级、二级、三级分类的id
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
      }
    };
  },
  // 组件挂载完毕，向服务器发请求，获取相应的一级分类
  mounted() {
    // 获取一级分类
    this.getCategory1List();
  },
  methods: {
    // 获取一级分类方法
    async getCategory1List() {
      let res = await this.$API.attr.reqCategory1List();
      if(res.code == 200) {
        this.list1 = res.data
      }
    },
    // 一级分类的select事件回调（当一级分类的option发生变化时获取响应二级分类数据）
    async handle1() {
      // 清除上一次二级三级分类的数据
      this.list2 = []
      this.list3 = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''

      // 解构出一级分类的id
      const {category1Id} = this.cForm;
      // 将一级标签的id传给Attr父组件
      this.$emit("getCategoryId", {categoryId:category1Id, level: 1});
      let res = await this.$API.attr.reqCategory2List(category1Id);
      if(res.code == 200) {
        this.list2 = res.data;
      }
    },
    // 二级分类的select事件回调（当二级分类的option发生变化时获取响应三级分类数据）
    async handle2() {
      // 清除上一次三级分类的数据
      this.list3 = []
      this.cForm.category3Id = ''

      // 解构出一级分类的id
      const {category2Id} = this.cForm;
      // 将二级标签的id传给Attr父组件
      this.$emit("getCategoryId", {categoryId:category2Id, level: 2});
      let res = await this.$API.attr.reqCategory3List(category2Id);
      if(res.code == 200) {
        this.list3 = res.data;
      }
    },
    // 三级分类的select事件回调
    handle3() {
      // 解构出三级分类的id
      const {category3Id} = this.cForm;
      // 将三级标签的id传给Attr父组件
      this.$emit("getCategoryId", {categoryId:category3Id, level: 3});
    }
  },
};
</script>

<style scoped>
</style>