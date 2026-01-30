
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  User as UserIcon,
  Menu,
  X,
  Search,
  Upload,
  LogIn,
  LogOut,
  Bell,
} from "lucide-react";

import { logOutUser, fetchCategories } from "../../store/actions";
import { fetchUserCart } from "../../store/actions/cartActions";
import pharmaLogo from "../../assets/pharmaconnect.png";

import {
  getUserKey,
  getUserNotifications,
  subscribeStore,
} from "../../utils/notificationStore";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const cartState = useSelector((state) => state?.carts || {});
  const { user } = useSelector((state) => state?.auth || { user: null });
  const categoriesState = useSelector((state) => state?.categories || {});
  const categories = categoriesState?.categories || [];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [storeTick, setStoreTick] = useState(0);

  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!isAdminRoute) dispatch(fetchCategories());
  }, [dispatch, isAdminRoute]);

  useEffect(() => {
    if (user) dispatch(fetchUserCart());
  }, [user, dispatch, location.pathname]);

  useEffect(() => {
    const unsub = subscribeStore(() => setStoreTick((t) => t + 1));
    return () => unsub?.();
  }, []);

  useEffect(() => {
    const onDown = (e) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const cartItems = useMemo(() => {
    const c = cartState?.cart;
    if (Array.isArray(c)) return c;
    if (c && Array.isArray(c.products)) return c.products;
    if (Array.isArray(cartState?.cartItems)) return cartState.cartItems;
    if (Array.isArray(cartState?.products)) return cartState.products;
    return [];
  }, [cartState]);

  const cartCount = useMemo(() => {
    return (cartItems || []).reduce(
      (sum, item) => sum + Number(item?.quantity || 0),
      0
    );
  }, [cartItems]);

  const isAdmin = useMemo(() => {
    const roles = user?.roles || user?.role || [];
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.some((r) => {
      const name =
        typeof r === "string"
          ? r
          : r?.name || r?.roleName || r?.authority || "";
      return String(name).toLowerCase().includes("admin");
    });
  }, [user]);

  const displayName =
    user?.username || user?.name || user?.email || (isAdmin ? "Admin" : "Guest");
  const avatarLetter = (displayName?.trim()?.[0] || "G").toUpperCase();

  const handleLogout = async () => {
    setUserMenuOpen(false);
    try {
      await dispatch(logOutUser(navigate));
    } catch (_) {}
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchText.trim();
    navigate(q ? `/products?keyword=${encodeURIComponent(q)}` : "/products");
    setMobileOpen(false);
  };

  const goCategory = (categoryId) => {
    navigate(`/products?category=${encodeURIComponent(String(categoryId))}`);
    setMobileOpen(false);
  };

  const activeCategoryId = useMemo(() => {
    return new URLSearchParams(location.search).get("category") || "";
  }, [location.search]);

  const pillBase =
    "px-5 py-1.5 rounded-full text-[11px] font-bold transition-all border shadow-sm whitespace-nowrap uppercase tracking-wider";
  const pillActive =
    "bg-teal-700 text-white border-teal-700 shadow-teal-200/50 scale-105";
  const pillInactive =
    "bg-white/90 text-teal-900 border-teal-200/50 hover:border-teal-500 hover:bg-white hover:shadow-md hover:-translate-y-0.5";

  const userKey = useMemo(() => getUserKey(user), [user]);

  const notifications = useMemo(() => {
    if (!user) return [];
    return getUserNotifications(userKey) || [];
  }, [user, userKey, storeTick]);

  const unreadCount = useMemo(() => {
    return (notifications || []).filter((n) => !n.read).length;
  }, [notifications]);

  const onBellClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/notifications"); 
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-lg">
      <div className="bg-teal-600 text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-700/20 to-transparent pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex h-16 items-center justify-between gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 min-w-fit hover:opacity-90 transition-opacity"
            >
              <img
                src={pharmaLogo}
                alt="Logo"
                className="h-10 w-10 object-contain bg-white rounded-lg p-1 shadow-inner"
              />
              <span className="hidden sm:block text-xl font-black tracking-tighter text-white">
                PHARMA<span className="text-teal-200">CONNECT</span>
              </span>
            </Link>

            <form
              onSubmit={onSearchSubmit}
              className="hidden md:flex flex-1 max-w-xl"
            >
              <div className="relative w-full group">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 group-focus-within:text-teal-500 transition-colors"
                />
                <input
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search for medication, health care..."
                  className="w-full rounded-xl border-none bg-white py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-teal-400 transition-all placeholder:text-slate-400 shadow-inner"
                />
              </div>
            </form>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onBellClick}
                className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all"
                title={user ? "Prescription updates" : "Login to see updates"}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-teal-600">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/upload-prescription")} 
                className="hidden lg:flex items-center gap-2 text-teal-50 hover:text-white font-bold text-sm transition-all hover:scale-105"
              >
                <Upload size={18} />
                <span className="border-b border-teal-400/50">Upload Rx</span>
              </button>

              <Link
                to="/cart"
                className="relative p-2 text-white hover:bg-white/10 rounded-full transition-all group"
              >
                <ShoppingCart
                  size={22}
                  className="group-hover:rotate-6 transition-transform"
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold border-2 border-teal-600 animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 p-1 pr-3 rounded-full bg-teal-700/50 border border-teal-500/30 hover:bg-teal-700 hover:border-teal-400 transition-all shadow-sm"
                >
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-black text-xs">
                    {avatarLetter}
                  </div>
                  <span className="hidden sm:block text-xs font-black text-white">
                    {displayName}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-white shadow-2xl border border-teal-50 overflow-hidden z-[9999] text-slate-800">
                    <div className="p-4 bg-teal-50/50 border-b border-teal-100">
                      <p className="text-[10px] text-teal-600 font-black uppercase tracking-widest mb-1">
                        {user ? "Signed in as" : "Welcome"}
                      </p>
                      <p className="text-sm font-bold truncate">{displayName}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      {user ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate("/profile");
                            }}
                            className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
                          >
                            <UserIcon size={16} />
                            My Profile
                          </button>

                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => {
                                setUserMenuOpen(false);
                                navigate("/admin");
                              }}
                              className="w-full text-left px-4 py-2.5 text-xs font-bold text-teal-700 hover:bg-teal-50 rounded-xl transition-colors"
                            >
                              Admin Dashboard
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border-t border-slate-50"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate("/login");
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
                          >
                            <LogIn size={16} />
                            Login
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate("/register");
                            }}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
                          >
                            Create account
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="md:hidden text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isAdminRoute && (
        <div className="bg-teal-100/60 backdrop-blur-md border-b border-teal-200/50">
          <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-center">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
              {(categories || []).map((c) => {
                const active = String(activeCategoryId) === String(c.categoryId);
                return (
                  <button
                    key={c.categoryId}
                    type="button"
                    onClick={() => goCategory(c.categoryId)}
                    className={`${pillBase} ${
                      active ? pillActive : pillInactive
                    }`}
                  >
                    {c.categoryName}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
