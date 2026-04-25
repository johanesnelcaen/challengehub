// ════════════════════════════════════════════════════════════════
//  SignInForm.tsx — adapté ChallengeHub
// ════════════════════════════════════════════════════════════════
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // En production : appel API POST /auth/login
    navigate("/");
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
          <ChevronLeftIcon className="size-5" />
          Retour au dashboard
        </Link>
      </div>

      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
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
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Entrez vos identifiants pour accéder à votre compte.
            </p>
          </div>

          {/* Boutons OAuth */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button className="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-4 hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M18.75 10.19c0-.72-.06-1.25-.19-1.79H10.18v3.25h4.92c-.1.81-.64 2.02-1.83 2.84l-.01.11 2.65 2.01.18.02C17.78 15.1 18.75 12.86 18.75 10.19z" fill="#4285F4"/>
                <path d="M10.18 18.75c2.41 0 4.43-.78 5.91-2.12l-2.82-2.14c-.75.5-1.76.86-3.09.86-2.36 0-4.36-1.53-5.08-3.63l-.1.01-2.76 2.09-.04.1A8.75 8.75 0 0 0 10.18 18.75z" fill="#34A853"/>
                <path d="M5.1 11.73A5.36 5.36 0 0 1 4.8 10c0-.6.11-1.19.29-1.73l-.01-.12-2.8-2.12-.09.07A8.75 8.75 0 0 0 1.25 10c0 1.41.34 2.74.94 3.9l2.91-2.17z" fill="#FBBC05"/>
                <path d="M10.18 4.63c1.68 0 2.81.71 3.45 1.3l2.52-2.41C14.6 2.11 12.59 1.25 10.18 1.25A8.75 8.75 0 0 0 2.2 6.07l2.9 2.19c.73-2.09 2.73-3.63 5.09-3.63z" fill="#EB4335"/>
              </svg>
              Google
            </button>
            <button className="inline-flex items-center justify-center gap-2 py-2.5 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-4 hover:bg-gray-200 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
              <svg width="18" height="18" className="fill-current" viewBox="0 0 21 20">
                <path d="M15.67 1.875H18.43L12.4 8.758 19.49 18.125H13.94L9.6 12.444 4.63 18.125H1.87L8.31 10.763 1.51 1.875H7.2L11.13 7.068 15.67 1.875z"/>
              </svg>
              Twitter / X
            </button>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-400">ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <Label>Email <span className="text-error-500">*</span></Label>
                <Input
                  type="email"
                  placeholder="vous@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Mot de passe <span className="text-error-500">*</span></Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  />
                  <span onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                    {showPassword
                      ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="text-sm text-gray-700 dark:text-gray-400">Rester connecté</span>
                </div>
                <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Button className="w-full" size="sm">Se connecter</Button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Pas encore de compte ?{" "}
              <Link to="/signup" className="text-brand-500 hover:text-brand-600 dark:text-brand-400 font-medium">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Hint démo */}
          <div className="mt-4 p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20">
            <p className="text-xs text-brand-600 dark:text-brand-300 text-center">
              💡 Mode démo : n'importe quel email/mot de passe fonctionne
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
