import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { hoursSince } from "@/lib/utils";
import {
  Thermometer,
  Clock,
  Wheat,
  MapPin,
  TriangleAlert,
  Camera,
  Calendar,
  CloudRainWind,
} from "lucide-react";
import { ReactNode } from "react";

interface Notification {
  title: string;
  color: string;
  icon: ReactNode;
  fieldName: string;
  plotName: string;
  timestamp: number;
}

const notifications: Notification[] = [
  {
    title: "Heatwave expected - High possibility of yield loss",
    color: "#FDE1DA",
    icon: <Thermometer />,
    fieldName: "Al Dhafra Wheat Field",
    plotName: "A3",
    timestamp: 1756755885000,
  },
  {
    title: "Crop stress detected - High possibility of yield loss",
    color: "rgba(255, 177, 82, 0.24)",
    icon: <TriangleAlert />,
    fieldName: "Al Dhafra Wheat Field",
    plotName: "B6",
    timestamp: 1756755885000,
  },
  {
    title: "Capture in - Field picture",
    color: "rgba(33, 45, 69, 0.24)",
    icon: <Camera />,
    fieldName: "Al Dhafra Wheat Field",
    plotName: "B6",
    timestamp: 1756745484000,
  },
  {
    title: "Update labor shifts for cool weather",
    color: "rgba(13, 130, 107, 0.24)",
    icon: <Calendar />,
    fieldName: "Al Dhafra Wheat Field",
    plotName: "B6",
    timestamp: 1756725885000,
  },
  {
    title: "Crop stress detected - High possibility of yield loss",
    color: "#FDE1DA",
    icon: <CloudRainWind />,
    fieldName: "Al Dhafra Wheat Field",
    plotName: "A2",
    timestamp: 1756655885000,
  },
];

export default function NotificationsScreen() {
  return (
    <div>
      <div className="container mx-auto border-b border-[#f5f2f0] py-4 mb-4">
        <Breadcrumb className="mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-2xl font-bold mb-1">Notifications & Alerts</h1>
        <p className="text-sm text-gray-500">
          Never miss critical updates about your crops, get instant
          notifications and stay updated.
        </p>
      </div>

      <div className="container flex flex-1 mx-auto w-full pt-12 pl-24 pr-[120px]">
        <div className="flex flex-col gap-1 border rounded-2xl w-full p-3">
          {notifications.map(
            ({ title, color, icon, fieldName, plotName, timestamp }, idx) => {
              return (
                <div
                  key={idx}
                  className="flex flex-row gap-3.5 h-[62px] border border-[#E8E2DB] rounded-[8px] p-2 hover:bg-[#CAE8E4] hover:border-[#0D826B]"
                >
                  <div
                    className="flex justify-center items-center w-11 rounded-[8px]"
                    style={{ backgroundColor: color }}
                  >
                    {icon}
                  </div>
                  <div className="flex flex-1 flex-col justify-around">
                    <div className="text-[#09090B] text-sm">{title}</div>
                    <div className="flex flex-row gap-6 text-[#6B6661] text-xs">
                      <div className="flex flex-row gap-1">
                        <span>
                          <Wheat size={18} />
                        </span>
                        <span>{fieldName}</span>
                      </div>
                      <div className="flex flex-row gap-1">
                        <span>
                          <MapPin size={18} />
                        </span>
                        <span>{plotName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-0 flex-row gap-1 items-start text-[#6B6661] text-xs whitespace-nowrap">
                    <span>
                      <Clock size={18} />
                    </span>
                    <span className="leading-[18px]">
                      {hoursSince(timestamp)}h ago
                    </span>
                  </div>
                </div>
              );
            }
          )}
          {/**notification unit below */}
        </div>
      </div>
    </div>
  );
}
