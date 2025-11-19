"use client";

import { Icon } from "./icons/icon";
import Link from "next/link";
import styles from "./ReturnButton.module.css";

export default function ReturnButton() {
  return (
    <Link href="/" className={styles.returnButton}>
      <Icon name="backSquare" color1="var(--neutral-black-lighter)" />
      <p>Home</p>
    </Link>
  );
}
