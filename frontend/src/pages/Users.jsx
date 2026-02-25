import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Loader2, X } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            const response = await axios.get(`${apiUrl}/users/`);
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            if (editingUser) {
                // Don't send empty passwords
                const dataToSend = { ...formData };
                if (!dataToSend.password) delete dataToSend.password;
                await axios.put(`${apiUrl}/users/${editingUser}`, dataToSend);
            } else {
                await axios.post(`${apiUrl}/users/`, formData);
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error) {
            console.error('Failed to save user:', error);
            alert('Error saving user');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                await axios.delete(`${apiUrl}/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error('Failed to delete user:', error);
            }
        }
    };

    const openEditModal = (user) => {
        setEditingUser(user.id);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role
        });
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ username: '', email: '', password: '', role: 'user' });
        setIsModalOpen(true);
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
            <div className="flex justify-between items-center bg-dark-800 p-6 rounded-2xl shadow-sm border border-dark-700">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
                    <p className="mt-2 text-sm text-gray-400">Manage system access and roles.</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    Add User
                </button>
            </div>

            <div className="glass-panel overflow-hidden">
                <table className="min-w-full divide-y divide-dark-700">
                    <thead className="bg-dark-900 bg-opacity-50 text-gray-400 uppercase tracking-wider text-xs font-medium">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left">Username</th>
                            <th scope="col" className="px-6 py-3 text-left">Email</th>
                            <th scope="col" className="px-6 py-3 text-left">Role</th>
                            <th scope="col" className="px-6 py-3 text-left">Created At</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-dark-800 bg-opacity-50 divide-y divide-dark-700">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-dark-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-300 font-bold border border-primary-800">
                                            {u.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="ml-3 font-medium text-white">{u.username}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${u.role === 'admin' ? 'bg-purple-900/50 text-purple-300 border-purple-800' : 'bg-accent-900/50 text-accent-300 border-accent-800'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openEditModal(u)} className="text-primary-400 hover:text-primary-300 mr-4 transition-colors">
                                        <Edit2 className="h-4 w-4 inline" />
                                    </button>
                                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-400 transition-colors" disabled={u.username === 'admin'}>
                                        <Trash2 className="h-4 w-4 inline" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-dark-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-dark-700">
                            <div className="bg-dark-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-5">
                                    <h3 className="text-xl leading-6 font-bold text-white" id="modal-title">
                                        {editingUser ? 'Edit User' : 'Add New User'}
                                    </h3>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-300">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Username</label>
                                        <input
                                            type="text"
                                            required
                                            className="mt-1 block w-full border border-dark-700 bg-dark-900 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={formData.username}
                                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                            disabled={editingUser && formData.username === 'admin'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Email</label>
                                        <input
                                            type="email"
                                            required
                                            className="mt-1 block w-full border border-dark-700 bg-dark-900 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">
                                            Password {editingUser && '(leave blank to keep current)'}
                                        </label>
                                        <input
                                            type="password"
                                            required={!editingUser}
                                            className="mt-1 block w-full border border-dark-700 bg-dark-900 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Role</label>
                                        <select
                                            className="mt-1 block w-full border border-dark-700 bg-dark-900 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            disabled={editingUser && formData.username === 'admin'}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="bg-dark-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse -mx-6 -mb-6 mt-6">
                                        <button
                                            type="submit"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-dark-700 shadow-sm px-4 py-2 bg-dark-900 text-base font-medium text-gray-300 hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
