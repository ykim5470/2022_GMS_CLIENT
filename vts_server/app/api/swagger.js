const swaggerUi = require('swagger-ui-express')
// const swaggerJsDoc = require('swagger-jsdoc')
const YAML = require('yamljs')
const path = require('path')

// console.log(path.join(__dirname + '/'))

const swaggerJsDoc = YAML.load(path.join(__dirname + '/api.yaml'))

const testSwaggerJsDoc = YAML.load(path.join(__dirname + '/test_api.yaml'))

// console.log( path.join(__dirname + '../../src/apis/swagger/*.yaml'))

// const options = {
//   swaggerDefinition: {
//     info: {
//       titile: 'WebRTC API',
//       version: '1.0.0',
//       description: 'Test WebRTC API with express',
//     },
//     host: 'https://106.255.237.50:4000',
//     basePath: '/api-docs',
//     paths: {$ref : path.join(__dirname + '../../src/apis/swagger/createRoomNumber.yaml')}
//   },
 
//   apis: [path.join(__dirname + '../../src/apis/*.js')],
// }

// const specs = swaggerJsDoc(options)
module.exports = {
  swaggerUi,
  swaggerJsDoc,
  testSwaggerJsDoc
}
