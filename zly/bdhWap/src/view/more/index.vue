<!--
  * 更多
-->
<template>  
	<div class="container">
    <header-fix :showLeft="false" :showRight="false" centerText="更多"></header-fix>
    <div class="body-content">
      <div class="more">
        <router-link :to="{name: 'MatchMore'}">
          <div class="bgd-img" id="match">
            <div class="bgd-mask">
              <div class="my-border">
                <div class="bkg-white">
                  <div class="font-div">
                    <div class="font-title">#搭配订货#</div>
                    <div class="font-desc">帮你减少搭配的烦恼!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>

        <router-link :to="{name: 'ExhibitMore'}">
          <div class="bgd-img" id="exhibit">
            <div class="bgd-mask">
              <div class="my-border">
                <div class="bkg-white">
                  <div class="font-div">
                    <div class="font-title">#陈列订货#</div>
                    <div class="font-desc">主推系列、必订款...一目了然!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>

        <router-link :to="{name: 'DeduceMore'}">
          <div class="bgd-img" id="deduce">
            <div class="bgd-mask">
              <div class="my-border">
                <div class="bkg-white">
                  <div class="font-div">
                    <div class="font-title">#推送订货#</div>
                    <div class="font-desc">采用独立通道、VIP精准推送订货</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>
        
        <router-link :to="{name: 'DeductionMore'}">
          <div class="bgd-img" id="deduction">
            <div class="bgd-mask">
              <div class="my-border">
                <div class="bkg-white">
                  <div class="font-div">
                    <div class="font-title">#360推演#</div>
                    <div class="font-desc">360°产品推演讲解!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <footer-fix></footer-fix>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
export default {
	data() {
		return {
			id: ''
		}
	},
	mounted() {
		this.getData();
	},
	methods: {
		async getData() {
			let res = await this.axios({
				url: '/wapi/meeting/pull.json'
			})
			this.id = res.data.data_id;
		}
	},
	components: {
		headerFix,
		footerFix
	}
};
</script>
<style scoped lang="less">
.more{
  height: 100%;
}
#match{
  background-image: url('~assets/img/more/match_background.png');
}
#exhibit{
  background-image: url('~assets/img/more/exhibit_background.png');margin-top: 0.5%;
}
#deduce{
  background-image: url('~assets/img/more/Bitmap_background.png');margin-top: 0.5%;
}
#deduction{
  background-image: url('~assets/img/more/deduce_background.png');margin-top: 0.5%;
}

.bgd-img {
  height: 24.7%;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.bgd-mask {
  height: 100%;
  background-image: url('~assets/img/more/mask_background.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.my-border {
  position: relative;
  top: 15%;
  width: 70%;
  margin: auto;
  height: 70%;
  border: 2px solid #fbfbfb;
}

.bkg-white {
  position: relative;
  top: 10%;
  width: 80%;
  height: 80%;
  margin: auto;
  text-align: center;
  background: #fbfbfb;
}

.font-div {
  position: absolute;
  width: 100%;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.font-title {
  font-size: 20px;
  color: #151515;
}

.font-desc {
  font-size: 12px;
  color: #333333;
  margin-top: 5px;
}
</style>
