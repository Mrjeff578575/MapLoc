<template>
  <!-- LOGIN FORM -->
  <!--===================================================-->
  <div class="login-content">
      <div class="cls-content panel">
        <div class="mar-ver pad-btm">
            <h3 style="font-size:20px;color: #ffffff;position: relative;bottom: 20px;">基于地图的社交平台</h3>
        </div>
        <form>
            <div class="form-group">
                <el-input v-model="username" placeholder="请输入用户名"></el-input>
            </div>
            <div class="form-group">
                <el-input v-model="password" placeholder="请输入密码" type="password"></el-input>
            </div>
            <div class="checkbox pad-btm text-left">
                <el-checkbox v-model="checked">记住密码</el-checkbox>
            </div>
            <el-button type="primary" style="width:230px;" @click="login">登 录</el-button>
        </form>
        <div class="pad-all">
            <a href="javascript:;" @click="userGuide" style="margin-right:30px;" class="btn-link mar-rgt">使用手册</a>
            <a href="javascript:;" @click="registerAccount" class="btn-link mar-lft">注册帐号</a>
        </div>
      </div>
  </div>
  <!--===================================================-->
</template>

<script>
import configUrl from './apiConfig'
import utils from '../helper/utils'
import { MessageBox } from 'mint-ui';

export default {
    data () {
        return {
            username: '',
            password: '',
            checked: false,
            cacheLocation: {}
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // 通过 `vm` 访问组件实例
            if (utils.getLocalStorage('token')) {
                this.$emit('loginSuccess');
            }
        })
    },
  methods: {
    login() {
        this.$http.post(configUrl.user + '/signin', {
            username: this.username,
            password: this.password
        }).then(res => {
            let result = res.data
            if (result.status == 200) {
                let data = result.data;
                console.log(result)
                //set common header
                this.$http.defaults.headers.common['token'] = data.token;
                this.$http.defaults.headers.common['uid'] = data.userId;
                utils.setLocalStorage('token', data.token)
                utils.setLocalStorage('userId', data.userId)
                //if login success
                this.$emit('loginSuccess');
            } else {
                MessageBox('登录失败', _.result(result, 'data.errMsg'));
            }

        })
        .catch(err => {
            console.log(err)
        })
    },
    forgetPass() {
        this.$emit('forgetPass')
    },
    registerAccount() {
        this.$emit('registerAccount')
    },

    userGuide() {
        this.$emit('userGuide')
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  a {
    text-decoration: none;
    color: #758697;
    outline: 0;
  }
  .login-content{
    padding: 20px 15px 15px;
    position: relative;
    
    .cls-content {
        width: 70%;
        min-width: 270px;
        margin: 0 auto;
        position: relative;
        background-color: transparent;
        border: 0;
        box-shadow: none;

        .el-checkbox__label {
          color: #758697;
        }

        .btn-link {
            font-weight: 400;
            border-radius: 0;
        }

        .text-left {
            text-align: left;
        }

        .pad-btm {
            padding-bottom: 15px;
        }
        .mar-ver {
            margin-top: 15px;
            margin-bottom: 15px;
        }

        .form-group {
            margin-bottom: 15px;

            .form-control {
            font-size: 13px;
            height: 100%;
            border-radius: 0;
            box-shadow: none;
            border: 1px solid #e9e9e9;
            transition-duration: .5s;
        }
        }

        .checkbox{
            position: relative;
            display: block;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        .pad-all {
          padding: 15px;

          a {
              font-size: 12px;
          }
        }
    }
  }
</style>
