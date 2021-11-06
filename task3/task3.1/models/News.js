const mongoose = require('mongoose');
const { Schema } = mongoose;

const NewsSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}); 

module.exports = mongoose.model('News', NewsSchema);