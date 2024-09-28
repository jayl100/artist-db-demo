let jwt = require("jsonwebtoken");
let dotenv = require("dotenv");

dotenv.config();

// 서명 = 토큰 발행
let token = jwt.sign({foo : 'bar'}, process.env.PRIVATE_KEY);
// token 생성 = jwt 서명을 했다. (페이로드, 나만의 암호키) + SHA256
console.log(token);


// 검증
// 검증 성공 시, 페이로드 값을 확인할 수 있다.
let decoded = jwt.verify(token, process.env.PRIVATE_KEY);
console.log(decoded);
// { foo: 'bar', iat: 1727520706 }
// iat = 발행된 시간