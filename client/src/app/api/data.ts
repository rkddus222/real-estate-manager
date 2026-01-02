import { Property } from '@/types/property';

// In-memory storage (mock DB)
export let properties: Property[] = [
    {
        id: '1',
        title: '강남역 인근 신축 아파트',
        description: '시티뷰가 보이는 럭셔리 아파트입니다.',
        address: '서울시 강남구 테헤란로 123',
        price: 1500000000,
        area: 85,
        type: 'APARTMENT',
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        title: '마포구 아늑한 단독주택',
        description: '작은 정원이 있는 아름다운 주택입니다.',
        address: '서울시 마포구 마포대로 456',
        price: 900000000,
        area: 120,
        type: 'HOUSE',
        status: 'AVAILABLE',
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Helper to update properties
export const setProperties = (newProperties: Property[]) => {
    properties = newProperties;
};
