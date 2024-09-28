const express = require('express')
const conn = require('../mariadb')
const {body, param, validationResult} = require('express-validator')

const router = express.Router()
router.use(express.json())

// 미들웨어 = 모듈 (파일 단위 모듈이 아닌 내부에서 사용할 모듈)
const validate = (req, res, next) => {
    const err = validationResult(req)
    if (err.isEmpty()) {
        return next()
    } else {
        return res.status(400).send(err.array())
    }
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    router
        .route('/')

        // 노래 전체 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
        .get(
            body('artistsId').notEmpty().isInt().withMessage('ArtistId를 입력해주세요.'),
            validate
            ,
            (req, res, next) => {
                let {artistsId} = req.body
                artistsId = parseInt(artistsId)
                let sql = `SELECT * FROM songs WHERE artistsId = ?`

                conn.query(
                    sql, artistsId,
                    function (err, results) {
                        if (results) {
                            res.status(200).json(results)
                        } else if (err) {
                            console.error("에러났다")
                            return res.status(500).send('내용을 다시 확인해주세요.').end()
                        } else {
                            res.status(404).send('잘못된 입력이 있습니다.')
                        }
                    }
                )
            })

        // 노래 개별 생성 ++++++++++++++++++++++++++++++++++++++++++++++++
        .post(
            body('title').notEmpty().isString().withMessage('title은 문자입력이 필요합니다.'),
            body('artistsId').notEmpty().isInt().withMessage('artistsId는 숫자가 필요합니다.'),
            validate
            ,
            (req, res) => {
                const {title, lyrics, releaseDate, playDate, artistsId} = req.body
                let sql = `INSERT INTO songs (title, lyrics, releaseDate, playDate, artistsId) VALUES (?, ?, ?, ?, ?)`
                let values = [title, lyrics, releaseDate, playDate, artistsId]

                conn.query(
                    sql, values,
                    function (err, results) {
                        if (results) {
                            res.status(201).json(results)
                        } else if (err) {
                            console.error("에러났다")
                            return res.status(500).send('내용을 다시 확인해주세요.').end()
                        } else {
                            res.status(404).send('잘못된 입력이 있습니다. 다시 확인해주세요.')
                        }
                    }
                )

            })

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

router
    .route('/:id')

    // 노래 개별 수정 ++++++++++++++++++++++++++++++++++++++++++++++++
    .put(
        param('id').notEmpty().isInt().withMessage('id가 필요합니다.'),
        body('name').notEmpty().isString().withMessage('노래이름이 필요합니다.'),
        validate
        ,
        (req, res) => {
            let {id} = req.params
            id = parseInt(id)

            let {newTitle} = req.body
            let sql = `UPDATE songs SET title = ? WHERE id = ?`
            let values = [newTitle, id]

            conn.query(
                sql, values,
                function (err, results) {
                    if (results) {
                        res.status(201).json(results)
                    } else if (err) {
                        console.error("에러났다")
                        return res.status(500).send('내용을 다시 확인해주세요.').end()
                    } else {
                        res.status(404).send('Please check if the song title or songs id is empty.')
                    }

                }
            )
        })


    // 노래 개별 삭제 ++++++++++++++++++++++++++++++++++++++++++++++++
    .delete(
        param('id').notEmpty().isInt().withMessage('채널 id가 필요합니다.'),
        validate
        ,
        (req, res) => {
            let {id} = req.params
            id = parseInt(id)

            let sql = `DELETE FROM songs WHERE id = ?`
            let values = [id]
            conn.query(
                sql, values,
                function (err, results) {
                    if (results) {
                        res.status(200).json(results)
                    } else if (err) {
                        console.error("에러났다")
                        return res.status(500).send('내용을 다시 확인해주세요.').end()
                    } else {
                        res.status(404).send("해당 노래는 존재하지 않습니다.")
                    }
                }
            )
        })

    // 노래 개별 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
    .get(
        param('id').notEmpty().isInt().withMessage('채널 id가 필요합니다.'),
        validate
        ,
        (req, res) => {
            let {id} = req.params
            id = parseInt(id)

            conn.query(
                `SELECT * FROM songs WHERE id = ?`, id,
                function (err, results) {
                    if (results.length) {
                        res.status(200).json(results)
                    } else if (err) {
                        console.error("에러났다")
                        return res.status(500).send('내용을 다시 확인해주세요.').end()
                    } else {
                        res.status(404).send('Please check if the song id is empty.')
                    }
                }
            )
        })

// 모듈 ++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router