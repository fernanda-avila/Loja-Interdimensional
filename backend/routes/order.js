import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// Criar pedido
router.post('/', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  if (!user.cart.length) return res.status(400).json({ error: 'Carrinho vazio' });
  const total = user.cart.reduce((sum, i) => sum + (i.quantity * (i.productId.price || 0)), 0);
  const order = await Order.create({ user: user._id, products: user.cart, total });
  user.orders.push(order);
  user.cart = [];
  await user.save();
  res.json({ message: 'Pedido realizado com sucesso', order });
});

// Listar pedidos do usuário
router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ user: req.userId });
  res.json(orders);
});

export default router;
