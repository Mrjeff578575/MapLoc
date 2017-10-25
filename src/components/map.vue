<template>
    <div class="map-con">
        <div class="v-modal" :class="{'modal-active': showModal}"></div>
        <div id="allmap"></div>
        <topbar 
          ref="topbar"
          @onGetUserlist="onGetUserlist"
          @loginSuccess="onLoginSuccess"
          @refreshUserMarker="onRefreshUserMarker"
          @drawTrail="drawTrail"
          @changeUpdateTrail="changeUpdateTrail"
        >
        </topbar>
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
        <!--edit dialog-->
        <el-dialog
            :title="messageTitle"
            :visible.sync="editDialogVisible"
            size="large"
            custom-class="edit-dialog map-dialog slideInDown"
            :modal=false
            @open="onOpenChatDialog"
            :before-close="handleClose">
            <div class="chatbox">
            </div>
            <span slot="footer" class="dialog-footer">
              <div class="chatfoot">
                <el-input v-model="msgInput" placeholder="请输入内容"></el-input>
                <el-button @click="sendMsg" type="primary">发送</el-button>
              </div>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import mapHelper from '../helper/mapHelper'
import topbar from './topBar'
import _ from 'lodash'
import utils from '../helper/utils'
import configUrl from './apiConfig'
import $ from 'jquery'
import { MessageBox } from 'mint-ui';

import { mapState } from 'vuex'

const mockPath = './static/mock/'

export default {
  data () {
    return {
      dialogVisible: false, 
      msg: 'Welcome to Your Vue.js App',
      activeName: '',
      markerTitle: 'This is a marker',
      editDialogVisible: false,
      msgInput: '',
      messageTitle: '与XX对话中',
      chat: {
        currentUserId: '',
        toUserId: '',
        userSex: ''
      },
      needAutoCenter: true,
      cacheLocation: {}
    }
  },
  components: {
    topbar: topbar
  },
  beforeRouteEnter(to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
        if (!utils.getLocalStorage('token')) {
            console.log(vm.$refs)
            vm.$refs.topbar.loginDialogVisible = true
        } else {
            vm.$http.defaults.headers.common['token'] = utils.getLocalStorage('token');
            vm.$http.defaults.headers.common['uid'] = utils.getLocalStorage('userId');
            vm.$refs.topbar.loginSuccessCallback()
        }
      })
  },
  computed: mapState({
    showModal: state => state.common.showModal
  }),
  mounted: function() {
    const me = this
    this.mapHelper = new mapHelper({
      mapStyle: 'amap://styles/fresh',
      mapClickHandler(lnglat, pixel, target) {
      },
    })
    this.mapHelper.drawMap()
  },
  destroyed: function() {
    this.mapHelper.destroy()
  },
  methods: {
    changeUpdateTrail(isAutoUpdate) {
      let me = this
      me.needAutoCenter = isAutoUpdate
    },

    onLoginSuccess() {
      let me = this
      this.mapHelper.geolocation.getCurrentPosition((status, result) => {
          if (status == 'error') {
            console.log(status)
            MessageBox('定位失败', '请检查您的设备是否开启定位设置');
            return;
          }
          let position = result.position 
          let {lng, lat} = position
          me.cacheLocation = {lng, lat}
          me.updateLocation(lng, lat);
          me.onCenterMap(lng, lat)
          me.refreshUserMarkerPos(lng, lat)
          me.drawTrail()
          me.changeUpdateTrail(true)
      })
      this.getLocation()
      document.addEventListener('click', (e) => {
        if ($(e.target).hasClass('msg-noti')) {
          let userId = $(e.target).data('markerid');
          let userMarker = _.find(me.mapHelper.mapMarkerList, (marker) => {
              let extData = marker.getExtData();
              return extData.id == userId;
          })
          let winObj = _.find(me.mapHelper.msgInfoWindowList, (win) => {
              return win.id == userId;
          })
          winObj && winObj.infoWindow.close()
          let currentUserId = utils.getLocalStorage('userId')
          this.chat.currentUserId = currentUserId
          if (currentUserId == userId) {
              return;
          }
          let userInfo = userMarker.getExtData()
          let dom = userMarker.getContentDom()
          $(dom).find('.msg-num').hide();
          me.messageTitle = `与${userInfo.username}对话中`
          me.getChatMsg(currentUserId, userId)

        }
      })
    },
    refreshUserMarkerPos(lng, lat) {
      //remove user marker
      let userId = utils.getLocalStorage('userId');
      this.mapHelper.removeMarker(userId)
      let userList = utils.getLocalStorage('userList')
      if (userList) {
        userList = JSON.parse(userList)
      }
      let userInfo = _.find(userList, function(user) {
        return user.id == userId
      })
      let pos = [lng, lat]
      this.mapHelper.addMarker(_.extend({pos: pos}, userInfo), this.bindEventToMarker)
    },
    updateLocation(longitude, latitude) {
        let me = this
        this.$http.post(configUrl.location, {
            userId: utils.getLocalStorage('userId'),
            latitude,
            longitude,
            coordinateType: 1
        }).then(res => {
            console.log('location', res.data);
        }).catch(err => {
            console.log(err);
        })
    },
    getLocation() {
        let me = this
        if (this.refreshLocationTimer) {
          clearInterval(this.refreshLocationTimer)
        }
        this.refreshLocationTimer = setInterval(() => {
          me.mapHelper.geolocation.getCurrentPosition((status, result) => {
              if (status == 'error') {
                console.log(status)
                return;
              }
              let position = result.position 
              let {lng, lat} = position
              if (me.cacheLocation.lng == lng && me.cacheLocation.lat == lat) {
                  return
              }
              me.cacheLocation = {lng, lat}
              me.updateLocation(lng, lat);
                if (this.TrailRefreshTimer) {
                  clearInterval(this.TrailRefreshTimer)
                }
                this.TrailRefreshTimer = setInterval(() => {
                    me.drawTrail()
                }, 20000)
              if (me.needAutoCenter) {
                me.onCenterMap(lng, lat)
              }
          })
        }, 20000)
    },
    onCenterMap(lng, lat) {
      this.mapHelper.setMapCenter(lng, lat)
    },

    drawTrail() {
        this.getTrailData(utils.getLocalStorage('userId'))
    },

    onGetUserlist(userList) {
      let me = this;
      utils.setLocalStorage('userList', JSON.stringify(userList));
      this.mapHelper.removeAllMarker();
      _.each(userList, (userinfo) => {
        let pos = [userinfo.longitude, userinfo.latitude]
        me.mapHelper.addMarker(_.extend({pos: pos}, userinfo), me.bindEventToMarker)
      })
      this.$refs.topbar.markerList = this.mapHelper.mapMarkerList
    },
    onRefreshUserMarker(userId, msg, msgNum) {
      //get Marker
      let refreshMarker = _.find(this.mapHelper.mapMarkerList, (marker) => {
          let extData = marker.getExtData();
          return extData.id == userId;
      })
      if (!refreshMarker) {
          return;
      }
      let dom = refreshMarker.getContentDom();
      if (!msg) {
        return;
      }
      $(dom).find('.msg-num').html(msgNum)
      $(dom).find('.msg-num').show();
      this.mapHelper.addMsgInfoWindow(refreshMarker, msg.message, (msgWindow) => {
      })
    },
    bindEventToMarker(marker) {
      marker.on('click', this.handleMarkerClick)
    },

    onOpenChatDialog(){
      const mapDialog = document.querySelector('.edit-dialog')
      const parentNode = mapDialog.parentNode
      utils.createCanvasBg(mapDialog, parentNode, 'editImageMask')
    },
    handleMarkerClick(e) {
      const me = this
      let extData = e.target.getExtData()
      //clear the number of the msg num
      var contentDom = e.target.getContentDom()
      $(contentDom).find('msg-num').hide()
      //need to get the usergroup
      let userId = extData.id
      this.chat.userSex = extData.sex
      this.chat.toUserId = userId
      let currentUserId = utils.getLocalStorage('userId')
      this.chat.currentUserId = currentUserId
      if (currentUserId == userId) {
          return;
      }
      me.messageTitle = `与${extData.username}对话中`
      me.getChatMsg(currentUserId, userId)
    },
    handleClose(done) {
      done()
    },
    createSendMsg(msgInput) {
      let parentNode = document.querySelector('.chatbox');
      let sendNode = utils.parseDom(`<span class="sendMsg chatmsg clearfix">\
                                      <span class="chat-msg-content">${msgInput}</span>\
                                    </span>`)
      parentNode.appendChild(sendNode[0])
    },
    createRecieveMsg(msg) {
      let img = './static/img/boy_avatar.png'
      if (this.chat.userSex == 2) {
          img = './static/img/girl_avatar.png'
      }
      let parentNode = document.querySelector('.chatbox');
      let recieveNode = utils.parseDom(`<span class="reciveMsg chatmsg clearfix">\
                                      <span class="chat-msg-head" style="background:url(${img});background-size:100%;"></span>\
                                      <span class="chat-msg-content">${msg}</span>\
                                    </span>`)
      parentNode.appendChild(recieveNode[0])
    },
    sendMsg() {
      this.createSendMsg(this.msgInput);
      //create msg
      let {currentUserId, toUserId} = this.chat
      this.$http.post(configUrl.messages, {
        fromId: currentUserId,
        toId: toUserId,
        //category is message type
        //1: test, 2: image 3:video 4: mixin
        category: '1',
        message: this.msgInput
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
      this.msgInput = null
    },
    getChatMsg(currentUserId, userId){
      let me = this
      //fromId/toId  
      this.$http.get(configUrl.messages + `/1/${currentUserId}/${userId}`).then(res => {
        let data = res.data
        if (data.status == 200) {
          let msg = JSON.parse(data.msg)
          me.renderChatMsg(msg);
          me.editDialogVisible = true
        }
      }).catch(err => {
        console.log(err)
      })
      //formId/toId
    },
    renderChatMsg(msg) {
      //"[{"id":2, "fromId":4, "toId":2, "category":1, "message":"test2244", "cTimestamp":1504793294, "status":1}]"
      //status = 1 means new message
      let currentUserId = this.chat.currentUserId
      _.delay(() => {
        let parentNode = document.querySelector('.chatbox');
        parentNode.innerHTML = '';
        //need to order first
        _.orderBy(msg, ['cTimestamp'], ['desc']);
        console.log(msg)
        _.each(msg, (val, key) => {
          //from self mean send
          if (val.fromId == currentUserId) {
            this.createSendMsg(val.message)
          } else if (val.toId == currentUserId) {
            this.createRecieveMsg(val.message)
          }
        })
      }, 150)
    },
    getTrailData(userId, count) {
      const me = this
      count = count || 0
      this.$http.get(configUrl.location + `/${userId}/${count}`).then(res => {
        let trailsData = JSON.parse(res.data.msg)
        // let realTrail = _.uniqBy(trailsData, (item) => {
        //   return item.longitude
        // })
        let paths = []
        _.each(trailsData, item => {
          paths.push([item.longitude, item.latitude])
        })
        let devidedPath = utils.devidePath(paths)
        let trail = []
        _.each(devidedPath, function(path, index){
          trail.push({
            name: `轨迹${index}`,
            path: path
          });
        })
        me.mapHelper.setTrails(trail)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang = "scss">

.mint-msgbox-wrapper {
  z-index: 9999 !important;
}

@media screen and (max-height: 650px) {
  .edit-dialog {
    height: 400px;
  }
}

@media screen and (min-height: 649px) and (max-height: 667px) {
  .edit-dialog {
    height: 460px;
  }
}

@media screen and (min-height: 668px) and (max-height: 736px) {
  .edit-dialog {
    height: 560px;
  }
}

.map-con{
    height: 100%;

    .amap-info-content {
      background: rgba(8, 7, 7, 0.74);
      border-radius: 5px;
      border: none;
    }

    .map-dialog{
      width: 90%;
      background: rgba(8, 7, 7, 0.74);
    }
    .el-message-box{
      width: 50%;
    }
    .modal-active {
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
      left: -20px;
      top: 35%;
      background: url('../assets/sharp.png');
      background-repeat: no-repeat;
    }

    .mask {
      position: absolute;
      top: 0;
      filter: blur(3px);
      width: 100%;
      height: 100%;
    }

    .edit-dialog {

      .el-dialog__body {
        height: 75%;
      }

      .chatbox {
        height: 100%;
        padding: 5px;
        overflow-y: scroll;


        .reciveMsg {
            float: left;

            .chat-msg-content {
                background: #416886;
            }
        }
        .sendMsg {
            float: right;

            .chat-msg-content {
                background: #20a0ff;
            }
        }

        .clearfix:after {
            display:block;
            content: '';
            clear:both;
            height: 0px;
        }
        .chatmsg {
          width: 70%;
          
          .chat-msg-head {
              width: 25px;
              height: 25px;
              background: #ffffff;
              display: inline-block;
              border-radius: 50%;
              vertical-align: middle;
          }
          .chat-msg-content {
            vertical-align: top;
            display: inline-block;
            min-height: 30px;
            height: auto;
            width: 80%;
            border-radius: 3px;
            color: #ffffff;
            font-size: 20px;
            margin-bottom: 5px;
            text-align: left;
            padding: 3px;
            word-wrap: break-word; 
          } 
        }
      }
      .chatfoot {
        
        .el-input {
          width: 75%;
        }
      }
    }
    /* reset element style*/
    .el-dialog__title {
      color: #ffffff;
    }
    .el-tabs__item.is-active {
        color: #20a0ff;
    }

    .el-tab-pane {
      color: #ffffff;;
    }
}

#allmap{
    width: 100%;
    height: 100%;
    margin: 0 auto;
}
/* element style*/

</style>
