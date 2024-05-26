import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { List, Card, Spin, Alert, Button } from 'antd';
import './App.css';
import NavBar from './components/NavBar';
import { Product } from './utils/types';

const queryClient = new QueryClient();

const fetchItems = async (): Promise<Product[]> => {
  const response = await fetch('https://mks-frontend-challenge-04811e8151e6.herokuapp.com/api/v1/products?page=1&rows=10&sortBy=name&orderBy=DESC');
  if (!response.ok) {
    throw new Error('Erro ao buscar os itens do carrinho');
  }
  const data = await response.json();
  return data.products;  
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
};

const App: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<{ id: number; quantity: number }[]>([]);
  const { data: items, error, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: fetchItems
  });

  const handleSelectItem = (itemId: number) => {
    const existingItem = selectedItems.find(item => item.id === itemId);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item => 
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setSelectedItems([...selectedItems, { id: itemId, quantity: 1 }]);
    }
    console.log('Itens selecionados:', selectedItems);
  };

  if (isLoading) return <Spin tip="Carregando..." />;
  if (error) return <Alert message="Erro ao carregar os dados" type="error" showIcon description={(error as Error).message} />;

  return (
    <div className="App">
      <header className="App-header">
        <NavBar selectedItems={selectedItems} items={items || []} setSelectedItems={setSelectedItems} /> 
      </header>
      <main className='home'
            style={{
              position: 'absolute',
              top: '20%'
            }}>
        <List
            grid={{ 
              xs: 1, // 1 coluna em dispositivos extra small (menor que 576px)
              sm: 1, // 2 colunas em dispositivos small (576px ou mais)
              md: 1, // 2 colunas em dispositivos medium (768px ou mais)
              lg: 4, // 4 colunas em dispositivos large (992px ou mais)
              xl: 4, // 4 colunas em dispositivos extra large (1200px ou mais)
              xxl: 4 // 4 colunas em dispositivos extra extra large (1600px ou mais)
            }}
          className='cards'
          dataSource={items}
          renderItem={item => (
            <List.Item>
              <Card
                id='card'
                hoverable
                style={{ width: '300px' }}
                cover={<img alt={item.name} src={item.photo} />}
                actions={[
                  <Button
                    style={{width:'100%', border:'none'}}
                    type={selectedItems.some(selectedItem => selectedItem.id === item.id) ? 'primary' : 'default'}
                    onClick={() => handleSelectItem(item.id)}
                  >
                    {selectedItems.some(selectedItem => selectedItem.id === item.id) ? 'Adicionar mais' : 'Adicionar ao Carrinho'}
                  </Button>
                ]}
              >
                <Card.Meta
                  title={`${item.name} - ${item.brand}`}
                  style={{ height: '250px' }}
                  description={
                    <>
                      <p>{item.description}</p>
                    </>
                  }
                />
                <p style={{
                  width: '100px',
                  position: 'absolute',
                  top: '40%',
                  right: '10%',
                  height: '50px',
                  backgroundColor: '#373737',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: '5px'
                }}>
                  {formatPrice(item.price)}
                </p>
              </Card>
            </List.Item>
          )}
        />
      </main>
    </div>
  );
};

const RootApp: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

export default RootApp;
