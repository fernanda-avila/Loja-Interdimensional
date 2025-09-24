import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import MongoInstructions from './MongoInstructions';
import styles from './SpecialProducts.module.css';

const SpecialProducts = () => {
    const [showCartModal, setShowCartModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const products = [
        { id: 1, name: 'Chaveiro Portal', img: '/src/assets/chaveiro.webp' },
        { id: 2, name: 'Caneca Cósmica', img: '/src/assets/canecas.webp' },
        { id: 3, name: 'Caneca Morty Assustado', img: '/src/assets/canecamorty.webp' },
        { id: 4, name: 'Caderno Interdimensional', img: '/src/assets/caderno.avif' },
        { id: 5, name: 'Plumbus Standard', img: '/src/assets/doces.jpg' }, 
        { id: 6, name: 'Sementes de Mega Árvores', img: '/src/assets/semestes.webp' },
        { id: 7, name: 'Amostra Mr. Meeseeks', img: '/src/assets/meeseeks.jpg' },
        { id: 8, name: 'Picles do Rick', img: '/src/assets/picles.webp' }, 
    ];

    // URL base da API
    // ...existing code...

    const [cartMessage, setCartMessage] = useState('');

    const API_BASE_URL = 'http://localhost:5000';
    const handleAddToCartClick = async (product) => {
        setSelectedProduct(product);
        setShowCartModal(true);
        setCartMessage('');
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE_URL}/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ productId: product.id, quantity: 1 })
            });
            if (!response.ok) {
                throw new Error('Erro ao adicionar ao carrinho');
            }
            setCartMessage('Produto adicionado ao carrinho com sucesso!');
        } catch (err) {
            setCartMessage('Erro ao adicionar ao carrinho. Faça login ou tente novamente.');
            console.error(err);
        }
    };

    return null;
};

export default SpecialProducts;