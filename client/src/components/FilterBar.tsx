import React from 'react';
import { Property } from '@/types/property';

interface FilterBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterType: Property['type'] | 'ALL';
    onFilterTypeChange: (value: Property['type'] | 'ALL') => void;
    filterStatus: Property['status'] | 'ALL';
    onFilterStatusChange: (value: Property['status'] | 'ALL') => void;
    priceRange: { min: number; max: number };
    onPriceRangeChange: (range: { min: number; max: number }) => void;
    areaRange: { min: number; max: number };
    onAreaRangeChange: (range: { min: number; max: number }) => void;
    onReset: () => void;
}

export default function FilterBar({
    searchTerm,
    onSearchChange,
    filterType,
    onFilterTypeChange,
    filterStatus,
    onFilterStatusChange,
    priceRange,
    onPriceRangeChange,
    areaRange,
    onAreaRangeChange,
    onReset,
}: FilterBarProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <input
                        type="text"
                        placeholder="제목 또는 주소로 검색..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                </div>

                {/* Type Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">유형</label>
                    <select
                        value={filterType}
                        onChange={(e) => onFilterTypeChange(e.target.value as Property['type'] | 'ALL')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="ALL">전체</option>
                        <option value="APARTMENT">아파트</option>
                        <option value="HOUSE">주택</option>
                        <option value="COMMERCIAL">상가</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">상태</label>
                    <select
                        value={filterStatus}
                        onChange={(e) => onFilterStatusChange(e.target.value as Property['status'] | 'ALL')}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="ALL">전체</option>
                        <option value="AVAILABLE">판매중</option>
                        <option value="SOLD">판매완료</option>
                        <option value="RENTED">임대완료</option>
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">가격 범위 (만원)</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            placeholder="최소"
                            value={priceRange.min || ''}
                            onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            placeholder="최대"
                            value={priceRange.max || ''}
                            onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Area Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">면적 범위 (m²)</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            placeholder="최소"
                            value={areaRange.min || ''}
                            onChange={(e) => onAreaRangeChange({ ...areaRange, min: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            placeholder="최대"
                            value={areaRange.max || ''}
                            onChange={(e) => onAreaRangeChange({ ...areaRange, max: Number(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-4 flex justify-end">
                <button
                    onClick={onReset}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
                >
                    필터 초기화
                </button>
            </div>
        </div>
    );
}
