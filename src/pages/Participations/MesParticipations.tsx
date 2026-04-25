// ════════════════════════════════════════════════════════════════
//  MesParticipations.tsx
// ════════════════════════════════════════════════════════════════
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { CHALLENGES, MES_PARTICIPATIONS, fmt, fmtDate, STATUT_CONFIG } from "../../data/mockData";

function StatutBadge({ statut }: { statut: string }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.brouillon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />{cfg.label}
    </span>
  );
}

export function MesParticipations() {
  const navigate = useNavigate();
  return (
    <>
      <PageMeta title="Mes Participations — ChallengeHub" description="Suivez vos challenges rejoints" />
      <PageBreadcrumb pageTitle="Mes Participations" />

      {MES_PARTICIPATIONS.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-16 text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucune participation</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Rejoignez un challenge pour commencer !</p>
          <button onClick={() => navigate("/challenges")} className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600">
            Explorer les challenges
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {MES_PARTICIPATIONS.map((p, i) => {
            const ch = CHALLENGES.find((c) => c.id === p.challenge_id);
            return (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {ch?.type.icone}
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">{p.challenge_nom}</h4>
                      <div className="flex flex-wrap gap-4 mt-1">
                        <span className="text-xs text-gray-400">Inscrit le {fmtDate(p.date_paiement)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">💰 {fmt(p.montant_paye)}</span>
                        {ch && <StatutBadge statut={ch.statut} />}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      p.soumis
                        ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                        : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400"
                    }`}>
                      {p.soumis ? "✓ Livrable soumis" : "⏳ En attente de soumission"}
                    </span>
                    <button
                      onClick={() => ch && navigate(`/challenges/${ch.id}`)}
                      className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
                    >
                      Voir le challenge
                    </button>
                  </div>
                </div>

                {/* Livrable soumis */}
                {p.soumis && p.url_livrable && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Livrable soumis ({p.type_livrable})</p>
                    <a href={p.url_livrable} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-brand-500 hover:text-brand-600 underline">{p.url_livrable}</a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default MesParticipations;