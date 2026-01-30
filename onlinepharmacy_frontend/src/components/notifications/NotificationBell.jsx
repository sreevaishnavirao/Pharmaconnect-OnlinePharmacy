
import React, { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import {
  getUserKey,
  getUserNotifications,
  markAllRead,
  subscribeStore,
} from "../../utils/notificationStore";

const Notifications = () => {
  const { user } = useSelector((s) => s?.auth || {});
  const userKey = useMemo(() => getUserKey(user), [user]);

  const [storeTick, setStoreTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeStore(() => setStoreTick((t) => t + 1));
    return () => unsub?.();
  }, []);

  const notifications = useMemo(() => {
    if (!user) return [];
    return getUserNotifications(userKey) || [];
  }, [user, userKey, storeTick]);

  const unreadCount = useMemo(
    () => (notifications || []).filter((n) => !n.read).length,
    [notifications]
  );

  useEffect(() => {
    if (user) markAllRead(userKey);
  
  }, [userKey]);

  if (!user) {
    return (
      <div className="lg:px-14 sm:px-8 px-4 py-10">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="text-xl font-extrabold text-slate-900">
            Please login to view notifications.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10">
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
              <Bell className="text-teal-700" size={20} />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">
                Notifications
              </div>
              <div className="text-sm text-slate-600">
                Admin responses for your prescription will appear here.
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <span className="rounded-full bg-rose-500 text-white text-xs font-bold px-3 py-1">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="mt-5">
          {notifications.length === 0 ? (
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-600">
              No notifications yet.
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-xl border p-4 ${
                    n.read
                      ? "border-slate-100 bg-white"
                      : "border-teal-200 bg-teal-50/40"
                  }`}
                >
                  <div className="font-extrabold text-slate-900">{n.title}</div>
                  <div className="mt-1 text-sm text-slate-700">
                    {n.message || "Status updated."}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
