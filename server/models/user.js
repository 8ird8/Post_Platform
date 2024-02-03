const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar : { type: String, required: true},
    bio : { type: String, required: false},
    
});



const user = mongoose.model("user", userSchema);

module.exports = user;