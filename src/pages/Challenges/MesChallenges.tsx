import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  MES_CHALLENGES_CREES, fmt, fmtDate, quorumPct, totalPrix, STATUT_CONFIG,
  type Challenge,
} from "../../data/mockData";

function StatutBadge({ statut }: { statut: string }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.brouillon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

function QuorumBar({ c }: { c: Challenge }) {
  const pct = quorumPct(c);
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
        <span>{c.nb_participants_actuels} / {c.nb_participants_min} min</span>
        <span className={`font-semibold ${pct >= 100 ? "text-success-500" : "text-warning-500"}`}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${pct >= 100 ? "bg-success-500" : "bg-warning-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function MesChallenges() {
  const navigate = useNavigate();

  return (
    <>
      <PageMeta title="Mes Challenges — ChallengeHub" description="Gérez vos challenges créés" />
      <PageBreadcrumb pageTitle="Mes Challenges" />

      <div className="flex justify-end mb-5">
        <button
          onClick={() => navigate("/challenges/creer")}
          className="px-5 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          + Créer un challenge
        </button>
      </div>

      {MES_CHALLENGES_CREES.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-16 text-center">
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucun challenge créé</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Lancez votre premier challenge dès maintenant !</p>
          <button onClick={() => navigate("/challenges/creer")} className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600">
            Créer un challenge
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {MES_CHALLENGES_CREES.map((c) => {
            const prix = totalPrix(c);
            const fonds = c.nb_participants_actuels * c.frais_participation;
            return (
              <div key={c.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col">
                <div className="p-5 flex-1 space-y-4">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-xl flex-shrink-0">
                        {c.type.icone}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.nom}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{c.type.libelle}</p>
                      </div>
                    </div>
                    <StatutBadge statut={c.statut} />
                  </div>

                  {/* Quorum */}
                  <QuorumBar c={c} />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-center">
                      <p className="text-xs text-gray-400">Participants</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{c.nb_participants_actuels}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-warning-50 dark:bg-warning-500/10 text-center">
                      <p className="text-xs text-gray-400">Prix total</p>
                      <p className="text-xs font-bold text-warning-600 dark:text-warning-400 mt-0.5">{fmt(prix)}</p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-success-50 dark:bg-success-500/10 text-center">
                      <p className="text-xs text-gray-400">Fonds</p>
                      <p className="text-xs font-bold text-success-600 dark:text-success-400 mt-0.5">{fmt(fonds)}</p>
                    </div>
                  </div>

                  {/* Jury */}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    ⚖️ Jury : {c.jury.length} membre{c.jury.length > 1 ? "s" : ""}
                    {c.jury.length > 0 && (
                      <span className={`ml-2 font-medium ${
                        c.jury.every((j) => j.statut === "accepte") ? "text-success-500" : "text-warning-500"
                      }`}>
                        ({c.jury.filter((j) => j.statut === "accepte").length} accepté{c.jury.filter((j) => j.statut === "accepte").length > 1 ? "s" : ""})
                      </span>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>🚀 {fmtDate(c.date_lancement)}</span>
                    <span>🏁 {fmtDate(c.date_cloture)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-5 pb-5 flex gap-2">
                  <button
                    onClick={() => navigate(`/challenges/${c.id}`)}
                    className="flex-1 h-9 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                  >
                    Voir détails
                  </button>
                  {c.statut === "brouillon" && (
                    <button className="flex-1 h-9 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors">
                      Publier
                    </button>
                  )}
                  {c.statut === "deliberation" && (
                    <button className="flex-1 h-9 rounded-lg bg-warning-500 text-white text-xs font-medium hover:bg-warning-600 transition-colors">
                      ⚖️ Délibérer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}