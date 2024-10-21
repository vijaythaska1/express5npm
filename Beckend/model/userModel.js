const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    password: {
        type: String,
        default: ""
    },

});
module.exports = mongoose.model("User", Schema);
