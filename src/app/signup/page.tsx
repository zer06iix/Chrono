"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { toast } from "sonner";
import { Icon } from "../../components/icons/icon";
import DynamicButton from "../../components/DynamicButton";
import DynamicInput from "../../components/DynamicInput";
import ReturnButton from "../../components/ReturnButton";
import styles from "./page.module.css";

export default function SignupPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const isValidSignup =
      email === "test@example.com" && password === "password";

    if (isValidSignup) {
      toast.success("Signed up successfully");
      console.log("Email:", email);
      console.log("Password:", password);
    } else {
      toast.error("Signup failed. Try test@example.com / password");
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    toast("Form reset");
  };

  const handleGoogleSignup = () => {
    toast("Google signup clicked");
  };

  const handleGitHubSignup = () => {
    toast("GitHub signup clicked");
  };

  return (
    <div className={`layout__container ${styles.layoutContainerSignupPage}`}>
      <ReturnButton />
      <div className={styles.signupContainer}>
        <h1 className={styles.signupTitle}>Signup</h1>

        <div className={styles.signupContainerSocialLinks}>
          <DynamicButton
            className={`${styles.signupContainerSocialLinksGoogle} social-auth-button`}
            variant="primary"
            onClick={handleGoogleSignup}
          >
            <Icon name="socialGoogle" />
            <p className="label">Google</p>
          </DynamicButton>

          <DynamicButton
            className={`${styles.signupContainerSocialLinksGithub} social-auth-button`}
            variant="primary"
            onClick={handleGitHubSignup}
          >
            <Icon name="socialGithub" />
            <p className="label">GitHub</p>
          </DynamicButton>
        </div>

        <div className={styles.signupContainerSeparator}>
          <div className={styles.signupContainerSeparatorLine}></div>
          <div className={styles.signupContainerSeparatorLabel}>
            or use your email
          </div>
        </div>

        <form className={styles.signupForm} onSubmit={handleSubmit} noValidate>
          <div className={styles.signupFormGroup}>
            <DynamicInput
              className={styles.signupInput}
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
              className={styles.signupInput}
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />

            <DynamicInput
              className={styles.signupInput}
              type="password"
              id="confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          <div className={styles.signupFormActions}>
            <DynamicButton
              className={styles.signupFormButton}
              type="reset"
              variant="secondary"
              onClick={handleReset}
            >
              Reset
            </DynamicButton>

            <DynamicButton className={styles.signupFormButton} type="submit">
              Sign up
            </DynamicButton>
          </div>
        </form>
      </div>
      <DynamicButton
        as="link"
        href="/login"
        className={styles.signupPageSwitchAuthLink}
        variant="tertiary"
        pill
      >
        Already have an account?
      </DynamicButton>
    </div>
  );
}
