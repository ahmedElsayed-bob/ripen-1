"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface CenteredSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  className?: string;
  centerValue?: number;
}

function CenteredSlider({
  className,
  defaultValue,
  value,
  min = -10,
  max = 10,
  centerValue = 0,
  ...props
}: CenteredSliderProps) {
  const currentValue = React.useMemo(() => {
    if (Array.isArray(value) && value.length > 0) return value[0];
    if (Array.isArray(defaultValue) && defaultValue.length > 0)
      return defaultValue[0];
    return centerValue;
  }, [value, defaultValue, centerValue]);

  // Calculate the range fill based on center value
  const rangeStyle = React.useMemo(() => {
    const totalRange = max - min;
    const centerPosition = ((centerValue - min) / totalRange) * 100;
    const currentPosition = ((currentValue - min) / totalRange) * 100;

    if (currentValue >= centerValue) {
      // Fill from center to right
      return {
        left: `${centerPosition}%`,
        width: `${currentPosition - centerPosition}%`,
      };
    } else {
      // Fill from left to center
      return {
        left: `${currentPosition}%`,
        width: `${centerPosition - currentPosition}%`,
      };
    }
  }, [currentValue, centerValue, min, max]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        {/* Custom range that fills from center */}
        <div
          className="bg-[#12A789] absolute h-full rounded-full"
          style={rangeStyle}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className="border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  );
}

export { CenteredSlider };
