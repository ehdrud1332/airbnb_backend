const express = require('express');
const router = express.Router();

// 회원가입
// @route POST http://localhost:2323/user/signup
// @desc user signup
// @access Public
router.post('/signup', (req, res) => {
    res.json({
        msg: "회원가입 성공."
    });
});

// 로그인
// @route POST http://localhost:2323/user/login
// @desc user login
// @access Public
router.post('/login', (req, res) => {
    res.json({
        msg: "로그인성공."
    });
});

//회원 정보
// @route GET http://localhost:2323/user
// @desc user get all
// @access Private
router.get('/', (req, res) => {
    res.json({
        msg: "정보 불러오기 성"
    });
});

//회원정보수정
// @route GET http://localhost:2323/user
// @desc user Update
// @access Private
router.patch('/', (req, res) => {
    res.json({
        msg: "회원 정보수정 성공."
    });
});

//회원탈퇴
// @route GET http://localhost:2323/user
// @desc user delete
// @access Private
router.delete('/', (req, res) => {
    res.json({
        msg: "회원탈퇴."
    })
})

module.exports = router;
