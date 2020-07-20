const express = require('express');
const router = express.Router();
const userModel = require('../model/user');
const roomsModel =require('../model/room');
const multer = require('multer');


const storage = multer.diskStorage({
    //저장하
    destination: function(req, file, cb) {
        cb(null, './upload/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1025 * 5
    },
    fileFilter: fileFilter
});


router.get('/total', (req, res) => {

    roomsModel
        .find()
        .then(docs => {
            const response = {
                // count: docs.length,
                results : docs.map(doc => {
                    return{
                        id : doc._id,
                        name: doc.name,
                        price: doc.price,
                        isFav: doc.isFav,
                        isSuperHost: doc.isSuperHost,
                        photos: doc.photos
                    }
                })
            }
            res.json(docs)
        })
        .catch(err => {
            res.json({
                msg: err.message
            })
        })
})

// @route POST http://localhost:2323/rooms/roompost
// @desc room Posting
// @access private 'admin'
router.post('/roompost', upload.single('photos'), (req, res) => {

    // userModel
    //     .findById(req.user.id)
    //     .then(user => {
    //
    //         if(user.role !== "admin") {
    //             return res.json({
    //                 msg: "관리자가 아니다."
    //             })
    //         }

            const newRoom = new roomsModel({
                // admin : req.user.id,
                photos: req.file.path,
                name: req.body.name,
                price: req.body.price,
                isFav: req.body.isFav,
                isSuperHost: req.body.isSuperHost
            });
            newRoom
                .save()
                .then(result => {
                    res.json({
                        msg: "등록 되었습니다.",
                        roomInfo: result
                    });
                })
                .catch(err => {
                    res.json({
                        err: err.message
                    })
                })
        // })
        // .catch(err => {
        //     res.json({
        //         err : err.message
        //     })
        // })
});

// @route DELETE http://localhost:2323/room
router.delete('/:roomID', (req, res) => {

    const id = req.params.roomsID;

    userModel
        .findById(req.user.id)
        .then(user => {
            if(user.role !== "admin") {
                return res.json({
                    msg: "관리자가 아닙니다."
                });
            }
            roomsModel
                .findByIdRemove(id)
                .then(result => {
                    res.json({
                        msg: "방이 삭제되었습ㄴ디ㅏ."
                    });
                })


        })
        .catch(err => {
            res.json({
                msg : err.message
            })
        })
})

module.exports = router;
