const mongoose = require("mongoose")
const { boolean } = require("webidl-conversions")

const petSchema = new mongoose.Schema({
    petType: {type: String, required: true},
    age: {type: String, required: true},
    color: {type: String, required: true},
    name: {type: String, required: true},
    gender: {type: String, required: true},
    kids: {type: Boolean},
    cats: {type: Boolean},
    dogs: {type: Boolean},
    img: String
})

const furryFriend = mongoose.model("furryFriend", petSchema)

module.exports = furryFriend