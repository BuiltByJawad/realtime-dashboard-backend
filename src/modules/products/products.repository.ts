import { firestore } from '../../config/firebase';
import {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductStatus,
} from './products.types';

const collection = firestore.collection('products');

function mapDocToProduct(doc: FirebaseFirestore.DocumentSnapshot): Product {
    const data = doc.data() || {};

    return {
        id: doc.id,
        name: data.name,
        price: data.price,
        status: data.status,
        category: data.category,
        stock: data.stock,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};

export async function getAllProducts(): Promise<Product[]> {
    const snapshot = await collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(mapDocToProduct);
};

export async function createProductRepo(input: CreateProductInput): Promise<Product> {
    const now = new Date().toISOString();

    const docRef = await collection.add({
        ...input,
        status: input.status ?? 'active',
        createdAt: now,
        updatedAt: now,
    });

    const saved = await docRef.get();
    return mapDocToProduct(saved);
};

export async function updateProductRepo(id: string, input: UpdateProductInput): Promise<Product | null> {
    const docRef = collection.doc(id);
    const doc = await docRef.get();
    if(!doc.exists) return null;

    const now = new Date().toISOString();
    await docRef.update({
        ...input,
        updatedAt: now,
    });

    const updated = await docRef.get();
    return mapDocToProduct(updated);
};

export async function deleteProductRepo(id: string): Promise<boolean> {
  const docRef = collection.doc(id);
  const doc = await docRef.get();
  if(!doc.exists) return false;

  await docRef.delete();
  return true;
};

export async function changeStatusRepo(
  id: string,
  status: ProductStatus
): Promise<Product | null> {
  return updateProductRepo(id, { status });
};