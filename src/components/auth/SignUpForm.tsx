// src/components/auth/SignUpForm.tsx — connecté à l'API
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";

export default function SignUpForm() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm]   = useState({ prenom: "", nom: "", email: "", mot_de_passe: "", mot_de_passe_confirmation: "" });
  const [showPwd, setShowPwd]   = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  const upd = (k: keyof typeof form, v: string) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => { const n = { ...p }; delete n[k]; return n; });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) { setGlobalError("Veuillez accepter les conditions d'utilisation."); return; }
    setLoading(true);
    setGlobalError(null);
    setErrors({});
    try {
      await register(form);
      navigate("/");
    } catch (err: any) {
      if (err?.errors) setErrors(err.errors);
      else setGlobalError(err?.message ?? "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (k: string) => errors[k]?.[0];

  return (
    <div className="flex flex-col flex-1 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md mx-auto mb-5 sm:pt-10">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ChevronLeftIcon className="size-5" /> Retour
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🏆</span>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Challenge<span className="text-brand-500">Hub</span>
            </h1>
            <p className="text-xs text-gray-400">Rejoignez la communauté</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Créer un compte</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inscrivez-vous gratuitement et commencez à challenger !</p>
        </div>

        {globalError && (
          <div className="mb-4 p-3 rounded-xl bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/30">
            <p className="text-sm text-error-600 dark:text-error-400 text-center">⚠️ {globalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Prénom <span className="text-error-500">*</span></Label>
                <Input type="text" placeholder="Mamadou" value={form.prenom}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd("prenom", e.target.value)} />
                {fieldError("prenom") && <p className="text-xs text-error-500 mt-1">{fieldError("prenom")}</p>}
              </div>
              <div>
                <Label>Nom <span className="text-error-500">*</span></Label>
                <Input type="text" placeholder="Diallo" value={form.nom}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd("nom", e.target.value)} />
                {fieldError("nom") && <p className="text-xs text-error-500 mt-1">{fieldError("nom")}</p>}
              </div>
            </div>

            <div>
              <Label>Email <span className="text-error-500">*</span></Label>
              <Input type="email" placeholder="vous@example.com" value={form.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd("email", e.target.value)} />
              {fieldError("email") && <p className="text-xs text-error-500 mt-1">{fieldError("email")}</p>}
            </div>

            <div>
              <Label>Mot de passe <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input type={showPwd ? "text" : "password"} placeholder="Minimum 8 caractères"
                  value={form.mot_de_passe}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd("mot_de_passe", e.target.value)} />
                <span onClick={() => setShowPwd(!showPwd)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                  {showPwd
                    ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                </span>
              </div>
              {fieldError("mot_de_passe") && <p className="text-xs text-error-500 mt-1">{fieldError("mot_de_passe")}</p>}
            </div>

            <div>
              <Label>Confirmer le mot de passe <span className="text-error-500">*</span></Label>
              <Input type="password" placeholder="••••••••"
                value={form.mot_de_passe_confirmation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => upd("mot_de_passe_confirmation", e.target.value)} />
              {form.mot_de_passe_confirmation && form.mot_de_passe !== form.mot_de_passe_confirmation && (
                <p className="text-xs text-error-500 mt-1">Les mots de passe ne correspondent pas.</p>
              )}
              {form.mot_de_passe_confirmation && form.mot_de_passe === form.mot_de_passe_confirmation && form.mot_de_passe && (
                <p className="text-xs text-success-500 mt-1">✓ Les mots de passe correspondent.</p>
              )}
            </div>

            <div className="flex items-start gap-3">
              <Checkbox className="w-5 h-5 mt-0.5" checked={accepted} onChange={setAccepted} />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                J'accepte les{" "}
                <span className="text-gray-800 dark:text-white/90 font-medium">Conditions d'utilisation</span>{" "}
                et la{" "}
                <span className="text-gray-800 dark:text-white font-medium">Politique de confidentialité</span>.
              </p>
            </div>

            <button type="submit" disabled={loading || !accepted}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              {loading ? "Inscription..." : "🚀 Créer mon compte"}
            </button>
          </div>
        </form>

        <p className="mt-5 text-sm text-center text-gray-500 dark:text-gray-400">
          Déjà un compte ?{" "}
          <Link to="/signin" className="text-brand-500 hover:text-brand-600 font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
