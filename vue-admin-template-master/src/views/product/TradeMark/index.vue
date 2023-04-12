<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>
    <!-- 
      表格:
        data:表格组件将来需要展示的数据
        <el-table-column></el-table-column>表示一列
        border属性：给表格添加边框

      column：
        label属性：显示标题
        width属性：对应列宽度
        align属性：标题对齐方式
        type属性：展示序号
        prop属性：对应列内容字段名(根据el-tabel的:data获取的数据，会进行自动遍历，直接写属性名即可)
      注意：elementUI当中的table组件，展示的数据是一列一列进行展示的
      -->
    <el-table style="width: 100%; margin-top:20px" border :data="list">
      <el-table-column prop="prop" type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width" align="center">
      </el-table-column>
      <el-table-column prop="prop" label="品牌LOGO" width="width" align="center">
        <template slot-scope="{row,$index}">
          <img :src="row.logoUrl" alt="" style="width:80px;height:60px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width" align="center">
        <template slot-scope="{row, $index}">
          <el-button type="warning" icon="el-icon-edit" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 
      分页器 
      当前第几页、数据总条数、每一页展示条数、连续页码数
      @size-change="handleSizeChange"       page-size改变时触发
      @current-change="handleCurrentChange"   当前页改变时触发，elementUI会自动传入一个参数：当前页page
      layout属性：规定分页器内容的排列顺序
      pager-count:设置连续页码数
      -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" style="margin-top: 20px; text-align:center" :current-page="page" :total="total" :page-size="limit" :page-sizes="[3, 5, 10]" layout="prev, pager, next, jumper, ->, sizes, total">
    </el-pagination>

    <!-- 
      "添加"对话框 
      :visible.sync：控制对话框显示与隐藏
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可
    -->
    <el-dialog :title="tmForm.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单 :model属性：把表单数据收集到某个对象身上(获取表单数据时必须要写)，将来表单验证，也需要这个属性 -->
      <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 
          el-upload组件收集数据，不能使用v-model，因为不是表单元素
          action属性：设置图片上传地址，这里需要使用swaggerUI接口/admin/product/fileUpload，还需要注意代理跨域问题
          :on-success="handleAvatarSuccess"     可以检测到图片上传成功，当上传成功，会执行一次
          :before-upload="beforeAvatarUpload"   上传图片之前会执行一次
           -->
          <el-upload class="avatar-uploader" action="production/admin/product/fileUpload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // 自定义校验规则
    let validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称需要2-10位"));
      } else {
        callback();
      }
    };
    return {
      // 代表分页器在第几页
      page: 1,
      // 当前页展示数据的条数
      limit: 3,
      // 总共数据的条数
      total: 0,
      // 列表展示的数据
      list: [],
      // 对话框显示与隐藏的控制
      dialogFormVisible: false,
      // 收集品牌信息，对象身上的属性不能瞎写,需要看文档
      tmForm: {
        logoUrl: "",
        tmName: "",
      },
      // 表单验证规则
      rules: {
        // 品牌名称的验证规则
        tmName: [
          // required：表示必须要校验的字段，trigger：用户行为设置
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // { min: 2,max: 10, message: "长度在 2 到 10 个字符", trigger: "change",},
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        // 品牌logo的验证规则
        logoUrl: [
          { required: true, message: "请选择品牌图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    // 获取列表数据方法
    this.getPageList();
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      // 结构出参数
      const { page, limit } = this;
      let res = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (res.code == 200) {
        // 分别是展示数据总条数和列表展示的数据
        this.total = res.data.total;
        this.list = res.data.records;
      }
    },
    handleCurrentChange(pager) {
      this.page = pager;
      this.getPageList();
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    // 点击添加按钮
    showDialog() {
      // 显示对话框
      this.dialogFormVisible = true;
      this.tmForm = { logoUrl: "", tmName: "" };
    },
    // 点击修改按钮
    updateTradeMark(row) {
      // row：当前用户选中的品牌信息
      // 显示对话框
      this.dialogFormVisible = true;
      // 将已有的品牌信息赋值给tmForm进行展示
      // this.tmForm = row;
      // 上面这一步属于将服务器返回的品牌信息，直接赋值给了tmForm进行展示
      // 也就是tmForm存储即为服务器返回品牌信息
      this.tmForm = { ...row }; //浅拷贝
    },
    // 上传图片相关的回调
    // 图片上传成功
    handleAvatarSuccess(res, file) {
      // res：上传成功之后返回前端的数据
      // file：上传成功之后服务器返回给前端的数据
      this.tmForm.logoUrl = res.data;
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 点击对话框确定按钮
    addOrUpdateTradeMark() {
      // 当所有的验证规则通过才可以继续
      this.$refs.ruleForm.validate(async (success) => {
        // 所有验证规则校验成功
        if (success) {
          this.dialogFormVisible = false;
          // 发请求（添加品牌|修改品牌）
          let res = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (res.code == 200) {
            // 弹出信息：添加成功|修改成功
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            // 修改或添加品牌之后，再次发请求获取品牌列表进行展示
            // 如果添加品牌成功，停留在第一页，如果是修改成功，留在当前页
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌
    deleteTradeMark(row) {
      // 弹出框
      this.$confirm(`你确定删除${row.tmName}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 当点击确定按钮的时候会触发
          let res = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          // 点击取消按钮时触发
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped>
</style>





<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>