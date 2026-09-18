export const authorizeModification = (req, res, next) => {
  const user = req.user;
  const targetUserId = req.params.userId;

  if (user && user.role === "child" && String(user.id) !== String(targetUserId)) {
    return res.status(403).json({ error: "Access denied" });
  }
  
  next();
};