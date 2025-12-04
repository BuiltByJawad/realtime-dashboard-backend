import { ProductStatus } from '../products/products.types';

export interface StatusCount {
    status: ProductStatus;
    count: number;
};

export interface CategoryCount {
    category: string;
    count: number;
};

export interface OverviewAnalytics {
    byStatus: StatusCount[];
    byCategory: CategoryCount[];
    totalInventoryValue: number;
};