<template>
  <router-view></router-view>
</template>

<script>
import { mapState } from 'vuex' // simplifies process of mapping state properties to computed properties
export default {
  name: 'App',
  // spreading result of mapState for 'user' module and 'userInfo' bound to 'userInfo' state from Vuex store
  computed: {
    ...mapState('user', ['userInfo'])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
