// src/pages/Challenges/ChallengeDetail.tsx — connecté à l'API
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Spinner } from "../../components/common/Spinner";
import { ErrorBox } from "../../components/common/ErrorBox";
import { useChallenge } from "../../hooks/useApi";
import { participationsApi, soumissionsApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

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

const TABS = ["info", "trophees", "jury", "participants", "soumissions"] as const;
type Tab = typeof TABS[number];
const TAB_LABELS: Record<Tab, string> = {
  info: "ℹ️ Infos", trophees: "🏆 Trophées", jury: "⚖️ Jury",
  participants: "👥 Participants", soumissions: "📤 Soumissions",
};

function ModalSoumission({ participationId, onClose, onSubmitted }: {
  participationId: number; onClose: () => void; onSubmitted: () => void;
}) {
  const [type, setType] = useState("lien");
  const [url, setUrl]   = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!url.trim()) { setError("L'URL est obligatoire."); return; }
    setLoading(true); setError(null);
    try {
      await soumissionsApi.soumettre(participationId, { type_livrable: type, url_fichier: url, description: desc });
      onSubmitted();
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors de la soumission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/60">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-xl">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">📤 Soumettre mon livrable</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Vous ne pouvez soumettre qu'une seule fois.</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Type de livrable <span className="text-error-500">*</span></label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:border-brand-300 focus:outline-none">
              {[["lien","🔗 Lien URL"],["photo","📷 Photo"],["video","🎥 Vidéo"],["apk","📱 APK"],["pdf","📄 PDF"],["autre","📎 Autre"]].map(([v,l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">URL / Lien <span className="text-error-500">*</span></label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..."
              className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Description (optionnel)</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Décrivez votre travail..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none resize-none" />
          </div>
          {error && <p className="text-sm text-error-500 text-center">⚠️ {error}</p>}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={loading}
            className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:opacity-40">
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !url.trim()}
            className="flex-1 h-11 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            {loading ? "Envoi..." : "✓ Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const { data: challenge, loading, error, refetch } = useChallenge(id ? Number(id) : null);
  const [tab, setTab] = useState<Tab>("info");
  const [showSoumission, setShowSoumission] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError]     = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleParticiper = async () => {
    if (!challenge) return;
    setJoinLoading(true); setJoinError(null);
    try {
      await participationsApi.participer(challenge.id);
      await refreshUser();
      await refetch();
      showToast("Inscription confirmée ! Bienvenue dans ce challenge.");
    } catch (e: any) {
      setJoinError(e?.message ?? "Erreur lors de l'inscription.");
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) return <><PageBreadcrumb pageTitle="Détail" /><Spinner /></>;
  if (error)   return <><PageBreadcrumb pageTitle="Détail" /><ErrorBox message={error} onRetry={refetch} /></>;
  if (!challenge) return null;

  const pct = Math.min(100, Math.round(((challenge.nb_participants_actuels ?? 0) / challenge.nb_participants_min) * 100));
  const totalPrix = (challenge.trophees ?? []).reduce((s: number, t: any) => s + (t.valeur_monetaire ?? 0), 0);
  const maParticipation = challenge.ma_participation;
  const estJure         = challenge.est_juré;
  const estCreateur     = challenge.est_createur;

  return (
    <>
      <PageMeta title={`${challenge.nom} — ChallengeHub`} description={challenge.description} />
      <PageBreadcrumb pageTitle={challenge.nom} />

      <button onClick={() => navigate("/challenges")}
        className="mb-5 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center gap-1">
        ← Retour aux challenges
      </button>

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 p-6 mb-5 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-5">
            <div>
              <div className="text-4xl mb-2">{challenge.type?.icone ?? "🏆"}</div>
              <h1 className="text-xl font-bold">{challenge.nom}</h1>
              <p className="text-brand-100 text-sm mt-1">par {challenge.createur?.prenom} {challenge.createur?.nom}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white`}>
                {STATUT_CONFIG[challenge.statut]?.label ?? challenge.statut}
              </span>
              <p className="text-brand-100 text-sm">📅 Clôture : {fmtDate(challenge.date_cloture)}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <div><p className="text-brand-200 text-xs uppercase font-semibold">Frais d'entrée</p><p className="text-2xl font-extrabold">{fmt(challenge.frais_participation)}</p></div>
            <div><p className="text-brand-200 text-xs uppercase font-semibold">Prix total</p><p className="text-2xl font-extrabold text-yellow-300">{fmt(totalPrix)}</p></div>
            <div><p className="text-brand-200 text-xs uppercase font-semibold">Participants</p><p className="text-2xl font-extrabold">{challenge.nb_participants_actuels ?? 0}/{challenge.nb_participants_max ?? "∞"}</p></div>
          </div>
        </div>
      </div>

      {/* Quorum */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Progression du quorum</span>
          <span className={`text-sm font-bold ${pct >= 100 ? "text-success-500" : "text-warning-500"}`}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-2">
          <div className={`h-full rounded-full ${pct >= 100 ? "bg-success-500" : "bg-warning-400"}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {challenge.nb_participants_actuels ?? 0} inscrit(s) — minimum requis : {challenge.nb_participants_min}
          {pct < 100 && <span className="text-warning-500 ml-2">⚠️ {challenge.nb_participants_min - (challenge.nb_participants_actuels ?? 0)} manquant(s)</span>}
          {pct >= 100 && <span className="text-success-500 ml-2">✓ Quorum atteint !</span>}
        </p>
      </div>

      {/* Bouton participer */}
      {challenge.statut === "ouvert" && !maParticipation && !estCreateur && !estJure && (
        <div className="rounded-2xl border border-success-200 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10 p-5 mb-5 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sm font-bold text-success-700 dark:text-success-400">🎯 Challenge ouvert aux inscriptions !</p>
            <p className="text-xs text-success-600 dark:text-success-300 mt-1">Rejoignez ce challenge pour {fmt(challenge.frais_participation)}.</p>
          </div>
          <button onClick={handleParticiper} disabled={joinLoading}
            className="px-5 py-2.5 bg-success-500 text-white text-sm font-bold rounded-lg hover:bg-success-600 transition-colors disabled:opacity-50">
            {joinLoading ? "Inscription..." : "✋ Participer maintenant"}
          </button>
        </div>
      )}

      {/* Alerte soumission */}
      {challenge.statut === "en_cours" && maParticipation && !maParticipation.soumis && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/10 p-5 mb-5 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sm font-bold text-brand-700 dark:text-brand-400">📤 Le challenge est en cours !</p>
            <p className="text-xs text-brand-600 dark:text-brand-300 mt-1">Soumettez votre livrable avant le {fmtDate(challenge.date_cloture)}.</p>
          </div>
          <button onClick={() => setShowSoumission(true)}
            className="px-5 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors">
            📤 Soumettre
          </button>
        </div>
      )}
      {challenge.statut === "en_cours" && maParticipation?.soumis && (
        <div className="rounded-2xl border border-success-200 bg-success-50 dark:border-success-500/30 dark:bg-success-500/10 p-4 mb-5">
          <p className="text-sm font-bold text-success-700 dark:text-success-400">✅ Votre livrable a été soumis avec succès.</p>
        </div>
      )}

      {joinError && <p className="mb-4 text-sm text-error-500 text-center">⚠️ {joinError}</p>}

      {/* Tabs */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "bg-brand-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === "info" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Description & Règlement</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{challenge.description}</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  ["📅 Lancement", fmtDate(challenge.date_lancement)],
                  ["🏁 Clôture",   fmtDate(challenge.date_cloture)],
                  ["💰 Frais",     fmt(challenge.frais_participation)],
                  ["🏷️ Type",     `${challenge.type?.icone ?? ""} ${challenge.type?.libelle ?? ""}`],
                  ["👀 Visibilité",challenge.visibilite === "public" ? "🌍 Public" : "🔒 Privé"],
                  ["📊 Commission",`${challenge.commission_pct}%`],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-xs text-gray-400 mb-1">{k}</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "trophees" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">🏆 Palmarès & Récompenses</h3>
              <div className="space-y-3">
                {(challenge.trophees ?? []).map((t: any) => (
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

          {tab === "jury" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">⚖️ Membres du Jury</h3>
              {(challenge.jury_membres ?? []).length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-10">Aucun jury désigné pour l'instant.</p>
              ) : (
                <div className="space-y-3">
                  {(challenge.jury_membres ?? []).map((j: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                      <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm">
                        {j.user?.prenom?.[0]}{j.user?.nom?.[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{j.user?.prenom} {j.user?.nom}</p>
                        <p className="text-xs text-gray-400">{j.user?.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        j.statut_invitation === "accepte"
                          ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                          : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400"
                      }`}>
                        {j.statut_invitation === "accepte" ? "✓ Accepté" : "⏳ En attente"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === "participants" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                👥 Participants ({challenge.nb_participants_actuels ?? 0})
              </h3>
              <div className="space-y-2">
                {Array.from({ length: challenge.nb_participants_actuels ?? 0 }, (_, i) => (
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

          {tab === "soumissions" && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">📤 Soumissions</h3>
              {!["deliberation","termine"].includes(challenge.statut) ? (
                <div className="text-center py-12">
                  <p className="text-4xl mb-3">🔒</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Les soumissions seront visibles en phase de délibération.</p>
                </div>
              ) : (challenge.resultats ?? []).length > 0 ? (
                <div className="space-y-3">
                  {(challenge.resultats ?? []).map((r: any) => (
                    <div key={r.id} className={`flex items-center gap-4 p-4 rounded-xl border ${
                      r.rang_final === 1 ? "bg-warning-50 border-warning-200 dark:bg-warning-500/10 dark:border-warning-500/30" : "bg-gray-50 border-gray-200 dark:bg-gray-900/50 dark:border-gray-800"
                    }`}>
                      <span className="text-2xl">{r.rang_final === 1 ? "🥇" : r.rang_final === 2 ? "🥈" : "🥉"}</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{r.participation?.user?.prenom} {r.participation?.user?.nom}</p>
                        <p className="text-xs text-gray-400">Note : {r.note_moyenne}/10</p>
                      </div>
                      {r.gain_verse > 0 && <p className="text-sm font-extrabold text-success-600">{fmt(r.gain_verse)}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 text-center py-10">Délibération en cours...</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal soumission */}
      {showSoumission && maParticipation && (
        <ModalSoumission
          participationId={maParticipation.id}
          onClose={() => setShowSoumission(false)}
          onSubmitted={() => { refetch(); showToast("Livrable soumis avec succès !"); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[99999] px-5 py-3 rounded-xl bg-success-500 text-white text-sm font-medium shadow-lg">
          ✓ {toast}
        </div>
      )}
    </>
  );
}
