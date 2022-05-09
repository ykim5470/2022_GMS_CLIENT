const Sequelize = require('sequelize');
module.exports = class zLog extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          // id 및 email
          type: Sequelize.STRING(40),
          allowNull: false,
          unique: false,
        },
        ip: {
          // 접속정보
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        osName: {
          // 접속정보
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        osVersion: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        deviceType: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        deviceVendor: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        deviceModel: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        browserName: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        browserVersioon: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        browserMajor: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        engineName: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        engineVersion: {
          //
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        cpuArchitecture: {
          //
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'ZLog',
        tableName: 'zLog',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }
  static associate(db) {
    db.UserPw.belongsTo(db.User);
  }
};