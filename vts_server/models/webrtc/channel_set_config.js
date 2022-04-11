const Sequelize = require('sequelize')
module.exports = class ChannelSetConfig extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        RoomId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Host: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Thumbnail: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        RoomCategory: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ChannelSetConfig',
        tableName: 'ChannelSetConfig',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
  static associate(db) {
    db.ChannelSetConfig.belongsTo(db.Channel, {
      foreignKey: 'RoomId',
    })
  }
}
