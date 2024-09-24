const express = require('express')
const conn = require('../mariadb')

const router = express.Router()
router.use(express.json())

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router
    .route('/')

    // 채널 전체 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
    .get((req, res) => {
        conn.query(
            `SELECT * FROM songs;`,
            function (err, results) {
                if (results) {
                    res.status(200).json(results)
                } else if (err) {
                    console.error(err)
                    res.status(500).json({
                        message: 'Something went wrong!'
                    })
                } else {
                    res.status(404).json({
                        message: `Not Found`,
                    })
                }
            }
        )
    })

    // 채널 개별 생성 ++++++++++++++++++++++++++++++++++++++++++++++++
    .post((req, res) => {
        const {title, lyrics, relaseDate, playDate, artistsId} = req.body
        if (title || artistsId) {
            conn.query(
                `INSERT INTO songs (title, lyrics, relaseDate, playDate, artistsId) VALUES (?, ?, ?, ?, ?)`, [title, lyrics, relaseDate, playDate, artistsId],
                function (err, results) {
                    if (results) {
                        res.status(201).json(results)
                    } else {
                        res.status(404).send('Please check if the Channel Name or User ID is empty.')
                    }
                }
            )
        }
    })

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router
    .route('/:id')

    // 채널 개별 수정 ++++++++++++++++++++++++++++++++++++++++++++++++
    .put((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let newTitle = req.body.title

        conn.query(
            `UPDATE songs SET title = ? WHERE id = ?`, [newTitle, id],
            function (err, results) {
                if (results) {
                    res.status(201).json(results)
                } else {
                    res.status(404).send('Please check if the song title or songs id is empty.')
                }

            }
        )
    })


    // 채널 개별 삭제 ++++++++++++++++++++++++++++++++++++++++++++++++
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        conn.query(
            `DELETE FROM songs WHERE id = ?`, id,
            function (err, results) {
                if (results) {
                    res.status(200).json(results)
                } else if (err) {
                    console.error(err)
                    res.status(500).json({
                        message: 'Something went wrong!'
                    })
                } else {
                    res.status(404).json({
                        message: "해당 노래는 존재하지 않습니다."
                    })
                }
            }
        )
    })

    // 채널 개별 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
    .get((req, res) => {

        let {id} = req.params
        id = parseInt(id)

        conn.query(
            `SELECT * FROM songs WHERE id = ?`, id,
            function (err, results) {
                if (results.length) {
                    res.status(200).json(results)
                } else {
                    res.status(404).json({
                        message: "채널의 정보가 없습니다."
                    })
                }
            }
        )
    })

// 모듈 ++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router