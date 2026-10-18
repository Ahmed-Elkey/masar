import { ICON, type IconName } from "@/lib/icons";

export function Icon({ name, size = 24, sw = 1.8 }: { name: IconName; size?: number; sw?: number }) {
  return (
    <svg
      className={name==="chevronLeft"||name==="chevronRight"?"directional-icon":undefined}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICON[name]} />
    </svg>
  );
}
