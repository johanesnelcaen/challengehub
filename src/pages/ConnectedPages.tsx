// src/pages/Notifications/Notifications.tsx — connecté à l'API
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Spinner } from "../../components/common/ApiComponents";
import { useNotifications } from "../../hooks/useApi";
import { useState } from "react";

const TYPE_LABELS: Record<string, string> = {
  inscription: "Inscription", soumission: "Soumission", resultat: "Résultats",
  annulation: "Annulation", remboursement: "Remboursement", jury: "Jury",
};
const TYPE_COLORS: Record<string, string> = {
  inscription: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
  soumission:  "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
  resultat:    "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
  annulation:  "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400",
  remboursement:"bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  jury:        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
};
const NOTIF_ICONS: Record<string, string> = {
  inscription:"✅", jury:"⚖️", soumission:"📤", resultat:"🏆", annulation:"❌", remboursement:"💸",
};

export default function Notifications() {
  const { notifications, unread, loading, marquerLu, marquerToutLu, supprimer } = useNotifications();
  const [filter, setFilter] = useState<"all"|"non_lu"|"lu">("all");

  const filtered = notifications.filter((n: any) => {
    if (filter === "non_lu") return !n.lu;
    if (filter === "lu") return n.lu;
    return true;
  });

  return (
    <>
      <PageMeta title="Notifications — ChallengeHub" description="Vos notifications" />
      <PageBreadcrumb pageTitle="Notifications" />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
          {(["all","non_lu","lu"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400"
              }`}>
              {f === "all" ? "Toutes" : f === "non_lu" ? `Non lues (${unread})` : "Lues"}
            </button>
          ))}
        </div>
        {unread > 0 && (
          <button onClick={marquerToutLu}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
            ✓ Tout marquer comme lu
          </button>
        )}
      </div>

      {loading ? (
        <Spinner text="Chargement des notifications..." />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-16 text-center">
          <p className="text-5xl mb-4">🔔</p>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucune notification</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filter === "non_lu" ? "Toutes vos notifications ont été lues." : "Vous n'avez pas encore de notifications."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n: any) => (
            <div key={n.id} className={`group rounded-2xl border transition-all duration-200 ${
              n.lu ? "border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                   : "border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/[0.05]"
            }`}>
              <div className="flex items-start gap-4 p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  n.lu ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-900 shadow-sm"
                }`}>{NOTIF_ICONS[n.type] ?? "📌"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[n.type] ?? ""}`}>
                      {TYPE_LABELS[n.type] ?? n.type}
                    </span>
                    {!n.lu && <span className="w-2 h-2 rounded-full bg-brand-500" />}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1.5">{n.created_at}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.lu && (
                    <button onClick={() => marquerLu(n.id)} title="Marquer comme lu"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-500">
                      ✓
                    </button>
                  )}
                  <button onClick={() => supprimer(n.id)} title="Supprimer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-error-50 dark:hover:bg-error-500/10 hover:text-error-500 text-lg leading-none">
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════
//  src/pages/Wallet/Wallet.tsx — connecté à l'API
// ════════════════════════════════════════════════════════════
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Spinner } from "../../components/common/ApiComponents";
import { useWallet } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const fmtW = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.abs(n)) + " FCFA";
const fmtDateW = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" });

const TYPE_CONFIG_W: Record<string, { label: string; icon: string; colorClass: string; amountClass: string }> = {
  participation: { label: "Participation",  icon: "🎯", colorClass: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400", amountClass: "text-error-500" },
  remboursement: { label: "Remboursement",  icon: "💸", colorClass: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400", amountClass: "text-success-500" },
  gain:          { label: "Gain",           icon: "🏆", colorClass: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400", amountClass: "text-success-500" },
  commission:    { label: "Commission",     icon: "📊", colorClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400", amountClass: "text-error-500" },
};

export default function Wallet() {
  const { user } = useAuth();
  const { solde, transactions } = useWallet();
  const [filterType, setFilterType] = useState<string>("all");

  const soldeData = solde.data;
  const txList: any[] = transactions.data?.data ?? [];

  const filtered = txList.filter((t: any) => filterType === "all" || t.type_transaction === filterType);

  if (solde.loading) return <Spinner text="Chargement du portefeuille..." />;

  return (
    <>
      <PageMeta title="Portefeuille — ChallengeHub" description="Gérez votre portefeuille" />
      <PageBreadcrumb pageTitle="Mon Portefeuille" />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
        {[
          { icon: "💳", label: "Solde disponible", value: fmtW(soldeData?.solde ?? user?.solde_wallet ?? 0), color: "bg-brand-50 dark:bg-brand-500/10" },
          { icon: "🏆", label: "Total gagné", value: fmtW(soldeData?.total_gains ?? 0), color: "bg-success-50 dark:bg-success-500/10" },
          { icon: "💸", label: "Total dépensé", value: fmtW(soldeData?.total_depenses ?? 0), color: "bg-error-50 dark:bg-error-500/10" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Solde banner */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 p-6 mb-6 text-white">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-brand-200 text-sm mb-1">Solde de votre wallet</p>
            <p className="text-4xl font-extrabold">{fmtW(soldeData?.solde ?? user?.solde_wallet ?? 0)}</p>
            <p className="text-brand-200 text-sm mt-2">{user?.prenom} {user?.nom}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white text-brand-600 text-sm font-bold rounded-xl hover:bg-brand-50 transition-colors">⬆️ Recharger</button>
            <button className="px-5 py-2.5 bg-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/30 border border-white/30 transition-colors">⬇️ Retirer</button>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">📋 Historique</h3>
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
            {[["all","Toutes"],["participation","Participations"],["gain","Gains"],["remboursement","Remboursements"]].map(([v,l]) => (
              <button key={v} onClick={() => setFilterType(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === v ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-500"
                }`}>{l}</button>
            ))}
          </div>
        </div>

        {transactions.loading ? <Spinner /> : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">Aucune transaction.</p>
            ) : (
              filtered.map((t: any) => {
                const cfg = TYPE_CONFIG_W[t.type_transaction] ?? TYPE_CONFIG_W.participation;
                return (
                  <div key={t.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <div className="col-span-1">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${cfg.colorClass}`}>{cfg.icon}</div>
                    </div>
                    <div className="col-span-5 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{t.challenge?.nom ?? "Plateforme"}</p>
                      {t.reference_externe && <p className="text-xs text-gray-400 font-mono truncate">{t.reference_externe}</p>}
                    </div>
                    <div className="col-span-3 hidden sm:block">
                      <p className="text-sm text-gray-500">{fmtDateW(t.created_at)}</p>
                    </div>
                    <div className="col-span-3 sm:col-span-3 text-right">
                      <p className={`text-sm font-extrabold ${cfg.amountClass}`}>
                        {t.montant > 0 ? "+" : ""}{fmtW(t.montant)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </>
  );
}

// ════════════════════════════════════════════════════════════
//  src/pages/Participations/MesParticipations.tsx — connecté à l'API
// ════════════════════════════════════════════════════════════
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Spinner, EmptyState, ErrorBox } from "../../components/common/ApiComponents";
import { useMesParticipations } from "../../hooks/useApi";

const fmtP = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
const fmtDateP = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" });
const STATUT_C: Record<string, { label: string; className: string }> = {
  ouvert: { label:"Ouvert", className:"bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400" },
  en_cours: { label:"En cours", className:"bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400" },
  deliberation: { label:"Délibération", className:"bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400" },
  termine: { label:"Terminé", className:"bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  annule: { label:"Annulé", className:"bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400" },
};

export default function MesParticipations() {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useMesParticipations();
  const participations: any[] = data?.data ?? (Array.isArray(data) ? data : []);

  if (loading) return <><PageBreadcrumb pageTitle="Mes Participations" /><Spinner /></>;
  if (error)   return <><PageBreadcrumb pageTitle="Mes Participations" /><ErrorBox message={error} onRetry={refetch} /></>;

  return (
    <>
      <PageMeta title="Mes Participations — ChallengeHub" description="Vos challenges rejoints" />
      <PageBreadcrumb pageTitle="Mes Participations" />

      {participations.length === 0 ? (
        <EmptyState icon="🎯" title="Aucune participation" description="Rejoignez un challenge pour commencer !"
          action={{ label: "Explorer les challenges", onClick: () => navigate("/challenges") }} />
      ) : (
        <div className="space-y-4">
          {participations.map((p: any, i: number) => (
            <div key={i} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                    {p.challenge?.type?.icone ?? "🏆"}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-white">{p.challenge?.nom ?? "Challenge"}</h4>
                    <div className="flex flex-wrap gap-4 mt-1">
                      {p.date_paiement && <span className="text-xs text-gray-400">Inscrit le {fmtDateP(p.date_paiement)}</span>}
                      <span className="text-xs text-gray-500">💰 {fmtP(p.montant_paye ?? 0)}</span>
                      {p.challenge?.statut && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUT_C[p.challenge.statut]?.className ?? ""}`}>
                          {STATUT_C[p.challenge.statut]?.label ?? p.challenge.statut}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    p.soumission
                      ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                      : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400"
                  }`}>
                    {p.soumission ? "✓ Livrable soumis" : "⏳ En attente"}
                  </span>
                  <button onClick={() => p.challenge && navigate(`/challenges/${p.challenge_id}`)}
                    className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                    Voir le challenge
                  </button>
                </div>
              </div>
              {p.soumission?.url_fichier && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-400 mb-1">Livrable ({p.soumission.type_livrable})</p>
                  <a href={p.soumission.url_fichier} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-brand-500 hover:text-brand-600 underline">{p.soumission.url_fichier}</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
