<!--
 * @Description: 组织架构-部门管理
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-23 10:54:21
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="departments-list">
    <a-card :bordered="false">
      <div class="table-operator" style="display: flex; justify-content: flex-end;">
        <a-button type="primary" icon="plus" @click="add()" v-action:create-department>添加部门</a-button>
      </div>
      <a-table
        ref="table"
        :loading="loading"
        :pagination="false"
        :columns="columns"
        :dataSource="departmentsList"
        :rowKey="record => record.id">
        <template slot="action" slot-scope="text, record">
          <a href="javascript:;" v-action:update-department @click="edit(record)">修改</a>
          <a-divider v-action:update-department type="vertical" />
          <a href="javascript:;" v-action:delete-department class="danger" @click="del(record)">删除</a>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :title="isEdit ? '编辑部门' : '新建部门'"
      v-model="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="closeModal">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="部门名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入部门名称"
              v-decorator="['name',{initialValue: name, rules: [{ required: true, message: '请填写部门名称' }]}]"/>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { getDepartments, addDepartments, editDepartments, delDepartments } from '@/api/organization'
import { requestErrorHelper } from '@/utils/mixin'
export default {
  mixins: [requestErrorHelper],
  name: 'Department',
  data () {
    return {
      departmentsList: [],
      columns: [
        {
          title: '部门名称',
          dataIndex: 'name'
        }, {
          title: '部门人数',
          dataIndex: 'staff_num'
        }, {
          title: '已加入系统',
          dataIndex: 'joined_staff_num'
        }, {
          title: '未加入系统',
          dataIndex: 'unjoined_staff_num'
        }, {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      form: this.$form.createForm(this),
      isEdit: false,
      visible: false,
      loading: false,
      confirmLoading: false,
      name: '',
      order: '',
      id: ''
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    add () {
      this.visible = true
      this.isEdit = false
    },
    edit (record) {
      this.name = record.name
      this.order = record.order
      this.id = record.id
      this.isEdit = true
      this.visible = true
    },
    closeModal () {
      this.name = ''
      this.order = ''
      this.form.resetFields()
    },
    del (record) {
      const that = this
      this.id = record.id
      this.$confirm({
        title: '警告',
        content: `真的要删除吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 删除
          delDepartments(that.id)
            .then(res => {
              that.$message.success('删除成功')
              that.loadData()
            })
        }
      })
    },
    handleOk () {
      const that = this
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.isEdit) {
            editDepartments(values, that.id)
              .then(res => {
                that.$message.success('修改成功')
                that.visible = false
                that.name = ''
                that.order = ''
                that.form.resetFields()
                that.confirmLoading = false
                that.loadData()
              })
              .catch(err => {
                const errorFields = that.requestErrorFormFields(err, values)
                if (errorFields) {
                  that.form.setFields(errorFields)
                } else {
                  that.$message.error(err.response.data.message)
                }
                that.confirmLoading = false
              })
          } else {
            addDepartments(values)
              .then(res => {
                that.$message.success('添加成功')
                that.visible = false
                that.name = ''
                that.order = ''
                that.form.resetFields()
                that.confirmLoading = false
                that.loadData()
              })
              .catch(err => {
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
    loadData () {
      this.loading = true
      getDepartments()
        .then(res => {
          this.departmentsList = res.data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped>
.danger{
  color: #f5222d;
}
</style>
