"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProperties, updatePropertyStatus, deleteProperty } from '@/services/propertyService';
import { Property } from '@/types/property';
import { formatKoreanPrice, formatToPyeong } from '@/lib/formatter';

type FilterType = 'ALL' | 'ACTIVE' | 'INACTIVE';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [loading, setLoading] = useState(true);

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
      await updatePropertyStatus(id, newStatus);
      await loadProperties();
    } catch (error) {
      console.error(error);
      alert('매물 상태 변경에 실패했습니다');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`"${title}" 매물을 삭제하시겠습니까?`)) {
      try {
        await deleteProperty(id);
        await loadProperties();
      } catch (error) {
        console.error(error);
        alert('매물 삭제에 실패했습니다');
      }
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'ACTIVE') return property.status === 'AVAILABLE';
    if (filter === 'INACTIVE') return property.status === 'SOLD' || property.status === 'RENTED';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">부동산 관리 시스템</h1>
          <Link href="/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            매물 등록
          </Link>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded ${filter === 'ALL' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                전체
              </button>
              <button
                onClick={() => setFilter('ACTIVE')}
                className={`px-4 py-2 rounded ${filter === 'ACTIVE' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                활성 (판매중)
              </button>
              <button
                onClick={() => setFilter('INACTIVE')}
                className={`px-4 py-2 rounded ${filter === 'INACTIVE' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                비활성 (판매완료/임대완료)
              </button>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">등록된 매물</h2>

            {loading ? (
              <p className="text-gray-500">로딩 중...</p>
            ) : filteredProperties.length === 0 ? (
              <p className="text-gray-500">등록된 매물이 없습니다.</p>
            ) : (
              <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        상태
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        제목
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        주소
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        유형
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        가격
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        면적
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProperties.map((property) => (
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
