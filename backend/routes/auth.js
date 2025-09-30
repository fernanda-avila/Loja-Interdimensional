
import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Senha incorreta' });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { name: user.name, email: user.email, isAdmin: user.isAdmin } });
});

// Rota para validar o token e retornar dados do usuário atual
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    return res.json({ name: user.name, email: user.email, isAdmin: user.isAdmin });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao obter usuário' });
  }
});

export default router;
