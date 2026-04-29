// src/hooks/useApi.ts
// Hook générique pour tous les appels API avec état loading/error/data
import { useState, useEffect, useCallback, useRef } from "react";

export function useApi<T>(fn: () => Promise<T>, deps: any[] = []) {
  const [data, setData]     = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const mounted = useRef(true);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fn()
      .then((d) => { if (mounted.current) setData(d); })
      .catch((e) => { if (mounted.current) setError(e?.message ?? "Erreur de chargement."); })
      .finally(() => { if (mounted.current) setLoading(false); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mounted.current = true;
    load();
    return () => { mounted.current = false; };
  }, [load]);

  return { data, loading, error, refetch: load };
}

// ─────────────────────────────────────────────────────────────────
// src/hooks/useChallenges.ts
import { challengesApi } from "../services/api";

export function useChallenges(filters: Record<string, any> = {}) {
  return useApi(() => challengesApi.list(filters), [JSON.stringify(filters)]);
}

export function useChallenge(id: number | null) {
  return useApi(() => (id ? challengesApi.show(id) : Promise.resolve(null)), [id]);
}

export function useMesChallenges() {
  return useApi(() => challengesApi.mesChallenges(), []);
}

// ─────────────────────────────────────────────────────────────────
// src/hooks/useParticipations.ts
import { participationsApi } from "../services/api";

export function useMesParticipations() {
  return useApi(() => participationsApi.list(), []);
}

// ─────────────────────────────────────────────────────────────────
// src/hooks/useNotifications.ts
import { notificationsApi } from "../services/api";
import { useState as useStateNotif } from "react";

export function useNotifications() {
  const { data, loading, refetch } = useApi(() => notificationsApi.list(), []);
  const notifications: any[] = data?.data ?? [];
  const unread = notifications.filter((n: any) => !n.lu).length;

  const marquerLu = async (id: number) => {
    await notificationsApi.marquerLu(id);
    refetch();
  };

  const marquerToutLu = async () => {
    await notificationsApi.marquerToutLu();
    refetch();
  };

  const supprimer = async (id: number) => {
    await notificationsApi.delete(id);
    refetch();
  };

  return { notifications, unread, loading, marquerLu, marquerToutLu, supprimer, refetch };
}

// ─────────────────────────────────────────────────────────────────
// src/hooks/useWallet.ts
import { walletApi } from "../services/api";

export function useWallet() {
  const solde = useApi(() => walletApi.solde(), []);
  const transactions = useApi(() => walletApi.transactions(), []);
  return { solde, transactions };
}

// ─────────────────────────────────────────────────────────────────
// src/hooks/useJury.ts
import { juryApi } from "../services/api";

export function useJury() {
  return useApi(() => juryApi.mesChallenges(), []);
}

export function useJurySoumissions(challengeId: number | null) {
  return useApi(
    () => (challengeId ? juryApi.soumissions(challengeId) : Promise.resolve(null)),
    [challengeId]
  );
}
