import React, { useState } from 'react';
import styles from './Header.module.css';
import Modal from './Modal';
import MongoInstructions from './MongoInstructions';
import LoginForm from './LoginForm';

import heroBanner from '../assets/rick-and-morty-banner.jpg';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const API_BASE_URL = 'http://localhost:5000';

  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
      if (!response.ok) throw new Error('Erro ao buscar carrinho');
      const data = await response.json();
      setCartItems(data.cart || []);
      setCartTotal(data.total || 0);
    } catch (err) {
      setCartItems([]);
      setCartTotal(0);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem('token');
    if (newQuantity < 1) return;
    try {
      const response = await fetch(`${API_BASE_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ productId, quantity: newQuantity })
      });
      if (!response.ok) throw new Error('Erro ao atualizar quantidade');
      await fetchCart();
    } catch (err) {
      // erro
    }
  };

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/cart/remove`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ productId })
      });
      if (!response.ok) throw new Error('Erro ao remover item');
      await fetchCart();
    } catch (err) {
      // erro
    }
  };

  const handleOpenCart = () => {
    fetchCart();
    setShowCartModal(true);
  };

  // Atualiza o carrinho ao abrir a página ou ao logar
  React.useEffect(() => {
    fetchCart();
  }, []);

  const handleExplore = () => {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className={styles.header} style={{ backgroundImage: `url(${heroBanner})` }}>
        
  <div className={styles.cartContainer} onClick={handleOpenCart}>
          <svg className={styles.cartIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          <span className={styles.cartBadge}>{cartItems.length}</span>
        </div>
        
        <div className={styles.overlay}>
          <div className="container">
            <h1 className={styles.title}>Loja Interdimensional</h1>
            <p className={styles.subtitle}>O e-commerce mais cachorro do multiverso Rick e Morty</p>
            <div>
              <button onClick={handleExplore} className="btn">Explorar Produtos</button>
              <button onClick={() => setShowLoginModal(true)} className={`btn ${styles.portalBtn}`}>Entrar no Portal</button>
            </div>
          </div>
        </div>
      </header>
      
      <Modal 
        show={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        title="Login de Usuário"
      >
        <LoginForm onSuccess={() => setShowLoginModal(false)} />
      </Modal>

      <Modal
        show={showCartModal}
        onClose={() => setShowCartModal(false)}
        title="Seu Carrinho Interdimensional"
      >
        <div style={{ padding: '1rem', minWidth: 320 }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#888' }}>
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            <>
              <table className={styles.cartModalTable}>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Preço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productId?.name || item.productId || 'Produto'}</td>
                      <td>
                        <button className={styles.cartModalBtn} onClick={() => handleUpdateQuantity(item.productId._id || item.productId, item.quantity - 1)}>-</button>
                        {item.quantity}
                        <button className={styles.cartModalBtn} onClick={() => handleUpdateQuantity(item.productId._id || item.productId, item.quantity + 1)}>+</button>
                      </td>
                      <td>
                        R$ {(item.productId?.price ? item.productId.price * item.quantity : 0).toFixed(2)}
                      </td>
                      <td>
                        <button className={styles.cartModalDelete} onClick={() => handleRemoveItem(item.productId._id || item.productId)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.cartModalTotal}>
                Total: R$ {
                  cartItems.reduce((sum, item) => sum + (item.productId?.price ? item.productId.price * item.quantity : 0), 0).toFixed(2)
                }
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Header;