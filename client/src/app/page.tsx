"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProperties, updatePropertyStatus, deleteProperty } from '@/services/propertyService';
import { Property } from '@/types/property';
import { formatKoreanPrice, formatToPyeong } from '@/lib/formatter';
import { useToast } from '@/components/ToastProvider';
import AuthButton from '@/components/AuthButton';

type FilterType = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Property; direction: 'asc' | 'desc' } | null>(null);
  const { showToast } = useToast();

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
    const matchesStatus =
      filter === 'ALL' ||
      (filter === 'ACTIVE' && property.status === 'AVAILABLE') ||
      (filter === 'INACTIVE' && (property.status === 'SOLD' || property.status === 'RENTED'));

    // Search Filter
    const matchesSearch =
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
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
            {/* Dashboard Stats */}
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

            {/* Filter & Search Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('ALL')}
                  className={`px-4 py-2 rounded transition-all ${filter === 'ALL' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  전체
                </button>
                <button
                  onClick={() => setFilter('ACTIVE')}
                  className={`px-4 py-2 rounded transition-all ${filter === 'ACTIVE' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  활성
                </button>
                <button
                  onClick={() => setFilter('INACTIVE')}
                  className={`px-4 py-2 rounded transition-all ${filter === 'INACTIVE' ? 'bg-gray-500 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  비활성
                </button>
              </div>

              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="제목 또는 주소로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm shadow-sm transition-all"
                />
              </div>
            </div>

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
