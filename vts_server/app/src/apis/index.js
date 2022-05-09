'use strict'

const express = require('express')
const passport = require('../middle/passport')
const { v4: uuidV4 } = require('uuid')
const router = express.Router()

const liveThumbnailMulterSet = require('../middle/multer/liveThumbnailMulter')
const recResourceUpload = require('../middle/multer/recUploadMulter')
const fileSizeFormatter = require('../helpers/fileUploaderController')
const Models = require('../../../models')


router.get('/createRoomNumber', (req, res) => {
  console.log(req.session)
  const randomRoomId = uuidV4()
  try {
    return res.status(200).json({ roomId: randomRoomId })
  } catch (err) {
    return res.status(404).json(err)
  }
})


router.get('/guideRoomList', async (req, res) => {

   let roomList = await Models.Channel.findAll({
   include: [
     {
       model: Models.ChannelSetConfig,
       as: 'setConfig',
       attributes: ['Title', 'Host', 'Thumbnail', 'RoomCategory', 'CreatedAt']
     }
   ],
   attributes: ['RoomId']
  })

  const roomListObject = JSON.parse(JSON.stringify(roomList, null, 2))


  res.status(200).json(roomListObject)

})

router.get('/roomList', async (req, res) => {
  let roomList = await Models.Channel.findAll({
  include: [
    {
      model: Models.ChannelSetConfig,
      as: 'setConfig',
      attributes: ['Title', 'Host', 'Thumbnail', 'RoomCategory', 'CreatedAt']
    }
  ],
  where:{IsActivate: 1},
  attributes: ['RoomId']
 })

 const roomListObject = JSON.parse(JSON.stringify(roomList, null, 2))


 res.status(200).json(roomListObject)
})



router.post('/roomCreate', liveThumbnailMulterSet.single('thumbnail'), async (req, res) => {
  try{
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
    Thumbnail: filename,
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

  res.status(200).json('roomCreate sucess')
}catch(err){
  res.status(400).json(err)
}
})


router.post('/createChatLog', async(req,res) =>{
 try{
	const {RoomId, User, Text} = req.body
	await Models.ChannelChatLog.create({
		RoomId: RoomId,
		User: User,
		Text: Text
	})
	res.status(200).json('Chat log added')
	}catch(err){
	res.status(400).json(err)}
 })


router.post('/recordMediaUpload',recResourceUpload.array('resources',  2), async(req,res)=>{
  try{
    const {roomId, title, host, roomCategory} = req.body
    
    let filesArray = []
    req.files.forEach(el => {
      const file = {
        fileName: el.originalname,
        filePath: el.path,
        fileType: el.mimetype, 
        fileSize: fileSizeFormatter(el.size,2)
      }
      filesArray.push(file)
    })
    
    let thumbnail = {}
    let media = {}
    if(filesArray.length !== 2){
      throw Error('Invalid upload count')
    }else{
      filesArray.map((el,idx) => {
        if(el.fileType.split('/')[0] === 'image') {return thumbnail = {...filesArray[idx]}}
        if(el.fileType.split('/')[0] === 'video')  {return media = {...filesArray[idx]}}
      })
    }
    
    await Models.ChannelRecordManagementConfig.create({
      RoomId: roomId,
      Media: media.fileName,
      FileSize: media.fileSize,
      Thumbnail: thumbnail.fileName,
      Title: title, 
      Host: host,
      RoomCategory:roomCategory,
    })

    
  res.status(200).json('recordMediaUpload success')
  }catch(err){
    console.log(err)
    res.status(400).json(err)
  }
})


router.post('/guideLogin',passport.authenticate('local'),(req,res,next)=>{
  try{
    res.status(200).json({token: req.session.passport.user})
  }catch(err){
    console.error(err)
  }
})

module.exports = router
