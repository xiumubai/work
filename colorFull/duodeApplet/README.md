### 安装（更新） wepy 命令行工具。
	npm install wepy-cli -g

### 安装依赖包
	npm install

### 开发实时编译
	npm run dev

### 生产压缩
	npm run build //上传代码时，请先执行此命令，否则会提示包体积过大

### 开发使用说明(重要)

1、使用微信开发者工具-->添加项目，项目目录请选择dist目录。

2、微信开发者工具-->项目-->关闭ES6转ES5。 <font color=red>重要：漏掉此项会运行报错。</font> 

3、微信开发者工具-->项目-->关闭上传代码时样式自动补全。  <font color=red>重要：某些情况下漏掉此项也会运行报错。</font> 

4、微信开发者工具-->项目-->关闭代码压缩上传。  <font color=red>重要：开启后，会导致真机computed, props.sync 等等属性失效。</font> 

### wepy开发文档地址
  https://tencent.github.io/wepy/index.html

### 小程序开发文档
	https://developers.weixin.qq.com/doc/

### wepy项目的创建及打包
  https://blog.csdn.net/weixin_42754418/article/details/81144069

### kai-ui官网
  https://chaunjie.github.io/kui/dist/#/wepy/start

### 目录结构

    ├── api
    │   └── api.js              //接口
    ├── app.wpy                 //入口文件
    ├── components                  //自定义组件文件夹
    ├── vant-weapp                  //vant-weapp组件文件夹
    │   ├── article.wpy             //知识资讯组件
    │   ├── audio.wpy               //音频组件
    │   ├── courseItem.wpy          //课程列表组件
    │   ├── popup.wpy               //弹出框组件
    │   ├── topNav.wpy              //自定义头部组件
    ├── static                      //静态资源文件夹
    │   ├──css                      //css文件文件夹
    │   │  ├── base.less            //全局less文件
    │   ├──images                   //图片文件夹
    ├── pages                       //页面文件夹
    │   ├── index.wpy                         //首页
    │   ├── assisted_learning.wpy             //辅学中心
    │   ├── learning_plan_list.wpy            //学习计划列表
    │   ├── course.wpy                        //课程中心
    │   ├── course_list.wpy                   //课程列表
    │   ├── course_detail.wpy                 //课程详情
    │   ├── order_detail.wpy                  //订单详情
    │   ├── listen_and_look.wpy               //听一听，看一看
    │   ├── info.wpy                          //个人中心
    │   ├── info_edit.wpy                     //修改我的资料
    │   ├── about_us.wpy                      //关于我们
    │   ├── follow_tags.wpy                   //关注标签
    │   ├── welcome.wpy                       //开始吧
    │   ├── reading.wpy                       //智能点读
    │   ├── pronunciation_practice.wpy        //发音练习
    │   ├── pronunciation_practice_list.wpy   //发音练习章节切换
    │   ├── fast_learn_word.wpy               //快速识字
    │   ├── listen_write.wpy                  //课后听写
    │   ├── listen_write_list.wpy             //课后听写章节切换
    │   ├── super_count.wpy                   //超级口算
    │   ├── listen_write.wpy                  //课后听写
    │   ├── book_chapter_list.wpy             //电子课本目录
    │   ├── book_chapter_list.wpy             //电子课本切换
    │   ├── sync_practice_list.wpy            //同步练习章节切换
    └── utils                   //工具类文件夹
        ├── constant.js             //常量
        ├── tip.js                  //提示弹框组件
        ├── util.js                 //工具
        └── request.js              //request请求