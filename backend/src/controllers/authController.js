import { loginUser, registerUser, sanitize } from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const { user, token } = await registerUser(req.body);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { user, token } = await loginUser(req.body);
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.status(200).json({ user: sanitize(req.user) });
}
