<template>
  <div class="container">
    <el-row :gutter="10">
      <el-col :span="12">
          <Search></Search>
      </el-col>
      <el-col :span="12">
          <Title></Title>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from './Search'
import Title from './Title'

export default {
  name: 'Observe',
  components: {
    Search,
    Title
  },
  data () {
    return {

    };
  },
  methods: {}
}
</script>

<style scoped>
.container {
  margin: 0 10px;
}
</style>