"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { getProperty, updateProperty } from '@/services/propertyService';
import { formatKoreanPrice, formatToPyeong } from '@/lib/formatter';
import { Property } from '@/types/property';
import { useToast } from '@/components/ToastProvider';
import AuthButton from '@/components/AuthButton';
import ImageUpload from '@/components/ImageUpload';

export default function EditProperty() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const { showToast } = useToast();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        address: '',
        price: 0,
        area: 0,
        type: 'APARTMENT' as Property['type'],
        status: 'AVAILABLE' as Property['status'],
        images: [] as string[],
    });

    const handleImageUpload = (urls: string[]) => {
        setFormData(prev => ({ ...prev, images: urls }));
    };

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const data = await getProperty(id);
                setFormData({
                    title: data.title,
                    description: data.description,
                    address: data.address,
                    price: data.price,
                    area: data.area,
                    type: data.type,
                    status: data.status,
                    images: data.images || [],
                });
            } catch (error) {
                console.error(error);
                showToast('매물 정보를 불러오는데 실패했습니다', 'error');
                router.push('/');
            } finally {
                setIsLoading(false);
            }
        };
        if (id) fetchProperty();
    }, [id, router]);

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
            await updateProperty(id, formData);
            showToast('매물 정보가 수정되었습니다', 'success');
            router.push('/');
            router.refresh();
        } catch (error) {
            console.error(error);
            showToast('매물 수정에 실패했습니다', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (confirm('수정 중인 내용이 사라집니다. 취소하시겠습니까?')) {
            router.push('/');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <p className="text-gray-500">정보를 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">매물 정보 수정</h1>
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            ← 목록으로
                        </Link>
                        <AuthButton />
                    </div>
                </div>
            </header>

            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                            <div className="p-6 space-y-6">
                                {/* 이미지 업로드 섹션 */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">매물 사진</h3>
                                    <ImageUpload existingImages={formData.images} onUploadComplete={handleImageUpload} />
                                </div>

                                {/* 기본 정보 섹션 */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">기본 정보</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                매물 제목
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="예: 강남역 도보 5분 채광 좋은 오피스텔"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                주소
                                            </label>
                                            <input
                                                type="text"
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="상세 주소를 입력하세요"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 상세 정보 섹션 */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">상세 정보</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                매물 유형
                                            </label>
                                            <select
                                                name="type"
                                                value={formData.type}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            >
                                                <option value="APARTMENT">아파트/오피스텔</option>
                                                <option value="HOUSE">주택/빌라</option>
                                                <option value="COMMERCIAL">상가/사무실</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                가격 (만원)
                                            </label>
                                            <input
                                                type="number"
                                                name="price"
                                                required
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                                                {formatKoreanPrice(formData.price)}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                면적 (m²)
                                            </label>
                                            <input
                                                type="number"
                                                name="area"
                                                required
                                                min="0"
                                                value={formData.area}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                약 {formatToPyeong(formData.area)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* 설명 섹션 */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        상세 설명
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={5}
                                        required
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="매물의 특징, 장점, 옵션 등을 자세히 적어주세요."
                                    />
                                </div>
                            </div>

                            {/* 버튼 섹션 */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500"
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
                                            저장 중...
                                        </>
                                    ) : (
                                        '정보 수정'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div >
    );
}
