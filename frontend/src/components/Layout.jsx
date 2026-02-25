import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users as UsersIcon, Activity, LogOut, Menu, X } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, adminOnly: false },
        { name: 'Activity Logs', href: '/activity', icon: Activity, adminOnly: false },
        { name: 'Users', href: '/users', icon: UsersIcon, adminOnly: true },
    ];

    return (
        <div className="min-h-screen bg-dark-900 flex flex-col md:flex-row">
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center justify-between bg-dark-900 p-4 text-white">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Nexus Enterprise</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-dark-900 text-gray-300 flex-shrink-0 shadow-2xl z-20`}>
                <div className="h-full flex flex-col">
                    <div className="p-6 hidden md:block">
                        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Nexus</span>
                    </div>

                    <div className="px-4 py-6">
                        <div className="flex items-center space-x-3 mb-8 px-2 glass-panel p-3 border-dark-700 bg-dark-800/50">
                            <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{user?.username}</p>
                                <p className="text-xs text-primary-400 uppercase tracking-wider">{user?.role}</p>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                if (item.adminOnly && user?.role !== 'admin') return null;
                                const isActive = location.pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                                            ? 'bg-primary-600 text-white shadow-md shadow-primary-900/20'
                                            : 'text-gray-400 hover:bg-dark-800 hover:text-white'
                                            }`}
                                    >
                                        <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="mt-auto p-4">
                        <button
                            onClick={logout}
                            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto animate-fade-in">
                <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
