const mongoose = require('mongoose');
const Helpdesk = mongoose.model('Helpdesk');
const User = mongoose.model('User');
// Get list (with search support) - for Staff/Admin
exports.list_all_responses = async (req, res) => {
  try {
    let query = {};
    if (req.query.search) {
      const searchRegex = { $regex: req.query.search, $options: 'i' };
      query = {
        $or: [
          { issueCode: searchRegex },
          { description: searchRegex },
          { responseText: searchRegex } // Add search on standard response
        ]
      };
    }
    const responses = await Helpdesk.find(query);
    res.json(responses);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get common issues - for Guest (no login required)
exports.list_common_responses = async (req, res) => {
  try {
    const responses = await Helpdesk.find({ isCommon: true }).limit(5); // Limit to 5 issues
    res.json(responses);
  } catch (err) {
    res.send(err);
  }
};

// (Keep the existing Create, Read One, Update, Delete functions)
exports.create_a_response = async (req, res) => {
  try {
    const new_response = new Helpdesk(req.body);
    const response = await new_response.save();
    res.json(response);
  } catch (err) {
    res.send(err);
  }
};

exports.read_a_response = async (req, res) => {
  try {
    const response = await Helpdesk.findById(req.params.responseId);
    res.json(response);
  } catch (err) {
    res.send(err);
  }
};

exports.update_a_response = async (req, res) => {
  try {
    const response = await Helpdesk.findOneAndUpdate(
      { _id: req.params.responseId }, 
      req.body, // Data sent from front-end
      { new: true }
    );
    res.json(response);
  } catch (err) {
    res.status(500).send(err);
  }
};
exports.delete_a_response = async (req, res) => {
  try {
    await Helpdesk.findByIdAndDelete(req.params.responseId);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.send(err);
  }
};

exports.create_a_user = async (req, res) => {
  try {
    const new_user = new User(req.body);
    const user = await new_user.save();
    res.json(user);
  } catch (err) {
    res.status(400).send(err); // Return detailed error if username duplicate or missing fields
  }
};