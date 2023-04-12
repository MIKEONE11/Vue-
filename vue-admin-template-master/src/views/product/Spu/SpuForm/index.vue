<template>
  <div>
    <!-- 在el-form标签中添加label-width使得所有的item都可以继承这个属性 -->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tmList" :key="tm.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
          list-type： 文件列表类型 
          on-preview：图片预览时触发
          on-remove：删出图片的时候触发
          file-list：图片数据的列表
        -->
        <el-upload action="production/admin/product/fileUpload" list-type="picture-card" :on-success="handleSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个属性未选择`" v-model="attrIdAndAttrName">
          <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="(unselect, index) in unSelectSaleAttr" :key="unselect.id">
          </el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row, $index}">
              
              <el-tag :key="tag.id" v-for="(tag, index) in row.spuSaleAttrValueList" closable @close="row.spuSaleAttrValueList.splice(index, 1)" :disable-transitions="false" >
                {{tag.saleAttrValueName}}
              </el-tag>
              <!-- @keyup.enter.native="handleInputConfirm"  -->
              <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @blur="handleInputConfirm(row)">
              </el-input>
              <!--  @click="showInput" -->
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      // spu初始的时候是一个空对象，在修改spu的时候，会向服务器发起请求，返回spu信息（对象），在修改的时候可以利用服务器返回的这个对象手机最新的数据提交给服务器
      // 添加Spu，如果是添加spu的时候并没有向服务器发起请求，数据收集到spu，收集数据的时候有哪些字段，看文档
      spu: {
        category3Id: 0,
        description: "",
        tmId: "",
        spuImageList: [
          {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            spuId: 0,
          },
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tmList: [],         //存储品牌信息
      spuImageList: [],     //存储spu图片的数据
      saleAttrList: [],   //销售属性的数据（项目全部的销售属性）
      attrIdAndAttrName: '',         //收集的未选择的销售属性id
    };
  },
  methods: {
    // 照片墙删除某一张图片的时候
    handleRemove(file, fileList) {
      // file：代表删除图片的数据；fileList：删除某一张图片剩余的图片的数据
      // 收集照片墙图片的数据
      this.spuImageList = fileList;
      // 已有的照片带有url，name字段【照片墙显示的时候必须带有的字段】，而传给服务器的数据不需要这两个字段
      // 所以提交给服务器的数据，需要处理
    },
    // 照片墙上传成功的回调
    handleSuccess(response, file, fileList) {
      // fileList：上传成功后所有的图片信息
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      // 将图片地址赋值给这个dialogImageUrl属性
      this.dialogImageUrl = file.url;
      // 对话框显示
      this.dialogVisible = true;
    },
    // 初始化SpuForm数据
    async initSpuForm(spu) {
      // 获取spu信息数据的请求方法
      let spuRes = await this.$API.spu.reqGetSpu(spu.id);
      if (spuRes.code == 200) {
        // 在修改spu的时候，需要向服务器发请求，把服务器返回的数据（对象），赋值给spu属性
        this.spu = spuRes.data;
      }
      // 获取品牌信息的请求方法
      let tmRes = await this.$API.spu.reqTrademarkList();
      if (tmRes.code == 200) {
        this.tmList = tmRes.data;
      }
      // 获取Spu图片的数据
      let spuImgRes = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImgRes.code == 200) {
        let listArr = spuImgRes.data;
        // 由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        listArr.forEach((item) => {
          // 替换列表属性
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        // 把整理好的数据赋值给spuImageList
        this.spuImageList = listArr;
      }
      // 获取平台全部的销售属性
      let saleRes = await this.$API.spu.reqBasealeAttrList();
      if (saleRes.code == 200) {
        this.saleAttrList = saleRes.data;
      }
    },
    //添加新的销售属性
    addSaleAttr() {
      // el-select的v-model已经将要添加的销售属性的信息收集到了attrIdAndAttrName中【格式：3:尺码】
      // 并且最后要传给服务器的数据应该放到spu的spuSaleAttrList中
      // 收集到的销售属性数据进行分割
      let [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(":");
      // 向spu对象的spuSaleAttrList属性内添加新的销售属性 
      let newSaleArr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
      this.spu.spuSaleAttrList.push(newSaleArr);
      // input框清空数据
      this.attrIdAndAttrName = ''
    },
    // 添加按钮的回调
    addSaleAttrValue(row) {
      // 点击销售属性当中添加按钮的时候，使button展示为span，通过当前销售属性的inputVisible控制
      // 挂载在销售属性身上的响应式数据inputVisible,控制button与input切换
      this.$set(row, 'inputVisible', true);
      // 通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, 'inputValue', '');
    },
    // input框失去焦点事件
    handleInputConfirm(row) {
      // 解构出销售属性中收集的数据
      const {baseSaleAttrId, inputValue} = row;

      // 新增的销售属性值不能为空
      if(inputValue.trim() == '') {
        this.$message("属性值不能为空");
        return
      }
      // 属性值不能重复
      // let res = row.spuSaleAttrValueList.every(item => {
      //   return item.saleAttrValueName != inputValue;
      // })
      // if(!res) return;

      // 新增的销售属性值
      let newAttrSaleValue = {baseSaleAttrId, saleAttrValueName: inputValue};
      row.spuSaleAttrValueList.push(newAttrSaleValue);
      row.inputVisible = false;
    },
    // 添加或保存Spu的回调
    async addOrUpdateSpu() {
      // 整理参数：整理照片墙的数据
      // 携带的参数：对于图片是要携带imgName和imgUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.url : item.url
        }
      })
      // 发请求
      let res = await this.$API.spu.reqAddOrUpdateSpuInfo(this.spu);
      if(res.code == 200) {
        this.$message({type:'success', message: '保存成功'});
        // 通知父组件回到场景0（sence = 0）
        this.$emit("changeScene",{scene: 0, flag: this.spu.id?'修改':'添加'});
      }
      // 清理数据（防止下一次进入该组件数据残留）
      // Object.assign()：es6语法新增的合并对象
      // 组件实例this._data，可以操作data中的响应式数据
      // this.$options：是当前Vue实例的配置对象，里面包含data函数，data函数一执行，返回的响应式数据是为空的
      Object.assign(this._data,this.$options.data());
    },
    // 点击添加Spu按钮的时候，发请求的函数（发两个请求）
    async addSpuData(category3Id) {
      // 收集三级分类的Id
      this.spu.category3Id = category3Id;
      // 获取品牌信息的请求方法
      let tmRes = await this.$API.spu.reqTrademarkList();
      if (tmRes.code == 200) {
        this.tmList = tmRes.data;
      };
      // 获取平台全部的销售属性
      let saleRes = await this.$API.spu.reqBasealeAttrList();
      if (saleRes.code == 200) {
        this.saleAttrList = saleRes.data;
      };
      // 整理参数：整理照片墙的数据
      // 携带的参数：对于图片是要携带imgName和imgUrl字段
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.response ? item.response.url : item.url
        }
      })
    },
    //取消按钮
    cancel() {
      // 取消按钮的回调，通知父亲切换场景
      this.$emit('changeScene', {scene: 0, flag: ''});
      // 清理数据（防止下一次进入该组件数据残留）
      // Object.assign()：es6语法新增的合并对象
      // 组件实例this._data，可以操作data中的响应式数据
      // this.$options：是当前Vue实例的配置对象，里面包含data函数，data函数一执行，返回的响应式数据是为空的
      Object.assign(this._data,this.$options.data())
    }
  },
  computed: {
    // 计算出还未选择的销售属性
    unSelectSaleAttr() {
      // 整个平台的销售属性一共三个：颜色、尺寸、版本   ---saleAttrList
      // 当前Spu拥有的S销售属性   -----spu.spuSaleAttrList
      // 数组的过滤，从已有的数组中过滤出用户需要的元素，并会返回一个新的数组(fliter内的回调函数返回true，过滤的元素需要加进新数组，返回false，过滤的元素不加进新数组)
      let result = this.saleAttrList.filter(item=>{
        // every() 数组的方法，会返回一个布尔值
        return this.spu.spuSaleAttrList.every(items=>{
          return item.name != items.saleAttrName;
        })
      })
      return result
    }
  }
};
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>