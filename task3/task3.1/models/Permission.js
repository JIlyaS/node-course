const mongoose = require('mongoose');
const { Schema } = mongoose;

const PermissionSchema = new Schema({
    permission: {
        chat: { C: { type: Boolean }, R: { type: Boolean }, U: { type: Boolean }, D: { type: Boolean } },
        news: { C: { type: Boolean }, R: { type: Boolean }, U: { type: Boolean }, D: { type: Boolean } },
        settings: { C: { type: Boolean }, R: { type: Boolean }, U: { type: Boolean }, D: { type: Boolean } }
    }
}); 

module.exports = mongoose.model('Permission', PermissionSchema);