<!--
 * @Description: 积分商城-商品管理
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-28 11:43:44
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div>
    <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form" @submit="handleSubmitForm">
          <a-form-item
            label="商品名称"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-input
              maxLength="12"
              @change="handleChangeName"
              v-decorator="[
                'name',
                {rules: [{ required: true, message: '请输入商品名称' }]}
              ]"
              placeholder="请输入商品名称">
              <span slot="suffix">{{ nameLength }}/12</span>
            </a-input>
          </a-form-item>
          <a-form-item
            label="商品缩略图"
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
                {rules: [{ required: true, message: '请上传任务封面' }]}
              ]"
            >
              <span style="display: flex; align-items: flex-end;">
                <div v-if="coverUrl" style="width: 100px; height: 100px; border: 1px solid #d9d9d9; margin-right: 24px;">
                  <a-image :src="coverUrl"></a-image>
                </div>
                <a-button><a-icon :type="uploadingCover ? 'loading' : 'plus'" /> {{ uploadingCover ? '上传中' : '选择图片' }} </a-button>
                <span style="color: red; vertical-align: top;">（建议图片尺寸：500*500px）</span>
              </span>
            </a-upload>

          </a-form-item>
          <a-form-item
            label="商品类型"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-radio-group
              @change="handleChangeType"
              v-decorator="[
                'type',
                {initialValue: '1', rules: [{ required: true, message: '请选择商品类型' }]}
              ]">
              <a-radio value="1">实物商品</a-radio>
              <a-radio value="2">虚拟商品</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            v-if="type === 1"
            label="商品库存"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-input
              v-decorator="[
                'stock_quantity',
                {rules: [{ pattern: /^(-|\+)?\d+$/, message: '请输入正确的商品库存'}] }
              ]"/>
          </a-form-item>
          <a-form-item
            label="价值积分"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-input
              v-decorator="[
                'need_point',
                {rules: [{ required: true, message: '请输入商品价值积分' }, { pattern: /^[0-9]*$/, message: '请输入正确的价值积分' }]}
              ]"/>
          </a-form-item>
          <a-form-item
            label="商品状态"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-radio-group
              v-decorator="[
                'status',
                {initialValue: '1', rules: [{ required: true, message: '请选择商品类型' }]}
              ]">
              <a-radio value="1">上架</a-radio>
              <a-radio value="2">下架</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item
            label="商品排序"
            :labelCol="{lg: {span: 7}, sm: {span: 7}}"
            :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
            <a-input
              v-decorator="[
                'order',
                {rules: [{ pattern: /^[0-9]*$/, message: '请输入正确的商品排序' }]}
              ]"/>
            <span>备注：数字越大越靠前</span>
          </a-form-item>
          <a-form-item
            :wrapperCol="{ span: 24 }"
            style="text-align: center">
            <a-button style="margin-right: 8px;" @click="handleBack">返回</a-button>
            <a-button v-if="type === 1" htmlType="submit" type="primary">提交</a-button>
            <a-button v-else type="primary" @click="handleNext">下一步</a-button>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-card>
    <a-modal :width="600" title="上传兑换码" v-model="visible" @ok="handleSubmitUploadFile" :confirmLoading="confirmLoading">
      <a-spin :spinning="confirmLoading">
        <template>
          <div class="import-container">
            <div class="item">
              <a-icon class="icon-self" type="cloud-download" />
              <div class="content">
                <h4>下载模板</h4>
                <P>为提高导入的成功率，请下载并使用系统系统的模板</P>
                <a-button size="small" type="primary" @click="handleDownloadTemplate">下载模版</a-button>
              </div>
            </div>
            <div class="item" style="margin-top: 24px;">
              <a-icon class="icon-self" type="cloud-upload" />
              <div class="content">
                <h4>上传文件</h4>
                <P>仅支持xlsx，xls，文件大小&le;4M</P>
                <a-upload
                  name="staffs_file"
                  :beforeUpload="beforeUploadFile"
                  :remove="handleRemoveFile"
                >
                  <a-button :disabled="fileList ? true : false" size="small" type="primary"> <a-icon type="upload" />选择文件</a-button>
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
import { addGoodCover, addGoods, downloadGoodsCode, importGoodsCode } from '@/api/goods'
import { requestErrorHelper } from '@/utils/mixin'
import { AImage } from '@/components'
export default {
  name: 'GoodsAdd',
  components: { AImage },
  mixins: [requestErrorHelper],
  data () {
    return {
      form: this.$form.createForm(this),
      coverUrl: '',
      type: 1,
      visible: false,
      fileList: null,
      goods_id: '',
      confirmLoading: false,
      uploading: false,
      nameLength: 0,
      uploadingCover: false
    }
  },
  methods: {
    handleChangeName (e) {
      this.nameLength = e.target.value.length
    },
    beforeUploadCover (file) {
      const formData = new FormData()
      formData.append('cover', file)
      this.uploadingCover = true
      addGoodCover(formData).then(res => {
        this.coverUrl = res.url
        this.uploadingCover = false
      })
      return false
    },
    handleChangeType (e) {
      this.type = parseInt(e.target.value)
    },
    handleNext () {
      const that = this
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          values.cover = that.coverUrl
          this.$confirm({
            title: '警告',
            content: `点击确认直接创建商品，确认吗？`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk () {
              addGoods(values).then(res => {
                that.goods_id = res.id
                that.visible = true
              })
            }
          })
        }
      })
    },
    beforeUploadFile (file) {
      this.fileList = file
      return false
    },
    handleDownloadTemplate () {
      downloadGoodsCode()
        .then(res => {
          window.location.href = res.url
          window.open(res.url)
        })
    },
    handleSubmitForm (e) {
      e.preventDefault()
      const that = this
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          values.cover = that.coverUrl
          this.$confirm({
            title: '警告',
            content: `确认创建商品吗？`,
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk () {
              that.confirmLoading = true
              addGoods(values)
                .then(res => {
                  that.$message.success('创建成功')
                  that.coverUrl = ''
                  that.confirmLoading = false
                  that.form.resetFields()
                  that.$router.go(-1)
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
          })
        }
      })
    },
    handleSubmitUploadFile () {
      this.confirmLoading = true
      const formData = new FormData()
      formData.append('goods_code_file', this.fileList)
      formData.append('goods_id', this.goods_id)
      importGoodsCode(formData)
        .then(res => {
          this.fileList = null
          this.visible = false
          this.confirmLoading = false
          this.$message.success('导入成功')
          this.$router.go(-1)
        })
        .catch(() => {
          const message = '文件格式必须是：xlsx、xls'
          this.$message.error(message)
          this.confirmLoading = false
        })
    },
    handleRemoveFile (file) {
      this.fileList = null
    },
    handleBack () {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
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
  img{
    width: 100px;
    height: 100px;
  }
</style>
