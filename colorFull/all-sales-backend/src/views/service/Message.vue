<!--
 * @Description: 服务号管理-消息管理
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-12 20:17:29
 * @LastEditors: Please set LastEditors
 -->
<template>
  <a-card>
    <div>
      <a-tabs class="page-tabs" defaultActiveKey="" @change="callback">
        <a-tab-pane tab="被关注回复" :key="subscribeKey">
          <reply-content
            :rContentType="subscribeValue"
            :rAliossConfig="ossParams"
            :rContentText="subscribeContentText"
            :rContentImage="subscribeContentImage"
            @saveContent="saveSubscribeContent"
            @deleteContent="deleteSubscribeContent"></reply-content>
        </a-tab-pane>
        <a-tab-pane tab="收到消息回复" :key="autoReplyKey">
          <reply-content
            :rContentType="autoReplyValue"
            :rAliossConfig="ossParams"
            :rContentText="autoReplyContentText"
            :rContentImage="autoReplyContentImage"
            @saveContent="saveAutoReplyContent"
            @deleteContent="deleteAutoReplyContent"></reply-content>
        </a-tab-pane>
      </a-tabs>
    </div>
  </a-card>
</template>

<script>
import ReplyContent from '@/components/Service/ReplyContent'
import { getWechatReply, saveWechatReply, getAliossParams, deleteWechatReply } from '@/api/manage'
export default {
  name: 'Message',
  data () {
    return {
      subscribeKey: 2,
      autoReplyKey: 3,
      subscribeValue: 'text',
      autoReplyValue: 'text',
      subscribeContentText: '',
      autoReplyContentText: '',
      subscribeContentImage: '',
      autoReplyContentImage: '',
      ossParams: null
    }
  },
  created () {
    getWechatReply()
      .then(res => {
        const replies = res.replies
        if (replies.length > 0) {
          replies.forEach(element => {
            if (element.type === this.subscribeKey && element.detail.content_type === 'text') {
              this.subscribeContentText = element.detail.content
              this.subscribeValue = 'text'
            } else if (element.type === this.autoReplyKey && element.detail.content_type === 'text') {
              this.autoReplyContentText = element.detail.content
              this.autoReplyValue = 'text'
            } else if (element.type === this.subscribeKey && element.detail.content_type === 'image') {
              this.subscribeContentImage = element.detail.content
              this.subscribeValue = 'image'
            } else if (element.type === this.autoReplyKey && element.detail.content_type === 'image') {
              this.autoReplyContentImage = element.detail.content
              this.autoReplyValue = 'image'
            }
          })
        }
      })
    getAliossParams().then(res => {
      this.ossParams = res
    })
  },
  methods:
  {
    uploadAlioss () {

    },
    callback (e) {

    },
    saveSubscribeContent (contentType, content) {
      this.saveContent(this.subscribeKey, contentType, content, () => {
        this.$message.success('保存成功')
        if (contentType === 'text') { this.subscribeContentText = content } else { this.subscribeContentImage = content }
      })
    },
    saveAutoReplyContent (contentType, content) {
      this.saveContent(this.autoReplyKey, contentType, content, () => {
        this.$message.success('保存成功')
        if (contentType === 'text') { this.autoReplyContentText = content } else { this.autoReplyContentImage = content }
      })
    },
    saveContent (type, contentType, content, callback) {
      if (content === '') {
        this.$message.info('无内容')
        return
      }
      const data = {
        type: type,
        content_type: contentType,
        content: content
      }
      saveWechatReply(data).then(res => {
        callback()
      })
    },
    deleteSubscribeContent (contentType) {
      return this.deleteContent(this.subscribeKey, contentType, () => {
        this.$message.success('删除成功')
        if (contentType === 'text') { this.subscribeContentText = '' } else { this.subscribeContentImage = '' }
      })
    },
    deleteAutoReplyContent (contentType) {
      return this.deleteContent(this.autoReplyKey, contentType, () => {
        this.$message.success('删除成功')
        if (contentType === 'text') { this.autoReplyContentText = '' } else { this.autoReplyContentImage = '' }
      })
    },
    deleteContent (type, contentType, callback) {
      if (type === this.subscribeKey) {
        if (contentType === 'text' && this.subscribeContentText === '') {
          callback()
          return
        }
        if (contentType === 'image' && this.subscribeContentImage === '') {
          callback()
          return
        }
      } else if (type === this.autoReplyKey) {
        if (contentType === 'text' && this.autoReplyContentText === '') {
          callback()
          return
        }
        if (contentType === 'image' && this.autoReplyContentImage === '') {
          callback()
          return
        }
      }
      const data = {
        type: type
      }
      deleteWechatReply(data).then(res => {
        if (typeof callback === 'function') {
          callback()
        }
      })
    }
  },
  components: {
    'reply-content': ReplyContent
  }
}
</script>

<style scoped>
</style>
