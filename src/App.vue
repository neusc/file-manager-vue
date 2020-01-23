<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="stylus">
@import './assets/base.styl';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
  width: 100%;
  height: 100%;
  background: url("./assets/image/background.jpg") left top no-repeat
  background-size: 100% 100% 
}
</style>
