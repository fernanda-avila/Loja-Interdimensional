import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import MongoInstructions from './MongoInstructions';
import styles from './SpecialProducts.module.css';

const SpecialProducts = () => {
    const [showCartModal, setShowCartModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const defaultProducts = [
        { _id: 'local-1', name: 'Chaveiro Portal', image: '/src/assets/chaveiro.webp', price: 19.9 },
        { _id: 'local-2', name: 'Caneca C\u00f3smica', image: '/src/assets/canecas.webp', price: 39.9 },
        { _id: 'local-3', name: 'Caneca Morty Assustado', image: '/src/assets/canecamorty.webp', price: 34.9 },
        { _id: 'local-4', name: 'Caderno Interdimensional', image: '/src/assets/caderno.avif', price: 24.9 },
    ];

    const [products, setProducts] = useState([]);
    const [cartMessage, setCartMessage] = useState('');

    const API_BASE_URL = 'http://localhost:5000';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products`);
                if (!res.ok) throw new Error('API respondeu com erro');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.warn('Não foi possível buscar produtos da API, usando lista local:', err);
                setProducts(defaultProducts);
            }
        };
        fetchProducts();
        const onLogin = () => fetchProducts();
        window.addEventListener('user:login', onLogin);
        return () => window.removeEventListener('user:login', onLogin);
    }, []);

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
                body: JSON.stringify({ productId: product._id || product.id, quantity: 1 })
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

    return (
        <section id="special-products" className={styles.container} style={{ padding: '2rem' }}>
            <h2 style={{ color: '#7fff00', textAlign: 'center', marginBottom: '1.5rem' }}>Produtos Especiais</h2>
            <div className={styles.productGrid} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '1.25rem',
                maxWidth: '1100px',
                margin: '0 auto'
            }}>
                {products.map((p) => (
                    <div key={p._id} className={styles.productCard} style={{
                        background: '#121212',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        textAlign: 'center'
                    }}>
                        <img src={p.image || p.img || '/src/assets/portal.jpg'} alt={p.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
                        <h3 style={{ color: '#bfff00', marginTop: '0.75rem' }}>{p.name}</h3>
                        <p style={{ color: '#fff', marginTop: '0.4rem' }}>R$ {p.price ? parseFloat(p.price).toFixed(2) : '—'}</p>
                        <button onClick={() => handleAddToCartClick(p)} style={{
                            marginTop: '0.75rem',
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            background: '#7fff00'
                        }}>Adicionar ao carrinho</button>
                        {cartMessage && <p style={{ marginTop: '0.5rem', color: '#fff' }}>{cartMessage}</p>}
                    </div>
                ))}
            </div>
            {showCartModal && selectedProduct && (
                <Modal show={showCartModal} onClose={() => setShowCartModal(false)} title={`Adicionar ${selectedProduct.name} ao carrinho`}>
                    <p>Quantidade: 1</p>
                    <p>{cartMessage}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button onClick={() => setShowCartModal(false)} style={{ padding: '0.5rem 1rem' }}>Fechar</button>
                    </div>
                </Modal>
            )}
        </section>
    );
};

export default SpecialProducts;