const mongoose = require('mongoose')
const Schema = mongoose.Schema

productSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        default: null
    }
    ,
    price: {
        type: Number,
        default: 0
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model("Product", productSchema)
module.exports = { Product }
