"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import { Icon } from "../../components/icons/icon";
import DynamicButton from "../../components/DynamicButton";
import DynamicInput from "../../components/DynamicInput";
import ReturnButton from "../../components/ReturnButton";
import styles from "./page.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    const isValidLogin =
      email === "test@example.com" && password === "password";

    if (isValidLogin) {
      toast.success("Logged in successfully");
      console.log("Email:", email);
      console.log("Password:", password);
    } else {
      toast.error("Invalid credentials");
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    toast("Form reset");
  };

  const handleGoogleLogin = () => {
    toast("Google login clicked");
  };

  const handleGitHubLogin = () => {
    toast("GitHub login clicked");
  };

  return (
    <div className={`layout__container ${styles.layoutContainerLoginPage}`}>
      <ReturnButton />
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Login</h1>

        <div className={styles.loginContainerSocialLinks}>
          <DynamicButton
            className={`${styles.loginContainerSocialLinksGoogle} social-auth-button`}
            variant="primary"
            onClick={handleGoogleLogin}
          >
            <Icon name="socialGoogle" />
            <p className="label">Google</p>
          </DynamicButton>

          <DynamicButton
            className={`${styles.loginContainerSocialLinksGithub} social-auth-button`}
            variant="primary"
            onClick={handleGitHubLogin}
          >
            <Icon name="socialGithub" />
            <p className="label">GitHub</p>
          </DynamicButton>
        </div>

        <div className={styles.loginContainerSeparator}>
          <div className={styles.loginContainerSeparatorLine}></div>
          <div className={styles.loginContainerSeparatorLabel}>
            or use your email
          </div>
        </div>

        <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
          <div className={styles.loginFormGroup}>
            <DynamicInput
              className={styles.loginInput}
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              autoComplete="on"
              required
            />

            <DynamicInput
              className={styles.loginInput}
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <div className={styles.loginFormActions}>
            <DynamicButton
              className={styles.loginFormButton}
              type="reset"
              variant="secondary"
              onClick={handleReset}
            >
              Reset
            </DynamicButton>

            <DynamicButton className={styles.loginFormButton} type="submit">
              Log in
            </DynamicButton>
          </div>
        </form>
      </div>
      <DynamicButton
        as="link"
        href="/signup"
        className={styles.loginPageSwitchAuthLink}
        variant="tertiary"
        pill
      >
        Need an account?
      </DynamicButton>
    </div>
  );
}
