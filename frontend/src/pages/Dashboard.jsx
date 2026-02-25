import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line
} from 'recharts';
import { Users, Activity, ShieldAlert, Cpu } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({ users: 0, actions: 0 });
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // In a real app, this would fetch from a specific stats endpoint
        const fetchStats = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                // Mock data fetching for demo
                const actsResp = await axios.get(`${apiUrl}/activity${user.role === 'admin' ? '' : '/me'}?limit=20`);

                setStats({
                    users: user.role === 'admin' ? 12 : 1,
                    actions: actsResp.data.length
                });

                // Generate some mock chart data based on logs
                const mockData = [
                    { name: 'Mon', logins: 4, actions: 24 },
                    { name: 'Tue', logins: 3, actions: 13 },
                    { name: 'Wed', logins: 2, actions: 48 },
                    { name: 'Thu', logins: 6, actions: 39 },
                    { name: 'Fri', logins: 8, actions: 58 },
                    { name: 'Sat', logins: 1, actions: 12 },
                    { name: 'Sun', logins: 2, actions: 18 },
                ];
                setChartData(mockData);

            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        fetchStats();
    }, [user]);

    const statCards = [
        { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-primary-500' },
        { title: 'Recent Actions', value: stats.actions, icon: Activity, color: 'bg-accent-500' },
        { title: 'Security Status', value: 'Optimal', icon: ShieldAlert, color: 'bg-purple-500' },
        { title: 'System Load', value: '24%', icon: Cpu, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-400">Welcome back, {user?.username}. Here's what's happening today.</p>
                </div>
                <div className="mt-4 md:mt-0 glass-panel px-4 py-2 border-primary-100 flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-gray-300">System Online</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((item) => (
                    <div key={item.title} className="glass-panel p-6 border-transparent hover:border-dark-700 transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center">
                            <div className={`p-3 rounded-xl ${item.color} bg-opacity-10 text-opacity-100`}>
                                <item.icon className={`h-8 w-8 ${item.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-400 truncate">{item.title}</dt>
                                    <dd className="text-2xl font-bold text-white">{item.value}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-panel p-6 border-transparent">
                    <h3 className="text-lg font-medium text-white mb-4">Activity Overview</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ borderRadius: '0.5rem', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} />
                                <Bar dataKey="actions" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 border-transparent">
                    <h3 className="text-lg font-medium text-white mb-4">Connection Analytics</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ borderRadius: '0.5rem', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }} />
                                <Line type="smooth" dataKey="logins" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
