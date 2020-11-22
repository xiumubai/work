<template>
  <div>
    <a-radio-group v-model="nContentType" >
      <a-radio-button value="text">文字</a-radio-button>
      <a-radio-button value="image">图片</a-radio-button>
    </a-radio-group>
    <a-layout class="content" v-if="nContentType === 'text'" >
      <a-textarea v-model="nContentText"/>
    </a-layout>
    <a-layout class="content" v-if="nContentType === 'image'" >
      <a-upload
        name="avatar"
        v-model="rAliossConfig"
        listType="picture-card"
        class="avatar-uploader"
        :showUploadList="false"
        :data="imageData"
        :customRequest="uploadAlioss"
        :beforeUpload="beforeUpload"
        @change="handleChange"
      >
        <img class="avatar-image" v-if="nContentImage" :src="nContentImage" alt="avatar" />
        <div v-else>
          <a-icon :type="loading ? 'loading' : 'plus'" />
        </div>
      </a-upload>
    </a-layout>
    <div class="buttons-panel">
      <a-button v-action:wechat-reply-store type="primary" @click="saveContent">保存</a-button>
      <a-button v-action:wechat-reply-destroy @click="deleteContent" >删除回复</a-button>
    </div>
  </div>

</template>

<script>
import { uploadAliossFile } from '@/api/manage'
import { getUUID } from '@/utils/util'
export default {
  name: 'ReplyContent',
  data () {
    return {
      nContentType: 'text',
      nContentText: '',
      nContentImage: '',
      loading: false,
      isUploaded: false,
      imageData: {} }
  },
  created () {
    this.nContentType = this.rContentType
    this.nContentText = this.rContentText
    this.nContentImage = this.rContentImage
  },
  watch: {
    rContentText (newVal, oldVal) {
      this.nContentText = newVal
    },
    rContentImage (newVal, oldVal) {
      this.nContentImage = newVal
    },
    rContentType (newVal, oldVal) {
      this.nContentType = newVal
    }
  },
  methods:
  {
    saveContent () {
      if (this.nContentType === 'text') {
        if (this.nContentText === this.rContentText) {
          this.$message.info('未更改')
          return
        }
        this.$emit('saveContent', this.nContentType, this.nContentText)
      } else {
        if (this.nContentImage === this.rContentImage) {
          this.$message.info('未更改')
          return
        }
        this.$emit('saveContent', this.nContentType, this.nContentImage)
      }
    },
    deleteContent () {
      const self = this
      this.$confirm({
        title: '是否删除',
        content: '删除后，关注该公众号的用户将不再接收该回复，确定删除？',
        onOk () {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            self.$emit('deleteContent', self.nContentType)
          }).catch(error => { console.log('error' + error) })
        },
        onCancel () {}
      })
    },
    uploadAlioss (file) {
      let filename = file.file.name
      let suffix = ''
      var index = filename.lastIndexOf('.')
      if (index > 0) { suffix = filename.substring(index) }
      filename = getUUID() + suffix
      const key = this.rAliossConfig.start_path + this.rAliossConfig.sub_path + '/' + filename
      const formData = new FormData()
      formData.append('key', key)
      formData.append('policy', this.rAliossConfig.policy)
      formData.append('OSSAccessKeyId', this.rAliossConfig.accessid)
      formData.append('success_action_status', 200)
      formData.append('signature', this.rAliossConfig.signature)
      formData.append('file', file.file)
      uploadAliossFile(this.rAliossConfig.host, formData).then(res => {
        file.file.status = 'done'
        this.nContentImage = this.rAliossConfig.host + '/' + key
        this.isUploaded = true
        this.handleChange({ file: file.file })
      })
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.loading = false
      }
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJPG && isLt2M
    }
  },
  props: {
    rAliossConfig:
    {
      type: Object,
      default: function () {
        return {}
      }
    },
    rContentType:
    {
      type: String,
      default: 'text'
    },
    rContentText:
    {
      type: String,
      default: ''
    },
    rContentImage:
    {
      type: String,
      default: ''
    },
    content:
    {
      type: Object,
      default: function () {
        return {
          contentType: 1,
          content: ''
        }
      }
    },
    title: {
      type: [String, Boolean],
      default: true,
      required: false
    },
    logo: {
      type: String,
      default: '',
      required: false
    },
    avatar: {
      type: String,
      default: '',
      required: false
    }
  }
}
</script>

<style lang="less">
.content
{
  margin-top: 12px;
  height: 200px;
  width: 100%;
  margin-right: 12px;
  padding-right: 24px;
  textarea {
     height: 100%;
  }
}
.buttons-panel
{
  margin-top: 12px;
  .ant-btn
  {
    margin-right:12px;
  }
}
.avatar-uploader
{
  height: 100%;
  .ant-upload-select-picture-card
{
  width: 100%!important;
  height: 100%!important;
  max-height: 100%!important;
  display: block!important
}
.ant-upload-btn
{
  height: 100%;
}
.avatar-image {
    max-width:100%;
    max-height: 100%
  }
}

.ant-upload-select-picture-card i {
  font-size: 195px;
  color: #999;
}
</style>
