export interface User {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
}

export interface Feedback {
    id: number;
    societe_agence: string;
    date: string;
    nom: string;
    prenom: string;
    lieu_client: string;
    type_probleme: string;
    description: string;
    action: string;
    status: string;
    created_at: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}
