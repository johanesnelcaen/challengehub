export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-2xl border border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/10 p-6 text-center">
      <p className="text-3xl mb-3">⚠️</p>
      <p className="text-sm font-semibold text-error-700 dark:text-error-400 mb-1">
        Erreur de chargement
      </p>
      <p className="text-xs text-error-600 dark:text-error-300 mb-4">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-error-500 text-white text-sm font-medium rounded-lg hover:bg-error-600 transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}