import { Button } from 'antd';

import Icon from '@/lib/icons';

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
}

export default function QuantityStepper({
  value,
  min = 1,
  max = 10,
  onChange,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-line bg-surface p-1">
      <Button
        type="text"
        size="small"
        icon={<Icon name="decrement" />}
        disabled={value <= min}
        aria-label="Decrease quantity"
        onClick={() => onChange(value - 1)}
      />
      <span className="w-8 text-center text-sm font-semibold tabular-nums text-ink">{value}</span>
      <Button
        type="text"
        size="small"
        icon={<Icon name="increment" />}
        disabled={value >= max}
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
      />
    </div>
  );
}
