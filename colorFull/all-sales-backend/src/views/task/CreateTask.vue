<!--
 * @Description: 任务管理-创建任务
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 17:42:48
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
    <a-spin :spinning="comfirmLoading">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          label="任务名称"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'name',
              {rules: [{ required: true, message: '请输入标题' }]}
            ]"
            placeholder="请输入"
            maxLength="64"
            @change="handleChangeName">
            <span slot="suffix">{{ nameLength }}/64</span>
          </a-input>
          <div>备注：任务名称是展示给内部员工查看的</div>
        </a-form-item>

        <a-form-item
          label="任务封面"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-upload
            name="cover"
            accept=".jpg,.jpeg,.png"
            listType="picture"
            :showUploadList="false"
            :beforeUpload="beforeUploadCover"
            v-decorator="[
              'cover',
              {rules: [{ required: true, message: '任务封面' }]}
            ]"
          >
            <span style="display: flex; align-items: flex-end;">
              <div v-if="coverUrl" style="width: 235px; height: 100px; border: 1px solid #d9d9d9; margin-right: 24px;">
                <a-image :src="coverUrl"></a-image>
              </div>
              <a-button><a-icon :type="uploadingCover ? 'loading' : 'plus'" /> {{ uploadingCover ? '上传中' : '选择图片' }} </a-button>
              <span style="color: red; vertical-align: top;">（建议图片尺寸：900*383px）</span>
            </span>
          </a-upload>

        </a-form-item>

        <a-form-item
          label="摘要"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-textarea
            rows="4"
            placeholder="选填"
            maxLength="120"
            v-decorator="[
              'description'
            ]"/>
        </a-form-item>

        <a-form-item
          label="时间范围"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-range-picker
            name="buildTime"
            style="width: 100%"
            :showTime="true"
            :disabledDate="disabledDate"
            @change="handleTimeChange"
            v-decorator="[
              'start_time',
              {rules: [{ required: true, message: '请选择起止日期' }]}
            ]" />
        </a-form-item>

        <a-form-item
          label="任务类型"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }"
          :required="true">
          <a-radio-group
            @change="handleChangeType"
            v-decorator="[
              'type',
              {initialValue: '10', rules: [{ required: true, message: '请选择任务类型' }]}
            ]">
            <a-radio value="10">公众号文章</a-radio>
            <a-radio value="20">海报图片</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="value === 10"
          label="文章链接"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-textarea
            rows="4"
            placeholder="请复制微信公众号链接到此处"
            v-decorator="[
              'content_url',
              {rules: [{ required: true, message: '请输入目标描述' }]}
            ]" />
          <a-button type="primary" @click="handleGetContent">获取公众号内容</a-button>
        </a-form-item>

        <a-form-item
          v-if="value === 20"
          label="海报图片"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-upload
            name="poster"
            accept=".jpg,.jpeg,.png"
            listType="picture"
            :showUploadList="false"
            :beforeUpload="beforeUploadPoster"
            v-decorator="[
              'poster',
              {rules: [{ required: true, message: '请选择海报图片' }]}
            ]"
          >
            <span style="display: flex; align-items: flex-end;">
              <div v-if="posterUrl" style="width: 100px; height: 100px; border: 1px solid #d9d9d9; margin-right: 24px;">
                <a-image :src="posterUrl"></a-image>
              </div>
              <a-button><a-icon :type="uploadingPoster ? 'loading' : 'plus'" /> {{ uploadingPoster ? '上传中' : '选择图片' }} </a-button>
            </span>
          </a-upload>

        </a-form-item>
        <a-form-item
          v-if="value === 20"
          label="海报标题"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'poster_title',
              {rules: [{ required: true, message: '请输入标题' }]}
            ]"
            placeholder="请输入"
            maxLength="64">
          </a-input>
        </a-form-item>
        <a-form-item
          v-if="isAdmin"
          label="发送范围"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            mode="multiple"
            allowClear
            placeholder="请选择部门"
            @change="handleChangeNotify"
            v-decorator="['notify_target', {rules: [{ required: true, message: '请选择发送范围' }]}]">
            <a-select-option v-for="depart in filtersDepartmentsList" :key="depart.id">
              {{ depart.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          v-else
          label="发送范围"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            mode="multiple"
            allowClear
            placeholder="请选择部门"
            v-decorator="['notify_target', {rules: [{ required: true, message: '请选择发送范围' }]}]">
            <a-select-option v-for="depart in departmentsList" :key="depart.id">
              {{ depart.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          label="单UV奖励积分"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            placeholder="请选择奖励积分"
            v-decorator="[
              'reward_point',
              {initialValue: '1', rules: [{ required: true, message: '请选择奖励积分' }]}
            ]">
            <a-select-option value="1">1</a-select-option>
            <a-select-option value="2">2</a-select-option>
            <a-select-option value="3">3</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          v-if="isAdmin"
          label="积分"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'total_point',
              {rules: [{ required: true, message: '请输入积分' }, { pattern: /^[0-9]*$/, message: '请输入正确的积分' }, { validator: handleChangePoint }]}
            ]"
            placeholder="请输入积分" />
        </a-form-item>
        <a-form-item
          v-else
          label="积分"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-input
            v-decorator="[
              'total_point',
              {rules: [{ required: true, message: '请输入积分' }, { pattern: /^[0-9]*$/, message: '请输入正确的积分' }, { validator: handleChangePoint }]}
            ]"
            :placeholder="placeholder" />
        </a-form-item>

        <a-form-item
          label="通知发送方式"
          :labelCol="{lg: {span: 7}, sm: {span: 7}}"
          :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
          <a-select
            v-decorator="[
              'notify_speed',
              {initialValue: '30', rules: [{ required: true, message: '请选发送方式' }]}
            ]">
            <a-select-option value="10">快速发送（每分钟1500条）</a-select-option>
            <a-select-option value="20">中速发送（每分钟300条）</a-select-option>
            <a-select-option value="30">慢速发送（每分钟60条）</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :wrapperCol="{ span: 24 }"
          style="text-align: center">
          <a-button htmlType="submit" type="primary">提交</a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-card>
</template>

<script>
import { getDepartmentList, pointAccounts } from '@/api/manage'
import { taskCovers, taskPosters, addTask, taskContents } from '@/api/task'
import { requestErrorHelper } from '@/utils/mixin'
import { AImage } from '@/components'
import moment from 'moment'
export default {
  name: 'CreateTask',
  components: { AImage },
  mixins: [requestErrorHelper],
  data () {
    return {
      value: 10,
      form: this.$form.createForm(this),
      departmentsList: [],
      filtersDepartmentsList: [],
      coverUrl: '',
      posterUrl: '',
      content_id: '',
      placeholder: '',
      start_time: '',
      end_time: '',
      comfirmLoading: false,
      uploadingCover: false,
      uploadingPoster: false,
      nameLength: 0,
      allMembers: {
        id: 0,
        name: '全体成员',
        order: 0
      },
      selectedItems: [],
      isAdmin: false,
      useable_quantity: 0
    }
  },
  watch: {
    selectedItems (val) {
      if (val.length === 0) {
        this.filtersDepartmentsList = this.departmentsList
      } else if (val.includes(0)) {
        this.filtersDepartmentsList = this.departmentsList.filter((e, i, arr) => i === 0)
      } else {
        this.filtersDepartmentsList = this.departmentsList.filter((e, i, arr) => i !== 0)
      }
    }
  },
  created () {
    this.isAdmin = !this.$store.state.user.info.roles[0].is_department_admin
    this.fecthDepartmentsList()
    this.fetchPointAccounts()
  },
  methods: {
    moment,
    handleGetContent () {
      const that = this
      const url = this.form.getFieldValue('content_url')
      if (url) {
        this.comfirmLoading = true
        taskContents({ content_url: url }).then(res => {
          that.content_id = res.id
          that.comfirmLoading = false
          that.$message.success('获取成功')
        }).catch((err) => {
          console.log(err)
          that.comfirmLoading = false
          const errorFields = that.requestErrorFormFields(err, { content_url: url })
          if (errorFields) {
            that.form.setFields(errorFields)
          } else {
            that.$message.error(err.response.data.message)
          }
        })
      } else {
        that.$message.error('文章链接不能为空')
      }
    },
    handleChangePoint (rule, value, callbackFn) {
      if (value !== '' && value <= 0) {
        callbackFn('输入积分必须大于0')
      } else if (this.isAdmin === false && value > this.useable_quantity) {
        callbackFn('输入积分不能大于可用积分')
      }
      callbackFn()
    },
    handleChangeNotify (value) {
      this.selectedItems = value
    },
    handleChangeName (e) {
      this.nameLength = e.target.value.length
    },
    handleChangeType (e) {
      this.value = parseInt(e.target.value)
    },
    disabledDate (current) {
      return current && current < moment().startOf('day')
    },
    handleTimeChange (value, dateString) {
      this.start_time = dateString[0]
      this.end_time = dateString[1]
    },
    handleSubmit (e) {
      const that = this
      e.preventDefault()
      that.form.validateFields((err, values) => {
        if (!err) {
          values.start_time = that.start_time
          values.end_time = that.end_time
          values.cover = that.coverUrl
          values.poster = that.posterUrl
          values.content_id = that.content_id
          if (values.notify_target[0] === 0) {
            values.notify_target = []
          }
          that.$confirm({
            title: '警告',
            content: `确认创建本任务吗？`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk () {
              // 删除
              that.comfirmLoading = true
              addTask(values).then(res => {
                that.$message.success('创建成功')
                that.coverUrl = ''
                that.posterUrl = ''
                that.comfirmLoading = false
                that.form.resetFields()
                that.$router.push({ path: 'task-manage-list' })
              }).catch((err) => {
                that.comfirmLoading = false
                const errorFields = that.requestErrorFormFields(err, values)
                if (errorFields) {
                  that.form.setFields(errorFields)
                } else {
                  that.$message.error(err.response.data.message)
                }
              })
            }
          })
        }
      })
    },
    beforeUploadCover (file) {
      const formData = new FormData()
      formData.append('cover', file)
      this.uploadingCover = true
      taskCovers(formData).then(res => {
        this.coverUrl = res.url
        this.uploadingCover = false
      })
      return false
    },
    beforeUploadPoster (file) {
      const formData = new FormData()
      formData.append('poster', file)
      this.uploadingPoster = true
      taskPosters(formData).then(res => {
        this.posterUrl = res.url
        this.uploadingPoster = false
      })
      return false
    },
    fecthDepartmentsList () {
      getDepartmentList().then(res => {
        this.departmentsList = res.data
        if (this.isAdmin) {
          this.departmentsList.unshift(this.allMembers)
          this.filtersDepartmentsList = this.departmentsList
        }
      })
    },
    fetchPointAccounts () {
      pointAccounts().then(res => {
        this.useable_quantity = res.point_account.useable_quantity
        this.placeholder = '请输入（可用积分' + res.point_account.useable_quantity + '）'
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
