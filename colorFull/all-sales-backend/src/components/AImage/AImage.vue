<template>
  <div class="a-image">
    <div :style="{ backgroundColor: '#fafafa', backgroundImage: 'url('+ src +')'}"></div>
  </div>
</template>
<script>
export default {
  name: 'AImage',
  props: {
    mode: {
      type: String,
      default: ''
    },
    src: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="less" scoped>
.a-image{
  width: 100%;
  height: 100%;
  display: inline-block;
  overflow: hidden;
  position: relative;
}
.a-image div{
  width: 100%;
  height: 100%;
  display: block;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-color: #efefef;
}
</style>
