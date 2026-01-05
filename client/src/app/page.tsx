"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProperties, updatePropertyStatus, deleteProperty } from '@/services/propertyService';
import { Property } from '@/types/property';
import { formatKoreanPrice, formatToPyeong } from '@/lib/formatter';
import { useToast } from '@/components/ToastProvider';
import AuthButton from '@/components/AuthButton';
import DashboardCharts from '@/components/DashboardCharts';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filterType, setFilterType] = useState<Property['type'] | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<Property['status'] | 'ALL'>('ALL');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [areaRange, setAreaRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Property; direction: 'asc' | 'desc' } | null>(null);
  const { showToast } = useToast();

  const resetFilters = () => {
    setFilterType('ALL');
    setFilterStatus('ALL');
    setPriceRange({ min: 0, max: 0 });
    setAreaRange({ min: 0, max: 0 });
    setSearchTerm('');
  }

  const loadProperties = async () => {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updatePropertyStatus(id, newStatus as Property['status']);
      showToast('매물 상태가 변경되었습니다', 'success');
      await loadProperties();
    } catch (error) {
      console.error(error);
      showToast('매물 상태 변경에 실패했습니다', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`"${title}" 매물을 삭제하시겠습니까?`)) {
      try {
        await deleteProperty(id);
        showToast('매물이 삭제되었습니다', 'success');
        await loadProperties();
      } catch (error) {
        console.error(error);
        showToast('매물 삭제에 실패했습니다', 'error');
      }
    }
  };

  const handleSort = (key: keyof Property) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredProperties = properties.filter(property => {
    // Status Filter
    const matchesStatus = filterStatus === 'ALL' || property.status === filterStatus;

    // Type Filter
    const matchesType = filterType === 'ALL' || property.type === filterType;

    // Price Filter
    const matchesPrice =
      (priceRange.min === 0 && priceRange.max === 0) ||
      (property.price >= priceRange.min && (priceRange.max === 0 || property.price <= priceRange.max));

    // Area Filter
    const matchesArea =
      (areaRange.min === 0 && areaRange.max === 0) ||
      (property.area >= areaRange.min && (areaRange.max === 0 || property.area <= areaRange.max));

    // Search Filter
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesType && matchesPrice && matchesArea && matchesSearch;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">부동산 관리 시스템</h1>
          <div className="flex items-center gap-4">
            <Link href="/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
              매물 등록
            </Link>
            <AuthButton />
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Dashboard Charts */}
            <DashboardCharts properties={properties} />

            {/* Dashboard Stats Cards (Keeping as summary) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">전체 매물</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{properties.length}</p>
                  <p className="text-sm text-gray-500 font-normal">건</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">판매 중</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {properties.filter(p => p.status === 'AVAILABLE').length}
                  </p>
                  <p className="text-sm text-gray-500 font-normal">건</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">거래 완료</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {properties.filter(p => p.status !== 'AVAILABLE').length}
                  </p>
                  <p className="text-sm text-gray-500 font-normal">건</p>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">판매 중 가액</p>
                <div className="mt-1">
                  <p className="text-xl font-bold text-gray-900 dark:text-white truncate">
                    {formatKoreanPrice(properties.filter(p => p.status === 'AVAILABLE').reduce((acc, p) => acc + p.price, 0))}
                  </p>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              filterStatus={filterStatus}
              onFilterStatusChange={setFilterStatus}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              areaRange={areaRange}
              onAreaRangeChange={setAreaRange}
              onReset={resetFilters}
            />

            <div className="flex justify-between items-end mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">등록된 매물</h2>
              {searchTerm && (
                <p className="text-sm text-gray-500">
                  검색 결과: <span className="font-bold text-blue-600">{filteredProperties.length}</span>건
                </p>
              )}
            </div>

            {loading ? (
              <p className="text-gray-500 text-center py-10">로딩 중...</p>
            ) : filteredProperties.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-10 text-center">
                <p className="text-gray-500 mb-2">조건에 맞는 매물이 없습니다.</p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    검색어 초기화
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        상태
                      </th>
                      <th
                        onClick={() => handleSort('title')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        제목 {sortConfig?.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        주소
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        유형
                      </th>
                      <th
                        onClick={() => handleSort('price')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        가격 {sortConfig?.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th
                        onClick={() => handleSort('area')}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                      >
                        면적 {sortConfig?.key === 'area' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                            property.status === 'SOLD' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {property.title}
                          </div>
                          {property.images && property.images.length > 0 && (
                            <img src={property.images[0]} alt={property.title} className="mt-1 h-12 w-12 object-cover rounded-md" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {property.address}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-300">
                            {property.type}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                            {formatKoreanPrice(property.price)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-300">
                            {property.area} m²
                            <span className="ml-1 text-xs text-gray-500">({formatToPyeong(property.area)})</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <Link
                              href={`/edit/${property.id}`}
                              className="px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-xs transition-colors duration-150 font-medium"
                            >
                              수정
                            </Link>
                            <select
                              value={property.status}
                              onChange={(e) => handleStatusChange(property.id, e.target.value)}
                              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-xs bg-white dark:bg-gray-700 dark:text-gray-200"
                            >
                              <option value="AVAILABLE">판매중</option>
                              <option value="SOLD">판매완료</option>
                              <option value="RENTED">임대완료</option>
                            </select>
                            <button
                              onClick={() => handleDelete(property.id, property.title)}
                              className="px-2 py-1 bg-red-500 hover:bg-red-700 text-white rounded-md text-xs transition-colors duration-150"
                            >
                              삭제
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
