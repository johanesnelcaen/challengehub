// src/pages/Dashboard/Home.tsx — connecté à l'API
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../hooks/useApi";
import { useApi } from "../../hooks/useApi";
import { challengesApi } from "../../services/api";
import { walletApi } from "../../services/api";
import { participationsApi } from "../../services/api";
import { Spinner } from "../../components/common/ApiComponents";

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

const NOTIF_ICONS: Record<string, string> = {
  inscription: "✅", jury: "⚖️", soumission: "📤",
  resultat: "🏆", annulation: "❌", remboursement: "💸",
};

function StatutBadge({ statut }: { statut: string }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.brouillon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{cfg.label}
    </span>
  );
}

function StatCard({ icon, label, value, colorClass }: { icon: string; label: string; value: string; colorClass: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colorClass}`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</h4>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, stats } = useAuth();
  const { notifications, unread } = useNotifications();
  const { data: challengesData } = useApi(() => challengesApi.list({ statut: "ouvert" }), []);
  const { data: participationsData } = useApi(() => participationsApi.list(), []);
  const { data: soldeData } = useApi(() => walletApi.solde(), []);

  const challengesOuverts = challengesData?.data ?? [];
  const participations    = participationsData?.data ?? (Array.isArray(participationsData) ? participationsData : []);
  const solde             = soldeData?.solde ?? user?.solde_wallet ?? 0;

  return (
    <>
      <PageMeta title="Dashboard — ChallengeHub" description="Tableau de bord ChallengeHub" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
<<<<<<< HEAD
          Bonjour, {CURRENT_USER.prenom} !
=======
          👋 Bonjour, {user?.prenom} !
>>>>>>> j_dev
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Voici un aperçu de votre activité sur ChallengeHub
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
        <StatCard icon="🏆" label="Challenges créés"  value={String(stats?.challenges_crees ?? 0)} colorClass="bg-brand-50 dark:bg-brand-500/10" />
        <StatCard icon="✋" label="Participations"     value={String(stats?.participations ?? 0)}   colorClass="bg-success-50 dark:bg-success-500/10" />
        <StatCard icon="🥇" label="Victoires"          value={String(stats?.victoires ?? 0)}        colorClass="bg-warning-50 dark:bg-warning-500/10" />
        <StatCard icon="💳" label="Solde wallet"       value={fmt(solde)}                           colorClass="bg-pink-50 dark:bg-pink-500/10" />
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Mes participations récentes */}
        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-5">
<<<<<<< HEAD
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Mes Participations récentes
              </h3>
              <Link to="/participations" className="text-sm text-brand-500 hover:text-brand-600 font-medium">
                Tout voir →
              </Link>
            </div>

            <div className="space-y-3">
              {MES_PARTICIPATIONS.map((p, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{p.challenge_nom}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Inscrit le {fmtDate(p.date_paiement)} · {fmt(p.montant_paye)}</p>
                  </div>
=======
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">✋ Mes Participations récentes</h3>
              <Link to="/participations" className="text-sm text-brand-500 hover:text-brand-600 font-medium">Tout voir →</Link>
            </div>

            {participations.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Aucune participation.{" "}
                  <Link to="/challenges" className="text-brand-500">Explorer les challenges</Link>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {participations.slice(0, 4).map((p: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-xl flex-shrink-0">
                      {p.challenge?.type?.icone ?? "🏆"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {p.challenge?.nom ?? "Challenge"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {p.date_paiement ? fmtDate(p.date_paiement) : "—"} · {fmt(p.montant_paye ?? 0)}
                      </p>
                    </div>
>>>>>>> j_dev
                    <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                      p.soumission
                        ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                        : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    }`}>
<<<<<<< HEAD
                      {p.soumis ? "Soumis" : "En cours"}
                    </span>
                  </div>
              ))}
              {MES_PARTICIPATIONS.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aucune participation. <Link to="/challenges" className="text-brand-500">Explorer les challenges</Link></p>
                </div>
              )}
            </div>
=======
                      {p.soumission ? "✓ Soumis" : "⏳ En cours"}
                    </span>
                  </div>
                ))}
              </div>
            )}
>>>>>>> j_dev
          </div>
        </div>

        {/* Notifications */}
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
<<<<<<< HEAD
                Notifications
                {unread > 0 && (
                  <span className="px-2 py-0.5 bg-error-500 text-white text-xs font-bold rounded-full">{unread}</span>
                )}
=======
                🔔 Notifications
                {unread > 0 && <span className="px-2 py-0.5 bg-error-500 text-white text-xs font-bold rounded-full">{unread}</span>}
>>>>>>> j_dev
              </h3>
              <Link to="/notifications" className="text-sm text-brand-500 hover:text-brand-600 font-medium">Tout voir →</Link>
            </div>
<<<<<<< HEAD
            <div className="space-y-2">
              {NOTIFICATIONS.slice(0, 4).map((n) => (
                <div key={n.id} className={`flex gap-2 p-3 rounded-xl ${
                  n.lu
                    ? "bg-gray-50 dark:bg-gray-900/50"
                    : "bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20"
                }`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.created_at}</p>
=======

            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucune notification.</p>
            ) : (
              <div className="space-y-2">
                {notifications.slice(0, 4).map((n: any) => (
                  <div key={n.id} className={`flex gap-3 p-3 rounded-xl ${
                    n.lu
                      ? "bg-gray-50 dark:bg-gray-900/50"
                      : "bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20"
                  }`}>
                    <span className="text-lg flex-shrink-0 mt-0.5">{NOTIF_ICONS[n.type] ?? "📌"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.created_at}</p>
                    </div>
                    {!n.lu && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1" />}
>>>>>>> j_dev
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Challenges ouverts */}
        <div className="col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">🆕 Challenges ouverts</h3>
              <Link to="/challenges" className="flex items-center gap-1 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
                Explorer tout
              </Link>
            </div>

            {challengesOuverts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">Aucun challenge ouvert pour le moment.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {challengesOuverts.slice(0, 3).map((c: any) => {
                  const pct = Math.min(100, Math.round(((c.nb_participants_actuels ?? 0) / c.nb_participants_min) * 100));
                  const totalPrix = (c.trophees ?? []).reduce((s: number, t: any) => s + (t.valeur_monetaire ?? 0), 0);
                  return (
                    <Link key={c.id} to={`/challenges/${c.id}`}>
                      <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{c.type?.icone ?? "🏆"}</span>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight line-clamp-1">{c.nom}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{c.createur?.prenom} {c.createur?.nom}</p>
                            </div>
                          </div>
                          <StatutBadge statut={c.statut} />
                        </div>
                        {/* Quorum bar */}
                        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-3">
                          <div className={`h-full rounded-full ${pct >= 100 ? "bg-success-500" : "bg-warning-400"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-brand-600 dark:text-brand-400">{fmt(c.frais_participation)}</span>
                          <span className="text-warning-500 font-semibold">🏆 {fmt(totalPrix)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
