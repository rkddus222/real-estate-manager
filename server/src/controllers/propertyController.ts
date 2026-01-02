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
