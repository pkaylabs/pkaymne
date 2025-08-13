import clsx from "clsx";
import { FC, PropsWithChildren } from "react";
import { wrapClick } from "@/utils";

type Props = {
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  ml?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "tertiary"
    | "danger"
    | "warning"
    | "success"
    | "info"
    | "light"
    | "dark"
    | "link";
  disabled?: boolean;
  width?: "full" | "auto";
  type?: "button" | "submit" | "reset";
  className?: string;
};

const Button: FC<PropsWithChildren<Props>> = ({
  children,
  onClick,
  disabled,
  type,
  ml,
  size = "md",
  variant = "primary",
  width = "auto",
  className,
}) => {
  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      onClick={wrapClick(() => onClick?.())}
      className={clsx(
        "rounded-xl border border-transparent  disabled:cursor-not-allowed text-base font-bold leading-4 text-white shadow-sm w-full text-center flex items-center justify-center transition-all duration-200 ease-in-out",
        {
          "text-sm leading-4 font-medium": size === "sm",
          "text-base leading-6 font-medium": size === "md",
          "text-lg leading-6 font-medium": size === "lg",
          "bg-primary-500 focus:ring-primary-500 hover:bg-primary-600":
            variant === "primary",
          "bg-yellow-600 focus:ring-yellow-500 hover:bg-yellow-700":
            variant === "warning",
          "bg-teal-600 focus:ring-teal-500 hover:bg-teal-700":
            variant === "success",
          "bg-gray-600 focus:ring-gray-500 hover:bg-gray-700":
            variant === "tertiary",
          "bg-red-600 focus:ring-red-500 hover:bg-red-700":
            variant === "danger",
          "w-full md:w-full justify-center": width === "full",
          "md:ml-2": ml,
          [className ?? ""]: className,
        }
      )}
    >
      {children}
    </button>
  );
};

export default Button;
