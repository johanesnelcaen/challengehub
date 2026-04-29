// src/pages/Challenges/Challenges.tsx — connecté à l'API
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Spinner } from "../../components/common/Spinner";
import { ErrorBox } from "../../components/common/ErrorBox";
import { useApi } from "../../hooks/useApi";
import { challengesApi, typesApi, participationsApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
const STATUT_CONFIG: Record<string, { label: string; className: string }> = {
  brouillon:    { label: "Brouillon",    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  ouvert:       { label: "Ouvert",       className: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400" },
  en_cours:     { label: "En cours",     className: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400" },
  deliberation: { label: "Délibération", className: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400" },
  termine:      { label: "Terminé",      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  annule:       { label: "Annulé",       className: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400" },
};

function StatutBadge({ statut }: { statut: string }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.brouillon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{cfg.label}
    </span>
  );
}

function ModalParticipation({ challenge, solde, onClose, onConfirm, loading }: any) {
  const reste = solde - challenge.frais_participation;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/60">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Confirmer la participation</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Vous allez rejoindre <strong className="text-gray-800 dark:text-white">{challenge.nom}</strong>
        </p>
        <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 p-4 space-y-2 mb-5">
          {[
            ["Frais de participation", fmt(challenge.frais_participation), "text-brand-600 dark:text-brand-400"],
            ["Votre solde actuel", fmt(solde), "text-gray-900 dark:text-white"],
            ["Solde après inscription", fmt(reste), reste >= 0 ? "text-success-600" : "text-error-500"],
          ].map(([k, v, cls]) => (
            <div key={k as string} className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">{k}</span>
              <span className={`font-bold ${cls}`}>{v}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mb-5 leading-relaxed">
          ⚠️ Si le quorum de <strong>{challenge.nb_participants_min}</strong> participants n'est pas atteint avant le {fmtDate(challenge.date_lancement)}, vous serez remboursé automatiquement.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:opacity-40">
            Annuler
          </button>
          <button onClick={onConfirm} disabled={loading || reste < 0}
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {loading ? "Traitement..." : "Confirmer & Payer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Challenges() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [search, setSearch]       = useState("");
  const [filterType, setFilterType]     = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [joinModal, setJoinModal]   = useState<any>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError]   = useState<string | null>(null);
  const [joinedIds, setJoinedIds]   = useState<number[]>([]);

  const params = useMemo(() => ({
    ...(search && { search }),
    ...(filterType !== "all" && { type_id: filterType }),
    ...(filterStatut !== "all" && { statut: filterStatut }),
  }), [search, filterType, filterStatut]);

  const { data, loading, error, refetch } = useApi(() => challengesApi.list(params), [JSON.stringify(params)]);
  const { data: types } = useApi(() => typesApi.list(), []);
  const challenges = data?.data ?? [];
  const total = data?.total ?? challenges.length;

  const handleJoin = async () => {
    if (!joinModal) return;
    setJoinLoading(true);
    setJoinError(null);
    try {
      await participationsApi.participer(joinModal.id);
      setJoinedIds((p) => [...p, joinModal.id]);
      setJoinModal(null);
      refreshUser();
    } catch (e: any) {
      setJoinError(e?.message ?? "Erreur lors de l'inscription.");
    } finally {
      setJoinLoading(false);
    }
  };

  return (
    <>
      <PageMeta title="Challenges — ChallengeHub" description="Explorer et rejoindre des challenges" />
      <PageBreadcrumb pageTitle="Challenges" />

      {/* Filtres */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 9a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 013 9zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd"/></svg>
            </span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un challenge..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none" />
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none">
            <option value="all">Tous les types</option>
            {(types ?? []).map((t: any) => <option key={t.id} value={t.id}>{t.icone} {t.libelle}</option>)}
          </select>
          <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none">
            <option value="all">Tous les statuts</option>
            <option value="ouvert">Ouvert</option>
            <option value="en_cours">En cours</option>
            <option value="deliberation">Délibération</option>
            <option value="termine">Terminé</option>
          </select>
          <button onClick={() => navigate("/challenges/creer")}
            className="ml-auto h-10 px-5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2">
            + Créer
          </button>
        </div>
        {!loading && <p className="mt-3 text-xs text-gray-400">{total} challenge{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}</p>}
      </div>

      {loading && <Spinner text="Chargement des challenges..." />}
      {error && <ErrorBox message={error} onRetry={refetch} />}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {challenges.map((c: any) => {
            const pct = Math.min(100, Math.round(((c.nb_participants_actuels ?? 0) / c.nb_participants_min) * 100));
            const totalPrix = (c.trophees ?? []).reduce((s: number, t: any) => s + (t.valeur_monetaire ?? 0), 0);
            const joined = joinedIds.includes(c.id);

            return (
              <div key={c.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col hover:shadow-md transition-shadow">
                <div className="p-5 flex-1 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-xl flex-shrink-0">{c.type?.icone ?? "🏆"}</div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.nom}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">par {c.createur?.prenom} {c.createur?.nom}</p>
                      </div>
                    </div>
                    <StatutBadge statut={c.statut} />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{c.description}</p>
                  {/* Quorum */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{c.nb_participants_actuels ?? 0} / {c.nb_participants_min} min</span>
                      <span className={`font-semibold ${pct >= 100 ? "text-success-500" : "text-warning-500"}`}>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className={`h-full rounded-full ${pct >= 100 ? "bg-success-500" : "bg-warning-400"}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                      <p className="text-xs text-gray-400">Frais d'entrée</p>
                      <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5">{fmt(c.frais_participation)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-warning-50 dark:bg-warning-500/10">
                      <p className="text-xs text-gray-400">Prix total</p>
                      <p className="text-sm font-bold text-warning-600 dark:text-warning-400 mt-0.5">{fmt(totalPrix)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>📅 {fmtDate(c.date_cloture)}</span>
                    <span>👥 {c.nb_participants_actuels ?? 0}/{c.nb_participants_max ?? "∞"}</span>
                  </div>
                </div>
                <div className="px-5 pb-5 flex gap-2">
                  <button onClick={() => navigate(`/challenges/${c.id}`)}
                    className="flex-1 h-9 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
                    Voir détails
                  </button>
                  {c.statut === "ouvert" && !joined && c.createur?.id !== user?.id && (
                    <button onClick={() => { setJoinError(null); setJoinModal(c); }}
                      className="flex-1 h-9 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors">
                      Participer
                    </button>
                  )}
                  {joined && (
                    <button disabled className="flex-1 h-9 rounded-lg border border-success-300 text-success-600 text-xs font-medium opacity-70 cursor-not-allowed">✓ Inscrit</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {joinModal && (
        <ModalParticipation
          challenge={joinModal}
          solde={user?.solde_wallet ?? 0}
          loading={joinLoading}
          onClose={() => setJoinModal(null)}
          onConfirm={handleJoin}
        />
      )}
      {joinError && (
        <div className="fixed bottom-6 right-6 z-[99999] px-5 py-3 rounded-xl bg-error-500 text-white text-sm font-medium shadow-lg">
          ⚠️ {joinError}
        </div>
      )}
    </>
  );
}
