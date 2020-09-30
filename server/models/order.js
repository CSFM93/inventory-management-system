const mongoose = require('mongoose')
const Schema = mongoose.Schema

orderSchema = mongoose.Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        default: null
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    quantity: {
        type: Number,
        default: 0
    },
    total:{
        type: Number,
        default: 0
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

const Order = mongoose.model("Order", orderSchema)
module.exports = { Order }
