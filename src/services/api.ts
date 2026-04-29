// src/services/api.ts
const API_BASE = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

// ── Fetch de base avec JWT ────────────────────────────────────────────────
async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("ch_token");

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
  if (!res.ok) throw data;
  return data;
}

// ── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, mot_de_passe: string) =>
    apiFetch<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, mot_de_passe }),
    }).then((d) => { localStorage.setItem("ch_token", d.token); return d; }),

  register: (p: { nom: string; prenom: string; email: string; mot_de_passe: string; mot_de_passe_confirmation: string }) =>
    apiFetch<any>("/auth/register", { method: "POST", body: JSON.stringify(p) })
      .then((d) => { localStorage.setItem("ch_token", d.token); return d; }),

  logout: () =>
    apiFetch("/auth/logout", { method: "POST" })
      .finally(() => localStorage.removeItem("ch_token")),

  me: () => apiFetch<any>("/auth/me"),

  updateProfile: (p: Partial<{ nom: string; prenom: string; email: string; bio: string }>) =>
    apiFetch("/auth/me", { method: "PUT", body: JSON.stringify(p) }),

  updatePassword: (p: { mot_de_passe_actuel: string; mot_de_passe: string; mot_de_passe_confirmation: string }) =>
    apiFetch("/auth/me/password", { method: "PUT", body: JSON.stringify(p) }),
};

// ── Types challenge ───────────────────────────────────────────────────────
export const typesApi = {
  list: () => apiFetch<any[]>("/types-challenge"),
};

// ── Challenges ────────────────────────────────────────────────────────────
export const challengesApi = {
  list: (params: Record<string, any> = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== "" && v !== "all")
        .map(([k, v]) => [k, String(v)])
    ).toString();
    return apiFetch<any>(`/challenges${qs ? "?" + qs : ""}`);
  },

  show: (id: number) => apiFetch<any>(`/challenges/${id}`),
  create: (p: any)   => apiFetch<any>("/challenges", { method: "POST", body: JSON.stringify(p) }),
  update: (id: number, p: any) => apiFetch<any>(`/challenges/${id}`, { method: "PUT", body: JSON.stringify(p) }),
  delete: (id: number) => apiFetch(`/challenges/${id}`, { method: "DELETE" }),
  mesChallenges: ()    => apiFetch<any[]>("/challenges/mes-challenges"),
  publier: (id: number)  => apiFetch(`/challenges/${id}/publier`, { method: "POST" }),
  annuler: (id: number)  => apiFetch(`/challenges/${id}/annuler`, { method: "POST" }),
  publierResultats: (id: number) => apiFetch(`/challenges/${id}/publier-resultats`, { method: "POST" }),
  resultats: (id: number) => apiFetch<any[]>(`/challenges/${id}/resultats`),
};

// ── Participations ────────────────────────────────────────────────────────
export const participationsApi = {
  list: ()            => apiFetch<any>("/participations"),
  show: (id: number)  => apiFetch<any>(`/participations/${id}`),
  participer: (challengeId: number) =>
    apiFetch<any>(`/challenges/${challengeId}/participer`, { method: "POST" }),
};

// ── Soumissions ───────────────────────────────────────────────────────────
export const soumissionsApi = {
  soumettre: (participationId: number, p: { type_livrable: string; url_fichier: string; description?: string }) =>
    apiFetch<any>(`/participations/${participationId}/soumettre`, { method: "POST", body: JSON.stringify(p) }),
  update: (id: number, p: any) =>
    apiFetch<any>(`/soumissions/${id}`, { method: "PUT", body: JSON.stringify(p) }),
};

// ── Jury ──────────────────────────────────────────────────────────────────
export const juryApi = {
  mesChallenges: ()             => apiFetch<any[]>("/jury/challenges"),
  soumissions: (id: number)     => apiFetch<any>(`/jury/challenges/${id}/soumissions`),
  repondre: (id: number, r: "accepte" | "refuse") =>
    apiFetch(`/jury/invitations/${id}`, { method: "PUT", body: JSON.stringify({ reponse: r }) }),
};

// ── Évaluations ───────────────────────────────────────────────────────────
export const evaluationsApi = {
  noter: (p: { soumission_id: number; note: number; commentaire?: string }) =>
    apiFetch<any>("/evaluations", { method: "POST", body: JSON.stringify(p) }),
  update: (id: number, p: { note: number; commentaire?: string }) =>
    apiFetch<any>(`/evaluations/${id}`, { method: "PUT", body: JSON.stringify(p) }),
  delete: (id: number) => apiFetch(`/evaluations/${id}`, { method: "DELETE" }),
};

// ── Notifications ─────────────────────────────────────────────────────────
export const notificationsApi = {
  list: (page = 1)    => apiFetch<any>(`/notifications?page=${page}`),
  marquerLu: (id: number) => apiFetch(`/notifications/${id}/lire`, { method: "PUT" }),
  marquerToutLu: ()   => apiFetch("/notifications/lire-tout", { method: "PUT" }),
  delete: (id: number) => apiFetch(`/notifications/${id}`, { method: "DELETE" }),
};

// ── Wallet ────────────────────────────────────────────────────────────────
export const walletApi = {
  solde: ()                => apiFetch<any>("/wallet/solde"),
  transactions: (page = 1) => apiFetch<any>(`/wallet/transactions?page=${page}`),
};

export const isAuthenticated = () => !!localStorage.getItem("ch_token");
