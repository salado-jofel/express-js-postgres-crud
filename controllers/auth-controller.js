import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../configs/db.js";

const createTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // short-lived access
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" } // longer-lived refresh
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, hashedPassword]
    );

    res
      .status(201)
      .json({ user: newUser.rows[0], message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = createTokens(user);

    // Save refresh token in DB
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + interval '7 days')",
      [user.id, refreshToken]
    );

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "Missing refresh token" });

  try {
    // Check DB
    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token=$1",
      [token]
    );
    const stored = result.rows[0];
    if (!stored)
      return res.status(403).json({ message: "Invalid refresh token" });

    // Verify
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const userResult = await pool.query("SELECT * FROM users WHERE id=$1", [
      decoded.id,
    ]);
    const user = userResult.rows[0];

    if (!user) return res.status(403).json({ message: "User not found" });

    const { accessToken, refreshToken } = createTokens(user);

    // Update refresh token
    await pool.query("DELETE FROM refresh_tokens WHERE token=$1", [token]);
    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + interval '7 days')",
      [user.id, refreshToken]
    );

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(403).json({ message: "Token invalid or expired" });
  }
};

export const logout = async (req, res) => {
  const { token } = req.body;
  await pool.query("DELETE FROM refresh_tokens WHERE token=$1", [token]);
  res.json({ message: "Logged out successfully" });
};
