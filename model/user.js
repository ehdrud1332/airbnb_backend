const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bcrypt =  require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "admin"
        },
            firstName: {
               type: String,
            },
            lastName: {
                type: String
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
    {
        timestamps: true
    }
);

userSchema.pre("save", async function (next) {
    try {
        console.log('enter')

        const avatar = await gravatar.url(this.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        this.avatar = avatar;

        const salt = await bcrypt.genSalt(10);
        // bcrypt.hash : hash로 변환된 코드를 받을 수 있다.
        const passwordHash = await bcrypt.hash(this.password, salt);

        this.password = passwordHash;
        console.log('exited');
        next();
    } catch {
        next(error);
    }
});

module.exports = mongoose.model("user", userSchema);
