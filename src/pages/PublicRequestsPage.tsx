import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Feedback } from '../types';
import { SunIcon, MoonIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo_MIM.png';

const PublicRequestsPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        loadFeedback();
    }, []);

    const loadFeedback = async () => {
        try {
            const data = await apiService.getPublicFeedback();
            setFeedbackList(data);
        } catch (err: any) {
            setError(err.message || 'Impossible de charger les données.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'En attente':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800';
            case 'En cours':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'Traité':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10 flex flex-col transition-colors duration-200">
            <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="max-w-4xl w-full space-y-8 relative">
                    {/* Theme Toggle */}
                    <div className="absolute top-0 right-0 z-10">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors hover:bg-white dark:hover:bg-gray-800"
                            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
                        >
                            {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <img
                            src={logo}
                            alt="Logo MIM"
                            className="mx-auto h-16 w-auto mb-4 drop-shadow-sm brightness-100 dark:brightness-110"
                        />
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-b-4 border-primary relative overflow-hidden transition-colors">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-300 via-primary to-orange-600"></div>
                            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight uppercase">
                                Demandes <span className="text-primary">en cours</span>
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Consultez l'état de vos remontées d'information
                            </p>
                        </div>
                    </div>

                    {/* Back Button */}
                    <Link
                        to="/"
                        className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Retour au formulaire
                    </Link>

                    {/* Content */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center h-64 text-red-500 dark:text-red-400">
                                <svg className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <p>{error}</p>
                            </div>
                        ) : feedbackList.length === 0 ? (
                            <div className="p-16 text-center text-gray-500 dark:text-gray-400">
                                <svg className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p className="text-lg">Aucune demande pour le moment.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {feedbackList.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 sm:p-6 hover:bg-orange-50/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                                        onClick={() => setSelectedFeedback(item)}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        #{item.id} • {new Date(item.date).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                                    {item.prenom} {item.nom}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    <span className="font-medium text-primary">{item.type_probleme}</span>
                                                    {item.lieu_client && ` • ${item.lieu_client}`}
                                                </p>
                                            </div>
                                            <svg className="h-5 w-5 text-gray-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedFeedback(null)}
                    ></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all border border-gray-100 dark:border-gray-700">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur z-10 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Détails de la demande #{selectedFeedback.id}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedFeedback.status)}`}>
                                        {selectedFeedback.status}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(selectedFeedback.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Demandeur */}
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Demandeur</h4>
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedFeedback.prenom} {selectedFeedback.nom}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedFeedback.societe_agence}</p>
                                {selectedFeedback.lieu_client && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Lieu: {selectedFeedback.lieu_client}</p>
                                )}
                            </div>

                            {/* Type */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Type de problème</h4>
                                <span className="inline-block px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 font-medium border border-orange-100 dark:border-orange-800">
                                    {selectedFeedback.type_probleme}
                                </span>
                            </div>

                            {/* Description */}
                            {selectedFeedback.description && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Description</h4>
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {selectedFeedback.description}
                                    </div>
                                </div>
                            )}

                            {/* Action à réaliser */}
                            {selectedFeedback.action && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Action à réaliser</h4>
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-blue-700 dark:text-blue-300 whitespace-pre-wrap border border-blue-100 dark:border-blue-800">
                                        {selectedFeedback.action}
                                    </div>
                                </div>
                            )}

                            {/* Action Admin */}
                            {selectedFeedback.action_admin && (
                                <div>
                                    <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">Action réalisée par l'admin</h4>
                                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-green-700 dark:text-green-300 whitespace-pre-wrap border border-green-100 dark:border-green-800">
                                        {selectedFeedback.action_admin}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-4 rounded-b-2xl border-t border-gray-200 dark:border-gray-700 flex justify-end">
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-8 transition-colors">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} MIM Gestion Équipement. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default PublicRequestsPage;
