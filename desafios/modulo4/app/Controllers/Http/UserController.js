'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])

    const user = await User.create(data)

    return user
  }

  async update ({ request, response, auth }) {
    const { username, password, newPassword } = request.all()

    const user = await auth.getUser()
    const verifyPassword = await Hash.verify(password, user.password)

    if (!verifyPassword) {
      return response
        .status(400)
        .send({ error: { message: 'This password is wrong, please retry' } })
    }

    user.username = username
    user.password = newPassword // await Hash.make(newPassword)

    await user.save()

    return user
  }
}

module.exports = UserController
