const { UUIDV4 } = require('sequelize')
const Sequelize = require('sequelize')
module.exports = class Channel extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Id: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: UUIDV4,
        },
        RoomId: {
          type: Sequelize.STRING,
          allowNull: false,
          primaryKey: true,
        },
        AirTime: {
          type: Sequelize.TIME,
          allowNull: true,
        },
        IsActivate: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Channel',
        tableName: 'Channel',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
}
