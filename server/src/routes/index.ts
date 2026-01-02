import { Router } from 'express';
import propertyRoutes from './propertyRoutes';

const router = Router();

router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});

router.use('/properties', propertyRoutes);

export default router;
