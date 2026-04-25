import { Link } from "react-router";

export default function SidebarWidget() {
  return (
    <div className="mx-auto mb-10 w-full max-w-60 rounded-2xl bg-brand-50 px-4 py-5 text-center dark:bg-brand-900/20">
      <div className="mb-2 text-2xl">✨</div>
      <h3 className="mb-2 font-semibold text-gray-900 dark:text-white text-sm">
        Créez votre premier challenge !
      </h3>
      <p className="mb-4 text-gray-500 text-xs dark:text-gray-400">
        Lancez un défi, réunissez des participants et récompensez les meilleurs.
      </p>
      <Link
        to="/challenges/creer"
        className="flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 transition-colors"
      >
        + Créer un challenge
      </Link>
    </div>
  );
}