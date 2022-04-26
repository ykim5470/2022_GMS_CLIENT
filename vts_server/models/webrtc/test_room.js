const Sequelize = require('sequelize')
module.exports = class Room extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,   
        },
        Image: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Room: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'test'
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Room',
        tableName: 'Room',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
}
