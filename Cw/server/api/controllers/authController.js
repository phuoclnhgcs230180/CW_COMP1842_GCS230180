const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secretKey = 'secret';

exports.register = async (req, res) => {
  try {
    // Hash password
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
      role: req.body.role || 'staff'
    });
    const user = await newUser.save();
    res.status(200).send({ message: "Registration successful!" });
  } catch (err) {
    res.status(500).send({ message: "Registration error: username may already exist.", error: err });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).send({ message: "User not found." });

    // Verify password
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ token: null, message: "Invalid password!" });

    // Create token valid for 24h
    const token = jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: 86400 });

    res.status(200).send({
      id: user._id,
      username: user.username,
      role: user.role,
      token: token
    });
  } catch (err) {
    res.status(500).send('Server error.');
  }
};

exports.change_password = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send("User does not exist");

    // Verify old password
    const oldPasswordIsValid = bcrypt.compareSync(req.body.oldPassword, user.password);
    if (!oldPasswordIsValid) return res.status(401).send({ message: "Old password is incorrect!" });

    const newHashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
    user.password = newHashedPassword;
    await user.save();
    res.status(200).send({ message: "Password changed successfully!" });
  } catch (err) {
    res.status(500).send("Server error.");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username role');
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send('Server error.');
  }
};