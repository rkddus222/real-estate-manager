import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const properties = await prisma.property.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const property = await prisma.property.create({
            data: {
                title: body.title,
                description: body.description,
                address: body.address,
                price: body.price,
                area: body.area,
                type: body.type,
                status: body.status || 'AVAILABLE',
            },
        });
        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}
