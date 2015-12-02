var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TaskSchema   = new Schema({
    name: String,
    description: String,
    category: String,
    importance: Number,
    time_created: String,
    time_finished: String,
    rating: Number
});

module.exports = mongoose.model('Task', TaskSchema);