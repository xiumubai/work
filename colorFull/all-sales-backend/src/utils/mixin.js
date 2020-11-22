// import Vue from 'vue'
import {
  deviceEnquire,
  DEVICE_TYPE
} from '@/utils/device'
import {
  mapState
} from 'vuex'
import Errors from '@/utils/errors'

// const mixinsComputed = Vue.config.optionMergeStrategies.computed
// const mixinsMethods = Vue.config.optionMergeStrategies.methods

const mixin = {
  computed: {
    ...mapState({
      layoutMode: state => state.app.layout,
      navTheme: state => state.app.theme,
      primaryColor: state => state.app.color,
      colorWeak: state => state.app.weak,
      fixedHeader: state => state.app.fixedHeader,
      fixSiderbar: state => state.app.fixSiderbar,
      fixSidebar: state => state.app.fixSiderbar,
      contentWidth: state => state.app.contentWidth,
      autoHideHeader: state => state.app.autoHideHeader,
      sidebarOpened: state => state.app.sidebar,
      multiTab: state => state.app.multiTab
    })
  },
  methods: {
    isTopMenu () {
      return this.layoutMode === 'topmenu'
    },
    isSideMenu () {
      return !this.isTopMenu()
    }
  }
}

const mixinDevice = {
  computed: {
    ...mapState({
      device: state => state.app.device
    })
  },
  methods: {
    isMobile () {
      return this.device === DEVICE_TYPE.MOBILE
    },
    isDesktop () {
      return this.device === DEVICE_TYPE.DESKTOP
    },
    isTablet () {
      return this.device === DEVICE_TYPE.TABLET
    }
  }
}

const AppDeviceEnquire = {
  mounted () {
    const {
      $store
    } = this
    deviceEnquire(deviceType => {
      switch (deviceType) {
        case DEVICE_TYPE.DESKTOP:
          $store.commit('TOGGLE_DEVICE', 'desktop')
          $store.dispatch('setSidebar', true)
          break
        case DEVICE_TYPE.TABLET:
          $store.commit('TOGGLE_DEVICE', 'tablet')
          $store.dispatch('setSidebar', false)
          break
        case DEVICE_TYPE.MOBILE:
        default:
          $store.commit('TOGGLE_DEVICE', 'mobile')
          $store.dispatch('setSidebar', true)
          break
      }
    })
  }
}

const requestErrorHelper = {
  methods: {
    setRequestError (error) {
      if (error.response && error.response.data.errors) {
        this.errors.set(error.response.data.errors)
      }
    },
    requestErrorAny (error) {
      return this.requestErrorFirst(error) || this.requestErrorMessage(error)
    },
    requestErrorFirst (error) {
      if (!error.response || error.response.data.errors) {
        return
      }

      let message = ''
      if (this.errors) {
        this.errors.set(error.response.data.errors)
        message = this.errors.first()
      } else {
        const errors = new Errors()
        errors.set(error.response.data.errors)
        message = errors.first()
      }

      return message
    },
    requestErrorMessage (error) {
      if (!error.response || !error.response.data.message) {
        return
      }

      let message = ''
      message = error.response.data.message
      if (message === 'The given data was invalid.') {
        message = '填写的数据无效'
      }

      return message
    },
    requestErrorFormFields (error, values) {
      if (!error.response.data.errors) {
        return
      }

      const fields = {}
      const errors = error.response.data.errors
      Object.keys(errors).forEach(key => {
        const fieldErrors = []
        errors[key].forEach(fieldError => {
          fieldErrors.push({
            field: key,
            message: fieldError
          })
        })

        fields[key] = {
          value: values[key],
          errors: fieldErrors
        }
      })

      return fields
    }
  }
}

export {
  mixin,
  AppDeviceEnquire,
  mixinDevice,
  requestErrorHelper
}
