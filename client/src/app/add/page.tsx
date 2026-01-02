"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProperty } from '@/services/propertyService';
import { formatKoreanPrice, formatToPyeong } from '@/lib/formatter';

export default function AddProperty() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        setIsSubmitting(true);
        try {
            await createProperty(formData);
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('매물 등록에 실패했습니다');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">새 매물 등록</h1>
                    <Link
                        href="/"
                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        ← 목록으로
                    </Link>
                </div>
            </header>

            {/* Form */}
            <main className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* 기본 정보 섹션 */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">기본 정보</h2>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        제목 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        required
                                        placeholder="예: 강남역 인근 신축 아파트"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                                        value={formData.title}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        설명
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={4}
                                        placeholder="매물에 대한 상세 설명을 입력하세요..."
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                                        value={formData.description}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        주소 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="address"
                                        name="address"
                                        type="text"
                                        required
                                        placeholder="예: 서울시 강남구 역삼동 123-45"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 상세 정보 섹션 */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">상세 정보</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        매물 유형 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                                        value={formData.type}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    >
                                        <option value="APARTMENT">아파트</option>
                                        <option value="HOUSE">주택</option>
                                        <option value="COMMERCIAL">상가</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        상태
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                                        value={formData.status}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    >
                                        <option value="AVAILABLE">판매중</option>
                                        <option value="SOLD">판매완료</option>
                                        <option value="RENTED">임대완료</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        가격 (원) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="price"
                                        name="price"
                                        type="number"
                                        required
                                        min="0"
                                        step="1000000"
                                        placeholder="예: 500000000"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                                        value={formData.price || ''}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                    {formData.price > 0 && (
                                        <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                                            {formatKoreanPrice(formData.price)}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        면적 (m²) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="area"
                                        name="area"
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        placeholder="예: 84.5"
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                                        value={formData.area || ''}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    />
                                    {formData.area > 0 && (
                                        <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">
                                            {formatToPyeong(formData.area)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 버튼 그룹 */}
                        <div className="flex gap-3 justify-end pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        등록 중...
                                    </>
                                ) : (
                                    '매물 등록'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
