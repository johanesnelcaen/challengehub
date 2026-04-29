// src/components/auth/SignInForm.tsx — connecté à l'API
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export default function SignInForm() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPwd, setShowPwd]     = useState(false);
  const [remember, setRemember]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Veuillez remplir tous les champs."); return; }
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err?.message ?? "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ChevronLeftIcon className="size-5" /> Retour
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-7">
          <span className="text-4xl">🏆</span>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              Challenge<span className="text-brand-500">Hub</span>
            </h1>
            <p className="text-xs text-gray-400">La plateforme des challengers</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">Se connecter</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Entrez vos identifiants pour accéder à votre compte.</p>
        </div>

        {/* Erreur globale */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/30">
            <p className="text-sm text-error-600 dark:text-error-400 text-center">⚠️ {error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <Label>Email <span className="text-error-500">*</span></Label>
              <Input
                type="email" placeholder="vous@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label>Mot de passe <span className="text-error-500">*</span></Label>
              <div className="relative">
                <Input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                />
                <span onClick={() => setShowPwd(!showPwd)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                  {showPwd
                    ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                    : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox checked={remember} onChange={setRemember} />
                <span className="text-sm text-gray-700 dark:text-gray-400">Rester connecté</span>
              </div>
              <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600">Mot de passe oublié ?</Link>
            </div>

            <Button className="w-full" size="sm" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </div>
        </form>

        <p className="mt-5 text-sm text-center text-gray-500 dark:text-gray-400">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="text-brand-500 hover:text-brand-600 font-medium">S'inscrire</Link>
        </p>

        {/* Hint démo */}
        <div className="mt-4 p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
          <p className="text-xs text-brand-600 dark:text-brand-300 text-center">
            💡 Démo : mamadou@example.com / password
          </p>
        </div>
      </div>
    </div>
  );
}
