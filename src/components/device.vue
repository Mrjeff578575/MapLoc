<template>
    <div class="device-container">
        <el-row :gutter="10" class="head-con">
            <el-col :xs="8">
                <el-select v-model="areaValue" filterable placeholder="请选择">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select> 
            </el-col>
        </el-row>
        <div class="deviceTable" v-show="tableVisible">
            <el-table
                :data="tableData"
                :row-class-name="tableRowClassName"
                style="width: 100%">
                <el-table-column
                prop="date"
                label="日期">
                </el-table-column>
                <el-table-column
                prop="name"
                label="姓名">
                </el-table-column>
                <el-table-column
                prop="address"
                label="地址">
                </el-table-column>
                <el-table-column
                fixed="right"
                label="操作"
                width="100">
                    <template scope="scope">
                    <el-button @click="handleClick" type="text" size="small">查看</el-button>
                    <el-button @click="openWarningNotify" type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        <el-pagination
        layout="prev, pager, next"
        :total="50">
        </el-pagination>
        </div>

        <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="活动名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" :label-width="formLabelWidth">
                <el-select v-model="form.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
      }],
      options: '',
      areaValue: '',
      tableVisible: false,
      dialogFormVisible: false,
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
    }
  },
  watch: {
    'areaValue': function(newVal) {
        console.log(newVal);
        if (newVal) {
            this.tableVisible = true;
            this.onAreaSelect(newVal);
        } else {
            this.tableVisible = false;
        }
    }
  },
  methods: {
        tableRowClassName(row, index) {
            if (index === 1) {
                return 'info-row';
            } else if (index === 3) {
                return 'positive-row';
            }
            return '';
        },
        handleClick() {
            console.log('click');
            this.dialogFormVisible = true
            //open a dialog
        },
        openWarningNotify() {
            this.$notify({
                title: '警告',
                message: '这是一条警告的提示消息',
                type: 'warning'
            });
        },
        onAreaSelect(val) {
            const me = this;
            this.$http.get('http://localhost:2017/device.json?areaid=' + val)
                .then((res) => {
                    console.log(res)
                }).catch((err) => {
                    me.$message('这是一条消息提示');
                    console.log(err);
                })
        },
        
    },
    mounted: function() {
        //get select option
        const me = this;
        this.$http.get('http://localhost:2017/area.json')
            .then((res)=> {
                console.log(res.data);
                me.options = res.data.item;
            }).catch((err) => {
                console.log(err);
            })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.device-container {
    margin: 0 5px;
}
.head-con {
    text-align: left;
    margin-bottom: 10px;
}
.el-table .info-row {
    background: #c9e5f5;
}
.el-table .positive-row {
    background: #e2f0e4;
}
</style>
