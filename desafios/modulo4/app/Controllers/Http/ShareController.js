'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/ShareEventMail')
const Event = use('App/Models/Event')

const moment = require('moment')

class ShareController {
  async create ({ request, response, params, auth }) {
    const event = await Event.findOrFail(params.id)
    const email = request.input('email')
    const { username } = auth.user

    event.time = moment(event.date).format('HH:mm:ss')
    event.date = moment(event.date).format('DD/MM/YYYY')

    Kue.dispatch(
      Job.key,
      { email, username, event },
      {
        attempts: 3
      }
    )
  }
}

module.exports = ShareController
