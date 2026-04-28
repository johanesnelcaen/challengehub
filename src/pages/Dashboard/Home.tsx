import PageMeta from "../../components/common/PageMeta";
import { Link } from "react-router";
import {
  CHALLENGES, CURRENT_USER, MES_PARTICIPATIONS, NOTIFICATIONS,
  fmt, fmtDate, quorumPct, totalPrix, STATUT_CONFIG,
} from "../../data/mockData";

// ── Composant badge statut ─────────────────────────────────────────────────
function StatutBadge({ statut }: { statut: string }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.brouillon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

// ── Barre de quorum ────────────────────────────────────────────────────────
function QuorumBar({ c }: { c: typeof CHALLENGES[0] }) {
  const pct = quorumPct(c);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{c.nb_participants_actuels} / {c.nb_participants_min} min</span>
        <span className={`font-semibold ${pct >= 100 ? "text-success-500" : "text-warning-500"}`}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-success-500" : "bg-warning-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, colorClass }: {
  icon: string; label: string; value: string; sub?: string; colorClass: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{value}</h4>
          {sub && <p className="text-xs text-brand-500 font-medium mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const unread = NOTIFICATIONS.filter((n) => !n.lu).length;
  const challengesOuverts = CHALLENGES.filter((c) => c.statut === "ouvert");

  return (
    <>
      <PageMeta
        title="Dashboard — ChallengeHub"
        description="Tableau de bord de la plateforme ChallengeHub"
      />

      {/* En-tête de bienvenue */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bonjour, {CURRENT_USER.prenom} !
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Voici un aperçu de votre activité sur ChallengeHub
        </p>
      </div>

      {/* ── Statistiques ── */}
      <div className="grid grid-cols-2 gap-4 mb-6 md:grid-cols-4">
        <StatCard
          icon="🏆" label="Challenges créés"
          value={String(CURRENT_USER.stats.crees)}
          colorClass="bg-brand-50 dark:bg-brand-500/10"
        />
        <StatCard
          icon="✋" label="Participations"
          value={String(CURRENT_USER.stats.participes)}
          colorClass="bg-success-50 dark:bg-success-500/10"
        />
        <StatCard
          icon="🥇" label="Victoires"
          value={String(CURRENT_USER.stats.gagnes)}
          colorClass="bg-warning-50 dark:bg-warning-500/10"
        />
        <StatCard
          icon="💳" label="Solde wallet"
          value={fmt(CURRENT_USER.solde_wallet)}
          colorClass="bg-pink-50 dark:bg-pink-500/10"
        />
      </div>

      {/* ── Grille principale ── */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        {/* Mes participations */}
        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-5">
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
                    <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                      p.soumis
                        ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                        : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                    }`}>
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
          </div>
        </div>

        {/* Notifications */}
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                Notifications
                {unread > 0 && (
                  <span className="px-2 py-0.5 bg-error-500 text-white text-xs font-bold rounded-full">{unread}</span>
                )}
              </h3>
              <Link to="/notifications" className="text-sm text-brand-500 hover:text-brand-600 font-medium">
                Tout voir →
              </Link>
            </div>
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
                  </div>
                  {!n.lu && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges ouverts */}
        <div className="col-span-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                🆕 Challenges ouverts
              </h3>
              <Link to="/challenges" className="flex items-center gap-1 px-4 py-2 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
                Explorer tout
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {challengesOuverts.slice(0, 3).map((c) => (
                <Link key={c.id} to={`/challenges/${c.id}`}>
                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{c.type.icone}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{c.nom}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{c.createur.prenom} {c.createur.nom}</p>
                        </div>
                      </div>
                      <StatutBadge statut={c.statut} />
                    </div>
                    <QuorumBar c={c} />
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{fmt(c.frais_participation)}</span>
                      <span className="text-xs text-warning-500 font-semibold">🏆 {fmt(totalPrix(c))}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}