// ════════════════════════════════════════════════════════════
//  src/services/api.ts
//  À créer dans ton projet React TailAdmin
//  Remplace progressivement les imports de mockData
// ════════════════════════════════════════════════════════════

const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

// ── Helper fetch de base ──────────────────────────────────────────────────
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("challengehub_token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw data; // { message, errors? }
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, mot_de_passe: string) =>
    apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, mot_de_passe }),
    }).then((data) => {
      localStorage.setItem("challengehub_token", data.token);
      return data;
    }),

  register: (payload: {
    nom: string; prenom: string; email: string;
    mot_de_passe: string; mot_de_passe_confirmation: string;
  }) =>
    apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((data) => {
      localStorage.setItem("challengehub_token", data.token);
      return data;
    }),

  logout: () =>
    apiFetch("/auth/logout", { method: "POST" }).finally(() => {
      localStorage.removeItem("challengehub_token");
    }),

  me: () => apiFetch("/auth/me"),

  updateProfile: (payload: Partial<{ nom: string; prenom: string; email: string; bio: string }>) =>
    apiFetch("/auth/me", { method: "PUT", body: JSON.stringify(payload) }),

  updatePassword: (payload: {
    mot_de_passe_actuel: string;
    mot_de_passe: string;
    mot_de_passe_confirmation: string;
  }) =>
    apiFetch("/auth/me/password", { method: "PUT", body: JSON.stringify(payload) }),
};

// ── Challenges ────────────────────────────────────────────────────────────
export const challengesApi = {
  list: (params?: {
    search?: string; type_id?: number; statut?: string; page?: number;
  }) => {
    const qs = new URLSearchParams(
      Object.entries(params ?? {})
        .filter(([, v]) => v !== undefined && v !== "")
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return apiFetch(`/challenges${qs ? "?" + qs : ""}`);
  },

  show: (id: number) => apiFetch(`/challenges/${id}`),

  create: (payload: {
    nom: string; description: string; type_id: number;
    nb_participants_min: number; nb_participants_max?: number;
    frais_participation: number; date_lancement: string; date_cloture: string;
    visibilite: string;
    trophees: Array<{ rang: number; description: string; valeur_monetaire?: number; type_trophee: string }>;
    jury?: string[];
  }) =>
    apiFetch("/challenges", { method: "POST", body: JSON.stringify(payload) }),

  update: (id: number, payload: Partial<{ nom: string; description: string; date_cloture: string; visibilite: string }>) =>
    apiFetch(`/challenges/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

  delete: (id: number) =>
    apiFetch(`/challenges/${id}`, { method: "DELETE" }),

  mesChallenges: () => apiFetch("/challenges/mes-challenges"),

  publier: (id: number) =>
    apiFetch(`/challenges/${id}/publier`, { method: "POST" }),

  annuler: (id: number) =>
    apiFetch(`/challenges/${id}/annuler`, { method: "POST" }),

  publierResultats: (id: number) =>
    apiFetch(`/challenges/${id}/publier-resultats`, { method: "POST" }),

  resultats: (id: number) => apiFetch(`/challenges/${id}/resultats`),
};

// ── Participations ────────────────────────────────────────────────────────
export const participationsApi = {
  list: () => apiFetch("/participations"),

  show: (id: number) => apiFetch(`/participations/${id}`),

  participer: (challengeId: number) =>
    apiFetch(`/challenges/${challengeId}/participer`, { method: "POST" }),
};

// ── Soumissions ───────────────────────────────────────────────────────────
export const soumissionsApi = {
  soumettre: (participationId: number, payload: {
    type_livrable: string; url_fichier: string; description?: string;
  }) =>
    apiFetch(`/participations/${participationId}/soumettre`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id: number, payload: Partial<{ type_livrable: string; url_fichier: string; description: string }>) =>
    apiFetch(`/soumissions/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
};

// ── Jury ──────────────────────────────────────────────────────────────────
export const juryApi = {
  mesChallenges: () => apiFetch("/jury/challenges"),

  soumissions: (challengeId: number) =>
    apiFetch(`/jury/challenges/${challengeId}/soumissions`),

  repondreInvitation: (juryId: number, reponse: "accepte" | "refuse") =>
    apiFetch(`/jury/invitations/${juryId}`, {
      method: "PUT",
      body: JSON.stringify({ reponse }),
    }),
};

// ── Évaluations ───────────────────────────────────────────────────────────
export const evaluationsApi = {
  noter: (payload: { soumission_id: number; note: number; commentaire?: string }) =>
    apiFetch("/evaluations", { method: "POST", body: JSON.stringify(payload) }),

  update: (id: number, payload: { note: number; commentaire?: string }) =>
    apiFetch(`/evaluations/${id}`, { method: "PUT", body: JSON.stringify(payload) }),

  delete: (id: number) =>
    apiFetch(`/evaluations/${id}`, { method: "DELETE" }),
};

// ── Notifications ─────────────────────────────────────────────────────────
export const notificationsApi = {
  list: (page = 1) => apiFetch(`/notifications?page=${page}`),

  marquerLu: (id: number) =>
    apiFetch(`/notifications/${id}/lire`, { method: "PUT" }),

  marquerToutLu: () =>
    apiFetch("/notifications/lire-tout", { method: "PUT" }),

  delete: (id: number) =>
    apiFetch(`/notifications/${id}`, { method: "DELETE" }),
};

// ── Wallet ────────────────────────────────────────────────────────────────
export const walletApi = {
  solde: () => apiFetch("/wallet/solde"),
  transactions: (page = 1) => apiFetch(`/wallet/transactions?page=${page}`),
};

// ── Types challenge ───────────────────────────────────────────────────────
export const typesApi = {
  list: () => apiFetch("/types-challenge"),
};

// ── Hook utilitaire : vérifier si connecté ────────────────────────────────
export const isAuthenticated = () => !!localStorage.getItem("challengehub_token");
