const Sequelize = require('sequelize')
module.exports = class StoreProductDetail extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        Id: {
          type: Sequelize.INTEGER,
          autoIncrement: true, 
          primaryKey: true,
        },
        Name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        Price: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        StoreBrandId:  {
            type: Sequelize.INTEGER,
            allowNull: false,
            foreignKey: true
         },
         Stock: {
            type: Sequelize.INTEGER, 
            allowNull: false
         },
         Image: {
            type: Sequelize.STRING,
            allowNull: false 
         },
         Description: {
            type: Sequelize.STRING, 
            allowNull: false            
         },
         CategoryId: {
             type: Sequelize.INTEGER,
             allowNull: false,
             foreignKey: true 
         }
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'StoreProductDetail',
        tableName: 'StoreProductDetail',
        paranoid: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    )
    
  }  
  static associate(db) {
    db.StoreProductDetail.belongsTo(db.StoreBrand, {
      foreignKey: 'StoreBrandId',
    })
  }
  static associate(db) {
    db.StoreProductDetail.belongsTo(db.StoreProductCategory, {
      foreignKey: 'CategoryId',
    })
  }
}
