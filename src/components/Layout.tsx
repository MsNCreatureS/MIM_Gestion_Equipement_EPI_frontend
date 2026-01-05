import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Bars3Icon,
    XMarkIcon,
    HomeIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline';

import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo_MIM.png';

export default function Layout() {
    const { isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);


    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Adapting navigation for the current app
    const navigation = [
        { name: 'Tableau de bord', href: '/admin', icon: HomeIcon },
        // Add other links here if needed in the future, e.g. { name: 'Historique', href: '/history', icon: ClipboardDocumentListIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex h-16 items-center justify-between px-4 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-colors">
                    <img
                        src={logo}
                        alt="MIM Group Foselev"
                        className="h-10 object-contain transition-opacity duration-300 brightness-110"
                    />
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="mt-6 px-4">
                    <ul className="space-y-2">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.name}>
                                    <Link
                                        to={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${isActive
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 transition-all duration-200">
                {/* Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white dark:bg-gray-800 dark:border-gray-700 px-4 lg:px-6 shadow-sm transition-colors duration-200">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Gestion de l'Information
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>

                        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <UserCircleIcon className="h-6 w-6" />
                            <span>
                                {user?.prenom} {user?.nom}
                            </span>
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                                {user?.role}
                            </span>
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 hover:text-primary transition-colors"
                            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
                        >
                            {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Déconnexion</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="sm:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                            title="Déconnexion"
                        >
                            <ArrowRightOnRectangleIcon className="h-6 w-6" />
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
