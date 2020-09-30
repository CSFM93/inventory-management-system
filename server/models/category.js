const mongoose = require('mongoose')
const Schema = mongoose.Schema

categorySchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
})

const Category = mongoose.model("Category", categorySchema)
module.exports = { Category }
