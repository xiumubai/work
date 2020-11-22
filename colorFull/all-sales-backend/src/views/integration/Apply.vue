<!--
 * @Description: 积分管理-部门管理员审批
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-28 20:53:36
 * @LastEditors: Please set LastEditors
 -->
<template>
  <page-view>
    <div>
      <a-card>
        <a-tabs defaultActiveKey="1" @change="handleChangeTab">
          <a-tab-pane tab="积分明细" key="1">
            <a-card>
              <a-table
                :columns="columns1"
                :dataSource="dataList1"
                :rowKey="record => record.id"
                :pagination="false"
                :loading="loading">
                <template slot="admin_name" slot-scope="text, record">
                  {{ record.admin.name }}
                </template>
                <template slot="department" slot-scope="text, record">
                  <span v-if="record.admin.charge_departments.length > 0" v-for="item in record.admin.charge_departments" :key="item.id">
                    {{ item.name }}
                  </span>
                  <span v-if="record.admin.charge_departments.length === 0">所有部门</span>
                </template>
                <template slot="useable_quantity" slot-scope="text, record">
                  <span v-if="record.useable_quantity > 0">{{ record.useable_quantity }}</span>
                  <span v-if="record.admin.is_supper">无限</span>
                </template>
                <template slot="used_quantity" slot-scope="used_quantity">
                  <span>{{ used_quantity }}</span>
                </template>
                <template slot="total_quantity" slot-scope="used_quantity">
                  <span>{{ used_quantity }}</span>
                </template>
              </a-table>
            </a-card>
            <p style="margin: 24px 0;">积分记录</p>
            <a-card>
              <a-table
                :columns="columns2"
                :dataSource="dataList2"
                :rowKey="record => record.id"
                :loading="loading"
                :pagination="false">
              </a-table>
            </a-card>
          </a-tab-pane>
          <a-tab-pane tab="填写申请" v-if="applyAction" key="2">
            <a-spin :spinning="spinning">
              <a-card>
                <a-form :form="form" @submit="handleSubmit">
                  <a-form-item
                    style="margin-top: 16px;"
                    label="申请积分数量"
                    :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                    :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
                    <a-input
                      placeholder="请填写数字，必须为整数"
                      v-decorator="[
                        'quantity',
                        {rules: [{ required: true, message: '积分数量不能空' }, { pattern: /^[0-9]*$/, message: '积分数量必须为整数'}]}]"/>
                  </a-form-item>
                  <a-form-item
                    label="申请原因"
                    :labelCol="{lg: {span: 7}, sm: {span: 7}}"
                    :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
                    <a-textarea
                      rows="4"
                      placeholder="请填写申请积分的原因"
                      v-decorator="[
                        'remark'
                      ]" />
                  </a-form-item>
                  <a-form-item
                    :wrapperCol="{ span: 24 }"
                    style="text-align: center">
                    <a-button htmlType="submit" type="primary">提交</a-button>
                  </a-form-item>
                </a-form>
              </a-card>
            </a-spin>
          </a-tab-pane>
          <a-tab-pane tab="申请记录" v-if="pointAction" v-action:list-point-apply key="3" >
            <a-card>
              <a-table
                :columns="columns3"
                :dataSource="dataList3"
                :rowKey="record => record.id"
                :pagination="false">
                <template slot="status" slot-scope="text, record">
                  <a-badge v-if="record.status === 1" status="default" :text="record.status_text"/>
                  <a-badge v-if="record.status === 2" status="success" :text="record.status_text"/>
                  <a-badge v-if="record.status === 3" status="error" :text="record.status_text"/>
                </template>
                <template slot="appr_name" slot-scope="text, record">
                  <span v-if="record.approver">{{ record.approver.name }}</span>
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
import { applyPoint, mineLogs, applies } from '@/api/point'
import hasActions from '@/utils/action'
import { PageView } from '@/layouts'
export default {
  name: 'Apply',
  components: { PageView },
  data () {
    return {
      form: this.$form.createForm(this),
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
          dataIndex: 'useable_quantity',
          scopedSlots: { customRender: 'useable_quantity' }
        },
        {
          title: '已使用积分',
          dataIndex: 'used_quantity',
          scopedSlots: { customRender: 'used_quantity' }
        },
        {
          title: '总计',
          dataIndex: 'total_quantity',
          scopedSlots: { customRender: 'total_quantity' }
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
      columns3: [
        {
          title: '申请时间',
          dataIndex: 'created_at'
        },
        {
          title: '积分数量',
          dataIndex: 'quantity'
        },
        {
          title: '申请理由',
          dataIndex: 'remark'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '审批人',
          dataIndex: 'name',
          scopedSlots: { customRender: 'appr_name' }
        }
      ],
      dataList1: [],
      dataList2: [],
      dataList3: [],
      spinning: false,
      applyAction: false,
      pointAction: false,
      loading: false
    }
  },
  created () {
    this.loadData()
    this.applyAction = hasActions('create-point-apply')
    this.pointAction = hasActions('list-point-apply')
    if (this.pointAction) {
      this.loadApplies()
    }
  },
  methods: {
    handleChangeTab () {

    },
    handleSubmit (e) {
      e.preventDefault()
      const that = this
      const { form: { validateFields } } = this
      this.spinning = true
      validateFields((errors, values) => {
        if (!errors) {
          applyPoint(values).then(res => {
            that.$message.success('提交成功')
            that.form.resetFields()
            that.spinning = false
            this.loadApplies()
          })
        } else {
          that.spinning = false
        }
      })
    },
    loadData () {
      this.loading = true
      mineLogs().then(res => {
        this.dataList1.push(res.account)
        this.dataList2 = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    loadApplies () {
      applies().then(res => {
        this.dataList3 = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
