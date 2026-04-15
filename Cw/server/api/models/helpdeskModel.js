const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HelpdeskSchema = new Schema({
  issueCode: {
    type: String,
    required: 'Please enter the Issue Code (Key)'
  },
  responseText: {
    type: String,
    required: 'Please enter the standard response (Value)'
  },
  description: {
    type: String,
    default: '' // Description of the added issue
  },
  isCommon: {
    type: Boolean,
    default: false // Mark issue as common for Guest view
  }
}, { collection: 'responses' });

module.exports = mongoose.model('Helpdesk', HelpdeskSchema);