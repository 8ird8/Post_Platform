const {Schema, model} = require("mongoose");


const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "user" },
    likes: [{ type: Schema.Types.ObjectId, ref: "user" }],
    // dislikes: [{ type: Schema.Types.ObjectId, ref: "user" }],
    // comments: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    

},{timestamps: true})



const post = model("post", postSchema);

module.exports = post;