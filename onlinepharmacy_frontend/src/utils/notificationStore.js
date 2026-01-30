const RX_KEY = "RX_SUBMISSIONS_V1";
const NOTIF_KEY = "USER_NOTIFICATIONS_V1";

const safeParse = (v, fallback) => {
  try {
    const x = JSON.parse(v);
    return x ?? fallback;
  } catch {
    return fallback;
  }
};

const readRx = () => safeParse(localStorage.getItem(RX_KEY), []);
const writeRx = (list) =>
  localStorage.setItem(RX_KEY, JSON.stringify(list || []));

const readNotifs = () => safeParse(localStorage.getItem(NOTIF_KEY), {});
const writeNotifs = (map) =>
  localStorage.setItem(NOTIF_KEY, JSON.stringify(map || {}));

const emit = () => {
  window.dispatchEvent(new CustomEvent("pharma:store-updated"));
};

const makeId = () => {
  try {
    return crypto?.randomUUID?.() || `${Date.now()}_${Math.random()}`;
  } catch {
    return `${Date.now()}_${Math.random()}`;
  }
};

export const getUserKey = (user) => {
  if (!user) return "guest";

  const roles = user?.roles || user?.role || [];
  const roleList = Array.isArray(roles) ? roles : [roles];

  const id =
    user?.userId ??
    user?.id ??
    user?.email ??
    user?.username ??
    user?.name ??
    "user";

  const isAdmin = roleList.some((r) => {
    const name =
      typeof r === "string" ? r : r?.name || r?.authority || r?.roleName || "";
    return String(name).toLowerCase().includes("admin");
  });

  return isAdmin ? `admin:${id}` : `user:${id}`;
};
export const getUserNotifications = (userKey) => {
  const map = readNotifs();
  const list = map?.[userKey] || [];
  return [...list].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
};

export const getUnreadCount = (userKey) => {
  return getUserNotifications(userKey).filter((n) => !n.read).length;
};

export const markUserNotificationRead = (userKey, notifId) => {
  const map = readNotifs();
  const list = map?.[userKey] || [];
  const updated = list.map((n) =>
    String(n.id) === String(notifId) ? { ...n, read: true } : n
  );
  map[userKey] = updated;
  writeNotifs(map);
  emit();
  return updated;
};

export const markAllRead = (userKey) => {
  const map = readNotifs();
  const list = map?.[userKey] || [];
  map[userKey] = list.map((n) => ({ ...n, read: true }));
  writeNotifs(map);
  emit();
  return map[userKey];
};

export const notifyUser = (
  userKey,
  { title = "Notification", message = "", link = "", meta = {} } = {}
) => {
  const map = readNotifs();
  const list = map?.[userKey] || [];

  const notif = {
    id: makeId(),
    title,
    message,
    link,
    meta,
    read: false,
    createdAt: Date.now(),
  };

  map[userKey] = [notif, ...list];
  writeNotifs(map);
  emit();
  return notif;
};

export const clearUserNotifications = (userKey) => {
  const map = readNotifs();
  map[userKey] = [];
  writeNotifs(map);
  emit();
  return [];
};
export const addRxSubmission = ({
  userKey,
  fullName,
  phone,
  notes,
  fileName,
  fileType,
  fileDataUrl, 
  notifyOnUpdate = true,
}) => {
  const list = readRx();

  const submission = {
    id: makeId(),
    userKey,
    fullName,
    phone,
    notes: notes || "",
    fileName,
    fileType,
    fileDataUrl,
    notifyOnUpdate: !!notifyOnUpdate,
    status: "PENDING", 
    adminMessage: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  writeRx([submission, ...list]);
  emit();
  return submission;
};

export const listRxSubmissions = () => {
  const list = readRx();
  return [...list].sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
};

export const getRxSubmissionById = (id) => {
  const list = readRx();
  return list.find((x) => String(x.id) === String(id)) || null;
};

export const setRxSubmissionStatus = (submissionId, { status, adminMessage }) => {
  const list = readRx();
  const idx = list.findIndex((x) => String(x.id) === String(submissionId));
  if (idx === -1) return null;

  const prev = list[idx];
  const updated = {
    ...prev,
    status: status || prev.status,
    adminMessage: adminMessage ?? prev.adminMessage,
    updatedAt: Date.now(),
  };

  const next = [...list];
  next[idx] = updated;
  writeRx(next);

  if (updated.notifyOnUpdate && updated.userKey) {
    const pretty =
      updated.status === "APPROVED"
        ? "Approved"
        : updated.status === "NEEDS_INFO"
        ? "Needs Info"
        : updated.status === "REJECTED"
        ? "Rejected"
        : "Updated";

    notifyUser(updated.userKey, {
      title: `Prescription ${pretty}`,
      message: updated.adminMessage
        ? updated.adminMessage
        : `Your prescription status is now: ${pretty}`,
      link: "",
      meta: { submissionId: updated.id, status: updated.status },
    });
  }

  emit();
  return updated;
};

export const subscribeStore = (callback) => {
  const handler = () => callback?.();

  window.addEventListener("pharma:store-updated", handler);

  const onStorage = (e) => {
    if (e.key === RX_KEY || e.key === NOTIF_KEY) handler();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener("pharma:store-updated", handler);
    window.removeEventListener("storage", onStorage);
  };
};

export const markUserNotificationsRead = (userKey) => markAllRead(userKey); // Navbar import
export const markUserNotificationsReadAll = (userKey) => markAllRead(userKey); // optional alias
export const markUserNotificationAsRead = (userKey, notifId) =>
  markUserNotificationRead(userKey, notifId);
