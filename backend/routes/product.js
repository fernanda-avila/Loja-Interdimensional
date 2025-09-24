
import express from 'express';
import Product from '../models/Product.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Middleware de autenticação e verificação de admin
const requireAdmin = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.isAdmin) return res.status(403).json({ error: 'Acesso negado' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Listar produtos (público)
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Criar produto (admin)
router.post('/', requireAdmin, async (req, res) => {
  const { name, price, description, image, attributes } = req.body;
  const product = await Product.create({ name, price, description, image, attributes });
  res.json(product);
});

// Atualizar produto (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  const { name, price, description, image, attributes } = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, { name, price, description, image, attributes }, { new: true });
  res.json(product);
});

// Remover produto (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produto removido' });
});

export default router;
