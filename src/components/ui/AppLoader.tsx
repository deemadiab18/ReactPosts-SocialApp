import { Rings } from "react-loader-spinner";

type AppLoaderProps = {
  size?: number;
  color?: string;
  /** Two+ colors give a gradient / multi-ring look on the Rings spinner. */
  colors?: string[];
  ariaLabel?: string;
  wrapperClass?: string;
};

const BRAND_RING_COLORS = ["var(--color-brand-300)", "var(--color-brand-600)"] as const;

export default function AppLoader({
  size = 64,
  color = "var(--color-brand-500)",
  colors = [...BRAND_RING_COLORS],
  ariaLabel = "loading",
  wrapperClass,
}: AppLoaderProps) {
  return (
    <Rings
      height={size}
      width={size}
      color={color}
      colors={colors}
      visible
      ariaLabel={ariaLabel}
      wrapperClass={wrapperClass}
    />
  );
}