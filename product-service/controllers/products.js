import { products } from '../constants/products.js';

export const getAllProducts = () => Promise.resolve(products);

export const getSpecificProduct = (productId) => Promise.resolve(products.find((product) => product.id === productId));
