import type { JSX } from 'react';
import { SvgIcon } from './SvgIcon';
import { ICON_PATHS } from './paths';

interface IconProps {
  size: number;
  color: string;
}

export type { IconProps };

export function CloseIcon({ size, color }: IconProps): JSX.Element {
  return <SvgIcon size={size} color={color} paths={ICON_PATHS.x} />;
}

export function PlusIcon({ size, color }: IconProps): JSX.Element {
  return <SvgIcon size={size} color={color} paths={ICON_PATHS.plus} />;
}

export function ChevronUpIcon({ size, color }: IconProps): JSX.Element {
  return <SvgIcon size={size} color={color} paths={ICON_PATHS.chevronUp} />;
}

export function ChevronLeftIcon({ size, color }: IconProps): JSX.Element {
  return <SvgIcon size={size} color={color} paths={ICON_PATHS.chevronLeft} />;
}

export function ChatBubbleIcon({ size, color }: IconProps): JSX.Element {
  return <SvgIcon size={size} color={color} paths={ICON_PATHS.messageCircle} />;
}

export function SendIcon({ size, color }: IconProps): JSX.Element {
  return <SvgIcon size={size} color={color} paths={ICON_PATHS.send} />;
}
