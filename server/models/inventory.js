const mongoose = require('mongoose')
const Schema = mongoose.Schema

inventorySchema = mongoose.Schema({
    product:{
        required: true,
        type: Schema.Types.ObjectId,
        ref: "Product",
    }
    ,
    quantity: {
        type: Number,
        default: 0
    },
})

const Inventory = mongoose.model("Inventory", inventorySchema)
module.exports = { Inventory }
