<!--
 * @Description: 积分管理-超级管理员审批
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 12:54:17
 * @LastEditors: Please set LastEditors
 -->
<template>
  <page-view>
    <a-card>
      <a-tabs defaultActiveKey="1" @change="handleChangeTab">
        <a-tab-pane tab="管理员积分列表" key="1">
          <a-card>
            <a-table
              :columns="columns1"
              :dataSource="dataList1"
              :loading="loading"
              :pagination="false"
              :rowKey="record => record.id">
              <template slot="name" slot-scope="text, record">
                {{ record.admin.name }}
              </template>
              <template slot="department" slot-scope="text, record">
                <span v-if="record.admin.is_supper">所有部门</span>
                <span v-else v-for="item in record.admin.charge_departments" :key="item.id">
                  {{ item.name }}
                </span>
              </template>
              <template slot="useable_quantity" slot-scope="text, record">
                <span v-if="record.admin.is_supper">无限</span>
                <span v-else>{{ record.useable_quantity }}</span>
              </template>
              <template slot="action" slot-scope="text, record">
                <span v-if="record.admin.roles[0].is_department_admin">
                  <a @click="handleIncrease(record)" v-action:point-account-points-add>增加</a>
                  <a-divider v-action:point-account-points-add type="vertical" />
                  <a @click="handleDecrease(record)" v-action:point-account-points-sub>减少</a>
                </span>
                <span v-else></span>
              </template>
              <template slot="detail" slot-scope="text, record">
                <a @click="handleDetail(record)" v-action:detail-point-account>查看</a>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
        <a-tab-pane tab="审批申请" key="2" forceRender>
          <a-card>
            <a-table
              :columns="columns2"
              :dataSource="dataList2"
              :loading="loading"
              :pagination="false"
              :rowKey="record => record.id">
              <template slot="apply_name" slot-scope="text, record">
                <span v-if="record.applicat">{{ record.applicat.name }}</span>
                <span v-else></span>
              </template>
              <template slot="status" slot-scope="text, record">
                <a-badge v-if="record.status === 1" status="default" :text="record.status_text"/>
                <a-badge v-if="record.status === 2" status="success" :text="record.status_text"/>
                <a-badge v-if="record.status === 3" status="error" :text="record.status_text"/>
              </template>
              <template slot="appr_name" slot-scope="text, record">
                <span v-if="record.approver">{{ record.approver.name }}</span>
                <span v-else></span>
              </template>
              <template v-if="!record.is_approved" slot="action" slot-scope="text, record">
                <a @click="handleAgree(record)" v-action:point-apply-approve-pass>同意</a>
                <a-divider type="vertical" />
                <a @click="handleRefused(record)" v-action:point-apply-approve-refuse>拒绝</a>
              </template>
            </a-table>
          </a-card>
        </a-tab-pane>
      </a-tabs>
      <a-modal
        :title="isAdd ? '增加积分' : '减少积分'"
        v-model="visible"
        @ok="handleOk"
        :confirmLoading="confirmLoading"
        @cancel="closeModal">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form">
            <a-form-item label="部门管理员" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入部门名称"
                disabled
                v-decorator="['staff_id',{initialValue: staff_name}]"/>
            </a-form-item>
            <a-form-item v-if="isAdd" label="增加积分数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入增加积分数量"
                v-decorator="['add_quantity', {rules: [{ required: true, message: '请输入增加积分数量' }]}]"/>
            </a-form-item>
            <a-form-item v-else label="减少积分数量" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                placeholder="请输入减少积分数量"
                v-decorator="['sub_quantity', {rules: [{ required: true, message: '请输入减少积分数量' }]}]"/>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
    </a-card>
  </page-view>
</template>

<script>
import { getPointAccounts, addPoint, subPoint, applyApproves, agreeApproves, deleteApproves } from '@/api/point'
import { PageView } from '@/layouts'
import { requestErrorHelper } from '@/utils/mixin'
export default {
  name: 'Approval',
  components: { PageView },
  mixins: [requestErrorHelper],
  data () {
    return {
      columns1: [
        {
          title: '管理员姓名',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
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
          dataIndex: 'used_quantity'
        },
        {
          title: '总计',
          dataIndex: 'total_quantity'
        },
        {
          title: '操作',
          dataIndex: 'asction',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '积分明细',
          dataIndex: 'detail',
          width: '150px',
          scopedSlots: { customRender: 'detail' }
        }
      ],
      columns2: [
        {
          title: '申请时间',
          dataIndex: 'created_at'
        },
        {
          title: '申请人',
          dataIndex: 'apply_name',
          scopedSlots: { customRender: 'apply_name' }
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
          dataIndex: 'appr_name',
          scopedSlots: { customRender: 'appr_name' }
        },
        {
          title: '操作',
          dataIndex: 'asction',
          scopedSlots: { customRender: 'action' }
        }
      ],
      dataList1: [],
      dataList2: [],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      confirmLoading: false,
      loading: false,
      isAdd: false,
      visible: false,
      staff_id: '',
      staff_name: ''
    }
  },
  created () {
    this.loadData()
    this.loadApply()
  },
  methods: {
    handleChangeTab (key) {
      console.log(key)
    },
    handleIncrease (record) {
      this.isAdd = true
      this.visible = true
      this.staff_id = record.admin.id
      this.staff_name = record.admin.name
    },
    handleDecrease (record) {
      this.isAdd = false
      this.visible = true
      this.staff_id = record.admin.id
      this.staff_name = record.admin.name
    },
    closeModal () {
      this.form.resetFields()
    },
    handleOk () {
      const that = this
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          values.staff_id = this.staff_id
          if (that.isAdd) {
            addPoint(values).then(res => {
              that.confirmLoading = false
              that.visible = false
              that.$message.success('修改成功')
              that.form.resetFields()
              that.loadData()
            }).catch((err) => {
              const errorFields = that.requestErrorFormFields(err, values)
              if (errorFields) {
                that.form.setFields(errorFields)
              } else {
                that.$message.error(err.response.data.message)
              }
              that.confirmLoading = false
            })
          } else {
            subPoint(values).then(res => {
              that.confirmLoading = false
              that.visible = false
              that.$message.success('修改成功')
              that.form.resetFields()
              that.loadData()
            }).catch((err) => {
              const errorFields = that.requestErrorFormFields(err, values)
              if (errorFields) {
                that.form.setFields(errorFields)
              } else {
                that.$message.error(err.response.data.message)
              }
              that.confirmLoading = false
            })
          }
        } else {
          that.confirmLoading = false
        }
      })
    },
    handleDetail (record) {
      this.$router.push({ path: 'approval-menu/' + record.id })
    },
    handleAgree (record) {
      const that = this
      this.$confirm({
        title: '警告',
        content: `点击确认同意申请？`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          agreeApproves(record.id).then(res => {
            that.$message.success('申请已同意')
            that.loadApply()
          })
        }
      })
    },
    handleRefused (record) {
      const that = this
      this.$confirm({
        title: '警告',
        content: `点击确认拒绝申请？`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          deleteApproves(record.id).then(res => {
            that.$message.error('申请已拒绝')
            that.loadApply()
          })
        }
      })
    },
    loadData () {
      this.loading = true
      getPointAccounts().then(res => {
        this.dataList1 = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    loadApply () {
      this.loading = true
      applyApproves().then(res => {
        this.dataList2 = res.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
