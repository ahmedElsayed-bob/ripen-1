"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function CalendarComponent(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    props.value ? new Date(props.value) : undefined
  );

  React.useEffect(() => {
    setDate(props.value ? new Date(props.value) : undefined);
  }, [props.value]);

  const handleChange = (date: Date | undefined) => {
    if (date) {
      const isoDate = date.toISOString();
      props.onChange(isoDate);
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="date" className="text-xs">
        Planing date
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              handleChange(date);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
