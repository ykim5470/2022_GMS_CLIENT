const Sequelize = require('sequelize')
module.exports = class ChannelLikeLog extends Sequelize.Model {
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
        Like: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ChannelLikeLog',
        tableName: 'ChannelLikeLog',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
  static associate(db) {
    db.ChannelLikeLog.belongsTo(db.Channel, {
      foreignKey: 'RoomId',
    })
  }
}
