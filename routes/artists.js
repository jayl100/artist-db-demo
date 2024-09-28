const express = require('express')
const conn = require('../mariadb')
const {body, param, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const router = express.Router()
router.use(express.json())

// let artistEx = {
//     "id" : "id",
//     "email" : "newjeans@gmail.com",
//     "pw" : "password",
//     "artist" : "artist-name",
//     "debutDate" : "date"
// }

// 미들웨어 = 모듈 (파일 단위 모듈이 아닌 내부에서 사용할 모듈)
const validate = (req, res, next) => {
    const err = validationResult(req)
    if (err.isEmpty()) {
        return next()
    } else {
        return res.status(400).send(err.array())
    }
}

// 메인 ++++++++++++++++++++++++++++++++++++++++++++++++
router.get("/", function (req, res) {
    res.json({
        message: "Hello World!"
    })
})

// 회원가입 ++++++++++++++++++++++++++++++++++++++++++++++++
router.post('/join',
    body('email').notEmpty().isEmail().withMessage('email을 입력해주세요.'),
    body('password').notEmpty().isString().withMessage('password를 입력해주세요.'),
    validate,
    function (req, res) {

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
router.post('/login',
    body('email').notEmpty().isEmail().withMessage('email을 입력해주세요.'),
    body('password').notEmpty().isString().withMessage('password를 입력해주세요.'),
    validate,
    function (req, res) {
        const {email, password} = req.body;

        let sql = `SELECT * FROM artists WHERE email = ?`

        let values = [email]

        conn.query(
            sql, values,
            function (err, results) {
                let loginUser = results[0]
                if (loginUser && loginUser.password === password) {
                    // 토큰 발급
                    const token = jwt.sign({
                        email: loginUser.email,
                        name: loginUser.name
                    }, process.env.JWT_SECRET, {
                        expiresIn: '5m',
                        issuer: 'ljh',
                    })
                    res.cookie("token", token, {httpOnly: true})

                    res.status(200).json({
                        message: `${loginUser.artist} 님 로그인이 완료되었습니다.`,
                        token: token,
                    })

                } else if (err) {
                    console.error(err)
                    res.status(500).json({
                        message: 'Something went wrong!'
                    })
                } else {
                    res.status(403).json({
                        message: "회원 정보가 없습니다."
                    })
                }
            }
        )
    })

// 회원 개별 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/artists',
    body('email').notEmpty().isEmail().withMessage('email을 입력해주세요.'),
    validate,
    function (req, res) {
        let {email} = req.body

        let sql = `SELECT * FROM artists WHERE email = ?`
        let values = [email]
        conn.query(
            sql, values,
            function (err, results) {
                if (results.length) {
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

// 회원 개별 탈퇴 ++++++++++++++++++++++++++++++++++++++++++++++++
router.delete('/artists',
    body('email').notEmpty().isEmail().withMessage('email을 입력해주세요.'),
    validate,
    function (req, res) {
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


