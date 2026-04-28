import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { TYPES_CHALLENGE, fmt, fmtDate } from "../../data/mockData";

type Trophee = { rang: number; description: string; valeur_monetaire: number; type_trophee: string };
type JuryItem = { email: string; statut: string };

interface FormData {
  nom: string; description: string; type_id: string; visibilite: string;
  nb_participants_min: number; nb_participants_max: number;
  frais_participation: number; date_lancement: string; date_cloture: string;
  trophees: Trophee[]; jury: JuryItem[];
}

const INITIAL_FORM: FormData = {
  nom: "", description: "", type_id: "1", visibilite: "public",
  nb_participants_min: 5, nb_participants_max: 20,
  frais_participation: 0, date_lancement: "", date_cloture: "",
  trophees: [{ rang: 1, description: "", valeur_monetaire: 0, type_trophee: "monetaire" }],
  jury: [],
};

const STEPS = ["Informations", "Participants & Frais", "Trophées", "Jury", "Récapitulatif"];

export default function CreerChallenge() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [juryInput, setJuryInput] = useState("");
  const [saved, setSaved] = useState(false);

  const upd = <K extends keyof FormData>(k: K, v: FormData[K]) => setForm((p) => ({ ...p, [k]: v }));

  const addTrophee = () =>
    setForm((p) => ({
      ...p,
      trophees: [...p.trophees, { rang: p.trophees.length + 1, description: "", valeur_monetaire: 0, type_trophee: "monetaire" }],
    }));

  const updTrophee = (i: number, k: keyof Trophee, v: any) =>
    setForm((p) => { const t = [...p.trophees]; t[i] = { ...t[i], [k]: v }; return { ...p, trophees: t }; });

  const removeTrophee = (i: number) =>
    setForm((p) => ({ ...p, trophees: p.trophees.filter((_, idx) => idx !== i).map((t, idx) => ({ ...t, rang: idx + 1 })) }));

  const addJury = () => {
    if (juryInput.trim()) {
      setForm((p) => ({ ...p, jury: [...p.jury, { email: juryInput, statut: "invite" }] }));
      setJuryInput("");
    }
  };

  const removeJury = (i: number) =>
    setForm((p) => ({ ...p, jury: p.jury.filter((_, idx) => idx !== i) }));

  if (saved) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-5">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Challenge créé avec succès !</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Votre challenge <strong className="text-gray-900 dark:text-white">{form.nom}</strong> a été publié.
          Les participants peuvent maintenant s'inscrire.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/challenges")}
            className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03]">
            Voir tous les challenges
          </button>
          <button onClick={() => { setSaved(false); setStep(1); setForm(INITIAL_FORM); }}
            className="px-6 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600">
            + Créer un autre
          </button>
        </div>
      </div>
    </div>
  );

  // Helpers input
  const inputCls = "w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10";
  const selectCls = "w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white focus:border-brand-300 focus:outline-none";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";
  const errorCls = "text-error-500";

  return (
    <>
      <PageMeta title="Créer un challenge — ChallengeHub" description="Créez et publiez un nouveau challenge" />
      <PageBreadcrumb pageTitle="Créer un challenge" />

      <div className="max-w-2xl mx-auto">
        {/* ── Stepper ── */}
        <div className="flex items-center mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div
                onClick={() => i + 1 < step && setStep(i + 1)}
                className={`flex items-center gap-2 ${i + 1 < step ? "cursor-pointer" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                  step === i + 1
                    ? "bg-brand-500 text-white"
                    : step > i + 1
                    ? "bg-success-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`hidden sm:block text-xs font-medium whitespace-nowrap ${
                  step === i + 1 ? "text-brand-500" : "text-gray-400 dark:text-gray-500"
                }`}>{s}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Form Card ── */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">

          {/* STEP 1 — Infos */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">ℹ️ Informations générales</h2>

              <div>
                <label className={labelCls}>Nom du challenge <span className={errorCls}>*</span></label>
                <input type="text" value={form.nom} onChange={(e) => upd("nom", e.target.value)}
                  placeholder="Ex : Hackathon IA West Africa" className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Description & Règlement</label>
                <textarea value={form.description} onChange={(e) => upd("description", e.target.value)}
                  rows={5} placeholder="Décrivez le challenge, les règles, les critères d'évaluation..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Type de challenge <span className={errorCls}>*</span></label>
                  <select value={form.type_id} onChange={(e) => upd("type_id", e.target.value)} className={selectCls}>
                    {TYPES_CHALLENGE.map((t) => (
                      <option key={t.id} value={t.id}>{t.icone} {t.libelle}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Visibilité</label>
                  <select value={form.visibilite} onChange={(e) => upd("visibilite", e.target.value)} className={selectCls}>
                    <option value="public">🌍 Public</option>
                    <option value="prive">🔒 Privé (invitation)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Participants & Frais */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">👥 Participants & Frais</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Participants minimum (quorum) <span className={errorCls}>*</span></label>
                  <input type="number" min={2} value={form.nb_participants_min}
                    onChange={(e) => upd("nb_participants_min", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Participants maximum</label>
                  <input type="number" value={form.nb_participants_max}
                    onChange={(e) => upd("nb_participants_max", Number(e.target.value))} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Frais de participation (FCFA)</label>
                <input type="number" min={0} value={form.frais_participation}
                  onChange={(e) => upd("frais_participation", Number(e.target.value))}
                  placeholder="0 = gratuit" className={inputCls} />
              </div>

              <div className="rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 p-4 text-sm text-brand-700 dark:text-brand-300">
                💡 Si le quorum de <strong>{form.nb_participants_min}</strong> participants n'est pas atteint à la date de lancement, le challenge est annulé et les paiements remboursés automatiquement.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Date de lancement <span className={errorCls}>*</span></label>
                  <input type="date" value={form.date_lancement}
                    onChange={(e) => upd("date_lancement", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Date de clôture <span className={errorCls}>*</span></label>
                  <input type="date" value={form.date_cloture}
                    onChange={(e) => upd("date_cloture", e.target.value)} className={inputCls} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Trophées */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">🏆 Trophées & Récompenses</h2>
                <button onClick={addTrophee}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  + Ajouter
                </button>
              </div>

              {form.trophees.map((t, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {i + 1}er rang
                    </span>
                    {i > 0 && (
                      <button onClick={() => removeTrophee(i)} className="text-error-500 hover:text-error-600 text-sm">Supprimer</button>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    <input type="text" value={t.description} onChange={(e) => updTrophee(i, "description", e.target.value)}
                      placeholder="Ex : 1er Prix + mention portfolio" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Valeur (FCFA)</label>
                      <input type="number" min={0} value={t.valeur_monetaire}
                        onChange={(e) => updTrophee(i, "valeur_monetaire", Number(e.target.value))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Type</label>
                      <select value={t.type_trophee} onChange={(e) => updTrophee(i, "type_trophee", e.target.value)} className={selectCls}>
                        <option value="monetaire">💰 Monétaire</option>
                        <option value="objet">🎁 Objet</option>
                        <option value="titre">🎖️ Titre</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4 — Jury */}
          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">⚖️ Membres du Jury</h2>

              <div className="rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 p-4 text-sm text-warning-700 dark:text-warning-300">
                ⚠️ Un membre du jury ne peut pas être participant au même challenge.
              </div>

              <div className="flex gap-2">
                <input type="email" value={juryInput} onChange={(e) => setJuryInput(e.target.value)}
                  placeholder="Email du membre du jury" onKeyDown={(e) => e.key === "Enter" && addJury()}
                  className={inputCls + " flex-1"} />
                <button onClick={addJury}
                  className="px-5 h-11 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors flex-shrink-0">
                  Inviter
                </button>
              </div>

              {form.jury.length === 0 ? (
                <div className="text-center py-8 text-sm text-gray-400">Aucun juré ajouté. Vous pouvez en ajouter plus tard.</div>
              ) : (
                <div className="space-y-2">
                  {form.jury.map((j, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
                      <span className="text-lg">✉️</span>
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{j.email}</span>
                      <span className="text-xs text-warning-600 dark:text-warning-400 font-medium">Invitation envoyée</span>
                      <button onClick={() => removeJury(i)} className="text-error-500 hover:text-error-600 text-lg leading-none">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 5 — Récap */}
          {step === 5 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">📋 Récapitulatif</h2>
              <div className="space-y-2">
                {[
                  ["Nom", form.nom || "—"],
                  ["Type", TYPES_CHALLENGE.find((t) => t.id === parseInt(form.type_id))?.libelle || "—"],
                  ["Visibilité", form.visibilite === "public" ? "🌍 Public" : "🔒 Privé"],
                  ["Participants min", String(form.nb_participants_min)],
                  ["Participants max", String(form.nb_participants_max)],
                  ["Frais d'entrée", `${fmt(form.frais_participation)}`],
                  ["Date de lancement", form.date_lancement ? fmtDate(form.date_lancement) : "—"],
                  ["Date de clôture", form.date_cloture ? fmtDate(form.date_cloture) : "—"],
                  ["Trophées", `${form.trophees.length} défini(s)`],
                  ["Jurés", `${form.jury.length} invité(s)`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-2.5 px-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-sm">
                    <span className="text-gray-500 dark:text-gray-400">{k}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 p-4 text-sm text-brand-700 dark:text-brand-300">
                En publiant, vous acceptez que les frais soient mis en séquestre jusqu'à la fin du challenge et que la commission plateforme de 10% soit prélevée avant distribution des gains.
              </div>
            </div>
          )}

          {/* ── Navigation ── */}
          <div className="flex justify-between mt-8 pt-5 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => step > 1 ? setStep((s) => s - 1) : navigate("/challenges")}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
            >
              {step > 1 ? "← Précédent" : "Annuler"}
            </button>

            {step < STEPS.length ? (
              <button onClick={() => setStep((s) => s + 1)}
                className="px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
                Suivant →
              </button>
            ) : (
              <button onClick={() => setSaved(true)}
                className="px-6 py-2.5 rounded-lg bg-warning-500 text-white text-sm font-bold hover:bg-warning-600 transition-colors">
                🚀 Publier le challenge
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}