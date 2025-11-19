"use client";

import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";
import DynamicButton from "../components/DynamicButton";

export default function Navbar() {
  const pathname = usePathname();

  // Forbidden routes array - hide navigation on these paths and sub-routes
  const forbiddenRoutes = ["login", "signup"];

  if (forbiddenRoutes.some((route) => pathname.startsWith(`/${route}`))) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <h2 className={styles.logo}>
        <p>Chrono Todo</p>
      </h2>

      <div className={styles.links}>
        <DynamicButton as="link" href="/signup" className={styles.link}>
          Sign-up
        </DynamicButton>
        <DynamicButton as="link" href="/login" className={styles.link}>
          Login
        </DynamicButton>
      </div>
    </nav>
  );
}
