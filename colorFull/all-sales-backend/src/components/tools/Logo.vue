<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-09-23 22:42:36
 * @LastEditors: your name
 -->
<template>
  <div class="logo">
    <router-link :to="{name: 'index'}">
      <!-- <LogoSvg alt="logo" /> -->
      <img src="@/assets/colorfull-logo.png" alt="">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  data () {
    return {
    }
  },
  props: {
    title: {
      type: String,
      default: '全员营销',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
