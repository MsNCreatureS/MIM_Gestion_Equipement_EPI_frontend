import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo_MIM.png';

const FormPage = () => {
    const { isDark, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({
        societe: 'MIM',
        date: new Date().toISOString().split('T')[0],
        nom: '',
        prenom: '',
        lieu: '',
        type: '',
        description: '',
        action: ''
    });
    const [otherType, setOtherType] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [problemTypes, setProblemTypes] = useState<string[]>([]);

    useEffect(() => {
        const loadTypes = async () => {
            try {
                const types = await apiService.getTypes();
                setProblemTypes([...types.map(t => t.label), 'Autre']);
            } catch (err) {
                console.error("Failed to load types", err);
                // Fallback to default types if API fails
                setProblemTypes(['AMELIORATION', 'NON CONFORMITE', 'SITUATION DANGEREUSE', 'INFORMATION SUITE A UNE CAUSERIE', 'Autre']);
            }
        };
        loadTypes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const submissionData = { ...formData };
            if (submissionData.type === 'Autre') {
                submissionData.type = otherType;
            }

            await apiService.submitFeedback(submissionData);
            setStatus('success');
            setOtherType('');
            setFormData({
                societe: 'MIM',
                date: new Date().toISOString().split('T')[0],
                nom: '',
                prenom: '',
                lieu: '',
                type: '',
                description: '',
                action: ''
            });
        } catch (error: any) {
            console.error(error);
            setStatus('error');
            setErrorMessage(error.message || "Une erreur est survenue.");
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 text-center transform transition-all hover:scale-105 duration-300">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Envoyé !</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">Merci pour votre remontée d'information. Elle a bien été prise en compte.</p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-orange-600 hover:to-orange-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-800"
                    >
                        Nouvelle fiche
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-900 dark:to-orange-900/10 flex flex-col transition-colors duration-200">
            <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <div className="max-w-3xl w-full space-y-8 relative">
                    <div className="absolute top-0 right-0 z-10">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors hover:bg-white dark:hover:bg-gray-800"
                            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
                        >
                            {isDark ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Header with Logo */}
                    <div className="text-center transform transition-all hover:scale-[1.01] duration-500">
                        <img
                            src={logo}
                            alt="Logo MIM"
                            className="mx-auto h-20 w-auto mb-6 drop-shadow-sm brightness-100 dark:brightness-110"
                        />
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-t-3xl shadow-xl border-b-6 border-primary relative overflow-hidden transition-colors">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-300 via-primary to-orange-600"></div>
                            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight uppercase mb-2">
                                Fiche Remontée <span className="text-primary">Info</span>
                            </h1>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 inline-block px-3 py-1 rounded-full">
                                Réf: LT 25-100-PM-A
                            </p>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white dark:bg-gray-800 px-6 py-8 md:px-10 shadow-2xl rounded-b-3xl -mt-4 border-x border-b border-gray-100 dark:border-gray-700 relative z-10 transition-colors">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Section 1: Info Generale */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 text-primary border-b border-orange-100 dark:border-gray-700 pb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Informations Générales</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                                    {/* Societe */}
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            1. SOCIÉTÉ / AGENCE
                                        </label>
                                        <input
                                            type="text"
                                            name="societe"
                                            value="MIM"
                                            readOnly
                                            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm py-3 px-4 bg-gray-100 dark:bg-gray-600 dark:text-white cursor-not-allowed font-semibold text-gray-700"
                                        />
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            2. DATE <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-colors"
                                        />
                                    </div>

                                    {/* Nom */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            3. NOM <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nom"
                                            value={formData.nom}
                                            onChange={handleChange}
                                            required
                                            placeholder="Votre nom"
                                            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-colors"
                                        />
                                    </div>

                                    {/* Prenom */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            PRÉNOM <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="prenom"
                                            value={formData.prenom}
                                            onChange={handleChange}
                                            required
                                            placeholder="Votre prénom"
                                            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-colors"
                                        />
                                    </div>

                                    {/* Lieu */}
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            4. LIEU - CLIENT <span className="text-primary">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lieu"
                                            value={formData.lieu}
                                            onChange={handleChange}
                                            required
                                            placeholder="Entrez votre réponse"
                                            className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Details */}
                            <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center space-x-2 text-primary border-b border-orange-100 dark:border-gray-700 pb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">Détails de la Remontée</h3>
                                </div>

                                {/* Type */}
                                <fieldset>
                                    <legend className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
                                        5. TYPE : PROBLÈME RENCONTRÉ <span className="text-primary">*</span>
                                    </legend>


                                    // ... existing code ...

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {problemTypes.map((type) => (
                                            <label
                                                key={type}
                                                className={`relative flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${formData.type === type
                                                    ? 'border-primary bg-orange-50 dark:bg-orange-900/20 ring-1 ring-primary'
                                                    : 'border-gray-200 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={type}
                                                    checked={formData.type === type}
                                                    onChange={handleChange}
                                                    required
                                                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                                />
                                                <span className="ml-3 block text-sm font-medium text-gray-900 dark:text-gray-200">
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Input pour "Autre" */}
                                    {formData.type === 'Autre' && (
                                        <div className="mt-4 animate-fadeIn">
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                                Précisez le type de problème <span className="text-primary">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={otherType}
                                                onChange={(e) => setOtherType(e.target.value)}
                                                required
                                                placeholder="Veuillez préciser..."
                                                className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-colors"
                                            />
                                        </div>
                                    )}
                                </fieldset>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        6. DESCRIPTION DE L'INFORMATION
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-colors"
                                        placeholder="Décrivez la situation en détails..."
                                    />
                                </div>

                                {/* Action */}
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        7. ACTION À RÉALISER
                                    </label>
                                    <textarea
                                        name="action"
                                        rows={3}
                                        value={formData.action}
                                        onChange={handleChange}
                                        className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary py-3 px-4 bg-gray-50 dark:bg-gray-700 dark:text-white hover:bg-white dark:hover:bg-gray-600 transition-colors"
                                        placeholder="Action immédiate prise ou suggérée..."
                                    />
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-900/50 animate-pulse">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-bold text-red-800 dark:text-red-300">Oups ! Une erreur est survenue</h3>
                                            <p className="text-sm text-red-700 dark:text-red-400 mt-1">{errorMessage}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-primary to-primary-dark hover:from-orange-600 hover:to-orange-800 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${status === 'submitting' ? 'opacity-70 cursor-wait' : ''
                                    }`}
                            >
                                {status === 'submitting' ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Envoi en cours...
                                    </>
                                ) : (
                                    'ENVOYER LA FICHE'
                                )}
                            </button>

                            {/* Button to view pending requests */}
                            <Link
                                to="/demandes"
                                className="w-full flex justify-center items-center py-3 px-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 font-medium hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-all mt-4"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Voir les demandes en cours
                            </Link>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}

            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-8 transition-colors">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400 text-sm mb-4">
                        © {new Date().getFullYear()} MIM Gestion Équipement. Tous droits réservés.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center text-xs font-medium text-gray-400 hover:text-primary transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Accès Admin
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default FormPage;
