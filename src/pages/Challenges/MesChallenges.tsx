// src/pages/Challenges/MesChallenges.tsx — connecté à l'API
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Spinner } from "../../components/common/Spinner";
import { ErrorBox } from "../../components/common/ErrorBox";
import { EmptyState } from "../../components/common/EmptyState";
import { useMesChallenges } from "../../hooks/useApi";
import { challengesApi } from "../../services/api";
import { useState } from "react";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const STATUT_CONFIG: Record<string, { label: string; className: string }> = {
  brouillon:    { label: "Brouillon",    className: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  ouvert:       { label: "Ouvert",       className: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400" },
  en_cours:     { label: "En cours",     className: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400" },
  deliberation: { label: "Délibération", className: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400" },
  termine:      { label: "Terminé",      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  annule:       { label: "Annulé",       className: "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400" },
};

export default function MesChallenges() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useMesChallenges();
  const challenges: any[] = Array.isArray(data) ? data : [];
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePublier = async (id: number) => {
    setActionLoading(id);
    try {
      await challengesApi.publier(id);
      showToast("success", "Challenge publié avec succès !");
      refetch();
    } catch (e: any) {
      showToast("error", e?.message ?? "Erreur lors de la publication.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAnnuler = async (id: number) => {
    if (!confirm("Confirmer l'annulation ? Les participants seront remboursés.")) return;
    setActionLoading(id);
    try {
      await challengesApi.annuler(id);
      showToast("success", "Challenge annulé. Remboursements en cours.");
      refetch();
    } catch (e: any) {
      showToast("error", e?.message ?? "Erreur lors de l'annulation.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <><PageBreadcrumb pageTitle="Mes Challenges" /><Spinner /></>;
  if (error)   return <><PageBreadcrumb pageTitle="Mes Challenges" /><ErrorBox message={error} onRetry={refetch} /></>;

  return (
    <>
      <PageMeta title="Mes Challenges — ChallengeHub" description="Challenges que vous avez créés" />
      <PageBreadcrumb pageTitle="Mes Challenges" />

      <div className="flex justify-end mb-5">
        <button onClick={() => navigate("/challenges/creer")}
          className="px-5 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
          + Créer un challenge
        </button>
      </div>

      {challenges.length === 0 ? (
        <EmptyState icon="⚡" title="Aucun challenge créé"
          description="Lancez votre premier challenge dès maintenant !"
          action={{ label: "Créer un challenge", onClick: () => navigate("/challenges/creer") }} />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {challenges.map((c: any) => {
            const pct = Math.min(100, Math.round(((c.nb_participants_actuels ?? 0) / c.nb_participants_min) * 100));
            const totalPrix = (c.trophees ?? []).reduce((s: number, t: any) => s + (t.valeur_monetaire ?? 0), 0);
            const fonds = (c.nb_participants_actuels ?? 0) * c.frais_participation;
            const cfg = STATUT_CONFIG[c.statut] || STATUT_CONFIG.brouillon;
            const isLoading = actionLoading === c.id;

            return (
              <div key={c.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col">
                <div className="p-5 flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-xl flex-shrink-0">
                        {c.type?.icone ?? "🏆"}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.nom}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{c.type?.libelle}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${cfg.className}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{cfg.label}
                    </span>
                  </div>

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

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center">
                      <p className="text-xs text-gray-400">Participants</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{c.nb_participants_actuels ?? 0}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-warning-50 dark:bg-warning-500/10 text-center">
                      <p className="text-xs text-gray-400">Prix</p>
                      <p className="text-xs font-bold text-warning-600 dark:text-warning-400 mt-0.5">{fmt(totalPrix)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-success-50 dark:bg-success-500/10 text-center">
                      <p className="text-xs text-gray-400">Fonds</p>
                      <p className="text-xs font-bold text-success-600 dark:text-success-400 mt-0.5">{fmt(fonds)}</p>
                    </div>
                  </div>

                  {/* Jury */}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ⚖️ Jury : {(c.jury_membres ?? []).length} membre{(c.jury_membres ?? []).length > 1 ? "s" : ""}
                    {(c.jury_membres ?? []).length > 0 && (
                      <span className={`ml-2 font-medium ${
                        (c.jury_membres ?? []).every((j: any) => j.statut_invitation === "accepte")
                          ? "text-success-500" : "text-warning-500"
                      }`}>
                        ({(c.jury_membres ?? []).filter((j: any) => j.statut_invitation === "accepte").length} accepté(s))
                      </span>
                    )}
                  </p>

                  {/* Dates */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>🚀 {fmtDate(c.date_lancement)}</span>
                    <span>🏁 {fmtDate(c.date_cloture)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex gap-2">
                  <button onClick={() => navigate(`/challenges/${c.id}`)}
                    className="flex-1 h-9 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                    Voir détails
                  </button>
                  {c.statut === "brouillon" && (
                    <button onClick={() => handlePublier(c.id)} disabled={isLoading}
                      className="flex-1 h-9 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors disabled:opacity-50">
                      {isLoading ? "..." : "Publier"}
                    </button>
                  )}
                  {c.statut === "deliberation" && (
                    <button onClick={() => navigate(`/jury`)}
                      className="flex-1 h-9 rounded-lg bg-warning-500 text-white text-xs font-medium hover:bg-warning-600 transition-colors">
                      ⚖️ Résultats
                    </button>
                  )}
                  {["ouvert", "brouillon"].includes(c.statut) && (
                    <button onClick={() => handleAnnuler(c.id)} disabled={isLoading}
                      className="h-9 w-9 rounded-lg border border-error-300 text-error-500 text-xs hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors disabled:opacity-50 flex items-center justify-center">
                      {isLoading ? "..." : "✕"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[99999] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg transition-all ${
          toast.type === "success" ? "bg-success-500" : "bg-error-500"
        }`}>
          {toast.type === "success" ? "✓" : "⚠️"} {toast.msg}
        </div>
      )}
    </>
  );
}
