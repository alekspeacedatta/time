const mongoose = require("mongoose");

const watchSchema = mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    mainImage: String,
    images: [String]
})

module.exports = mongoose.model("watch", watchSchema);