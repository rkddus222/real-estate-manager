import { NextResponse } from 'next/server';
import { properties, setProperties } from '../../data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const property = properties.find(p => p.id === id);

    if (!property) {
        return NextResponse.json(
            { message: 'Property not found' },
            { status: 404 }
        );
    }

    return NextResponse.json(property);
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const body = await request.json();

    const index = properties.findIndex(p => p.id === id);
    if (index === -1) {
        return NextResponse.json(
            { message: 'Property not found' },
            { status: 404 }
        );
    }

    const updatedProperty = {
        ...properties[index],
        ...body,
        updatedAt: new Date(),
    };

    properties[index] = updatedProperty;

    return NextResponse.json(updatedProperty);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const index = properties.findIndex(p => p.id === id);

    if (index === -1) {
        return NextResponse.json(
            { message: 'Property not found' },
            { status: 404 }
        );
    }

    const newProperties = properties.filter(p => p.id !== id);
    setProperties(newProperties);

    return new NextResponse(null, { status: 204 });
}
