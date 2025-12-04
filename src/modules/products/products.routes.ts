import { Router } from 'express';
import { validate } from '../../core/middleware/validate';
import {
  createProductSchema,
  updateProductSchema,
  changeStatusSchema,
} from './products.validator';
import {
  listProductsHandler,
  createProductHandler,
  updateProductHandler,
  deleteProductHandler,
  changeStatusHandler,
} from './products.controller';
import { authJwt } from '../../core/middleware/authJwt';

const router = Router();

// All product routes require authentication
router.use(authJwt);

router.get('/', listProductsHandler);
router.post('/', validate(createProductSchema), createProductHandler);
router.put('/:id', validate(updateProductSchema), updateProductHandler);
router.delete('/:id', deleteProductHandler);
router.patch('/:id/status', validate(changeStatusSchema), changeStatusHandler);

export default router;