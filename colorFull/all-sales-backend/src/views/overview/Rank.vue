<!--
 * @Description: 数据总览-全员排行
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 14:17:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <page-view>
    <div>
      <a-card>
        <a-tabs defaultActiveKey="1">
          <a-tab-pane tab="全员排行" key="1">
            <a-card>
              <a-table
                :columns="columns1"
                :dataSource="dataList1"
                :loading="loading"
                :pagination="pagination"
                @change="handleChangeTable"
                :rowKey="record => record.id">
                <template slot="mebo_rank" slot-scope="rank">
                  <span v-if="rank > 0">{{ rank }}</span>
                  <span v-else>未上榜</span>
                </template>
                <template slot="department" slot-scope="department">
                  <span v-if="department">{{ department.name }}</span>
                  <span v-else></span>
                </template>
              </a-table>
            </a-card>
          </a-tab-pane>
          <a-tab-pane tab="部门排行" key="2" forceRender>
            <a-card>
              <a-table
                :columns="columns2"
                :dataSource="dataList2"
                :pagination="false"
                :rowKey="record => record.id">
                <template slot="depart_rank" slot-scope="rank">
                  <span v-if="rank > 0">{{ rank }}</span>
                  <span v-else>未上榜</span>
                </template>
              </a-table>
            </a-card>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import { rankStaffs, rankDepartments } from '@/api/overview'
export default {
  components: { PageView },
  name: 'Rank',
  data () {
    return {
      columns1: [
        {
          title: '排名',
          dataIndex: 'rank',
          scopedSlots: { customRender: 'mebo_rank' }
        },
        {
          title: '姓名',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '部门',
          dataIndex: 'department',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '影响力',
          dataIndex: 'value'
        }
      ],
      columns2: [
        {
          title: '排名',
          dataIndex: 'rank',
          scopedSlots: { customRender: 'depart_rank' }
        },
        {
          title: '部门',
          dataIndex: 'name'
        },
        {
          title: '平均影响力',
          dataIndex: 'value'
        },
        {
          title: '部门人数',
          dataIndex: 'staffs_count'
        }
      ],
      dataList1: [],
      dataList2: [],
      loading: false,
      queryParams: {},
      pagination: {
        current: 1,
        pageSize: 100
      }
    }
  },
  created () {
    this.loadStaffRankList()
    this.loadDepartmentsRankList()
  },
  methods: {
    handleChangeTable (pagination) {
      this.queryParams.page = pagination.current
      this.loadStaffRankList()
    },
    loadStaffRankList () {
      this.loading = true
      rankStaffs(this.queryParams).then(res => {
        this.loading = false
        this.dataList1 = res.data
        const pagination = { ...this.pagination }
        pagination.total = res.meta.total
        pagination.pageSize = res.meta.per_page
        pagination.current = res.meta.current_page
        this.pagination = pagination
      }).catch(() => {
        this.loading = false
      })
    },
    loadDepartmentsRankList () {
      rankDepartments().then(res => {
        this.dataList2 = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
