'use strict'

const Mail = use('Mail')
const Event = use('App/Models/Event')

const moment = require('moment')

class ShareController {
  async create ({ request, response, params, auth }) {
    const event = await Event.findOrFail(params.id)
    const email = request.input('email')
    const { username } = auth.user

    event.time = moment(event.date).format('HH:mm:ss')
    event.date = moment(event.date).format('DD/MM/YYYY')

    await Mail.send(['emails.share_event'], { username, event }, message => {
      message
        .to(email)
        .from('edisonferraz@gmail.com', 'Edison Ferraz')
        .subject(`${username} compartilhou um evento com você`)
    })
  }
}

module.exports = ShareController
