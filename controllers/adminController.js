const User = require("../models/User");

// GET all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};

// DELETE a user (Admin only)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await user.deleteOne();
    res.status(200).json({ msg: "✅ User deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "❌ Server error", error: err.message });
  }
};

module.exports = { getAllUsers, deleteUser };
