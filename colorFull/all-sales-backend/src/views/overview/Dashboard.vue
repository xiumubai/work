<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-22 14:59:58
 * @LastEditTime: 2019-10-29 17:16:45
 * @LastEditors: Please set LastEditors
 -->
<template>
  <page-view>
    <div>
      <a-card :loading="loading" style="margin-bottom: 24px;">
        <div>
          <a-form layout="inline">
            <a-form-item
              label="查询时间">
              <a-date-picker
                style="width: 200px"
                :defaultValue="moment(queryParams.start_time, dateFormat)"
                :format="dateFormat"
                @change="handleChangeStartTime"/>
              -
              <a-date-picker
                style="width: 200px"
                :defaultValue="moment(queryParams.end_time, dateFormat)"
                :format="dateFormat"
                @change="handleChangeEndTime"/>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="handleSearch">查询</a-button>
            </a-form-item>
          </a-form>
        </div>
      </a-card>
      <a-row :gutter="24">
        <a-col :span="12" :style="{ marginBottom: '24px' }">
          <a-card hoverable :loading="loading">
            <div class="card-container">
              <h4>任务数量</h4>
              <div class="card-content">
                <div class="card-item">
                  <h2>{{ task.total }}</h2>
                  <p>总计</p>
                </div>
                <div class="card-item">
                  <h2>{{ task.ongoing }}</h2>
                  <p>进行中</p>
                </div>
                <div class="card-item">
                  <h2>{{ task.ended }}</h2>
                  <p>已结束</p>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12" :style="{ marginBottom: '24px' }">
          <a-card hoverable :loading="loading">
            <div class="card-container">
              <h4>任务传播效果</h4>
              <div class="card-content">
                <div class="card-item">
                  <h2>{{ spread.viewed_users }}</h2>
                  <p>浏览人数</p>
                </div>
                <div class="card-item">
                  <h2>{{ spread.viewed_times }}</h2>
                  <p>浏览次数</p>
                </div>
                <div class="card-item">
                  <h2>{{ spread.shared_users }}</h2>
                  <p>转发人数</p>
                </div>
                <div class="card-item">
                  <h2>{{ spread.shared_times }}</h2>
                  <p>转发次数</p>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12" :style="{ marginBottom: '24px' }">
          <a-card hoverable :loading="loading">
            <div class="card-container">
              <h4>积分统计</h4>
              <div class="card-content">
                <div class="card-item">
                  <h2>{{ point.task_reward }}</h2>
                  <p>产生积分数量</p>
                </div>
                <div class="card-item">
                  <h2>{{ point.goods_exchange }}</h2>
                  <p>实际兑换积分数量</p>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
        <a-col :span="12" :style="{ marginBottom: '24px' }">
          <a-card hoverable :loading="loading">
            <div class="card-container">
              <h4>成员参与情况</h4>
              <div class="card-content">
                <div class="card-item">
                  <h2>{{ participation.accepted_staffs_num }}</h2>
                  <p>领取任务人数</p>
                </div>
                <div class="card-item">
                  <h2>{{ participation.accepted_times }}</h2>
                  <p>领取任务次数</p>
                </div>
                <div class="card-item">
                  <h2>{{ participation.shared_staffs }}</h2>
                  <p>转发人数</p>
                </div>
                <div class="card-item">
                  <h2>{{ participation.shared_times }}</h2>
                  <p>转发次数</p>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
      <a-card :loading="loading">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <a-tab-pane loading="true" tab="积分传播效果" key="1">
            <a-row>
              <a-col :span="23" >
                <div>
                  <line-bar :data="trendData" :fields="trendfields"></line-bar>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="积分统计" key="2">
            <a-row>
              <a-col :span="23" >
                <div :style="{ padding: '32px 32px' }">
                  <line-bar :data="pointData" :fields="pointfields"></line-bar>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="成员参与情况" key="3">
            <a-row>
              <a-col :span="23" >
                <div>
                  <line-bar :data="participationData" :fields="participationfields"></line-bar>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </page-view>
</template>
<script>
import { PageView } from '@/layouts'
import moment from 'moment'
import { overviewQuantities, spreadTrends, pointTrends, participationTrends } from '@/api/overview'
import { LineBar } from '@/components'
export default {
  components: { PageView, LineBar },
  name: 'Dashboard',
  data () {
    return {
      queryParams: {},
      data: [],
      overview: {},
      task: {},
      point: {},
      spread: {},
      participation: {},
      loading: true,
      dateFormat: 'YYYY/MM/DD',
      trendData: [],
      pointData: [],
      participationData: [],
      trendfields: ['浏览次数', '浏览人数', '转发次数', '转发人数'],
      participationfields: ['领取次数', '领取人数', '分享次数', '分享人数'],
      pointfields: ['产生的积分', '兑换的积分']
    }
  },
  created () {
    this.loadData()
    this.loadChartData()
  },
  methods: {
    moment,
    handleChangeStartTime (date, dateString) {
      this.queryParams.start_time = dateString
    },
    handleChangeEndTime (date, dateString) {
      this.queryParams.end_time = dateString
    },
    handleSearch () {
      this.loadData()
      this.loadChartData()
    },
    loadData () {
      overviewQuantities(this.queryParams).then(res => {
        this.queryParams.start_time = res.start_time
        this.queryParams.end_time = res.end_time
        this.loading = false
        this.task = res.task_num
        this.spread = res.task_spread
        this.point = res.point_num
        this.participation = res.participation
      }).catch(() => {
        this.loading = false
      })
    },
    loadChartData () {
      spreadTrends(this.queryParams).then(res => {
        const data = res.data.map(item => {
          return {
            'datetime': item.datetime,
            '浏览次数': item.viewed_times,
            '浏览人数': item.viewed_users,
            '转发次数': item.shared_times,
            '转发人数': item.shared_users
          }
        })
        this.$nextTick(() => {
          this.trendData = data
        })
      })
      pointTrends(this.queryParams).then(res => {
        const data = res.data.map(item => {
          return {
            'datetime': item.datetime,
            '产生的积分': item.distributed,
            '兑换的积分': item.exchanged
          }
        })
        this.$nextTick(() => {
          this.pointData = data
        })
      })
      participationTrends(this.queryParams).then(res => {
        const data = res.data.map(item => {
          return {
            'datetime': item.datetime,
            '领取次数': item.accepted_times,
            '领取人数': item.accepted_staffs,
            '分享次数': item.shared_times,
            '分享人数': item.shared_staffs
          }
        })
        this.$nextTick(() => {
          this.participationData = data
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
.card-container{
  .card-content{
    display: flex;
    justify-content: space-around;
    padding: 16px 0;
    .card-item{
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
