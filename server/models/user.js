const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name:{
        required: true,
        type: String,
    },
    username:{
        required: true,
        type: String,
    },
    email:{
        required: true,
        type: String,
    },
    phoneNumber:{
        required: true,
        type: String,
    }
})

const User = mongoose.model("User",userSchema)
module.exports = { User }