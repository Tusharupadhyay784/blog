const {
    createHmac, randomBytes
} = require('crypto'); // making the password secret or hash
const { Schema, model } = require('mongoose');
const { createTokenForUser } = require('../services/authentication');
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    salt: {
        type: String
        // required: true,
    },
    password: {
        type: String,
        required: true

    },
    profileImageUrl: {
        type: String,
        default: '/images/default.png'
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER"
    }
})
// below is the pre hook by mongo DB
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    // const salt = "SomeRandomValue";
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest('hex');

    this.salt = salt;
    this.password = hashedPassword;
    next();
})

// below is a virtual function
userSchema.static('matchPasswordAndGenerateToken', async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not Found");
    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHash = createHmac('sha256', salt).update(password).digest('hex');
    if (hashedPassword !== userProvidedHash) throw new Error('Incorrect Password');
    // return { ...user, password: undefined, salt: undefined };
    const token = createTokenForUser(user);
    return token;

})
const User = model('user', userSchema);
module.exports = User;