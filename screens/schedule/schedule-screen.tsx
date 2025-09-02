"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { startOfWeek, endOfWeek } from "date-fns";

interface Event {
  day: string;
  source: string;
  text: string;
}

export default function ScheduleScreen() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekDays, setWeekDays] = useState<string[]>([]);

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const result = [];

    const current = new Date(start);

    while (current <= new Date(end)) {
      const dayName = days[current.getDay()];
      const dayNumber = current.getDate();
      result.push(`${dayName} ${dayNumber}`);

      // move to next day
      current.setDate(current.getDate() + 1);
    }

    setWeekDays(result);
  }, [selectedDate]);

  // Predefined data: { day, source, text }
  const events: Event[] = [
    {
      day: "TUE 2",
      source: "B2",
      text: "QC walk & flag access lanes (Scout)\nStake headland markers (Ops)",
    },
    { day: "WED 3", source: "B3", text: "QC Sampling at mid-field (Scout)" },
    {
      day: "THU 4",
      source: "B6",
      text: "QC walk & flag access lanes (Scout)\nStake headland markers (Ops)",
    },
    {
      day: "TUE 2",
      source: "B5",
      text: "QC walk & flag access lanes (Scout)\nStake headland markers (Ops)",
    },
    { day: "SAT 6", source: "B5", text: "QC Sampling at mid-field (Scout)" },
  ];

  const sources = ["B1", "B2", "B3", "B4", "B5", "B6", "B7"];

  // Helper to find event text by day/source
  const getEvent = (day: string, source: string) => {
    const ev = events.find((e) => e.day === day && e.source === source);
    return ev ? ev.text : "";
  };

  return (
    <>
      <div className="border-b border-[#f5f2f0] py-4 mb-4">
        <div className="container mx-auto">
          <PageBreadcrumb />

          <h1 className="text-2xl font-bold mb-1">Schedule Management</h1>
          <p className="text-sm text-gray-500">
            Track crop conditions and assess field readiness for optimal
            harvest.
          </p>
        </div>
      </div>
      <div className="flex flex-row w-full justify-between gap-6 pt-12 pl-24 pr-[120px]">
        <div className="flex flex-col flex-1 p-4 border rounded-2xl gap-5">
          <div className="flex justify-between">
            <p className="text-xl font-semibold text-[#212D45]">
              Calendar & Tasks
            </p>
            <input
              className="border p-2 rounded-2xl"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th></th>
                {weekDays.map((day) => (
                  <th
                    key={day}
                    className="border border-t-0 border-l-0 border-gray-300 p-2 text-center w-28"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sources.map((src) => (
                <tr key={src} className="max-h-14 h-14">
                  <td className="border-gray-300 p-2 font-semibold w-0">
                    {src}
                  </td>
                  {weekDays.map((day) => {
                    const event = getEvent(day, src);
                    const cellClassName = classNames(
                      "border border-gray-300 align-middle border-l-0",
                      {
                        "bg-green-100": event,
                      }
                    );
                    return (
                      <td key={day + src} className={cellClassName}>
                        {event ? (
                          <div className="h-14 overflow-auto text-[8px] leading-3 whitespace-pre-line text-green-900 rounded p-1">
                            {event}
                          </div>
                        ) : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="min-w-72 w-72 overflow-auto">
          CARDS CARDS CARDS CARDS CARDS CARDS CARDS CARDS CARDS CARDS CARDS
          CARDS CARDS
        </div>
      </div>
    </>
  );
}

function PageBreadcrumb() {
  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Schedule Management</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
