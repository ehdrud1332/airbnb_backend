const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt =  require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        method : {
            type: String,
            enum: ['local', 'google', 'facebook'],
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },

        local : {
            name: {
               type: String,
                },
            email: {
                type: String,
                lowercase: true
            },
            password: {
                type: String,
            },
            avatar: {
                type: String
            }
        },
         google : {
            name: {
               type: String,
                },
            email: {
                type: String,
                lowercase: true
            },
            password: {
                type: String,
            },
            avatar: {
                type: String
            }
        },
         facebook : {
            name: {
               type: String,
                },
            email: {
                type: String,
                lowercase: true
            },
            password: {
                type: String,
            },
            avatar: {
                type: String
            }
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    try {
        console.log('enter')
        if (this.method !== 'local') {
            next();
        }

        const avatar = await gravatar.url(this.loacl.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        this.local.avatar = avatar;

       const salt = await bcrypt.genSalt(10);
       // bcrypt.hash : hash로 변환된 코드를 받을 수 있다.
       const passwordHash = await bcrypt.hash(this.local.password, salt);

       this.local.password = passwordHash;
       console.log('exited');
       next();
        } catch {
            next(error);
        }
});

module.exports = mongoose.model("user", userSchema);
