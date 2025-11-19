import {
  useState,
  useRef,
  useCallback,
  CSSProperties,
  MouseEvent,
  ReactNode,
  ForwardedRef,
  forwardRef,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
} from "react";
import Link from "next/link";
import styles from "./DynamicButton.module.css";

// Ripple Type
interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

// Base Props
interface BaseDynamicButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "tertiary";
  pill?: boolean;
  className?: string;
  style?: CSSProperties;
  minRippleWidth?: number;
}

// Discriminated Union for Button vs Link
type ButtonSpecificProps = {
  as?: "button";
  href?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
} & Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick" | "className" | "style"
>;

type LinkSpecificProps = {
  as: "link";
  href: string;
  type?: never;
  disabled?: never;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick" | "className" | "style"
>;

// Final Props Type (Discriminated Union)
type DynamicButtonProps = BaseDynamicButtonProps &
  (ButtonSpecificProps | LinkSpecificProps);

// Type Guards
const isLinkProps = (
  props: DynamicButtonProps
): props is BaseDynamicButtonProps & LinkSpecificProps => {
  return props.as === "link" && !!props.href;
};

function DynamicButtonInner(
  props: DynamicButtonProps,
  ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>
) {
  const {
    children,
    variant = "primary",
    pill = false,
    className,
    style: overrideStyles,
    minRippleWidth = 130,
    ...restProps
  } = props;

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const internalRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(
    null
  );

  // Merge external ref with internal ref
  const setRefs = useCallback(
    (node: HTMLButtonElement | HTMLAnchorElement | null) => {
      internalRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  // Ripple Effect Logic
  const triggerRippleEffect = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if (!internalRef.current) return;

      const rect = internalRef.current.getBoundingClientRect();
      let size = Math.max(rect.width, rect.height);

      if (rect.width < minRippleWidth) {
        size = Math.max(minRippleWidth, rect.height);
      }

      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple: Ripple = {
        id: Date.now() + Math.random(),
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, newRipple]);
    },
    [minRippleWidth]
  );

  const handleRippleEnd = useCallback((id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  }, []);

  // Click Handler with proper typing
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      if ("disabled" in props && props.disabled) return;

      triggerRippleEffect(e);

      if (props.onClick) {
        // Type-safe onClick based on discriminated union
        if (isLinkProps(props)) {
          (props.onClick as (e: MouseEvent<HTMLAnchorElement>) => void)(
            e as MouseEvent<HTMLAnchorElement>
          );
        } else {
          (props.onClick as (e: MouseEvent<HTMLButtonElement>) => void)(
            e as MouseEvent<HTMLButtonElement>
          );
        }
      }
    },
    [props, triggerRippleEffect]
  );

  // Class Name Construction
  const buttonClassName = [
    styles.dynamicButton,
    styles[variant],
    pill && styles.pill,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Ripple Elements
  const rippleElements = ripples.map((ripple) => (
    <span
      key={ripple.id}
      className={styles.ripple}
      style={{
        width: ripple.size,
        height: ripple.size,
        top: ripple.y,
        left: ripple.x,
      }}
      onAnimationEnd={() => handleRippleEnd(ripple.id)}
    />
  ));

  // Conditional Rendering (Link vs Button)
  if (isLinkProps(props)) {
    const {
      as,
      href,
      onClick: _,
      ...linkProps
    } = restProps as Omit<LinkSpecificProps, keyof BaseDynamicButtonProps>;
    return (
      <Link
        href={href}
        className={buttonClassName}
        style={overrideStyles}
        onClick={handleClick as (e: MouseEvent<HTMLAnchorElement>) => void}
        ref={setRefs as (node: HTMLAnchorElement | null) => void}
        {...linkProps}
      >
        {children}
        {rippleElements}
      </Link>
    );
  }

  const {
    as: _as,
    type = "button",
    disabled = false,
    onClick: _onClick,
    ...buttonProps
  } = restProps as Omit<ButtonSpecificProps, keyof BaseDynamicButtonProps>;

  return (
    <button
      type={type}
      disabled={disabled}
      className={buttonClassName}
      style={overrideStyles}
      onClick={handleClick as (e: MouseEvent<HTMLButtonElement>) => void}
      ref={setRefs as (node: HTMLButtonElement | null) => void}
      {...buttonProps}
    >
      {children}
      {rippleElements}
    </button>
  );
}

// Export with forwardRef
const DynamicButton = forwardRef(DynamicButtonInner);
DynamicButton.displayName = "DynamicButton";

export default DynamicButton;
export type { DynamicButtonProps };
