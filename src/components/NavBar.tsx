import React, { useState } from 'react';
import { TiShoppingCart } from 'react-icons/ti';
import { motion } from "framer-motion";
import { Card, Button } from 'antd';
import { Product } from '../utils/types';
import { LuTrash2 } from "react-icons/lu";

interface NavBarProps {
  selectedItems: { id: number; quantity: number }[];
  items: Product[];
  setSelectedItems: React.Dispatch<React.SetStateAction<{ id: number; quantity: number }[]>>;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};


const NavBar: React.FC<NavBarProps> = ({ selectedItems, items, setSelectedItems }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(prevState => !prevState);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const handleIncreaseQuantity = (itemId: number) => {
    const newItems = selectedItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setSelectedItems(newItems);
  };

  const handleDecreaseQuantity = (itemId: number) => {
    const newItems = selectedItems.map(item =>
      item.id === itemId ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item
    );
    setSelectedItems(newItems);
  };

  const handleRemoveItem = (itemId: number) => {
    const newItems = selectedItems.filter(item => item.id !== itemId);
    setSelectedItems(newItems);
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    selectedItems.forEach(({ id, quantity }) => {
      const selectedItem = items.find(item => item.id === id);
      if (selectedItem) {
        totalPrice += selectedItem.price * quantity;
      }
    });
    return totalPrice;
  };

  const getTotalQuantity = () => {
    let totalQuantity = 0;
    selectedItems.forEach(({ quantity }) => {
      totalQuantity += quantity;
    });
    return totalQuantity;
  };

  return (
    <nav>
      <div
        className="navbar"
        style={{
          width: '100%',
          height: '80px',
          backgroundColor: '#0f52ba',
          position: 'absolute',
          top: '0',
          left: '0'
        }}
      >
        <div className="barText" style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: '0 10px' }}>MKS</h1>
          <p style={{ margin: '0' }}>Sistemas</p>
        </div>
        <div
          className="carshop"
          onClick={toggleCart}
          style={{
            width: '80px',
            height: '30px',
            backgroundColor: '#ffff',
            position: 'absolute',
            left: '90%',
            top: '25px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <TiShoppingCart style={{ color: 'black', marginLeft: '10px' }} />
          <span style={{ marginLeft: '5px', color:'black' }}>{getTotalQuantity()}</span>
        </div>
      </div>
      {isCartOpen && (
        <motion.div
          className="cart-dropdown"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            width: '420px',
            height: 'auto',
            backgroundColor: '#0f52ba',
            border: 'none',
            borderRadius: '5px',
            boxShadow: '0px 5px 15px 20px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <h1 style={{ left: '25%', position: 'relative', width:'60%' }}>Meu Carrinho</h1>
          <button
            onClick={closeCart}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'transparent',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            X
          </button>
          {selectedItems.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
              <p>O carrinho está vazio</p>
            </div>
          ) : (
            <>
              {selectedItems.map(({ id, quantity }) => {
                const selectedItem = items.find(item => item.id === id);
                if (selectedItem) {
                  return (
                    <Card id='cartCard'
                      key={id}
                      style={{ margin: '10px', width: '90%', height: '150px', backgroundColor: 'white' }}
                    >
                      <img alt={selectedItem.name} src={selectedItem.photo} style={{ width: '20%', height: '80px', marginRight: '10px' }} />
                      <div style={{ position: 'absolute', top: '20px', left: '50px' }}>
                        <p>{selectedItem.name}</p>
                        <p>{formatPrice(selectedItem.price)}</p>
                        <div>
                          <p style={{ position:'relative', left:'120px' }}>
                            Quantidade: {quantity}
                            <Button onClick={() => handleIncreaseQuantity(id)}>+</Button>
                            <Button onClick={() => handleDecreaseQuantity(id)}>-</Button>
                          </p>
                          <Button style={{position:'absolute', top:'0',left:'150%'}} type="primary" danger onClick={() => handleRemoveItem(id)}><LuTrash2 /></Button>
                        </div>
                      </div>
                    </Card>
                  );
                }
                return null;
              })}
              <div style={{ padding: '20px', textAlign: 'right', color: 'white' }}>
                <p>Total: {formatPrice(getTotalPrice())}</p>
              </div>
            </>
            
          )}
          <Button
            style={{ width: '100%',height:'100px', marginTop: '20px' }} 
            type="primary" 
            onClick={() => {
            }}
            >
            Finalizar Compra
            </Button>
        </motion.div>
      )}
    </nav>
  );
};

export default NavBar;
