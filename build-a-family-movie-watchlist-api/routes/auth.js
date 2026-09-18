import express from "express";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";   

const router = express.Router();
const usersFilePath = path.resolve("data/users.json");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required." });
  }

  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
  } catch (err) {
    users = [];
  }

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  
  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials." });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET || "secret_key"
  );

  return res.status(200).json({ token });
});

export default router;