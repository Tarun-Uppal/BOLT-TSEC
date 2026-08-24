import {
  Laptop,
  Smartphone,
  Headphones,
  Wind,
  Tv,
  Camera,
  Watch,
  Tablet,
  Refrigerator,
  Microwave,
  WashingMachine,
  Gamepad2,
  Speaker,
  Keyboard,
  Mouse,
  Monitor,
  Lightbulb,
  Disc,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  Smartphone,
  Headphones,
  Wind,
  Tv,
  Camera,
  Watch,
  Tablet,
  Refrigerator,
  Microwave,
  WashingMachine,
  Gamepad2,
  Speaker,
  Keyboard,
  Mouse,
  Monitor,
  Lightbulb,
  Disc,
};

export function ProductIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Laptop;
  return <Icon className={className} strokeWidth={1.75} />;
}
