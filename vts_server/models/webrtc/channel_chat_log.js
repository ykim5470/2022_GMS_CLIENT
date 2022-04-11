const Sequelize = require('sequelize')
module.exports = class ChannelChatLog extends Sequelize.Model {
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
        Text: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ChannelChatLog',
        tableName: 'ChannelChatLog',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
  static associate(db) {
    db.ChannelChatLog.belongsTo(db.Channel, {
      foreignKey: 'RoomId',
    })
  }
}
