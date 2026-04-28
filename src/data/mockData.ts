// ─── Types ────────────────────────────────────────────────────────────────────
export interface Trophee {
  rang: number;
  description: string;
  valeur_monetaire: number;
  type_trophee: "monetaire" | "objet" | "titre";
}

export interface JuryMembre {
  nom: string;
  prenom: string;
  email: string;
  statut: "invite" | "accepte" | "refuse";
}

export interface Challenge {
  id: number;
  nom: string;
  description: string;
  type: { libelle: string; icone: string };
  type_id: number;
  nb_participants_min: number;
  nb_participants_max: number | null;
  nb_participants_actuels: number;
  frais_participation: number;
  date_lancement: string;
  date_cloture: string;
  statut: "brouillon" | "ouvert" | "en_cours" | "deliberation" | "termine" | "annule";
  visibilite: "public" | "prive";
  commission_pct: number;
  createur: { id: number; nom: string; prenom: string };
  trophees: Trophee[];
  jury: JuryMembre[];
}

export interface Participation {
  challenge_id: number;
  challenge_nom: string;
  statut_paiement: "en_attente" | "paye" | "rembourse" | "echoue";
  montant_paye: number;
  date_paiement: string;
  soumis: boolean;
  type_livrable?: string;
  url_livrable?: string;
}

export interface Notification {
  id: number;
  type: "inscription" | "soumission" | "resultat" | "annulation" | "remboursement" | "jury";
  message: string;
  lu: boolean;
  created_at: string;
  challenge_id?: number;
}

export interface Transaction {
  id: number;
  type: "participation" | "remboursement" | "gain" | "commission";
  challenge: string;
  montant: number;
  statut: "en_attente" | "complete" | "echoue";
  date: string;
  reference?: string;
}

export interface EvaluationJury {
  soumission_id: number;
  challenge_nom: string;
  participant_nom: string;
  type_livrable: string;
  url_fichier: string;
  ma_note?: number;
  mon_commentaire?: string;
  statut_jury: "en_attente" | "note";
}

// ─── Données ──────────────────────────────────────────────────────────────────
export const CURRENT_USER = {
  id: 2,
  nom: "Diallo",
  prenom: "Mamadou",
  email: "mamadou@example.com",
  role: "user" as "user" | "admin",
  solde_wallet: 50000,
  photo: null as string | null,
  bio: "Passionné de technologie et de challenges créatifs. Développeur full-stack basé à Cotonou.",
  stats: { crees: 2, participes: 5, gagnes: 1, total_gains: 75000 },
};

export const TYPES_CHALLENGE = [
  { id: 1, libelle: "Technique",  icone: "💻" },
  { id: 2, libelle: "Creatif",   icone: "🎨" },
  { id: 3, libelle: "Sportif",   icone: "⚽" },
  { id: 4, libelle: "Educatif",  icone: "📚" },
  { id: 5, libelle: "Design",    icone: "🖌️" },
  { id: 6, libelle: "Musical",   icone: "🎵" },
  { id: 7, libelle: "Business",  icone: "💼" },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 1, nom: "Hackathon IA West Africa",
    description: "Développez une application utilisant l'intelligence artificielle pour résoudre un problème local en Afrique de l'Ouest. Les meilleurs projets seront présentés devant un jury d'experts reconnus dans le domaine tech.",
    type: { libelle: "Technique", icone: "💻" }, type_id: 1,
    nb_participants_min: 5, nb_participants_max: 20, nb_participants_actuels: 8,
    frais_participation: 5000, date_lancement: "2026-05-01", date_cloture: "2026-05-31",
    statut: "ouvert", visibilite: "public", commission_pct: 10,
    createur: { id: 3, nom: "Kone", prenom: "Aminata" },
    trophees: [
      { rang: 1, description: "1er Prix", valeur_monetaire: 200000, type_trophee: "monetaire" },
      { rang: 2, description: "2ème Prix", valeur_monetaire: 100000, type_trophee: "monetaire" },
      { rang: 3, description: "3ème Prix", valeur_monetaire: 50000, type_trophee: "monetaire" },
    ],
    jury: [{ nom: "Sow", prenom: "Ousmane", email: "ousmane@ex.com", statut: "accepte" }],
  },
  {
    id: 2, nom: "Concours de Photographie Urbaine",
    description: "Capturez la beauté et la vie des villes d'Afrique de l'Ouest en une seule photo marquante. Créativité, composition et message sont les critères principaux d'évaluation.",
    type: { libelle: "Creatif", icone: "🎨" }, type_id: 2,
    nb_participants_min: 10, nb_participants_max: 50, nb_participants_actuels: 18,
    frais_participation: 2000, date_lancement: "2026-05-10", date_cloture: "2026-06-10",
    statut: "ouvert", visibilite: "public", commission_pct: 8,
    createur: { id: 3, nom: "Kone", prenom: "Aminata" },
    trophees: [
      { rang: 1, description: "1er Prix + Tirage grand format", valeur_monetaire: 80000, type_trophee: "monetaire" },
      { rang: 2, description: "2ème Prix", valeur_monetaire: 40000, type_trophee: "monetaire" },
    ],
    jury: [
      { nom: "Toure", prenom: "Ibrahim", email: "ibrahim@ex.com", statut: "accepte" },
      { nom: "Diallo", prenom: "Mamadou", email: "mamadou@ex.com", statut: "accepte" },
    ],
  },
  {
    id: 3, nom: "Challenge Design Logo Fintech",
    description: "Créez le meilleur logo pour une startup fictive de fintech africaine. Créativité, originalité et cohérence de la charte graphique seront les critères principaux.",
    type: { libelle: "Design", icone: "🖌️" }, type_id: 5,
    nb_participants_min: 3, nb_participants_max: 15, nb_participants_actuels: 9,
    frais_participation: 1500, date_lancement: "2026-04-25", date_cloture: "2026-05-25",
    statut: "en_cours", visibilite: "public", commission_pct: 10,
    createur: { id: 2, nom: "Diallo", prenom: "Mamadou" },
    trophees: [
      { rang: 1, description: "1er Prix + mention portfolio", valeur_monetaire: 60000, type_trophee: "monetaire" },
      { rang: 2, description: "2ème Prix", valeur_monetaire: 30000, type_trophee: "monetaire" },
    ],
    jury: [
      { nom: "Toure", prenom: "Ibrahim", email: "ibrahim@ex.com", statut: "accepte" },
      { nom: "Bah", prenom: "Fatouma", email: "fatouma@ex.com", statut: "invite" },
    ],
  },
  {
    id: 4, nom: "Battle de Code — Algorithmes",
    description: "Résolvez 5 problèmes algorithmiques en 4 heures. Le plus rapide avec le code le plus propre gagne.",
    type: { libelle: "Technique", icone: "💻" }, type_id: 1,
    nb_participants_min: 8, nb_participants_max: 30, nb_participants_actuels: 3,
    frais_participation: 3000, date_lancement: "2026-05-15", date_cloture: "2026-06-15",
    statut: "ouvert", visibilite: "public", commission_pct: 10,
    createur: { id: 4, nom: "Toure", prenom: "Ibrahim" },
    trophees: [{ rang: 1, description: "1er Prix", valeur_monetaire: 150000, type_trophee: "monetaire" }],
    jury: [],
  },
  {
    id: 5, nom: "Challenge Business Plan Innovant",
    description: "Présentez votre idée de startup en 10 slides. Un jury d'investisseurs évalue votre plan.",
    type: { libelle: "Business", icone: "💼" }, type_id: 7,
    nb_participants_min: 5, nb_participants_max: 25, nb_participants_actuels: 12,
    frais_participation: 4000, date_lancement: "2026-04-20", date_cloture: "2026-05-20",
    statut: "deliberation", visibilite: "public", commission_pct: 10,
    createur: { id: 5, nom: "Bah", prenom: "Fatouma" },
    trophees: [{ rang: 1, description: "Accompagnement startup 3 mois + 300 000 FCFA", valeur_monetaire: 300000, type_trophee: "monetaire" }],
    jury: [
      { nom: "Diallo", prenom: "Mamadou", email: "mamadou@ex.com", statut: "accepte" },
      { nom: "Kone", prenom: "Aminata", email: "aminata@ex.com", statut: "accepte" },
    ],
  },
  {
    id: 6, nom: "Concours de Composition Musicale",
    description: "Composez et enregistrez un morceau original de 3 minutes minimum. Tous les genres sont acceptés.",
    type: { libelle: "Musical", icone: "🎵" }, type_id: 6,
    nb_participants_min: 6, nb_participants_max: 40, nb_participants_actuels: 22,
    frais_participation: 2500, date_lancement: "2026-04-10", date_cloture: "2026-05-10",
    statut: "termine", visibilite: "public", commission_pct: 8,
    createur: { id: 6, nom: "Sow", prenom: "Ousmane" },
    trophees: [{ rang: 1, description: "1er Prix + Studio professionnel", valeur_monetaire: 100000, type_trophee: "monetaire" }],
    jury: [],
  },
];

export const MES_PARTICIPATIONS: Participation[] = [
  {
    challenge_id: 2, challenge_nom: "Concours de Photographie Urbaine",
    statut_paiement: "paye", montant_paye: 2000, date_paiement: "2026-04-18", soumis: false,
  },
  {
    challenge_id: 3, challenge_nom: "Challenge Design Logo Fintech",
    statut_paiement: "paye", montant_paye: 1500, date_paiement: "2026-04-24", soumis: true,
    type_livrable: "lien", url_livrable: "https://figma.com/design/mon-logo",
  },
];

export const MES_CHALLENGES_CREES = CHALLENGES.filter((c) => c.createur.id === 2);

export const EVALUATIONS_JURY: EvaluationJury[] = [
  {
    soumission_id: 1, challenge_nom: "Challenge Design Logo Fintech",
    participant_nom: "Kone Aminata", type_livrable: "photo",
    url_fichier: "https://storage.challengehub.com/logo-aminata.png",
    statut_jury: "en_attente",
  },
  {
    soumission_id: 2, challenge_nom: "Challenge Design Logo Fintech",
    participant_nom: "Sow Ousmane", type_livrable: "lien",
    url_fichier: "https://behance.net/ousmane-logo",
    ma_note: 8.5, mon_commentaire: "Très bon travail, identité visuelle cohérente.",
    statut_jury: "note",
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 1, type: "jury", message: "Vous avez été invité à rejoindre le jury du Challenge Design Logo Fintech.", lu: false, created_at: "2026-04-22 10:00", challenge_id: 3 },
  { id: 2, type: "inscription", message: "Votre inscription au Concours de Photographie Urbaine est confirmée.", lu: false, created_at: "2026-04-21 14:30", challenge_id: 2 },
  { id: 3, type: "soumission", message: "Votre soumission au Challenge Design Logo a bien été reçue.", lu: true, created_at: "2026-04-20 09:15", challenge_id: 3 },
  { id: 4, type: "resultat", message: "Les résultats du Concours Musical ont été publiés. Félicitations aux gagnants !", lu: true, created_at: "2026-04-19 18:00", challenge_id: 6 },
  { id: 5, type: "remboursement", message: "Votre remboursement de 3 000 FCFA a été traité avec succès.", lu: true, created_at: "2026-04-15 11:00" },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 1, type: "participation", challenge: "Concours de Photographie Urbaine", montant: -2000, statut: "complete", date: "2026-04-18", reference: "TXN-004-CINETPAY" },
  { id: 2, type: "participation", challenge: "Challenge Design Logo Fintech", montant: -1500, statut: "complete", date: "2026-04-24", reference: "TXN-007-CINETPAY" },
  { id: 3, type: "gain", challenge: "Battle Algorithmes 2025", montant: 75000, statut: "complete", date: "2026-03-10", reference: "TXN-GAIN-001" },
  { id: 4, type: "remboursement", challenge: "Challenge Annulé", montant: 3000, statut: "complete", date: "2026-04-15", reference: "TXN-REMB-001" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const fmt = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

export const quorumPct = (c: Challenge) =>
  Math.min(100, Math.round((c.nb_participants_actuels / c.nb_participants_min) * 100));

export const totalPrix = (c: Challenge) =>
  c.trophees.reduce((s, t) => s + (t.valeur_monetaire || 0), 0);

export const STATUT_CONFIG: Record<string, { label: string; className: string }> = {
  brouillon:    { label: "Brouillon",    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  ouvert:       { label: "Ouvert",       className: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400" },
  en_cours:     { label: "En cours",     className: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400" },
  deliberation: { label: "Délibération", className: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400" },
  termine:      { label: "Terminé",      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  annule:       { label: "Annulé",       className: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400" },
};

export const NOTIF_ICONS: Record<string, string> = {
  inscription: "", jury: "", soumission: "",
  resultat: "", annulation: "❌", remboursement: "",
};