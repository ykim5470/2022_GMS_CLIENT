const Sequelize = require('sequelize')
module.exports = class Channel extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        host: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        roomId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        thumbnail: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Channel',
        tableName: 'channel',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
}
