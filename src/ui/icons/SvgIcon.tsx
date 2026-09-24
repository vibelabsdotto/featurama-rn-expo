/* eslint-disable @typescript-eslint/no-require-imports */
import type { JSX } from 'react';
const rnSvg = require('react-native-svg');
const Svg = rnSvg.Svg ?? rnSvg.default;
const Path = rnSvg.Path;

interface SvgIconProps {
  size: number;
  color: string;
  paths: readonly string[];
  strokeWidth?: number;
}

export function SvgIcon({ size, color, paths, strokeWidth = 2 }: SvgIconProps): JSX.Element {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths.map((d: string, i: number) => (
        <Path key={i} d={d} />
      ))}
    </Svg>
  );
}
