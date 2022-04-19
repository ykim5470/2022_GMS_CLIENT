const Sequelize = require('sequelize')
module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        User: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Role: {
          type: Sequelize.TIME,
          allowNull: false,
        },
        Msg: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'User',
        tableName: 'User',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
  }
}
