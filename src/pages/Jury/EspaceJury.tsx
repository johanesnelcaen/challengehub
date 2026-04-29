// src/pages/Jury/EspaceJury.tsx — connecté à l'API
import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Spinner } from "../../components/common/Spinner";
import { ErrorBox } from "../../components/common/ErrorBox";
import { EmptyState } from "../../components/common/EmptyState";
import { useJury, useJurySoumissions } from "../../hooks/useApi";
import { evaluationsApi, challengesApi } from "../../services/api";

// ── Composant notation étoiles ─────────────────────────────────────────────
function EtoileNote({ note, onChange }: { note: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button key={n} type="button"
          onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className={`text-2xl transition-colors ${n <= (hover || note) ? "text-warning-400" : "text-gray-200 dark:text-gray-700"}`}>
          ★
        </button>
      ))}
      <span className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-300 min-w-[40px]">
        {note > 0 ? `${note}/10` : "—"}
      </span>
    </div>
  );
}

// ── Modal évaluation ───────────────────────────────────────────────────────
function ModalEvaluation({ item, juryId, onClose, onSaved }: {
  item: any; juryId: number; onClose: () => void; onSaved: () => void;
}) {
  const [note, setNote]           = useState<number>(item.ma_note ?? 0);
  const [commentaire, setComment] = useState<string>(item.mon_commentaire ?? "");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSave = async () => {
    if (note === 0) { setError("Veuillez attribuer une note."); return; }
    setLoading(true);
    setError(null);
    try {
      if (item.evaluation_id) {
        await evaluationsApi.update(item.evaluation_id, { note, commentaire });
      } else {
        await evaluationsApi.noter({ soumission_id: item.soumission_id, note, commentaire });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Erreur lors de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/60">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-brand-600 to-brand-400 p-5 text-white">
          <h4 className="text-lg font-bold">⚖️ Évaluation de la soumission</h4>
          <p className="text-brand-100 text-sm mt-1">{item.challenge_nom}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Participant */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {String(item.participant?.prenom?.[0] ?? "?")}
              {String(item.participant?.nom?.[0] ?? "")}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {item.participant?.prenom} {item.participant?.nom}
              </p>
              <p className="text-xs text-gray-400">Type : {item.type_livrable}</p>
            </div>
          </div>

          {/* Livrable */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📎 Livrable soumis</p>
            <a href={item.url_fichier} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors">
              <span>🔗</span>
              <span className="truncate flex-1">{item.url_fichier}</span>
              <span className="flex-shrink-0">↗</span>
            </a>
          </div>

          {/* Note */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              🌟 Note <span className="text-error-500">*</span>
            </p>
            <EtoileNote note={note} onChange={setNote} />
          </div>

          {/* Commentaire */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">💬 Commentaire (optionnel)</p>
            <textarea value={commentaire} onChange={(e) => setComment(e.target.value)} rows={3}
              placeholder="Donnez un retour constructif..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none resize-none" />
          </div>

          {error && <p className="text-sm text-error-500 text-center">⚠️ {error}</p>}

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} disabled={loading}
              className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] disabled:opacity-40">
              Annuler
            </button>
            <button onClick={handleSave} disabled={loading || note === 0}
              className="flex-1 h-11 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {loading ? "Enregistrement..." : "✓ Valider la note"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────
export default function EspaceJury() {
  const navigate = useNavigate();
  const { data: challenges, loading: loadingChallenges, error: errorChallenges } = useJury();
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null);
  const [modalItem, setModalItem] = useState<any>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success"|"error"; msg: string } | null>(null);

  const { data: juryChallengeData, loading: loadingSoumissions, refetch: refetchSoumissions } =
    useJurySoumissions(selectedChallengeId);

  const soumissions: any[]  = juryChallengeData?.soumissions ?? [];
  const juryId: number|null = juryChallengeData?.jury_id ?? null;
  const challenge            = juryChallengeData?.challenge ?? null;

  const noteCount = soumissions.filter((s: any) => s.statut_jury === "note").length;
  const total     = soumissions.length;

  const showToast = (type: "success"|"error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handlePublierResultats = async () => {
    if (!selectedChallengeId) return;
    if (!confirm("Publier les résultats officiels ? Cette action est irréversible.")) return;
    setPublishLoading(true);
    try {
      await challengesApi.publierResultats(selectedChallengeId);
      showToast("success", "Résultats publiés ! Les gains ont été versés aux gagnants.");
      setSelectedChallengeId(null);
    } catch (e: any) {
      showToast("error", e?.message ?? "Erreur lors de la publication.");
    } finally {
      setPublishLoading(false);
    }
  };

  if (loadingChallenges) return <><PageBreadcrumb pageTitle="Espace Jury" /><Spinner /></>;
  if (errorChallenges)   return <><PageBreadcrumb pageTitle="Espace Jury" /><ErrorBox message={errorChallenges} /></>;

  const challengesList: any[] = Array.isArray(challenges) ? challenges : [];

  return (
    <>
      <PageMeta title="Espace Jury — ChallengeHub" description="Évaluez les soumissions" />
      <PageBreadcrumb pageTitle="Espace Jury" />

      {challengesList.length === 0 ? (
        <EmptyState icon="⚖️" title="Aucun challenge à juger"
          description="Vous n'êtes membre du jury d'aucun challenge pour le moment."
          action={{ label: "Explorer les challenges", onClick: () => navigate("/challenges") }} />
      ) : (
        <div className="grid grid-cols-12 gap-5">

          {/* ── Liste des challenges où je suis juré ── */}
          <div className="col-span-12 xl:col-span-4">
            <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
              <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mes challenges à juger</h3>
                <p className="text-xs text-gray-400 mt-1">{challengesList.length} challenge{challengesList.length > 1 ? "s" : ""}</p>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {challengesList.map((c: any) => (
                  <button key={c.jury_id} onClick={() => setSelectedChallengeId(c.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${
                      selectedChallengeId === c.id ? "bg-brand-50 dark:bg-brand-500/10 border-l-4 border-brand-500" : ""
                    }`}>
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{c.nom}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {c.nb_evaluations ?? 0} / {c.nb_soumissions ?? 0} notées
                        </p>
                      </div>
                      <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        c.statut === "deliberation"
                          ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400"
                          : "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                      }`}>
                        {c.statut}
                      </span>
                    </div>
                    {c.nb_soumissions > 0 && (
                      <div className="mt-2 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full bg-brand-500"
                          style={{ width: `${Math.round(((c.nb_evaluations ?? 0) / c.nb_soumissions) * 100)}%` }} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Soumissions à évaluer ── */}
          <div className="col-span-12 xl:col-span-8">
            {!selectedChallengeId ? (
              <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-16 text-center">
                <p className="text-4xl mb-4">👈</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Sélectionnez un challenge à gauche pour voir les soumissions à évaluer.</p>
              </div>
            ) : loadingSoumissions ? (
              <Spinner text="Chargement des soumissions..." />
            ) : (
              <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                {/* Header */}
                <div className="p-5 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-start flex-wrap gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                        {challenge?.nom ?? "Soumissions"}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {noteCount} / {total} évaluée{total > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">Progression</p>
                      <p className="text-lg font-extrabold text-brand-600 dark:text-brand-400">
                        {total > 0 ? Math.round((noteCount / total) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500 transition-all duration-500"
                      style={{ width: `${total > 0 ? Math.round((noteCount / total) * 100) : 0}%` }} />
                  </div>
                </div>

                {/* Soumissions list */}
                {soumissions.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-3xl mb-3">📭</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Aucune soumission reçue pour ce challenge.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {soumissions.map((s: any) => (
                      <div key={s.soumission_id} className="p-5 flex flex-wrap items-center gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {String(s.participant?.prenom?.[0] ?? "?")}
                          {String(s.participant?.nom?.[0] ?? "")}
                        </div>

                        {/* Infos */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {s.participant?.prenom} {s.participant?.nom}
                          </p>
                          <div className="flex flex-wrap gap-3 mt-1">
                            <span className="text-xs text-gray-400">Type : {s.type_livrable}</span>
                            <a href={s.url_fichier} target="_blank" rel="noopener noreferrer"
                              className="text-xs text-brand-500 hover:text-brand-600 hover:underline truncate max-w-[200px]">
                              🔗 Voir le livrable ↗
                            </a>
                          </div>
                        </div>

                        {/* Note actuelle */}
                        {s.statut_jury === "note" && s.ma_note != null ? (
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 10 }, (_, i) => (
                              <span key={i} className={`text-sm ${i < s.ma_note ? "text-warning-400" : "text-gray-200 dark:text-gray-700"}`}>★</span>
                            ))}
                            <span className="text-sm font-bold text-gray-900 dark:text-white ml-1">{s.ma_note}/10</span>
                          </div>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
                            ⏳ Non noté
                          </span>
                        )}

                        {/* Bouton noter / modifier */}
                        <button
                          onClick={() => setModalItem({ ...s, challenge_nom: challenge?.nom, jury_id: juryId })}
                          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            s.statut_jury === "note"
                              ? "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                              : "bg-brand-500 text-white hover:bg-brand-600"
                          }`}>
                          {s.statut_jury === "note" ? "✏️ Modifier" : "⚖️ Noter"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Publier résultats */}
                {noteCount === total && total > 0 && challenge?.statut === "deliberation" && (
                  <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-success-50 dark:bg-success-500/10 rounded-b-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-success-700 dark:text-success-400">
                          ✅ Toutes les soumissions ont été notées !
                        </p>
                        <p className="text-xs text-success-600 dark:text-success-300 mt-0.5">
                          Vous pouvez maintenant publier les résultats officiels.
                        </p>
                      </div>
                      <button onClick={handlePublierResultats} disabled={publishLoading}
                        className="px-6 py-2.5 bg-success-500 text-white text-sm font-bold rounded-lg hover:bg-success-600 transition-colors disabled:opacity-50">
                        {publishLoading ? "Publication..." : "🏆 Publier les résultats"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal évaluation */}
      {modalItem && juryId && (
        <ModalEvaluation
          item={modalItem}
          juryId={juryId}
          onClose={() => setModalItem(null)}
          onSaved={() => { refetchSoumissions(); showToast("success", "Évaluation enregistrée !"); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[99999] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg ${
          toast.type === "success" ? "bg-success-500" : "bg-error-500"
        }`}>
          {toast.type === "success" ? "✓" : "⚠️"} {toast.msg}
        </div>
      )}
    </>
  );
}
