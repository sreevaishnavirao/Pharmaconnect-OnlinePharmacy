
import { useEffect, useMemo, useState } from "react";
import {
  getUnreadCount,
  getUserNotifications,
  subscribeStore,
} from "../utils/notificationStore";

export default function useNotifications(userKey) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeStore(() => setTick((x) => x + 1));
    return () => unsub?.();
  }, []);

  const notifications = useMemo(() => {
    if (!userKey) return [];
    return getUserNotifications(userKey);
  }, [userKey, tick]);

  const unread = useMemo(() => {
    if (!userKey) return 0;
    return getUnreadCount(userKey);
  }, [userKey, tick]);

  return { notifications, unread };
}
