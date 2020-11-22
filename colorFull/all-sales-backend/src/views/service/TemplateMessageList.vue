<!--
 * @Description: 服务号管理-模板管理
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-12 20:17:29
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-card>
    <div>
      <a-table
        v-if="isList"
        class="table"
        :columns="columns"
        :dataSource="messageList"
        :loading="loading"
        :pagination="pagination"
        :rowKey="record => record.id">
        <template slot="name" slot-scope="text, record">
          {{ record.name }}
        </template>
        <template slot="is_enable" slot-scope="text, record">
          {{ statusText[record.is_enable] }}
        </template>
        <template slot="action" slot-scope="text, record">
          <sapn v-action:wechat-template-message-update style="color: #f5222d;" @click="handleDetail(record)" >编辑</sapn>
        </template>
      </a-table>
      <div v-else>

        <a-form layout="inline" >
          <a-form-item label="模板id">
            <a-input
              style="width:300px"
              v-model="selectedMessage.template_id"
              v-decorator="[
                'template_id',
                {
                  rules: [{ required: true, message: '模板id必须填写' }],
                }
              ]"
            />
            <span style="color:red">
              *模板id修改后，原有模板id将不可用，请谨慎操作
            </span>
          </a-form-item>

          <a-table
            class="table"
            :columns="detailColumns"
            :dataSource="selectedMessage.list"
            :loading="loading"
            :pagination="pagination"
            :rowKey="record => record.field">
            <template slot-scope="text, record">
              {{ record.field }}
            </template>
            <template slot-scope="text, record">
              {{ record.title }}
            </template>
            <template slot="value" slot-scope="input, record">
              <a-input
                v-model="record.value"
                :placeholder="record.default"
                :defaultValue="record.default"
                :disabled="record.is_forbid===1"
              />
            </template>'
          </a-table>
          <a-form-item label="通知状态">
            <a-checkbox :checked="selectedMessage.is_enable===1?true:false" @change="onChange">
              是否启用
            </a-checkbox>
          </a-form-item>
          <div style="margin-top:20px">
            <a-row>
              <a-col :span="12" style="text-align:right" > <a-button v-action:wechat-template-message-update @click="handleSave()" style="margin-rigt:10px" type="primary">提交</a-button></a-col>
              <a-col :span="12" > <a-button style="margin-left:10px" @click="handleBack()">返回</a-button></a-col>
            </a-row>
          </div>
        </a-form>
      </div>
    </div>
  </a-card>
</template>
<script>

import { getTemlateMessageList, updateTemplateMessage } from '@/api/manage'
export default {
  name: 'TemplateMessageList',
  data () {
    return {
      columns: [
        {
          title: '消息推送场景',
          dataIndex: 'name',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '状态',
          width: '150px',
          dataIndex: 'is_enable',
          scopedSlots: { customRender: 'is_enable' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      detailColumns: [
        {
          title: '字段',
          width: '150px',
          dataIndex: 'field',
          scopedSlots: { customRender: 'field' }
        },
        {
          title: '标题',
          width: '150px',
          dataIndex: 'title',
          scopedSlots: { customRender: 'title' }
        },
        {
          title: '内容',
          dataIndex: 'value',
          scopedSlots: { customRender: 'value' }
        }
      ],
      pagination: false,
      messageList: [],
      selectedMessage: null,
      fieldList: [],
      loading: false,
      isList: true,
      statusText: [
        '禁用',
        '启用'
      ]
    }
  },
  created () {
    this.loadData()
  },
  methods:
  {
    onChange (e) {
      if (e.target.checked === true) { this.selectedMessage.is_enable = 1 } else { this.selectedMessage.is_enable = 0 }
    },
    handleSave () {
      if (this.selectedMessage == null) {
        this.$message.success('保存对象错误')
        return
      }
      if (this.selectedMessage.tempate_id === '' && this.selectedMessage.is_enable === 1) {
        this.$message.success('启用状态必须输入模板id')
        return
      }
      updateTemplateMessage(this.selectedMessage)
        .then(res => {
          this.$message.success('保存成功')
          this.handleBack()
        })
        .catch(() => {
          this.$message.success('保存失败')
        })
    },
    handleBack () {
      this.selectedMessage = null
      this.isList = true
    },
    handleDetail (record) {
      this.selectedMessage = record
      this.isList = false
    },
    loadData () {
      this.isList = true
      this.loading = true
      getTemlateMessageList()
        .then(res => {
          this.loading = false
          this.messageList = res.messages
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
input[type="text"]:disabled
{
 color: red;
}
</style>
