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

        let songs = []
        let {artistId} = req.body

        if (db.size && artistId) {
            db.forEach(function (value) {
                if (value.artistId === artistId) {
                    songs.push(value)
                }
            })
            if (songs.length) {
                res.status(200).json(songs)
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

        let title = req.body.title
        let artistId = req.body.artistId

        // 채널 명이 안맞으면 404
        // 채널 명이 맞고 유저 이름이 안맞으면 404
        // 채널 명이 맞고 유저 이름이 맞으면 200

        if (!title || !artistId) {
            res.status(404).send('Please check if the Channel Name or User ID is empty.')
        } else {
            db.set(id++, req.body)
            res.status(200).json({
                message: `${artistId}'s ${title} are successfully created!`
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

        let titleData = db.get(id)
        let oldTitleName = titleData.title
        let newTitleName = req.body.title

        if (!titleData) {
            channelNotFound(res)
        } else {
            if (!newTitleName) {
                res.status(404).send('Please check if the Channel Name is empty.')
            } else {

                titleData.channelName = newTitleName
                db.set(id, titleData)

                res.status(200).json({
                    message: `The channel name has been changed from ${oldTitleName} to ${newTitleName}.`
                })
            }
        }
    })



    // 채널 개별 삭제 ++++++++++++++++++++++++++++++++++++++++++++++++
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let titleData = db.get(id)

        if (!titleData) {
            channelNotFound(res)
        } else {
            db.delete(id)
            res.status(200).json({
                message: `${titleData.title} are successfully deleted!`
            })
        }
    })

    // 채널 개별 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let titleData = db.get(id)

        if (!titleData) {
            channelNotFound(res)
        } else {
            res.status(200).json({
                message: `${titleData.title} are exist`
            })
        }
    })

// 모듈 ++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router