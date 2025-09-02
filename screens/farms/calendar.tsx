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
import { ArrowDown, CalendarIcon, ChevronDown } from "lucide-react";

export function CalendarComponent(props: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
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
      {!!props.label && (
        <Label htmlFor="date" className="text-xs">
          {props.label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon />
              {date ? date.toISOString().split("T")[0] : "Select date"}
              {/* {date ? date.toLocaleDateString() : "Select date"} */}
            </div>
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
