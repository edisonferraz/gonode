'use strict'

const Event = use('App/Models/Event')

const moment = require('moment')

class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view, auth }) {
    let date = request.input('date')

    if (date) {
      const events = await Event.query()
        .where('user_id', auth.user.id)
        .whereRaw(`DATE_FORMAT(date, "%Y-%m-%d") = ? `, [date])
        .fetch()

      return events
    }

    const events = await Event.query()
      .where('user_id', auth.user.id)
      .fetch()

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])

    const dateFilled = await Event.query()
      .where('user_id', auth.user.id)
      .where('date', data.date)
      .first()

    if (dateFilled) {
      return response
        .status(400)
        .send({ error: { message: 'Selected date and time unavailable' } })
    }

    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      response.status(401).send({
        error: { message: 'You can only view events that belong to you' }
      })
    }

    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      response.status(401).send({
        error: { message: 'You can only edit events that belong to you' }
      })
    }

    if (moment(event.date).isBefore(moment.now())) {
      response.status(400).send({
        error: {
          message: 'This event has passed, it is not possible to edit it'
        }
      })
    }

    const dateFilled = await Event.query()
      .where('user_id', auth.user.id)
      .where('date', data.date)
      .first()

    if (dateFilled) {
      return response
        .status(400)
        .send({ error: { message: 'Selected date and time unavailable' } })
    }

    event.merge(data)

    await event.save()

    return event
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response, auth }) {
    const event = await Event.findOrFail(params.id)

    if (event.user_id !== auth.user.id) {
      response.status(401).send({
        error: { message: 'You can only delete events that belong to you' }
      })
    }

    if (moment(event.date).isBefore(moment.now())) {
      return response
        .status(400)
        .send({ error: { message: 'Past events cannot be deleted' } })
    }

    await event.delete()
  }
}

module.exports = EventController
