const express = require('express')
// const app = express()
// app.listen(1000)
// app.use(express.json())

const router = express.Router()
router.use(express.json())

let db = new Map()
let id = 1

// let userEx = {
//     channelName : "channel-name"
// }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function channelNotFound (res) {
    res.status(404).json({message : 'Not Found'})
}

router
    .route('/')

    // 채널 전체 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
    .get((req, res) => {

        // 아이디에 해당하는 채널만 뿌리기
        // 아이디 스캔 = req.body.artistId
        // 채널 뿌리기 = db.forEach

        let channels = []
        let {artistId} = req.body

        if (db.size && artistId) {
            db.forEach(function (value) {
                if (value.artistId === artistId) {
                    channels.push(value)
                }
            })
            if (channels.length) {
                res.status(200).json(channels)
            } else {
                channelNotFound(res)
            }
        } else {
            channelNotFound(res)
        }
    })

    // 채널 개별 생성 ++++++++++++++++++++++++++++++++++++++++++++++++
    .post((req, res) => {
        // function isEmpty(obj) {
        //     return Object.keys(obj).length === 0;
        // }

        let channelName = req.body.channelName
        let artistId = req.body.artistId

        // 채널 명이 안맞으면 404
        // 채널 명이 맞고 유저 이름이 안맞으면 404
        // 채널 명이 맞고 유저 이름이 맞으면 200

        if (!channelName || !artistId) {
            res.status(404).send('Please check if the Channel Name or User ID is empty.')
        } else {
            db.set(id++, req.body)
            res.status(200).json({
                message: `${artistId}'s ${channelName} are successfully created!`
            })
        }
    })

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router
    .route('/:id')

    // 채널 개별 수정 ++++++++++++++++++++++++++++++++++++++++++++++++
    .put((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let channelData = db.get(id)
        let oldChannelName = channelData.channelName
        let newChannelName = req.body.channelName

        if (!channelData) {
            channelNotFound(res)
        } else {
            if (!newChannelName) {
                res.status(404).send('Please check if the Channel Name is empty.')
            } else {

                channelData.channelName = newChannelName
                db.set(id, channelData)

                res.status(200).json({
                    message: `The channel name has been changed from ${oldChannelName} to ${newChannelName}.`
                })
            }
        }
    })



    // 채널 개별 삭제 ++++++++++++++++++++++++++++++++++++++++++++++++
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let channelData = db.get(id)

        if (!channelData) {
            channelNotFound(res)
        } else {
            db.delete(id)
            res.status(200).json({
                message: `${channelData.channelName} are successfully deleted!`
            })
        }
    })

    // 채널 개별 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let channelData = db.get(id)

        if (!channelData) {
            channelNotFound(res)
        } else {
            res.status(200).json({
                message: `${channelData.channelName} are exist`
            })
        }
    })

// 모듈 ++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router