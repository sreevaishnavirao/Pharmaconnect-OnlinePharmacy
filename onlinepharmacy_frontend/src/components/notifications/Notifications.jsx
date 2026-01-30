
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Bell } from "lucide-react";

import {
  getUserKey,
  getUserNotifications,
  markAllRead,
  subscribeStore,
} from "../../utils/notificationStore";

const Notifications = () => {
  const { user } = useSelector((s) => s?.auth || { user: null });

  const [tick, setTick] = useState(0);

  useEffect(() => {
    const unsub = subscribeStore(() => setTick((t) => t + 1));
    return () => unsub?.();
  }, []);

  const userKey = useMemo(() => getUserKey(user), [user]);

  const notifications = useMemo(() => {
    if (!user) return [];
    return getUserNotifications(userKey) || [];
  }, [user, userKey, tick]);

  const unreadCount = useMemo(() => {
    return (notifications || []).filter((n) => !n.read).length;
  }, [notifications]);

  const totalCount = notifications?.length || 0;

  const handleMarkAllRead = () => {
    if (!user) return;
    markAllRead(userKey);
    setTick((t) => t + 1);
  };

  return (
    <div className="lg:px-14 sm:px-8 px-4 py-10">
     
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="text-slate-900" size={20} />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Notifications
            </h1>
          </div>
          <p className="mt-2 text-slate-600">
            Please check for your prescription updates.
          </p>
        </div>

        {user && totalCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 hover:bg-slate-50"
          >
            Mark all as read
          </button>
        )}
      </div>

     
      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center justify-between">
        <div className="text-sm font-bold text-slate-700">
          Unread: <span className="text-rose-600">{unreadCount}</span>
        </div>
        <div className="text-sm font-bold text-slate-700">
          Total: <span className="text-slate-900">{totalCount}</span>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        {!user ? (
          <div className="text-slate-600 text-center py-10">
            Please login to view notifications.
          </div>
        ) : totalCount === 0 ? (
          <div className="text-slate-600 text-center py-10">
            No notifications yet.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-2xl border p-4 ${
                  n.read
                    ? "border-slate-100 bg-white"
                    : "border-rose-200 bg-rose-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-extrabold text-slate-900">
                      {n.title || "Notification"}
                    </div>
                    <div className="mt-1 text-sm text-slate-700">
                      {n.message || ""}
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!n.read && (
                    <span className="text-[11px] font-black px-2 py-1 rounded-full bg-rose-600 text-white">
                      NEW
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
