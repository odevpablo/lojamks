import { Product } from './types'; 

test('Product object conforms to Product interface', () => {
  const product: Product = {
    id: 1,
    name: 'Product Name',
    brand: 'Product Brand',
    description: 'Product Description',
    photo: 'product.jpg',
    price: 19.99,
  };

  expect(product.id).toBeDefined();
  expect(product.id).toEqual(expect.any(Number));

  expect(product.name).toBeDefined();
  expect(product.name).toEqual(expect.any(String));

  expect(product.brand).toBeDefined();
  expect(product.brand).toEqual(expect.any(String));

  expect(product.description).toBeDefined();
  expect(product.description).toEqual(expect.any(String));

  expect(product.photo).toBeDefined();
  expect(product.photo).toEqual(expect.any(String));

  expect(product.price).toBeDefined();
  expect(product.price).toEqual(expect.any(Number));
});
