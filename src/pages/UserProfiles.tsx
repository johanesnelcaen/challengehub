import { useState } from "react";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { CURRENT_USER, MES_CHALLENGES_CREES, MES_PARTICIPATIONS, fmt, CHALLENGES } from "../data/mockData";

export default function UserProfiles() {
  const [form, setForm] = useState({
    nom: CURRENT_USER.nom,
    prenom: CURRENT_USER.prenom,
    email: CURRENT_USER.email,
    bio: CURRENT_USER.bio,
  });
  const [pwForm, setPwForm] = useState({ actuel: "", nouveau: "", confirmer: "" });
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"infos" | "securite" | "activite">("infos");

  const inputCls = "w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <>
      <PageMeta title="Mon Profil — ChallengeHub" description="Gérez votre profil ChallengeHub" />
      <PageBreadcrumb pageTitle="Mon Profil" />

      <div className="grid grid-cols-12 gap-5">

        {/* ── Colonne gauche — Carte identité ── */}
        <div className="col-span-12 xl:col-span-4 space-y-5">

          {/* Avatar + infos principales */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center text-3xl font-extrabold text-white mx-auto">
                {CURRENT_USER.prenom[0]}{CURRENT_USER.nom[0]}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm">
                ✏️
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {CURRENT_USER.prenom} {CURRENT_USER.nom}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{CURRENT_USER.email}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              {CURRENT_USER.role === "admin" ? "🛡️ Administrateur" : "👤 Utilisateur"}
            </div>

            {CURRENT_USER.bio && (
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                {CURRENT_USER.bio}
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Mes Statistiques</h4>
            <div className="space-y-3">
              {[
                { icon: "🏆", label: "Challenges créés", value: CURRENT_USER.stats.crees, color: "text-brand-600 dark:text-brand-400" },
                { icon: "✋", label: "Participations", value: CURRENT_USER.stats.participes, color: "text-success-600 dark:text-success-400" },
                { icon: "🥇", label: "Victoires", value: CURRENT_USER.stats.gagnes, color: "text-warning-600 dark:text-warning-400" },
                { icon: "💰", label: "Total gains", value: fmt(CURRENT_USER.stats.total_gains), color: "text-success-600 dark:text-success-400" },
                { icon: "💳", label: "Solde wallet", value: fmt(CURRENT_USER.solde_wallet), color: "text-brand-600 dark:text-brand-400" },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{icon}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Colonne droite — Formulaires ── */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            {/* Tabs */}
            <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-800">
              {(["infos", "securite", "activite"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === t
                      ? "bg-brand-500 text-white"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {t === "infos" ? "👤 Mes Infos" : t === "securite" ? "🔐 Sécurité" : "📊 Activité"}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* ── TAB INFOS ── */}
              {activeTab === "infos" && (
                <div className="space-y-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Informations personnelles</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Prénom</label>
                      <input type="text" value={form.prenom}
                        onChange={(e) => { setForm((p) => ({ ...p, prenom: e.target.value })); setSaved(false); }}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Nom</label>
                      <input type="text" value={form.nom}
                        onChange={(e) => { setForm((p) => ({ ...p, nom: e.target.value })); setSaved(false); }}
                        className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={form.email}
                      onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setSaved(false); }}
                      className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Bio</label>
                    <textarea value={form.bio} rows={4}
                      onChange={(e) => { setForm((p) => ({ ...p, bio: e.target.value })); setSaved(false); }}
                      placeholder="Parlez de vous..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => setSaved(true)}
                      className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors"
                    >
                      {saved ? "✓ Modifications enregistrées" : "Sauvegarder"}
                    </button>
                    {saved && (
                      <span className="text-sm text-success-500 font-medium">
                        ✓ Profil mis à jour avec succès !
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ── TAB SÉCURITÉ ── */}
              {activeTab === "securite" && (
                <div className="space-y-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Changer le mot de passe</h3>

                  <div className="rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 p-4 text-sm text-warning-700 dark:text-warning-300">
                    🔐 Utilisez un mot de passe fort d'au moins 8 caractères, avec des chiffres et des caractères spéciaux.
                  </div>

                  <div>
                    <label className={labelCls}>Mot de passe actuel <span className="text-error-500">*</span></label>
                    <input type="password" value={pwForm.actuel}
                      onChange={(e) => { setPwForm((p) => ({ ...p, actuel: e.target.value })); setPwSaved(false); }}
                      placeholder="••••••••" className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Nouveau mot de passe <span className="text-error-500">*</span></label>
                    <input type="password" value={pwForm.nouveau}
                      onChange={(e) => { setPwForm((p) => ({ ...p, nouveau: e.target.value })); setPwSaved(false); }}
                      placeholder="••••••••" className={inputCls} />
                    {pwForm.nouveau.length > 0 && (
                      <div className="mt-2 flex gap-1">
                        {["Trop court", "Moyen", "Fort", "Très fort"].map((label, i) => (
                          <div key={i} className={`flex-1 h-1 rounded-full ${
                            pwForm.nouveau.length > i * 3 + 2
                              ? i === 0 ? "bg-error-400" : i === 1 ? "bg-warning-400" : i === 2 ? "bg-success-400" : "bg-success-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`} />
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={labelCls}>Confirmer le nouveau mot de passe <span className="text-error-500">*</span></label>
                    <input type="password" value={pwForm.confirmer}
                      onChange={(e) => { setPwForm((p) => ({ ...p, confirmer: e.target.value })); setPwSaved(false); }}
                      placeholder="••••••••" className={inputCls} />
                    {pwForm.confirmer.length > 0 && pwForm.nouveau !== pwForm.confirmer && (
                      <p className="text-xs text-error-500 mt-1">⚠️ Les mots de passe ne correspondent pas.</p>
                    )}
                    {pwForm.confirmer.length > 0 && pwForm.nouveau === pwForm.confirmer && pwForm.nouveau.length > 0 && (
                      <p className="text-xs text-success-500 mt-1">✓ Les mots de passe correspondent.</p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => setPwSaved(true)}
                      disabled={!pwForm.actuel || !pwForm.nouveau || pwForm.nouveau !== pwForm.confirmer}
                      className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Mettre à jour le mot de passe
                    </button>
                    {pwSaved && <span className="text-sm text-success-500 font-medium">✓ Mot de passe mis à jour !</span>}
                  </div>
                </div>
              )}

              {/* ── TAB ACTIVITÉ ── */}
              {activeTab === "activite" && (
                <div className="space-y-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mes activités récentes</h3>

                  {/* Challenges créés */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">⚡ Challenges créés ({MES_CHALLENGES_CREES.length})</h4>
                    <div className="space-y-2">
                      {MES_CHALLENGES_CREES.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Aucun challenge créé.</p>
                      ) : (
                        MES_CHALLENGES_CREES.map((c) => (
                          <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                            <span className="text-xl">{c.type.icone}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.nom}</p>
                              <p className="text-xs text-gray-400">{c.nb_participants_actuels} participants</p>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              c.statut === "ouvert" ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                              : c.statut === "en_cours" ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                              {c.statut}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Participations */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">✋ Participations ({MES_PARTICIPATIONS.length})</h4>
                    <div className="space-y-2">
                      {MES_PARTICIPATIONS.length === 0 ? (
                        <p className="text-sm text-gray-400 py-4 text-center">Aucune participation.</p>
                      ) : (
                        MES_PARTICIPATIONS.map((p, i) => {
                          const ch = CHALLENGES.find((c) => c.id === p.challenge_id);
                          return (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800">
                              <span className="text-xl">{ch?.type.icone}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.challenge_nom}</p>
                                <p className="text-xs text-gray-400">{p.montant_paye} FCFA payés</p>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                p.soumis
                                  ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                                  : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400"
                              }`}>
                                {p.soumis ? "✓ Soumis" : "⏳ En cours"}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
