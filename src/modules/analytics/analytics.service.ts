import { listProductsService } from '../products/products.service';
import { OverviewAnalytics, StatusCount, CategoryCount } from './analytics.types';

export async function getOverviewAnalytics(): Promise<OverviewAnalytics> {
    const products = await listProductsService();

    const byStatusMap = new Map<string, number>();
    const byCategoryMap = new Map<string, number>();

    let totalInventoryValue = 0;

    for(const p of products)
    {
        byStatusMap.set(p.status, (byStatusMap.get(p.status) ?? 0) + 1);
        
        if(p.category)
        {
            byCategoryMap.set(p.category, (byCategoryMap.get(p.category) ?? 0) + 1);
        }

        const quantity = typeof p.stock === 'number' ? p.stock : 1;
        totalInventoryValue += p.price * quantity;
    }

    const byStatus: StatusCount[] = Array.from(byStatusMap.entries()).map(([status, count]) => ({ status: status as any, count }));

    const byCategory: CategoryCount[] = Array.from(byCategoryMap.entries()).map(([category, count]) => ({ category, count }));

    return {
        byStatus,
        byCategory,
        totalInventoryValue,
    }
}