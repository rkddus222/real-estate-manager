import { NextResponse } from 'next/server';
import { properties, setProperties } from '../data';
import { Property } from '@/types/property';

export async function GET() {
    return NextResponse.json(properties);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, address, price, area, type, status } = body;

        const newProperty: Property = {
            id: crypto.randomUUID(),
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

        properties.push(newProperty);

        return NextResponse.json(newProperty, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: 'Error creating property' },
            { status: 500 }
        );
    }
}
