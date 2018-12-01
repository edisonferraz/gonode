const moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define(
    'Appointment',
    {
      date: DataTypes.DATE
    },
    {
      getterMethods: {
        today () {
          return moment(this.date).format('D/M/Y')
        },
        hour () {
          return moment(this.date).format('HH:mm')
        }
      }
    }
  )

  Appointment.associate = models => {
    Appointment.belongsTo(models.User, { as: 'user', foreignKey: 'user_id' })
    Appointment.belongsTo(models.User, { foreignKey: 'provider_id' })
  }

  return Appointment
}
