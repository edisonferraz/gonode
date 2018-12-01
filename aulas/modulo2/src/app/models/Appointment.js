module.exports = (sequelize, DataTypes) => {
  const Appointment = sequelize.define('Appointment', {
    date: DataTypes.DATE
  })

  Appointment.associate = models => {
    Appointment.belongsTo(models.user, { foreignKey: 'user_id' })
    Appointment.belongsTo(models.user, { foreignKey: 'provider_id' })
  }

  return Appointment
}
