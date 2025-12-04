import { Request, Response } from "express";
import {
  listProductsService,
  createProductService,
  updateProductService,
  deleteProductService,
  changeStatusService,
} from './products.service';
import { CreateProductInput, UpdateProductInput } from './products.types';

export const listProductsHandler = async (req: Request, res: Response) => {
    const products = await listProductsService();
    res.json({ success: true, data: products });
};

export const createProductHandler = async (req: Request, res: Response) => {
    const input = req.body as CreateProductInput;
    const product = await createProductService(input);
    res.status(201).json({ success: true, data: product });
};

export const updateProductHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const input = req.body as UpdateProductInput;

    const updated = await updateProductService(id, input);
    if(!updated)
    {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: updated });
};

export const deleteProductHandler = async (req: Request, res: Response) => {
    const id = req.params.id;

    const deleted = await deleteProductService(id);
    if(!deleted)
    {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.status(204).send();
};

export const changeStatusHandler = async (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body as { status: 'active' | 'inactive' };

    const updated = await changeStatusService(id, status);
    if(!updated)
    {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: updated });
};