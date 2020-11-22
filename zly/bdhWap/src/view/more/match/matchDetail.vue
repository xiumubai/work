<!--
  * 搭配详情
-->
<template>
	<div class="container">
    <header-fix centerText="搭配详情"></header-fix>
    <div class="body-content">
			<div class="matchdetail">
				<div class="img-box">
          <span class="num-tip">{{list.collocation_no}}</span>
          <div class="img" v-if="list.default_image">
            <img :src="list.default_image+'?x-oss-process=image/resize,m_pad,h_500,w_500,color_FFFFFF'" style="width:100%"/>
          </div>
          <div class="img" v-else>
            <img src="~assets/img/common/empty_status/no-good.png" style="width:100%"/>
          </div>
        </div>
        <div class="list">
          <div class="list-item" v-for="(good, index) in list.goods" :key="index">
            <div class="item-block">
              <div class="item-img">
                <router-link :to="{name:'GoodsInfo',query:{id: good.id}}">
                  <img v-if="good.default_image" class=" mui-pull-left" :src="good.default_image+'?x-oss-process=image/resize,h_100,w_100'">
                  <img v-else src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,m_pad,h_200,w_200,color_FFFFFF">
                </router-link>
              </div>
              <div class="item-body">
                <p class="goodsno">款号 : {{good.goods_no}}</p>
                <div>
                  <p style="float: left;">圆牌号 : {{good.card_no}}</p>
                  <p style="float: right;color: red;">￥{{good.meeting_price}}</p>
                </div>
                <div style="clear: both;"></div>
                <p>{{good.title}}</p>
                <div>
                  <p style="float: left;">已订{{good.total_number}}件，共￥{{good.order_money}}</p>
                </div>
                <div style="clear: both;"></div>
                <div style="padding-bottom: 10px; overflow: hidden;">
                  <p class="fav" @click="changeFavorite(good.favorite_level,good.id)">
                    <img
                      v-if="good.favorite_level > 0"
                      src="~assets/img/common/favorite/favorite_on.png"
                      width="20"
                    >
                    <img
                      v-if="good.favorite_level <= 0"
                      src="~assets/img/common/favorite/favorite_off.png"
                      width="20"
                    >
                  </p>
                  <van-button class="btn" @click="addOrderFN(good.id)">加入订单</van-button>
                </div>
              </div>
            </div>
          </div>
        </div>
			</div>
    </div>
    <joinCart v-if="joinCartDisplay" @close="closeJoinCart" :goodsId="goodsId"/>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import joinCart from "@/components/joinCart";
export default {
	data() {
		return {
			list: [],
			id: this.$route.query.id,
			goodsId: '',
			joinCartDisplay: false
		}
	},
	mounted() {
		this.getData();
	},
	methods: {
		async getData() {
			let res = await this.axios({
				url: '/wapi/collocation/info.json',
				params: {
					id: this.id
				}
			})
			this.list = res.collocation;
		},
		changeFavorite(favorite_level, goods_id) {
			this.$toast.clear();
			let data = {};
			if(favorite_level > 0) {
				data.goods_ids = [goods_id];
				this.axios({
					url: "/wapi/goods/favorite/cancel.json",
					method: "post",
					params: data,
					isNotLoading: true
				}).then(() => {
					this.$toast('取消收藏');
					for (var i in this.list.goods) {
						if (this.list.goods[i].id === goods_id) {
							this.list.goods[i].favorite_level = 0
						}
					}
				})
			} else {
				data = {};
				this.axios({
					url: "/wapi/goods/favorite/add.json?favorite_goods["+goods_id+"]=5",
					method: "post",
					params: data,
					isNotLoading: true
				}).then(() => {
					this.$toast('收藏成功');
					for (var i in this.list.goods) {
						if (this.list.goods[i].id === goods_id) {
							this.list.goods[i].favorite_level = 5
						}
					}
				})
			}
		},
		closeJoinCart() {
			this.joinCartDisplay = false
			this.getData();
		},
		addOrderFN(goodid) {
			this.joinCartDisplay = true;
			this.goodsId = goodid;
		}
	},
	components: {
		headerFix,joinCart
	}
};
</script>
<style scoped lang="less">
	.body-content{
    height: calc(100% - 0.44rem);
    background: #fff;
	}
  .matchdetail{
    .img-box{
      position: relative;
      border-bottom: 1px solid #ddd;
      .num-tip{
        top: 40px;
      }
      .img{
        background: #fff;
      }
    }
    .list{
      padding: 0 0.1rem;
      .list-item{
        margin: 0.1rem 0;
        border-bottom: 1px solid #ddd;
        .item-block{
          display: flex;
          .item-img{
            flex: 1rem 0 0;
            height: 1rem;
            padding-right: 2px;
            img{
              width: 1rem;
              height: 1rem;
            }
          }
          .item-body{
            padding-right: .02rem;
            flex: 1;
            .goodsno{
              font-size: 0.15rem;
              color: #333333
            }
            P{
              color: #999;
              font-size: .14rem;
            }
            .fav{
              margin-left: 0.7rem;
              margin-top: 0.08rem;
              float: left;
            }
            .btn{
              float: right;
              background-color: #B4A078;
              color: #fff;
              height: .32rem;
              line-height: .32rem;
              border-radius: 0.03rem;
            }
          }
        }
        .van-swipe-cell__right{
          display: flex;
          justify-content: center;
          align-items: center;
          span{
            display: inline-block;
            width: 1.2rem;
            height: 100%;
            line-height: 1rem;
            text-align: center;
            color: #ffffff;
            background: #F75434;
          }
        }
        
      }
      .list-item:last-child{
        border: none;
        margin-bottom: 0;
      }
    }
  }
</style>
