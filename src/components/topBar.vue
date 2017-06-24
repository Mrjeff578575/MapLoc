<template>
    <div class="top-con">
        <el-button-group>
            <el-button type="primary" icon="edit"></el-button>
            <el-autocomplete
                v-model="searchVal"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入查询点"
                @select="handleSelect"
                icon="search"
                class="top-autocomplete"
                >
            </el-autocomplete>
            <el-button type="primary" icon="arrow-down" @click="openDropDown"></el-button>
        </el-button-group>
        <el-dialog
          title="地图设置"
          :visible.sync="dialogVisible"
          size="tiny"
          custom-class="map-dialog slideInDown"
          :before-close="handleClose">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
        dialogVisible: false, 
        searchVal: '',
        activeName: 'first',
        searchCollecion: ''
    }
  },
  methods: {
    handleSelect() {
        console.log(this.searchVal)
    },
    handleClick() {
        console.log(this.activeName)
    },
    openDropDown() {
        this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    querySearchAsync(queryString, cb) {
        var restaurants = this.searchCollecion;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            cb(results);
            //highlighy marker 
            //add mask
            //
        }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
        return (state) => {
            return (state.value.indexOf(queryString.toLowerCase()) === 0);
        };
    },
    loadSearchCollection() {
      return [
                { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
                { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
                { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
                { "value": "泷千家(天山西路店)", "address": "天山西路438号" }
            ]
    }
  },
  mounted() {
      this.searchCollecion = this.loadSearchCollection()
  }
}
</script>
<style>
.top-con {
    width: 100%;
    position: absolute;
    top: 10px;
    z-index: 200;
}
.top-autocomplete {
    width: 70%;
    float: left;
}
.el-button-group {
    width: 100%;
    padding-left: 20px;
}
</style>