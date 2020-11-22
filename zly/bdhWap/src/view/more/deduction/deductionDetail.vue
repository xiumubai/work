<!--
  * 360推演
-->
<template>
	<div class="container">
    <header-fix centerText="推演详情"></header-fix>
    <div class="body-content">
      <div class="mui-content" id="content">
        <div v-if="list.pic_whole" class="match-box">
          <span class="match-no">{{list.deduction_no}}</span>
          <img style="height: auto;width: 100%;" :src="list.pic_whole+'?x-oss-process=image/resize,m_pad,h_200,w_250,color_FFFFFF'" data-preview-src="" data-preview-group="1" />
        </div>
        <div v-else class="match-box">
          <span class="match-no">{{list.deduction_no}}</span>
          <img class="mui-media-object" style="height: auto;width: 100%;" src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,m_pad,h_200,w_250,color_FFFFFF">
        </div>
        <div v-if="list.pic_blank">
          <div class="div-relative2" style="position: relative;">
            <img :src="list.pic_blank+'?x-oss-process=image/resize,w_420'"/>
            <template v-for="(img,$key) in list.img">
              <img :key="$key" :src="img+'?x-oss-process=image/resize,w_420'" style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;"/>
            </template>
          </div>
        </div>
        <div v-else>
          <img class="mui-media-object kt_img" style="height: auto;width: 100%;" src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,m_pad,h_400,w_500,color_FFFFFF">
        </div>

        <ul class="mui-table-view" style="background: #fff;">
          <template v-for="(good,$key) in list.collocation">
            <li :key="$key" class="mui-li">
              <div style="width: 100%;height: 20px;background-color: #fff">
                <span class="match-no-dp">{{good.collocation_no}}</span>
                <span class="match-no-dp2" v-show="good.tag">{{good.tag}}</span>
              </div>
              <a href="javascript:;" class="mui-a">
                <div v-if="good.pic_whole" class="imgb">
                  <img class=" mui-pull-left img-s3"  :src="good.pic_whole+'?x-oss-process=image/resize,m_pad,h_160,w_80,color_FFFFFF'">
                </div>
                <div v-else>
                  <img class="mui-pull-left img-s3"  src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,m_pad,h_160,w_80,color_FFFFFF">
                </div>

                <div v-if="good.pic_blank" class="imgb">
                  <div class="div-relative">
                    <div class="img-s" :style="'background-image: url('+good.pic_blank+'?x-oss-process=image/resize,m_pad,h_160,w_80,color_FFFFFF);'"></div>
                    <template v-for="(img,$key) in good.img">
                      <div :key="$key" class="img-s" :style="'background-image: url('+img+'?x-oss-process=image/resize,m_pad,h_160,w_80,color_FFFFFF);'"></div>
                    </template>
                  </div>
                  <div class="mui-pull-left img-s3"></div>
                </div>
                <div v-else>
                  <img class="mui-pull-left img-s3"  src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,m_pad,h_160,w_80,color_FFFFFF">
                </div>
                <div class="mui-media-body">
                  <div>
                    <p class='mui-ellipsis' style="float: left;color: #9CA2A2;font-size: 17px;">圆牌号 </p>
                    <p class='mui-ellipsis' style="float: right;color: #9CA2A2;font-size: 17px;">已订/件</p>
                  </div>
                  <div style="clear: both;"></div>
                  <div style="margin-top: 10px;height: 100px;">
                    <template v-for="(goodss,$key) in good.goods">
                      <div :key="$key" style="margin-top: 5px; overflow: hidden;">
                        <p class='mui-ellipsis' style="float: left;color:#333333;font-size: 17px;">{{goodss.card_no}} </p>
                        <p class='mui-ellipsis' style="float: right;color:#333333;font-size: 17px;">{{goodss.order_num}}</p>
                      </div>
                    </template>
                  </div>
                  <div>
                    <p class='mui-ellipsis' style="float: left;"></p>
                    <van-button class="btn" @click="addOrderFN(good.good_ids)">加入订单</van-button>
                  </div>
                </div>
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <deduction-cart v-if="joinCartDisplay" @close="closeDialog()" :good_ids="goodsId"></deduction-cart>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import deductionCart from './deductionCart.vue';
export default {
	data() {
		return {
			joinCartDisplay: false,
			goodsId: '',
			list: []
		}
	},
	mounted() {
		this.getData();
	},
	methods: {
		async getData() {
			let result = await this.axios({
				url: '/wapi/deduction/ded_detail.json',
				params: {
					id: this.$route.query.exhibit_id,
				}
			})
			if(result.status === 200 && result.code === 0) {
				if(result.data) {
					result.data.img = [];
					if(result.data.collocation){
						for(var i = 0; i < result.data.collocation.length; i++) {
							result.data.collocation[i].img = [];
							result.data.collocation[i].good_ids = [];
							if(result.data.collocation[i].goods){
								for(var l = 0; l < result.data.collocation[i].goods.length; l++) {
									var rtn = {};
									rtn.goods_id = result.data.collocation[i].goods[l].goods_id;
									rtn.card_no = result.data.collocation[i].goods[l].card_no;
									result.data.collocation[i].good_ids.push(rtn);
									if(result.data.collocation[i].goods[l].order_num > 0) {
										if(result.data.collocation[i].goods[l].pic_collocation) {
											result.data.collocation[i].img.push(result.data.collocation[i].goods[l].pic_collocation);
										}
										if(result.data.collocation[i].goods[l].pic_deduction) {
											result.data.img.push(result.data.collocation[i].goods[l].pic_deduction);
										}
									}
								}
							}
									
						}
					}
				}
				this.list = result.data;
			}
		},
		addOrderFN(goodsId) {
			this.goodsId = goodsId;
			this.joinCartDisplay = true;
		},
		closeDialog() {
			this.joinCartDisplay = false
			this.getData();
		}
	},
	components: {
		headerFix,deductionCart
	}
};
</script>
<style scoped lang="less">
	.body-content{
		height: calc(100% - 0.44rem);
  }
  .mui-preview-image.mui-fullscreen {
    position: fixed;
    z-index: 20;
    background-color: #000;
  }
  .mui-table-view{
    padding: 10px;
  }
  .mui-li{
    padding-bottom: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #cccccc;
  }
  .mui-a{
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .mui-li:last-child{
    border: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
  .btn{
    float: right;
    border: none;
    background-color: #B4A078;
    color: #fff;
    height: .32rem;
    line-height: .32rem;
    border-radius: 3px;
  }
  .mui-preview-header,
  .mui-preview-footer {
    position: absolute;
    width: 100%;
    left: 0;
    z-index: 10;
  }
  
  .mui-preview-header {
    height: 44px;
    top: 0;
  }
  
  .mui-preview-footer {
    height: 50px;
    bottom: 0px;
  }
  
  .mui-preview-header .mui-preview-indicator {
    display: block;
    line-height: 25px;
    color: #fff;
    text-align: center;
    margin: 15px auto 4;
    width: 70px;
    background-color: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    font-size: 16px;
  }
  
  .mui-preview-image {
    display: none;
    -webkit-animation-duration: 0.5s;
    animation-duration: 0.5s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
  }
  
  .mui-preview-image.mui-preview-in {
    -webkit-animation-name: fadeIn;
    animation-name: fadeIn;
  }
  
  .mui-preview-image.mui-preview-out {
    background: none;
    -webkit-animation-name: fadeOut;
    animation-name: fadeOut;
  }
  
  .mui-preview-image.mui-preview-out .mui-preview-header,
  .mui-preview-image.mui-preview-out .mui-preview-footer {
    display: none;
  }
  
  .mui-zoom-scroller {
    position: absolute;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    width: 100%;
    height: 100%;
    margin: 0;
  }
  
  .mui-zoom {
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
  }
  
  .mui-slider .mui-slider-group .mui-slider-item img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
  }
  
  .mui-android-4-1 .mui-slider .mui-slider-group .mui-slider-item img {
    width: 100%;
  }
  
  .mui-android-4-1 .mui-slider.mui-preview-image .mui-slider-group .mui-slider-item {
    display: inline-table;
  }
  
  .mui-android-4-1 .mui-slider.mui-preview-image .mui-zoom-scroller img {
    display: table-cell;
    vertical-align: middle;
  }
  
  .mui-preview-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: none;
  }
  
  .mui-preview-loading.mui-active {
    display: block;
  }
  
  .mui-preview-loading .mui-spinner-white {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -25px;
    margin-top: -25px;
    height: 50px;
    width: 50px;
  }
  
  .mui-preview-image img.mui-transitioning {
    -webkit-transition: -webkit-transform 0.5s ease, opacity 0.5s ease;
    transition: transform 0.5s ease, opacity 0.5s ease;
  }
  
  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  
  @-webkit-keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  
  @keyframes fadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  
  p img {
    max-width: 100%;
    height: auto;
  }
  .match-box{
    position: relative;
  }
  .match-no {
    z-index: 999;
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
    background: #848484;
    font-size: 12px;
    padding: 0 6px;
    height: 19px;
    line-height: 19px;
    text-align: center;
    color: #fff;
    border-radius: 19px;
  }
  
  .kt_img {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  
  .div-relative {
    position: relative;
    color: #000;
  }
  
  .img-s {
    position: absolute;
    width: 80px;
    height: 160px;
  }
  
  .div-relative2 {
    position: relative;
    color: #000;
    text-align: center;
  }
  .div-relative2 img{display: inline-block;max-width: 100%;max-height: 100%;margin: 0 auto;}
  .match-no-dp {
    z-index: 999;
    /*position: absolute;*/
    top: 12px;
    left: 15px;
    z-index: 2;
    background: #848484;
    font-size: 12px;
    padding: 0 6px;
    height: 19px;
    line-height: 19px;
    text-align: center;
    color: #fff;
    float: left;
  }
  
  .match-no-dp2 {
    z-index: 999;
    /*position: absolute;*/
    top: 12px;
    left: 50px;
    z-index: 2;
    background: #fff;
    font-size: 12px;
    padding: 0 6px;
    height: 19px;
    line-height: 19px;
    text-align: center;
    border: 1px solid red;
    color: red;
    float: left;
    margin-left: 10px;
  }
  
  .img-s3{
    height: 160px;width: 80px!important;margin-right: 10px;
  }
			
</style>
