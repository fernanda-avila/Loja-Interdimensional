import React, { useState, useEffect } from "react";
import styles from "./SpecialProducts.module.css";
import Modal from "./Modal";
import { FaPlus, FaEdit, FaTrash, FaDollarSign, FaInfoCircle } from "react-icons/fa";

// Função para buscar imagem dos produtos antigos pelo nome
const productImages = {
  "Chaveiro Portal": "/src/assets/chaveiro.webp",
  "Caneca Cósmica": "/src/assets/canecas.webp",
  "Caneca Morty Assustado": "/src/assets/canecamorty.webp",
  "Caderno Interdimensional": "/src/assets/caderno.avif",
  "Plumbus Standard": "/src/assets/doces.jpg",
  "Sementes de Mega Árvores": "/src/assets/semestes.webp",
  "Amostra Mr. Meeseeks": "/src/assets/meeseeks.jpg",
  "Picles do Rick": "/src/assets/picles.webp",
};

function getProductImage(prod) {
  if (prod.image && prod.image.trim() !== "") return prod.image;
  return productImages[prod.name] || "/src/assets/canecas.webp";
}

const API_BASE_URL = "http://localhost:5000";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    attributes: "",
  });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
      image: product.image || "",
      attributes: product.attributes ? JSON.stringify(product.attributes) : "",
    });
    setMessage("");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) return;
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setMessage("Produto removido!");
      fetchProducts();
    } else {
      setMessage("Erro ao remover produto.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: form.name,
      price: Number(form.price),
      description: form.description,
      image: form.image,
      attributes: form.attributes ? JSON.parse(form.attributes) : {},
    };

    let res;
    if (editingProduct) {
      res = await fetch(`${API_BASE_URL}/products/${editingProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } else {
      res = await fetch(`${API_BASE_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    }

    if (res.ok) {
      setMessage(editingProduct ? "Produto atualizado!" : "Produto criado!");
      setEditingProduct(null);
      setForm({ name: "", price: "", description: "", image: "", attributes: "" });
      fetchProducts();
      setShowModal(false);
    } else {
      setMessage("Erro ao salvar produto.");
    }
  };

  return (
    <section id="admin-products" style={{ padding: "2rem" }}>
      <button
        style={{
          background: "linear-gradient(90deg, #7fff00 60%, #bfff00 100%)",
          color: "#222",
          border: "none",
          borderRadius: "50px",
          padding: "1rem 2.2rem",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1.3rem",
          marginBottom: "2.5rem",
          boxShadow: "0 0 12px #7fff00a0",
          display: "flex",
          alignItems: "center",
          gap: "0.7rem",
        }}
        onClick={() => {
          setEditingProduct(null);
          setForm({ name: "", price: "", description: "", image: "", attributes: "" });
          setShowModal(true);
        }}
      >
        <FaPlus style={{ fontSize: "1.7rem" }} /> Adicionar Produto
      </button>
      <div className={styles.productGrid} style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
        gap: "2.5rem",
        padding: "1rem",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {products.map((prod) => (
          <div
            key={prod._id}
            className={styles.productCard}
            style={{
              background: "linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)",
              borderRadius: "20px",
              padding: "0.7rem",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              border: "1px solid #333",
              minHeight: "480px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(127, 255, 0, 0.1)",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-12px) scale(1.02)";
              e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(127, 255, 0, 0.2), 0 0 30px rgba(127, 255, 0, 0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(127, 255, 0, 0.1)";
            }}>

            <div style={{ 
              width: "100%", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}>
              <div style={{
                position: "relative",
                marginBottom: "2rem",
              }}>
                <div style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "200px",
                  height: "200px",
                  background: "radial-gradient(circle, rgba(127, 255, 0, 0.25) 0%, transparent 70%)",
                  borderRadius: "50%",
                  filter: "blur(12px)",
                }} />
                <img
                  src={getProductImage(prod)}
                  alt={prod.name}
                  className={styles.productImage}
                  style={{
                    borderRadius: "16px",
                    border: "3px solid rgba(127, 255, 0, 0.4)",
                    width: "250px",
                    height: "250px",
                    objectFit: "cover",
                    background: "#222",
                    position: "relative",
                    zIndex: 2,
                    transition: "all 0.3s ease",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                  }}
                />
              </div>

              <h3 style={{
                color: "#7fff00",
                fontWeight: "700",
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
                marginTop: "-2rem",
                letterSpacing: "0.5px",
                textAlign: "center",
                lineHeight: "1.3",
                textShadow: "0 2px 8px rgba(0, 0, 0, 0.6)",
                padding: "0 1rem",

              }}>{prod.name}</h3>

              <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                background: "rgba(127, 255, 0, 0.15)",
                borderRadius: "12px",
                padding: "0.75rem 1.5rem",
                border: "2px solid rgba(127, 255, 0, 0.3)",
                width: "fit-content",
                minWidth: "140px",
                justifyContent: "center",
              }}>
                <FaDollarSign style={{ 
                  color: "#7fff00", 
                  marginRight: "10px", 
                  fontSize: "1.2rem",
                  filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))"
                }} />
                <p style={{
                  color: "#fff",
                  fontSize: "1.4rem",
                  margin: 0,
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
                }}>
                  R$ {parseFloat(prod.price).toFixed(2)}
                </p>
              </div>

              {prod.description && (
                <div style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: "1.5rem",
                  background: "rgba(191, 255, 0, 0.08)",
                  borderRadius: "12px",
                  padding: "1rem",
                  border: "1px solid rgba(191, 255, 0, 0.2)",
                  width: "100%",
                  minHeight: "80px",
                }}>
                  <FaInfoCircle style={{ 
                    color: "#bfff00", 
                    marginRight: "12px", 
                    fontSize: "2rem",
                    marginTop: "2px",
                    flexShrink: 0,
                    filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))"
                  }} />
                  <p style={{
                    color: "#bfff00",
                    fontSize: "1rem",
                    margin: 0,
                    lineHeight: "1.5",
                    textAlign: "left",
                    fontWeight: "500",
                  }}>{prod.description}</p>
                </div>
              )}
            </div>

            <div style={{
              display: "flex",
              gap: "1rem",
              marginTop: "auto",
              justifyContent: "center",
              width: "100%",
              paddingTop: "1.5rem",
              borderTop: "2px solid rgba(127, 255, 0, 0.15)",
            }}>
              <button
                style={{
                  background: "linear-gradient(45deg, #7fff00, #bfff00)",
                  color: "#1a1a1a",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  padding: "0.8rem 1.5rem",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(127, 255, 0, 0.4)",
                  minWidth: "140px",
                  justifyContent: "center",
                  letterSpacing: "0.5px",
                }}
                title="Editar"
                onClick={() => handleEdit(prod)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(127, 255, 0, 0.6)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(127, 255, 0, 0.4)";
                }}
              >
                <FaEdit style={{ fontSize: "1rem" }} />
                Editar
              </button>
              <button
                style={{
                  background: "linear-gradient(45deg, #ff4c4c, #ff6b6b)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  padding: "0.8rem 1.5rem",
                  fontWeight: "700",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 4px 12px rgba(255, 76, 76, 0.4)",
                  minWidth: "140px",
                  justifyContent: "center",
                  letterSpacing: "0.5px",
                }}
                title="Remover"
                onClick={() => handleDelete(prod._id)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px) scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(255, 76, 76, 0.6)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 76, 76, 0.4)";
                }}
              >
            
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title={editingProduct ? "Editar Produto" : "Adicionar Produto"}
      >
        <form
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
          onSubmit={handleSubmit}
        >
          <input
            name="name"
            placeholder="Nome"
            value={form.name}
            onChange={handleInputChange}
            required
            style={{
              padding: "0.7rem",
              borderRadius: "6px",
              border: "none",
              background: "#333",
              color: "#fff",
              minWidth: "120px",
            }}
          />
          <input
            name="price"
            type="number"
            placeholder="Preço"
            value={form.price}
            onChange={handleInputChange}
            required
            style={{
              padding: "0.7rem",
              borderRadius: "6px",
              border: "none",
              background: "#333",
              color: "#fff",
              minWidth: "120px",
            }}
          />
          <input
            name="description"
            placeholder="Descrição"
            value={form.description}
            onChange={handleInputChange}
            style={{
              padding: "0.7rem",
              borderRadius: "6px",
              border: "none",
              background: "#333",
              color: "#fff",
              minWidth: "120px",
            }}
          />
          <input
            name="image"
            placeholder="URL da Imagem"
            value={form.image}
            onChange={handleInputChange}
            style={{
              padding: "0.7rem",
              borderRadius: "6px",
              border: "none",
              background: "#333",
              color: "#fff",
              minWidth: "120px",
            }}
          />
          <input
            name="attributes"
            placeholder="Atributos (JSON)"
            value={form.attributes}
            onChange={handleInputChange}
            style={{
              padding: "0.7rem",
              borderRadius: "6px",
              border: "none",
              background: "#333",
              color: "#fff",
              minWidth: "120px",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#7fff00",
              color: "#222",
              border: "none",
              borderRadius: "6px",
              padding: "0.7rem 1.2rem",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "background 0.2s",
            }}
          >
            {editingProduct ? "Salvar Alterações" : "Adicionar Produto"}
          </button>
          <button
            type="button"
            style={{
              background: "#ff4c4c",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "0.7rem 1.2rem",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "0.5rem",
            }}
            onClick={() => {
              setEditingProduct(null);
              setForm({
                name: "",
                price: "",
                description: "",
                image: "",
                attributes: "",
              });
              setShowModal(false);
            }}
          >
            Cancelar
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default AdminProducts;