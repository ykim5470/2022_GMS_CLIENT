const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./config')[env]

const Channel = require('./webrtc/channel')
const ChannelSetConfig = require('./webrtc/channel_set_config')
const ChannelRecordManagementConfig = require('./webrtc/channel_record_management_conifg')
const ChannelProductConfig = require('./webrtc/channel_product_set_config')
const ChannelLikeLog = require('./webrtc/channel_like_log')
const ChannelChatLog = require('./webrtc/channel_chat_log')
const ChannelConcurrentUserLog = require('./webrtc/channel_ccu_log')


const StoreBrand = require('./commerce/store_brand')
const StoreProductDetail = require('./commerce/store_product_detail')
const StoreProductCategory = require('./commerce/store_product_category')

const User = require('./users/user')



const db = {}
const sequelize = new Sequelize(
  config.database, 
  config.username, 
  config.password,
  config  
)

fs.readdirSync(__dirname).forEach((model) => {
  if (['index.js', '_migrations'].indexOf(model) !== -1) return
  const modelFilePath = path.join(__dirname, model, 'index.js')
  if (fs.existsSync(modelFilePath) && fs.lstatSync(modelFilePath).isFile()) {
    model = require(modelFilePath)(sequelize, DataTypes)
    db[model.name] = model
  }
})

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Channel = Channel
db.ChannelSetConfig = ChannelSetConfig
db.ChannelRecordManagementConfig = ChannelRecordManagementConfig
db.ChannelProductConfig = ChannelProductConfig
db.ChannelLikeLog = ChannelLikeLog
db.ChannelChatLog = ChannelChatLog
db.ChannelConcurrentUserLog = ChannelConcurrentUserLog


db.StoreBrand = StoreBrand
db.StoreProductDetail = StoreProductDetail
db.StoreProductCategory = StoreProductCategory

db.User = User



Channel.init(sequelize)
ChannelSetConfig.init(sequelize)
ChannelRecordManagementConfig.init(sequelize)
ChannelProductConfig.init(sequelize)
ChannelLikeLog.init(sequelize)
ChannelChatLog.init(sequelize)
ChannelConcurrentUserLog.init(sequelize)

StoreBrand.init(sequelize)
StoreProductDetail.init(sequelize)
StoreProductCategory.init(sequelize)


User.init(sequelize)


Channel.hasMany(ChannelSetConfig, {
  foreignKey: 'RoomId',
  as: 'setConfig',
  onDelete: 'cascade',
})

Channel.hasMany(ChannelRecordManagementConfig, {
  foreignKey: 'RoomId',
  onDelete: 'cascade',
})
Channel.hasMany(ChannelProductConfig, {
  foreignKey: 'RoomId',
  onDelete: 'cascade',
})

Channel.hasMany(ChannelLikeLog, {
  foreignKey: 'RoomId',
  onDelete: 'cascade',
})

Channel.hasMany(ChannelChatLog, {
  foreignKey: 'RoomId',
  onDelete: 'cascade',
})
Channel.hasMany(ChannelConcurrentUserLog, {
  foreignKey: 'RoomId',
  onDelete: 'cascade',
})


StoreBrand.hasOne(StoreProductDetail, {
  foreignKey: 'StoreBrandId',
  onDelete: 'cascade'
})

StoreProductCategory.hasOne(StoreProductDetail, {
  foreignKey: 'CategoryId',
  onDelete: 'cascade'
})
module.exports = db
