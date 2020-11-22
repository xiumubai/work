<template>
  <a-row type="flex" justify="start">
    <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
      <a-layout class="weixin-preview">
        <a-layout class="weixin-hd">
          <a-layout class="weixin-title">{{ weixinTitle }}</a-layout>
        </a-layout>
        <a-layout class="weixin-bd">
          <a-list class="weixin-menu">
            <a-list-item
              v-for="(btn,i) in menu.button"
              :key="i"
              :class="[{'current':selectedMenuIndex===i && selectedMenuLevel()===1},'menu-item']"
              @click="selectedMenu(i,$event)" >
              <div class="menu-item-title">
                <span>{{ btn.name }}</span>
              </div>
              <a-list class="weixin-sub-menu" v-show="selectedMenuIndex===i">
                <a-list-item v-for="(sub,i2) in btn.sub_button" :key="i2" class="menu-sub-item" :class="{current:selectedSubMenuIndex===i2&&selectedMenuLevel()==2}" @click.stop="selectedSubMenu(i2,$event)">
                  <div class="menu-item-title">
                    <span>{{ sub.name }}</span>
                  </div>
                </a-list-item>
                <a-list-item v-if="btn.sub_button.length<5" class="menu-sub-item" @click.stop="addMenu(2)">
                  <div class="menu-item-title">
                    <i class="icon14_menu_add"></i>
                  </div>
                </a-list-item>
                <i class="menu-arrow arrow_out"></i>
                <i class="menu-arrow arrow_in"></i>
              </a-list></a-list-item>
            <a-list-item class="menu-item" v-if="menu.button.length<3" @click="addMenu(1)">
              <a-icon type="plus" class="weixin_add">
              </a-icon>
            </a-list-item>
          </a-list>
        </a-layout>
      </a-layout>
    </a-col>
    <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
      <a-layout class="weixin-menu-detail" v-if="selectedMenuLevel()==1">
        <div class="menu-input-group menu-delete-group">
          <div class="menu-name">{{ menu.button[selectedMenuIndex].name }}</div>
          <div class="menu-del" @click="delMenu">删除菜单</div>
        </div>
        <div class="menu-input-group">
          <div class="menu-label">菜单名称</div>
          <div class="menu-input">
            <a-input
              placeholder="请输入菜单名称"
              class="menu-input-text"
              v-model="menu.button[selectedMenuIndex].name"
              @input="checkMenuName(menu.button[selectedMenuIndex].name)">
            </a-input>
            <div class="menu-tips" style="color:#e15f63" v-show="menuNameBounds">字数超过上限</div>
            <div class="menu-tips">字数不超过4个汉字或8个字母</div></div>
        </div>
        <template v-if="menu.button[selectedMenuIndex].sub_button.length===0">
          <div class="menu-input-group" >
            <div class="menu-label">菜单内容</div>
            <div class="menu-input">
              <a-select v-model="menu.button[selectedMenuIndex].type" defaultValue="module" name="type" class="menu-input-text">
                <a-select-option value="module">全员营销模块</a-select-option>
                <a-select-option value="click">文字消息</a-select-option>
                <a-select-option value="miniprogram">小程序</a-select-option>
                <a-select-option value="view">跳转网页</a-select-option>
              </a-select>
            </div>
          </div>
          <div class="menu-content" v-if="selectedMenuType()==4">
            <div class="menu-input-group">
              <div class="menu-tips">订阅者点击该子菜单会跳到以下链接</div>
              <div class="menu-label">页面地址</div>
              <div class="menu-input">
                <a-input placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].url">
                </a-input></div>
            </div>
          </div>
          <div class="menu-content" v-else-if="selectedMenuType()==3">
            <div class="menu-input-group">
              <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>
              <div class="menu-label">小程序APPID</div>
              <div class="menu-input">
                <a-input type="text" placeholder="小程序的appid" class="menu-input-text" v-model="menu.button[selectedMenuIndex].appid">
                </a-input></div>
            </div>
            <div class="menu-input-group">
              <div class="menu-label">小程序路径</div>
              <div class="menu-input">
                <a-input type="text" placeholder="小程序的页面路径 pages/Index/index" class="menu-input-text" v-model="menu.button[selectedMenuIndex].pagepath">
                </a-input></div>
            </div>
            <div class="menu-input-group">
              <div class="menu-label">备用网页</div>
              <div class="menu-input">
                <a-input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].url"></a-input>
                <div class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</div>
              </div>
            </div>
          </div>
          <div class="menu-content" v-else-if="selectedMenuType()===2 ">
            <div class="menu-input-group">
              <div class="menu-tips">用于消息接口推送</div>
              <div class="menu-label">消息内容</div>
              <div class="menu-input">
                <a-input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].content">
                </a-input></div>
            </div>
          </div>
          <div class="menu-content" v-else-if="selectedMenuType()===1">
            <div class="menu-input-group">
              <div class="menu-label">模块内容</div>
              <div class="menu-input">
                <a-select
                  firstActiveValue="home"
                  v-model="menu.button[selectedMenuIndex].module_code"
                  name="module"
                  class="menu-input-text">
                  <a-select-option value="home">首页</a-select-option>
                  <a-select-option value="task">领任务</a-select-option>
                  <a-select-option value="center">个人中心</a-select-option>
                </a-select>
              </div>
            </div>

          </div>
        </template>
      </a-layout>
      <a-layout class="weixin-menu-detail" v-if="selectedMenuLevel()==2">
        <div class="menu-input-group menu-delete-group">
          <div class="menu-name">{{ menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].name }}</div>
          <div class="menu-del" @click="delMenu">删除子菜单</div>
        </div>
        <div class="menu-input-group">
          <div class="menu-label">子菜单名称</div>
          <div class="menu-input">
            <a-input type="text" placeholder="请输入子菜单名称" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].name" @input="checkMenuName(menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].name)">
            </a-input>
            <div class="menu-tips" style="color:#e15f63" v-show="menuNameBounds">字数超过上限</div>
            <div class="menu-tips">字数不超过8个汉字或16个字母</div>
          </div>
        </div>
        <div class="menu-input-group">
          <div class="menu-label">子菜单内容</div>
          <div class="menu-input">
            <a-select v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].type" name="type" class="menu-input-text">
              <a-select-option value="module">全员营销模块</a-select-option>
              <a-select-option value="click">文字消息</a-select-option>
              <a-select-option value="miniprogram">小程序</a-select-option>
              <a-select-option value="view">跳转网页</a-select-option>
            </a-select>
          </div>
        </div>
        <div class="menu-content" v-if="selectedMenuType()==4">
          <div class="menu-input-group">
            <div class="menu-tips">订阅者点击该子菜单会跳到以下链接</div>
            <div class="menu-label">页面地址</div>
            <div class="menu-input">
              <a-input name="name" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].url">
              </a-input></div>
          </div>
        </div>
        <div class="menu-content" v-else-if="selectedMenuType()==3">
          <div class="menu-input-group">
            <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>
            <div class="menu-label">小程序APPID</div>
            <div class="menu-input">
              <a-input type="text" placeholder="小程序的appid" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].appid">
              </a-input></div>
          </div>
          <div class="menu-input-group">
            <div class="menu-label">小程序路径</div>
            <div class="menu-input">
              <a-input type="text" placeholder="小程序的页面路径 pages/Index/index" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].pagepath">
              </a-input></div>
          </div>
          <div class="menu-input-group">
            <div class="menu-label">备用网页</div>
            <div class="menu-input">
              <a-input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].url"></a-input>
              <div class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</div>
            </div>
          </div>
        </div>
        <div class="menu-content" v-else-if="selectedMenuType()==2">
          <div class="menu-input-group">
            <div class="menu-tips">用于消息接口推送</div>
            <div class="menu-label">消息内容</div>
            <div class="menu-input">
              <a-input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].content">
              </a-input></div>
          </div>
        </div>
        <div class="menu-content" v-else-if="selectedMenuType()==1">
          <div class="menu-input-group">
            <div class="menu-label">模块内容</div>
            <div class="menu-input">
              <a-select v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].module_code" name="module" class="menu-input-text">
                <a-select-option value="home">首页</a-select-option>
                <a-select-option value="task">领任务</a-select-option>
                <a-select-option value="center">个人中心</a-select-option>
              </a-select>
            </div>
          </div>
        </div>
      </a-layout>
    </a-col>
  </a-row>

</template>

<script>

export default {
  name: 'WechatMenu',
  data () {
    return {
      menu: {
        button: []
      },
      selectedMenuIndex: '', // 当前选中菜单索引
      selectedSubMenuIndex: '', // 当前选中子菜单索引
      menuNameBounds: false, // 菜单长度是否过长
      defaultModuleCode: 'home'
    }
  },
  created () {
    this.menu.button = this.pMenus
  },
  props: {
    weixinTitle: {
      type: String,
      default: '公众号菜单'
    },
    pMenus: {
      type: Array,
      default: function () {
        return []
      }
    },
    menuTypes: {
      type: Object,
      default: function () {
        return {}
      }
    },
    modules: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  watch: {
    pMenus (val) {
      this.menu.button = val
    }
  },
  mounted: function () {
    this.getMenu()
  },
  methods: {
    getMenu: function () {

    },
    // 选中主菜单
    selectedMenu: function (i, event) {
      this.selectedSubMenuIndex = ''
      this.selectedMenuIndex = i
      var selectedMenu = this.menu.button[this.selectedMenuIndex]
      this.checkMenuName(selectedMenu.name)
    },
    // 选中子菜单
    selectedSubMenu: function (i, event) {
      this.selectedSubMenuIndex = i
      var selectedSubMenu = this.menu.button[this.selectedMenuIndex].sub_button[this.selectedSubMenuIndex]
      if (selectedSubMenu.media_id !== undefined && selectedSubMenu !== '' && this.selectedMenuType() === 2) {
        this.getMaterial(selectedSubMenu.media_id)
      }
      this.checkMenuName(selectedSubMenu.name)
    },
    // 选中菜单级别
    selectedMenuLevel: function () {
      if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex === '') {
        // 主菜单
        return 1
      } else if (this.selectedMenuIndex !== '' && this.selectedSubMenuIndex !== '') {
        // 子菜单
        return 2
      } else {
        // 未选中任何菜单
        return 0
      }
    },
    menuTypeChange () {

    },
    // 获取菜单类型 1. 全员营销模块 2.文字消息 3.小程序 4.跳转网页
    selectedMenuType: function () {
      console.log('getMenuType')
      if (this.selectedMenuLevel() === 1 && this.menu.button[this.selectedMenuIndex].sub_button.length === 0) {
        // 主菜单
        return this.getMenuType(this.menu.button[this.selectedMenuIndex].type)
      } else if (this.selectedMenuLevel() === 2) {
        // 子菜单
        return this.getMenuType(this.menu.button[this.selectedMenuIndex].sub_button[this.selectedSubMenuIndex].type)
      } else {
        return 1
      }
    },
    getMenuType (type) {
      switch (type) {
        case 'module':return 1
        case 'click': return 2
        case 'miniprogram': return 3
        case 'view': return 4
      }
      return 1
    },
    // 添加菜单
    addMenu: function (level) {
      if (level === 1 && this.menu.button.length < 3) {
        this.menu.button.push({
          'type': 'module',
          'name': '菜单名称',
          'module_code': 'home',
          'sub_button': [],
          'url': ''
        })
        this.selectedMenuIndex = this.menu.button.length - 1
        this.selectedSubMenuIndex = ''
      }
      if (level === 2 && this.menu.button[this.selectedMenuIndex].sub_button.length < 5) {
        this.menu.button[this.selectedMenuIndex].sub_button.push({
          'type': 'module',
          'name': '子菜单名称',
          'module_code': 'home',
          'url': ''
        })
        this.selectedSubMenuIndex = this.menu.button[this.selectedMenuIndex].sub_button.length - 1
      }
    },
    // 删除菜单
    delMenu: function () {
      if (this.selectedMenuLevel() === 1 && confirm('删除后菜单下设置的内容将被删除')) {
        if (this.selectedMenuIndex === 0) {
          this.menu.button.splice(this.selectedMenuIndex, 1)
          this.selectedMenuIndex = 0
        } else {
          this.menu.button.splice(this.selectedMenuIndex, 1)
          this.selectedMenuIndex -= 1
        }
        if (this.menu.button.length === 0) {
          this.selectedMenuIndex = ''
        }
      } else if (this.selectedMenuLevel() === 2 && confirm('删除后菜单下设置的内容将被删除')) {
        if (this.selectedSubMenuIndex === 0) {
          this.menu.button[this.selectedMenuIndex].sub_button.splice(this.selectedSubMenuIndex, 1)
          this.selectedSubMenuIndex = 0
        } else {
          this.menu.button[this.selectedMenuIndex].sub_button.splice(this.selectedSubMenuIndex, 1)
          this.selectedSubMenuIndex -= 1
        }
        if (this.menu.button[this.selectedMenuIndex].sub_button.length === 0) {
          this.selectedSubMenuIndex = ''
        }
      }
    },
    // 检查菜单名称长度
    checkMenuName: function (val) {
      if (this.selectedMenuLevel() === 1 && this.getMenuNameLen(val) <= 8) {
        this.menuNameBounds = false
      } else if (this.selectedMenuLevel() === 2 && this.getMenuNameLen(val) <= 16) {
        this.menuNameBounds = false
      } else {
        this.menuNameBounds = true
      }
    },
    // 获取菜单名称长度
    getMenuNameLen: function (val) {
      var len = 0
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i)
        // eslint-disable-next-line no-control-regex
        a.match(/[^\x00-\xff]/ig) != null ? len += 2 : len += 1
      }
      return len
    }
  }

}
</script>

<style lang="less">
.weixin-preview
{
    position: relative;
    width: 320px;
    height: 540px;
    float: left;
    margin-right: 10px;
    border: 1px solid #e7e7eb;
    .weixin-title
    {
      color:#fff;
      font-size:15px;
      width:100%;
      text-align: center;
      position:absolute;
      top: 33px;
      left: 0px;
      background-color:transparent;
    }
    .weixin-hd{
	color: #fff;
  text-align: center;
	position: relative;
	top:0px;
  left:0px;
  max-width: 320px;
  width: 100%;
	height:64px;
	background: transparent url('~@/components/Service/images/menu_head.png') no-repeat 0 0;
	background-position: 0 0;
}
.weixin-menu{
	position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #e7e7e7;
    background: transparent url('~@/components/Service/images/menu_foot.png') no-repeat 0 0;
    background-position: 0 0;
    background-repeat: no-repeat;
    padding-left: 43px;
  margin-bottom:0px;
  .menu-item{
	position: relative;
    float: left;
    line-height: 50px;
	height:50px;
    text-align: center;
	width:33.33%;
	border-left: 1px solid #e7e7e7;
	cursor: pointer;
	color:#616161;
}
}
.weixin-sub-menu{
	position: absolute;
	bottom: 60px;
	left: 0;
	right: 0;
	border-top: 1px solid #d0d0d0;
	margin-bottom:0px;
	background: #fafafa;
	display: block;
	padding:0;
}
}
.weixin-preview .icon14_menu_add {
    background: url('~@/components/Service/images/index_z354723.png') 0px 0px no-repeat;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    display: inline-block;
    margin-top: -2px;
}
.weixin-preview .menu-item .menu-item-title,.weixin-preview .menu-sub-item .menu-item-title{
	width:100%;
	overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
	box-sizing: border-box;
}
.weixin-preview .current,.weixin-preview .current.active,.weixin-preview .current.hover
{
    border: 1px solid #44b549!important;
    background: #fff!important;
    color: #44b549!important;
}
.weixin-preview .menu-item:hover {
    color: #000;
}
.weixin-preview .arrow_in{
	bottom: -4px;
	display: inline-block;
	width: 0px;
	height: 0px;
	border-width: 6px 6px 0px;
	border-style: solid dashed dashed;
	border-color: #fafafa  transparent transparent;
}
.weixin-preview .arrow_out{
	bottom: -5px;
	display: inline-block;
	width: 0px;
	height: 0px;
	border-width: 6px 6px 0px;
	border-style: solid dashed dashed;
	border-color: #d0d0d0 transparent transparent;
}
.weixin-preview .menu-arrow {
    position: absolute;
    left: 50%;
    margin-left: -6px;
}
.weixin-preview .weixin-sub-menu.show{
	display:block;
}
.weixin-preview .weixin_add
{
  color:grey;
  width: 100%;
}
.weixin-preview .menu-sub-item:hover{
	background: #eee;
}
.weixin-preview .weixin-sub-menu .menu-sub-item{
	line-height: 50px;
	height:50px;
	text-align: center;
	width:100%;
	border: 1px solid #d0d0d0;
	border-top-width: 0px;
	cursor: pointer;
	position: relative;
	color:#616161;
}
.ant-list-split .ant-list-item {
    border-bottom: 0px solid #e8e8e8;
}

/*菜单内容*/
.weixin-menu-detail{
	padding: 0px 20px 5px;
	background-color: #f4f5f9;
	border: 1px solid #e7e7eb;
	float: left;
	min-height: 540px;
}
.weixin-menu-detail .menu-name{
	float: left;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
}
.weixin-menu-detail .menu-del{
	float: right;
    height: 40px;
    line-height: 40px;
    color: #459ae9;
	cursor:pointer;
}
.weixin-menu-detail .menu-input-group{
	margin:10px 0 30px 0;
}
.weixin-menu-detail .menu-label{
	float: left;
	height: 30px;
	line-height: 30px;
	width:80px;
	text-align: right;
}
.weixin-menu-detail .menu-input{
	float:left;
}
.weixin-menu-detail .menu-input-text{
	border: 0px;
	outline: 0px;
	background: #fff;
	width: 300px;
	padding: 5px 0px 5px 0px;
	margin-left: 10px;
	height: 35px;
}
.weixin-menu-detail .menu-tips{
	color: #8d8d8d;
  padding-top: 4px;
	margin:0;
}
.weixin-menu-detail .menu-tips.cursor{
	color: #459ae9;
    cursor: pointer;
}

.weixin-menu-detail .menu-input .menu-tips{
	margin:0 0 0 10px;
}
.weixin-menu-detail .menu-content{
	padding: 16px 20px;
	border: 1px solid #e7e7eb;
	background-color: #fff;
}
.weixin-menu-detail .menu-content .menu-input-group{
	margin: 0px 0 10px 0;
}
.weixin-menu-detail .menu-content .menu-label{
	text-align: left;
	width:100px;
}
.weixin-menu-detail .menu-content .menu-tips{
	padding-bottom: 10px;
}

.weixin-menu-detail .menu-msg-content{
	padding: 0;
	border: 1px solid #e7e7eb;
	background-color: #fff;
}
.weixin-menu-detail .menu-msg-content .menu-msg-head{
	overflow: hidden;
	border-bottom: 1px solid #e7e7eb;
	line-height: 38px;
	height: 38px;
	padding: 0 20px;
}
.weixin-menu-detail .menu-msg-content .menu-msg-panel{
	padding: 30px 50px;
}
.weixin-menu-detail .menu-msg-content .menu-msg-select{
	padding: 40px 20px;
	border: 2px dotted #d9dadc;
	text-align: center;
}
.weixin-menu-detail .menu-msg-content .menu-msg-select:hover{
	border-color: #b3b3b3;
}
.weixin-menu-detail .menu-msg-content strong{
	display: block;
	padding-top: 3px;
	font-weight: 400;
	font-style: normal;
}
.weixin-menu-detail .menu-msg-content .menu-msg-title{
	float: left;
	width: 310px;
	height: 30px;
	line-height: 30px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.weixin-menu-detail .menu-delete-group
{
border-bottom: 2px #e8e8e8 solid;
}
</style>
