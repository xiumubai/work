<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-21 19:34:34
 * @LastEditTime: 2019-10-28 20:24:06
 * @LastEditors: Please set LastEditors
 -->
<template>
  <page-view :title="false">
    <div slot="headerContent">
      <div class="self-header">
        <h1 class="header-title">积分详情</h1>
        <a-button class="button-back" icon="rollback" @click="handleBack">返回</a-button>
      </div>
    </div>
    <div>
      <a-card>
        <a-table
          :columns="columns1"
          :dataSource="dataList1"
          :loading="loading"
          :rowKey="record => record.id"
          :pagination="false">
          <template slot="admin_name" slot-scope="text, record">
            {{ record.admin.name }}
          </template>
          <template slot="department" slot-scope="text, record">
            <span v-if="record.admin.charge_departments.length > 0" v-for="item in record.admin.charge_departments" :key="item.id">
              {{ item.name }}
            </span>
          </template>
        </a-table>
      </a-card>
      <p style="margin: 24px 0;">积分记录</p>
      <a-card>
        <a-table
          :columns="columns2"
          :dataSource="dataList2"
          :loading="loading"
          :rowKey="record => record.id"
          :pagination="false">
        </a-table>
      </a-card>
    </div>
  </page-view>
</template>

<script>
import { getPointLogs } from '@/api/point'
import { PageView } from '@/layouts'
export default {
  name: 'ApplyDetail',
  components: { PageView },
  data () {
    return {
      columns1: [
        {
          title: '管理员姓名',
          dataIndex: 'name',
          scopedSlots: { customRender: 'admin_name' }
        },
        {
          title: '管理部门',
          dataIndex: 'charge_departments',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '现有积分',
          dataIndex: 'useable_quantity'
        },
        {
          title: '已使用积分',
          dataIndex: 'used_quantity'
        },
        {
          title: '总计',
          dataIndex: 'total_quantity'
        }
      ],
      columns2: [
        {
          title: '积分',
          dataIndex: 'quantity'
        },
        {
          title: '现有积分',
          dataIndex: 'balance'
        },
        {
          title: '积分类型',
          dataIndex: 'type_text'
        },
        {
          title: '描述',
          dataIndex: 'remark'
        },
        {
          title: '时间',
          dataIndex: 'created_at'
        }
      ],
      dataList1: [],
      dataList2: [],
      queryParams: {
        account_id: this.$route.params.id
      },
      loadding: false
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    handleBack () {
      this.$router.go(-1)
    },
    loadData () {
      this.loading = true
      getPointLogs(this.queryParams).then(res => {
        this.dataList1.push(res.account)
        this.dataList2 = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
</style>
