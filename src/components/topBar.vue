<template>
    <div>
        <div class="top-con">
        <el-button-group>
            <el-button type="primary" icon="edit"></el-button>
            <el-autocomplete
                popper-class="marker-autocomplete"
                custom-item="marker-autocomplete"
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
        </div>
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
            </el-tabs>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
import Vue from 'vue'
import {mapState} from 'vuex'
import _ from 'lodash'

Vue.component('marker-autocomplete', {
    functional: true,
    render: function (h, ctx) {
        const item = ctx.props.item;
        return h('li', ctx.data, [
            h('div', { 
                attrs: { 
                    class: 'name' 
                } 
            }, [item.name]),
            h('span', { 
                attrs: { 
                    class: 'label' 
                } 
            }, [item.label])
        ]);
    },
    props: {
        item: { 
            type: Object, 
            required: true 
        }
    }
});

export default {
  data() {
    return {
        dialogVisible: false, 
        searchVal: '',
        activeName: 'first'
    }
  },
  computed: mapState({
    markerList: state => state.common.markerList,
    mapHelper: state => state.common.mapHelper
  }),
  methods: {
    handleSelect(selectVal) {
        const me = this
        this.$store.dispatch('changeModalStatus')
        //find which marker will be hightlight
        const resultMarker =  _.find(this.markerList, (marker) => {
            return marker.id == selectVal.id
        })
        me.highLightMarker(resultMarker)
    },
    handleClick() {
        console.log(this.activeName)
    },
    openDropDown() {
        this.dialogVisible = true
    },
    highLightMarker(marker) {
        //get marker object
        const hlMarker = this.mapHelper.getMapMakerById(marker.id)
        //define marker's behavior
        hlMarker.setAnimation('AMAP_ANIMATION_BOUNCE')
        setTimeout(_ => {
            hlMarker.setAnimation('AMAP_ANIMATION_NONE')
        }, 3000)
        this.mapHelper.setMapZoomAndCenter(undefined, hlMarker.getPosition())
    },
    handleClose(done) {
        
    },
    querySearchAsync(queryString, cb) {
        const me = this;
        this.$store.dispatch('changeModalStatus')
        const results = queryString ? this.markerList.filter(this.createStateFilter(queryString)) : this.markerList;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(_ => {
            cb(results);
        }, 3000 * Math.random());
    },
    createStateFilter(queryString) {
        return (state) => {
            return (state.value.indexOf(queryString.toLowerCase()) === 0);
        };
    },
    loadSearchCollection() {
      return this.markerList
    }
  }
}
</script>
<style lang = 'scss'>
body {
    .marker-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .name {
            text-overflow: ellipsis;
            overflow: hidden;
            }
            .label {
            font-size: 12px;
            color: #b4b4b4;
            }

            .highlighted .addr {
            color: #ddd;
            }
        }
    }
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
}

</style>