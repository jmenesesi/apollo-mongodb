var mongoose = require('mongoose');
// Setup schema
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
	email: { 
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
// Export User model
var User = module.exports = mongoose.model('users', userSchema);