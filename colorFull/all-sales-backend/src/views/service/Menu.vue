<!--
 * @Description: 服务号管理-菜单栏管理
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-12 20:14:01
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-card>
    <p v-for="d in tips" :key="d">
      {{ d }}
    </p>
    <wechat-menu ref="headerChild" :weixinTitle="weixinTitle" :pMenus="menus" :menuTypes="menuTypes" :modules="modules">
    </wechat-menu>
    <div style="margin-top:40px">
      <a-button v-action:wechat-menu-store class="wexin-button" type="primary" @click="saveWechatMenu">保存数据</a-button>
      <a-button v-action:wechat-menu-storewechat class="wexin-button" type="primary" @click="saveWechatMenuToWechat">生成自定义菜单</a-button>
      <a-button v-action:wechat-menu-deletewechat @click="deleteWechatMenuToWechat">删除自定义菜单</a-button>
    </div>
  </a-card>
</template>

<script>
import WechatMenu from '@/components/Service/WechatMenu'
// import requestErrorHelper from '@/utils/mixin'
import { getWechatMenu, saveWechatMenuToWechat, deleteWechatMenuToWechat, saveWechatMenu } from '@/api/manage'
import { isUrl } from '@/utils/util'
export default {
  name: 'Menu',
  data () {
    return {
      weixinTitle: '',
      menus: [],
      menuTypes: {},
      modules: {},
      tips: [
        '注意：1级菜单最多只能开启3个，2级子菜单最多开启5个；',
        '【添加子菜单】：添加子菜单后，主菜单只保留名称，链接内容将被清除；',
        '【生成自定义菜单】：必须在已经保存数据的基础上进行,临时勾选启用点击生成是无效的；第一步必须先修改保存状态，第二步点击生成。',
        '【删除自定义菜单】：删除后，您的微信公众帐号上的自定义菜单将不存在；如果您想继续在微信公众帐号上使用自定义菜单，请点击“生成自定义菜单”按钮，将重新启用。'
      ]
    }
  },
  created () {
    this.getWechatMenu()
  },
  components: {
    'wechat-menu': WechatMenu
  },
  methods: {
    saveWechatMenu: function () {
      const menus = this.$refs.headerChild.menu.button
      const valid = this.checkMenu(menus)
      if (valid === true) {
        saveWechatMenu({ menus: menus }).then(res => {
          this.$message.success('保存成功')
        }).catch(err => {
          if (err.response && err.response.data && err.response.data.message) { this.$message.error(err.response.data.message) } else { this.$message.success('保存失败') }
        })
      }
    },
    saveWechatMenuToWechat: function () {
      saveWechatMenuToWechat().then(res => {
        this.$message.success('生成成功')
      }).catch(err => {
        if (err.response && err.response.data && err.response.data.message) { this.$message.error(err.response.data.message) } else { this.$message.success('生成失败') }
      })
    },
    deleteWechatMenuToWechat: function () {
      deleteWechatMenuToWechat().then(res => {
        this.$message.success('删除成功')
      }).catch(err => {
        if (err.response && err.response.data && err.response.data.message) { this.$message.error(err.response.data.message) } else { this.$message.success('删除失败') }
      })
    },
    getWechatMenu: function () {
      getWechatMenu().then(res => {
        this.weixinTitle = res.app_name
        this.menus = res.menus
        this.menuTypes = res.menu_type
        this.modules = res.modules
      })
    },
    checkMenu: function (menu, isSub = false) {
      menu.forEach(element => {
        const name = element.name
        const count = this.$refs.headerChild.getMenuNameLen(name)
        if ((isSub === false && count > 8) || (isSub === true && count > 16)) {
          this.$message.error('菜单名称长度错误')
          return false
        }
        if (element.type === 'click' && !element.content) {
          this.$message.error('消息必须设置')
          return false
        }
        if (element.type === 'view') {
          if (!element.url) {
            this.$message.error('页面地址必须设置')
            return false
          }
          if (isUrl(element.url) === null) {
            this.$message.error('页面地址设置不正确')
            return false
          }
        }
        if (element.type === 'miniprogram') {
          if (!element.appid) {
            this.$message.error('小程序APPID必须设置')
            return false
          }
          if (!element.pagepath) {
            this.$message.error('小程序路径必须设置')
            return false
          }
          if (!element.url) {
            this.$message.error('小程序备用页面地址必须设置')
            return false
          }
          if (isUrl(element.url) === null) {
            this.$message.error('小程序备用页面地址设置不正确 ')
            return false
          }
        }
        if (element.sub_button) {
          const subMenu = this.checkMenu(element.sub_button, true)
          if (subMenu === false) {
            return false
          }
        }
      })
      return true
    }
  }
}
</script>

<style scoped>
.wexin-button{
  margin-right: 20px

}
</style>
