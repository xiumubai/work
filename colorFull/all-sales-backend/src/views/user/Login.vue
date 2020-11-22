<!--
 * @Description: In User Settings Edit
 * @Author: Jian-li guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-23 16:54:39
 * @LastEditors: Please set LastEditors
 -->
<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >
      <a-alert
        v-if="isLoginError"
        :closable="true"
        type="error"
        showIcon
        style="margin-bottom: 24px;"
        :message="message"
        @close="handleClose"
      />
      <a-form-item>
        <a-input-group compact style="display: flex;">
          <a-select size="large" defaultValue="中国+86" @change="handleChangeRegionCode">
            <a-select-option
              v-for="(code, index) in regionCodeList"
              :value="code.code"
              :key="index"
            >{{ code.name }}{{ code.number }}</a-select-option>
          </a-select>
          <a-input
            size="large"
            type="text"
            placeholder="手机号"
            v-decorator="['mobile', {rules: [{ required: true, pattern: /^1[345789]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}]"
          >
            <a-icon slot="prefix" type="mobile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-input-group>
      </a-form-item>
      <a-row :gutter="16">
        <a-col class="gutter-row" :span="16">
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="验证码"
              v-decorator="['code', {rules: [{ required: true, message: '请输入验证码' }]}]"
            >
              <a-icon slot="prefix" type="mail" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col class="gutter-row" :span="8">
          <a-button
            class="getCaptcha"
            tabindex="-1"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
          ></a-button>
        </a-col>
      </a-row>
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { getSmsCaptcha, getRegionCodes } from '@/api/login'
import { requestErrorHelper } from '@/utils/mixin'

export default {
  mixins: [requestErrorHelper],
  components: {},
  data () {
    return {
      isLoginError: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        smsSendBtn: false
      },
      regionCodeList: [],
      defalutRegionCode: '',
      queryForm: {},
      message: ''
    }
  },
  created () {
    this.fetchRegionCodes()
  },
  methods: {
    ...mapActions(['Login']),
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        Login
      } = this

      state.loginBtn = true

      const validateFieldsKey = ['mobile', 'code']

      validateFields(validateFieldsKey, { force: true }, (error, values) => {
        if (!error) {
          this.queryForm.code = values.code
          Login(this.queryForm)
            .then(res => this.loginSuccess(res))
            .catch(err => {
              console.log(err)
              this.isLoginError = true
              this.message = '手机号错误或验证码错误'
            })
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      validateFields(['mobile'], { force: true }, (error, values) => {
        if (!error) {
          const hide = this.$message.loading('验证码发送中..', 0)
          this.queryForm.mobile = values.mobile
          state.smsSendBtn = true
          getSmsCaptcha(this.queryForm)
            .then(res => {
              const interval = window.setInterval(() => {
                if (state.time-- <= 0) {
                  state.time = 60
                  state.smsSendBtn = false
                  window.clearInterval(interval)
                }
              }, 1000)
              setTimeout(hide, 1500)
            })
            .catch(err => {
              setTimeout(hide, 1)
              state.time = 60
              state.smsSendBtn = false
              const errorFields = this.requestErrorFormFields(err, values)
              if (errorFields) {
                this.form.setFields(errorFields)
              } else {
                this.isLoginError = true
                this.message = this.requestErrorMessage(err) || '手机号不存在，请联系管理员添加'
              }
            })
        }
      })
    },
    handleChangeRegionCode (e) {
      this.queryForm.region_code = e
      this.regionCodeList.map(v => {
        if (v.code === e) {
          this.queryForm.region_number = v.number
        }
      })
    },
    handleClose () {
      this.isLoginError = false
    },
    loginSuccess (res) {
      this.$router.push({ path: '/' })
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    fetchRegionCodes () {
      getRegionCodes().then(res => {
        this.regionCodeList = res.data
        this.defalutRegionCode = this.regionCodeList[0].name + this.regionCodeList[0].number
        this.queryForm.region_code = this.regionCodeList[0].code
        this.queryForm.region_number = this.regionCodeList[0].number
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
</style>
