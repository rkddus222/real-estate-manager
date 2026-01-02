import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/properties
export async function GET() {
    try {
        const properties = await prisma.property.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Failed to fetch properties:', error);
        return NextResponse.json(
            { message: 'Failed to fetch properties' },
            { status: 500 }
        );
    }
}

// POST /api/properties
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, address, price, area, type, status } = body;

        const newProperty = await prisma.property.create({
            data: {
                title,
                description,
                address,
                price,
                area,
                type,
                status: status || 'AVAILABLE',
            },
        });

        return NextResponse.json(newProperty, { status: 201 });
    } catch (error) {
        console.error('Failed to create property:', error);
        return NextResponse.json(
            { message: 'Error creating property' },
            { status: 500 }
        );
    }
}
