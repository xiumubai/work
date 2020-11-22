<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-23 15:44:37
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="user-wrapper">
    <div class="content-box">
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <span>{{ nickname }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  computed: {
    ...mapGetters(['nickname'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
