<!--
 * @Description: 任务管理-任务列表
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 14:11:08
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-card>
      <div class="top-search">
        <a-radio-group @change="handleRadioChange" defaultValue="0" class="radio-group">
          <a-radio-button value="0">总任务数{{ status_num.total_num }}</a-radio-button>
          <a-radio-button value="2">进行中{{ status_num.ongoing_num }}</a-radio-button>
          <a-radio-button value="3">已结束{{ status_num.ended_num }}</a-radio-button>
        </a-radio-group>
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
          <a-tooltip v-if="record.status === 99" title="员工端不可见"><a-badge status="error" :text="record.status_text"/></a-tooltip>
        </template>
        <template slot="action" slot-scope="text, record">
          <span v-if="record.status === 99">
            <a style="color: #f5222d;" href="javscript:;"></a>
          </span>
          <span v-else>
            <a @click="handleEdit(record)" v-action:update-task v-if="record.status !== 3">修改</a>
            <a-divider type="vertical" v-if="record.status !== 3"/>
            <a style="color: #f5222d;" @click="handleDelete(record)" v-action:delete-task>删除</a>
          </span>
        </template>
      </a-table>
    </a-card>
    <a-modal
      title="编辑任务"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="closeModal">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="调整任务结束时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-date-picker
              style="width: 200px"
              :showTime="true"
              :disabledDate="disabledDate"
              format="YYYY-MM-DD HH:mm:ss"
              @change="handleTimeChange"
              v-decorator="['end_time']"/>
          </a-form-item>
          <a-form-item label="追加积分" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              style="width: 200px"
              placeholder="请输入积分"
              v-decorator="['add_point', {rules: [{ pattern: /^[0-9]*$/, message: '请输入正确的积分' }]}]"/>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import {
  tasksList,
  delTask,
  editTask
} from '@/api/task'
import { requestErrorHelper } from '@/utils/mixin'
import { Ellipsis, AImage } from '@/components'
import moment from 'moment'
export default {
  mixins: [requestErrorHelper],
  name: 'TaskManageList',
  components: { Ellipsis, AImage },
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
      labelCol: {
        sm: { span: 10 }
      },
      wrapperCol: {
        sm: { span: 9 }
      },
      status_num: [],
      visible: false,
      form: this.$form.createForm(this),
      end_time: null,
      start_time: null,
      add_point: '',
      task: '',
      loading: false,
      confirmLoading: false,
      pagination: {
        current: 1,
        pageSize: 15
      },
      queryParams: {}
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    moment,
    disabledDate (current) {
      if (!current) {
        return false
      }
      return current.valueOf() < moment(this.start_time, 'YYYY.MM.DD').valueOf()
    },
    handleTableChange (pagination) {
      this.queryParams.page = pagination.current
      this.loadData(this.queryParams)
    },
    handleTimeChange (value, dateString) {
      this.end_time = dateString
    },
    handleDelete (record) {
      const that = this
      this.$confirm({
        title: '警告',
        content: `真的要删除吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 删除
          delTask(record.id)
            .then(res => {
              that.$message.success('删除成功')
              that.loadData()
            })
        }
      })
    },
    closeModal () {
      this.visible = false
      this.form.resetFields()
    },
    handleEdit (record) {
      this.visible = true
      this.task = record.id
      this.start_time = record.start_time.split(' ')[0]
    },
    handleSubmit () {
      const that = this
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          values.end_time = this.end_time
          values.task = this.task
          if (values.end_time || values.add_point) {
            console.log(values)
            that.confirmLoading = true
            editTask(values, this.task)
              .then(res => {
                that.visible = false
                that.end_time = null
                that.add_point = ''
                that.confirmLoading = false
                that.form.resetFields()
                that.loadData()
                that.$message.success('修改成功')
              })
              .catch((err) => {
                const errorFields = this.requestErrorFormFields(err, values)
                if (errorFields) {
                  that.form.setFields(errorFields)
                } else {
                  that.$message.error(err.response.data.message)
                }
                that.confirmLoading = false
              })
          } else {
            that.$message.error('结束时间和奖励总积分两者必须填写一个')
          }
        }
      })
    },
    handleRadioChange (e) {
      this.queryParams.status = e.target.value
      this.queryParams.page = 1
      this.loadData(this.queryParams)
    },
    loadData (queryParams) {
      this.loading = true
      tasksList(queryParams)
        .then(res => {
          this.taskList = res.data
          this.status_num = res.status_num
          this.loading = false
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
    flex:0 0 100px;
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
