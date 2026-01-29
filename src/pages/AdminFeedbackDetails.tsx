import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import type { Feedback } from '../types';
import {
    CalendarIcon,
    UserIcon,
    BuildingOfficeIcon,
    TagIcon,
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import jsPDF from 'jspdf';
import logoMIM from '../assets/logo_MIM.png';

const AdminFeedbackDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [adminAction, setAdminAction] = useState('');
    const [isSavingAction, setIsSavingAction] = useState(false);

    useEffect(() => {
        if (id) {
            loadFeedback(parseInt(id));
        }
    }, [id]);

    const loadFeedback = async (feedbackId: number) => {
        try {
            const data = await apiService.getFeedbackById(feedbackId);
            setFeedback(data);
            setAdminAction(data.action_admin || '');
        } catch (err) {
            setError('Impossible de charger les détails de la remontée.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!feedback) return;

        try {
            await apiService.updateStatus(feedback.id, newStatus);
            setFeedback(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour du statut");
        }
    };

    const handleAdminActionUpdate = async () => {
        if (!feedback) return;

        setIsSavingAction(true);
        try {
            await apiService.updateAdminAction(feedback.id, adminAction);
            // Update local state
            const updatedFeedback = { ...feedback, action_admin: adminAction };
            setFeedback(updatedFeedback);
            alert("Action mise à jour avec succès");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la mise à jour de l'action");
        } finally {
            setIsSavingAction(false);
        }
    };

    const generatePDF = () => {
        if (!feedback) return;

        const defaultName = `Fiche_Remontee_${feedback.id}_${feedback.nom}_${feedback.prenom}`;
        const fileNameInput = window.prompt("Nom du fichier (sans extension) :", defaultName);
        if (fileNameInput === null) return; // Annulé par l'utilisateur

        const finalName = fileNameInput.trim() || defaultName;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let yPos = 20;

        // Title
        doc.setFontSize(22);
        doc.setTextColor(255, 128, 0); // Orange
        doc.text("FICHE REMONTÉE D'INFORMATION", pageWidth / 2, yPos, { align: "center" });
        yPos += 15;

        // Reference & Date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Réf: #${feedback.id}`, margin, yPos);
        doc.text(`Date: ${new Date(feedback.date).toLocaleDateString()}`, pageWidth - margin - 30, yPos);
        yPos += 15;

        // Section 1: Demandeur
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.setFont("helvetica", "bold");
        doc.text("DEMANDEUR", margin + 5, yPos + 7);
        yPos += 20;

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Nom: ${feedback.nom.toUpperCase()}`, margin, yPos);
        doc.text(`Prénom: ${feedback.prenom}`, margin + 80, yPos);
        yPos += 10;
        doc.text(`Société: ${feedback.societe_agence}`, margin, yPos);
        if (feedback.lieu_client) {
            doc.text(`Lieu: ${feedback.lieu_client}`, margin + 80, yPos);
        }
        yPos += 15;

        // Section 2: Problème
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("DÉTAILS DU PROBLÈME", margin + 5, yPos + 7);
        yPos += 20;

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Type:", margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(feedback.type_probleme, margin + 40, yPos);
        yPos += 10;

        if (feedback.description) {
            doc.setFont("helvetica", "bold");
            doc.text("Description:", margin, yPos);
            yPos += 7;
            doc.setFont("helvetica", "normal");

            const splitDescription = doc.splitTextToSize(feedback.description, pageWidth - (margin * 2));
            doc.text(splitDescription, margin, yPos);
            yPos += (splitDescription.length * 5) + 5;
        }

        if (feedback.action) {
            doc.setFont("helvetica", "bold");
            doc.text("Action entreprise/suggérée:", margin, yPos);
            yPos += 7;
            doc.setFont("helvetica", "normal");

            const splitAction = doc.splitTextToSize(feedback.action, pageWidth - (margin * 2));
            doc.text(splitAction, margin, yPos);
            yPos += (splitAction.length * 5) + 5;
        }
        yPos += 10;

        // Section 3: Traitement Admin
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("TRAITEMENT ADMIN", margin + 5, yPos + 7);
        yPos += 20;

        doc.setFontSize(10);

        // Status
        doc.setFont("helvetica", "bold");
        doc.text("Statut final:", margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(feedback.status, margin + 40, yPos);
        yPos += 10;

        // Admin Action
        if (feedback.action_admin) {
            doc.setFont("helvetica", "bold");
            doc.text("Action réalisée par l'admin:", margin, yPos);
            yPos += 7;
            doc.setFont("helvetica", "normal");

            const splitAdminAction = doc.splitTextToSize(feedback.action_admin, pageWidth - (margin * 2));
            doc.text(splitAdminAction, margin, yPos);
            yPos += (splitAdminAction.length * 5) + 15;
        } else {
            yPos += 20;
        }

        // Add Logo at the bottom
        const img = new Image();
        img.src = logoMIM;
        img.onload = () => {
            const logoWidth = 40;
            const logoHeight = (img.height * logoWidth) / img.width;

            // Check if we need a new page or just add it at the bottom
            // Calculate remaining space
            const pageHeight = doc.internal.pageSize.getHeight();

            if (yPos + logoHeight > pageHeight - margin) {
                doc.addPage();
                yPos = 20;
            }

            // Center the logo
            const x = (pageWidth - logoWidth) / 2;

            doc.addImage(img, 'PNG', x, yPos, logoWidth, logoHeight);
            doc.save(`${finalName}.pdf`);
        };

        img.onerror = () => {
            // Fallback if image fails
            doc.save(`${finalName}.pdf`);
        };
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    if (error || !feedback) return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center text-red-500">
            <ExclamationTriangleIcon className="h-10 w-10 mb-2" />
            <p>{error || 'Remontée introuvable'}</p>
            <button
                onClick={() => navigate('/admin')}
                className="mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
                Retour au tableau de bord
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">

                {/* Header Navigation */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                        Retour
                    </button>
                    <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-sm font-mono text-gray-500 dark:text-gray-400">
                        Réf: #{feedback.id}
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">

                    {/* Card Header */}
                    <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-8 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Détails de la remontée</h1>
                            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-1">
                                <CalendarIcon className="h-5 w-5" />
                                Reçu le {new Date(feedback.date).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${feedback.status === 'En attente' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                feedback.status === 'Traité' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                }`}>
                                <span className={`h-2 w-2 rounded-full ${feedback.status === 'En attente' ? 'bg-orange-500' :
                                    feedback.status === 'Traité' ? 'bg-green-500' :
                                        'bg-blue-500'
                                    }`}></span>
                                {feedback.status}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Author & Context Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <UserIcon className="h-5 w-5 text-primary" />
                                    Auteur
                                </h4>
                                <div className="pl-2">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{feedback.nom} {feedback.prenom}</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                                    <BuildingOfficeIcon className="h-5 w-5 text-primary" />
                                    Contexte
                                </h4>
                                <div className="space-y-3 pl-2">
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">Société</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{feedback.societe_agence}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                                        <span className="text-gray-500 dark:text-gray-400 font-medium">Lieu</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{feedback.lieu_client}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Problem Type */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">
                                <TagIcon className="h-5 w-5 text-primary" />
                                Type de problème
                            </h4>
                            <div className="pl-2">
                                <div className="bg-orange-50/80 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/50 rounded-lg px-4 py-3 text-orange-800 dark:text-orange-300 font-bold inline-block shadow-sm">
                                    {feedback.type_probleme}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Description</h4>
                            <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-6 text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                                {feedback.description}
                            </div>
                        </div>

                        {/* Initial Action */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700 pb-2">Action Entreprise / Suggérée</h4>
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-6 text-blue-900 dark:text-blue-300 leading-relaxed whitespace-pre-wrap">
                                {feedback.action || "Aucune action spécifiée."}
                            </div>
                        </div>

                        {/* Admin Action Section */}
                        <div className="space-y-6 pt-8 border-t-2 border-gray-100 dark:border-gray-700">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white uppercase flex items-center gap-2">
                                <CheckCircleIcon className="h-6 w-6 text-green-600" />
                                Action Réalisée (Admin)
                            </h4>
                            <div className="bg-green-50/50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30 space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                    Notez ici les actions que vous avez effectuées pour résoudre cette demande. Cette information apparaîtra sur le PDF final.
                                </p>
                                <textarea
                                    value={adminAction}
                                    onChange={(e) => setAdminAction(e.target.value)}
                                    rows={5}
                                    className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-white dark:bg-gray-800 dark:text-white transition-colors"
                                    placeholder="Décrivez l'action que vous avez réalisée..."
                                />
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAdminActionUpdate}
                                        disabled={isSavingAction}
                                        className="px-6 py-2.5 bg-primary hover:bg-orange-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
                                    >
                                        {isSavingAction ?
                                            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Enregistrement...</span> :
                                            <span className="flex items-center gap-2"><CheckCircleIcon className="h-5 w-5" /> Enregistrer l'action</span>
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 dark:bg-gray-700/30 px-8 py-6 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4 w-full md:w-auto">
                            <label className="text-sm font-bold text-gray-600 dark:text-gray-300">Changer le statut:</label>
                            <select
                                value={feedback.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="flex-1 md:flex-none rounded-lg border-gray-300 dark:border-gray-600 py-2.5 pl-4 pr-10 text-sm focus:border-primary focus:ring-primary font-bold shadow-sm dark:bg-gray-700 dark:text-white cursor-pointer hover:border-primary transition-colors"
                            >
                                <option value="En attente">En attente</option>
                                <option value="En cours">En cours</option>
                                <option value="Traité">Traité</option>
                            </select>
                        </div>

                        <button
                            onClick={generatePDF}
                            className="w-full md:w-auto px-6 py-2.5 bg-gray-900 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-500 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                        >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                            Générer le PDF
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminFeedbackDetails;
