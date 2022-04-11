const Sequelize = require('sequelize')
module.exports = class ChannelConcurrentUserLog extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        RoomId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        User: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Status: {
          type: Sequelize.ENUM('connected', 'disconnected'),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ChannelConcurrentUserLog',
        tableName: 'ChannelConcurrentUserLog',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
  static associate(db) {
    db.ChannelConcurrentUserLog.belongsTo(db.Channel, {
      foreignKey: 'RoomId',
    })
  }
}
