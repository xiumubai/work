<!--
 * @Description: 任务管理-任务详情
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-19 17:59:33
 * @LastEditors: Please set LastEditors
 -->
<template>
  <page-view :title="false">
    <div slot="headerContent">
      <div class="self-header">
        <h1 class="header-title">任务详情</h1>
        <a-button class="button-back" icon="rollback" @click="handleBack">返回</a-button>
      </div>
    </div>
    <div>
      <a-card :loading="loading" :style="{ marginBottom: '24px' }">
        <a-row>
          <a-col :span="24">
            <div class="detail-content" style="display: flex;">
              <div class="avatar"><a-image :src="taskDetailList.cover"></a-image></div>
              <div class="ant-list">
                <div class="title">{{ taskDetailList.name }}</div>
                <a-row class="detail-list">
                  <a-col :span="6"><span class="name">创建人：</span><span class="text">{{ creator.name }}</span></a-col>
                  <a-col :span="12"><span class="name">时间：</span><a-tooltip :title="taskDetailList.start_time + '-' + taskDetailList.end_time"><span class="text">{{ taskDetailList.start_time }}-{{ taskDetailList.end_time }}</span></a-tooltip></a-col>
                  <a-col :span="6"><span class="name">任务类型：</span><span class="text">{{ taskDetailList.type }}</span></a-col>
                  <a-col :span="6"><span class="name">任务发送范围：</span>
                    <span class="text">
                      <template v-if="execute_departments.length > 0">
                        <block v-for="depart in execute_departments" :key="depart.id" style="margin-right: 8px;">{{ depart.name }}</block>
                      </template>
                      <template v-else>所有部门</template>
                    </span>
                  </a-col>
                  <a-col :span="8"><span class="name">UV/积分：</span><span class="text">{{ taskDetailList.reward_mode }}</span></a-col>
                </a-row>
              </div>
            </div>
          </a-col>
          <a-divider style="margin-bottom: 16px"/>
          <a-col :span="24">
            <detail-list size="small" :col="2">
              <detail-list-item term="领取人数">{{ taskDetailList.accepted_num }}</detail-list-item>
              <detail-list-item ist-item term="转发次数">{{ taskDetailList.shared_times }}</detail-list-item>
              <detail-list-item term="阅读次数（PV）">{{ taskDetailList.pv_num }}</detail-list-item>
              <detail-list-item term="阅读人数（UV）">{{ taskDetailList.uv_num }}</detail-list-item>
              <detail-list-item term="总奖励积分">{{ taskDetailList.total_point }}</detail-list-item>
              <detail-list-item term="剩余积分">{{ taskDetailList.rest_point }}</detail-list-item>
            </detail-list>
          </a-col>
        </a-row>
      </a-card>
      <a-card :loading="loading" :style="{ marginBottom: '24px' }">
        <a-row>
          <a-col :span="23">
            <h4>送达人数-领取任务人数</h4>
            <div>
              <v-chart :forceFit="true" :height="height" :data="dataAccepted">
                <v-coord type="rect" direction="LB" />
                <v-tooltip />
                <v-axis dataKey="name" :label="label" />
                <v-bar position="name*人数" />
              </v-chart>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-card :loading="loading" :style="{ marginBottom: '24px' }">
        <a-row>
          <a-col :span="23">
            <h4>分享次数-产生的阅读次数</h4>
            <div>
              <v-chart :forceFit="true" :height="height" :data="dataShare">
                <v-coord type="rect" direction="LB" />
                <v-tooltip />
                <v-axis dataKey="name" :label="label" />
                <v-bar position="name*人数" />
              </v-chart>
            </div>
          </a-col>
        </a-row>
      </a-card>
      <a-card :style="{ marginBottom: '24px' }" :loading="loading">
        <h4>数据趋势</h4>
        <div :style="{padding: '16px 0'}">
          <a-form layout="inline">
            <a-form-item label="时间粒度" style="margn-right: 20%">
              <a-radio-group @change="handleRadioChange" defaultValue="2" class="radio-group">
                <a-radio-button value="2">1天</a-radio-button>
                <a-radio-button value="1">1小时</a-radio-button>
              </a-radio-group>
            </a-form-item>
            <a-form-item label="时间范围">
              <a-range-picker
                name="buildTime"
                :defaultValue="[moment(start_time, dateFormat), moment(end_time, dateFormat)]"
                @change="handleTimeChange"/>
            </a-form-item>
          </a-form>
        </div>
        <div>
          <a-row>
            <a-col :span="23">
              <line-bar :data="data"></line-bar>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </div>
  </page-view>
</template>

<script>

import { AImage, LineBar } from '@/components'
import { taskDetail, spreadTrends } from '@/api/task'
import { PageView } from '@/layouts'
import Tooltip from 'ant-design-vue/es/tooltip'
import moment from 'moment'

import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  name: 'TaskDetail',
  components: {
    DetailList,
    DetailListItem,
    PageView,
    AImage,
    Tooltip,
    LineBar
  },
  data () {
    return {
      id: '',
      taskDetailList: {},
      execute_departments: [],
      creator: {},
      label: { offset: 12 },
      loading: true,
      dateFormat: 'YYYY-MM-DD',
      queryParam: {
        time_dimension: 2
      },
      start_time: '',
      end_time: '',
      height: 400,
      dataAccepted: [],
      dataShare: [],
      data: []
    }
  },
  created () {
    this.id = this.$route.params.id
    this.loadData()
    this.loadspreadTrendsData()
  },
  methods: {
    moment,
    handleRadioChange (e) {
      this.queryParam.time_dimension = e.target.value
      this.loadspreadTrendsData()
    },
    handleTimeChange (value, dateString) {
      this.queryParam.start_time = dateString[0]
      this.queryParam.end_time = dateString[1]
      this.loadspreadTrendsData()
    },
    loadData () {
      taskDetail(this.id).then(res => {
        this.taskDetailList = res
        this.execute_departments = res.execute_departments
        this.creator = res.creator
        this.dataAccepted = [
          { name: '转发任务人数', '人数': res.shared_num },
          { name: '领取任务人数', '人数': res.accepted_num },
          { name: '送达人数', '人数': res.notified_num }
        ]
        this.dataShare = [
          { name: '转发产生的浏览次数', '人数': res.pv_from_share },
          { name: '转发产生的浏览人数', '人数': res.uv_from_share },
          { name: '总转发次数', '人数': res.shared_times }
        ]
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    loadspreadTrendsData () {
      spreadTrends(this.id, this.queryParam).then(res => {
        this.start_time = res.params.start_time
        this.end_time = res.params.end_time

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
          this.data = data
        })
      })
    },
    handleBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.self-header{
  display: flex;
  align-items: center;
  .header-title{
    font-size: 20px;
  }
  .button-back{
    margin-bottom: 0.5em;
    margin-left: 24px;
    height: 24px;
  }
}

.detail-content{
  display: flex;
  .avatar{
    width: 100px;
    height: 100px;
    background: #ccc;
    margin-right: 16px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .ant-list{
    flex: 1;
    .title{
      font-size: 16px;
      color: rgba(0, 0, 0, 0.85);
      font-weight: 500;
      margin-bottom: 16px;
    }
    .detail-list{
      .name{
        color: rgba(0, 0, 0, 0.85);
        margin-bottom: 16px;
        display: inline-block;
      }
      .text{
        color: rgba(0, 0, 0, .65);
        margin-bottom: 16px;
        display: inline-block;
      }
    }
  }
}
</style>
