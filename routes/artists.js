const express = require('express')
const conn = require('../mariadb')

const router = express.Router()
router.use(express.json())

// let artistEx = {
//     "id" : "id",
//     "email" : "newjeans@gmail.com",
//     "pw" : "password",
//     "artist" : "artist-name",
//     "debutDate" : "date"
// }

// 메인 ++++++++++++++++++++++++++++++++++++++++++++++++
router.get("/", function (req, res) {
    res.json({
        message: "Hello World!"
    })
})
// 회원가입 ++++++++++++++++++++++++++++++++++++++++++++++++
router.post('/join', function (req, res) {

    const {email, artist, password, debutDate} = req.body

    let sql = `INSERT INTO artists (email, password, artist, debutDate) VALUES (?, ?, ?, ?)`
        let values = [email, password, artist, debutDate]
    if (email && artist && password && debutDate) {
        conn.query(
            sql, values,
            function (err, results) {
                if (results) {
                    res.status(201).json(results)
                } else if (err) {
                    console.error(err)
                    res.status(500).json({
                        message: 'Something went wrong!'
                    })
                } else {
                    res.status(400).json({
                        message: `입력 값을 다시 확인해주세요.`
                    })
                }
            }
        )
    }
})

// 로그인 ++++++++++++++++++++++++++++++++++++++++++++++++
router.post('/login', function (req, res) {
    const {email, password} = req.body;

    let sql = `SELECT * FROM artists WHERE email = ?`

    let values = [email]

    conn.query(
        sql, values,
        function (err, results) {
            let loginUser = results[0]
            if (loginUser) {
                if (loginUser.password === password) {
                    res.status(200).json({
                        message: `${loginUser.artist} 님 로그인이 완료되었습니다.`
                    })
                } else {
                    res.status(400).json({
                        message: "로그인이 실패했습니다."
                    })
                }
            } else if (err) {
                console.error(err)
                res.status(500).json({
                    message: 'Something went wrong!'
                })
            } else {
                res.status(404).json({
                    message: "회원 정보가 없습니다."
                })
            }
        }
    )
})

// 회원 개별 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/artists', function (req, res) {
    let {email} = req.body

    let sql = `SELECT * FROM artists WHERE email = ?`
    let values = [email]
    conn.query(
        sql, values,
        function (err, results) {
            if (results.length) {
                res.status(200).json(results)
            } else {
                res.status(404).json({
                    message: "회원 정보가 없습니다."
                })
            }
        }
    )
})

// 회원 개별 탈퇴 ++++++++++++++++++++++++++++++++++++++++++++++++
router.delete('/artists', function (req, res) {
    const {email} = req.body

    let sql = `DELETE FROM artists WHERE email = ?`
    let values = [email]
    conn.query(
        sql, values,
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
                    message: "회원 정보가 없습니다."
                })
            }
        }
    )

})

// 모듈화 ++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router


