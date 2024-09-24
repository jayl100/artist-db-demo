const express = require('express')
const conn = require('../mariadb')
// const app = express()
// app.listen(1000)
// app.use(express.json())

const router = express.Router()
router.use(express.json())

let db = new Map()
let id = 1

// mariadb 연결
// /* GET users listing. */
// router.get('/', function (req, res, next) {
//     res.send('respond with a resource');
// });
// conn.query(
//     `SELECT * FROM artists WHERE email = ${email}`,
//     function (err, results, fields) {
//         console.log(results);
//         res.status(200).json(results)
//     }
// )

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
    console.log(id, req.body)
    // let artistId = req.body.artistId
    // let pw = req.body.password

    const {email, artist} = req.body

    if (email && artist) {
        db.set(email, req.body)

        res.status(201).json({
            message: `${db.get(email).artist} 님 회원가입을 환영합니다.`
        })
    } else {
        res.status(400).json({
            message: `입력 값을 다시 확인해주세요.`
        })

    }
})

// 로그인 ++++++++++++++++++++++++++++++++++++++++++++++++
router.post('/login', function (req, res) {
    const {email, pw} = req.body;

    if (email && pw) {
        const user = db.get(email)
        if (user && user.pw === pw) {
            res.status(200).json({
                message: "로그인에 성공하였습니다."
            })
        } else {
            res.status(404).json({
                message: "아이디와 비밀번호를 확인해주세요."
            })
        }
    } else {
        res.status(400).json({
            message: "아이디와 비밀번호를 확인해주세요."
        })
    }
})

// 회원 개별 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
router.get('/artists', function (req, res) {
    let {email} = req.body

    const user = db.get(email)
    if (user) {
        res.status(200).json({
            artist: user.artist,
            debutDate: user.debutDate
        })
    } else {
        res.status(404).json({
            message: "회원 정보가 없습니다."
        })
    }
})

// 회원 개별 탈퇴 ++++++++++++++++++++++++++++++++++++++++++++++++
router.delete('/artists', function (req, res) {
    // let {email} = req.params
    const {email} = req.body

    const user = db.get(email)
    if (user) {
        db.delete(email)
        res.status(200).json({
            message: `${user.artist}님 다음에 또 뵙겠습니다.`
        })
    } else {
        res.status(404).json({
            message: "회원 정보가 없습니다."
        })
    }
})

// 모듈화 ++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router


