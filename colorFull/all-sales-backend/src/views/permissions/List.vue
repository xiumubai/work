<!--
 * @Description: 权限管理-管理员列表
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 11:29:20
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="permission-list">
    <a-card :bordered="false">
      <div class="table-operator" style="display: flex; justify-content: flex-end;">
        <a-button v-action:create-admin type="primary" icon="plus" @click="add()">新增管理员</a-button>
      </div>
      <a-table
        ref="table"
        :loading="loading"
        :columns="columns"
        :dataSource="adminsList"
        :pagination="pagination"
        @change="handleChangeTable"
        :rowKey="record => record.id">
        <template slot="roles" slot-scope="roles">
          <a-tag v-for="role in roles" color="blue" :key="role.id">{{ role.display_name }}</a-tag>
        </template>
        <template slot="charge_departments" slot-scope="text, record">
          <span v-if="!record.is_supper">
            <a-tag v-for="department in record.charge_departments" color="blue" :key="department.id">{{ department.name }}</a-tag>
          </span>
          <span v-else><a-tag color="blue">所有部门</a-tag></span>
        </template>
        <template slot="action" slot-scope="text, record">
          <a href="javascript:;" v-action:update-admin @click="edit(record)">修改</a>
          <a-divider v-action:update-admin type="vertical" />
          <a href="javascript:;" v-action:delete-admin style="color: #f5222d;" @click="del(record)">删除</a>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :title="isEdit ? '修改管理员' : '新增管理员'"
      :confirmLoading="confirmLoading"
      v-model="visible"
      @ok="handleOk"
      @cancel="closeModal">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入姓名"
              v-decorator="['name',{initialValue: name, rules: [{ required: true, message: '请填写姓名' }]}]"/>
          </a-form-item>
          <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入手机号"
              v-decorator="['mobile', {initialValue: mobile, rules: [{ required: true, pattern: /^1[345789]\d{9}$/, message: '请输入正确的手机号' }]}]"/>
          </a-form-item>
          <a-form-item label="账户角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select @change="handleRolesChange" v-decorator="['roles', {initialValue: defalutrole, rules: [{required: true}]}]">
              <a-select-option v-for="role in rolesList" :key="role.id">
                {{ role.display_name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="is_department_admin" label="管理部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select mode="multiple" placeholder="请选择部门" v-decorator="['departments', {initialValue: defalutdepartment, rules: [{required: true, message: '请选择部门管理员'}]}]">
              <a-select-option v-for="depart in departmentsList" :key="depart.id">
                {{ depart.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import {
  managerList,
  getRolesList,
  getDepartmentList,
  addmanager,
  delmanager,
  edtimanager
} from '@/api/manage'
import { requestErrorHelper } from '@/utils/mixin'
export default {
  mixins: [requestErrorHelper],
  name: 'List',
  data () {
    return {
      adminsList: [],
      form: this.$form.createForm(this),
      columns: [
        {
          title: '姓名',
          dataIndex: 'name'
        }, {
          title: '角色',
          dataIndex: 'roles',
          scopedSlots: { customRender: 'roles' }
        }, {
          title: '管理部门',
          dataIndex: 'charge_departments',
          scopedSlots: { customRender: 'charge_departments' }
        }, {
          title: '手机号',
          dataIndex: 'mobile'
        }, {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      queryParams: {},
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      rolesList: [],
      departmentsList: [],
      name: '',
      mobile: '',
      edtiId: '',
      defalutrole: '',
      isEdit: false,
      is_department_admin: false,
      defalutdepartment: [],
      confirmLoading: false,
      loading: false,
      pagination: {
        current: 1,
        pageSize: 15
      }
    }
  },
  created () {
    this.loadData()
    this.fecthRolesList()
    this.fecthDepartmentsList()
  },
  methods: {
    handleChangeTable (pagination) {
      this.queryParams.page = pagination.current
      this.loadData(this.queryParams)
    },
    add () {
      this.visible = true
      this.isEdit = false
      this.defalutrole = this.rolesList[0].id
      this.defalutdepartment.push(this.departmentsList[0].id)
    },
    edit (record) {
      this.isEdit = true
      this.name = record.name
      this.mobile = record.mobile
      this.edtiId = record.id
      this.defalutrole = record.roles[0].id
      this.visible = true
      if (record.roles[0].is_department_admin) {
        this.is_department_admin = true
        for (const i in record.charge_departments) {
          this.defalutdepartment.push(record.charge_departments[i].id)
        }
      }
    },
    closeModal () {
      this.name = ''
      this.mobile = ''
      this.defalutrole = ''
      this.is_department_admin = false
      this.defalutdepartment = []
      this.form.resetFields()
    },
    del (record) {
      const that = this
      const content = record.id === this.$store.getters.userInfo.id ? '删除自己会退出登录，确认删除吗？' : `确定要删除${record.name}吗?`
      this.$confirm({
        title: '警告',
        content: content,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 删除
          delmanager(record.id)
            .then(res => {
              that.$message.success('删除成功')
              if (record.id === that.$store.getters.userInfo.id) {
                that.$store.dispatch('Logout').then(() => {
                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                })
              } else {
                that.loadData()
              }
            })
        }
      })
    },
    handleRolesChange (option) {
      const item = this.rolesList.find(item => item.id === option)
      if (item.is_department_admin) {
        this.is_department_admin = true
      } else {
        this.is_department_admin = false
      }
    },
    handleOk (e) {
      const that = this
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          const roles = []
          roles.push(values.roles)
          values['roles'] = roles
          if (!this.is_department_admin) {
            values['departments'] = []
          }
          if (that.isEdit) {
            // 修改
            edtimanager(this.edtiId, values)
              .then(res => {
                // that.$refs.table.refresh()
                that.$message.success('修改成功')
                that.visible = false
                that.name = ''
                that.mobile = ''
                that.defalutrole = ''
                that.is_department_admin = false
                that.defalutdepartment = []
                that.confirmLoading = false
                that.form.resetFields()
                if (this.$store.getters.userInfo.id === this.edtiId) {
                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                } else {
                  that.loadData()
                }
              })
              .catch((err) => {
                const errorFields = this.requestErrorFormFields(err, values)
                if (errorFields) {
                  this.form.setFields(errorFields)
                } else {
                  that.$message.error(err.response.data.message)
                }
                that.confirmLoading = false
              })
          } else {
            // 添加
            addmanager(values)
              .then(res => {
                // that.$refs.table.refresh()
                that.$message.success('添加成功')
                that.visible = false
                that.name = ''
                that.mobile = ''
                that.defalutrole = ''
                that.is_department_admin = false
                that.defalutdepartment = []
                that.confirmLoading = false
                that.form.resetFields()
                that.loadData()
              })
              .catch((err) => {
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
    loadData (queryParams) {
      this.loading = true
      managerList(queryParams)
        .then(res => {
          this.adminsList = res.data
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
    fecthRolesList () {
      getRolesList()
        .then(res => {
          this.rolesList = res.data
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
