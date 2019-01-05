'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store')
Route.put('users', 'UserController.update')

Route.post('auth', 'AuthController.store')
