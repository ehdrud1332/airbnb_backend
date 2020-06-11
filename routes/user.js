const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const userModel = require('../model/user');
const passport = require('passport');

const checkAuth = passport.authenticate('jwt', {session: false});

// 회원가입
// @route POST http://localhost:2323/user/signup
// @desc user signup
// @access Public
router.post('/signup', (req, res) => {

    const { username, email, password } = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if(user) {
                return res.json({
                    msg: "다른 이메일로 부탁드립니다."
                });
            }

            const newUser = new userModel({
                username, email, password
            });

            newUser
                .save()
                .then(user => {
                    res.json({
                        mag: "회원가입 되었습니다.",
                        userInfo : user
                    });
                });
        })
        .catch(err => {
            res.json({
                error: err
            });
        });

});

// 로그인
// @route POST http://localhost:2323/user/login
// @desc user login
// @access Public
router.post('/login', (req, res) => {

    const {email, password} = req.body;

    userModel
        .findOne({email})
        .then(user => {
            if(!user) {
                return res.json({
                    msg: "fount not email"
                })
            }

            bcrypt
                .compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {

                        const payload = {id: user._id, name: user.username, email: user.email, avatar: user.avatar};
                        jwt.sign(
                            payload,
                            process.env.SECRET_KEY,
                            {expiresIn: 36000},
                            (err, token) => {

                                res.json({
                                    success: true,
                                    token: "Bearer " + token
                                });
                            }
                        );

                    } else {
                        res.json({
                            msg: "패스워드가 다릅니다."
                        });
                    }
                })
        })
        .catch(err => {
            res.json({
                error: err
            })
        })

});

//회원 정보
// @route GET http://localhost:2323/user
// @desc Current user
// @access Private
router.get('/', checkAuth, (req, res) => {
    res.json({
        userInfo : {
            id: req.user.id,
            name: req.user.username,
            email: req.user.email,
            avatar: req.user.avatar
        }
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
