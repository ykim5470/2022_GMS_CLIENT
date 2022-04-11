'use strict'

const express = require('express')
const { v4: uuidV4 } = require('uuid')
const router = express.Router()

const multerSet = require('../middle/multer')
const Models = require('../../../models')

/**
 * @swagger
 *  /createRoomNumber:
 *    get:
 *      tags:
 *      - Create a unique random Room name
 *      description: 고유 방 이름 생성
 *      produces:
 *       - application/json
 *      parameters:
 *      - in: query
 *        name: roomId
 *        required: true
 *        description: random room id
 *      schema:
 *        type: UUID
 *        description: 방이름
 *      responses:
 *        200:
 *          description: 방 이름 조회 성공
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '../../api/swagger/createRoomNumber.yaml#/components/schemas/createRoomNumber'
 */
router.get('/createRoomNumber', (req, res) => {
  const randomRoomId = uuidV4()
  try {
    return res.status(200).json({ roomId: randwomRoomId })
  } catch (err) {
    return res.status(404).json(err)
  }
})

router.get('/roomList', async (req, res) => {
  const contents = await Models.Channel.findAll({
    attributes: ['title', 'host', 'roomId', 'thumbnail'],
  }).then((result) => {
    return result
  })

  res.status(200).json(contents)
})

/**
 * @param {req.body} - title, host, roomId
 * @param {req.file} - thumbnail data
 */
router.post('/roomCreate', multerSet.single('thumbNail'), async (req, res) => {
  const {
    title,
    host,
    roomId,
    roomCategory,
    storePath,
    storeCategory,
    storeId,
    productId,
  } = req.body
  const { fieldname, originalname, destination, filename, path, size } =
    req.file

  await Models.Channel.create({
    RoomId: roomId,
  })

  await Models.ChannelSetConfig.create({
    RoomId: roomId,
    Title: title,
    Host: host,
    Thumbnail: path,
    RoomCategory: roomCategory,
  }).then((result) => {
    return result
  })

  await Models.ChannelProductConfig.create({
    RoomId: roomId,
    StorePath: storePath,
    StoreCategory: storeCategory,
    StoreId: storeId,
    ProductId: productId,
  })

  res.status(200)
})

module.exports = router
