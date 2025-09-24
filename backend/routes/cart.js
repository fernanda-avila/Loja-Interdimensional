import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
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

// Listar carrinho
router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.userId).populate('cart.productId');
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json({ cart: user.cart });
});

// Adicionar ao carrinho
router.post('/add', auth, async (req, res) => {
  let { productId, quantity } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  // Se vier id numérico, converte para ObjectId
  if (!String(productId).match(/^[a-fA-F0-9]{24}$/)) {
    const nomes = [
      'Chaveiro Portal',
      'Caneca Cósmica',
      'Caneca Morty Assustado',
      'Caderno Interdimensional',
      'Plumbus Standard',
      'Sementes de Mega Árvores',
      'Amostra Mr. Meeseeks',
      'Picles do Rick'
    ];
    const idx = Number(productId) - 1;
    const nome = nomes[idx];
    const produto = await Product.findOne({ name: nome });
    if (produto) {
      productId = produto._id;
    } else {
      return res.status(400).json({ error: 'Produto não encontrado' });
    }
  }
  const cartIdx = user.cart.findIndex(i => String(i.productId) === String(productId));
  if (cartIdx > -1) {
    user.cart[cartIdx].quantity += quantity;
  } else {
    user.cart.push({ productId, quantity });
  }
  await user.save();
  res.json({ message: 'Produto adicionado ao carrinho' });
});

// Atualizar quantidade
router.put('/update', auth, async (req, res) => {
  const { productId, quantity } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  const idx = user.cart.findIndex(i => String(i.productId) === String(productId));
  if (idx > -1) {
    user.cart[idx].quantity = quantity;
    await user.save();
    res.json({ message: 'Quantidade atualizada' });
  } else {
    res.status(404).json({ error: 'Produto não encontrado no carrinho' });
  }
});

// Remover item
router.delete('/remove', auth, async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  user.cart = user.cart.filter(i => String(i.productId) !== String(productId));
  await user.save();
  res.json({ message: 'Item removido do carrinho' });
});




export default router;
