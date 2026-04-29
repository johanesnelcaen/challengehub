import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { EVALUATIONS_JURY, type EvaluationJury } from "../../data/mockData";

function EtoileNote({ note, onChange }: { note: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className={`text-xl transition-colors ${
            n <= (hover || note) ? "text-warning-400" : "text-gray-300 dark:text-gray-700"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-300 self-center">
        {note > 0 ? `${note}/10` : "—"}
      </span>
    </div>
  );
}

function ModalEvaluation({
  item,
  onClose,
  onSave,
}: {
  item: EvaluationJury;
  onClose: () => void;
  onSave: (note: number, commentaire: string) => void;
}) {
  const [note, setNote] = useState(item.ma_note ?? 0);
  const [commentaire, setCommentaire] = useState(item.mon_commentaire ?? "");

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-gray-900/60">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-brand-400 p-5 text-white">
          <h4 className="text-lg font-bold">⚖️ Évaluation de la soumission</h4>
          <p className="text-brand-100 text-sm mt-1">{item.challenge_nom}</p>
        </div>

        <div className="p-6 space-y-5">
          {/* Participant */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {item.participant_nom.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.participant_nom}</p>
              <p className="text-xs text-gray-400">Type : {item.type_livrable}</p>
            </div>
          </div>

          {/* Livrable */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📎 Livrable soumis</p>
            <a
              href={item.url_fichier}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-xl border border-brand-200 dark:border-brand-500/30 bg-brand-50 dark:bg-brand-500/10 text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors"
            >
              <span>🔗</span>
              <span className="truncate">{item.url_fichier}</span>
              <span className="ml-auto flex-shrink-0">↗</span>
            </a>
          </div>

          {/* Note */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🌟 Note <span className="text-error-500">*</span>
            </p>
            <EtoileNote note={note} onChange={setNote} />
          </div>

          {/* Commentaire */}
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">💬 Commentaire (optionnel)</p>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              rows={3}
              placeholder="Donnez un retour constructif au participant..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none resize-none"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => onSave(note, commentaire)}
              disabled={note === 0}
              className="flex-1 h-11 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✓ Valider la note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EspaceJury() {
  const [evals, setEvals] = useState<EvaluationJury[]>(EVALUATIONS_JURY);
  const [selected, setSelected] = useState<EvaluationJury | null>(null);

  const handleSave = (note: number, commentaire: string) => {
    if (!selected) return;
    setEvals((prev) =>
      prev.map((e) =>
        e.soumission_id === selected.soumission_id
          ? { ...e, ma_note: note, mon_commentaire: commentaire, statut_jury: "note" }
          : e
      )
    );
    setSelected(null);
  };

  const total = evals.length;
  const notes = evals.filter((e) => e.statut_jury === "note").length;
  const enAttente = total - notes;
  const moyenneGlobale =
    notes > 0
      ? (evals.filter((e) => e.ma_note !== undefined).reduce((s, e) => s + (e.ma_note ?? 0), 0) / notes).toFixed(1)
      : "—";

  return (
    <>
      <PageMeta title="Espace Jury — ChallengeHub" description="Évaluez les soumissions des participants" />
      <PageBreadcrumb pageTitle="Espace Jury" />

      {/* Stats jury */}
      <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-3">
        {[
          { icon: "📋", label: "Total soumissions", value: total, color: "bg-brand-50 dark:bg-brand-500/10" },
          { icon: "✅", label: "Déjà notées", value: notes, color: "bg-success-50 dark:bg-success-500/10" },
          { icon: "⏳", label: "En attente", value: enAttente, color: "bg-warning-50 dark:bg-warning-500/10" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress global */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Progression des évaluations</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Moyenne globale</span>
            <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400">{moyenneGlobale}</span>
          </div>
        </div>
        <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: total > 0 ? `${Math.round((notes / total) * 100)}%` : "0%" }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {notes} / {total} soumission{total > 1 ? "s" : ""} évaluée{notes > 1 ? "s" : ""}
          {total > 0 && ` — ${Math.round((notes / total) * 100)}%`}
        </p>
      </div>

      {/* Liste des soumissions */}
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">📤 Soumissions à évaluer</h3>
          <p className="text-xs text-gray-400 mt-1">{evals[0]?.challenge_nom}</p>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {evals.map((e) => (
            <div key={e.soumission_id} className="p-5 flex flex-wrap items-center gap-4">
              {/* Avatar participant */}
              <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {e.participant_nom.split(" ").map((n) => n[0]).join("")}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{e.participant_nom}</p>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="text-xs text-gray-400">Type : {e.type_livrable}</span>
                  <a
                    href={e.url_fichier}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-500 hover:text-brand-600 hover:underline truncate max-w-[180px]"
                  >
                    🔗 Voir le livrable ↗
                  </a>
                </div>
              </div>

              {/* Note actuelle */}
              {e.statut_jury === "note" && e.ma_note !== undefined ? (
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 10 }, (_, i) => (
                      <span key={i} className={`text-sm ${i < e.ma_note! ? "text-warning-400" : "text-gray-200 dark:text-gray-700"}`}>★</span>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{e.ma_note}/10</span>
                </div>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400">
                  ⏳ Non noté
                </span>
              )}

              {/* Bouton */}
              <button
                onClick={() => setSelected(e)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  e.statut_jury === "note"
                    ? "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                    : "bg-brand-500 text-white hover:bg-brand-600"
                }`}
              >
                {e.statut_jury === "note" ? "✏️ Modifier" : "⚖️ Noter"}
              </button>
            </div>
          ))}
        </div>

        {/* Bouton publier résultats */}
        {notes === total && total > 0 && (
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
              <button className="px-6 py-2.5 bg-success-500 text-white text-sm font-bold rounded-lg hover:bg-success-600 transition-colors">
                🏆 Publier les résultats
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <ModalEvaluation
          item={selected}
          onClose={() => setSelected(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
