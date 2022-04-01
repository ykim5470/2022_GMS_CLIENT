'use strict'

const express = require('express')
const { v4: uuidV4 } = require('uuid')
const router = express.Router()

const multerSet = require('../middle/multer')
const Models = require('../../../models')

router.get('/joinRoom', (req, res) => {
  const randomRoomId = uuidV4()
  try {
    return res.status(200).json({ data: randomRoomId })
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
  const { title, host, roomId } = req.body
  const { fieldname, originalname, destination, filename, path, size } =
    req.file
  await Models.Channel.create({
    title: title,
    host: host,
    roomId: roomId,
    thumbnail: path,
  }).then((result) => {
    return result
  })

  res.status(200)
})

module.exports = router
