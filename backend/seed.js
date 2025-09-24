import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const products = [
  { name: 'Chaveiro Portal', price: 29.9, attributes: { categoria: 'Acessório' } },
  { name: 'Caneca Cósmica', price: 49.9, attributes: { categoria: 'Cozinha' } },
  { name: 'Caneca Morty Assustado', price: 59.9, attributes: { categoria: 'Cozinha' } },
  { name: 'Caderno Interdimensional', price: 39.9, attributes: { categoria: 'Papelaria' } },
  { name: 'Plumbus Standard', price: 99.9, attributes: { categoria: 'Utilidade' } },
  { name: 'Sementes de Mega Árvores', price: 19.9, attributes: { categoria: 'Colecionável' } },
  { name: 'Amostra Mr. Meeseeks', price: 79.9, attributes: { categoria: 'Colecionável' } },
  { name: 'Picles do Rick', price: 24.9, attributes: { categoria: 'Comida' } },
];

async function seedProducts() {
  await mongoose.connect(MONGO_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Produtos inseridos com sucesso!');
  mongoose.disconnect();
}

seedProducts();
