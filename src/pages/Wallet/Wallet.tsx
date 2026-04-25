import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { CURRENT_USER, TRANSACTIONS, fmt, fmtDate, type Transaction } from "../../data/mockData";

const TYPE_CONFIG: Record<string, { label: string; icon: string; colorClass: string; amountClass: string }> = {
  participation:  { label: "Participation",  icon: "🎯", colorClass: "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",   amountClass: "text-error-500" },
  remboursement:  { label: "Remboursement",  icon: "💸", colorClass: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400", amountClass: "text-success-500" },
  gain:           { label: "Gain",           icon: "🏆", colorClass: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400", amountClass: "text-success-500" },
  commission:     { label: "Commission",     icon: "📊", colorClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",           amountClass: "text-error-500" },
};

const STATUT_TRANS: Record<string, string> = {
  complete:   "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
  en_attente: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
  echoue:     "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400",
};

function StatCard({ icon, label, value, colorClass, sub }: {
  icon: string; label: string; value: string; colorClass: string; sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-0.5">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  const [filterType, setFilterType] = useState<"all" | "participation" | "remboursement" | "gain">("all");

  const totalGains = TRANSACTIONS.filter((t) => t.montant > 0).reduce((s, t) => s + t.montant, 0);
  const totalDepenses = Math.abs(TRANSACTIONS.filter((t) => t.montant < 0).reduce((s, t) => s + t.montant, 0));

  const filtered: Transaction[] = TRANSACTIONS.filter((t) =>
    filterType === "all" ? true : t.type === filterType
  );

  return (
    <>
      <PageMeta title="Portefeuille — ChallengeHub" description="Gérez votre portefeuille ChallengeHub" />
      <PageBreadcrumb pageTitle="Mon Portefeuille" />

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
        <StatCard
          icon="💳" label="Solde disponible"
          value={fmt(CURRENT_USER.solde_wallet)}
          colorClass="bg-brand-50 dark:bg-brand-500/10"
          sub="Prêt à être utilisé"
        />
        <StatCard
          icon="🏆" label="Total gagné"
          value={fmt(totalGains)}
          colorClass="bg-success-50 dark:bg-success-500/10"
          sub="Gains cumulés"
        />
        <StatCard
          icon="💸" label="Total dépensé"
          value={fmt(totalDepenses)}
          colorClass="bg-error-50 dark:bg-error-500/10"
          sub="Frais de participation"
        />
      </div>

      {/* ── Solde visuel ── */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 p-6 mb-6 text-white">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-brand-200 text-sm font-medium mb-1">Solde de votre wallet</p>
            <p className="text-4xl font-extrabold">{fmt(CURRENT_USER.solde_wallet)}</p>
            <p className="text-brand-200 text-sm mt-2">
              {CURRENT_USER.prenom} {CURRENT_USER.nom} · {CURRENT_USER.email}
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2.5 bg-white text-brand-600 text-sm font-bold rounded-xl hover:bg-brand-50 transition-colors">
              ⬆️ Recharger
            </button>
            <button className="px-5 py-2.5 bg-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/30 transition-colors border border-white/30">
              ⬇️ Retirer
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-white/20">
          {[
            ["🎯", "Participations", String(TRANSACTIONS.filter((t) => t.type === "participation").length)],
            ["🏆", "Gains reçus", String(TRANSACTIONS.filter((t) => t.type === "gain").length)],
            ["💸", "Remboursements", String(TRANSACTIONS.filter((t) => t.type === "remboursement").length)],
          ].map(([icon, label, val]) => (
            <div key={label} className="text-center">
              <p className="text-2xl">{icon}</p>
              <p className="text-xl font-bold mt-1">{val}</p>
              <p className="text-brand-200 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Historique ── */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">📋 Historique des transactions</h3>

          {/* Filtre type */}
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
            {(["all", "participation", "gain", "remboursement"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterType === f
                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {f === "all" ? "Toutes" : f === "participation" ? "Participations" : f === "gain" ? "Gains" : "Remboursements"}
              </button>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100 dark:border-gray-800">
          <div className="col-span-1">Type</div>
          <div className="col-span-4">Challenge</div>
          <div className="col-span-3">Date</div>
          <div className="col-span-2">Statut</div>
          <div className="col-span-2 text-right">Montant</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-3xl mb-3">💳</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Aucune transaction trouvée.</p>
            </div>
          ) : (
            filtered.map((t) => {
              const cfg = TYPE_CONFIG[t.type];
              const positive = t.montant > 0;
              return (
                <div key={t.id} className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  {/* Icône */}
                  <div className="col-span-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${cfg.colorClass}`}>
                      {cfg.icon}
                    </div>
                  </div>

                  {/* Challenge */}
                  <div className="col-span-5 sm:col-span-4 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{t.challenge}</p>
                    {t.reference && (
                      <p className="text-xs text-gray-400 mt-0.5 font-mono truncate">{t.reference}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="col-span-3 hidden sm:block">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{fmtDate(t.date)}</p>
                  </div>

                  {/* Statut */}
                  <div className="col-span-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUT_TRANS[t.statut]}`}>
                      {t.statut === "complete" ? "Complété" : t.statut === "en_attente" ? "En attente" : "Échoué"}
                    </span>
                  </div>

                  {/* Montant */}
                  <div className="col-span-4 sm:col-span-2 text-right">
                    <p className={`text-sm font-extrabold ${cfg.amountClass}`}>
                      {positive ? "+" : ""}{fmt(t.montant)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer total */}
        {filtered.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {filtered.length} transaction{filtered.length > 1 ? "s" : ""}
              </span>
              <div className="text-right">
                <span className="text-xs text-gray-400 mr-2">Solde net affiché :</span>
                <span className={`text-sm font-bold ${
                  filtered.reduce((s, t) => s + t.montant, 0) >= 0 ? "text-success-500" : "text-error-500"
                }`}>
                  {filtered.reduce((s, t) => s + t.montant, 0) >= 0 ? "+" : ""}
                  {fmt(filtered.reduce((s, t) => s + t.montant, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
