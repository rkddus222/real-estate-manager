import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) {
            return NextResponse.json(
                { message: 'Property not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(property);
    } catch (error) {
        console.error('Failed to fetch property:', error);
        return NextResponse.json(
            { message: 'Failed to fetch property' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;
        const body = await request.json();

        // Remove id and dates from body if present to avoid errors
        const { id: _, createdAt, updatedAt, ...updateData } = body;

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json(updatedProperty);
    } catch (error) {
        console.error('Failed to update property:', error);
        return NextResponse.json(
            { message: 'Failed to update property' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const id = (await params).id;

        await prisma.property.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete property:', error);
        return NextResponse.json(
            { message: 'Failed to delete property' },
            { status: 500 }
        );
    }
}
