"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProperty } from '@/services/propertyService';

export default function AddProperty() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        price: 0,
        area: 0,
        type: 'APARTMENT' as 'APARTMENT' | 'HOUSE' | 'COMMERCIAL',
        status: 'AVAILABLE' as 'AVAILABLE' | 'SOLD' | 'RENTED',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'area' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProperty(formData);
            router.push('/');
            router.refresh(); // Refresh server components
        } catch (error) {
            console.error(error);
            alert('매물 등록에 실패했습니다');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    새 매물 등록
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
                            <div className="mt-1">
                                <input id="title" name="title" type="text" required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.title} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">설명</label>
                            <div className="mt-1">
                                <textarea id="description" name="description" rows={3}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.description} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">주소</label>
                            <div className="mt-1">
                                <input id="address" name="address" type="text" required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.address} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">가격 (원)</label>
                                <div className="mt-1">
                                    <input id="price" name="price" type="number" required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.price} onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="flex-1">
                                <label htmlFor="area" className="block text-sm font-medium text-gray-700">면적 (m²)</label>
                                <div className="mt-1">
                                    <input id="area" name="area" type="number" required
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={formData.area} onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">유형</label>
                            <div className="mt-1">
                                <select id="type" name="type"
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    value={formData.type} onChange={handleChange}
                                >
                                    <option value="APARTMENT">아파트</option>
                                    <option value="HOUSE">주택</option>
                                    <option value="COMMERCIAL">상가</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                매물 등록
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
