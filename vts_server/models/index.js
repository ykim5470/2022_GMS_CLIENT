const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require('./config')[env]
const moment = require('moment')

const Channel = require('./webrtc/channel')

const db = {}
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
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

Channel.init(sequelize)

module.exports = db
