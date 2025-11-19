import { ComponentType, SVGProps } from "react";
import { SocialGithub, SocialGoogle, BackSquare } from "./index";

// Define icon prop types
interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  className?: string;
  color1?: string;
  color2?: string;
}

// Registry with both PascalCase and camelCase keys
const icons: Record<string, ComponentType<any>> = {
  // PascalCase
  SocialGithub,
  SocialGoogle,
  BackSquare,
  // camelCase aliases
  socialGithub: SocialGithub,
  socialGoogle: SocialGoogle,
  backSquare: BackSquare,
};

// Kebab-case converter
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

export const Icon = ({
  name,
  size = 24,
  className = "",
  ...props
}: IconProps) => {
  const Component = icons[name];

  if (!Component) {
    console.warn(
      `Icon "${name}" not found. Available: ${Object.keys(icons).join(", ")}`
    );
    return null;
  }

  const kebabName = toKebabCase(name);
  const autoClass = `icon icon--${kebabName}`;
  const combinedClass = `${autoClass} ${className}`.trim();

  return (
    <Component
      width={size}
      height={size}
      className={combinedClass}
      aria-hidden="true"
      {...props}
    />
  );
};

// Get all available icon names
export const iconNames = Object.keys(icons);
