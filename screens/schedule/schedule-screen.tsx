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
import { useEffect, useMemo, useState } from "react";
import { startOfWeek, endOfWeek } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tractor, ChevronDown, UserCircle } from "lucide-react";
import Select from "react-select";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "react-hot-toast";
import { getFarmById } from "@/lib/storage";

const membersOptions = [
  { value: "Hanan Al-Mansoori", label: "Hanan Al-Mansoori" },
  { value: "Hani Al-Sabah", label: "Hani Al-Sabah" },
  { value: "Khaled Saeed", label: "Khaled Saeed" },
  { value: "Hana Al-Jabari", label: "Hana Al-Jabari" },
];

const roleOptions = [
  { value: "member", label: "Member" },
  { value: "supervisor", label: "Supervisor" },
];

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface Option {
  label: string;
  action: () => void;
}
const dropdownOptions: Option[] = [
  { label: "Settings", action: () => console.log("Settings clicked") },
  { label: "Manage Teams", action: () => console.log("Manage Teams clicked") },
  { label: "Help & Support", action: () => console.log("Help clicked") },
  { label: "Sign Out", action: () => console.log("Sign Out clicked") },
];

interface Event {
  day: string;
  source: string;
  text: string;
}

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

export default function ScheduleScreen({ id }: { id?: string }) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [selectedMembers, setselectedMembers] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>();
  const [isCrewDropdownOpen, setIsCrewDropdownOpen] = useState(false);
  const [showEvents, setShowEvents] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date>();
  const [shiftLength, setShiftLength] = useState(0);
  const [shiftsPerDay, setShiftsPerDay] = useState(0);
  const [hourlyWage, setHourlyWage] = useState(0);

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
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

  // Helper to find event text by day/source
  const getEvent = (day: string, source: string) => {
    const ev = events.find((e) => e.day === day && e.source === source);
    return ev ? ev.text : "";
  };

  const resetCrewBuilder = () => {
    setselectedMembers([]);
    setSelectedRole(undefined);
  };

  const resetAssumptions = () => {
    setSelectedTime(undefined);
    setShiftLength(0);
    setShiftsPerDay(0);
    setHourlyWage(0);
  };

  const handleDropdownToggle = () => {
    setIsCrewDropdownOpen((prev) => !prev);
  };

  const handleOptionClick = (option: Option) => {
    option.action();
    setIsCrewDropdownOpen(false);
  };

  return (
    <>
      <Toaster
        position="bottom-center"
        reverseOrder={false} // newest toast on top
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0D826B", // background color
            color: "#fff", // text color
            fontSize: "16px", // font size
            padding: "12px 20px", // padding
            borderRadius: "8px", // rounded corners
            boxShadow: "0 2px 10px rgba(0,0,0,0.3)", // shadow
          },
        }}
      />
      <div className="border-b border-[#f5f2f0] py-4 mb-4">
        <div className="container mx-auto">
          <PageBreadcrumb id={id} />

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
                        "bg-green-100": event && showEvents,
                      }
                    );
                    return (
                      <td key={day + src} className={cellClassName}>
                        {event && showEvents ? (
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
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              id="assign"
              className="justify-between font-normal"
              onClick={() => {
                setShowEvents(true);
              }}
            >
              Auto Plan
            </Button>
            <Button
              variant="outline"
              id="assign"
              className="justify-between font-normal"
              onClick={() => {
                setShowEvents(false);
              }}
            >
              Reset
            </Button>
            <Button
              variant="default"
              id="assign"
              className="bg-[#0D826B] justify-between font-normal"
              disabled={!showEvents}
              onClick={() => {
                toast.success("Schedule Published!");
                resetCrewBuilder();
                resetAssumptions();
                setShowEvents(false);
              }}
            >
              Publish
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-5 min-w-72 w-72 overflow-auto">
          <Card className="py-4 gap-3 shadow-lg">
            <CardHeader className="px-4 items-center">
              <CardTitle className="flex items-center gap-2">
                <UserCircle size={20} />
                <p>Crew Builder</p>
              </CardTitle>
              <CardAction>
                <button
                  onClick={handleDropdownToggle}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      isCrewDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isCrewDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    {dropdownOptions.map((option, index) => {
                      return (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        >
                          <span className="text-sm">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </CardAction>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Select
                styles={{
                  control: (styles) => ({
                    ...styles,
                    borderRadius: 8,
                    borderColor: "rgba(115, 110, 104, 0.30)",
                  }),
                }}
                isMulti // This enables tokenization
                value={selectedMembers}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                onChange={setselectedMembers}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                options={membersOptions}
                placeholder="Start typing names"
                isSearchable
              />
              <div>
                <p className="m-2">Group role</p>
                <Select
                  value={selectedRole || ""}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  onChange={setSelectedRole}
                  styles={{
                    control: (styles) => ({
                      ...styles,
                      borderRadius: 8,
                      borderColor: "rgba(115, 110, 104, 0.30)",
                    }),
                  }}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-expect-error
                  options={roleOptions}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-end gap-2">
              <Button
                variant="outline"
                id="reset"
                className="justify-between font-normal"
                onClick={() => {
                  resetCrewBuilder();
                }}
              >
                Reset
              </Button>
              <Button
                variant="default"
                id="assign"
                className="bg-[#0D826B] justify-between font-normal"
                disabled={selectedMembers.length == 0 || !selectedRole}
                onClick={() => {
                  resetCrewBuilder();
                  toast.success("New crew members assigned!");
                }}
              >
                Assign
              </Button>
            </CardFooter>
          </Card>
          <Card className="py-4 gap-3 shadow-lg">
            <CardHeader className="px-4">
              <CardTitle className="flex items-center gap-2">
                <Tractor size={20} />
                <p>Assumptions & Constraints</p>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateRangePicker />
              </LocalizationProvider> */}
              <div className="flex justify-between text-[14px] text-gray-400 items-center">
                <span>Shift start time</span>
                <input
                  className="text-black border p-2 rounded-[8px]"
                  type="time"
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={selectedTime || ""}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>

              <div className="flex justify-between text-[14px] text-gray-400 items-center">
                <span>Shift Length</span>
                <input
                  type="number"
                  value={shiftLength}
                  onChange={(e) => setShiftLength(Number(e.target.value))}
                  // placeholder={placeholder}
                  className="bg-transparent text-right text-lg font-semibold text-gray-800 border-none outline-none w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                />
                <span>hours</span>
              </div>
              <div className="flex justify-between text-[14px] text-gray-400 items-center">
                <span>Shifts per day</span>
                <input
                  type="number"
                  value={shiftsPerDay}
                  onChange={(e) => setShiftsPerDay(Number(e.target.value))}
                  // placeholder={placeholder}
                  className="bg-transparent text-right text-lg font-semibold text-gray-800 border-none outline-none w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                />
              </div>
              <div className="flex justify-between text-[14px] text-gray-400 items-center">
                <span>Hourly wage</span>
                <span>$</span>
                <input
                  type="number"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  // placeholder={placeholder}
                  className="bg-transparent text-right text-lg font-semibold text-gray-800 border-none outline-none w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  min="0"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-row justify-end gap-2">
              <Button
                variant="outline"
                id="reset"
                className="justify-between font-normal"
                onClick={() => {
                  resetAssumptions();
                }}
              >
                Reset
              </Button>
              <Button
                variant="default"
                id="assign"
                className="bg-[#0D826B] justify-between font-normal"
                disabled={selectedTime == undefined}
                onClick={() => {
                  resetAssumptions();
                  toast.success("Assumptions & Constraints saved!");
                }}
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}

function PageBreadcrumb({ id }: { id?: string }) {
  const farmName = useMemo(() => {
    if (!id) return "";
    return getFarmById(id as string)?.name;
  }, [id]);

  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/fields/dashboards">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {!!id && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/fields">Fields</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/fields/${id}`}>{farmName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbPage>Schedule Management</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
