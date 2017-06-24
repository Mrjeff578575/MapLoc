<template>
  <nav class="topNav">
    <ul class="browserNav">
      <li><a href="/home" @click="changeActive('home')" :class="{active: active == 'home'}">首页</a></li>
      <li><a href="/device" @click="changeActive('device')">设备管理</a></li>
      <li><a href="/map" @click="changeActive('map')">地图展示</a></li>
      <li><a href="/user" @click="changeActive('user')">个人中心</a></li>
      <li><a href="/login" @click="changeActive('login')">注册、登录</a></li>
    </ul>
    <button class="navbar-toggle" @click="toggleNav">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
    </button>
    <ul class="mobileNav" :class="{activeNav: activeNav}">
        <li><a href="/home" @click="changeActive('home')" :class="{active: active == 'home'}">首页</a></li>
        <li><a href="/device" @click="changeActive('device')">设备管理</a></li>
        <li><a href="/map" @click="changeActive('map')">地图展示</a></li>
        <li><a href="/user" @click="changeActive('user')">个人中心</a></li>
        <li><a href="/login" @click="changeActive('login')">注册、登录</a></li>
    </ul>
  </nav>
</template>
<script>
export default {
  name: 'mapNav',
  data() {
      let active = 'home'
      let activeNav = false;
      return { active, activeNav }
  },
  methods: {
      changeActive: function (str, that) {
        this.isActive = str
      },
      toggleNav: function() {
        this.activeNav = !this.activeNav
      }
  }
}
</script>
<style scoped>
    .browserNav {
        display: none;
    }
    li {
        list-style: none;
    }
    ul {

    }
    .browserNav{
        width: 80%;
        position: absolute;
        right: 0;
        text-align: right;
    }
    .browserNav li {
        display: inline-block;
        margin: 0;
        position: relative;
        cursor: pointer;
        margin-left: 20px;
    }
    .mobileNav{
        position: absolute;
        width: 100%;
        top: 40px;
        background: #20A0FF;
        z-index:99;
        transform: rotateX(90deg);
        transition: all 0.3s ease;
        transform-origin: 0 0;
    }
    .mobileNav.activeNav{
        transform: rotateX(0);
    }
    nav {
        height: 40px;
        line-height: 40px;
        background: #20A0FF;
    }
    a {
        text-decoration: none;
        color: #fff;
        display: block;
        padding: 0 20px;
        opacity: .8;
    }
    a.active {
        font-weight: 700;
        opacity: 1;
    }
    a:hover {
        opacity: 1;
    }
    .active:before {
        content: "";
        display: block;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: #99d2fc;
    }
    .navbar-toggle {
        position: relative;
        float: right;
        padding: 9px 10px;
        margin-top: 3px;
        background-color: transparent;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 4px;
    }
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        border: 0;
    }
    .navbar-toggle .icon-bar {
        display: block;
        width: 22px;
        height: 2px;
        border-radius: 1px;
        background: #ffffff;
    }
    .navbar-toggle .icon-bar+.icon-bar {
        margin-top: 4px;
    }
    
</style>