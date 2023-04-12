<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" style="margin-bottom: 10px" @click="addAttr">添加属性</el-button>
        <!-- 表格 -->
        <el-table style="width: 100%" border="" :data="attrList">
          <el-table-column type="index" label="序号" align="center" width="80px">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row,$index}">
              <el-tag type="success" v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id" style="margin:0 10px;">{{attrValue.valueName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{row, $index}">
              <el-button type="warning" icon="el-icon-edit" size="mini" style="margin: 0 10px;" @click="updateAttr(row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttr(row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 添加属性|修改属性的解构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table style="width: 100%; margin: 20px 0" border :data="attrInfo.attrValueList">
          <el-table-column align="center" type="index" label="序号" width="80px">
          </el-table-column>
          <el-table-column align="center" label="属性值名称" width="width">
            <template slot-scope="{row, $index}">
              <el-input v-model="row.valueName" :ref="$index" placeholder="请输入属性值名称" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" @focus="toWrite()"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display: block;height:20px;text-align: left">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除 ${row.valueName} 吗？`" @onConfirm="deleteAttrValue($index)">
                <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="addOrUpdateAttr" :disabled="attrInfo.attrValueList.length < 1">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 接收平台属性字段
      attrList: [],
      // 控制table表格显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改新增属性用的
      attrInfo: {
        //参数说明
        attrName: "", //属性名
        attrValueList: [
          //属性值列表
          // {
          //   "attrId": 0,           //属性名id
          //   "valueName": ""         //属性值
          // }
        ],
        categoryId: 0, //category3Id
        categoryLevel: 3, //3
      },
    };
  },
  methods: {
    // 自定义事件的回调：接收子组件CategorySelect的数据
    getCategoryId({ categoryId, level }) {
      // 区分三级分类相应的id，以及父组件进行存储
      if (level == 1) {
        this.category1Id = categoryId;
        // 获取到一级标签id后置空二三级id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        // 获取到二级标签后置空三级id
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        // 代表三级分类的id有了
        this.category3Id = categoryId;
        // 发请求获取品牌属性
        this.getAttrList();
      }
    },
    // 获取平台属性的数据
    //用户确定三级分类的数据后，获取平台属性数据进行展示
    async getAttrList() {
      // 获取分类id
      const { category1Id, category2Id, category3Id } = this;
      let res = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (res.code == 200) {
        this.attrList = res.data;
      }
    },
    // 添加属性值回调
    // attrId: 响应属性id，目前而言还没有相应属性id，如果是点击修改属性按钮进来的点击了添加属性值按钮，那么此时已经可以获取到属性id
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //给每一个属性值添加一个flag标记，用户切换查看和编辑模式的时候，每一个属性值可以控制自己的模式进行切换
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 添加属性按钮的回调
    addAttr() {
      // 切换table显示与隐藏
      this.isShowTable = false;
      // 清除数据
      this.attrInfo = {
        //参数说明
        attrName: "", //属性名
        attrValueList: [
          //属性值列表
          // {
          //   "attrId": 0,           //属性名id
          //   "valueName": ""         //属性值
          // }
        ],
        categoryId: this.category3Id, //category3Id：当点击添加属性按钮的时候即可获取category3Id
        categoryLevel: 0, //3
      };
    },
    // 修改属性按钮的回调
    updateAttr(row) {
      this.isShowTable = false;
      // 将选中的属性赋值给attrInfo
      this.attrInfo = cloneDeep(row); // 点击的是取消按钮，会发现展示的attrList数据一样发生改变，由于数据结构中存在对象里面套数组，数组里面套对象，所以需要使用深拷贝解决这类问题
      // 在修改某一个属性值的时候，将相应的属性值元素添加上flag这个标记,切换span和input
      this.attrInfo.attrValueList.forEach((item) => {
        // 这样书写也可以给属性值添加flag标记，但是视图不会跟着变化（因为flag不是响应式数据）
        // 因为Vue无法探测普通的新增 proerty，这样书写的并不是响应式属性（数据变化，视图跟着变）
        // item.flag = false
        this.$set(item, "flag", false); //参数一：添加属性的对象，参数二：要添加的属性名，参数三：属性值
      });
    },
    // 失去焦点事件，---切换为查看模式，展示span
    toLook(row) {
      // 如果属性值为空，不能作为新的属性值，需要给用户提示，让他输入一个新的属性值
      if (row.valueName.trim() == "") {
        this.$message("请你输入正确的属性值");
        return;
      }
      // 新增的属性值，不能和已有的属性值相同
      let isRepet = this.attrInfo.attrValueList.some((item) => {
        // 需要将row从数组里面判断的时候去除
        // row是最新新增的属性值【数组的最后一项元素】
        // 判断的时候，需要把已有的数组当中的新增的这个属性值去掉
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepet) return;

      // 编辑模式变为查看模式
      row.flag = false;
    },
    // 表单聚焦事件
    toWrite() {
      // 当前表单聚集，其余表单变为查看模式
      // this.attrInfo.attrValueList.forEach(item => {
      //   if(item.flag == false) {
      //     console.log(item);
      //   }
      // })
    },
    // 点击span的回调，变为编辑模式
    toEdit(row, index) {
      row.flag = true;
      // 获取input节点，实现自动聚焦
      // 注意：点击span的时候，切换为input变为编辑模式，但是，对于浏览器而言，页面的重绘与重排是需要时间的，所以不一定一点击span就可以立马获取到input
      // $nextTick:当节点渲染完毕了，会执行一次（可以保证input已经存在了）
      this.$nextTick(() => {
        // 获取相应的input表单元素实现聚焦
        this.$refs[index].focus();
      });
    },
    // 气泡确认框确定按钮的回调，删除属性值操作
    deleteAttrValue(index) {
      // 当前删除属性值的操作是不需要发请求的
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 保存按钮，进行添加属性|修改属性的操作
    async addOrUpdateAttr() {
      // 整理参数：如果用户添加很多属性值，且属性值为空的话不应该提交给服务器
      // 提交给服务器的数据不应该包括flag字段
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(item=> {
        // 过滤掉属性值不是空的
        if(item.valueName != '') {
          // 删除flag字段
          delete item.flag;     //delete：删除对象中某个属性
          return true
        }
      })
      // 发请求
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        // 展示平台属性的信号量进行展示
        this.isShowTable = true;
        // 消息弹框
        this.$message({type: 'success', message: '成功'});
        // 保存成功以后，再次获取平台属性展示数据
        this.getAttrList();
      } catch (error) {
        this.$message('保存失败')
      }
    },
    // 删除属性回调
    async deleteAttr(row) {
      try {
        await this.$API.attr.reqDeleteAttr(row.id);
        // 弹出消息
        this.$message({type: 'success', message: '成功'});
        // 再次发请求
        this.getAttrList();
      } catch (error) {}
    }
  },
};
</script>

<style scoped>
</style>