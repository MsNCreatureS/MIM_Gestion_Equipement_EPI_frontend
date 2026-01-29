import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import {
    PlusIcon,
    TrashIcon,
    ArrowLeftIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    NoSymbolIcon
} from '@heroicons/react/24/outline';

interface ProblemType {
    id: number;
    label: string;
    is_active: boolean;
    created_at?: string;
}

const AdminTypesPage = () => {
    const navigate = useNavigate();
    const [types, setTypes] = useState<ProblemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newTypeLabel, setNewTypeLabel] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadTypes();
    }, []);

    const loadTypes = async () => {
        try {
            const data = await apiService.getAdminTypes();
            setTypes(data);
        } catch (err) {
            setError('Impossible de charger les types.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateType = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTypeLabel.trim()) return;

        setIsSubmitting(true);
        try {
            await apiService.createType(newTypeLabel.trim().toUpperCase());
            setNewTypeLabel('');
            await loadTypes(); // Reload list
        } catch (err: any) {
            alert(err.message || "Erreur lors de la création.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleActive = async (type: ProblemType) => {
        try {
            await apiService.updateType(type.id, { is_active: !type.is_active });
            setTypes(prev => prev.map(t => t.id === type.id ? { ...t, is_active: !t.is_active } : t));
        } catch (err) {
            alert("Erreur lors de la mise à jour.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce type ? Cette action est irréversible.")) return;

        try {
            await apiService.deleteType(id);
            setTypes(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            alert("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Retour Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Types de Problèmes</h1>
                </div>

                {/* Create New Type Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Ajouter un nouveau type</h2>
                    <form onSubmit={handleCreateType} className="flex gap-4">
                        <input
                            type="text"
                            value={newTypeLabel}
                            onChange={(e) => setNewTypeLabel(e.target.value)}
                            placeholder="Ex: PROBLÈME ÉLECTRIQUE"
                            className="flex-1 rounded-lg border-gray-300 dark:border-gray-600 py-2.5 px-4 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newTypeLabel.trim()}
                            className="px-6 py-2.5 bg-primary hover:bg-orange-600 text-white font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Ajout...' : <><PlusIcon className="h-5 w-5" /> Ajouter</>}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {loading ? (
                        <div className="p-12 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500 flex flex-col items-center">
                            <ExclamationTriangleIcon className="h-8 w-8 mb-2" />
                            {error}
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50/80 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Libellé</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {types.map((type) => (
                                    <tr key={type.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                                            {type.label}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(type)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${type.is_active
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
                                                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'
                                                    }`}
                                            >
                                                {type.is_active ? (
                                                    <><CheckCircleIcon className="h-3.5 w-3.5" /> Actif</>
                                                ) : (
                                                    <><NoSymbolIcon className="h-3.5 w-3.5" /> Inactif</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(type.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                title="Supprimer définitivement"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {types.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            Aucun type de problème défini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTypesPage;
