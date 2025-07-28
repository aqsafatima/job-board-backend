const checkRole = (roles) => {
  console.log(roles);
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "❌ Access denied: You don’t have permission" });
    }
    next();
  };
};

module.exports = checkRole;
