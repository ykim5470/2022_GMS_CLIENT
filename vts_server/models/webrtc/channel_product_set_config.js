const Sequelize = require('sequelize')
module.exports = class ChannelProductSetConfig extends Sequelize.Model {
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
        StorePath: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        StoreCategory: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        StoreId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        ProductId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ChannelProductSetConfig',
        tableName: 'ChannelProductSetConfig',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
}
