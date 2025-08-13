import { FC } from "react";
import _ from "lodash";
import classNames from "@/utils/classnames";
import wrapImage from "@/utils/wrap-image";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  disabled?: boolean;
  fitStyle?: "cover" | "contain";
}

const Avatar: FC<AvatarProps> = ({
  src,
  alt,
  size = "sm",
  disabled,
  fitStyle = "cover",
}) => {
  if (src?.length) {
    return !disabled ? (
      wrapImage(
        <img
          className={classNames(
            size === "sm" ? "h-10 w-10 " : "",
            size === "md" ? "h-14 w-14 " : "",
            size === "lg" ? "h-20 w-20 " : "",
            size === "xl" ? "h-28 w-28 " : "",
            size === "2xl" ? "h-36 w-36" : "",
            "rounded-full z-0",
            fitStyle === "contain" ? "object-contain" : "object-cover"
          )}
          src={src}
          alt={alt}
        />
      )
    ) : (
      <img
        className={classNames(
          size === "sm" ? "h-10 w-10 " : "",
          size === "md" ? "h-14 w-14 " : "",
          size === "lg" ? "h-20 w-20 " : "",
          size === "xl" ? "h-28 w-28 " : "",
          size === "2xl" ? "h-36 w-36" : "",
          "rounded-full  z-0",
          fitStyle === "contain" ? "object-contain" : "object-cover"
        )}
        src={src}
        alt={alt}
      />
    );
  }
  return (
    <div
      className={classNames(
        size === "sm" ? "h-10 w-10 " : "",
        size === "md" ? "h-14 w-14 " : "",
        size === "lg" ? "h-20 w-20 " : "",
        size === "xl" ? "h-28 w-28 " : "",
        "rounded-full flex items-center justify-center bg-[#111] text-white select-none"
      )}
    >
      <span
        className={classNames(
          size === "sm" ? "text-xs " : "",
          size === "md" ? "text-base " : "",
          size === "lg" ? "text-2xl " : "",
          size === "xl" ? "text-4xl " : "",
          "font-poppins select-none"
        )}
      >
        {_.chain(alt)
          .split(" ")
          .slice(0, 2)
          .map((s) => s.charAt(0))
          .join("")
          .upperCase()
          .value()}
      </span>
    </div>
  );
};

export default Avatar;
