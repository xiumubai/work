<!--
 * @Description: 积分商城-商品列表
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 12:40:33
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-card>
    <div style="margin-bottom: 24px;" v-action:update-exchange-notice>
      <h4>兑换说明：本说明会展示在员工端积分商城顶部</h4>
      <a-textarea
        style="width: 500px; margin-right: 8px;"
        rows="4"
        v-model="content"
        placeholder="选填（可输入实物商品发货方式，发货时间等）"/>
      <a-button type="primary" @click="saveContent">保存</a-button>
    </div>
    <div style="margin-bottom: 24px;">
      <a-select
        style="width: 150px; margin-right: 8px;"
        placeholder="请选择状态"
        @change="handleChangeStatus">
        <a-select-option v-for="status in statusList" :key="status.id">
          {{ status.name }}
        </a-select-option>
      </a-select>
      <a-button type="primary" @click="handleAddGoods" v-action:create-goods>新增商品</a-button>
    </div>
    <a-table
      class="table"
      :columns="columns"
      :loading="loading"
      :dataSource="dataList"
      :pagination="pagination"
      @change="handleChangeTable"
      :rowKey="record => record.id">
      <template slot="name" slot-scope="text, record">
        <span class="detail-container">
          <div class="avatar"><a-image :src="record.cover"></a-image></div>
          <div class="detail">
            <ellipsis :length="40" tooltip>{{ record.name }}</ellipsis>
          </div>
        </span>
      </template>
      <template slot="type" slot-scope="text, record">
        <span v-if="record.type === 1">{{ record.type_text }}</span>
        <span v-else>{{ record.type_text }}</span>
      </template>
      <template slot="status" slot-scope="text, record">
        <a-badge v-if="record.status === 2" status="default" :text="record.status_text" />
        <a-badge v-if="record.status === 3" status="processing" :text="record.status_text" />
        <a-badge v-if="record.status === 4" status="error" :text="record.status_text" />
      </template>
      <template slot="action" slot-scope="text, record">
        <a href="javascript:;" @click="handleDetail(record)" v-action:detail-goods>查看</a>
      </template>
    </a-table>
  </a-card>
</template>

<script>
import { Ellipsis, AImage } from '@/components'
import { getGoodsList, exchangeNotices, saveExchangeNotices } from '@/api/goods'
export default {
  name: 'GoodsList',
  components: {
    Ellipsis, AImage
  },
  data () {
    return {
      statusList: [
        {
          id: 0,
          name: '全部状态'
        },
        {
          id: 2,
          name: '已下架'
        },
        {
          id: 3,
          name: '可兑换'
        },
        {
          id: 4,
          name: '已兑完'
        }
      ],
      columns: [
        {
          title: '商品信息',
          dataIndex: 'name',
          width: '30%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '商品类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '库存',
          dataIndex: 'stock_quantity'
        },
        {
          title: '已兑换',
          dataIndex: 'exchanged_quantity'
        },
        {
          title: '价值积分',
          dataIndex: 'need_point'
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
      loading: false,
      content: '',
      pagination: {
        current: 1,
        pageSize: 15
      }
    }
  },
  created () {
    this.loadData()
    this.loadContent()
  },
  methods: {
    handleChangeTable (pagination) {
      this.queryParams.page = pagination.current
      this.loadData(this.queryParams)
    },
    handleDetail (record) {
      this.$router.push({ path: 'goods-list/' + record.id })
    },
    handleAddGoods () {
      this.$router.push({ path: 'goods-add' })
    },
    handleChangeStatus (e) {
      this.queryParams.page = 1
      this.queryParams.status = e
      this.loadData(this.queryParams)
    },
    saveContent () {
      saveExchangeNotices({ 'content': this.content }).then(res => {
        this.$message.success('保存成功')
        this.content = res.content
      })
    },
    loadData (queryParams) {
      this.loading = true
      getGoodsList(queryParams)
        .then(res => {
          this.dataList = res.data
          this.loading = false
          const pagination = { ...this.pagination }
          pagination.total = res.meta.total
          pagination.current = res.meta.current_page
          this.pagination = pagination
        })
        .catch(() => {
          this.loading = false
        })
    },
    loadContent () {
      exchangeNotices().then(res => {
        this.content = res.content
      })
    }
  }
}
</script>

<style lang="less" scoped>
.table{
  .detail-container{
    display: flex;
    align-items: center;
  }
  .avatar{
    width: 100px;
    height: 100px;
    background: #ccc;
    margin-right: 16px;
  }
}
</style>
