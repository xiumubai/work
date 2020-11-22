<!--
 * @Description: 任务管理-任务列表
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 11:42:31
 * @LastEditors: Please set LastEditors
 -->
<template>
  <page-view>
    <div>
      <a-card>
        <div class="top-search">
          <a-radio-group @change="handleRadioChange" defaultValue="0" class="radio-group">
            <a-radio-button value="0">总任务数{{ status_num.total_num }}</a-radio-button>
            <a-radio-button value="2">进行中{{ status_num.ongoing_num }}</a-radio-button>
            <a-radio-button value="3">已结束{{ status_num.ended_num }}</a-radio-button>
          </a-radio-group>
          <a-button type="primary" @click="exportFN()" class="export-button">导出</a-button>
        </div>
        <a-table
          class="table"
          :columns="columns"
          :dataSource="taskList"
          :loading="loading"
          @change="handleTableChange"
          :pagination="pagination"
          :rowKey="record => record.id">
          <template slot="creator" slot-scope="text, record">
            <span class="detail-container">
              <div class="avatar"><a-image :src="record.cover"></a-image></div>
              <div class="detail" v-if="record.creator">
                <p style="color: #1890ff"><ellipsis :length="25" tooltip>{{ record.name }}</ellipsis></p>
                <p><ellipsis :length="25" tooltip>时间：{{ record.start_time }}-{{ record.end_time }}</ellipsis></p>
                <p>创建人：{{ record.creator.name }}
                  <span v-for="role in record.creator.roles" :key="role.id">
                    {{ role.display_name }}
                  </span>
                </p>
              </div>
            </span>
          </template>
          <template slot="used_point" slot-scope="text, record">
            {{ record.total_point - record.rest_point }}
          </template>
          <template slot="status" slot-scope="text, record">
            <a-badge v-if="record.status === 1" status="default" :text="record.status_text" />
            <a-badge v-if="record.status === 2" status="success" :text="record.status_text" />
            <a-badge v-if="record.status === 3" status="warning" :text="record.status_text" />
            <a-badge v-if="record.status === 99" status="error" :text="record.status_text" />
          </template>
          <template slot="action" slot-scope="text, record">
            <a @click="handleDetail(record)">查看</a>
          </template>
        </a-table>
      </a-card>
    </div>
  </page-view>
</template>

<script>
import {
  tasksList,
  downloadTask
} from '@/api/task'
import { PageView } from '@/layouts'
import { Ellipsis, AImage } from '@/components'
export default {
  name: 'TaskList',
  components: { Ellipsis, PageView, AImage },
  data () {
    return {
      columns: [
        {
          title: '项目信息',
          dataIndex: 'creator',
          width: '30%',
          scopedSlots: { customRender: 'creator' }
        },
        {
          title: '已消耗积分',
          dataIndex: 'used_point',
          scopedSlots: { customRender: 'used_point' }
        },
        {
          title: '未消耗积分',
          dataIndex: 'rest_point'
        },
        {
          title: '任务状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '领取人数',
          dataIndex: 'accepted_num'
        },
        {
          title: '转发次数',
          dataIndex: 'shared_times'
        },
        {
          title: '浏览量(PV)',
          dataIndex: 'pv_num'
        },
        {
          title: '独立用户(UV)',
          dataIndex: 'uv_num'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      taskList: [],
      queryParams: {},
      loading: false,
      status_num: [],
      pagination: {
        current: 1,
        pageSize: 15
      }
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    handleTableChange (pagination) {
      this.queryParams.page = pagination.current
      this.loadData(this.queryParams)
    },
    handleRadioChange (e) {
      this.queryParams.status = e.target.value
      this.queryParams.page = 1
      this.loadData(this.queryParams)
    },
    handleDetail (record) {
      this.$router.push({ path: 'task-list/' + record.id })
    },
    exportFN () {
      downloadTask().then(res => {
        window.location.href = res.url
        window.open(res.url)
      })
    },
    loadData (queryParams) {
      this.loading = true
      tasksList(queryParams)
        .then(res => {
          this.loading = false
          this.taskList = res.data
          this.status_num = res.status_num
          const pagination = { ...this.pagination }
          pagination.total = res.meta.total
          pagination.current = res.meta.current_page
          this.pagination = pagination
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
.top-search{
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
}
.table{
  .detail-container{
    display: flex;
    align-items: top;
  }
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
}
</style>
