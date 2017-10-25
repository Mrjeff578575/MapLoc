<template>
    <div class="top-root">
        <div class="top-con">
        <el-button-group>
            <el-autocomplete
                popper-class="marker-autocomplete"
                custom-item="marker-autocomplete"
                v-model="searchVal"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入需要查看的用户"
                @select="handleSelect"
                icon="search"
                class="top-autocomplete"
                >
            </el-autocomplete>
            <el-button type="primary" @click="openSetting">设置</el-button>
        </el-button-group>

        </div>
        <!--setting dialog-->
        <el-dialog
            title="地图设置"
            :visible.sync="settingVisible"
            size="tiny"
            custom-class="setting-dialog map-dialog slideInDown"
            :modal=false
            @open="onOpenSetting"
            :before-close="handleClose">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!-- <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane> -->
                <el-tab-pane label="用户管理" name="userSetting">
                    <div class="map-setting">
                        <ul>
                            <li style="margin-bottom: 5px;">
                                <label style="width: 80px; display:inline-block;">添加好友：</label>
                                <el-button type="primary" @click="openUserlist" class="add-user" style="width:150px;">打开用户列表</el-button>
                            </li>
                            <li>
                                <label style="width: 80px; display:inline-block;">退出登录：</label>
                                <el-button type="primary" @click="logOut" class="add-user" style="width:150px;">退出</el-button>
                            </li>
                        </ul>

                    </div>
                </el-tab-pane>
                <el-tab-pane label="定位管理" name="mapSetting">
                    <div class="map-setting">
                        <label>动态查看功能：</label>
                        <el-switch
                            v-model="isUpdateTrail"
                            @change="changeUpdateTrail"
                            on-text="开启"
                            off-text="关闭">
                        </el-switch>
                    </div>

                </el-tab-pane>
            </el-tabs>
            <span slot="footer" class="dialog-footer">
            </span>
        </el-dialog>
        <!--userlist dialog-->
        <el-dialog
            title="用户列表"
            :visible.sync="userListVisible"
            size="large"
            custom-class="login-dialog map-dialog slideInDown"
            :modal=true
            @open="onOpenSetting" 
        >
            <div class="userlist" style="overflow: scroll;max-height: 400px;">
                <ul>
                    <li v-for="user of userList"> 
                        <span class="user-avatar boy" v-bind:class="{boy: user.sex == 1, gril: user.sex == 2}"></span>
                        <span class="user-name">{{user.name}}</span>
                        <el-button type="primary" style="float: right" v-if="user.isNotFriend" @click="addUser(user)">添加好友</el-button>
                        <el-button type="danger" style="float: right" v-else  @click="unAddUser(user)">取消好友</el-button>
                    </li>
                </ul>
            </div>
        </el-dialog>
        <!--login dialog-->
        <el-dialog
            :title=loginTitle
            :visible.sync="loginDialogVisible"
            size="large"
            custom-class="login-dialog map-dialog slideInDown"
            :modal=true
            @open="onOpenSetting"
            :show-close=false
            :before-close="handleLoginClose">
            <login 
                @loginSuccess="loginSuccessCallback"
                v-if="loginComp == 'login'"
                @forgetPass="forgetPassCb"
                @registerAccount="registerAccountCb"
                @userGuide="openUserGuide"
            >
            </login>
            <register
            v-else-if="loginComp == 'register' "
            @registerSuccess="registerSuccessCallback"
            @backToLogin="backToLogin"
            ></register>
            <div class="userGuide" v-else-if="loginComp == 'userGuide'">
                <h3 style="font-size:14px;">欢迎您来到 基于地图的娱乐社交平台</h3>
                </br>
                    <span class="first-title">● 平台使用要求：</br></span>
                    <span class="content"> 1. 基于Android和IOS自带浏览器网络访问即可。</br></span>
                    <span class="content"> 2. 请在第一次访问时提示浏览器获取您定位是点击同意确认或之后在浏览器设置中手动打开允许浏览器获取定位开关。</br></span>
                    <span class="first-title">● 平台使用优势:</span>
                    <span class="content">1. 个人使用该平台可在任意出行和旅游时记录下自己的轨迹，只要坚持您将可视化地看到您的足迹已遍布大江南北大街小巷您是有多了解您的城市和国家～</br></span>
                    <span class="content">2. 朋友使用该平台您们可互加好友，您们可在共同聚会出行或旅游时看到彼此共享的地图位置还可实时基于地图聊天，清清楚楚明明白白地看到和指导大家的方向和分享趣事儿～</span>
                    </br>
                    <span class="content">3. 第一版暂支持以上功能，将在第二和三版时支持如基于地图的动态事件新闻分享、活动分享与组织，、自定义头像和动态新消息提示、群聊和上传图片及语音等功能。</span>
                    </br>
                    <span class="first-title">● 平台使用方法：</br></span>
                    <span class="content">1、用户可通过刷新页面进入我们的应用平台，第一次登录前可通过点击使用手册查询平台介绍，第一次使用会需要点击注册账号跳转进行用户基本信息注册，请至少填写用户名、性别、密码和确认密码，然后回到登录界面进行登录。</span>
                    </br>
                    <span class="content">2、用户登录后可点击地图上方搜索框右边的蓝色设置按钮打开设置界面，切换到角色管理栏点击添加好友并选择想要查看位置信息和聊天的好友(第一版应用不需要验证)，之后用户便能在地图上看到对应好友的最新位置和她们聊天了。</span>
                    </br>
                    <span class="content">3、用户最新定位获取必须保持手机点亮和浏览器打开状态，地图将每隔20秒刷新所有用户位置及其它信息，在配置管理栏可动态开启或关闭动态查看当前用户定位功能，开启后地图更新时将始终以当前用户为中心显示，关闭后可任意查看其它地方和用户。</span>
                    </br>
                    <span class="content">4、点击地图上方的搜索栏可显示所有可见用户列表，点击其一可自动跳转到被选用户的地图位置查看和聊天。</span>
                    </br>
                    <span class="content">5、点击想要聊天的用户头像弹出聊天框可进行任意聊天(第一版暂只支持文字聊天)。</span>
                    <span class="first-title"> ● 平台宗旨：</br></span>
                    
                    <span class="content">始终以用户需求为平台实现目的，希望您轻松愉快地在我们平台记录您的旅行轨迹并基于地图愉快地社交，后续功能将在下一版发布，我们期待您的反馈建议并去做相应的优化和更新，谢谢使用。</span>
            </div>
            <span slot="footer" class="dialog-footer" v-if="loginComp == 'userGuide'">
                <el-button type="primary" @click="loginComp = 'login'">返 回</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
import register from './register'
import login from './login'
import Vue from 'vue'
import {mapState} from 'vuex'
import _ from 'lodash'
import utils from '../helper/utils'
import configUrl from './apiConfig'
import { MessageBox } from 'mint-ui';

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
            settingVisible: false,
            loginDialogVisible: false,
            userListVisible: false,
            searchVal: '',
            isUpdateTrail: true,
            activeName: 'userSetting',
            loginComp: 'login',
            loginTitle: '',
            friendList: [],
            userList: [
                {username: 'test1'},
                {username: 'test2'}
            ],
            markerList: []
        }
    },
    components: {
        'login': login,
        'register': register
    },
  methods: {
    handleSelect(selectVal) {
        const me = this
        //find which marker will be hightlight
        const resultMarker =  _.find(this.markerList, (marker) => {
            let extData = marker.getExtData();
            return extData.id == selectVal.id
        })
        me.highLightMarker(resultMarker)
    },
    handleClick() {
        console.log(this.activeName)
    },
    openSetting() {
        this.settingVisible = true
    },
    onOpenSetting() {
        const mapDialog = document.querySelector('.setting-dialog')
        const parentNode = document.querySelector('.top-root > .el-dialog__wrapper')
        utils.createCanvasBg(mapDialog, parentNode, 'imageMask')
    },

    highLightMarker(marker) {
        //get marker object
        //define marker's behavior
        marker.setAnimation('AMAP_ANIMATION_BOUNCE')
        setTimeout(_ => {
            marker.setAnimation('AMAP_ANIMATION_NONE')
        }, 3000)
        console.log(this)
        this.$parent.mapHelper.setMapZoomAndCenter(undefined, marker.getPosition())
    },
    handleClose(done) {
        done()
    },
    querySearchAsync(queryString, cb) {
        const me = this;
        let searchCollection = this.loadSearchCollection();
        let results = queryString ? searchCollection.filter(this.createStateFilter(queryString)) : searchCollection;
        console.log(results)
        clearTimeout(this.timeout);
        this.timeout = setTimeout(_ => {
            cb(results);
        }, 500 * Math.random());
    },
    createStateFilter(queryString) {
        return (state) => {
            return (state.name.indexOf(queryString.toLowerCase()) === 0)
        };
    },
    loadSearchCollection() {
        let extDataArr = []
        _.each(this.markerList, (marker) => {
            let extData = marker.getExtData();
            extDataArr.push({
                name: extData.username,
                id:  extData.id
            })
        })
        return extDataArr
    },
    showLogin() {
        this.loginDialogVisible = true
    },
    loginSuccessCallback() {
        let me = this;
        this.loginDialogVisible = false
        this.$emit('loginSuccess')
        this.getfriends((userList) => {
            me.$emit('onGetUserlist', userList)
        });
        //need refresh the message 
        // let messageRefreshTimer = setInterval(() => {
        //     this.getNewMessage()
        // }, 20000)
    },
    changeFriendStatus(userList) {
        let me = this;
        if (!this.friendList.length) {
            this.friendList = JSON.parse(utils.getLocalStorage('friendList'))
        }
        console.log(userList)
        console.log(this.friendList)
        _.each(userList, (user) => {
            let friend = _.find(me.friendList, {userId: user.userId});
            if (!friend) {
                friend = _.find(me.friendList, {friendId: user.userId});
            }
            if (friend) {
                user.isNotFriend = false;
            } else {
                user.isNotFriend = true;
            }
        })
    },
    registerSuccessCallback() {
        this.loginComp = 'login'
    },
    forgetPassCb() {
        
    },
    registerAccountCb() {
        this.loginTitle = '注册'
        this.loginComp = 'register'
    },
    handleLoginClose(done) {
        if (utils.getLocalStorage('login')) {
            done()
        }
    },
    openUserlist() {
        this.getUserList((userList) => {
            this.changeFriendStatus(userList)
            this.userListVisible = true
        });
    },
    getUserList(cb) {
        let me = this
        this.$http.get(configUrl.user + '/all')
            .then(res => {
                let result = res.data
                console.log(result)
                if (result.status == 200) {
                    let userList = result.data.userList
                    me.userList = userList
                    _.remove(userList, (user) => {
                        let currentUserId = utils.getLocalStorage('userId')
                        return user.userId == currentUserId
                    })
                    cb && cb(userList)
                    //need refresh the marker
                    //need get the message num
                } else {
                    me.logOut()
                }
            }).catch(err => {
                console.log(err)
            })
    },
    getfriends(cb) {
        let me = this;
        let friendList = [];
        let currentUserId = utils.getLocalStorage('userId')
        this.$http.get(configUrl.user + `/friends/${currentUserId}`)
            .then((res) => {
                console.log(res)
                let result = res.data
                if (result.status == 200) {
                    friendList = result.data.friends
                    utils.setLocalStorage('friendList', JSON.stringify(friendList))
                    me.friendList = friendList
                    cb && cb(friendList)
                } else {
                    MessageBox('请求失败', _.result(res, 'data.data.errMsg'));
                    me.logOut()
                }
            })
            .catch(err => {
                console.log(err)
            })
    },

    getNewMessage(cb) {
        //get friend user list
        let me = this
        let friendList = [];
        let currentUserId = utils.getLocalStorage('userId')
        this.$http.get(configUrl.user + `/friends/${currentUserId}`)
            .then((res) => {
                let result = res.data
                if (result.status == 200) {
                    friendList = result.data.friends
                    utils.setLocalStorage('friendList', JSON.stringify(friendList))
                    //get the new message
                    me.friendList = friendList
                    me.$emit('onGetUserlist', friendList)
                    let makeRequest = [];
                    _.each(friendList, (val) => {
                        let toUserId = val.id
                        makeRequest.push(me.$http.get(configUrl.messages + `/1/${currentUserId}/${toUserId}`))
                    })
                    me.$http.all(makeRequest).then(me.$http.spread(function (...results) {
                        _.each(results, function(res) {
                            me.handleNewMsg(res)
                        })
                    }))
                }
            })
            .catch((err) => {
                console.log(err)
            })
        cb && cb()
    },

    handleNewMsg(res) {
        let me = this
        let data = res.data
        let currentUserId = utils.getLocalStorage('userId')
        if (data.status == 200) {
            let msg = JSON.parse(data.msg)
            if (msg.length) {
                _.orderBy(msg, ['cTimestamp']);
                let num = _.filter(msg, (item) => {
                    return item.status == 2 && item.fromId != currentUserId
                })
                let msgNum = num ? num.length : 1
                if (msg[0].status == 2 && msg[0].fromId != currentUserId) {
                    //need refresh the user avatar
                    me.$emit('refreshUserMarker',  msg[0].fromId, msg[0], msgNum)
                }
            }
        }
    },

    addUser(user) {
        let me = this;
        //category = 1 means only see
        //category = 2 means chat and see
        let category = 1;
        let currentUserId = utils.getLocalStorage('userId')
        this.$http.post(configUrl.user + '/addFriend', {
          //category: category,
          fromId: currentUserId,
          toId: user.userId
        })
        .then(res => {
            let result = res.data
            if (result.status == 200) {
                MessageBox('添加好友成功', '添加好友成功');
            } else {
                MessageBox('添加好友失败', result.data.errMsg);
            }
        }).catch(err => {
            console.log(err)
        })
    },

    unAddUser(user) {
        let me = this;
        //category = 1 means only see
        //category = 2 means chat and see
        let category = 1;
        let currentUserId = utils.getLocalStorage('userId')
        this.$http.post(configUrl.user + '/unAddFriend', {
          fromId: currentUserId,
          toId: user.userId
        })
        .then(res => {
            let result = res.data
            if (result.status == 200) {
                MessageBox('取消好友成功', '取消好友成功');
            } else {
                MessageBox('取消好友失败', result.data.errMsg);
            }
        }).catch(err => {
            console.log(err)
        })    
    },

    changeUpdateTrail() {
        if(this.isUpdateTrail) {
            MessageBox('动态查看已开启');
        } else {
            MessageBox('动态查看已关闭');
        }
        this.$emit('changeUpdateTrail', this.isUpdateTrail)
    },

    backToLogin() {
        this.loginComp = 'login'
        this.loginTitle = ''
    },

    openUserGuide() {
        this.loginComp = 'userGuide'
        this.loginTitle = '平台使用手册'
    },

    logOut() {
        utils.clearLocalStorage('token', '');
        utils.clearLocalStorage('userId', '');
        this.isUpdateTrail = true
        this.loginDialogVisible = true
        this.settingVisible = false
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
        text-align: right;
    }
    .top-autocomplete {
        width: 80%;
        float: left;
    }
    .el-button-group {
        width: 100%;
        padding-left: 20px;
    }

    .userGuide {
        height: 330px;
        overflow: scroll;
        color: #ffffff;
        text-align: left;
        letter-spacing: 1px;
        padding-top: 5px;

        .first-title {
            font-size: 14px;
        }

        .content {
            padding-left: 10px;
            display: inline-block;
        }
    }

    .map-setting {
        width: 100%;
        height: 100%;
        text-align: left;
    }
    .userlist {
        
        li {
            margin: 5px;
            text-align: left;
            padding-bottom: 5px;
            border-bottom: 1px solid #48576a;
        }
        .user-avatar{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            vertical-align: top;
            background: #fff;
            display: inline-block;

            &.boy {
                background: url("../../static/img/boy_avatar.png");
            }

            &.girl {
                background: url("../../static/img/girl_avatar.png");
            }
        }
        .user-name{
            display: inline-block;
            height: 40px;
            line-height: 40px;
            font-size: 20px;
            color: #fff;
            margin-left: 5px;
        }
    }
}

</style>