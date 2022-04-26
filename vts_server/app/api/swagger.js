const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path')

const swaggerJsDoc = YAML.load(path.join(__dirname + '/api.yaml'))

module.exports = {
  swaggerUi,
  swaggerJsDoc,
}
