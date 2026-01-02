import { Router } from 'express';
import { getProperties, createProperty, getProperty, updateProperty, deleteProperty } from '../controllers/propertyController';

const router = Router();

router.get('/', getProperties);
router.post('/', createProperty);
router.get('/:id', getProperty);
router.patch('/:id', updateProperty);
router.delete('/:id', deleteProperty);

export default router;
