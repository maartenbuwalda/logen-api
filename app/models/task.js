var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaskSchema   = new Schema({
    item_key: Number,
    user_id: String,
    name: String,
    description: String,
    category: String,
    importance: String,
    time_created: String,
    time_finished: String,
    status: String,
    rating: String,
    archived: Boolean
});

module.exports = mongoose.model('Task', TaskSchema);