'use strict'

const Antl = use('Antl')

class UserUpdate {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'required|unique:users',
      password: 'required',
      newPassword: 'required|confirmed'
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = UserUpdate
