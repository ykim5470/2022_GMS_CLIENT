const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const path = require('path')

console.log('./swagger')

const options = {
  swaggerDefinition: {
    info: {
      titile: 'WebRTC API',
      version: '1.0.0',
      description: 'Test WebRTC API with express',
    },
    host: 'https://106.255.237.50:4000',
    basePath: '/api-docs',
  },
  apis: [path.join(__dirname + '../../src/apis/index.js'), './swagger/*'],
}

const specs = swaggerJsDoc(options)
module.exports = {
  swaggerUi,
  specs,
}
