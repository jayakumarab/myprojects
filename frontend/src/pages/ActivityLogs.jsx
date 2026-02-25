import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Clock, Loader2 } from 'lucide-react';

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const endpoint = user?.role === 'admin' ? '/activity' : '/activity/me';
            const response = await axios.get(`${apiUrl}${endpoint}`);
            setLogs(response.data);
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-primary-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Activity Logs</h1>
                <p className="mt-2 text-sm text-gray-400">System audit trail and user action history.</p>
            </div>

            <div className="glass-panel overflow-hidden">
                <div className="min-w-full divide-y divide-dark-700">
                    <div className="bg-dark-900 bg-opacity-50">
                        <div className="grid grid-cols-4 px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <span className="col-span-1">Timestamp</span>
                            <span className="col-span-1">User ID</span>
                            <span className="col-span-2">Action</span>
                        </div>
                    </div>
                    <div className="bg-dark-800 bg-opacity-50 divide-y divide-dark-700">
                        {logs.length > 0 ? logs.map((log) => (
                            <div key={log.id} className="grid grid-cols-4 px-6 py-4 flex items-center hover:bg-dark-700/50 transition-colors">
                                <div className="col-span-1 flex items-center text-sm text-gray-400">
                                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                                    {new Date(log.timestamp).toLocaleString()}
                                </div>
                                <div className="col-span-1 text-sm font-medium text-white">
                                    USR-{log.user_id.toString().padStart(4, '0')}
                                </div>
                                <div className="col-span-2 text-sm text-gray-300">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-900/50 text-primary-300 border border-primary-800">
                                        {log.action}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div className="px-6 py-12 text-center text-gray-400">
                                No activity logs found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityLogs;
