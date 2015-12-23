var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaskSchema   = new Schema({
    user_id: String,
    name: String,
    description: String,
    category: String,
    importance: Number,
    time_created: String,
    time_finished: String,
    status: String,
    rating: Number,
    archived: Boolean
});

module.exports = mongoose.model('Task', TaskSchema);