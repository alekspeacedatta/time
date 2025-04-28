const mongoose = require("mongoose");

const watchSchema = mongoose.Schema({
    name: String,
    brand: String,
    price: Number,
    imagePath: []
})

module.exports = mongoose.model("watch", watchSchema);