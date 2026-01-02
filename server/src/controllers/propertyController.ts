import { Request, Response } from 'express';
import { Property } from '../types/property';
import { properties } from '../data/properties';
import { v4 as uuidv4 } from 'uuid';

// In-memory storage (mock DB)
let propertyStore = [...properties];

export const getProperties = (req: Request, res: Response) => {
    res.json(propertyStore);
};

export const createProperty = (req: Request, res: Response) => {
    const { title, description, address, price, area, type, status } = req.body;

    // Type casting for mock data simplicity, adding minimal validation in real app
    const newProperty: Property = {
        id: uuidv4(),
        title,
        description,
        address,
        price,
        area,
        type,
        status: status || 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    propertyStore.push(newProperty);
    res.status(201).json(newProperty);
};

export const getProperty = (req: Request, res: Response) => {
    const { id } = req.params;
    const property = propertyStore.find(p => p.id === id);
    if (!property) {
        res.status(404).json({ message: 'Property not found' });
        return;
    }
    res.json(property);
};

export const updateProperty = (req: Request, res: Response) => {
    const { id } = req.params;
    const index = propertyStore.findIndex(p => p.id === id);

    if (index === -1) {
        res.status(404).json({ message: 'Property not found' });
        return;
    }

    const updatedProperty = {
        ...propertyStore[index],
        ...req.body,
        updatedAt: new Date()
    };

    propertyStore[index] = updatedProperty;
    res.json(updatedProperty);
};

export const deleteProperty = (req: Request, res: Response) => {
    const { id } = req.params;
    const index = propertyStore.findIndex(p => p.id === id);

    if (index === -1) {
        res.status(404).json({ message: 'Property not found' });
        return;
    }

    propertyStore = propertyStore.filter(p => p.id !== id);
    res.status(204).send();
};
