import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  CHALLENGES, CURRENT_USER, TYPES_CHALLENGE,
  fmt, fmtDate, quorumPct, totalPrix, STATUT_CONFIG,
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
        <div className={`h-full rounded-full ${pct >= 100 ? "bg-success-500" : "bg-warning-400"}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ── Modal confirmation participation ───────────────────────────────────────
function ModalParticipation({
  challenge, onClose, onConfirm,
}: {
  challenge: Challenge; onClose: () => void; onConfirm: () => void;
}) {
  const reste = CURRENT_USER.solde_wallet - challenge.frais_participation;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/50">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Confirmer la participation
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Vous allez rejoindre <strong className="text-gray-800 dark:text-white">{challenge.nom}</strong>
        </p>

        <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 p-4 space-y-2 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Frais de participation</span>
            <span className="font-bold text-brand-600 dark:text-brand-400">{fmt(challenge.frais_participation)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Votre solde actuel</span>
            <span className="font-semibold text-gray-900 dark:text-white">{fmt(CURRENT_USER.solde_wallet)}</span>
          </div>
          <div className="border-t border-brand-100 dark:border-brand-500/20 pt-2 flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Solde après inscription</span>
            <span className={`font-bold ${reste >= 0 ? "text-success-600" : "text-error-500"}`}>{fmt(reste)}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mb-5 leading-relaxed">
          ⚠️ Si le quorum de <strong>{challenge.nb_participants_min}</strong> participants n'est pas atteint avant le{" "}
          {fmtDate(challenge.date_lancement)}, vous serez automatiquement remboursé.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
          >
            Confirmer & Payer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Challenges() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [joinedIds, setJoinedIds] = useState<number[]>([2, 3]);
  const [joinModal, setJoinModal] = useState<Challenge | null>(null);

  const filtered = useMemo(
    () =>
      CHALLENGES.filter((c) => {
        const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase());
        const matchType = filterType === "all" || c.type_id === parseInt(filterType);
        const matchStatut = filterStatut === "all" || c.statut === filterStatut;
        return matchSearch && matchType && matchStatut;
      }),
    [search, filterType, filterStatut]
  );

  return (
    <>
      <PageMeta title="Challenges — ChallengeHub" description="Explorer et rejoindre des challenges" />
      <PageBreadcrumb pageTitle="Challenges" />

      {/* ── Filtres ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] mb-5">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 9a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 013 9zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
              </svg>
            </span>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un challenge..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10"
            />
          </div>

          {/* Type */}
          <select
            value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none"
          >
            <option value="all">Tous les types</option>
            {TYPES_CHALLENGE.map((t) => (
              <option key={t.id} value={t.id}>{t.icone} {t.libelle}</option>
            ))}
          </select>

          {/* Statut */}
          <select
            value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}
            className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:outline-none"
          >
            <option value="all">Tous les statuts</option>
            <option value="ouvert">Ouvert</option>
            <option value="en_cours">En cours</option>
            <option value="deliberation">Délibération</option>
            <option value="termine">Terminé</option>
          </select>

          <button
            onClick={() => navigate("/challenges/creer")}
            className="ml-auto h-10 px-5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors flex items-center gap-2"
          >
            <span>+</span> Créer un challenge
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} challenge{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Grille de cards ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => {
          const joined = joinedIds.includes(c.id);
          return (
            <div key={c.id} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] flex flex-col hover:shadow-md transition-shadow">
              {/* Card header */}
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-xl flex-shrink-0">
                      {c.type.icone}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{c.nom}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">par {c.createur.prenom} {c.createur.nom}</p>
                    </div>
                  </div>
                  <StatutBadge statut={c.statut} />
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                  {c.description}
                </p>

                <QuorumBar c={c} />

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-xs text-gray-400">Frais d'entrée</p>
                    <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-0.5">{fmt(c.frais_participation)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-warning-50 dark:bg-warning-500/10">
                    <p className="text-xs text-gray-400">Prix total</p>
                    <p className="text-sm font-bold text-warning-600 dark:text-warning-400 mt-0.5">{fmt(totalPrix(c))}</p>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-400 mt-4">
                  <span>📅 {fmtDate(c.date_cloture)}</span>
                  <span>👥 {c.nb_participants_actuels}/{c.nb_participants_max ?? "∞"}</span>
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
                {c.statut === "ouvert" && !joined && (
                  <button
                    onClick={() => setJoinModal(c)}
                    className="flex-1 h-9 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors"
                  >
                    Participer
                  </button>
                )}
                {joined && (
                  <button disabled className="flex-1 h-9 rounded-lg border border-success-300 text-success-600 text-xs font-medium cursor-not-allowed opacity-70">
                    ✓ Inscrit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {joinModal && (
        <ModalParticipation
          challenge={joinModal}
          onClose={() => setJoinModal(null)}
          onConfirm={() => {
            setJoinedIds((p) => [...p, joinModal.id]);
            setJoinModal(null);
          }}
        />
      )}
    </>
  );
}