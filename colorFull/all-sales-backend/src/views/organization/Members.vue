<!--
 * @Description: 组织架构-成员管理
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 11:35:11
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-card :bordered="false" type="flex">
      <a-row style="margin-bottom: 32px;">
        <a-col :span="12">
          <a-radio-group @change="handleRadioChange" :value="queryParams.status">
            <a-radio-button value="1">在职员工{{ status_num.active_num }}</a-radio-button>
            <a-radio-button value="2">已加入{{ status_num.joined_num }}</a-radio-button>
            <a-radio-button value="3">未加入{{ status_num.unjoined_num }}</a-radio-button>
            <a-radio-button value="4" style="margin-left: 20px;">已离职{{ status_num.inactive_num }}</a-radio-button>
          </a-radio-group>
        </a-col>
        <a-col :span="12" class="flex-right">
          <a-button type="primary" v-action:create-staff @click="addFN()" icon="plus">添加成员</a-button>
          <a-button type="primary" v-action:import-staff @click="importFN()" style="margin-left: 8px">导入</a-button>
          <a-button type="primary" v-action:export-staff @click="exportFN()" style="margin-left: 8px">导出</a-button>
        </a-col>
      </a-row>
      <a-form layout="inline" style="margin-bottom: 32px;">
        <a-row :gutter="48">
          <a-col class="flex-middel">
            <a-form-item label="所在部门" >
              <a-select placeholder="请选择部门" style="width: 150px;" v-model="queryParams.department_id">
                <a-select-option v-for="depart in departmentsList" :key="depart.id">
                  {{ depart.name }}
                </a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-input v-model="queryParams.keywords" placeholder="输入姓名/工号" style="width: 150px;" v-decorator="['keywords']"/>
            </a-form-item>
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="handleFormSubmit">搜索</a-button>
              <a-button style="margin-left: 8px" @click="handleReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <a-table
        ref="table"
        :loading="loading"
        :columns="columns"
        :dataSource="members"
        :pagination="pagination"
        @change="handleChangeTable"
        :rowKey="record => record.id">
        <template slot="department" slot-scope="department">
          <span v-if="department">{{ department.name }}</span>
        </template>
        <template slot="is_joined" slot-scope="text, record">
          <a-badge v-if="record.is_joined" status="success" :text="record.joined_text"/>
          <a-badge v-else status="error" :text="record.joined_text"/>
        </template>
        <template slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)" v-action:update-staff>修改</a>
          <a-divider type="vertical" v-action:update-staff v-if="radioValue !== '4'"/>
          <a @click="handleDelete(record)" v-action:delete-staff style="color: #f5222d;" v-if="radioValue !== '4'">离职</a>
        </template>
      </a-table>
    </a-card>
    <a-modal
      :title="isEdit ? '修改员工' : '添加员工'"
      v-model="showModal"
      :confirmLoading="confirmLoading"
      @ok="handleSubmit"
      @cancel="closeModal">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item label="姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入姓名"
              v-decorator="['name',{rules: [{ required: true, message: '请输入姓名' }]}]"/>
          </a-form-item>
          <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入手机号"
              v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[345789]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]"/>
          </a-form-item>
          <a-form-item label="部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择部门" v-decorator="['department_id', {rules: [{ required: true, message: '请选择部门' }]}]">
              <a-select-option v-for="depart in departmentsList" :key="depart.id">
                {{ depart.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="isEdit" label="员工状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="请选择员工状态" v-decorator="['is_active']">
              <a-select-option v-for="item in memberStatus" :key="item.is_active">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="工号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              placeholder="请输入工号"
              v-decorator="['jobnumber']"/>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal
      :width="600"
      title="批量导入"
      v-model="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading">
      <a-spin :spinning="confirmLoading">
        <template>
          <div class="import-container">
            <p>1.导入会覆盖原有员工的信息，如需更新已寻在的员工，请先导出通讯录，在导出表格里进行修改。</p>
            <p>2.部门管理员账号仅能导入和导出有权限范围内的通讯录信息</p>
            <div class="item">
              <a-icon class="icon-self" type="cloud-download" />
              <div class="content">
                <h4>下载模板</h4>
                <P>为提高导入的成功率，请下载并使用系统系统的模板</P>
                <a-button size="small" type="primary" @click="handleDownload">下载模版</a-button>
              </div>
            </div>
            <div class="item" style="margin-top: 24px;">
              <a-icon class="icon-self" type="cloud-upload" />
              <div class="content">
                <h4>上传文件</h4>
                <P>仅支持xlsx，xls，文件大小&le;4M</P>
                <a-upload
                  accept=".xlsx,.xls"
                  name="staffs_file"
                  :beforeUpload="beforeUpload"
                  :remove="handleRemove"
                  :fileList="fileList"
                >
                  <a-button :disabled="fileList.length !== 0" size="small" type="primary"> <a-icon type="upload" />选择文件</a-button>
                </a-upload>
              </div>
            </div>
          </div>
        </template>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/manage'
import { downloadFile } from '@/utils/util'
import {
  getStaffs,
  addStaffs,
  editStaffs,
  delStaffs,
  downloadStaffs,
  importStaffs,
  exportStaffs
} from '@/api/organization'
import { requestErrorHelper } from '@/utils/mixin'
import { AImage } from '@/components'
export default {
  mixins: [requestErrorHelper],
  name: 'Members',
  components: { AImage },
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      columns: [
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '部门',
          dataIndex: 'department',
          scopedSlots: { customRender: 'department' }
        },
        {
          title: '手机号码',
          dataIndex: 'mobile'
        },
        {
          title: '工号',
          dataIndex: 'jobnumber'
        },
        {
          title: '状态',
          dataIndex: 'is_joined',
          scopedSlots: { customRender: 'is_joined' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      id: '',
      members: [],
      visible: false,
      showModal: false,
      isEdit: false,
      form: this.$form.createForm(this),
      model: {},
      departmentsList: [],
      status_num: {},
      queryParams: {
        status: '1'
      },
      radioValue: '1',
      fileList: [],
      loading: false,
      confirmLoading: false,
      pagination: {
        current: 1,
        pageSize: 15
      },
      memberStatus: [
        {
          id: 1,
          name: '在职',
          is_active: true
        },
        {
          id: 2,
          name: '离职',
          is_active: false
        }
      ]
    }
  },
  created () {
    this.fecthDepartmentsList()
    this.loadData()
  },
  methods: {
    handleChangeTable (pagination) {
      this.queryParams.page = pagination.current
      this.loadData(this.queryParams)
    },
    addFN () {
      this.showModal = true
      this.isEdit = false
    },
    exportFN () {
      exportStaffs(this.queryParams)
        .then(res => {
          window.location = res.url
        })
    },
    importFN () {
      this.visible = true
    },
    closeModal () {
      this.form.resetFields()
    },
    beforeUpload (file) {
      console.log(file.type)

      this.fileList = [...this.fileList, file]
      return false
    },
    handleRemove (file) {
      this.fileList = []
    },
    handleOk () {
      this.confirmLoading = true
      const formData = new FormData()
      formData.append('staffs_file', this.fileList[0])
      importStaffs(formData)
        .then(res => {
          this.fileList = []
          this.visible = false
          this.confirmLoading = false
          this.$message.success(`成功导入${res.successed_num}个员工`)
          this.loadData()
          this.fecthDepartmentsList()
        })
        .catch((err) => {
          this.confirmLoading = false
          this.$message.error(err.response.data.message)
        })
    },
    handleDownload () {
      downloadStaffs()
        .then(res => {
          downloadFile(res, '员工导入模版.xlsx')
        })
    },
    handleEdit (record) {
      this.isEdit = true
      this.id = record.id
      this.showModal = true
      this.form.resetFields()
      if (record.department) {
        record.department_id = record.department.id
      }
      this.model = Object.assign({}, record)
      this.$nextTick(() => {
      // 设置初始值
        this.form.setFieldsValue(this.model)
      })
    },
    handleDelete (record) {
      const that = this
      this.id = record.id
      this.$confirm({
        title: '警告',
        content: `确认让${record.name}离职吗?`,
        okText: '确认',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 删除
          delStaffs(that.id)
            .then(res => {
              that.$message.success('离职成功')
              that.loadData()
            })
        }
      })
    },
    handleSubmit () {
      const that = this
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          if (this.isEdit) {
            editStaffs(values, that.id)
              .then(res => {
                that.$message.success('修改成功')
                that.showModal = false
                that.form.resetFields()
                that.confirmLoading = false
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
          } else {
            addStaffs(values)
              .then(res => {
                that.$message.success('添加成功')
                that.showModal = false
                that.confirmLoading = false
                that.form.resetFields()
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
    handleRadioChange (e) {
      this.queryParams.status = e.target.value
      this.radioValue = e.target.value
      this.queryParams.page = 1
      this.loadData()
    },
    handleFormSubmit () {
      this.queryParams.page = 1
      this.loadData()
    },
    handleReset () {
      this.queryParams = {}
      this.queryParams.page = 1
      this.queryParams.status = '1'
      this.radioValue = '1'
      this.loadData()
    },
    loadData () {
      this.loading = true
      getStaffs(this.queryParams)
        .then(res => {
          this.members = res.data
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

<style lang="less" scoped>
.flex-right {
  display: flex;
  justify-content: flex-end;
}
.flex-middel {
  display: flex;
  align-items: center;
}
.import-container {
  p {
    font-size: 10px;
  }
  .item{
    display: flex;
    align-items: top;
    .icon-self{
      margin-top: 3px;
      margin-right: 10px;
    }
  }
}
</style>
