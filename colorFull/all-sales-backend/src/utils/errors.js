/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-10-23 16:09:35
 * @LastEditTime: 2019-10-23 16:30:26
 * @LastEditors: Please set LastEditors
 */
import {
  arrayWrap
} from './util'

export default class Errors {
  /**
   * Create a new error bag instance.
   */
  constructor () {
    this.errors = {}
    this.requestError = {}
  }

  /**
   * Set the errors object or field error messages.
   *
   * @param {Object|String} field
   * @param {Array|String|undefined} messages
   */
  set (field, messages) {
    if (typeof field === 'object') {
      this.errors = field
    } else {
      this.set({
        ...this.errors,
        [field]: arrayWrap(messages)
      })
    }
  }

  /**
   * Get all the errors.
   *
   * @return {Object}
   */
  all () {
    return this.errors
  }

  /**
   * Determine if there is an error for the given field.
   *
   * @param  {String} field
   * @return {Boolean}
   */
  has (field) {
    return this.errors.hasOwnProperty(field)
  }

  /**
   * Determine if there are any errors for the given fields.
   *
   * @param  {...String} fields
   * @return {Boolean}
   */
  hasAny (...fields) {
    return fields.some(field => this.has(field))
  }

  /**
   * Determine if there are any errors.
   *
   * @return {Boolean}
   */
  any () {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Get the first error message for the given field.
   *
   * @param  String} field
   * @return {String|undefined}
   */
  get (field) {
    if (this.has(field)) {
      return this.getAll(field)[0]
    }
  }

  /**
   * Get all the error messages for the given field.
   *
   * @param  {String} field
   * @return {Array}
   */
  getAll (field) {
    return arrayWrap(this.errors[field] || [])
  }

  /**
   * get first
   *
   * @return {String}
   */
  first (field) {
    if (field) {
      return this.get(field)
    }

    if (this.any()) {
      return this.first(Object.keys(this.errors).shift())
    }
  }

  /**
   * Get the error message for the given fields.
   *
   * @param  {...String} fields
   * @return {Array}
   */
  only (...fields) {
    const messages = []

    fields.forEach(field => {
      const message = this.get(field)

      if (message) {
        messages.push(message)
      }
    })

    return messages
  }

  /**
   * Get all the errors in a flat array.
   *
   * @return {Array}
   */
  flatten () {
    return Object.values(this.errors).reduce((a, b) => a.concat(b), [])
  }

  /**
   * Clear one or all error fields.
   *
   * @param {String|undefined} field
   */
  clear (field) {
    if (!this.any()) {
      return
    }
    const errors = {}

    if (Array.isArray(field)) {
      Object.keys(this.errors).forEach(key => {
        if (!field.includes(key)) {
          errors[key] = this.errors[key]
        }
      })

      this.set(errors)
    } else if (field instanceof Object) {
      this.clear(Object.keys(field))
    } else if (field) {
      Object.keys(this.errors).forEach(key => {
        if (key !== field) {
          errors[key] = this.errors[key]
        }
      })

      this.set(errors)
    }
    this.clearRequestError()
  }

  clearRequestError () {
    if (!this.any()) {
      this.setRequestError({})
    }
  }

  /**
   * Clear one or all error fields.
   *
   * @param {Object} error
   */
  setRequestError (error) {
    this.requestError = error
    if (this.hasRequestError()) {
      this.set(error.response.data.errors)
    }
  }

  hasRequestError () {
    return this.requestError.response && this.requestError.response.data.errors
  }

  hasRequestMessage () {
    return this.requestError.response && this.requestError.response.data.message
  }

  requestErrorAny () {
    return this.requestErrorFirst() || this.requestErrorMessage()
  }

  requestErrorFirst () {
    if (this.hasRequestError()) {
      return this.errors.first()
    }
  }

  requestErrorMessage () {
    if (this.hasRequestMessage()) {
      let message = this.requestError.response.data.message

      if (message === 'The given data was invalid.') {
        message = '填写的数据无效'
      }

      return message
    }
  }

  requestErrorFormFields (values) {
    if (!this.any()) {
      return
    }

    const fields = {}
    const errors = this.errors
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

/**
 * 使用方式
 * /

/*
  import Errors from '@/utils/errors'
  :help="errors.get('mobile')" :class="errors.has('mobile') ? 'has-error' : ''"
  form: this.$form.createForm(this, {
    onFieldsChange: (props, fields) => {
      this.errors.clear(fields)
    }
  })
 */
