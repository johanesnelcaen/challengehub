import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  CHALLENGES, fmt, fmtDate, quorumPct, totalPrix, STATUT_CONFIG,
} from "../../data/mockData";

const TABS = ["info", "trophees", "jury", "participants", "soumissions"] as const;
type Tab = typeof TABS[number];

function StatutBadge({ statut }: { statut: string }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.brouillon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </span>
  );
}

// ── Modal Soumission ──────────────────────────────────────────────────────
function ModalSoumission({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: any) => void }) {
  const [type, setType] = useState("lien");
  const [url, setUrl] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/50">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">📤 Soumettre mon livrable</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Vous ne pouvez soumettre qu'une seule fois.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Type de livrable <span className="text-error-500">*</span>
            </label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:border-brand-300 focus:outline-none">
              <option value="lien">🔗 Lien URL</option>
              <option value="photo">📷 Photo</option>
              <option value="video">🎥 Vidéo</option>
              <option value="apk">📱 APK</option>
              <option value="pdf">📄 PDF</option>
              <option value="autre">📎 Autre</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              URL / Lien <span className="text-error-500">*</span>
            </label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Description (optionnel)
            </label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
              placeholder="Décrivez votre travail..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose}
            className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
            Annuler
          </button>
          <button onClick={() => onSubmit({ type, url, desc })} disabled={!url}
            className="flex-1 h-11 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            ✓ Envoyer ma soumission
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChallengeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("info");
  const [showSoumission, setShowSoumission] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const challenge = CHALLENGES.find((c) => c.id === Number(id));
  if (!challenge) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Challenge introuvable.</p>
      <button onClick={() => navigate("/challenges")} className="mt-4 text-brand-500 hover:underline text-sm">← Retour</button>
    </div>
  );

  const pct = quorumPct(challenge);
  const isParticipant = [2, 3].includes(challenge.id);
  const prix = totalPrix(challenge);

  const TAB_LABELS: Record<Tab, string> = {
    info: "ℹ️ Infos",
    trophees: "🏆 Trophées",
    jury: "⚖️ Jury",
    participants: "👥 Participants",
    soumissions: "📤 Soumissions",
  };

  return (
    <>
      <PageMeta title={`${challenge.nom} — ChallengeHub`} description={challenge.description} />
      <PageBreadcrumb pageTitle={challenge.nom} />

      {/* ── Hero Banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 p-6 mb-5 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
            <div>
              <div className="text-4xl mb-2">{challenge.type.icone}</div>
              <h1 className="text-xl font-bold leading-tight">{challenge.nom}</h1>
              <p className="text-brand-100 text-sm mt-1">par {challenge.createur.prenom} {challenge.createur.nom}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StatutBadge statut={challenge.statut} />
              <p className="text-brand-100 text-sm">📅 Clôture : {fmtDate(challenge.date_cloture)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-brand-200 text-xs uppercase font-semibold">Frais d'entrée</p>
              <p className="text-2xl font-extrabold">{fmt(challenge.frais_participation)}</p>
            </div>
            <div>
              <p className="text-brand-200 text-xs uppercase font-semibold">Prix total</p>
              <p className="text-2xl font-extrabold text-yellow-300">{fmt(prix)}</p>
            </div>
            <div>
              <p className="text-brand-200 text-xs uppercase font-semibold">Participants</p>
              <p className="text-2xl font-extrabold">{challenge.nb_participants_actuels}/{challenge.nb_participants_max ?? "∞"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quorum ── */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Progression du quorum</span>
          <span className={`text-sm font-bold ${pct >= 100 ? "text-success-500" : "text-warning-500"}`}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2">
          <div className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-success-500" : "bg-warning-400"}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {challenge.nb_participants_actuels} inscrit{challenge.nb_participants_actuels > 1 ? "s" : ""} — minimum requis : {challenge.nb_participants_min}
          {pct < 100 && <span className="text-warning-500 ml-2">⚠️ {challenge.nb_participants_min - challenge.nb_participants_actuels} participant(s) manquant(s)</span>}
          {pct >= 100 && <span className="text-success-500 ml-2">✓ Quorum atteint !</span>}
        </p>
      </div>

      {/* ── Alerte soumission ── */}
      {challenge.statut === "en_cours" && isParticipant && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10 p-5 mb-5 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sm font-bold text-brand-700 dark:text-brand-400">📤 Ce challenge est en cours !</p>
            <p className="text-xs text-brand-600 dark:text-brand-300 mt-1">
              {submitted ? "Votre soumission a été envoyée." : `Soumettez votre livrable avant le ${fmtDate(challenge.date_cloture)}`}
            </p>
          </div>
          {!submitted
            ? <button onClick={() => setShowSoumission(true)} className="px-5 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">📤 Soumettre</button>
            : <span className="px-4 py-2 rounded-lg border border-success-300 text-success-600 text-sm font-medium">✓ Déjà soumis</span>
          }
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Tab bar */}
        <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t
                  ? "bg-brand-500 text-white"
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-5">
          {/* INFO */}
          {tab === "info" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Description & Règlement</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{challenge.description}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["📅 Lancement", fmtDate(challenge.date_lancement)],
                  ["🏁 Clôture", fmtDate(challenge.date_cloture)],
                  ["💰 Frais", fmt(challenge.frais_participation)],
                  ["🏷️ Type", `${challenge.type.icone} ${challenge.type.libelle}`],
                  ["👀 Visibilité", challenge.visibilite === "public" ? "🌍 Public" : "🔒 Privé"],
                  ["📊 Commission", `${challenge.commission_pct}%`],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-xs text-gray-400 mb-1">{k}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TROPHÉES */}
          {tab === "trophees" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">🏆 Palmarès & Récompenses</h3>
              <div className="space-y-3">
                {challenge.trophees.map((t) => (
                  <div key={t.rang} className={`flex items-center gap-4 p-4 rounded-xl border ${
                    t.rang === 1 ? "bg-warning-50 border-warning-200 dark:bg-warning-500/10 dark:border-warning-500/30" : "bg-gray-50 border-gray-200 dark:bg-gray-900/50 dark:border-gray-800"
                  }`}>
                    <span className="text-3xl">{t.rang === 1 ? "🥇" : t.rang === 2 ? "🥈" : "🥉"}</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{t.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">{t.type_trophee}</p>
                    </div>
                    {t.valeur_monetaire > 0 && (
                      <p className="text-lg font-extrabold text-warning-600 dark:text-warning-400">{fmt(t.valeur_monetaire)}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* JURY */}
          {tab === "jury" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">⚖️ Membres du Jury</h3>
              {challenge.jury.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Aucun jury désigné pour l'instant.</p>
              ) : (
                <div className="space-y-3">
                  {challenge.jury.map((j, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                      <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                        {j.prenom[0]}{j.nom[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{j.prenom} {j.nom}</p>
                        <p className="text-xs text-gray-400">{j.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        j.statut === "accepte"
                          ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                          : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400"
                      }`}>
                        {j.statut === "accepte" ? "✓ Accepté" : "⏳ En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PARTICIPANTS */}
          {tab === "participants" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                👥 Participants inscrits ({challenge.nb_participants_actuels})
              </h3>
              <div className="space-y-2">
                {Array.from({ length: challenge.nb_participants_actuels }, (_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                    <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">Participant {i + 1}</p>
                    <span className="text-xs text-success-600 font-semibold">✓ Payé</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOUMISSIONS */}
          {tab === "soumissions" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">📤 Soumissions</h3>
              {challenge.statut !== "deliberation" && challenge.statut !== "termine" ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🔒</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Les soumissions seront visibles à partir de la phase de délibération.</p>
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-10">Délibération en cours par le jury...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal soumission */}
      {showSoumission && (
        <ModalSoumission
          onClose={() => setShowSoumission(false)}
          onSubmit={() => { setSubmitted(true); setShowSoumission(false); }}
        />
      )}
    </>
  );
}