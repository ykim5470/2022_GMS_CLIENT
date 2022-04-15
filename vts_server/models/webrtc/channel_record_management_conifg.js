const Sequelize = require('sequelize')
module.exports = class ChannelRecordManagementConfig extends Sequelize.Model {
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
        Media: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        FileSize: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Thumbnail: {
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
        RoomCategory: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        IsActivate: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ChannelRecordManagementConfig',
        tableName: 'ChannelRecordManagementConfig',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
  static associate(db) {
    db.ChannelRecordManagementConfig.belongsTo(db.Channel)
  }
}
