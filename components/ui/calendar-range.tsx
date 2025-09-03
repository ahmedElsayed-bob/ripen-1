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
import { CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";

export function CalendarRangeComponent(props: {
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => {
      if (props.value) {
        try {
          // Parse the value assuming it's in format "startDate,endDate" or single date
          const dates = props.value.split(",");
          if (dates.length === 2) {
            return {
              from: new Date(dates[0]),
              to: new Date(dates[1]),
            };
          } else if (dates.length === 1) {
            const date = new Date(dates[0]);
            return {
              from: date,
              to: date,
            };
          }
        } catch (error) {
          console.warn("Invalid date format:", props.value);
        }
      }
      return undefined;
    }
  );

  React.useEffect(() => {
    if (props.value) {
      try {
        const dates = props.value.split(",");
        if (dates.length === 2) {
          setDateRange({
            from: new Date(dates[0]),
            to: new Date(dates[1]),
          });
        } else if (dates.length === 1) {
          const date = new Date(dates[0]);
          setDateRange({
            from: date,
            to: date,
          });
        }
      } catch (error) {
        console.warn("Invalid date format:", props.value);
        setDateRange(undefined);
      }
    } else {
      setDateRange(undefined);
    }
  }, [props.value]);

  const handleChange = (range: DateRange | undefined) => {
    setDateRange(range);
    console.log(range);
    if (range?.from) {
      if (range.to && range.from.getTime() !== range.to.getTime()) {
        // Range with different start and end dates
        const startDate = range.from.toISOString();
        const endDate = range.to.toISOString();
        props.onChange(`${startDate},${endDate}`);
      } else {
        // Single date or range with same start/end
        const singleDate = range.from.toISOString();
        props.onChange(singleDate);
      }

      // Close popover when range is complete
      if (range.from != range.to) {
        setOpen(false);
      }
    }
  };

  const formatDateRange = (range: DateRange | undefined): string => {
    if (!range?.from) return "Select date range";

    const fromDate = range.from.toLocaleDateString().split("T")[0];

    if (!range.to || range.from.getTime() === range.to.getTime()) {
      return fromDate;
    }

    const toDate = range.to.toLocaleDateString().split("T")[0] + 1;
    return `${fromDate} - ${toDate}`;
  };

  return (
    <div className="flex flex-col w-full gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-full justify-between font-normal"
          >
            <div className="flex items-center gap-2">
              <CalendarIcon />
              {formatDateRange(dateRange)}
            </div>
            <ChevronDown />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={dateRange}
            captionLayout="dropdown"
            onSelect={handleChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
