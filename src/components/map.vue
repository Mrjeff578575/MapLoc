<template>
    <div class="map-con">
        <div class="v-modal" :class="{none: displayNone}"></div>
        <div id="allmap"></div>
        <topbar></topbar>
        <el-dialog
          :title="markerTitle"
          :visible.sync="dialogVisible"
          size="tiny"
          custom-class="map-dialog"
          :before-close="handleClose">
          <span>这是一段信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
import mapHelper from '../helper/mapHelper'
import topbar from './topBar'

export default {
  data () {
    return {
      dialogVisible: false, 
      msg: 'Welcome to Your Vue.js App',
      activeName: '',
      markerTitle: 'This is a marker',
      displayNone: false
    }
  },
  components: {
    topbar: topbar
  },
  mounted: function() {
    this.getMakerList()
    this.mapHelper = new mapHelper({
      mapStyle: 'amap://styles/fresh'
    })
    this.mapHelper.drawMap().addMarker({
      pos: [116.480983, 39.989628],
      id: '1'
    }, this.bindEventToMarker)
  },
  destroyed: function() {
    this.mapHelper.destroy()
  },
  methods: {
    getMakerList() {
      const me = this
      this.$http.get('http://localhost:2017/marker.json')
        .then((res) => {
            console.log(res.data)
        }).catch((err) => {
            me.$message('oops, there is a error');
            console.log(err);
      })
    },
    getMakerInfo(markerId, cb) {
      this.$http.get('http://localhost:2017/marker.json?markerId' + markerId)
        .then((res) => {
            cb(null, res)
        }).catch((err) => {
            cb(err)
      })
    },
    bindEventToMarker(marker) {
      marker.on('click', this.handleMarkerClick)
    },
    handleMarkerClick(e) {
      const me = this
      const markerId = e.target.getExtData()
      this.getMakerInfo(markerId, (err, res) => {
        if (err) {
          me.$message('这是一条消息提示');
        } else {
          console.log(res)
          res = {
            "pos": "[116.480983, 39.989628]",
            "id": "1",
            "name": "下午4点成都篮球场约起来",
            "label": "体育运动"
          }
          me.mapHelper.addInfoWindow(e.target, res, {
            afterOpen() {
            }
          })
        }
      })
      //this.dialogVisible = true
      console.log(e.target.getExtData())
    },
    handleClose(done) {
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //   })
      //   .catch(_ => {})
    }
  }
}
</script>

<style lang = "scss">

.map-con{
    height: 100%;

    .none {
      z-index: 199;
    }

    .content-container {
      position: relative;
      z-index: 99;
      border-radius: 5px;
      border: 1px solid #ffffff;

      .info-title {
        border-bottom: 1px solid #ffffff;
        height: 30px;
        line-height: 30px;
      }

      .info-content {
        display: flex;
        align-items: stretch;
        height: 80px;
        padding: 3px 8px;
        
        .left-img {
          flex: 1;
          background-size: cover;
        }

        .right-content {
          flex: 2;
          text-align: left;
          padding-left: 10px;
        }
      }
    }

    .info-bottom {
      position: absolute;
      width: 100%;
      height: 30px;
      background: url('../assets/sharp.png');
      background-repeat: no-repeat;
      background-position: 120px;
    }

    .mask {
      position: absolute;
      top: 0;
      background: url('../assets/timg.jpeg');
      background-size: cover;
      filter: blur(3px);
      width: 100%;
      height: 100%;
    }
}
#allmap{
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
/* element style*/

.map-dialog{
  width: 90%
}
.el-message-box{
  width: 50%;
}

</style>
