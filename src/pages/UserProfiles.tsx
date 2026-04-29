// src/pages/UserProfiles.tsx — connecté à l'API
import { useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../components/common/PageMeta";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import { useAuth } from "../context/AuthContext";
import { authApi } from "../services/api";
import { useMesChallenges, useMesParticipations } from "../hooks/useApi";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";

export default function UserProfiles() {
  const { user, stats, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"infos" | "securite" | "activite">("infos");

  // Formulaire profil
  const [form, setForm]     = useState({ nom: user?.nom ?? "", prenom: user?.prenom ?? "", email: user?.email ?? "", bio: user?.bio ?? "" });
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  // Formulaire mot de passe
  const [pwForm, setPwForm]     = useState({ mot_de_passe_actuel: "", mot_de_passe: "", mot_de_passe_confirmation: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwOk, setPwOk]         = useState(false);
  const [pwErr, setPwErr]       = useState<string | null>(null);
  const [pwFieldErrors, setPwFieldErrors] = useState<Record<string, string>>({});

  const { data: challengesData } = useMesChallenges();
  const { data: participationsData } = useMesParticipations();
  const mesChallenges: any[]    = Array.isArray(challengesData) ? challengesData : [];
  const mesParticipations: any[] = participationsData?.data ?? (Array.isArray(participationsData) ? participationsData : []);

  const inputCls = "w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10";
  const labelCls = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  const handleSaveProfile = async () => {
    setSaving(true); setSaveOk(false); setSaveErr(null);
    try {
      await authApi.updateProfile(form);
      await refreshUser();
      setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } catch (e: any) {
      setSaveErr(e?.message ?? "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePassword = async () => {
    setPwSaving(true); setPwOk(false); setPwErr(null); setPwFieldErrors({});
    try {
      await authApi.updatePassword(pwForm);
      setPwOk(true);
      setPwForm({ mot_de_passe_actuel: "", mot_de_passe: "", mot_de_passe_confirmation: "" });
      setTimeout(() => setPwOk(false), 3000);
    } catch (e: any) {
      if (e?.errors) setPwFieldErrors(e.errors);
      else setPwErr(e?.message ?? "Erreur lors du changement de mot de passe.");
    } finally {
      setPwSaving(false);
    }
  };

  if (!user) return null;

  return (
    <>
      <PageMeta title="Mon Profil — ChallengeHub" description="Gérez votre profil" />
      <PageBreadcrumb pageTitle="Mon Profil" />

      <div className="grid grid-cols-12 gap-5">

        {/* ── Colonne gauche ── */}
        <div className="col-span-12 xl:col-span-4 space-y-5">

          {/* Carte identité */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-500 to-brand-400 flex items-center justify-center text-3xl font-extrabold text-white mx-auto">
                {user.prenom[0]}{user.nom[0]}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.prenom} {user.nom}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              {user.role === "admin" ? "🛡️ Administrateur" : "👤 Utilisateur"}
            </div>
            {user.bio && (
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">{user.bio}</p>
            )}
          </div>

          {/* Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Mes Statistiques</h4>
            <div className="space-y-3">
              {[
                { icon: "🏆", label: "Challenges créés", value: String(stats?.challenges_crees ?? 0), color: "text-brand-600 dark:text-brand-400" },
                { icon: "✋", label: "Participations",    value: String(stats?.participations ?? 0),   color: "text-success-600 dark:text-success-400" },
                { icon: "🥇", label: "Victoires",         value: String(stats?.victoires ?? 0),        color: "text-warning-600 dark:text-warning-400" },
                { icon: "💰", label: "Total gains",       value: fmt(stats?.total_gains ?? 0),         color: "text-success-600 dark:text-success-400" },
                { icon: "💳", label: "Solde wallet",      value: fmt(user.solde_wallet ?? 0),          color: "text-brand-600 dark:text-brand-400" },
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

        {/* ── Colonne droite ── */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

            {/* Tabs */}
            <div className="flex gap-1 p-2 border-b border-gray-200 dark:border-gray-800">
              {(["infos", "securite", "activite"] as const).map((t) => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === t ? "bg-brand-500 text-white" : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}>
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
                        onChange={(e) => { setForm((p) => ({ ...p, prenom: e.target.value })); setSaveOk(false); }}
                        className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Nom</label>
                      <input type="text" value={form.nom}
                        onChange={(e) => { setForm((p) => ({ ...p, nom: e.target.value })); setSaveOk(false); }}
                        className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="email" value={form.email}
                      onChange={(e) => { setForm((p) => ({ ...p, email: e.target.value })); setSaveOk(false); }}
                      className={inputCls} />
                  </div>

                  <div>
                    <label className={labelCls}>Bio</label>
                    <textarea value={form.bio} rows={4}
                      onChange={(e) => { setForm((p) => ({ ...p, bio: e.target.value })); setSaveOk(false); }}
                      placeholder="Parlez de vous..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:border-brand-300 focus:outline-none resize-none" />
                  </div>

                  {saveErr && <p className="text-sm text-error-500">⚠️ {saveErr}</p>}

                  <div className="flex items-center gap-4 pt-2">
                    <button onClick={handleSaveProfile} disabled={saving}
                      className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50">
                      {saving ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                    {saveOk && <span className="text-sm text-success-500 font-medium">✓ Profil mis à jour !</span>}
                  </div>
                </div>
              )}

              {/* ── TAB SÉCURITÉ ── */}
              {activeTab === "securite" && (
                <div className="space-y-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Changer le mot de passe</h3>

                  <div className="rounded-xl bg-warning-50 dark:bg-warning-500/10 border border-warning-200 dark:border-warning-500/30 p-4 text-sm text-warning-700 dark:text-warning-300">
                    🔐 Utilisez un mot de passe fort d'au moins 8 caractères.
                  </div>

                  {[
                    { k: "mot_de_passe_actuel" as const, label: "Mot de passe actuel" },
                    { k: "mot_de_passe" as const,        label: "Nouveau mot de passe" },
                    { k: "mot_de_passe_confirmation" as const, label: "Confirmer le nouveau mot de passe" },
                  ].map(({ k, label }) => (
                    <div key={k}>
                      <label className={labelCls}>{label} <span className="text-error-500">*</span></label>
                      <input type="password" value={pwForm[k]}
                        onChange={(e) => { setPwForm((p) => ({ ...p, [k]: e.target.value })); setPwOk(false); setPwErr(null); }}
                        placeholder="••••••••" className={inputCls} />
                      {pwFieldErrors[k] && <p className="text-xs text-error-500 mt-1">{pwFieldErrors[k][0]}</p>}
                    </div>
                  ))}

                  {/* Indicateur correspondance */}
                  {pwForm.mot_de_passe_confirmation && pwForm.mot_de_passe !== pwForm.mot_de_passe_confirmation && (
                    <p className="text-xs text-error-500">⚠️ Les mots de passe ne correspondent pas.</p>
                  )}
                  {pwForm.mot_de_passe_confirmation && pwForm.mot_de_passe === pwForm.mot_de_passe_confirmation && pwForm.mot_de_passe && (
                    <p className="text-xs text-success-500">✓ Les mots de passe correspondent.</p>
                  )}

                  {pwErr && <p className="text-sm text-error-500">⚠️ {pwErr}</p>}

                  <div className="flex items-center gap-4 pt-2">
                    <button onClick={handleSavePassword} disabled={pwSaving || !pwForm.mot_de_passe_actuel || pwForm.mot_de_passe !== pwForm.mot_de_passe_confirmation}
                      className="px-6 py-2.5 bg-brand-500 text-white text-sm font-medium rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      {pwSaving ? "Mise à jour..." : "Mettre à jour"}
                    </button>
                    {pwOk && <span className="text-sm text-success-500 font-medium">✓ Mot de passe mis à jour !</span>}
                  </div>
                </div>
              )}

              {/* ── TAB ACTIVITÉ ── */}
              {activeTab === "activite" && (
                <div className="space-y-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mes activités récentes</h3>

                  {/* Challenges créés */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      ⚡ Challenges créés ({mesChallenges.length})
                    </h4>
                    {mesChallenges.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">Aucun challenge créé.</p>
                    ) : (
                      <div className="space-y-2">
                        {mesChallenges.slice(0, 5).map((c: any) => (
                          <button key={c.id} onClick={() => navigate(`/challenges/${c.id}`)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-600 transition-colors text-left">
                            <span className="text-xl">{c.type?.icone ?? "🏆"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.nom}</p>
                              <p className="text-xs text-gray-400">{c.nb_participants_actuels ?? 0} participants</p>
                            </div>
                            <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              c.statut === "ouvert" ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                              : c.statut === "en_cours" ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                            }`}>
                              {c.statut}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Participations */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      ✋ Participations ({mesParticipations.length})
                    </h4>
                    {mesParticipations.length === 0 ? (
                      <p className="text-sm text-gray-400 py-4 text-center">Aucune participation.</p>
                    ) : (
                      <div className="space-y-2">
                        {mesParticipations.slice(0, 5).map((p: any, i: number) => (
                          <button key={i} onClick={() => navigate(`/challenges/${p.challenge_id}`)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-600 transition-colors text-left">
                            <span className="text-xl">{p.challenge?.type?.icone ?? "🏆"}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {p.challenge?.nom ?? "Challenge"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Intl.NumberFormat("fr-FR").format(p.montant_paye ?? 0)} FCFA payés
                              </p>
                            </div>
                            <span className={`flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              p.soumission
                                ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                                : "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400"
                            }`}>
                              {p.soumission ? "✓ Soumis" : "⏳ En cours"}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
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
