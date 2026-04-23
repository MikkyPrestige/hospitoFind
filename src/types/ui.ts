export type Variant = "card" | "list" | "image" | "text" | "dropdown";

export interface AnimatedLoaderProps {
    message?: string;
    variant?: Variant;
    count?: number;
    delayStep?: number;
    showImage?: boolean;
    imageHeight?: number;
    showButtons?: boolean;
}

export interface AvatarProps {
  image?: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
}

export type ButtonProps = {
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export interface SectionLoaderProps {
    message?: string;
    variant?: Variant;
    count?: number;
}

export type ErrorFallbackProps = {
  error ?: Error;
  resetErrorBoundary ?: () => void;
};