<template>
  <!-- LOGIN FORM -->
  <!--===================================================-->
  <div class="login-content">
    <div class="cls-content panel">
        <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
            <el-form-item prop="username">
                <el-input placeholder="请输入用户名（必填）" v-model="ruleForm2.username">
                    <template slot="prepend"><i class="icon iconfont icon-accountfilling"></i></template>
                </el-input>
            </el-form-item>
            
            <el-form-item prop="sex" style="text-align: left;color:#ffffff">
                <label for="">请选择性别：</label>
                <el-radio-group v-model="ruleForm2.sex">
                    <el-radio class="radio" label="1">男</el-radio>
                    <el-radio class="radio" label="2">女</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item prop="password">
                <el-input placeholder="请输入密码（必填）" v-model="ruleForm2.password" type="password">
                    <template slot="prepend"><i class="icon iconfont icon-password"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item prop="checkPass">
                <el-input placeholder="请确认密码（必填）" v-model="ruleForm2.checkPass" type="password">
                    <template slot="prepend"><i class="icon iconfont icon-password"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item prop="phoneNumber">
                <el-input placeholder="请输入手机号" v-model="ruleForm2.phoneNumber">
                    <template slot="prepend"><i class="icon iconfont icon-mobilephone"></i></template>
                </el-input>
            </el-form-item>

            <el-form-item prop="qq">
                <el-input placeholder="请输入QQ号" v-model="ruleForm2.qq">
                    <template slot="prepend">QQ</template>
                </el-input>
            </el-form-item>

            <el-form-item prop="birthday">
                <el-input placeholder="请输入生日: 19920422" v-model="ruleForm2.birthday">
                    <template slot="prepend">生日</template>
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="register">提交</el-button>
                <el-button @click="reset">重置</el-button>
                <el-button type="primary" @click="backToLogin">返回</el-button>
            </el-form-item>
        </el-form>
    </div>

  </div>
  <!--===================================================-->
</template>

<script>
import configUrl from './apiConfig';
import utils from '../helper/utils'
import _ from 'lodash';
import { MessageBox } from 'mint-ui';

export default {
  data () {
        let validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm2.checkPass !== '') {
                    this.$refs.ruleForm2.validateField('checkPass');
                }
                callback();
            }
        };
        let validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm2.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                this.isAllowSubmit = true;
                callback();
            }
        }
        let validateUsername = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入用户名'));
            } else {
                callback();
            }
        }
        return {
            ruleForm2: {
                password: '',
                checkPass: '',
                username: '',
                phoneNumber: '',
                sex: '',
                qq:'',
                birthday: ''
            },
            rules2: {
                username: [
                    {validator: validateUsername, trigger: 'blur'}
                ], 
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            isAllowSubmit: false,
            submitDisable: true
        }
  },
  methods: {
        register() {
            const {username, password, qq, sex, phoneNumber, birthday} = this.ruleForm2;
            console.log({username, password, qq, sex, phoneNumber})
            this.$refs.ruleForm2.validateField('username');
            this.$refs.ruleForm2.validateField('password');
            this.$refs.ruleForm2.validateField('checkPass');
            if (!this.isAllowSubmit) {
                return;
            }
            this.$http.post(configUrl.user + '/signup', {
                username,
                password: password,
                qq,
                sex,
                phone: phoneNumber,
                birthday
            }).then(res => {
                // let localStorage = window.localStorage;
                // localStorage.setItem('login', true);
                let result = res.data
                if (result.status == 200) {
                    MessageBox('注册成功', '注册新用户成功');
                    this.$emit('registerSuccess');
                } else {
                    MessageBox('注册失败', result.data.errMsg);
                }
            })
            .catch(err => {
                console.log(err)
            })
        },
        reset() {
            _.each(this.ruleForm2, (item, key)=> {
                this.ruleForm2[key] = '';
            })
        },

        backToLogin() {
            this.$emit('backToLogin')
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
        .el-checkbox__label {
          color: #758697;
        }
        .el-radio {
            color: #ffffff;
        }

        .btn-link {
            font-weight: 400;
            border-radius: 0;
        }

        .text-left {
            text-align: left;
        }

        .panel-body {
          padding: 15px 20px 25px;

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
