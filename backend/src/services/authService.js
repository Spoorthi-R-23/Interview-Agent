import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { signToken } from "../utils/jwt.js";
import { logger } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory user store for demo (no database required)
const users = new Map();

// Simple file-based persistence
const USERS_FILE = path.join(__dirname, "../../.users.json");

// Load users from file on startup
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, "utf8");
      const usersArray = JSON.parse(data);
      usersArray.forEach((user) => users.set(user.email, user));
      logger.info("Loaded users from file", { count: users.size });
    }
  } catch (error) {
    logger.warn("Could not load users file", { error: error.message });
  }
}

// Save users to file
function saveUsers() {
  try {
    const usersArray = Array.from(users.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersArray, null, 2));
  } catch (error) {
    logger.warn("Could not save users file", { error: error.message });
  }
}

// Initialize on module load
loadUsers();

export async function registerUser({ name, email, password }) {
  if (users.has(email)) {
    const error = new Error("Email already registered");
    error.status = 409;
    throw error;
  }

  const user = {
    _id: `user-${Date.now()}`,
    name,
    email,
    password, // In production, hash this
    role: "candidate",
    createdAt: new Date(),
  };

  users.set(email, user);
  saveUsers(); // Persist to file
  logger.info("User registered (in-memory)", { email });

  const token = signToken({ sub: user._id, email: user.email });
  return { user: sanitize(user), token };
}

export async function loginUser({ email, password }) {
  const user = users.get(email);
  if (!user || user.password !== password) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  logger.info("User logged in (in-memory)", { email });
  const token = signToken({ sub: user._id, email: user.email });
  return { user: sanitize(user), token };
}

export function sanitize(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
