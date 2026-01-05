"use client";

import React from 'react';
import { Property } from '@/types/property';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface DashboardChartsProps {
    properties: Property[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardCharts({ properties }: DashboardChartsProps) {
    // Data for Status Pie Chart
    const statusData = [
        { name: '판매중', value: properties.filter(p => p.status === 'AVAILABLE').length },
        { name: '판매완료', value: properties.filter(p => p.status === 'SOLD').length },
        { name: '임대완료', value: properties.filter(p => p.status === 'RENTED').length },
    ].filter(d => d.value > 0);

    // Data for Type Bar Chart
    const typeData = [
        { name: '아파트', count: properties.filter(p => p.type === 'APARTMENT').length },
        { name: '주택', count: properties.filter(p => p.type === 'HOUSE').length },
        { name: '상가', count: properties.filter(p => p.type === 'COMMERCIAL').length },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Status Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">매물 상태 현황</h3>
                <div className="h-64">
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            데이터가 없습니다
                        </div>
                    )}
                </div>
            </div>

            {/* Type Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">유형별 매물 수</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={typeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#888888" />
                            <YAxis allowDecimals={false} stroke="#888888" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px' }}
                                cursor={{ fill: 'transparent' }}
                            />
                            <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
                                {typeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
