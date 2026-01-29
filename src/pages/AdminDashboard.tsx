import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Feedback } from '../types';
import {
    MagnifyingGlassIcon,
    ExclamationTriangleIcon,
    EyeIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
    const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deletingFeedback, setDeletingFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        loadFeedback();
    }, []);

    useEffect(() => {
        filterFeedback();
    }, [feedbackList, searchTerm, statusFilter]);

    const loadFeedback = async () => {
        try {
            const data = await apiService.getAllFeedback();
            setFeedbackList(data);
        } catch (err) {
            setError('Impossible de charger les données.');
        } finally {
            setLoading(false);
        }
    };

    const filterFeedback = () => {
        let filtered = feedbackList;

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(item =>
                item.nom.toLowerCase().includes(term) ||
                item.prenom.toLowerCase().includes(term) ||
                item.societe_agence.toLowerCase().includes(term) ||
                item.type_probleme.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        setFilteredFeedback(filtered);
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await apiService.updateStatus(id, newStatus);
            setFeedbackList(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const handleDelete = async () => {
        if (!deletingFeedback) return;

        try {
            await apiService.deleteFeedback(deletingFeedback.id);
            setFeedbackList(prev => prev.filter(item => item.id !== deletingFeedback.id));
            setDeletingFeedback(null);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression");
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
            <ExclamationTriangleIcon className="h-10 w-10 mb-2" />
            <p>{error}</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col hover:shadow-md transition-all">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">Total Remontées</span>
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">{feedbackList.length}</span>
                    <div className="h-1 w-12 bg-gray-200 dark:bg-gray-600 mt-4 rounded-full"></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-orange-100 dark:border-orange-900/50 bg-orange-50/30 dark:bg-orange-900/10 flex flex-col hover:shadow-md transition-all">
                    <span className="text-orange-600 dark:text-orange-400 text-sm font-medium uppercase tracking-wide">En Attente</span>
                    <span className="text-4xl font-extrabold text-orange-700 dark:text-orange-300 mt-2">
                        {feedbackList.filter(f => f.status === 'En attente').length}
                    </span>
                    <div className="h-1 w-12 bg-orange-200 dark:bg-orange-700/50 mt-4 rounded-full"></div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-green-100 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/10 flex flex-col hover:shadow-md transition-all">
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium uppercase tracking-wide">Traitées</span>
                    <span className="text-4xl font-extrabold text-green-700 dark:text-green-300 mt-2">
                        {feedbackList.filter(f => f.status === 'Traité').length}
                    </span>
                    <div className="h-1 w-12 bg-green-200 dark:bg-green-700/50 mt-4 rounded-full"></div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sticky top-20 z-10 backdrop-blur-md bg-white/90 dark:bg-gray-800/90">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, société, problème..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow bg-white dark:bg-gray-700 font-medium text-gray-700 dark:text-gray-200 shadow-sm cursor-pointer"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="En attente">En attente</option>
                        <option value="En cours">En cours</option>
                        <option value="Traité">Traité</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                {filteredFeedback.length === 0 ? (
                    <div className="p-16 text-center text-gray-500 dark:text-gray-400">
                        <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-lg">Aucune remontée ne correspond à vos critères.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auteur</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Société/Lieu</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredFeedback.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-orange-50/30 dark:hover:bg-gray-700/50 transition-colors group cursor-pointer"
                                        onClick={() => navigate(`/admin/feedback/${item.id}`)}
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-medium">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                            <div className="font-bold flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-primary font-bold text-xs">
                                                    {item.prenom[0]}{item.nom[0]}
                                                </div>
                                                {item.nom} {item.prenom}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                            <div className="font-semibold text-gray-900 dark:text-white">{item.societe_agence}</div>
                                            <div className="text-xs text-gray-400 dark:text-gray-500">{item.lieu_client}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase tracking-wide border border-gray-200 dark:border-gray-600">
                                                    {item.type_probleme}
                                                </span>
                                            </div>
                                            <div className="truncate text-gray-500 dark:text-gray-400" title={item.description}>{item.description}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm" onClick={(e) => e.stopPropagation()}>
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                className={`block w-full rounded-lg border-0 py-1.5 pl-3 pr-8 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-xs sm:leading-6 font-bold cursor-pointer transition-all dark:bg-gray-800 ${item.status === 'En attente' ? 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 ring-orange-200 dark:ring-orange-800' :
                                                    item.status === 'Traité' ? 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 ring-green-200 dark:ring-green-800' :
                                                        'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 ring-blue-200 dark:ring-blue-800'
                                                    }`}
                                            >
                                                <option value="En attente">En attente</option>
                                                <option value="En cours">En cours</option>
                                                <option value="Traité">Traité</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/feedback/${item.id}`);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-primary hover:bg-orange-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                                                    title="Voir les détails"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeletingFeedback(item);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
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

            {/* Delete Confirmation Modal */}
            {deletingFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setDeletingFeedback(null)}
                    ></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 text-center animate-fade-in border border-red-100 dark:border-red-900/50">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                            <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-500" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Confirmer la suppression</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
                            Êtes-vous sûr de vouloir supprimer la remontée de <span className="font-bold text-gray-800 dark:text-gray-300">{deletingFeedback.prenom} {deletingFeedback.nom}</span> ?<br />
                            Cette action est irréversible.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                onClick={() => setDeletingFeedback(null)}
                            >
                                Annuler
                            </button>
                            <button
                                type="button"
                                className="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors"
                                onClick={handleDelete}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
