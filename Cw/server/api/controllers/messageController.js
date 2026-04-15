const mongoose = require('mongoose');
const Message = mongoose.model('Message');
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;

exports.sendMessage = async (req, res) => {
  try {
    const userId = new ObjectId(req.userId);
    const sender = await User.findById(userId);
    if (!sender) return res.status(404).send({ message: "Sender not found." });

    // For staff, only allow sending to admin
    let toId;
    if (sender.role === 'staff') {
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) return res.status(404).send({ message: "Admin not found." });
      toId = admin._id;
    } else {
      toId = new ObjectId(req.body.to);
    }

    const newMessage = new Message({
      from: userId,
      to: toId,
      subject: req.body.subject,
      message: req.body.message
    });

    const message = await newMessage.save();
    res.status(200).send({ message: "Message sent successfully!", data: message });
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).send({ message: "Error sending message.", error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const userId = new ObjectId(req.userId);
    const user = await User.findById(userId);
    
    let query;
    if (user?.role === 'admin') {
      // Admin sees all messages in the system
      query = {};
    } else {
      // Staff only sees their own messages
      query = {
        $or: [{ from: userId }, { to: userId }]
      };
    }
    
    const messages = await Message.find(query)
      .populate('from', 'username role')
      .populate('to', 'username role')
      .sort({ createdAt: -1 });
    
    res.status(200).send(messages);
  } catch (err) {
    console.error('Error retrieving messages:', err);
    res.status(500).send({ message: "Error retrieving messages.", error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).send({ message: "Message not found." });

    const userId = new ObjectId(req.userId);
    if (message.to.toString() !== userId.toString()) return res.status(403).send({ message: "Not authorized." });

    message.isRead = true;
    await message.save();
    res.status(200).send({ message: "Message marked as read." });
  } catch (err) {
    res.status(500).send({ message: "Error marking message as read.", error: err });
  }
};