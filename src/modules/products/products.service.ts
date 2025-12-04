import {
  CreateProductInput,
  UpdateProductInput,
  Product,
  ProductStatus,
} from './products.types';
import {
  getAllProducts,
  createProductRepo,
  updateProductRepo,
  deleteProductRepo,
  changeStatusRepo,
} from './products.repository';

export async function listProductsService(): Promise<Product[]> {
    return getAllProducts();
};

export async function createProductService(input: CreateProductInput): Promise<Product> {
    return createProductRepo(input);
};

export async function updateProductService(id: string, input: UpdateProductInput): Promise<Product | null> {
    return updateProductRepo(id, input);
};

export async function deleteProductService(id: string): Promise<boolean> {
    return deleteProductRepo(id);
};

export async function changeStatusService(id: string, status: ProductStatus): Promise<Product | null> {
    return changeStatusRepo(id, status);
};