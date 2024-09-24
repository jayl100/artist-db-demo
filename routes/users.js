// const express = require('express')
// const conn = require('../mariadb')
// // const app = express()
// // app.listen(1000)
// // app.use(express.json())
//
// const router = express.Router()
// router.use(express.json())
//
// let db = new Map()
// let id = 1
//
// /* GET users listing. */
// router.get('/', function(req, res, next) {
//     res.send('respond with a resource');
// });
//
// // A simple SELECT query
// conn.query(
//     'SELECT * FROM `songs`',
//     function (err, results, fields) {
//         console.log(results); // results contains rows returned by server
//     }
// );
//
// // let userEx = {
// //     "artistId" : "id",
// //     "pw" : "password",
// //     "name" : "user-name"
// // }
//
// // 메인 ++++++++++++++++++++++++++++++++++++++++++++++++
// router.get("/", function (req, res) {
//     res.json({
//         message: "Hello World!"
//     })
// })
//
//
// // 회원가입 ++++++++++++++++++++++++++++++++++++++++++++++++
// router.post('/join', function (req, res) {
//     console.log(id, req.body)
//     // let artistId = req.body.artistId
//     // let pw = req.body.password
//
//     if (req.body === {}) {
//         res.status(400).json({
//             message: `입력 값을 다시 확인해주세요.`
//         })
//     } else {
//         const {artistId} = req.body
//         db.set(artistId, req.body)
//
//         res.status(201).json({
//             message: `${db.get(artistId).name} 님 회원가입을 환영합니다.`
//         })
//     }
// })
//
//
// // 로그인 ++++++++++++++++++++++++++++++++++++++++++++++++
// router.post('/login', function (req, res) {
//     const {artistId, email} = req.body;
//
//     if (artistId || email) {
//         db.forEach(function (value) {
//             if (value.artistId === artistId && value.email === email) {
//                 res.status(200).json({
//                     message : "로그인에 성공하였습니다."
//                 })
//             } else {
//                 res.status(404).json({
//                     message : "아이디와 비밀번호를 확인해주세요."
//                 })
//             }
//         })
//     } else {
//         res.status(404).json({
//             message : "아이디와 비밀번호를 확인해주세요."
//         })
//     }
// })
//
//
// router
//     .route('/users')
//
//     // 회원 개별 조회 ++++++++++++++++++++++++++++++++++++++++++++++++
//     .get(function (req, res) {
//         let {artistId} = req.body
//
//         const user = db.get(artistId)
//         if (user) {
//             res.status(200).json({
//                 artistId: user.artistId,
//                 name: user.name
//             })
//         } else {
//             res.status(404).json({
//                 message: "회원 정보가 없습니다."
//             })
//         }
//     })
//
//     // 회원 개별 탈퇴 ++++++++++++++++++++++++++++++++++++++++++++++++
//     .delete(function (req, res) {
//         let {artistId} = req.params
//         id = parseInt(artistId)
//
//         const user = db.get(artistId)
//         if (user) {
//             db.delete(artistId)
//
//             res.status(200).json({
//                 message: `${user.name}님 다음에 또 뵙겠습니다.`
//             })
//         } else {
//             res.status(404).json({
//                 message: "회원 정보가 없습니다."
//             })
//         }
//     })
//
// // 모듈화 ++++++++++++++++++++++++++++++++++++++++++++++++
// module.exports = router