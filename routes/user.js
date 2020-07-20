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

    const { firstName, lastName, email, password } = req.body;
//     console.log(req.body)
    userModel
        .findOne({email})
        .then(user => {

            console.log(user)
            if(user) {
                return res.json({
                    msg: "다른 이메일로 부탁드립니다."
                });
            }

            const newUser = new userModel({
               firstName, lastName, email, password
            });

            newUser
                .save()
                .then(user => {
                    res.json({
                        mag: "회원가입 되었습니다.",
                        userInfo : user
                    });
                });:
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

// 구글 로그인.
// @route GET http://localhost:2323/user/google
// @desc google login
// @access Public
router.get('/google', passport.authenticate("googleToken", {session: false}), (req, res) => {

    const payload = {id: req.user._id, name: req.user.google.name, email: req.user.google.email, avatar: req.user.google.avatar};

    jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {expiresIn: 36000},
        (err, token) => {
            res.json({
                success : true,
                tokenInfo: "Bearer " + token
            })
        }
    )
});

// 페이스북 로그인.
// @route GEt http://localhost:2323/user/facebook
// desc facebook login
// @access public
router.get('/facebook', passport.authenticate("facebookToken", {session: false}), (req, res) => {
    console.log(req.user);

    const payload = {id: req._id, name: req.user.facebook.name, email: req.user.facebook.email, avatar: req.user.facebook.avatar};

    jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {expiresIn: 36000},
        (err, token) => {
            res.json({
                success: true,
                tokenInfo: "Bearer " + token
            })
        }
    )
});


//회원 정보
// @route GET http://localhost:2323/user
// @desc Current user
// @access Private
router.get('/', checkAuth, (req, res) => {
    res.json({
        userInfo: req.user
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
router.delete('/', checkAuth, (req, res) => {

    userModel
        .findByIdAndDelete(req.user.id)
        .then(result => {
            res.json({
                msg: "계정이 삭제가 완료되었습니다."
            });
        })
        .catch(err => {
            res.json({
                error: err
            })
        })
})

module.exports = router;
