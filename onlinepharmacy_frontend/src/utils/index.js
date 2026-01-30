import {
  FaBoxOpen,
  FaHome,
  FaShoppingCart,
  FaThList,
  FaFileMedical,
} from "react-icons/fa";

import { bannerImageOne, bannerImageTwo, bannerImageThree } from "./constant";

export const bannerLists = [
  { id: 1, image: bannerImageOne },
  { id: 2, image: bannerImageTwo },
  { id: 3, image: bannerImageThree },
];

export const adminNavigation = [
  { name: "Dashboard", href: "/admin", icon: FaHome, current: true },
  { name: "Orders", href: "/admin/orders", icon: FaShoppingCart },
  { name: "Products", href: "/admin/products", icon: FaBoxOpen },
  { name: "Categories", href: "/admin/categories", icon: FaThList },

  { name: "Prescriptions", href: "/admin/prescriptions", icon: FaFileMedical },
];

export const sellerNavigation = [
  { name: "Orders", href: "/admin/orders", icon: FaShoppingCart, current: true },
  { name: "Products", href: "/admin/products", icon: FaBoxOpen },
];
