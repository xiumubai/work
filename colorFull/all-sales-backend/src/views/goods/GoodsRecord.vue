<!--
 * @Description: 积分商城-兑换记录
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 14:57:22
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-card>
    <a-form
      layout="inline"
      style="margin-bottom: 24px;">
      <a-row style="margin-bottom: 16px;">
        <a-col :span="8">
          <a-form-item
            label="兑换状态">
            <a-select style="width: 200px" v-model="queryParams.status" placeholder="请选择兑换状态">
              <a-select-option :value="1">未兑换</a-select-option>
              <a-select-option :value="2">已兑换</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="商品类型">
            <a-select style="width: 200px" v-model="queryParams.goods_type" placeholder="请选择商品类型">
              <a-select-option :value="1">实物商品</a-select-option>
              <a-select-option :value="2">虚拟商品</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="所在部门">
            <a-select style="width: 200px" v-model="queryParams.department_id" placeholder="请选择部门">
              <a-select-option v-for="depart in departmentsList" :key="depart.id">
                {{ depart.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="3" :style="{ textAlign: 'right' }">
          <!-- <a-button type="primary">导出</a-button> -->
        </a-col>
      </a-row>
      <a-row>
        <a-col :xl="14" :xs="24">
          <a-form-item
            label="查询时间">
            <a-date-picker
              :showTime="true"
              @change="handleChangeStartTime"/>
            -
            <a-date-picker
              :showTime="true"
              @change="handleChangeEndTime"/>
          </a-form-item>
        </a-col>
        <a-col :xl="6" :lg="12">
          <a-form-item>
            <a-input
              style="width: 200px; margin-left: 6px;"
              placeholder="输入姓名/工号"
              v-model="queryParams.keywords"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xl="4" style="padding-top: 4px;">
          <a-button style="margin-right: 8px;" type="primary" @click="handleSearch">搜索</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-col>
      </a-row>
    </a-form>
    <a-table
      :columns="columns"
      :dataSource="dataList"
      :loading="loading"
      :pagination="pagination"
      @change="handleChangeTable"
      :rowKey="record => record.id">
      <template slot="goods_id" slot-scope="text, record">
        {{ record.id }}
      </template>
      <template slot="info_name" slot-scope="text, record">
        {{ record.exchanger_info.name }}
      </template>
      <template slot="department" slot-scope="text, record">
        <span v-if="record.exchanger_info.department">{{ record.exchanger_info.department.name }}</span>
        <span v-else></span>
      </template>
      <template slot="goods_type" slot-scope="text, record">
        {{ record.goods_info.type_text }}
      </template>
      <template slot="goods_name" slot-scope="text, record">
        {{ record.goods_info.name }}
      </template>
      <template slot="status" slot-scope="status">
        <a-badge v-if="status === 1" status="error" text="未兑换"/>
        <a-badge v-if="status === 2" status="success" text="已兑换"/>
      </template>
      <template v-if="!record.is_handled" slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="handleChangeStatus(record)" v-action:goods-exchange-confirm>点击兑换</a>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { getDepartmentList } from '@/api/manage'
import { exchanges, exchangesStatus } from '@/api/goods'
import moment from 'moment'
export default {
  name: 'GoodsRecord',
  data () {
    return {
      columns: [
        {
          title: '编号',
          dataIndex: 'id',
          scopedSlots: { customRender: 'goods_id' }
        },
        {
          title: '收货人',
          dataIndex: 'info_name',
          scopedSlots: { customRender: 'info_name' }
        },
        {
          title: '所在部门',
          dataIndex: 'department',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '商品类型',
          dataIndex: 'type_text',
          scopedSlots: { customRender: 'goods_type' }
        },
        {
          title: '商品名称',
          dataIndex: 'goods_name',
          scopedSlots: { customRender: 'goods_name' }
        },
        {
          title: '兑换时间',
          dataIndex: 'exchanged_at'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataList: [],
      queryParams: {},
      departmentsList: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 15
      },
      dateFormat: 'YYYY/MM/DD'
    }
  },
  created () {
    this.loadData()
    this.fecthDepartmentsList()
  },
  methods: {
    moment,
    handleChangeTable (pagination) {
      this.queryParams.page = pagination.current
      this.loadData(this.queryParams)
    },
    handleChangeStartTime (date, dateString) {
      this.queryParams.start_time = dateString
    },
    handleChangeEndTime (date, dateString) {
      this.queryParams.end_time = dateString
    },
    handleChangeStatus (record) {
      const id = record.id
      const that = this
      this.$confirm({
        title: '警告',
        content: `点击确认同意兑换商品`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          exchangesStatus(id).then(res => {
            that.goods_id = res.id
            that.visible = true
            that.$message.success('兑换成功')
            that.loadData()
          })
        }
      })
    },
    handleSearch () {
      this.queryParams.page = 1
      this.loadData(this.queryParams)
    },
    handleReset () {
      this.queryParams = {}
      this.loadData()
    },
    loadData (queryParams) {
      this.loading = true
      exchanges(queryParams).then(res => {
        this.dataList = res.data
        this.loading = false
        const pagination = { ...this.pagination }
        pagination.total = res.meta.total
        pagination.current = res.meta.current_page
        this.pagination = pagination
      }).catch(() => {
        this.loading = false
      })
    },
    fecthDepartmentsList () {
      getDepartmentList()
        .then(res => {
          this.departmentsList = res.data
        })
    }
  }
}
</script>

<style scoped>

</style>
