import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { NOTIFICATIONS, NOTIF_ICONS, type Notification } from "../../data/mockData";
import { useNavigate } from "react-router";

const TYPE_LABELS: Record<string, string> = {
  inscription: "Inscription",
  soumission: "Soumission",
  resultat: "Résultats",
  annulation: "Annulation",
  remboursement: "Remboursement",
  jury: "Jury",
};

const TYPE_COLORS: Record<string, string> = {
  inscription: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
  soumission:  "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
  resultat:    "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
  annulation:  "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400",
  remboursement:"bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  jury:        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
};

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "non_lu" | "lu">("all");
  const navigate = useNavigate();

  const markAsRead = (id: number) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));

  const markAllAsRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, lu: true })));

  const deleteNotif = (id: number) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  const filtered = notifs.filter((n) => {
    if (filter === "non_lu") return !n.lu;
    if (filter === "lu") return n.lu;
    return true;
  });

  const unread = notifs.filter((n) => !n.lu).length;

  return (
    <>
      <PageMeta title="Notifications — ChallengeHub" description="Vos notifications ChallengeHub" />
      <PageBreadcrumb pageTitle="Notifications" />

      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        {/* Filtres */}
        <div className="flex gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
          {(["all", "non_lu", "lu"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {f === "all" ? "Toutes" : f === "non_lu" ? `Non lues (${unread})` : "Lues"}
            </button>
          ))}
        </div>

        {unread > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
          >
            ✓ Tout marquer comme lu
          </button>
        )}
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-16 text-center">
          <div className="text-5xl mb-4">🔔</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Aucune notification</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filter === "non_lu" ? "Toutes vos notifications ont été lues." : "Vous n'avez pas encore de notifications."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`group rounded-2xl border transition-all duration-200 ${
                n.lu
                  ? "border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                  : "border-brand-200 bg-brand-50 dark:border-brand-500/30 dark:bg-brand-500/[0.05]"
              }`}
            >
              <div className="flex items-start gap-4 p-4">
                {/* Icône type */}
                {NOTIF_ICONS[n.type] && (
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mt-0.5 ${
                    n.lu ? "bg-gray-100 dark:bg-gray-800" : "bg-white dark:bg-gray-900 shadow-sm"
                  }`}>
                    {NOTIF_ICONS[n.type]}
                  </div>
                )}

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[n.type]}`}>
                      {TYPE_LABELS[n.type]}
                    </span>
                    {!n.lu && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{n.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{n.created_at}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.lu && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      title="Marquer comme lu"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-500 transition-colors"
                    >
                      ✓
                    </button>
                  )}
                  {n.challenge_id && (
                    <button
                      onClick={() => { markAsRead(n.id); navigate(`/challenges/${n.challenge_id}`); }}
                      title="Voir le challenge"
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-brand-500 transition-colors text-sm"
                    >
                      →
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotif(n.id)}
                    title="Supprimer"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-error-50 dark:hover:bg-error-500/10 hover:text-error-500 transition-colors text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
